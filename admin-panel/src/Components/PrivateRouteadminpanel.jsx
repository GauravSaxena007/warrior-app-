import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const PrivateRouteadminpanel = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      let token = localStorage.getItem('token'); // First check localStorage
  
      const params = new URLSearchParams(location.search); // Check URL query params
      const urlToken = params.get('token');
      if (urlToken) {
        localStorage.setItem('token', urlToken); // Store token in localStorage
        token = urlToken;
        await new Promise(resolve => setTimeout(resolve, 500));// Clear token from URL for security
      }
  
      if (!token) {
        setIsAuthenticated(false);
        return;
      }
  
      // Log the token for debugging
      console.log('Token from localStorage or URL:', token);
  
      try {
        // Validate token with backend
        await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/validate`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Token validation failed:', error);
        localStorage.removeItem('token'); // Clear invalid token
        setIsAuthenticated(false);
      }
    };
  
    checkAuth();
  }, [location]);
  

  // While checking authentication, show a loading state
  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  // If authenticated, render children; otherwise, redirect to login
  if (!isAuthenticated) {
    window.location.href = `${import.meta.env.VITE_FRONTEND_URL}/adminlogin`;
    return null;
  }

  return children;
};

export default PrivateRouteadminpanel;