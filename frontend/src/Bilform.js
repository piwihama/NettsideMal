/**import React, { useState } from 'react';
import './BilForm.css';

function BilForm() {
  const [regNumber, setRegNumber] = useState('');
  const [carData, setCarData] = useState({
    brand: '',
    model: '',
    year: '',
    designation: '',
    auctionTitle: '',
    mileage: '',
    description: '',
    conditionDescription: '',
    bodyType: '',
    chassisNumber: '',
    taxClass: '',
    fuel: '',
    gearType: '',
    driveType: '',
    mainColor: '',
    power: '',
    seats: '',
    owners: '',
    firstRegistration: '',
    interiorColor: '',
    hideRegNumber: false,
    doors: '',
    weight: '',
    co2: '',
    omregistreringsavgift: '',
    lastEUApproval: '',
    nextEUControl: '',
    equipment: [],
    auctionWithoutReserve: false,
    reservePrice: '',
    auctionDuration: '3',
  });

  const [errors, setErrors] = useState({});

  const handleFetchCarData = async () => {
    try {
      const response = await fetch(`http://localhost:8081/api/carinfo/${regNumber}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const carInfo = data.kjoretoydataListe[0];
      const tekniskeData = carInfo.godkjenning.tekniskGodkjenning.tekniskeData;
      const karosseri = tekniskeData.karosseriOgLasteplan;

      const drivverk = tekniskeData.motorOgDrivverk || {};
      const eierskap = carInfo.eierskap || {};
      const miljodata = tekniskeData.miljodata || {};
      const forbrukOgUtslipp = miljodata.forbrukOgUtslipp || [];
      
      setCarData({
        ...carData,
        brand: tekniskeData.generelt.merke?.[0]?.merke || '',
        model: tekniskeData.generelt.handelsbetegnelse?.[0] || '',
        year: carInfo.godkjenning.forstegangsGodkjenning.forstegangRegistrertDato?.split('-')[0] || '',
        designation: tekniskeData.generelt.handelsbetegnelse?.[0] || '',
        auctionTitle: `${carInfo.godkjenning.forstegangsGodkjenning.forstegangRegistrertDato?.split('-')[0] || ''} ${tekniskeData.generelt.merke?.[0]?.merke || ''} ${tekniskeData.generelt.handelsbetegnelse?.[0] || ''}`,
        bodyType: karosseri.karosseritype?.kodeBeskrivelse || '',
        chassisNumber: carInfo.kjoretoyId.understellsnummer || '',
        taxClass: carInfo.godkjenning.tekniskGodkjenning.kjoretoyklassifisering?.beskrivelse || '',
        fuel: miljodata.miljoOgdrivstoffGruppe?.[0]?.drivstoffKodeMiljodata?.kodeNavn || '',
        gearType: drivverk.girkassetype?.kodeBeskrivelse || '',
        driveType: drivverk.kjoresystem?.kodeBeskrivelse || '',
        mainColor: tekniskeData.karosseriOgLasteplan.rFarge?.[0]?.kodeNavn || '',
        power: drivverk.motor?.[0]?.maksNettoEffekt || '',
        seats: tekniskeData.persontall.sitteplasserTotalt || '',
        owners: eierskap.antall || '',
        firstRegistration: carInfo.godkjenning.forstegangsGodkjenning.forstegangRegistrertDato || '',
        doors: karosseri.antallDorer?.[0] || '',
        weight: tekniskeData.vekter?.egenvekt || '',
        co2: forbrukOgUtslipp?.[0]?.co2BlandetKjoring || '',
        omregistreringsavgift: carInfo.omregistreringsavgift || '',
        lastEUApproval: carInfo.periodiskKjoretoyKontroll?.sistGodkjent || '',
        nextEUControl: carInfo.periodiskKjoretoyKontroll?.kontrollfrist || '',
        description: carData.description,
        conditionDescription: carData.conditionDescription,
        hideRegNumber: carData.hideRegNumber,
        equipment: carData.equipment,
        auctionWithoutReserve: carData.auctionWithoutReserve,
        reservePrice: carData.reservePrice,
        auctionDuration: carData.auctionDuration,
        mileage: carData.mileage,
        interiorColor: carData.interiorColor,
      });
    } catch (error) {
      console.error('Error fetching car data:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCarData({
      ...carData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleFileChange = (e) => {
    // Handle file uploads here if needed
  };

  const validate = () => {
    const newErrors = {};
    if (!carData.brand) newErrors.brand = 'Merke er påkrevd';
    if (!carData.model) newErrors.model = 'Modell er påkrevd';
    if (!carData.year) newErrors.year = 'År er påkrevd';
    if (!carData.mileage) newErrors.mileage = 'Kilometerstand er påkrevd';
    if (!carData.description) newErrors.description = 'Beskrivelse er påkrevd';
    if (!carData.conditionDescription) newErrors.conditionDescription = 'Tilstandsbeskrivelse er påkrevd';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }
    try {
        const response = await fetch('http://localhost:8082/api/auctions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(carData),
        });
        const result = await response.json();
        if (response.ok) {
            console.log('Auction created successfully:', result);
            // Handle success, e.g., redirect or show a success message
        } else {
            console.error('Error creating auction:', result);
            // Handle error, e.g., show an error message
        }
    } catch (error) {
        console.error('Error submitting form:', error);
    }
  };

  return (
    <div className='bil-container'>
      <form className='bil-form' onSubmit={handleSubmit}>
        <div className='form-group'>
          <label htmlFor='regNumber'>Reg.nr</label>
          <input
            type='text'
            id='regNumber'
            name='regNumber'
            value={regNumber}
            onChange={(e) => setRegNumber(e.target.value)}
            className='form-control'
          />
          <button type='button' className='btn btn-primary fetch-button' onClick={handleFetchCarData}>
            Fetch Data
          </button>
        </div>
        <div className='form-group'>
          <label htmlFor='brand'>Merke</label>
          <input
            type='text'
            id='brand'
            name='brand'
            value={carData.brand}
            onChange={handleChange}
            className={`form-control ${errors.brand ? 'is-invalid' : ''}`}
            placeholder='Merke'
            readOnly
          />
          {errors.brand && <div className='invalid-feedback'>{errors.brand}</div>}
        </div>
        <div className='form-group'>
          <label htmlFor='model'>Modell</label>
          <input
            type='text'
            id='model'
            name='model'
            value={carData.model}
            onChange={handleChange}
            className={`form-control ${errors.model ? 'is-invalid' : ''}`}
            placeholder='Modell'
            readOnly
          />
          {errors.model && <div className='invalid-feedback'>{errors.model}</div>}
        </div>
        <div className='form-group'>
          <label htmlFor='year'>Årsmodell</label>
          <input
            type='text'
            id='year'
            name='year'
            value={carData.year}
            onChange={handleChange}
            className={`form-control ${errors.year ? 'is-invalid' : ''}`}
            placeholder='Årsmodell'
            readOnly
          />
          {errors.year && <div className='invalid-feedback'>{errors.year}</div>}
        </div>
        <div className='form-group'>
          <label htmlFor='designation'>Betegnelse</label>
          <input
            type='text'
            id='designation'
            name='designation'
            value={carData.designation}
            onChange={handleChange}
            className='form-control'
            placeholder='Betegnelse'
            readOnly
          />
        </div>
        <div className='form-group'>
          <label htmlFor='auctionTitle'>Overskrift for din auksjon</label>
          <input
            type='text'
            id='auctionTitle'
            name='auctionTitle'
            value={carData.auctionTitle}
            onChange={handleChange}
            className='form-control'
            placeholder='Overskrift for din auksjon'
            readOnly
          />
        </div>
        <div className='form-group'>
          <label htmlFor='mileage'>Kilometerstand</label>
          <input
            type='number'
            id='mileage'
            name='mileage'
            value={carData.mileage}
            onChange={handleChange}
            className={`form-control ${errors.mileage ? 'is-invalid' : ''}`}
            placeholder='Kilometerstand'
          />
          {errors.mileage && <div className='invalid-feedback'>{errors.mileage}</div>}
        </div>
        <div className='form-group'>
          <label htmlFor='description'>Beskrivelse av det du skal selge</label>
          <textarea
            id='description'
            name='description'
            value={carData.description}
            onChange={handleChange}
            className={`form-control ${errors.description ? 'is-invalid' : ''}`}
            placeholder='Beskrivelse av det du skal selge'
          ></textarea>
          {errors.description && <div className='invalid-feedback'>{errors.description}</div>}
        </div>
        <div className='form-group'>
          <label htmlFor='conditionDescription'>Beskrivelse av egenerklæring / tilstand</label>
          <textarea
            id='conditionDescription'
            name='conditionDescription'
            value={carData.conditionDescription}
            onChange={handleChange}
            className={`form-control ${errors.conditionDescription ? 'is-invalid' : ''}`}
            placeholder='Beskrivelse av egenerklæring / tilstand'
          ></textarea>
          {errors.conditionDescription && <div className='invalid-feedback'>{errors.conditionDescription}</div>}
        </div>
        <div className='form-group'>
          <label htmlFor='images'>Bilder</label>
          <input
            type='file'
            id='images'
            name='images'
            onChange={handleFileChange}
            className='form-control'
            multiple
          />
        </div>
        <div className='form-group'>
          <label htmlFor='documents'>Dokumenter (valgfritt)</label>
          <input
            type='file'
            id='documents'
            name='documents'
            onChange={handleFileChange}
            className='form-control'
            multiple
          />
        </div>
        <h2>Teknisk</h2>
        <div className='form-group'>
          <label htmlFor='bodyType'>Karosseri</label>
          <input
            type='text'
            id='bodyType'
            name='bodyType'
            value={carData.bodyType}
            onChange={handleChange}
            className='form-control'
            placeholder='Karosseri'
            readOnly
          />
        </div>
        <div className='form-group'>
          <label htmlFor='chassisNumber'>Chassis-/understellsnr</label>
          <input
            type='text'
            id='chassisNumber'
            name='chassisNumber'
            value={carData.chassisNumber}
            onChange={handleChange}
            className='form-control'
            placeholder='Chassis-/understellsnr'
            readOnly
          />
        </div>
        <div className='form-group'>
          <label htmlFor='taxClass'>Avgiftsklasse</label>
          <input
            type='text'
            id='taxClass'
            name='taxClass'
            value={carData.taxClass}
            onChange={handleChange}
            className='form-control'
            placeholder='Avgiftsklasse'
            readOnly
          />
        </div>
        <div className='form-group'>
          <label htmlFor='fuel'>Drivstoff</label>
          <input
            type='text'
            id='fuel'
            name='fuel'
            value={carData.fuel}
            onChange={handleChange}
            className='form-control'
            placeholder='Drivstoff'
            readOnly
          />
        </div>
        <div className='form-group'>
          <label htmlFor='gearType'>Girtype</label>
          <input
            type='text'
            id='gearType'
            name='gearType'
            value={carData.gearType}
            onChange={handleChange}
            className='form-control'
            placeholder='Girtype'
            readOnly
          />
        </div>
        <div className='form-group'>
          <label htmlFor='driveType'>Driftstype</label>
          <input
            type='text'
            id='driveType'
            name='driveType'
            value={carData.driveType}
            onChange={handleChange}
            className='form-control'
            placeholder='Driftstype'
            readOnly
          />
        </div>
        <div className='form-group'>
          <label htmlFor='mainColor'>Hovedfarge</label>
          <input
            type='text'
            id='mainColor'
            name='mainColor'
            value={carData.mainColor}
            onChange={handleChange}
            className='form-control'
            placeholder='Hovedfarge'
            readOnly
          />
        </div>
        <div className='form-group'>
          <label htmlFor='power'>Effekt (hk)</label>
          <input
            type='text'
            id='power'
            name='power'
            value={carData.power}
            onChange={handleChange}
            className='form-control'
            placeholder='Effekt (hk)'
            readOnly
          />
        </div>
        <div className='form-group'>
          <label htmlFor='seats'>Antall seter</label>
          <input
            type='text'
            id='seats'
            name='seats'
            value={carData.seats}
            onChange={handleChange}
            className='form-control'
            placeholder='Antall seter'
            readOnly
          />
        </div>
        <div className='form-group'>
          <label htmlFor='owners'>Antall eiere</label>
          <input
            type='text'
            id='owners'
            name='owners'
            value={carData.owners}
            onChange={handleChange}
            className='form-control'
            placeholder='Antall eiere'
            readOnly
          />
        </div>
        <div className='form-group'>
          <label htmlFor='firstRegistration'>1. gang registrert</label>
          <input
            type='text'
            id='firstRegistration'
            name='firstRegistration'
            value={carData.firstRegistration}
            onChange={handleChange}
            className='form-control'
            placeholder='1. gang registrert'
            readOnly
          />
        </div>
        <div className='form-group'>
          <label htmlFor='interiorColor'>Interiørfarge</label>
          <input
            type='text'
            id='interiorColor'
            name='interiorColor'
            value={carData.interiorColor}
            onChange={handleChange}
            className='form-control'
            placeholder='Interiørfarge'
          />
        </div>
        <div className='form-group'>
          <label htmlFor='hideRegNumber'>
            <input
              type='checkbox'
              id='hideRegNumber'
              name='hideRegNumber'
              checked={carData.hideRegNumber}
              onChange={handleChange}
            />
            Skjul Reg.nr.
          </label>
        </div>
        <div className='form-group'>
          <label htmlFor='doors'>Antall dører</label>
          <input
            type='text'
            id='doors'
            name='doors'
            value={carData.doors}
            onChange={handleChange}
            className='form-control'
            placeholder='Antall dører'
            readOnly
          />
        </div>
        <div className='form-group'>
          <label htmlFor='weight'>Egenvekt (kg)</label>
          <input
            type='text'
            id='weight'
            name='weight'
            value={carData.weight}
            onChange={handleChange}
            className='form-control'
            placeholder='Egenvekt (kg)'
            readOnly
          />
        </div>
        <div className='form-group'>
          <label htmlFor='co2'>CO2-utslipp</label>
          <input
            type='text'
            id='co2'
            name='co2'
            value={carData.co2}
            onChange={handleChange}
            className='form-control'
            placeholder='CO2-utslipp'
            readOnly
          />
        </div>
        <div className='form-group'>
          <label htmlFor='omregistreringsavgift'>Omregistreringsavgift</label>
          <input
            type='text'
            id='omregistreringsavgift'
            name='omregistreringsavgift'
            value={carData.omregistreringsavgift}
            onChange={handleChange}
            className='form-control'
            placeholder='Omregistreringsavgift'
            readOnly
          />
        </div>
        <div className='form-group'>
          <label htmlFor='lastEUApproval'>Sist EU-godkjent</label>
          <input
            type='text'
            id='lastEUApproval'
            name='lastEUApproval'
            value={carData.lastEUApproval}
            onChange={handleChange}
            className='form-control'
            placeholder='Sist EU-godkjent'
            readOnly
          />
        </div>
        <div className='form-group'>
          <label htmlFor='nextEUControl'>Neste frist for EU-kontroll</label>
          <input
            type='text'
            id='nextEUControl'
            name='nextEUControl'
            value={carData.nextEUControl}
            onChange={handleChange}
            className='form-control'
            placeholder='Neste frist for EU-kontroll'
            readOnly
          />
        </div>
        {/* Utstyr }

        /** 
        <h2>Utstyr</h2>
        <div className='equipment-container'>
          {['ABS-bremser', 'Airbag foran', 'Airbag side', 'Aircondition', 'Alarm', 'Antiskrens', 'Antispinn', 'Automatgir', 'AUX-inngang', 'Bagasjeromstrekk', 'Bluetooth', 'CD-spiller', 'CD-veksler', 'Cruisekontroll', 'Cruisekontroll Adaptiv', 'Delskinn', 'Diesel-partikkelfilter', 'Differensialsperre', 'DVD', 'ECC', 'Elektriske justerbare speil', 'Elektriske seter m. memory', 'Elektriske seter u. memory', 'Elektriske vinduer', 'Farget glass', 'Firehjulstrekk', 'Fjernlysassistent', 'Forvarmer motor', 'Gjenfinningssystem', 'Handsfree opplegg', 'Heads Up Display', 'Helårsdekk', 'Hengerfeste', 'Hengerfeste(Avtagbart)', 'Isofix', 'Kassettspiller', 'Keyless go', 'Kjørecomputer', 'Klimaanlegg', 'Kupevarmer', 'Lasteholdere/skistativ', 'Lettmet. felg sommer', 'Lettmet. felg vinter', 'Lettmetallfelger', 'Luftfjæring', 'Lyssensor', 'Metallic lakk', 'Midtarmlene', 'Motorvarmer', 'Multifunksjonsratt', 'Mørke ruter bak', 'Navigasjon', 'Nivåregulering', 'Nøkkelløs start', 'Oppvarmede seter', 'Original telefon', 'Parkeringssensor bak', 'Parkeringssensor foran', 'Radio DAB+', 'Radio FM', 'Radio/CD', 'Radio/Kassett', 'Regnsensor', 'Ryggekamera', 'Sentrallås', 'Servostyring', 'Seter i helskinn', 'Skinninteriør', 'Soltak/glasstak', 'Sommerdekk', 'Sportsseter', 'Startsperre', 'Stereoanlegg', 'Stålbjelker', 'Takluke', 'Takrails', 'Tiptronic', 'TV', 'Vinterdekk', 'Xenonlys'].map(item => (
            <div className='form-group' key={item}>
              <label htmlFor={item}>
                <input
                  type='checkbox'
                  id={item}
                  name='equipment'
                  value={item}
                  onChange={e => {
                    const newEquipment = [...carData.equipment];
                    if (e.target.checked) {
                      newEquipment.push(e.target.value);
                    } else {
                      const index = newEquipment.indexOf(e.target.value);
                      if (index > -1) {
                        newEquipment.splice(index, 1);
                      }
                    }
                    setCarData({ ...carData, equipment: newEquipment });
                  }}
                />
                {item}
              </label>
            </div>
          ))}
        </div>
        {/* Auksjon }
        <h2>Auksjon</h2>
        <div className='form-group'>
          <label htmlFor='auctionWithoutReserve'>
            <input
              type='checkbox'
              id='auctionWithoutReserve'
              name='auctionWithoutReserve'
              checked={carData.auctionWithoutReserve}
              onChange={handleChange}
            />
            Selges uten minstepris?
          </label>
        </div>
        <div className='form-group'>
          <label htmlFor='reservePrice'>Ønsker du å sette en minstepris?</label>
          <input
            type='number'
            id='reservePrice'
            name='reservePrice'
            value={carData.reservePrice}
            onChange={handleChange}
            className='form-control'
            placeholder='Minstepris'
          />
        </div>
        <div className='form-group'>
          <label htmlFor='auctionDuration'>Hvor raskt vil du selge?</label>
          <select
            id='auctionDuration'
            name='auctionDuration'
            value={carData.auctionDuration}
            onChange={handleChange}
            className='form-control'
          >
            <option value='3'>3 dager</option>
            <option value='5'>5 dager</option>
            <option value='7'>7 dager</option>
            <option value='10'>10 dager</option>
          </select>
        </div>
        <button type='submit' className='btn btn-primary submit-button'>Opprett Auksjon</button>
      </form>
    </div>
  );
}

export default BilForm;
*/