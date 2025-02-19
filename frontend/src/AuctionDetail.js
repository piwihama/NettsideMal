import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AuctionDetail.css'; // Import the CSS file for styling

const AuctionDetail = () => {
  const { id } = useParams(); // Get the auction ID from the URL
  const [auction, setAuction] = useState(null);
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // Navigate back to the previous page
  };

  useEffect(() => {
    const fetchAuction = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`hhttps://nettside-mal-ki24.vercel.app/api/auctions/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setAuction(response.data);
      } catch (error) {
        console.error('Error fetching auction details:', error);
      }
    };

    fetchAuction();
  }, [id]);

  if (!auction) return <div>Loading...</div>;

  return (
    <div className="auction-detail-container">
      <h1 className="auction-title">{auction.title}</h1>
      <div className="auction-content">
        {auction.images && auction.images.length > 0 && (
          <img src={auction.images[0]} alt={auction.title} className="auction-image" />
        )}
        <div className="auction-details">
          <p><strong>Merke:</strong> {auction.brand}</p>
          <p><strong>Modell:</strong> {auction.model}</p>
          <p><strong>År:</strong> {auction.year}</p>
          <p><strong>Registreringsnummer:</strong> {auction.regNumber}</p>
          <p><strong>Minstepris:</strong> {auction.reservePrice}</p>
          <p><strong>Status:</strong> {auction.status}</p>
          <p><strong>Beskrivelse:</strong> {auction.description}</p>
          <p><strong>Tilstand:</strong> {auction.conditionDescription}</p>
          <h3>Utstyr:</h3>
          <ul>
            {auction.equipment && auction.equipment.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="back-button">
        <button onClick={handleBack} className='btn btn-secondary'>Tilbake</button>
      </div>
    </div>
  );
};

export default AuctionDetail;
