// src/ResetPassword.js
import React, { useState } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import './ResetPassword.css';

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const token = searchParams.get('accessToken');
    try {
      const response = await axios.post('https://rimelig-auksjon-backend.vercel.app/reset-password', { token, newPassword: password });
      setMessage(response.data.message);
    } catch (error) {
      setMessage('Error resetting password');
    }
  };

  return (
    <div className="reset-password-container">
      <div className="reset-password-box">
        <h2>Tilbakestill passord.</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="password"><strong>Nytt passord.</strong></label>
            <input
              type="password"
              placeholder="Skriv ditt nye passord."
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
              required
            />
          </div>
          <button type="submit" className="btn btn-success w-100"><strong>Bekreft </strong></button>
        </form>
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
}

export default ResetPassword;
