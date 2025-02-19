import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Header from './Header';
import './LiveAuctions.css';
import Footer from './Footer';

// Debounce Hook
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

function LiveAuctions() {
  const [liveAuctions, setLiveAuctions] = useState([]);
  const [timeLeftMap, setTimeLeftMap] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const [filterCounts, setFilterCounts] = useState({});
  const [filters, setFilters] = useState({
    
    brand: [],
    model: '',
    year: '',
    location: [],
    minPrice: '',
    maxPrice: '',
    karosseri: [],
    fuel: [],
    gearType: [],
    driveType: [],
    auctionDuration: '',
    reservePrice: '',
    auctionWithoutReserve: false,
    category: '',
  });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortOption, setSortOption] = useState('avsluttes-forst');

  const navigate = useNavigate();
  const location = useLocation();

  // Debounce filters for better performance
  const debouncedFilters = useDebounce(filters, 300);

  useEffect(() => {
    const path = location.pathname.split('/');
    const categoryPath = path[path.length - 1];
    const categoryMap = {
      bil: 'car',
      bat: 'boat',
      mc: 'motorcycle',
      torg: 'marketplace',
    };

    const category = categoryMap[categoryPath] || '';
    setFilters((prevFilters) => ({
      ...prevFilters,
      category,
      brand: [],
      karosseri: [],
      location: [],
      fuel: [],
      gearType: [],
      driveType: [],
    }));
    setPage(1);
  }, [location.pathname]);

  useEffect(() => {
    fetchLiveAuctions();
  }, [debouncedFilters, page, sortOption]);

  const fetchLiveAuctions = useCallback(async () => {
    setLoading(true);
    try {
      const activeFilters = Object.fromEntries(
        Object.entries(debouncedFilters).filter(
          ([, value]) => value && (Array.isArray(value) ? value.length > 0 : true)
        )
      );

      const queryParams = { page, limit: 10, ...activeFilters };
      const token = localStorage.getItem('accessToken');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await axios.get(
        'https://nettside-mal-ki24.vercel.app/api/liveauctions/filter',
        { params: queryParams, headers }
      );

      setLiveAuctions((prevAuctions) =>
        page === 1 ? response.data : [...prevAuctions, ...response.data]
      );
      setError(null);
    } catch (error) {
      console.error('Error fetching live auctions:', error);
      setError('Kunne ikke hente live auksjoner. Prøv igjen senere.');
    }
    setLoading(false);
  }, [debouncedFilters, page, sortOption]);

  const handleCheckboxChange = (e) => {
    const { name, value, checked } = e.target;
    const newValue = name === 'brand' ? value.toUpperCase() : value;

    setFilters((prevFilters) => {
      const updatedValues = checked
        ? [...prevFilters[name], newValue]
        : prevFilters[name].filter((v) => v !== newValue);

      return {
        ...prevFilters,
        [name]: updatedValues,
      };
    });
    setPage(1);
  };

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setPage(1);
  };

  const calculateTimeLeft = (endDate) => {
    const difference = new Date(endDate) - new Date();
    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  };
 
  const handleSortChange = (e) => {
    setSortOption(e.target.value);
    setPage(1);
    setLiveAuctions([]); // Clear auctions on sort change
  };
  // Oppdatert fetchFilterCounts funksjon
const fetchFilterCounts = useCallback(async () => {
  try {
    const token = localStorage.getItem('accessToken');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    // Send gjeldende kategori som en parameter
    const response = await axios.get(
      'https://nettside-mal-ki24.vercel.app/api/liveauctions/counts',
      { params: { category: filters.category }, headers }
    );

    setFilterCounts(response.data); // Forvent at backend returnerer en struktur som matcher filterCounts
  } catch (error) {
    console.error('Error fetching filter counts:', error);
  }
}, [filters.category]);

