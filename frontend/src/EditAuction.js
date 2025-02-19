import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './EditAuction.css';

function EditAuction() {
  const { id } = useParams();
  const [auction, setAuction] = useState(null);
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchAuction = async () => {
      try {
        const response = await axios.get(`https://nettside-mal-ki24.vercel.app/api/auctions/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setAuction(response.data);
        setImages(response.data.images || []);
      } catch (error) {
        console.error('Feil ved henting av auksjon:', error);
      }
    };
    fetchAuction();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAuction(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const imagePromises = files.map(file => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    Promise.all(imagePromises).then(images => {
      setImages(prevImages => [...prevImages, ...images]);
    });
  };

  const handleSave = async () => {
    try {
      await axios.put(`https://nettside-mal-ki24.vercel.app/api/auctions/${id}`, { ...auction, images }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      alert('Auksjon oppdatert');
    } catch (error) {
      console.error('Feil ved oppdatering av auksjon:', error);
    }
  };

  const handleRemoveImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  if (!auction) return <div>Laster...</div>;

  return (
    <div className="edit-auction-container">
      <div className="edit-auction-form">
        <h1>Rediger Auksjon</h1>
        <form>
        <div className="form-group">
            <label htmlFor="description">Beskrivelse</label>
            <textarea id="description" name="description" value={auction.description} onChange={handleChange}></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="auctionDuration">Auksjonsvarighet (dager)</label>
            <input type="number" id="auctionDuration" name="auctionDuration" value={auction.auctionDuration} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="reservePrice">Minstepris</label>
            <input type="number" id="reservePrice" name="reservePrice" value={auction.reservePrice} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="auctionWithoutReserve">Selges uten minstepris</label>
            <select id="auctionWithoutReserve" name="auctionWithoutReserve" value={auction.auctionWithoutReserve} onChange={handleChange}>
              <option value={false}>Nei</option>
              <option value={true}>Ja</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="regNumber">Registreringsnummer</label>
            <input type="text" id="regNumber" name="regNumber" value={auction.regNumber} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="brand">Merke</label>
            <input type="text" id="brand" name="brand" value={auction.brand} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="model">Modell</label>
            <input type="text" id="model" name="model" value={auction.model} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="year">År</label>
            <input type="number" id="year" name="year" value={auction.year} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="chassisNumber">Chassisnummer</label>
            <input type="text" id="chassisNumber" name="chassisNumber" value={auction.chassisNumber} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="taxClass">Avgiftsklasse</label>
            <input type="text" id="taxClass" name="taxClass" value={auction.taxClass} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="fuel">Drivstoff</label>
            <input type="text" id="fuel" name="fuel" value={auction.fuel} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="gearType">Girtype</label>
            <input type="text" id="gearType" name="gearType" value={auction.gearType} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="driveType">Driftstype</label>
            <input type="text" id="driveType" name="driveType" value={auction.driveType} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="mainColor">Hovedfarge</label>
            <input type="text" id="mainColor" name="mainColor" value={auction.mainColor} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="power">Effekt</label>
            <input type="text" id="power" name="power" value={auction.power} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="seats">Antall seter</label>
            <input type="number" id="seats" name="seats" value={auction.seats} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="owners">Antall eiere</label>
            <input type="text" id="owners" name="owners" value={auction.owners} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="firstRegistration">Førstegangsregistrering</label>
            <input type="date" id="firstRegistration" name="firstRegistration" value={auction.firstRegistration} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="doors">Antall dører</label>
            <input type="number" id="doors" name="doors" value={auction.doors} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="weight">Egenvekt</label>
            <input type="number" id="weight" name="weight" value={auction.weight} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="co2">CO2-utslipp</label>
            <input type="text" id="co2" name="co2" value={auction.co2} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="omregistreringsavgift">Omregistreringsavgift</label>
            <input type="text" id="omregistreringsavgift" name="omregistreringsavgift" value={auction.omregistreringsavgift} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="lastEUApproval">Sist EU-godkjent</label>
            <input type="date" id="lastEUApproval" name="lastEUApproval" value={auction.lastEUApproval} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="nextEUControl">Neste EU-kontroll</label>
            <input type="date" id="nextEUControl" name="nextEUControl" value={auction.nextEUControl} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="conditionDescription">Tilstandsbeskrivelse</label>
            <textarea id="conditionDescription" name="conditionDescription" value={auction.conditionDescription} onChange={handleChange}></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="equipment">Utstyr</label>
            <textarea id="equipment" name="equipment" value={auction.equipment.join(', ')} onChange={(e) => setAuction(prevState => ({
              ...prevState,
              equipment: e.target.value.split(',').map(item => item.trim())
            }))}></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="description">Beskrivelse</label>
            <textarea id="description" name="description" value={auction.description} onChange={handleChange}></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="høyesteBud">Høyeste bud</label>
            <input type="number" id="høyesteBud" name="høyesteBud" value={auction.høyesteBud} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="auksjonsNummer">Auksjonsnummer</label>
            <input type="text" id="auksjonsNummer" name="auksjonsNummer" value={auction.auksjonsNummer} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="budAntall">Antall bud</label>
            <input type="number" id="budAntall" name="budAntall" value={auction.budAntall} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="budgivereAntall">Antall budgivere</label>
            <input type="number" id="budgivereAntall" name="budgivereAntall" value={auction.budgivereAntall} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="minsteprisOppnådd">Minstepris oppnådd</label>
            <select id="minsteprisOppnådd" name="minsteprisOppnådd" value={auction.minsteprisOppnådd} onChange={handleChange}>
              <option value={false}>Nei</option>
              <option value={true}>Ja</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="nåværendeBud">Nåværende bud</label>
            <input type="number" id="nåværendeBud" name="nåværendeBud" value={auction.nåværendeBud} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="avsluttesOm">Avsluttes om (dager)</label>
            <input type="number" id="avsluttesOm" name="avsluttesOm" value={auction.avsluttesOm} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="avsluttesDato">Avsluttes dato</label>
            <input type="datetime-local" id="avsluttesDato" name="avsluttesDato" value={auction.avsluttesDato} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="forlengelseEtterSisteBud">Forlengelse etter siste bud (minutter)</label>
            <input type="number" id="forlengelseEtterSisteBud" name="forlengelseEtterSisteBud" value={auction.forlengelseEtterSisteBud} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="selgesAv">Selges av</label>
            <input type="text" id="selgesAv" name="selgesAv" value={auction.selgesAv} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="næringsvirksomhet">I næringsvirksomhet</label>
            <select id="næringsvirksomhet" name="næringsvirksomhet" value={auction.næringsvirksomhet} onChange={handleChange}>
              <option value={false}>Nei</option>
              <option value={true}>Ja</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="minsteBudøkning">Minste budøkning</label>
            <input type="number" id="minsteBudøkning" name="minsteBudøkning" value={auction.minsteBudøkning} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="auksjonsgebyr">Auksjonsgebyr</label>
            <input type="number" id="auksjonsgebyr" name="auksjonsgebyr" value={auction.auksjonsgebyr} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="mva">MVA</label>
            <select id="mva" name="mva" value={auction.mva} onChange={handleChange}>
              <option value="mva-fritt">MVA-fritt</option>
              <option value="inkl. mva">Inkl. MVA</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="månedligFinansiering">Månedsbeløp ved finansiering</label>
            <input type="number" id="månedligFinansiering" name="månedligFinansiering" value={auction.månedligFinansiering} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="sted">Sted</label>
            <input type="text" id="sted" name="sted" value={auction.sted} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="postkode">Postkode</label>
            <input type="text" id="postkode" name="postkode" value={auction.postkode} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="by">By</label>
            <input type="text" id="by" name="by" value={auction.by} onChange={handleChange} />
          </div>
         <div className="form-group">
            <label htmlFor="images">Bilder</label>
            <input type="file" id="images" multiple accept="image/*" onChange={handleImageChange} />
            <div className="image-preview">
              {images.map((image, index) => (
                <div key={index} className="image-container">
                  <img src={image} alt={`Auksjonsbilde ${index + 1}`} />
                  <button type="button" onClick={() => handleRemoveImage(index)}>Fjern bilde</button>
                </div>
              ))}
            </div>
          </div>
          <button type="button" onClick={handleSave}>Lagre Auksjon</button>
        </form>
      </div>
      <div className="auction-preview">
        <h2>Eksempel på annonse</h2>
        <div className="auction-details">
          <p><strong>Beskrivelse:</strong> {auction.description}</p>
          <p><strong>Høyeste bud:</strong> {auction.høyesteBud}</p>
          <p><strong>Auksjonsnummer:</strong> {auction.auksjonsNummer}</p>
          <p><strong>Antall bud:</strong> {auction.budAntall}</p>
          <p><strong>Antall budgivere:</strong> {auction.budgivereAntall}</p>
          <p><strong>Minstepris oppnådd:</strong> {auction.minsteprisOppnådd ? 'Ja' : 'Nei'}</p>
          <p><strong>Nåværende bud:</strong> {auction.nåværendeBud}</p>
          <p><strong>Avsluttes om:</strong> {auction.avsluttesOm} dager</p>
          <p><strong>Avsluttes dato:</strong> {new Date(auction.avsluttesDato).toLocaleString()}</p>
          <p><strong>Forlengelse etter siste bud:</strong> {auction.forlengelseEtterSisteBud} minutter</p>
          <p><strong>Selges av:</strong> {auction.selgesAv}</p>
          <p><strong>I næringsvirksomhet:</strong> {auction.næringsvirksomhet ? 'Ja' : 'Nei'}</p>
          <p><strong>Minste budøkning:</strong> {auction.minsteBudøkning}</p>
          <p><strong>Auksjonsgebyr:</strong> {auction.auksjonsgebyr}</p>
          <p><strong>MVA:</strong> {auction.mva}</p>
          <p><strong>Månedsbeløp ved finansiering:</strong> {auction.månedligFinansiering}</p>
          <p><strong>Sted:</strong> {auction.sted}</p>
          <p><strong>Postkode:</strong> {auction.postkode}</p>
          <p><strong>By:</strong> {auction.by}</p>
          <p><strong>Registreringsnummer:</strong> {auction.regNumber}</p>
          <p><strong>Chassisnummer:</strong> {auction.chassisNumber}</p>
          <p><strong>Avgiftsklasse:</strong> {auction.taxClass}</p>
          <p><strong>Drivstoff:</strong> {auction.fuel}</p>
          <p><strong>Girtype:</strong> {auction.gearType}</p>
          <p><strong>Driftstype:</strong> {auction.driveType}</p>
          <p><strong>Hovedfarge:</strong> {auction.mainColor}</p>
          <p><strong>Effekt:</strong> {auction.power}</p>
          <p><strong>Antall seter:</strong> {auction.seats}</p>
          <p><strong>Antall eiere:</strong> {auction.owners}</p>
          <p><strong>Førstegangsregistrering:</strong> {auction.firstRegistration}</p>
          <p><strong>Antall dører:</strong> {auction.doors}</p>
          <p><strong>Egenvekt:</strong> {auction.weight}</p>
          <p><strong>CO2-utslipp:</strong> {auction.co2}</p>
          <p><strong>Omregistreringsavgift:</strong> {auction.omregistreringsavgift}</p>
          <p><strong>Sist EU-godkjent:</strong> {auction.lastEUApproval}</p>
          <p><strong>Neste EU-kontroll:</strong> {auction.nextEUControl}</p>
          <p><strong>Tilstandsbeskrivelse:</strong> {auction.conditionDescription}</p>
          <p><strong>Utstyr:</strong> {auction.equipment.join(', ')}</p>
          <div className="image-gallery">
            {images.map((image, index) => (
              <img key={index} src={image} alt={`Auksjonsbilde ${index + 1}`} className="image-preview" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditAuction;

