// src/AdminCreateAuction.js

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminCreateAuction = () => {
  const [auctionData, setAuctionData] = useState({
    title: '',
    description: '',
    startingBid: 0,
    // add other fields as necessary
  });
  const navigate = useNavigate();

  
  const handleChange = (e) => {
    setAuctionData({
      ...auctionData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://nettside-mal-ki24.vercel.app/api/auctions', auctionData);
      alert('Auction created successfully');
      navigate('/admin/dashboard');
    } catch (error) {
      console.error('Error creating auction:', error);
      alert('Failed to create auction');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input type="text" name="title" value={auctionData.title} onChange={handleChange} required />
        </div>
        <div>
          <label>Description:</label>
          <textarea name="description" value={auctionData.description} onChange={handleChange} required />
        </div>
        <div>
          <label>Starting Bid:</label>
          <input type="number" name="startingBid" value={auctionData.startingBid} onChange={handleChange} required />
        </div>
        {/* Add more fields as necessary */}
        <button type="submit">Create Auction</button>
      </form>
    </div>
  );
};

export default AdminCreateAuction;
