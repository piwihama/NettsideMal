import React, { useState } from 'react';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import Step4 from './Step4';
import Step5 from './Step5';
import Summary from './Summary';

const AuctionForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1 fields


    // Step 4 fields
    description: '',
    images: [],
    // Step 5 fields
    auctionDuration: '',
    reservePrice: '',
    auctionWithoutReserve: false,
  });

  const nextStep = () => {
    setStep(prevStep => prevStep + 1);
  };

  const prevStep = () => {
    setStep(prevStep => prevStep - 1);
  };

  const submitForm = async () => {
    try {
      const response = await fetch('https://rimelig-auksjon-backend.vercel.app/api/auctions', {
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

  switch (step) {
    case 1:
      return <Step1 nextStep={nextStep} formData={formData} setFormData={setFormData} />;
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
