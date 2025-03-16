import React, { useState, useEffect } from 'react';
import { supabase } from '../../configs/supabaseClient';
import type { Session, Profile as ProfileType } from '../../configs/supabaseClient';

interface ProfileProps {
  session: Session;
}

const Profile: React.FC<ProfileProps> = ({ session }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [firstName, setFirstName] = useState<string | null>(null);
  const [lastName, setLastName] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [website, setWebsite] = useState<string | null>(null);
  const [avatar_url, setAvatarUrl] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    getProfile();
  }, [session]);

  async function getProfile() {
    try {
      setLoading(true);
      const { user } = session;

      // Get user metadata from session
      const userMeta = user.user_metadata || {};
      setFirstName(userMeta.firstName || '');
      setLastName(userMeta.lastName || '');
      setRole(userMeta.role || 'user');

      let { data, error, status } = await supabase
        .from('profiles')
        .select(`username, website, avatar_url, first_name, last_name, role`)
        .eq('id', user.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUsername(data.username);
        setWebsite(data.website);
        setAvatarUrl(data.avatar_url);
        // Use profile data if available, otherwise fall back to metadata
        setFirstName(data.first_name || userMeta.firstName || '');
        setLastName(data.last_name || userMeta.lastName || '');
        setRole(data.role || userMeta.role || 'user');
      }
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile() {
    try {
      setLoading(true);
      const { user } = session;

      // Update auth metadata
      const { error: metaError } = await supabase.auth.updateUser({
        data: {
          firstName,
          lastName,
          role
        }
      });

      if (metaError) throw metaError;

      // Update profile
      const updates = {
        id: user.id,
        username,
        website,
        avatar_url,
        first_name: firstName,
        last_name: lastName,
        role,
        updated_at: new Date().toISOString(),
      };

      let { error } = await supabase.from('profiles').upsert(updates);

      if (error) {
        throw error;
      }
      
      alert('Profile updated!');
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  const isAdmin = role === 'admin';

  return (
    <div className="profile-container">
      <div className="form-widget">
        <div className="profile-header">
          <h2>{firstName} {lastName}</h2>
          {isAdmin && <span className="admin-badge">Admin</span>}
        </div>
        
        <div>
          <label htmlFor="email">Email</label>
          <input id="email" type="text" value={session.user.email || ''} disabled />
        </div>
        
        <div>
          <label htmlFor="firstName">First Name</label>
          <input
            id="firstName"
            type="text"
            value={firstName || ''}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        
        <div>
          <label htmlFor="lastName">Last Name</label>
          <input
            id="lastName"
            type="text"
            value={lastName || ''}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        
        <div>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            value={username || ''}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        
        <div>
          <label htmlFor="website">Website</label>
          <input
            id="website"
            type="url"
            value={website || ''}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </div>

        {isAdmin && (
          <div>
            <label htmlFor="role">Role</label>
            <select 
              id="role" 
              value={role || 'user'} 
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
            </select>
          </div>
        )}

        <div>
          <button
            className="button primary block"
            onClick={() => updateProfile()}
            disabled={loading}
          >
            {loading ? 'Loading ...' : 'Update Profile'}
          </button>
        </div>

        <div>
          <button
            className="button block"
            onClick={() => supabase.auth.signOut()}
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;