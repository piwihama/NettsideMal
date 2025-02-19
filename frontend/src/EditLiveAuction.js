import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './EditLiveAuction.css';

function EditLiveAuction() {
  const { id } = useParams();
  const [liveAuction, setLiveAuction] = useState(null);

  useEffect(() => {
    const fetchLiveAuction = async () => {
      try {
        const response = await axios.get(`https://nettside-mal-ki24.vercel.app/api/liveauctions/${id}`, { // Endret endpoint her
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        const auctionData = response.data;

        // Ensure equipment is an array
        if (!Array.isArray(auctionData.equipment)) {
          auctionData.equipment = [];
        }

        setLiveAuction(auctionData);
      } catch (error) {
        console.error('Error fetching live auction:', error);
      }
    };
    fetchLiveAuction();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLiveAuction(prevState => ({
      ...prevState,
      [name]: value,
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
      setLiveAuction(prevState => ({
        ...prevState,
        images: [...prevState.images, ...images],
      }));
    });
  };

  const handleSave = async () => {
    try {
      const { _id, ...updateData } = liveAuction; // Exclude _id
      await axios.put(`https://nettside-mal-ki24.vercel.app/api/liveauctions/${id}`, updateData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      alert('Live auction updated successfully');
    } catch (error) {
      console.error('Error updating live auction:', error);
    }
  };

  if (!liveAuction) return <div>Loading...</div>;

  return (
    <div>
      <h1>Edit Live Auction</h1>
      <form>
        <div className="form-group">
          <label htmlFor="brand">Brand</label>
          <input type="text" id="brand" name="brand" value={liveAuction.brand} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="mileage">Kilometeravstand</label>
          <input type="text" id="mileage" name="mileage" value={liveAuction.mileage} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="model">Model</label>
          <input type="text" id="model" name="model" value={liveAuction.model} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="year">Year</label>
          <input type="number" id="year" name="year" value={liveAuction.year} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="reservePrice">Reserve Price</label>
          <input type="number" id="reservePrice" name="reservePrice" value={liveAuction.reservePrice} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="status">Status</label>
          <input type="text" id="status" name="status" value={liveAuction.status} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea id="description" name="description" value={liveAuction.description} onChange={handleChange}></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="conditionDescription">Condition Description</label>
          <textarea id="conditionDescription" name="conditionDescription" value={liveAuction.conditionDescription} onChange={handleChange}></textarea>
        </div>
       
        <div className="form-group">
          <label htmlFor="highestBid">Highest Bid</label>
          <input type="number" id="highestBid" name="highestBid" value={liveAuction.highestBid} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="auctionNumber">Auction Number</label>
          <input type="text" id="auctionNumber" name="auctionNumber" value={liveAuction.auctionNumber} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="bidCount">Bid Count</label>
          <input type="number" id="bidCount" name="bidCount" value={liveAuction.bidCount} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="bidderCount">Bidder Count</label>
          <input type="number" id="bidderCount" name="bidderCount" value={liveAuction.bidderCount} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="reservePriceMet">Reserve Price Met</label>
          <select id="reservePriceMet" name="reservePriceMet" value={liveAuction.reservePriceMet} onChange={handleChange}>
            <option value={false}>No</option>
            <option value={true}>Yes</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="currentBid">Current Bid</label>
          <input type="number" id="currentBid" name="currentBid" value={liveAuction.currentBid} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="endsIn">Ends In (days)</label>
          <input type="number" id="endsIn" name="endsIn" value={liveAuction.endsIn} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="endDate">End Date</label>
          <input type="datetime-local" id="endDate" name="endDate" value={liveAuction.endDate} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="extensionAfterLastBid">Extension After Last Bid (minutes)</label>
          <input type="number" id="extensionAfterLastBid" name="extensionAfterLastBid" value={liveAuction.extensionAfterLastBid} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="seller">Seller</label>
          <input type="text" id="seller" name="seller" value={liveAuction.seller} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="businessSale">Business Sale</label>
          <select id="businessSale" name="businessSale" value={liveAuction.businessSale} onChange={handleChange}>
            <option value={false}>No</option>
            <option value={true}>Yes</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="minsteBudøkning">Min Bid Increment</label>
          <input type="number" id="minsteBudøkning" name="minsteBudøkning" value={liveAuction.minsteBudøkning} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="auksjonsgebyr">Auction Fee</label>
          <input type="number" id="auksjonsgebyr" name="auksjonsgebyr" value={liveAuction.auksjonsgebyr} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="vat">VAT</label>
          <select id="vat" name="vat" value={liveAuction.vat} onChange={handleChange}>
            <option value="mva-fritt">MVA-fritt</option>
            <option value="inkl. mva">Inkl. MVA</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="monthlyFinancing">Monthly Financing Amount</label>
          <input type="number" id="monthlyFinancing" name="monthlyFinancing" value={liveAuction.monthlyFinancing} onChange={handleChange} />
        </div>
               <div className="form-group">
          <label htmlFor="location">Location</label>
          <input type="text" id="location" name="location" value={liveAuction.location} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="postalCode">Postal Code</label>
          <input type="text" id="postalCode" name="postalCode" value={liveAuction.postalCode} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="city">City</label>
          <input type="text" id="city" name="city" value={liveAuction.city} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="images">Images</label>
          <input type="file" id="images" multiple accept="image/*" onChange={handleImageChange} />
          <div className="image-preview">
            {liveAuction.images && liveAuction.images.map((image, index) => (
              <div key={index} className="image-container">
                <img src={image} alt={`Auksjonsbilde ${index + 1}`} />
              </div>
            ))}
          </div>
        </div>
        <button type="button" onClick={handleSave}>Save</button>
      </form>
    </div>
  );
}

export default EditLiveAuction;
