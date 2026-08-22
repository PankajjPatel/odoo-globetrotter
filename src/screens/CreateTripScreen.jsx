import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Image, Calendar, MapPin, Sparkles, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './CreateTripScreen.css';

export const CreateTripScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useAuth();
  
  const [tripData, setTripData] = useState({
    name: location.state?.prefilledDestination ? `Trip to ${location.state.prefilledDestination}` : '',
    destination: location.state?.destination || location.state?.prefilledDestination || '',
    startDate: location.state?.startDate || new Date().toISOString().split('T')[0],
    endDate: location.state?.endDate || new Date(Date.now() + 5*24*60*60*1000).toISOString().split('T')[0],
    description: location.state?.description || '',
    coverImage: null
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e) => {
    setTripData({ ...tripData, [e.target.id]: e.target.value });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setTripData({ ...tripData, coverImage: URL.createObjectURL(file) });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    const authToken = token || localStorage.getItem('globetrotter_token');

    if (!authToken) {
      // If not authenticated, navigate to login or save in state
      navigate('/trip/new/builder', { 
        state: { 
          destination: tripData.destination,
          startDate: tripData.startDate,
          endDate: tripData.endDate,
          name: tripData.name
        } 
      });
      return;
    }

    try {
      const res = await fetch('/api/trips/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${authToken}`
        },
        body: JSON.stringify({
          name: tripData.name || `Journey to ${tripData.destination}`,
          start_date: tripData.startDate,
          end_date: tripData.endDate,
          description: tripData.description || `Exploring ${tripData.destination}`,
          is_public: true
        })
      });

      if (res.ok) {
        const createdTrip = await res.json();
        setSuccessMsg('Trip created successfully! Redirecting...');
        
        // Add default stop if destination is specified
        if (tripData.destination) {
          try {
            await fetch(`/api/trips/${createdTrip.id}/add-stop/`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${authToken}`
              },
              body: JSON.stringify({
                city: tripData.destination,
                start_date: tripData.startDate,
                end_date: tripData.endDate,
                order: 0
              })
            });
          } catch {
            // non-fatal stop creation
          }
        }

        setTimeout(() => {
          navigate(`/trip/${createdTrip.id}/builder`, {
            state: {
              destination: tripData.destination,
              startDate: tripData.startDate,
              endDate: tripData.endDate,
              tripId: createdTrip.id
            }
          });
        }, 600);
      } else {
        const errData = await res.json();
        setErrorMsg(errData.detail || errData.message || 'Failed to create trip. Please try again.');
      }
    } catch {
      // Fallback
      navigate('/trip/new/builder', { 
        state: { 
          destination: tripData.destination,
          startDate: tripData.startDate,
          endDate: tripData.endDate,
          name: tripData.name
        } 
      });
    } finally {
      setLoading(false);
    }
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

            {errorMsg && (
              <div className="admin-alert alert-error mb-4">
                <AlertCircle size={18} className="mr-2" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="admin-alert alert-success mb-4">
                <CheckCircle size={18} className="mr-2" />
                <span>{successMsg}</span>
              </div>
            )}

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
                <Button type="submit" variant="primary" size="lg" disabled={loading}>
                  {loading ? 'Creating Trip...' : '✨ Create & Start Planning'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};
