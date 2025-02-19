import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './MyAuctions.css';

const MyAuctions = () => {
  const [auctions, setAuctions] = useState([]);
  const [expandedAuctionId, setExpandedAuctionId] = useState(null); // Kun ett kort
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/minside');
  };

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get('https://nettside-mal-ki24.vercel.app/api/myauctions', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAuctions(response.data);
        setCurrentImageIndex(
          response.data.reduce((acc, auction) => {
            acc[auction._id] = 0;
            return acc;
          }, {})
        );
      } catch (error) {
        console.error('Error fetching auctions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAuctions();
  }, []);

  const toggleExpand = (auctionId) => {
    setExpandedAuctionId((prevId) => (prevId === auctionId ? null : auctionId)); // Toggler kun det spesifikke kortet
  };

  const handleNextImage = (auctionId, totalImages) => {
    setCurrentImageIndex((prevState) => ({
      ...prevState,
      [auctionId]: (prevState[auctionId] + 1) % totalImages,
    }));
  };

  const handlePrevImage = (auctionId, totalImages) => {
    setCurrentImageIndex((prevState) => ({
      ...prevState,
      [auctionId]: (prevState[auctionId] - 1 + totalImages) % totalImages,
    }));
  };

  return (
    <div className="myauctions-container">
      <button className="myauctions-back-button" onClick={handleBack}>
        Tilbake
      </button>
      <h1>Mine Auksjoner</h1>

      {loading ? (
        <div className="myauctions-skeleton-loader">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="myauctions-skeleton-card"></div>
          ))}
        </div>
      ) : auctions.length > 0 ? (
        <div className="myauctions-grid">
          {auctions.map((auction) => {
            const isExpanded = expandedAuctionId === auction._id; // Sjekker om dette kortet er utvidet

            return (
              <div
                className={`myauctions-card ${isExpanded ? 'expanded' : ''}`}
                key={auction._id}
                onClick={() => toggleExpand(auction._id)}
              >
                <div className="myauctions-image-container">
                  <button
                    className="myauctions-image-nav prev"
                    onClick={(e) => {
                      e.stopPropagation(); // Hindrer konflikt med toggleExpand
                      handlePrevImage(auction._id, auction.imageUrls.length);
                    }}
                  >
                    &lt;
                  </button>
                  <img
                    src={auction.imageUrls?.[currentImageIndex[auction._id]] || '/path-to-default-image.jpg'}
                    alt={auction.title}
                    className="myauctions-image"
                  />
                  <button
                    className="myauctions-image-nav next"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNextImage(auction._id, auction.imageUrls.length);
                    }}
                  >
                    &gt;
                  </button>
                </div>
                <div className="myauctions-info">
                  <h6>
                    {auction.title}{' '}
                    <span
                      className={`myauctions-expand-icon ${isExpanded ? 'expanded' : ''}`}
                    >
                      &#9660;
                    </span>
                  </h6>
                  <p>
                    <strong>Merke:</strong> {auction.brand}
                  </p>
                  <p>
                    <strong>Modell:</strong> {auction.model}
                  </p>
                  <p>
                    <strong>År:</strong> {auction.year}
                  </p>
                </div>
                {isExpanded && (
                  <div className="myauctions-details">
                    <p>
                      <strong>Registreringsnummer:</strong> {auction.regNumber}
                    </p>
                    <p>
                      <strong>Minstepris:</strong> {auction.reservePrice}
                    </p>
                    <p>
                      <strong>Status:</strong> {auction.status}
                    </p>
                    <p>
                      <strong>Beskrivelse:</strong> {auction.description || 'Ingen beskrivelse.'}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <p>Ingen auksjoner funnet.</p>
      )}
    </div>
  );
};

export default MyAuctions;
