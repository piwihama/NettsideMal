import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Account.css'; // Import the CSS file for styling

const Account = () => {
  const [values, setValues] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    mobile: '',
    birthDate: '',
    address1: '',
    address2: '',
    postalCode: '',
    city: '',
    country: 'Norge',
    accountNumber: ''
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://rimelig-auksjon-backend.vercel.app/api/userdetails', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const { firstName, lastName, email, mobile, birthDate, address1, address2, postalCode, city, country, accountNumber } = response.data;
        setValues({ firstName, lastName, email, password: '', mobile, birthDate, address1, address2, postalCode, city, country, accountNumber });
      } catch (error) {
        console.error('Error fetching user details:', error);
        setMessage('Feil ved henting av brukeropplysninger');
      }
    };

    fetchUserDetails();
  }, []);

  const handleInput = (event) => {
    setValues(prev => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const updatedValues = { ...values };

      if (!updatedValues.password) {
        delete updatedValues.password;
      }

      const response = await axios.put('https://rimelig-auksjon-backend.vercel.app/api/userdetails', updatedValues, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setMessage(response.data.message);
    } catch (error) {
      console.error('Error updating user details:', error);
      setMessage('Feil ved oppdatering av brukeropplysninger');
    }
  };

  const handleBack = () => {
    navigate(-1); // Navigate back to the previous page
  };

  return (
    <div className='account-container'>
      <h1>Oppdater Kontoopplysninger</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor='firstName'>Fornavn</label>
        <input
          type='text'
          name='firstName'
          placeholder='Skriv inn fornavn'
          value={values.firstName}
          onChange={handleInput}
        />
        <label htmlFor='lastName'>Etternavn</label>
        <input
          type='text'
          name='lastName'
          placeholder='Skriv inn etternavn'
          value={values.lastName}
          onChange={handleInput}
        />
        <label htmlFor='email'>E-post</label>
        <input
          type='email'
          name='email'
          placeholder='Skriv inn e-post'
          value={values.email}
          onChange={handleInput}
        />
        <label htmlFor='password'>Passord</label>
        <input
          type='password'
          name='password'
          placeholder='Skriv inn passord'
          value={values.password}
          onChange={handleInput}
        />
        <label htmlFor='mobile'>Mobil</label>
        <input
          type='text'
          name='mobile'
          placeholder='Skriv inn mobil'
          value={values.mobile}
          onChange={handleInput}
        />
        <label htmlFor='birthDate'>Fødselsdato</label>
        <input
          type='date'
          name='birthDate'
          placeholder='Skriv inn fødselsdato'
          value={values.birthDate}
          onChange={handleInput}
        />
        <label htmlFor='address1'>Adresse</label>
        <input
          type='text'
          name='address1'
          placeholder='Skriv inn adresse'
          value={values.address1}
          onChange={handleInput}
        />
        <label htmlFor='address2'>Adresse 2</label>
        <input
          type='text'
          name='address2'
          placeholder='Skriv inn adresse 2'
          value={values.address2}
          onChange={handleInput}
        />
        <label htmlFor='postalCode'>Postnummer</label>
        <input
          type='text'
          name='postalCode'
          placeholder='Skriv inn postnummer'
          value={values.postalCode}
          onChange={handleInput}
        />
        <label htmlFor='city'>Sted</label>
        <input
          type='text'
          name='city'
          placeholder='Skriv inn sted'
          value={values.city}
          onChange={handleInput}
        />
        <label htmlFor='country'>Land</label>
        <input
          type='text'
          name='country'
          placeholder='Skriv inn land'
          value={values.country}
          onChange={handleInput}
          readOnly
        />
        <label htmlFor='accountNumber'>Kontonummer</label>
        <input
          type='text'
          name='accountNumber'
          placeholder='Skriv inn kontonummer'
          value={values.accountNumber}
          onChange={handleInput}
        />
        <button type='submit'>Oppdater Opplysninger</button>
        {message && <p className='message'>{message}</p>}
      </form>
      <div className="back-button-container">
        <button onClick={handleBack} className='back-button'>Tilbake</button>
      </div>
    </div>
  );
};

export default Account;
