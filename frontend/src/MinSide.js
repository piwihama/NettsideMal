import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './MinSide.css';
import Header from './Header'; 
import Footer from './Footer'; 

function MinSide() {
  const [auctions, setAuctions] = useState([]);
  const [liveAuctions, setLiveAuctions] = useState([]);
  const [messages, setMessages] = useState([]);
  const [userDetails, setUserDetails] = useState({});
  const [activeSection, setActiveSection] = useState(null); 
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('accessToken'); // Oppdatert fra 'token' til 'accessToken'
        if (!token) {
          console.log('No token found, redirecting to login');
          navigate('/');
          return;
        }

        // Sett opp en tom array for feil
        let errors = [];

        // Gjør alle API-kall parallelt, men med individuell feilhåndtering
        const [auctionResponse, liveAuctionResponse, messageResponse, userResponse] = await Promise.all([
          axios.get('https://rimelig-auksjon-backend.vercel.app/api/myauctions', {
            headers: { 'Authorization': `Bearer ${token}` }
          }).catch(error => { 
            errors.push('myauctions'); 
            console.error('Error fetching myauctions:', error); 
          }),
          axios.get('https://rimelig-auksjon-backend.vercel.app/api/myliveauctions', {
            headers: { 'Authorization': `Bearer ${token}` }
          }).catch(error => { 
            errors.push('myliveauctions'); 
            console.error('Error fetching myliveauctions:', error); 
          }),
          axios.get('https://rimelig-auksjon-backend.vercel.app/api/mymessages', {
            headers: { 'Authorization': `Bearer ${token}` }
          }).catch(error => { 
            errors.push('mymessages'); 
            console.error('Error fetching mymessages:', error); 
          }),
          axios.get('https://rimelig-auksjon-backend.vercel.app/api/userdetails', {
            headers: { 'Authorization': `Bearer ${token}` }
          }).catch(error => { 
            errors.push('userdetails'); 
            console.error('Error fetching userdetails:', error); 
          })
        ]);

        // Sjekk for gyldige svar og oppdater tilstand hvis API-kallene lykkes
        if (!errors.includes('myauctions') && auctionResponse) {
          setAuctions(auctionResponse.data);
        }
        if (!errors.includes('myliveauctions') && liveAuctionResponse) {
          setLiveAuctions(liveAuctionResponse.data);
        }
        if (!errors.includes('mymessages') && messageResponse) {
          setMessages(messageResponse.data);
        }
        if (!errors.includes('userdetails') && userResponse) {
          setUserDetails(userResponse.data);
        }

        setLoading(false);

      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleUpdateDetails = () => {
    navigate('/account');
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken'); // Oppdatert fra 'token' til 'accessToken'
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
    navigate('/');
  };

  const toggleSection = (section) => {
    setActiveSection(activeSection === section ? null : section);
  };
  return (
    <div>
      <Header />

      <div className='myside-container'>
        <div className="myside-back-button-container">
          <h1>Min Side</h1>
          <p>Velkommen til din personlige side. Her kan du se og administrere dine auksjoner, meldinger, og kontoopplysninger.</p>
          <div className='myside-content'>
          <div className='myside-section'>
  <div className='myside-card'>
    <div className='myside-card-header' onClick={() => toggleSection('auctions')}>
      <h5 className='myside-card-title'>Mine Auksjoner (Forespørsler)</h5>
      <i className={`myside-toggle-icon ${activeSection === 'auctions' ? 'active' : ''}`}>&#9660;</i>
    </div>
    <div className={`myside-card-body ${activeSection === 'auctions' ? 'active' : ''}`}>
      {loading ? (
        <div className="skeleton-loader">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="skeleton-card"></div>
          ))}
        </div>
      ) : auctions.length > 0 ? (
        <div className="home-auction-list">
          {auctions.map(auction => (
            <div className="home-auction-item" key={auction._id}>
              <img
                src={auction.imageUrls && auction.imageUrls.length > 0 ? auction.imageUrls[0] : '/path-to-default-image.jpg'}
                alt={auction.title}
                className="home-auction-image"
              />
              <div className="home-auction-details">
                <h3>{auction.brand} {auction.model} {auction.year}</h3>
                <div className="home-auction-smalldetails">
                  <div className="home-title-value-auction">
                    <span><strong>Minstepris:</strong></span>
                    <span>{auction.reservePrice} NOK</span>
                  </div>
                  <div className="home-title-value-auction">
                    <span><strong>Status:</strong></span>
                    <span>{auction.status}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>Ingen auksjoner funnet.</p>
      )}
      <a href='/myauctions' className='myside-btn myside-btn-primary'>Se Mine Auksjoner</a>
    </div>
  </div>
</div>

<div className='myside-section'>
  <div className='myside-card'>
    <div className='myside-card-header' onClick={() => toggleSection('liveAuctions')}>
      <h5 className='myside-card-title'>Mine Live Auksjoner</h5>
      <i className={`myside-toggle-icon ${activeSection === 'liveAuctions' ? 'active' : ''}`}>&#9660;</i>
    </div>
    <div className={`myside-card-body ${activeSection === 'liveAuctions' ? 'active' : ''}`}>
      {loading ? (
        <div className="skeleton-loader">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="skeleton-card"></div>
          ))}
        </div>
      ) : liveAuctions.length > 0 ? (
        <div className="home-auction-list">
          {liveAuctions.map(auction => (
            <div className="home-auction-item" key={auction._id}>
              <img
                src={auction.imageUrls && auction.imageUrls.length > 0 ? auction.imageUrls[0] : '/path-to-default-image.jpg'}
                alt={auction.title}
                className="home-auction-image"
              />
              <div className="home-auction-details">
                <h3>{auction.brand} {auction.model} {auction.year}</h3>
                <div className="home-auction-smalldetails">
                  <div className="home-title-value-auction">
                    <span><strong>Høyeste Bud:</strong></span>
                    <span>{auction.highestBid} NOK</span>
                  </div>
                  <div className="home-title-value-auction">
                    <span><strong>Status:</strong></span>
                    <span>{auction.status}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>Ingen live auksjoner funnet.</p>
      )}
      <a href='/myliveauctions' className='myside-btn myside-btn-primary'>Se Mine Live Auksjoner</a>
    </div>
  </div>
</div>

            <div className='myside-section'>
              <div className='myside-card'>
                <div className='myside-card-header' onClick={() => toggleSection('messages')}>
                  <h5 className='myside-card-title'>Meldinger</h5>
                  <i className={`myside-toggle-icon ${activeSection === 'messages' ? 'active' : ''}`}>&#9660;</i>
                </div>
                <div className={`myside-card-body ${activeSection === 'messages' ? 'active' : ''}`}>
                  {loading ? (
                    <p>Laster inn meldinger...</p>
                  ) : messages.length > 0 ? (
                    <div className="myside-messages-grid">
                      {messages.map(message => (
                        <div className="myside-message-card" key={message._id}>
                          <p>{message.content}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>Ingen meldinger funnet.</p>
                  )}
                  <a href='/messages' className='myside-btn myside-btn-primary'>Se Meldinger</a>
                </div>
              </div>
            </div>
            <div className='myside-section'>
              <div className='myside-card'>
                <div className='myside-card-header' onClick={() => toggleSection('account')}>
                  <h5 className='myside-card-title'>Kontoopplysninger</h5>
                  <i className={`myside-toggle-icon ${activeSection === 'account' ? 'active' : ''}`}>&#9660;</i>
                </div>
                <div className={`myside-card-body ${activeSection === 'account' ? 'active' : ''}`}>
                  {loading ? (
                    <p>Laster inn kontoopplysninger...</p>
                  ) : (
                    <>
                      <p><strong>Fornavn:</strong> {userDetails.firstName}</p>
                      <p><strong>Etternavn:</strong> {userDetails.lastName}</p>
                      <p><strong>Email:</strong> {userDetails.email}</p>
                      <button onClick={handleUpdateDetails} className='myside-btn myside-btn-primary'>Se mer og oppdater opplysninger</button>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="myside-logout-button-container">
              <button onClick={handleLogout} className='myside-btn myside-btn-danger'>Logg ut</button>
            </div>
          </div>
        </div>
        <button onClick={() => navigate(-1)} className='myside-back-button'>Tilbake</button>
      </div>
      <Footer />
    </div>
  );
}

export default MinSide;
