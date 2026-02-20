import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginAdmin } from '../api/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('access_token');
    const storedAdmin = localStorage.getItem('admin_data');
    
    if (storedToken && storedAdmin) {
      setToken(storedToken);
      setAdmin(JSON.parse(storedAdmin));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const result = await loginAdmin(email, password);

      if (result.success) {
        const { access_token, token_type, admin_id } = result.data;
        
        // Store in localStorage
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('token_type', token_type);
        localStorage.setItem('admin_id', admin_id);
        localStorage.setItem('admin_data', JSON.stringify({ admin_id, token_type }));

        // Update state
        setToken(access_token);
        setAdmin({ admin_id, token_type });

        return { success: true, data: result.data };
      } else {
        return { success: false, message: result.message };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: error.message };
    }
  };

  const logout = () => {
    // Clear localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('token_type');
    localStorage.removeItem('admin_id');
    localStorage.removeItem('admin_data');

    // Clear state
    setToken(null);
    setAdmin(null);
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ admin, token, loading, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
