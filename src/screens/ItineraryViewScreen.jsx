import React, { useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { MapPin, Calendar as CalendarIcon, Clock, Edit3, ArrowLeft, DollarSign } from 'lucide-react';
import './ItineraryViewScreen.css';

export const ItineraryViewScreen = () => {
  const { id } = useParams();
  const location = useLocation();
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'calendar'

  const templateCity = location.state?.templateCity;

  // Dummy Database for templates
  const tripTemplates = {
    'Goa': {
      title: 'Ultimate Goa Getaway',
      dates: 'Aug 10 - Aug 14, 2026',
      itinerary: [
        {
          date: 'August 10, 2026', city: 'Goa, India',
          activities: [
            { time: '11:00 AM', name: 'Arrival & Check-in at Resort', cost: '₹0' },
            { time: '02:00 PM', name: 'Baga Beach Relaxation', cost: '₹500' },
            { time: '08:00 PM', name: 'Seafood Dinner at Tito\'s', cost: '₹1,500' }
          ]
        },
        {
          date: 'August 11, 2026', city: 'Goa, India',
          activities: [
            { time: '09:00 AM', name: 'Dudhsagar Waterfalls Trip', cost: '₹2,000' },
            { time: '05:00 PM', name: 'Sunset Cruise on Mandovi', cost: '₹800' }
          ]
        }
      ]
    },
    'Jaipur': {
      title: 'Royal Jaipur Tour',
      dates: 'Oct 5 - Oct 8, 2026',
      itinerary: [
        {
          date: 'October 5, 2026', city: 'Jaipur, India',
          activities: [
            { time: '10:00 AM', name: 'Amber Fort Elephant Ride', cost: '₹1,200' },
            { time: '02:00 PM', name: 'Hawa Mahal Photo Walk', cost: '₹200' },
            { time: '07:00 PM', name: 'Chokhi Dhani Cultural Dinner', cost: '₹1,000' }
          ]
        }
      ]
    },
    'Kerala': {
      title: 'Serene Kerala Escape',
      dates: 'Nov 1 - Nov 6, 2026',
      itinerary: [
        {
          date: 'November 1, 2026', city: 'Munnar, India',
          activities: [
            { time: '09:00 AM', name: 'Tea Gardens Tour', cost: '₹400' },
            { time: '02:00 PM', name: 'Eravikulam National Park', cost: '₹350' }
          ]
        },
        {
          date: 'November 2, 2026', city: 'Alleppey, India',
          activities: [
            { time: '12:00 PM', name: 'Houseboat Check-in', cost: '₹8,000' },
            { time: '08:00 PM', name: 'Backwater Dinner', cost: '₹0' }
          ]
        }
      ]
    },
    'Bali': {
      title: 'Bali Tropical Adventure',
      dates: 'Dec 10 - Dec 18, 2026',
      itinerary: [
        {
          date: 'December 10, 2026', city: 'Ubud, Bali',
          activities: [
            { time: '10:00 AM', name: 'Sacred Monkey Forest', cost: '₹450' },
            { time: '03:00 PM', name: 'Tegalalang Rice Terrace', cost: '₹300' }
          ]
        }
      ]
    },
    'Dubai': {
      title: 'Luxury Dubai Experience',
      dates: 'Jan 5 - Jan 10, 2027',
      itinerary: [
        {
          date: 'January 5, 2027', city: 'Dubai, UAE',
          activities: [
            { time: '04:00 PM', name: 'Desert Safari & BBQ', cost: '₹4,500' },
            { time: '09:00 PM', name: 'Burj Khalifa Top View', cost: '₹3,800' }
          ]
        }
      ]
    },
    'default': {
      title: 'Summer in Europe',
      dates: 'Jun 15 - Jun 30, 2026',
      itinerary: [
        {
          date: 'June 15, 2026', city: 'Agra, India',
          activities: [
            { time: '10:00 AM', name: 'Taj Mahal Guided Tour', cost: '₹2,500' },
            { time: '01:00 PM', name: 'Lunch at Local Cafe', cost: '₹800' },
            { time: '03:30 PM', name: 'Agra Fort Visit', cost: '₹500' }
          ]
        },
        {
          date: 'June 16, 2026', city: 'Agra, India',
          activities: [
            { time: '09:00 AM', name: 'Fatehpur Sikri Excursion', cost: '₹1,500' },
            { time: '06:00 PM', name: 'Sunset by Yamuna River', cost: '₹200' }
          ]
        }
      ]
    }
  };

  const activeTrip = templateCity && tripTemplates[templateCity] 
    ? tripTemplates[templateCity] 
    : tripTemplates['default'];

  const itinerary = activeTrip.itinerary;

  return (
    <div className="view-container container animate-fade-in">
      <div className="view-header">
        <div>
          <Link to={`/dashboard`} className="back-link">
            <ArrowLeft size={16} className="mr-1" /> Back to Dashboard
          </Link>
          <h1>{activeTrip.title}</h1>
          <p className="text-secondary"><CalendarIcon size={16} className="inline-icon" /> {activeTrip.dates}</p>
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
