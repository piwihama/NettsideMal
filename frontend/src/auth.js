import axios from 'axios';

let inactivityTimer;

// Sjekker om brukeren er autentisert ved å validere token
export const isAuthenticated = () => {
  const token = localStorage.getItem('accessToken');

  if (!token) return null;

  try {
    const payload = parseJwt(token);
    const currentTime = Date.now() / 1000; // Gjeldende tid i sekunder

    if (payload.exp > currentTime) {
      startInactivityTimer();
      return payload;
    } else {
      localStorage.removeItem('accessToken');
      return null;
    }
  } catch (error) {
    console.error('Error parsing token:', error);
    localStorage.removeItem('accessToken');
    return null;
  }
};

// Starter inaktivitetstimeren for å fornye token etter 6 dager og 23 timer
const startInactivityTimer = () => {
  clearTimeout(inactivityTimer);

  inactivityTimer = setTimeout(() => {
    refreshAuthToken();
  }, 6 * 24 * 60 * 60 * 1000 + 23 * 60 * 60 * 1000); // 6 dager og 23 timer
};

// Fornyer accessToken ved hjelp av refreshToken
export const refreshAuthToken = async () => {
  try {
    console.log('Sending refresh token request...');
    const response = await axios.post('/api/refresh-token', {}, { withCredentials: true });

    if (response.data.accessToken) {
      console.log('Token refreshed successfully:', response.data.accessToken);
      localStorage.setItem('accessToken', response.data.accessToken);
      window.dispatchEvent(new Event('storage'));
      startInactivityTimer();
      return true;
    }
  } catch (error) {
    console.error('Failed to refresh token:', error.response || error.message);
    localStorage.removeItem('accessToken');
    return false;
  }
};

// Parser JWT for å hente payload
const parseJwt = (token) => {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map((c) => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join('')
  );

  return JSON.parse(jsonPayload);
};

// Lytt til aktivitet på siden for å resette inaktivitetstimeren
['mousemove', 'keydown', 'scroll', 'click'].forEach((event) => {
  window.addEventListener(event, startInactivityTimer);
});
