import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { MapPin, Calendar as CalendarIcon, Clock, Share2, Copy, Instagram, Linkedin } from 'lucide-react';
import './SharedTripScreen.css';

export const SharedTripScreen = () => {
  const { id } = useParams();

  // Dummy Data
  const trip = {
    name: 'Summer in Europe',
    dates: 'Jun 15 - Jun 30, 2026',
    cover: 'bg-europe',
    creator: 'Explorer Doe',
  };

  const itinerary = [
    {
      date: 'June 15, 2026',
      city: 'Paris, France',
      activities: [
        { time: '10:00 AM', name: 'Eiffel Tower Tour' },
        { time: '01:00 PM', name: 'Lunch at Cafe de Flore' },
      ]
    },
    {
      date: 'June 16, 2026',
      city: 'Paris, France',
      activities: [
        { time: '09:00 AM', name: 'Versailles Palace Trip' },
      ]
    }
  ];

  return (
    <div className="shared-trip-container animate-fade-in">
      <div className={`shared-banner ${trip.cover}`}>
        <div className="shared-banner-overlay">
          <div className="container">
            <span className="shared-badge">Public Itinerary</span>
            <h1>{trip.name}</h1>
            <p className="meta-info">
              <span><CalendarIcon size={16} /> {trip.dates}</span>
              <span className="bullet">•</span>
              <span>Curated by {trip.creator}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="container shared-content">
        <div className="shared-main">
          <h2>Trip Itinerary</h2>
          <div className="shared-timeline">
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
                      <Card key={actIdx} className="activity-card read-only">
                        <div className="act-time"><Clock size={16} className="mr-1"/> {act.time}</div>
                        <div className="act-details">
                          <h4>{act.name}</h4>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="shared-sidebar">
          <Card className="share-actions-card glass">
            <h3>Inspired by this trip?</h3>
            <p className="text-secondary mb-4">Copy this itinerary to your account and customize it for your own adventure.</p>
            <Button variant="primary" className="w-full mb-4">
              <Copy size={18} className="mr-2" /> Copy Trip
            </Button>
            
            <hr className="divider" />
            
            <h4 className="mt-4 mb-2">Share this itinerary</h4>
            <div className="social-buttons">
              <Button variant="outline" className="flex-1"><Instagram size={18} /></Button>
              <Button variant="outline" className="flex-1"><Linkedin size={18} /></Button>
              <Button variant="outline" className="flex-1"><Share2 size={18} /></Button>
            </div>
            
            <div className="public-url-box mt-4">
              <input type="text" readOnly value={`globetrotter.app/share/${id}`} className="url-input" />
              <Button variant="ghost" size="sm">Copy Link</Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
