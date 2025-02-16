import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const AuctionList = () => {
  const [auctions, setAuctions] = useState([]);

  useEffect(() => {
    fetch('https://rimelig-auksjon-backend.vercel.app/api/auctions')
      .then(response => response.json())
      .then(data => setAuctions(data))
      .catch(error => console.error('Error fetching auctions:', error));
  }, []);

  return (
    <div>
      <h1>All Auctions</h1>
      <ul>
        {auctions.map(auction => (
          <li key={auction._id}>
            <Link to={`/auction/${auction._id}`}>{auction.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AuctionList;
