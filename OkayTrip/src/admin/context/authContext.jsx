import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(localStorage.getItem('adminToken'));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(null);
  const [isRouterReady, setIsRouterReady] = useState(false);
  const navigate = useNavigate();

  // Initialize router readiness
  useEffect(() => {
    setIsRouterReady(true);
  }, []);

  const login = (token) => {
    try {
      localStorage.setItem('adminToken', token);
      setAuthToken(token);
      setIsAuthenticated(true);
      if (isRouterReady) {
        navigate('/admin/dashboard');
      }
    } catch (err) {
      setError(err);
      console.error("Login error:", err);
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem('adminToken');
      setAuthToken(null);
      setIsAuthenticated(false);
      if (isRouterReady) {
        navigate('/admin/login');
      }
    } catch (err) {
      setError(err);
      console.error("Logout error:", err);
    }
  };

  const checkTokenExpiration = () => {
    try {
      if (authToken) {
        const decoded = jwtDecode(authToken);
        if (decoded.exp * 1000 - Date.now() < 300000) {
          refreshToken();
        }
      }
    } catch (err) {
      setError(err);
      logout();
    }
  };

  const refreshToken = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_APP_API_URL}/api/admin/auth/refresh`,
        {},
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      login(response.data.token);
    } catch (err) {
      setError(err);
      logout();
    }
  };

  useEffect(() => {
    if (!isRouterReady) return;

    try {
      const verifyToken = () => {
        if (authToken) {
          const decoded = jwtDecode(authToken);
          if (decoded.exp * 1000 < Date.now()) {
            refreshToken();
          } else {
            setIsAuthenticated(true);
            const interval = setInterval(checkTokenExpiration, 60000);
            return () => clearInterval(interval);
          }
        } else {
          setIsAuthenticated(false);
          if (window.location.pathname.startsWith('/admin') && 
              !window.location.pathname.includes('/admin/login')) {
            navigate('/admin/login');
          }
        }
      };
      return verifyToken();
    } catch (err) {
      setError(err);
      logout();
    }
  }, [authToken, isRouterReady]);

  if (error) {
    return <div>Authentication Error: {error.message}</div>;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, authToken, login, logout, refreshToken }}>
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