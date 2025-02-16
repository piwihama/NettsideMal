import axios from 'axios';
import { refreshAuthToken } from './auth';

const api = axios.create({
  baseURL: '/api', // Standard base-URL for backend-endepunktene
  withCredentials: true, // Sørg for å sende cookies som inneholder refreshToken
});

// Legg til accessToken i alle forespørsler
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// Automatisk fornying av accessToken på 401-feil
api.interceptors.response.use(
  (response) => response, // Hvis responsen er OK
  async (error) => {
    if (error.response?.status === 401) {
      const refreshed = await refreshAuthToken();
      if (refreshed) {
        // Prøv forespørselen på nytt med oppdatert token
        error.config.headers['Authorization'] = `Bearer ${localStorage.getItem('accessToken')}`;
        return api.request(error.config);
      }
    }
    return Promise.reject(error); // Kaster andre feil videre
  }
);
//
export default api;
