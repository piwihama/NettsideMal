
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import validation from './LoginValidation';
import axios from 'axios';
import './Login.css';
import Header from './Header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [resetOtp, setResetOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [otpRequired, setOtpRequired] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [forgotPassword, setForgotPassword] = useState(false);
  const [resetOtpSent, setResetOtpSent] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);


  const navigate = useNavigate();

  const handleRememberMeChange = () => {
    setRememberMe(!rememberMe);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    } else if (name === 'otp') {
      setOtp(value);
    } else if (name === 'resetOtp') {
      setResetOtp(value);
    } else if (name === 'newPassword') {
      setNewPassword(value);
    }
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  

  const handleForgotPassword = () => {
    setErrors({});
    setSuccessMessage('');
    setForgotPassword(true);
  };

  const handleForgotPasswordSubmit = (event) => {
    event.preventDefault();
    axios.post('https://nettside-mal-backend.vercel.app/forgot-password', { email }, { withCredentials: true })
      .then(res => {
        setResetOtpSent(true);
        setOtp(''); // Clear OTP field
        setSuccessMessage('En engangskode har blitt sendt til din e-post.');
      })
      .catch(err => {
        console.error('Forgot password error:', err.response ? err.response.data : err.message);
        setErrors({ general: 'Feil ved sending av engangskode, prøv igjen senere.' });
      });
  };

  const handleResetPasswordSubmit = (event) => {
    event.preventDefault();
    axios.post('https://nettside-mal-backend.vercel.app/reset-password', { email, otp: resetOtp, newPassword }, { withCredentials: true })
      .then(res => {
        setForgotPassword(false);
        setResetOtpSent(false);
        setSuccessMessage('Passordet har blitt tilbakestilt. Vennligst logg inn.');
        setTimeout(() => {
          setSuccessMessage('');
          navigate('/');
        }, 3000); // Clear success message and navigate after 3 seconds
      })
      .catch(err => {
        console.error('Reset password error:', err.response ? err.response.data : err.message);
        setErrors({ general: 'Feil engangskode eller feil ved tilbakestilling av passord.' });
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors = validation({ email, password });
    setErrors(validationErrors);
    setSuccessMessage('');

    if (Object.keys(validationErrors).length === 0) {
      axios.post('https://nettside-mal-backend.vercel.app/login', { email, password }, { withCredentials: true })
        .then(res => {
          if (res.data.accessToken) {
            console.log('Login successful, token received:', res.data.accessToken);
            localStorage.setItem('accessToken', res.data.accessToken); // Store access token in local storage
            localStorage.setItem('role', res.data.role);

            // Trigger an event to let Header know the user is logged in
            window.dispatchEvent(new Event('storage'));

            setSuccessMessage('Innlogging vellykket! Du blir sendt til hjemmesiden.');
            setTimeout(() => {
              setSuccessMessage('');
              navigate('/home');
            }, 3000);
          } else if (res.data.message === 'User not verified') {
            setUserEmail(res.data.email);
            setOtpRequired(true);
            setSuccessMessage('Du har ikke fullført en tidligere registrering. Vennligst skriv inn engangskoden vi har sendt deg på e-post for å fullføre.');
          } else {
            console.log('Login failed, unexpected response:', res.data);
            setErrors({ general: "Ugyldig innloggingsforsøk" });
          }
        })
        .catch(err => {
          console.error('Login error:', err.response ? err.response.data : err.message);
          if (err.response && err.response.status === 400) {
            setErrors({ general: 'Feil e-post eller passord' });
          } else {
            setErrors({ general: 'Noe gikk galt, prøv igjen senere.' });
          }
        });
    }
  };

  const refreshAccessToken = async () => {
    try {
      const response = await axios.post('https://nettside-mal-backend.vercel.app/api/refresh-token', {}, { withCredentials: true });
      if (response.data.accessToken) {
        localStorage.setItem('accessToken', response.data.accessToken);
        console.log('Access token renewed successfully');
        return response.data.accessToken;
      }
    } catch (error) {
      console.error('Error refreshing access token:', error);
      return null;
    }
  };

  axios.interceptors.response.use(
    response => response,
    async error => {
      const originalRequest = error.config;
      if (error.response && error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        const newAccessToken = await refreshAccessToken();
        if (newAccessToken) {
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return axios(originalRequest);
        }
      }
      return Promise.reject(error);
    }
  );

  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  const handleOtpSubmit = (event) => {
    event.preventDefault();
    axios.post('https://nettside-mal-backend.vercel.app/verify-otp', { email: userEmail, otp }, { withCredentials: true })
      .then(res => {
        setSuccessMessage('Engangskode verifisert. Vennligst logg inn.');
        setOtpRequired(false);
        setTimeout(() => {
          setSuccessMessage('');
          navigate('/');
        }, 3000); // Clear success message and navigate after 3 seconds
      })
      .catch(err => {
        console.error('OTP verification error:', err.response ? err.response.data : err.message);
        setErrors({ otp: 'Ugyldig engangskode. Vennligst prøv igjen.' });
      });
  };

  return (
    <>
      <Header />
      <div className="login-container">
  <div className="login-box">
    <h2>Logg inn</h2>
    {successMessage && <div className="alert alert-success">{successMessage}</div>}
    {!otpRequired && !forgotPassword ? (
      <form onSubmit={handleSubmit} autoComplete="on">
        <div className="login-form-group">
          <label htmlFor="email"><strong>E-post</strong></label>
          <input
            type="email"
            placeholder="E-post"
            name="email"
            value={email}
            onChange={handleInputChange}
            className="login-form-control"
            autoComplete="new-email"
          />
          {errors.email && <span className="text-danger">{errors.email}</span>}
        </div>

        <div className="login-form-group">
          <label htmlFor="password"><strong>Passord</strong></label>
          <div className="login-input-group">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Passord"
              name="password"
              value={password}
              onChange={handleInputChange}
              className="login-form-control"
              autoComplete="new-password"
            />
            <button
              type="button"
              className="login-btn-eye"
              onClick={() => setShowPassword(!showPassword)}
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </button>
          </div>
          {errors.password && <span className="text-danger">{errors.password}</span>}
        </div>

     
        {errors.general && <div className="alert alert-danger">{errors.general}</div>}
        <button type="submit" className="login-btn login-btn-success"><strong>Logg inn</strong></button>
        <p className="terms-text">Du godtar våre vilkår og betingelser</p>
        <button className="login-btn login-btn-secondary">
  <Link to="/signup" className="login-link">
    <strong>🌟 Opprett en ny konto</strong>
  </Link>
</button>

<p className="login-helper-text">
  Ny bruker? Klikk her for å lage en konto og begynne å handle med en gang!
</p>

<button
  type="button"
  className="login-btn login-btn-secondary"
  onClick={handleForgotPassword}
>
  <strong>🔑 Glemt passord?</strong>
</button>
<p className="login-helper-text">
  Har du glemt passordet ditt? Klikk her for å tilbakestille det enkelt og raskt.
</p>
     </form>
    ) : otpRequired ? (
      <form onSubmit={handleOtpSubmit}>
      <div className="login-form-group">
        <label htmlFor="otp"><strong>🔒 Engangskode (OTP)</strong></label>
        <input
          type="text"
          placeholder="Skriv inn din engangskode"
          name="otp"
          value={otp}
          onChange={handleInputChange}
          className="login-form-control"
          autoComplete="off"
        />
        {errors.otp && <span className="text-danger">{errors.otp}</span>}
      </div>
      <button type="submit" className="login-btn login-btn-success">
        <strong>✅ Bekreft kode</strong>
      </button>
    </form>
    
    ) : resetOtpSent ? (
      <form onSubmit={handleResetPasswordSubmit}>
      <div className="login-form-group">
        <label htmlFor="resetOtp"><strong>🔒 Engangskode (OTP)</strong></label>
        <input
          type="text"
          placeholder="Skriv inn engangskode mottatt på e-post"
          name="resetOtp"
          value={resetOtp}
          onChange={handleInputChange}
          className="login-form-control"
          autoComplete="off"
        />
      </div>
    
      <div className="login-form-group">
        <label htmlFor="newPassword"><strong>🔐 Nytt passord</strong></label>
        <input
          type="password"
          placeholder="Skriv inn ditt nye passord"
          name="newPassword"
          value={newPassword}
          onChange={handleInputChange}
          className="login-form-control"
        />
      </div>
    
      {errors.general && <div className="alert alert-danger">{errors.general}</div>}
      <button type="submit" className="login-btn login-btn-success">
        <strong>🔄 Tilbakestill passord</strong>
      </button>
    </form>
    
    
    ) : (
      <form onSubmit={handleForgotPasswordSubmit}>
      <div className="login-form-group">
        <label htmlFor="email"><strong>📧 E-post</strong></label>
        <input
          type="email"
          placeholder="Skriv inn e-posten din"
          name="email"
          value={email}
          onChange={handleInputChange}
          className="login-form-control"
        />
        {errors.email && <span className="text-danger">{errors.email}</span>}
      </div>
      
      {errors.general && <div className="alert alert-danger">{errors.general}</div>}
      
      <button type="submit" className="login-btn login-btn-success">
        <strong>📨 Send engangskode</strong>
      </button>
    </form>
    
    )}
  </div>
</div>

    </>
  );
}

export default Login;




















