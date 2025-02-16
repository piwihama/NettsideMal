import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import './SearchResults.css';
import Header from './Header';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function SearchResults() {
  const [results, setResults] = useState([]);
  const query = useQuery();

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const searchTerm = query.get('q');
        const response = await axios.get(`https://rimelig-auksjon-backend.vercel.app/api/search?q=${searchTerm}`);
        setResults(response.data);
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
    };

    fetchResults();
  }, [query]);

  return (
    <div>
        < Header />
    <div className="search-results-container">
      <h2>Søkeresultater for "{query.get('q')}"</h2>
      <div className="search-results-list">
        {results.map((result) => (
          <div key={result._id} className="search-result-item">
            <img src={result.images[0]} alt={`${result.brand} ${result.model}`} className="search-result-image" />
            <div className="search-result-details">
              <h3>{result.brand} {result.model} {result.year}</h3>
              <p><strong>Høyeste bud: </strong>{result.highestBid}</p>
              <p><strong>Status: </strong>{result.status}</p>
              <p>{result.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
    </div>

  );
}

export default SearchResults;
