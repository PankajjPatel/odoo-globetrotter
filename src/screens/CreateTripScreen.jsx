import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Image, Calendar, MapPin } from 'lucide-react';
import './CreateTripScreen.css';

export const CreateTripScreen = () => {
  const navigate = useNavigate();
  const [tripData, setTripData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    description: ''
  });

  const handleChange = (e) => {
    setTripData({ ...tripData, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would make an API call to create the trip, getting a new ID
    // For now, redirect to the itinerary builder for a dummy trip
    navigate('/trip/new/builder');
  };

  return (
    <div className="create-trip-container container animate-fade-in">
      <div className="create-trip-header">
        <h1>Design Your Dream Trip</h1>
        <p className="text-secondary">Start by giving your adventure a name and a timeframe.</p>
      </div>

      <div className="create-trip-content">
        <Card className="create-trip-form-card">
          <form onSubmit={handleSubmit}>
            <div className="cover-photo-upload">
              <div className="upload-placeholder">
                <Image size={40} className="text-muted mb-2" />
                <p>Click to upload a cover photo (optional)</p>
              </div>
            </div>

            <Input 
              label="Trip Name" 
              id="name" 
              placeholder="e.g., Summer Backpacking in Europe" 
              value={tripData.name}
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
                rows="4"
                value={tripData.description}
                onChange={handleChange}
              ></textarea>
            </div>

            <div className="form-actions mt-4">
              <Button type="button" variant="ghost" onClick={() => navigate(-1)}>Cancel</Button>
              <Button type="submit" variant="primary" size="lg">Create & Start Planning</Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};
