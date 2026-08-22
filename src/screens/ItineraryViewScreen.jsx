import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { MapPin, Calendar as CalendarIcon, Clock, Edit3, ArrowLeft, DollarSign } from 'lucide-react';
import './ItineraryViewScreen.css';

export const ItineraryViewScreen = () => {
  const { id } = useParams();
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'calendar'

  // Dummy Data
  const itinerary = [
    {
      date: 'June 15, 2026',
      city: 'Paris, France',
      activities: [
        { time: '10:00 AM', name: 'Eiffel Tower Tour', cost: '$30' },
        { time: '01:00 PM', name: 'Lunch at Cafe de Flore', cost: '$45' },
        { time: '03:30 PM', name: 'Louvre Museum', cost: '$20' }
      ]
    },
    {
      date: 'June 16, 2026',
      city: 'Paris, France',
      activities: [
        { time: '09:00 AM', name: 'Versailles Palace Trip', cost: '$50' },
        { time: '06:00 PM', name: 'Seine River Cruise', cost: '$25' }
      ]
    }
  ];

  return (
    <div className="view-container container animate-fade-in">
      <div className="view-header">
        <div>
          <Link to={`/trip/${id}/builder`} className="back-link">
            <ArrowLeft size={16} className="mr-1" /> Back to Builder
          </Link>
          <h1>Summer in Europe</h1>
          <p className="text-secondary"><CalendarIcon size={16} className="inline-icon" /> Jun 15 - Jun 30, 2026</p>
        </div>
        <div className="view-actions">
          <div className="view-toggle">
            <button 
              className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >List View</button>
            <button 
              className={`toggle-btn ${viewMode === 'calendar' ? 'active' : ''}`}
              onClick={() => setViewMode('calendar')}
            >Calendar View</button>
          </div>
          <Link to={`/share/${id}`}>
            <Button variant="outline" className="ml-2">Share Trip</Button>
          </Link>
          <Link to={`/trip/${id}/budget`}>
            <Button variant="primary" className="ml-2"><DollarSign size={16} className="mr-1"/> Budget</Button>
          </Link>
        </div>
      </div>

      {viewMode === 'list' ? (
        <div className="timeline-container">
          {itinerary.map((day, index) => (
            <div key={index} className="timeline-day">
              <div className="day-marker">
                <div className="marker-dot"></div>
                <div className="marker-line"></div>
              </div>
              <div className="day-content">
                <div className="day-header">
                  <h3>{day.date}</h3>
                  <span className="city-tag"><MapPin size={14} className="mr-1"/> {day.city}</span>
                </div>
                
                <div className="activities-timeline">
                  {day.activities.map((act, actIdx) => (
                    <Card key={actIdx} className="activity-card hoverable">
                      <div className="act-time"><Clock size={16} className="mr-1"/> {act.time}</div>
                      <div className="act-details">
                        <h4>{act.name}</h4>
                        <span className="act-cost">{act.cost}</span>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="calendar-view-placeholder">
          <Card className="glass p-xl text-center">
            <CalendarIcon size={48} className="text-muted mx-auto mb-4" />
            <h3>Calendar View</h3>
            <p className="text-secondary">A full month-grid calendar goes here in the real implementation.</p>
          </Card>
        </div>
      )}
    </div>
  );
};