// Kall fetchFilterCounts når kategori eller filtre oppdateres
useEffect(() => {
  fetchFilterCounts();
}, [filters.category, fetchFilterCounts]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeftMap((prevTimeLeftMap) => {
        const updatedTimeLeftMap = { ...prevTimeLeftMap };
        liveAuctions.forEach((auction) => {
          updatedTimeLeftMap[auction._id] = calculateTimeLeft(auction.endDate);
        });
        return updatedTimeLeftMap;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [liveAuctions]);

  
  return (
    <div>
      <Header onCategorySelect={(category) => handleFilterChange({ target: { name: 'category', value: category } })} />
      <div className="whole-container">
        <div className="live-auctions-container">
          <aside className="filters-section">
            <p className="kategoribiltitle">Kategori / Bil</p>
            <h2>Filtrer auksjoner</h2>
            <button
              type="button"
              className="toggle-filters-button"
              onClick={() => setShowFilters(!showFilters)}
            >
              {showFilters ? 'Skjul filtre' : 'Vis søkefiltre'}
            </button>
            <form className={showFilters ? 'filters-form open' : 'filters-form'}>
              <div className="filter-group">
                <h3>Karosseri</h3>
                {['Stasjonsvogn', 'Cabriolet', 'Kombi 5-dørs', 'Flerbruksbil', 'Pickup', 'Kombi 3-dørs', 'Sedan', 'Coupe', 'SUV/Offroad', 'Kasse'].map((type) => (
                  <div key={type}>
                    <input
                      type="checkbox"
                      id={type}
                      name="karosseri"
                      value={type}
                      checked={filters.karosseri.includes(type)}
                      onChange={handleCheckboxChange}
                    />
                    <label htmlFor={type}>{type} ({filterCounts.karosseri?.[type] || 0})</label>
                  </div>
                ))}
              </div>
              {/* Other filter groups like Brand, GearType, Fuel, etc. */}
              <div className="filter-group">
                <h3>Merke</h3>
                {[
                  'Audi', 'BMW', 'BYD', 'Chevrolet', 'Chrysler', 'Citroen', 'Dodge', 'Ferrari', 'Fiat', 'Ford', 
                  'Honda', 'Hyundai', 'Jaguar', 'Jeep', 'Kia', 'Lamborghini', 'Land Rover', 'Lexus', 'Maserati', 
                  'Mazda', 'Mercedes-Benz', 'Mini', 'Mitsubishi', 'Nissan', 'Opel', 'Peugeot', 'Porsche', 'Renault', 
                  'Rolls Royce', 'Saab', 'Seat', 'Skoda', 'Subaru', 'Suzuki', 'Tesla', 'Toyota', 'Volkswagen', 'Volvo'
                ].map(brand => (
                  <div key={brand}>
                    <input
                      type="checkbox"
                      id={brand}
                      name="brand"
                      value={brand.toUpperCase()}
                      checked={filters.brand.includes(brand.toUpperCase())}
                      onChange={handleCheckboxChange}
                    />
                    <label htmlFor={brand}>{brand} ({filterCounts.brand?.[brand.toUpperCase()] || 0})</label>
                  </div>
                ))}
              </div>
              <div className="filter-group">
                <label htmlFor="model">Modell</label>
                <input
                  type="text"
                  id="model"
                  name="model"
                  value={filters.model}
                  onChange={handleFilterChange}
                />
              </div>
              <div className="filter-group">
                <label htmlFor="year">Årsmodell</label>
                <input
                  type="number"
                  id="year"
                  name="year"
                  value={filters.year}
                  onChange={handleFilterChange}
                />
              </div>
              <div className="filter-group">
                <h3>Fylke</h3>
                {['Akershus', 'Aust-Agder', 'Buskerud', 'Finnmark', 'Hedmark', 'Hordaland', 'Møre og Romsdal', 'Nordland', 'Nord-Trøndelag', 'Oppland', 'Oslo', 'Rogaland', 'Sogn og Fjordane', 'Sør-Trøndelag', 'Telemark', 'Troms', 'Vest-Agder', 'Vestfold', 'Østfold'].map(location => (
                  <div key={location}>
                    <input
                      type="checkbox"
                      id={location}
                      name="location"
                      value={location}
                      checked={filters.location.includes(location)}
                      onChange={handleCheckboxChange}
                    />
                    <label htmlFor={location}>{location} ({filterCounts.location?.[location] || 0})</label>
                  </div>
                ))}
              </div>
              <div className="filter-group">
                <label htmlFor="minPrice">Min Pris</label>
                <input
                  type="number"
                  id="minPrice"
                  name="minPrice"
                  value={filters.minPrice}
                  onChange={handleFilterChange}
                />
              </div>
              <div className="filter-group">
                <label htmlFor="maxPrice">Max Pris</label>
                <input
                  type="number"
                  id="maxPrice"
                  name="maxPrice"
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                />
              </div>
              <div className="filter-group">
                <label htmlFor="auctionWithoutReserve">Uten Minstepris</label>
                <input
                  type="checkbox"
                  id="auctionWithoutReserve"
                  name="auctionWithoutReserve"
                  checked={filters.auctionWithoutReserve}
                  onChange={handleFilterChange}
                />
              </div>
              <div className="filter-group">
                <label htmlFor="auctionDuration">Auksjonsvarighet (dager)</label>
                <input
                  type="number"
                  id="auctionDuration"
                  name="auctionDuration"
                  value={filters.auctionDuration}
                  onChange={handleFilterChange}
                />
              </div>
              <div className="filter-group">
                <h3>Drivstoff</h3>
                {['Bensin', 'Diesel', 'Elektrisitet', 'Hybrid'].map(fuel => (
                  <div key={fuel}>
                    <input
                      type="checkbox"
                      id={fuel}
                      name="fuel"
                      value={fuel}
                      checked={filters.fuel.includes(fuel)}
                      onChange={handleCheckboxChange}
                    />
                    <label htmlFor={fuel}>{fuel} ({filterCounts.fuel?.[fuel] || 0})</label>
                  </div>
                ))}
              </div>
              <div className="filter-group">
                <h3>Girtype</h3>
                {['Automat', 'Manuell'].map(gearType => (
                  <div key={gearType}>
                    <input
                      type="checkbox"
                      id={gearType}
                      name="gearType"
                      value={gearType}
                      checked={filters.gearType.includes(gearType)}
                      onChange={handleCheckboxChange}
                    />
                    <label htmlFor={gearType}>{gearType} ({filterCounts.gearType?.[gearType] || 0})</label>
                  </div>
                ))}
              </div>
              <div className="filter-group">
                <h3>Hjuldrift</h3>
                {['Bakhjulstrekk', 'Firehjulstrekk', 'Framhjulstrekk'].map(driveType => (
                  <div key={driveType}>
                    <input
                      type="checkbox"
                      id={driveType}
                      name="driveType"
                      value={driveType}
                      checked={filters.driveType.includes(driveType)}
                      onChange={handleCheckboxChange}
                    />
                    <label htmlFor={driveType}>{driveType} ({filterCounts.driveType?.[driveType] || 0})</label>
                  </div>
                ))}
              </div>
              </form>
          </aside>
          <section className="auctions-section">
            <div className="sort-options">
              <label htmlFor="sort">Sorter etter:</label>
              <select id="sort" value={sortOption} onChange={handleSortChange}>
                <option value="avsluttes-forst">Avsluttes først</option>
                <option value="avsluttes-sist">Avsluttes sist</option>
                <option value="nyeste-auksjoner">Nyeste auksjoner</option>
                <option value="hoyeste-bud">Høyeste bud</option>
                <option value="laveste-bud">Laveste bud</option>
              </select>
            </div>
            {loading ? (
  <div className="spinner-container-live">
    <div className="spinner-live"></div>
  </div>
) : error ? (
  <p className="error-message">{error}</p>
) : liveAuctions.length === 0 ? (
  <p>Ingen aktive auksjoner for øyeblikket</p>
) : (
  liveAuctions.map((auction) => {
    const timeLeft = calculateTimeLeft(auction.endDate);
    const formattedDate = new Date(auction.endDate).toLocaleDateString('no-NO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    return (
      <div
        key={auction._id}
        className="auction-item fade-in-live" // Legg til fade-in klasse
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
          className="liveauction-auction-image"
        />
        <div className="auction-info">
          <h2>
            {auction.brand.toUpperCase()} {auction.model.toUpperCase()} - {auction.year} -{' '}
            {auction.mileage}
          </h2>

          <div className="auction-detail">
            <span className="left-text">
              <strong>Avsluttes:</strong>
            </span>
            <span
              className="right-text"
              style={{ color: 'rgb(211, 13, 13)', fontWeight: 'bold' }}
            >
              {new Date(auction.endDate).toLocaleDateString('no-NO', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>

          <div className="auction-detail">
            <span className="left-text">
              <strong>Gjenstår:</strong>
            </span>
            <span
              className="right-text"
              style={{ color: 'rgb(211, 13, 13)', fontWeight: 'bold' }}
            >
              {timeLeft.days} Dager {timeLeft.hours}t {timeLeft.minutes}min {timeLeft.seconds}sek
            </span>
          </div>

          <div className="auction-detail">
            <span className="left-text">
              <strong>Høyeste Bud:</strong>
            </span>
            <span
              className="right-text"
              style={{ color: 'rgb(211, 13, 13)', fontWeight: 'bold' }}
            >
              {auction.highestBid},-
            </span>
          </div>

          <div className="auction-detail">
            <span className="left-text">
              <strong>Sted:</strong>
            </span>
            <span
              className="right-text"
              style={{ color: 'rgb(211, 13, 13)', fontWeight: 'bold' }}
            >
              {auction.postkode} {auction.sted}
            </span>
          </div>
        </div>
      </div>
    );
  })
)}

          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default LiveAuctions;