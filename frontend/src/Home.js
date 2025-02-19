import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import Header from './Header';
import axios from 'axios';
import Footer from './Footer';

function Home() {
  const [auctions, setAuctions] = useState([]);
  const [featuredAuctions, setFeaturedAuctions] = useState([]);
  const [visibleAuctions, setVisibleAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAuctions();
  }, []);

  const fetchAuctions = async () => {
    try {
      const response = await axios.get('https://nettside-mal-ki24.vercel.app/api/liveauctions');
      const { liveAuctions, featuredAuctions } = response.data;

      // Beregn tid igjen for både live og fremhevede auksjoner
      const auctionsWithTimeLeft = liveAuctions.map((auction) => ({
        ...auction,
        timeLeft: calculateTimeLeft(auction.endDate),
      }));

      const featuredWithTimeLeft = featuredAuctions.map((auction) => ({
        ...auction,
        timeLeft: calculateTimeLeft(auction.endDate),
      }));

      // Sett initiale states
      setAuctions(auctionsWithTimeLeft);
      setInitialFeaturedAuctions(featuredWithTimeLeft);
      setInitialVisibleAuctions(auctionsWithTimeLeft);
    } catch (error) {
      console.error('Error fetching auctions:', error);
    } finally {
      setLoading(false);
    }
  };

  const setInitialFeaturedAuctions = (featuredList) => {
    if (featuredList.length >= 4) {
      setFeaturedAuctions(featuredList.slice(0, 4));
    } else {
      const filledFeatured = [...featuredList];
      while (filledFeatured.length < 4) {
        filledFeatured.push(null);
      }
      setFeaturedAuctions(filledFeatured);
    }
  };

  const setInitialVisibleAuctions = (auctionsList) => {
    if (auctionsList.length >= 4) {
      setVisibleAuctions(getRandomItems(auctionsList, 4));
    } else {
      const filledAuctions = [...auctionsList];
      while (filledAuctions.length < 4) {
        filledAuctions.push(null);
      }
      setVisibleAuctions(filledAuctions);
    }
  };

  const getRandomItems = (list, count) => {
    const shuffled = [...list].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  // Oppdater tiden for både fremhevede og alle auksjoner
  useEffect(() => {
    const timeInterval = setInterval(() => {
      setFeaturedAuctions((prevFeatured) =>
        prevFeatured.map((auction) =>
          auction
            ? {
                ...auction,
                timeLeft: calculateTimeLeft(auction.endDate),
              }
            : null
        )
      );
      setVisibleAuctions((prevVisible) =>
        prevVisible.map((auction) =>
          auction
            ? {
                ...auction,
                timeLeft: calculateTimeLeft(auction.endDate),
              }
            : null
        )
      );
    }, 1000);

    return () => clearInterval(timeInterval);
  }, []);

  // Bytt ut fremhevede auksjoner
  useEffect(() => {
    const rotationInterval = setInterval(() => {
      if (auctions.length > 4) {
        setFeaturedAuctions((prevFeatured) => {
          const remainingFeatured = auctions.filter(
            (auction) =>
              auction.isFeatured && !prevFeatured.some((visible) => visible && visible._id === auction._id)
          );

          if (remainingFeatured.length === 0) return prevFeatured;

          const randomNewAuction =
            remainingFeatured[Math.floor(Math.random() * remainingFeatured.length)];
          const randomIndexToReplace = Math.floor(Math.random() * prevFeatured.length);

          const newFeatured = [...prevFeatured];
          newFeatured[randomIndexToReplace] = randomNewAuction;

          return newFeatured;
        });
      }
    }, 10000);

    return () => clearInterval(rotationInterval);
  }, [auctions]);

  const calculateTimeLeft = (endDate) => {
    const difference = new Date(endDate) - new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / (1000 * 60)) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    } else {
      timeLeft = {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      };
    }

    return timeLeft;
  };

  return (
    <div>
      <Header />
      <div className="home-container">
        <div className="home-content">
          <div className="home-banner">
            <div className="home-banner-content">
              <h1>Eksempel tittel</h1>
              <p>Eksempel tekst: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
            </div>
          </div>

          {/* Fremhevede auksjoner */}
          <div className="home-auctions-section">
            <h2>FREMHEVEDE OBJEKTER</h2>
            {loading ? (
              <div className="spinner-container">
                <div className="spinner"></div>
              </div>
            ) : featuredAuctions.length === 0 ? (
              <p>Ingen fremhevede objekter tilgjengelig for øyeblikket.</p>
            ) : (
              <div className="home-auction-list">
                {featuredAuctions.map((auction, index) =>
                  auction ? (
                    <div
                      key={auction._id}
                      className={`home-auction-item fade-in`}
                      onClick={() => navigate(`/liveauctions/${auction._id}`)}
                      style={{ cursor: 'pointer' }}
                    >
                      <img
                        src={
                          auction.imageUrls && auction.imageUrls.length > 0
                            ? auction.imageUrls[0]
                            : '/path-to-default-image.jpg'
                        }
                        alt={`${auction.brand} ${auction.model}`}
                        className="home-auction-image"
                      />
                      <div className="home-auction-details">
                        <h3>
                          {auction.brand} {auction.model} {auction.year}
                        </h3>
                        <span>{auction.mileage} KM</span>
                        <div className="home-auction-smalldetails">
                          <div className="home-title-value-auction">
                            <span className="home-auction-title">
                              <strong>Gjenstår:</strong>
                            </span>
                            <span
                              className="home-auction-value"
                              style={{
                                color: 'rgb(211, 13, 13)',
                                fontWeight: 'bold',
                              }}
                            >
                              {auction.timeLeft.days}D {auction.timeLeft.hours}t{' '}
                              {auction.timeLeft.minutes}min{' '}
                              {auction.timeLeft.seconds}s
                            </span>
                          </div>
                          <div className="home-title-value-auction">
                            <span className="home-auction-title">
                              <strong>Høyeste Bud:</strong>
                            </span>
                            <span
                              className="home-auction-value"
                              style={{
                                color: 'rgb(211, 13, 13)',
                                fontWeight: 'bold',
                              }}
                            >
                              {auction.highestBid},-
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div
                      key={`placeholder-${index}`}
                      className="home-auction-item placeholder"
                    ></div>
                  )
                )}
              </div>
            )}
          </div>

          {/* Alle auksjoner */}
          <div className="home-auctions-section">
            <h2>ALLE OBJEKTER</h2>
            {loading ? (
              <div className="spinner-container">
                <div className="spinner"></div>
              </div>
            ) : visibleAuctions.length === 0 ? (
              <p>Ingen objekter tilgjengelig for øyeblikket.</p>
            ) : (
              <div className="home-auction-list">
                {visibleAuctions.map((auction, index) =>
                  auction ? (
                    <div
                      key={auction._id}
                      className={`home-auction-item fade-in`}
                      onClick={() => navigate(`/liveauctions/${auction._id}`)}
                      style={{ cursor: 'pointer' }}
                    >
                      <img
                        src={
                          auction.imageUrls && auction.imageUrls.length > 0
                            ? auction.imageUrls[0]
                            : '/path-to-default-image.jpg'
                        }
                        alt={`${auction.brand} ${auction.model}`}
                        className="home-auction-image"
                      />
                      <div className="home-auction-details">
                        <h3>
                          {auction.brand} {auction.model} {auction.year}
                        </h3>
                        <span>{auction.mileage} KM</span>
                        <div className="home-auction-smalldetails">
                          <div className="home-title-value-auction">
                            <span className="home-auction-title">
                              <strong>Gjenstår:</strong>
                            </span>
                            <span
                              className="home-auction-value"
                              style={{
                                color: 'rgb(211, 13, 13)',
                                fontWeight: 'bold',
                              }}
                            >
                              {auction.timeLeft.days}D {auction.timeLeft.hours}t{' '}
                              {auction.timeLeft.minutes}min{' '}
                              {auction.timeLeft.seconds}s
                            </span>
                          </div>
                          <div className="home-title-value-auction">
                            <span className="home-auction-title">
                              <strong>Høyeste Bud:</strong>
                            </span>
                            <span
                              className="home-auction-value"
                              style={{
                                color: 'rgb(211, 13, 13)',
                                fontWeight: 'bold',
                              }}
                            >
                              {auction.highestBid},-
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div
                      key={`placeholder-${index}`}
                      className="home-auction-item placeholder"
                    ></div>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Home;
