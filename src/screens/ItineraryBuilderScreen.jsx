import React, { useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { MapPin, Plus, GripVertical, Calendar, Clock, IndianRupee, ArrowRight } from 'lucide-react';
import './ItineraryBuilderScreen.css';

export const ItineraryBuilderScreen = () => {
  const { id } = useParams();
  const location = useLocation();
  const tripState = location.state || {};
  const destination = tripState.destination || 'Goa, India';
  const startDate = tripState.startDate || '2026-06-15';

  // Dummy State for the itinerary builder
  const [stops, setStops] = useState([
    {
      id: 'stop-1',
      city: destination,
      date: startDate,
      activities: [
        { id: 'act-1', name: 'Explore local sights', time: '10:00 AM', cost: 500 },
        { id: 'act-2', name: 'Lunch at famous restaurant', time: '01:00 PM', cost: 1200 }
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

  return (
    <div className="builder-container container animate-fade-in">
      <div className="builder-header">
        <div>
          <h1>Itinerary Builder</h1>
          <p className="text-secondary">Plan your stops, dates, and daily activities.</p>
        </div>
        <div className="builder-actions">
          <Link to={`/trip/${id}/budget`}>
            <Button variant="outline" className="mr-2">View Budget</Button>
          </Link>
          <Link to={`/trip/${id}/view`}>
            <Button variant="primary">View Timeline <ArrowRight size={16} className="ml-1" /></Button>
          </Link>
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

      <div className="add-stop-container">
        <Button variant="outline" size="lg" className="add-stop-btn" onClick={addStop}>
          <MapPin size={20} className="mr-2" /> Add Next Stop
        </Button>
      </div>
    </div>
  );
};
