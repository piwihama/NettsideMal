import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section about">
          <h3>Om Oss</h3>
          <p>
            Vi er en moderne auksjonstjeneste som tilbyr en enkel og sikker måte å kjøpe og selge på nettet.
          </p>
        </div>

        <div className="footer-section links">
          <h3>Lenker</h3>
          <ul>
            <li><a href="/info">Om oss</a></li>
            <li><a href="/info">Kontakt oss</a></li>
            <li><a href="/info">Personvern</a></li>
            <li><a href="/info">Vilkår</a></li>
          </ul>
        </div>

        <div className="footer-section social">
          <h3>Følg Oss</h3>
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-instagram"></i>
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2024 Rimeligauksjon AS | Alle rettigheter reservert</p>
      </div>
    </footer>
  );
}

export default Footer;
