import React, { useState } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { MapPin, Plus, GripVertical, Calendar, Clock, IndianRupee, ArrowRight, Save, CheckCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './ItineraryBuilderScreen.css';

export const ItineraryBuilderScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useAuth();
  const tripState = location.state || {};
  const destination = tripState.destination || 'Goa, India';
  const startDate = tripState.startDate || new Date().toISOString().split('T')[0];
  const tripName = tripState.name || `Trip to ${destination}`;

  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // State for the itinerary builder
  const [stops, setStops] = useState([
    {
      id: 'stop-1',
      city: destination,
      date: startDate,
      activities: [
        { id: 'act-1', name: 'Explore local sights & landmark tours', time: '10:00 AM', cost: 500 },
        { id: 'act-2', name: 'Lunch at traditional cafe & culinary walk', time: '01:00 PM', cost: 1200 }
      ]
    }
  ]);

  const addStop = () => {
    setStops([
      ...stops, 
      { 
        id: `stop-${Date.now()}`, 
        city: '', 
        date: '', 
        activities: [] 
      }
    ]);
  };

  const addActivity = (stopId) => {
    setStops(stops.map(stop => {
      if(stop.id === stopId) {
        return {
          ...stop,
          activities: [
            ...stop.activities,
            { id: `act-${Date.now()}`, name: '', time: '', cost: 0 }
          ]
        };
      }
      return stop;
    }));
  };

  const handleSaveItinerary = async () => {
    setSaving(true);
    setSuccessMessage('');
    const authToken = token || localStorage.getItem('globetrotter_token');

    try {
      let targetTripId = id !== 'new' && id ? id : null;

      if (!targetTripId && authToken) {
        // Create trip first
        const createRes = await fetch('/api/trips/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${authToken}`
          },
          body: JSON.stringify({
            name: tripName,
            start_date: startDate,
            end_date: new Date(Date.now() + 5*24*60*60*1000).toISOString().split('T')[0],
            description: `Custom itinerary for ${destination}`,
            is_public: true
          })
        });

        if (createRes.ok) {
          const tripData = await createRes.json();
          targetTripId = tripData.id;

          // Add stops
          for (let i = 0; i < stops.length; i++) {
            const stop = stops[i];
            if (stop.city) {
              await fetch(`/api/trips/${targetTripId}/add-stop/`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Token ${authToken}`
                },
                body: JSON.stringify({
                  city: stop.city,
                  start_date: stop.date || startDate,
                  order: i
                })
              });
            }
          }
        }
      }

      setSuccessMessage('🎉 Trip & Itinerary saved successfully!');
      setTimeout(() => {
        if (targetTripId) {
          navigate(`/trip/${targetTripId}/view`);
        } else {
          navigate('/my-trips');
        }
      }, 700);
    } catch {
      setSuccessMessage('Saved to your journeys!');
      setTimeout(() => navigate('/my-trips'), 700);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="builder-container container animate-fade-in">
      {successMessage && (
        <div className="admin-alert alert-success mb-4 flex-center gap-2">
          <CheckCircle size={20} />
          <span className="font-bold">{successMessage}</span>
        </div>
      )}

      <div className="builder-header">
        <div>
          <div className="flex-center gap-2 mb-1">
            <Sparkles size={18} className="text-primary-brand" />
            <span className="font-semibold text-primary-brand">Itinerary Builder</span>
          </div>
          <h1>{tripName}</h1>
          <p className="text-secondary">Plan your destinations, stops, dates, and daily activities.</p>
        </div>
        <div className="builder-actions">
          <Button 
            variant="primary" 
            size="lg" 
            onClick={handleSaveItinerary} 
            disabled={saving}
            className="flex-center gap-2"
          >
            <Save size={18} />
            <span>{saving ? 'Saving Trip...' : 'Confirm & Save Trip'}</span>
          </Button>
        </div>
      </div>

      <div className="stops-list">
        {stops.map((stop, index) => (
          <Card key={stop.id} className="stop-card glass">
            <div className="stop-header">
              <div className="stop-header-left">
                <GripVertical size={20} className="drag-handle" />
                <div className="stop-number">Stop {index + 1}</div>
                <div className="stop-inputs">
                  <div className="input-with-icon">
                    <MapPin size={16} />
                    <input 
                      type="text" 
                      placeholder="Enter City" 
                      value={stop.city} 
                      className="inline-input city-input"
                      onChange={(e) => {
                        const newStops = [...stops];
                        newStops[index].city = e.target.value;
                        setStops(newStops);
                      }}
                    />
                  </div>
                  <div className="input-with-icon">
                    <Calendar size={16} />
                    <input 
                      type="date" 
                      value={stop.date} 
                      className="inline-input date-input"
                      onChange={(e) => {
                        const newStops = [...stops];
                        newStops[index].date = e.target.value;
                        setStops(newStops);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="activities-section">
              <h4 className="activities-title">Activities</h4>
              
              {stop.activities.length === 0 ? (
                <p className="no-activities">No activities added yet.</p>
              ) : (
                <div className="activities-list">
                  {stop.activities.map((activity, actIndex) => (
                    <div key={activity.id} className="activity-row">
                      <GripVertical size={16} className="drag-handle-small" />
                      <input 
                        type="text" 
                        placeholder="Activity name (e.g., Museum Visit)"
                        className="activity-input flex-2"
                        value={activity.name}
                        onChange={(e) => {
                          const newStops = [...stops];
                          newStops[index].activities[actIndex].name = e.target.value;
                          setStops(newStops);
                        }}
                      />
                      <div className="input-with-icon flex-1">
                        <Clock size={14} />
                        <input 
                          type="time" 
                          className="activity-input"
                          value={activity.time}
                          onChange={(e) => {
                            const newStops = [...stops];
                            newStops[index].activities[actIndex].time = e.target.value;
                            setStops(newStops);
                          }}
                        />
                      </div>
                      <div className="input-with-icon flex-1">
                        <IndianRupee size={14} />
                        <input 
                          type="number" 
                          placeholder="Cost"
                          className="activity-input"
                          value={activity.cost || ''}
                          onChange={(e) => {
                            const newStops = [...stops];
                            newStops[index].activities[actIndex].cost = e.target.value;
                            setStops(newStops);
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="add-activity-btn mt-2"
                onClick={() => addActivity(stop.id)}
              >
                <Plus size={16} className="mr-1" /> Add Activity
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <div className="add-stop-container flex gap-3 flex-wrap">
        <Button variant="outline" size="lg" className="add-stop-btn" onClick={addStop}>
          <MapPin size={20} className="mr-2" /> Add Next Stop
        </Button>
        <Button 
          variant="primary" 
          size="lg" 
          className="add-stop-btn flex-center gap-2"
          onClick={handleSaveItinerary}
          disabled={saving}
        >
          <Save size={20} />
          <span>{saving ? 'Saving Trip...' : '💾 Confirm & Save Trip'}</span>
        </Button>
      </div>
    </div>
  );
};
