import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import './PostedAuction.css';
import Header from './Header';
import Footer from './Footer';

// Function to map bids to bidder labels
const mapBidders = (bids) => {
  let bidderMap = {};
  let uniqueBidderCounter = 1;

  bids.forEach(bid => {
    // If the bidder is not in the bidderMap, add them
    if (!bidderMap[bid.bidder]) {
      bidderMap[bid.bidder] = `Budgiver ${uniqueBidderCounter}`;
      uniqueBidderCounter++;
    }
  });

  return bidderMap;
};

function PostedAuction() {
  const { id } = useParams();
  const [auction, setAuction] = useState(null);
  const [bidAmount, setBidAmount] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [timeLeft, setTimeLeft] = useState({});
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [endDate, setEndDate] = useState(null);
  const [bidderMap, setBidderMap] = useState({});
  const socketRef = useRef(null);

  useEffect(() => {
    // Initialize WebSocket connection
    if (!socketRef.current) {
      socketRef.current = io('wss://ws.rimeligauksjon.no', {
        transports: ['websocket', 'polling', 'flashsocket'],
      });

      // Log connection status
      socketRef.current.on('connect', () => {
        console.log('WebSocket connection established');
      });

      socketRef.current.on('connect_error', (error) => {
        console.error('WebSocket connection error:', error);
      });

      socketRef.current.on('disconnect', () => {
        console.log('WebSocket disconnected');
      });

      // Listen for real-time bid updates
      socketRef.current.on('bidUpdated', handleBidUpdate);
    }

    // Clean up WebSocket connection when the component unmounts
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [id]);

  // Handle bid updates from WebSocket
  const handleBidUpdate = async (updatedAuction) => {
    console.log('Received bid update:', updatedAuction);

    if (updatedAuction.auctionId === id) {
      // Optimistically update the auction state
      setAuction(prevState => {
        const updatedBids = [...prevState.bids, { amount: updatedAuction.bidAmount, bidder: updatedAuction.bidderId }];
        const updatedBidderMap = mapBidders(updatedBids);
        setBidderMap(updatedBidderMap);

        return {
          ...prevState,
          highestBid: updatedAuction.bidAmount,
          bids: updatedBids
        };
      });

      // Fetch the latest data from the backend to ensure consistency
      try {
        const response = await axios.get(`https://rimelig-auksjon-backend.vercel.app/api/liveauctions/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
        });

        // Update auction data with the confirmed data from the backend
        setAuction(response.data);

        // Update the bidder map with the confirmed data from the backend
        if (response.data.bids) {
          const verifiedBidderMap = mapBidders(response.data.bids);
          setBidderMap(verifiedBidderMap);
        }
      } catch (error) {
        console.error('Error syncing with backend:', error);
      }
    }
  };

  useEffect(() => {
    const fetchAuction = async () => {
      try {
        const response = await axios.get(`https://rimelig-auksjon-backend.vercel.app/api/liveauctions/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
        });
        setAuction(response.data);
        setEndDate(new Date(response.data.endDate));
        calculateTimeLeft(new Date(response.data.endDate));

        // Create the initial bidder map based on the fetched auction data
        if (response.data.bids) {
          setBidderMap(mapBidders(response.data.bids));
        }
      } catch (error) {
        console.error('Error fetching auction details:', error);
      }
    };

    fetchAuction();
  }, [id]);

  useEffect(() => {
    if (auction) {
      const minsteBudøkning = parseFloat(auction.minsteBudøkning) || 100;
      const minimumBid = parseFloat(auction.highestBid) + minsteBudøkning;
      setBidAmount(minimumBid.toString());
    }
  }, [auction]);

  useEffect(() => {
    if (endDate) {
      const interval = setInterval(() => {
        calculateTimeLeft(endDate);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [endDate]);

  const calculateTimeLeft = (endDate) => {
    const difference = endDate - new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    } else {
      timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };
      setAuction(prevState => ({ ...prevState, status: 'Utgått' }));
    }

    setTimeLeft(timeLeft);
  };

  const handleBidSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    const parsedBidAmount = parseFloat(bidAmount);
    const minsteBudøkning = parseFloat(auction.minsteBudøkning) || 100;
    const minimumBid = parseFloat(auction.highestBid) + minsteBudøkning;

    if (!bidAmount || isNaN(parsedBidAmount)) {
      setError('Ugyldig budbeløp');
      return;
    }

    if (parsedBidAmount < minimumBid) {
      setError(`Bud må være større enn minimumsbudet på ${minimumBid},-`);
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setError('Du må være innlogget for å legge inn bud.');
        return;
      }

      // Send the bid via HTTP request for server validation
      const response = await axios.post(
        `https://rimelig-auksjon-backend.vercel.app/api/liveauctions/${id}/bid`,
        { bidAmount: parsedBidAmount },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        setSuccessMessage('Bud lagt inn vellykket!');
        
        // Emit WebSocket event for bid update
        socketRef.current.emit('placeBid', {
          auctionId: id,
          bidAmount: parsedBidAmount,
          bidderId: localStorage.getItem('userId') // Ensure this value exists in local storage
        });

        // Fetch the latest auction data from the backend after placing the bid
        const auctionResponse = await axios.get(`https://rimelig-auksjon-backend.vercel.app/api/liveauctions/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAuction(auctionResponse.data);
        setBidderMap(mapBidders(auctionResponse.data.bids));
        setBidAmount(auctionResponse.data.highestBid + auctionResponse.data.minsteBudøkning); // Update next bid amount
      } else {
        setError('Kunne ikke legge inn budet, prøv igjen.');
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Feil ved innlegging av bud. Prøv igjen.';
      setError(message);
      console.error('Error placing bid:', error.response?.data || error);
    }
  };

  const handleThumbnailClick = (index) => {
    setCurrentImageIndex(index);
  };

  if (!auction || !auction.imageUrls) {
    return (
      <div className="spinner-container-posted">
        <div className="spinner-posted"></div>
      </div>
    );
  }
  return (
    <div className="posted-auction-page fade-in-posted">
      <Header />
      <div className="auction-page">
        <div className="auction-gallery">
          <div className="main-image">
            <img
              src={auction.imageUrls[currentImageIndex]}
              alt={`Auksjonsbilde ${currentImageIndex + 1}`}
              className="posted-image-preview"
            />
          </div>
          <div className="thumbnail-gallery">
            {auction.imageUrls.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className={`thumbnail-image ${index === currentImageIndex ? 'active' : ''}`}
                onClick={() => handleThumbnailClick(index)}
              />
            ))}
          </div>
          <h1 className='posted-title'>{auction.brand} {auction.model} {auction.year} - {auction.mileage}KM</h1>
        </div>
        <div className="auction-info">
          <div className='info-top'>
            <div className='bid-and-finish'>
              <div className="posted-detail-item-top">
                <span className="detail-title">Høyeste bud:</span>
                <span className="top-value">{auction.highestBid},-</span>
              </div>
              <div className="posted-detail-item-top">
                <span className="detail-title">Avsluttes om:</span>
                <span className="top-value">{timeLeft.days}d {timeLeft.hours}t {timeLeft.minutes}min {timeLeft.seconds}sek</span>
              </div>
            </div>
          </div > 
            
          {auction.status !== 'Utgått' && (
            <div className="bid-section">
              <form onSubmit={handleBidSubmit}>
                <div className="form-group">
                  <label style={{ marginBottom: '3px'}} htmlFor="bidAmount">Budbeløp</label>
                  <small style={{ fontSize: '10px', marginBottom: '1px'}} className="form-text text-muted">
                    Beløpet som foreslås her er minimumsbudet. Du kan by mer om ønskelig.
                  </small>
                 
                  <input
                    type="number"
                    id="bidAmount"
                    name="bidAmount"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    required
                    min={parseFloat(auction.highestBid) + (parseFloat(auction.minsteBudøkning) || 100)}
                  />
                </div>
                <div className="posted-detail-item" >
                  <span className="detail-title">Minste budøkning:</span>
                  <span className="detail-value" style={{ color: 'red', fontWeight: 'bold' }}>
                    {auction.minsteBudøkning},-
                  </span>
                </div>
                <button type="submit" className="btn btn-primary">Legg inn bud</button>
                {error && <p className="error-message">{error}</p>}
                {successMessage && <p className="success-message">{successMessage}</p>}
              </form>
            </div>
          )}
          {auction.status === 'Utgått' && (
            <div className="auction-ended">
              <p>Auksjonen er avsluttet</p>
            </div>
          )}
          <div className="additional-info">
            <div className="posted-detail-item">
              <span className="detail-title">Avsluttes:</span>
              <span className="detail-value">{new Date(auction.endDate).toLocaleString()}</span>
            </div>
            <div className="posted-detail-item">
              <span className="detail-title">Selges av:</span>
              <span className="detail-value">{auction.seller}</span>
            </div>
            <div className="posted-detail-item">
              <span className="detail-title">Auksjonsgebyr:</span>
              <span className="detail-value">{auction.auksjonsgebyr},-</span>
            </div>
            <div className="posted-detail-item">
              <span className="detail-title">MVA:</span>
              <span className="detail-value">{auction.vat}</span>
            </div>
            <div className="posted-detail-item">
              <span className="detail-title">Sted:</span>
              <span className="detail-value">{auction.location} {auction.postkode}</span>
            </div>
          </div>
          <div className="bid-list">
  <h3>Budhistorikk</h3>
  {auction.bids && auction.bids.length > 0 ? (
    <table className="bid-history-table">

      <tbody>
        {auction.bids.map((bid, index) => (
          <tr key={index}>
            <td className="bidder-column">
            <img
              src="/images/Waiving-512-removebg-preview.png"
              alt="Bidder"
              className="bidder-image"
            />

              <span>{bidderMap[bid.bidder] || 'Anonym Budgiver'}</span>
            </td>
            <td>{bid.amount},-</td>
            <td>
              {new Date(bid.time).toLocaleTimeString('no-NO', {
                hour: '2-digit',
                minute: '2-digit',
              })}{' '}
              {new Date(bid.time).toLocaleDateString('no-NO')}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  ) : (
    <p>Ingen bud er gitt enda</p>
  )}
</div>



        </div>

        <div className="posted-auction-details">
          <div className='top-small-details'>
            <div className="posted-detail-item-bottom">
              <span className="detail-info-below">Beskrivelse</span>
              <span className="">{auction.description}</span>
              <span className="detail-info-below">Tilstand</span>
              <span className="">{auction.conditionDescription}</span>
              <span className="detail-info-below">Utstyr</span>
              {auction.equipment && (Array.isArray(auction.equipment) ? auction.equipment : auction.equipment.split(', ')).map((item, index) => (
                <span key={index} className="equipment-item">- {item}</span>
              ))}
            </div>
          </div>  
          <div className='posted-small-details'>
            <div className='posted-column'>
              <div className="posted-detail-item">
                <span className="detail-title">Har minstepris:</span>
                <span className="detail-value">{auction.auctionWithoutReserve ? "Ja" : "Nei"}</span>
              </div>
              <div className="posted-detail-item">
                <span className="detail-title">Drivstoff:</span>
                <span className="detail-value">{auction.fuel}</span>
              </div>
              <div className="posted-detail-item">
                <span className="detail-title">Girkasse:</span>
                <span className="detail-value">{auction.gearType}</span>
              </div>
              <div className="posted-detail-item">
                <span className="detail-title">Drivhjul:</span>
                <span className="detail-value">{auction.driveType}</span>
              </div>
              <div className="posted-detail-item">
                <span className="detail-title">Hovedfarge:</span>
                <span className="detail-value">{auction.mainColor}</span>
              </div>
              <div className="posted-detail-item">
                <span className="detail-title">Effekt:</span>
                <span className="detail-value">{auction.power} kW</span>
              </div>
              <div className="posted-detail-item">
                <span className="detail-title">Seter:</span>
                <span className="detail-value">{auction.seats}</span>
              </div>
              <div className="posted-detail-item">
                <span className="detail-title">Vekt:</span>
                <span className="detail-value">{auction.weight} kg</span>
              </div>
              <div className="posted-detail-item">
                <span className="detail-title">Dører:</span>
                <span className="detail-value">{auction.doors}</span>
              </div>
            </div>
            <div className='posted-column'>
              <div className="posted-detail-item">
                <span className="detail-title">Antall eiere:</span>
                <span className="detail-value">{auction.owners}</span>
              </div>
              <div className="posted-detail-item">
                <span className="detail-title">Første registrering:</span>
                <span className="detail-value">{auction.firstRegistration}</span>
              </div>
              <div className="posted-detail-item">
                <span className="detail-title">Avgiftsklasse:</span>
                <span className="detail-value">{auction.taxClass}</span>
              </div>
              <div className="posted-detail-item">
                <span className="detail-title">CO2-utslipp:</span>
                <span className="detail-value">{auction.co2} g/km</span>
              </div>
              <div className="posted-detail-item">
                <span className="detail-title">Omregistreringsavgift:</span>
                <span className="detail-value">{auction.omregistreringsavgift}</span>
              </div>
              <div className="posted-detail-item">
                <span className="detail-title">Sist godkjent EU-kontroll:</span>
                <span className="detail-value">{auction.lastEUApproval}</span>
              </div>
              <div className="posted-detail-item">
                <span className="detail-title">Chassisnr:</span>
                <span className="detail-value">{auction.chassisNumber}</span>
              </div>
              <div className="posted-detail-item">
                <span className="detail-title">Neste EU-kontroll:</span>
                <span className="detail-value">{auction.nextEUControl}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default PostedAuction;
