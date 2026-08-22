import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Image, Calendar, MapPin } from 'lucide-react';
import './CreateTripScreen.css';

export const CreateTripScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [tripData, setTripData] = useState({
    name: '',
    destination: location.state?.destination || '',
    startDate: '',
    endDate: '',
    description: '',
    coverImage: null
  });

  const handleChange = (e) => {
    setTripData({ ...tripData, [e.target.id]: e.target.value });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setTripData({ ...tripData, coverImage: URL.createObjectURL(file) });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/trip/new/builder', { 
      state: { 
        destination: tripData.destination,
        startDate: tripData.startDate 
      } 
    });
  };

  return (
    <div className="create-trip-container animate-fade-in">
      
      <div className="create-trip-layout">
        {/* Left side: Premium Image/Banner */}
        <div className="create-trip-banner">
          <div className="banner-overlay">
            <h1>Design Your Dream Trip</h1>
            <p>Every great journey begins with a single step. Start planning your perfect itinerary today.</p>
          </div>
        </div>

        {/* Right side: Form */}
        <div className="create-trip-form-section">
          <Card className="create-trip-form-card glass">
            <h2 className="form-title">Trip Details</h2>
            <form onSubmit={handleSubmit}>
              
              <div className="cover-photo-upload" onClick={() => document.getElementById('cover-upload').click()}>
                {tripData.coverImage ? (
                  <img src={tripData.coverImage} alt="Cover Preview" className="cover-preview" />
                ) : (
                  <div className="upload-placeholder">
                    <Image size={32} className="text-muted mb-2 mx-auto" />
                    <p>Click to upload a cover photo</p>
                  </div>
                )}
                <input 
                  type="file" 
                  id="cover-upload" 
                  accept="image/*" 
                  style={{ display: 'none' }} 
                  onChange={handleImageChange} 
                />
              </div>

              <Input 
                label="Trip Name" 
                id="name" 
                placeholder="e.g., Summer Backpacking" 
                value={tripData.name}
                onChange={handleChange}
                required 
              />
              
              <Input 
                label="Destination (City)" 
                id="destination" 
                placeholder="e.g., Indore, India" 
                value={tripData.destination}
                onChange={handleChange}
                required 
              />

              <div className="date-inputs">
                <Input 
                  label="Start Date" 
                  id="startDate" 
                  type="date" 
                  value={tripData.startDate}
                  onChange={handleChange}
                  required 
                />
                <Input 
                  label="End Date" 
                  id="endDate" 
                  type="date" 
                  value={tripData.endDate}
                  onChange={handleChange}
                  required 
                />
              </div>

              <div className="input-group">
                <label htmlFor="description" className="input-label">Description (Optional)</label>
                <textarea 
                  id="description" 
                  className="input-field textarea-field" 
                  placeholder="What is the purpose of this trip? Any main goals?"
                  rows="3"
                  value={tripData.description}
                  onChange={handleChange}
                ></textarea>
              </div>

              <div className="form-actions">
                <Button type="button" variant="ghost" onClick={() => navigate(-1)}>Cancel</Button>
                <Button type="submit" variant="primary" size="lg">Start Planning</Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};
