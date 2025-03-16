import React, { useState } from 'react';
import { supabase } from '../../configs/supabaseClient';

const Auth: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            firstName: '',
            lastName: '',
            role: 'user',  // Default role for new users
          }
        }
      });
      
      if (error) throw error;
      alert('Check your email for the login link!');
    } catch (error: any) {
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      // Successfully signed in
    } catch (error: any) {
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="form-widget">
        <h1 className="header">AI Manufacturing</h1>
        <p className="description">Sign in with your email and password</p>
        <form className="form-widget">
          <div>
            <input
              className="inputField"
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <input
              className="inputField"
              type="password"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <button
              onClick={handleSignIn}
              className="button block"
              disabled={loading}
            >
              {loading ? 'Loading' : 'Sign In'}
            </button>
          </div>
          <div>
            <button
              onClick={handleSignUp}
              className="button block secondary"
              disabled={loading}
            >
              {loading ? 'Loading' : 'Sign Up'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Auth;