// src/NewAuction.js

import React from 'react';
import { Link } from 'react-router-dom';
import './NewAuction.css'; // Importer CSS for å style komponenten
import Header from './Header'; // Make sure this points to your Header component
import Footer from './Footer';  // Juster stien hvis Footeren ligger et annet sted


function NewAuction() {
  return (
    <div>
            <Header />

    <div className='new-auction-container'>
      
      <h1>Ny Auksjon</h1>
      <p>Velg hvilken type auksjon du vil opprette:</p>
      <div className='auction-category-buttons'>
        <Link to="/bilform" className="category-button">
          Bil
        </Link>
        <Link to="/båt" className="category-button">
          Båt
        </Link>
        <Link to="/mcform" className="category-button">
  MC
</Link>

        <Link to="/torg" className="category-button">
          Torg
        </Link>
      </div>
    </div>
    <Footer />

    </div>
  );
}

export default NewAuction;
