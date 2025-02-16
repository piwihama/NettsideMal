import React, { useState } from 'react';
import './Summary.css';
import Footer from './Footer';
import Header from './Header';

const Summary = ({ formData, prevStep }) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  let timeout = null;

  const uploadImagesInBatches = async (images) => {
    const batchSize = 10;
    let uploadedImageUrls = [];
  
    for (let i = 0; i < images.length; i += batchSize) {
      const imageBatch = images.slice(i, i + batchSize);
      const formDataForBatch = new FormData();
  
      for (let j = 0; j < imageBatch.length; j++) {
        const img = imageBatch[j];
  
        if (typeof img === "string" && img.startsWith("data:image/")) {
          const response = await fetch(img);
          const blob = await response.blob();
          formDataForBatch.append("images", blob, `image${i + j}.jpg`);
        } else if (img instanceof File) {
          formDataForBatch.append("images", img);
        } else {
          console.error(`⚠️ Ugyldig bildeformat ved index ${i + j}:`, img);
        }
      }
  
      console.log(`📤 Sender batch ${i / batchSize + 1} til serveren...`);
  
      try {
        const response = await fetch(
          "https://rimelig-auksjon-lqg2.vercel.app/upload",
          {
            method: "POST",
            headers: {
              "x-api-key": "your-secret-api-key",
            },
            body: formDataForBatch,
          }
        );
  
        if (!response.ok) {
          console.error(`❌ Feil ved bildeopplasting batch ${i / batchSize + 1}: ${response.status}`);
          throw new Error(`Feil ved bildeopplasting batch ${i / batchSize + 1}`);
        }
  
        const { imageUrls } = await response.json();
        uploadedImageUrls = [...uploadedImageUrls, ...imageUrls];
  
        console.log(`✅ Bilder lastet opp for batch ${i / batchSize + 1}:`, imageUrls);
      } catch (error) {
        console.error(`❌ Feil under opplasting av batch ${i / batchSize + 1}:`, error);
        throw error;
      }
    }
  
    return uploadedImageUrls;
  };
  
  const handleSubmit = async () => {
    if (isLoading) return;
    setIsLoading(true);
  
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        alert("Du må være logget inn for å sende inn auksjonen.");
        setIsLoading(false);
        return;
      }
  
      if (!formData.images || formData.images.length === 0) {
        alert("Du må laste opp minst ett bilde.");
        setIsLoading(false);
        return;
      }
  
      console.log("📤 Starter opplasting av bilder...");
      const imageUrls = await uploadImagesInBatches(formData.images);
  
      console.log("✅ Alle bilder lastet opp:", imageUrls);
  
      const batchSize = 10;
      for (let i = 0; i < imageUrls.length; i += batchSize) {
        const batch = imageUrls.slice(i, i + batchSize);
        const submissionData = { ...formData, images: batch };
  
        console.log(`📤 Sender batch ${i / batchSize + 1} til backend...`);
        const auctionResponse = await fetch(
          "https://rimelig-auksjon-backend.vercel.app/api/auctions",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(submissionData),
          }
        );
  
        if (!auctionResponse.ok) {
          throw new Error(`Feil ved oppretting av auksjon: ${auctionResponse.status}`);
        }
  
        console.log(`✅ Batch ${i / batchSize + 1} sendt!`);
      }
  
      console.log("✅ Auksjon sendt inn!");
      setIsSubmitted(true);
    } catch (error) {
      console.error("❌ Feil ved innsending av skjema:", error);
      alert("En feil oppstod. Sjekk konsollen for mer info.");
    } finally {
      setIsLoading(false);
    }
  };
  

  const handleClick = () => {
    if (timeout) return;
    handleSubmit();
    timeout = setTimeout(() => {
      timeout = null;
    }, 1000);
  };

  if (isSubmitted) {
    return (
      <div className="confirmation-message">
        <h2>Auksjonsforespørsel sendt inn!</h2>
        <p>Takk for din forespørsel. En av våre kundebehandlere vil kontakte deg snart.</p>
        <button
          type="button"
          onClick={() => (window.location.href = "/home")}
          className="btn summary-btn-primary"
        >
          Tilbake til hjemmesiden
        </button>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="summary-container">
        <h2 className="summary-title">Sammendrag av Auksjon</h2>
        <p className="summary-info">Vennligst gå gjennom detaljene før du sender inn forespørselen.</p>

        <div className="summary-section">
          <h3>Bilinformasjon</h3>
          <ul className="summary-list">
            <li><strong>Registreringsnummer:</strong> {formData.regNumber}</li>
            <li><strong>Merke:</strong> {formData.brand}</li>
            <li><strong>Modell:</strong> {formData.model}</li>
            <li><strong>År:</strong> {formData.year}</li>
            <li><strong>Chassisnummer:</strong> {formData.chassisNumber}</li>
            <li><strong>Drivstoff:</strong> {formData.fuel}</li>
            <li><strong>Girtype:</strong> {formData.gearType}</li>
            <li><strong>Driftstype:</strong> {formData.driveType}</li>
            <li><strong>Hovedfarge:</strong> {formData.mainColor}</li>
            <li><strong>Kilometerstand:</strong> {formData.mileage}</li>
          </ul>
        </div>

        <div className="summary-section">
          <h3>Beskrivelse</h3>
          <p><strong>Beskrivelse:</strong> {formData.description}</p>
          <p><strong>Beskrivelse av tilstand:</strong> {formData.conditionDescription}</p>
        </div>

        <div className="summary-section">
          <h3>Utstyr</h3>
          <ul className="summary-list">
            {formData.equipment && formData.equipment.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="summary-section">
          <h3>Bilder</h3>
          <div className="image-preview-container">
            {formData.images && formData.images.map((img, index) => (
              <img key={index} src={img} alt={`Bilde ${index + 1}`} className="image-preview" />
            ))}
          </div>
        </div>

        <div className="form-navigation">
          <button type="button" onClick={prevStep} className="btn summary-btn-secondary">
            Tilbake
          </button>
          <button
            type="button"
            onClick={handleClick}
            className="btn summary-btn-primary"
            disabled={isLoading}
          >
            {isLoading ? "Sender..." : "Send inn"}
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Summary;
