// src/ForgotPassword.js
import React, { useState } from 'react';
import axios from 'axios';
import './ForgotPassword.css';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('https://nettside-mal-ki24.vercel.app/password-reset-request', { email });
      setMessage(response.data.message);
    } catch (error) {
      setMessage('Kunne ikke sende engangskode på e-post. Prøv igjen senere.');
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-box">
        <h2>Forgot Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email"><strong>Email</strong></label>
            <input
              type="email"
              placeholder="Skriv din e-post her."
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
              required
            />
          </div>
          <button type="submit" className="btn btn-success w-100"><strong>Send engangskode.</strong></button>
        </form>
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
}

export default ForgotPassword;
