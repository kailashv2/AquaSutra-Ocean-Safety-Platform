import React, { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../services/api';

// Create the authentication context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Provider component that wraps the app and makes auth object available to any child component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is already logged in on initial load
  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const data = await authService.login({ email, password });
      setCurrentUser(data.user);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to login');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Signup function
  const signup = async (name, email, password) => {
    try {
      setLoading(true);
      setError(null);
      const data = await authService.signup({ name, email, password });
      setCurrentUser(data.user);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to signup');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Google login function
  const loginWithGoogle = async () => {
    try {
      setLoading(true);
      setError(null);
      // In a real implementation, this would use Firebase, Auth0, or another provider
      // For now, we'll simulate a successful login
      const mockUser = {
        id: 'google-123456',
        name: 'Google User',
        email: 'user@gmail.com',
        provider: 'google'
      };
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Store user in local storage (simulating what authService would do)
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      setCurrentUser(mockUser);
      return { user: mockUser };
    } catch (err) {
      setError(err.message || 'Failed to login with Google');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Facebook login function
  const loginWithFacebook = async () => {
    try {
      setLoading(true);
      setError(null);
      // In a real implementation, this would use Facebook SDK
      // For now, we'll simulate a successful login
      const mockUser = {
        id: 'facebook-123456',
        name: 'Facebook User',
        email: 'user@facebook.com',
        provider: 'facebook'
      };
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Store user in local storage (simulating what authService would do)
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      setCurrentUser(mockUser);
      return { user: mockUser };
    } catch (err) {
      setError(err.message || 'Failed to login with Facebook');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    authService.logout();
    setCurrentUser(null);
  };

  // Value object that will be passed to consumers of this context
  const value = {
    currentUser,
    loading,
    error,
    login,
    signup,
    logout,
    loginWithGoogle,
    loginWithFacebook,
    isAuthenticated: authService.isAuthenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;