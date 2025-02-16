// src/Båt.js

import React from 'react';
import Header from './Header';

function Båt() {
  return (
    <div>
           <Header />
    <div className='d-flex flex-column justify-content-center align-items-center vh-100 bg-light'>
      <h1>Båt</h1>
      <p>Her finner du informasjon om båter.</p>
    </div>
    </div>
  );
}

export default Båt;
