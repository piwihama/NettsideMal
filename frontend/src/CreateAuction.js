import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './CreateAuction.css';

function CreateAuction() {
  const [formValues, setFormValues] = useState({
    title: '',
    brand: '',
    model: '',
    year: '',
    reservePrice: '',
    status: '',
    description: '',
    conditionDescription: '',
    equipment: '',
  });
  const [images, setImages] = useState([]);
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleImageChange = (event) => {
    setImages([...event.target.files]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const token = localStorage.getItem('accessToken'); // Bruker 'accessToken' for konsistens
    const formData = new FormData();
    Object.keys(formValues).forEach(key => {
      formData.append(key, formValues[key]);
    });
    images.forEach((image, index) => {
      formData.append(`image${index}`, image);
    });

    axios.post('https://nettside-mal-ki24.vercel.app/api/auctions', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    })
      .then(() => {
        navigate('/admin/dashboard');
      })
      .catch(error => {
        console.error('Error creating auction:', error);
      });
  };

  return (
    <div className="create-auction">
      <h1>Create New Auction</h1>
      <form onSubmit={handleSubmit}>
        {/* Skjema felter for hver auksjon parameter */}
        <label>
          Title:
          <input type="text" name="title" value={formValues.title} onChange={handleChange} />
        </label>
        {/* Legg til flere input-felt her for resten av auksjonsdetaljene */}
        <label>
          Images:
          <input type="file" multiple onChange={handleImageChange} />
        </label>
        <button type="submit" className="btn btn-primary">Create Auction</button>
      </form>
    </div>
  );
}

export default CreateAuction;
