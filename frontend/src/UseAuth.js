
import { useState, useEffect } from 'react';
import jwt_decode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const UseAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    console.log('Token from local storage:', token);

    const checkTokenValidity = async () => {
      if (token) {
        try {
          const decodedToken = jwt_decode(token);
          const currentTime = Date.now() / 1000;

          if (decodedToken.exp > currentTime) {
            setIsAuthenticated(true);
          } else if (refreshToken) {
            // Token has expired, try refreshing it
            const refreshed = await refreshAccessToken(refreshToken);
            if (refreshed) {
              setIsAuthenticated(true);
            } else {
              localStorage.removeItem('accessToken');
              localStorage.removeItem('refreshToken');
              navigate('/login');
            }
          } else {
            localStorage.removeItem('accessToken');
            navigate('/login');
          }
        } catch (error) {
          console.error('Error decoding token:', error);
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          navigate('/login');
        }
      } else {
        navigate('/login');
      }
    };

    checkTokenValidity();
  }, [navigate]);

  const refreshAccessToken = async (refreshToken) => {
    try {
      const response = await fetch('https://rimelig-auksjon-backend.vercel.app/api/refresh-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('accessToken', data.accessToken);
        return true;
      } else {
        console.error('Failed to refresh access token:', response.statusText);
        return false;
      }
    } catch (error) {
      console.error('Error refreshing access token:', error);
      return false;
    }
  };

  return isAuthenticated;
};

export default UseAuth;


























/*import { useState, useEffect } from 'react';
import jwt_decode from 'jwt-decode'; // Ensure this is correctly imported
import process from 'process'; // Import process

const UseAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('accessToken'); // Bruker 'accessToken' for konsistens
    console.log('Token from local storage:', token);

    if (token) {
      try {
        const decodedToken = jwt_decode(token);
        const currentTime = Date.now() / 1000;

        if (decodedToken.exp > currentTime) {
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem('token');
        }
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, []);

  return isAuthenticated;
};

export default UseAuth;*/
