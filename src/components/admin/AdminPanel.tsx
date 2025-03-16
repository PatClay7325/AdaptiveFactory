import React, { useState, useEffect } from 'react';
import { supabase } from '../../configs/supabaseClient';

const AdminPanel: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch profiles for all users
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      setUsers(data || []);
    } catch (error: any) {
      console.error('Error fetching users:', error);
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-panel">
      <h2>Admin Panel</h2>
      <p>Welcome to the admin panel. As an administrator, you have access to manage users and system settings.</p>
      
      <div className="admin-section">
        <h3>User Management</h3>
        
        {error && <p className="error">{error}</p>}
        
        {loading ? (
          <p>Loading users...</p>
        ) : (
          <table className="users-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Name</th>
                <th>Role</th>
                <th>Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={4}>No users found.</td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.username || '-'}</td>
                    <td>
                      {user.first_name || user.firstName} {user.last_name || user.lastName}
                    </td>
                    <td>
                      <span className={`role-badge ${user.role || 'user'}`}>
                        {user.role || 'User'}
                      </span>
                    </td>
                    <td>{new Date(user.updated_at).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
      
      <div className="admin-section">
        <h3>System Settings</h3>
        <p>System configuration and settings will be implemented here.</p>
      </div>
    </div>
  );
};

export default AdminPanel;