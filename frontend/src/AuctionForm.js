import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'; // Import useLocation from react-router-dom
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import Step4 from './Step4';
import Step5 from './Step5';
import Summary from './Summary';
import { Field, Formik, Form, ErrorMessage } from 'formik';
//hhehe
const AuctionForm = () => {
  const location = useLocation(); // This gets the location object
  const category = location.state?.category || 'car';  // Ensure category is set safely

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    category,  // Set the category safely
    description: '',
    images: [],
    auctionDuration: '',
    reservePrice: '',
    auctionWithoutReserve: false,
    regNumber: '',
    brand: '',
    model: '',
    year: '',
    chassisNumber: '',
    length: '',
    engineHours: '',
    itemName: '',
    itemDescription: ''
  });

  const nextStep = () => {
    setStep(prevStep => prevStep + 1);
  };

  const prevStep = () => {
    setStep(prevStep => prevStep - 1);
  };

  const submitForm = async () => {
    try {
      const response = await fetch('https://nettside-mal-ki24.vercel.app/api/auctions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (response.ok) {
        console.log('Auction created successfully:', result);
      } else {
        console.error('Error creating auction:', result);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  // Function to render category-specific fields
  const categoryFields = () => {
    if (formData.category === 'car' || formData.category === 'motorcycle') {
      return (
        <>
          <label>Registreringsnummer:</label>
          <Field type="text" name="regNumber" value={formData.regNumber} onChange={(e) => setFormData({ ...formData, regNumber: e.target.value })} />
          <label>Merke:</label>
          <Field type="text" name="brand" value={formData.brand} onChange={(e) => setFormData({ ...formData, brand: e.target.value })} />
          <label>Modell:</label>
          <Field type="text" name="model" value={formData.model} onChange={(e) => setFormData({ ...formData, model: e.target.value })} />
          <label>År:</label>
          <Field type="number" name="year" value={formData.year} onChange={(e) => setFormData({ ...formData, year: e.target.value })} />
          <label>Chassisnummer:</label>
          <Field type="text" name="chassisNumber" value={formData.chassisNumber} onChange={(e) => setFormData({ ...formData, chassisNumber: e.target.value })} />
        </>
      );
    } else if (formData.category === 'boat') {
      return (
        <>
          <label>Lengde (meter):</label>
          <Field type="number" name="length" value={formData.length} onChange={(e) => setFormData({ ...formData, length: e.target.value })} />
          <label>Motortimer:</label>
          <Field type="number" name="engineHours" value={formData.engineHours} onChange={(e) => setFormData({ ...formData, engineHours: e.target.value })} />
        </>
      );
    } else if (formData.category === 'torg') {
      return (
        <>
          <label>Navn på varen:</label>
          <Field type="text" name="itemName" value={formData.itemName} onChange={(e) => setFormData({ ...formData, itemName: e.target.value })} />
          <label>Beskrivelse av varen:</label>
          <Field type="text" name="itemDescription" value={formData.itemDescription} onChange={(e) => setFormData({ ...formData, itemDescription: e.target.value })} />
        </>
      );
    }
  };

  // Multi-step form navigation
  switch (step) {
    case 1:
      return <Step1 nextStep={nextStep} formData={formData} setFormData={setFormData} categoryFields={categoryFields} />;
    case 2:
      return <Step2 nextStep={nextStep} prevStep={prevStep} formData={formData} setFormData={setFormData} />;
    case 3:
      return <Step3 nextStep={nextStep} prevStep={prevStep} formData={formData} setFormData={setFormData} />;
    case 4:
      return <Step4 nextStep={nextStep} prevStep={prevStep} formData={formData} setFormData={setFormData} />;
    case 5:
      return <Step5 nextStep={nextStep} prevStep={prevStep} formData={formData} setFormData={setFormData} />;
    case 6:
      return <Summary prevStep={prevStep} formData={formData} submitForm={submitForm} />;
    default:
      return <Step1 nextStep={nextStep} formData={formData} setFormData={setFormData} />;
  }
};

export default AuctionForm;
