import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(() => localStorage.getItem('adminToken'));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Initialize authentication state on first render
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 > Date.now()) {
          setAuthToken(token);
          setIsAuthenticated(true);
        } else {
          // Token expired, clear it
          localStorage.removeItem('adminToken');
        }
      } catch (err) {
        localStorage.removeItem('adminToken');
        setError(err);
      }
    }
  }, []);

  const login = (token) => {
    try {
      localStorage.setItem('adminToken', token);
      setAuthToken(token);
      setIsAuthenticated(true);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err);
      console.error("Login error:", err);
    }
  };
  const logout = async () => {
    try {
      // First remove token from storage
      localStorage.removeItem('adminToken');
      
      // Then update states
      setAuthToken(null);
      setIsAuthenticated(false);
      
      // Force a navigation to login with replace
      navigate('/admin/login', { replace: true });
      
      // Optional: Add a small delay to ensure state is cleared
      await new Promise(resolve => setTimeout(resolve, 50));
      
      // Force navigation again if needed
      navigate('/admin/login', { replace: true });
    } catch (err) {
      setError(err);
      console.error("Logout error:", err);
    }
  };
  // Check token expiration periodically
  useEffect(() => {
    if (!authToken) return;

    const checkTokenExpiration = () => {
      try {
        const decoded = jwtDecode(authToken);
        if (decoded.exp * 1000 < Date.now()) {
          logout();
        }
      } catch (err) {
        logout();
      }
    };

    // Check immediately
    checkTokenExpiration();
    
    // Then check every minute
    const interval = setInterval(checkTokenExpiration, 60000);
    return () => clearInterval(interval);
  }, [authToken]);

  if (error) {
    return <div>Authentication Error: {error.message}</div>;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, authToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};