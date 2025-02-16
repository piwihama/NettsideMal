// src/Torg.js

import Header from './Header';

import React from 'react';

function Torg() {
  return (
    <div>
           <Header />
    <div className='d-flex flex-column justify-content-center align-items-center vh-100 bg-light'>
      <h1>Torg</h1>
      <p>Her finner du informasjon om torget.</p>
    </div>
    </div>
  );
}

export default Torg;
