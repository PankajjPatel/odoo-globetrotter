import React, { useState } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { MapPin, Calendar as CalendarIcon, Clock, ArrowLeft, DollarSign, Sparkles, X, Compass, ExternalLink } from 'lucide-react';
import './ItineraryViewScreen.css';

export const ItineraryViewScreen = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'calendar'
  const [selectedActivity, setSelectedActivity] = useState(null);

  const templateCity = location.state?.templateCity;

  // Dummy Database for templates with realistic Rupees pricing
  const tripTemplates = {
    'Goa': {
      title: 'Ultimate Goa Coastal Getaway',
      dates: 'Aug 10 - Aug 14, 2026',
      itinerary: [
        {
          date: 'August 10, 2026', city: 'Goa, India',
          activities: [
            { time: '11:00 AM', name: 'Arrival & Check-in at Beachfront Resort', cost: 'Free', duration: '1 hour', description: 'Check-in and relax at the luxury seaside cottages in Calangute.' },
            { time: '02:00 PM', name: 'Baga Beach Relaxation & Water Sports', cost: '2,500 Rupees', duration: '3 hours', description: 'Parasailing, jet ski rides, and ocean-side refreshments at Baga.' },
            { time: '08:00 PM', name: 'Seafood Candlelight Dinner at Tito\'s', cost: '1,500 Rupees', duration: '2 hours', description: 'Traditional Goan prawn curry and coastal delicacies.' }
          ]
        },
        {
          date: 'August 11, 2026', city: 'Goa, India',
          activities: [
            { time: '09:00 AM', name: 'Dudhsagar Waterfalls Jeep Safari', cost: '2,000 Rupees', duration: '4 hours', description: 'Four-tiered waterfall nestled in Bhagwan Mahaveer Sanctuary.' },
            { time: '05:00 PM', name: 'Mandovi River Sunset Cruise', cost: '850 Rupees', duration: '2 hours', description: 'Evening cultural cruise with live folk dance and music.' }
          ]
        }
      ]
    },
    'Jaipur': {
      title: 'Royal Heritage Jaipur Tour',
      dates: 'Oct 5 - Oct 8, 2026',
      itinerary: [
        {
          date: 'October 5, 2026', city: 'Jaipur, India',
          activities: [
            { time: '10:00 AM', name: 'Amber Fort Jeep Ride & Palace Tour', cost: '500 Rupees', duration: '3.5 hours', description: 'Hilltop fort with artistic Hindu architecture overlooking Maota Lake.' },
            { time: '02:00 PM', name: 'Hawa Mahal & City Palace Photo Walk', cost: '700 Rupees', duration: '2 hours', description: 'Palace of Winds with 953 honeycomb windows and royal courtyards.' },
            { time: '07:00 PM', name: 'Chokhi Dhani Cultural Dinner', cost: '1,200 Rupees', duration: '3 hours', description: 'Rajasthani folk dance, camel rides, and traditional thali.' }
          ]
        }
      ]
    },
    'default': {
      title: 'Golden Triangle & Taj Heritage Journey',
      dates: 'Jun 15 - Jun 30, 2026',
      itinerary: [
        {
          date: 'June 15, 2026', city: 'Agra, India',
          activities: [
            { time: '10:00 AM', name: 'Taj Mahal Guided Sunrise Tour', cost: '1,100 Rupees', duration: '3 hours', description: 'Iconic white marble mausoleum with historical guided tour.' },
            { time: '01:00 PM', name: 'Lunch at Local Mughlai Cafe', cost: '800 Rupees', duration: '1.5 hours', description: 'Authentic Agra petha, biryani, and rich Mughlai cuisine.' },
            { time: '03:30 PM', name: 'Agra Fort Historical Architecture Visit', cost: '500 Rupees', duration: '2 hours', description: 'Red sandstone fortress of the Mughal empire with Yamuna views.' }
          ]
        },
        {
          date: 'June 16, 2026', city: 'Agra, India',
          activities: [
            { time: '09:00 AM', name: 'Fatehpur Sikri Royal City Excursion', cost: '1,500 Rupees', duration: '3 hours', description: 'Ancient fortified city founded by Emperor Akbar in 1571.' },
            { time: '06:00 PM', name: 'Sunset by Mehtab Bagh & Yamuna River', cost: '300 Rupees', duration: '1.5 hours', description: 'Quiet sunset viewpoint behind the Taj Mahal reflecting in the water.' }
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
          <p className="text-secondary"><CalendarIcon size={16} className="inline-icon mr-1" /> {activeTrip.dates}</p>
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
                    <div 
                      key={actIdx} 
                      className="activity-card activity-timeline-clickable hoverable glass"
                      onClick={() => setSelectedActivity({ ...act, city: day.city, date: day.date })}
                      title="Click to view activity details & schedule"
                    >
                      <div className="act-time"><Clock size={16} className="mr-1"/> {act.time}</div>
                      <div className="act-details">
                        <h4>{act.name}</h4>
                        <span className="act-cost font-semibold">{act.cost}</span>
                      </div>
                      <span className="act-click-hint">Click details →</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="calendar-view-container">
          <div className="calendar-grid-header">
            {itinerary.map((day, idx) => (
              <Card key={idx} className="calendar-day-card glass">
                <div className="calendar-day-top">
                  <span className="cal-day-name">Day {idx + 1}</span>
                  <span className="cal-day-date">{day.date}</span>
                </div>
                <div className="cal-day-city"><MapPin size={12} className="mr-1"/> {day.city}</div>
                <div className="cal-activities-list">
                  {day.activities.map((act, actI) => (
                    <div 
                      key={actI} 
                      className="cal-activity-pill"
                      onClick={() => setSelectedActivity({ ...act, city: day.city, date: day.date })}
                    >
                      <span className="cal-act-time">{act.time}</span>
                      <span className="cal-act-name">{act.name}</span>
                      <span className="cal-act-cost">{act.cost}</span>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Activity Details Modal */}
      {selectedActivity && (
        <div className="admin-modal-overlay animate-fade-in" onClick={() => setSelectedActivity(null)}>
          <div className="admin-modal-card user-detail-modal-card glass" onClick={(e) => e.stopPropagation()}>
            <div className="user-modal-header">
              <div className="kpi-modal-icon-badge">
                <Sparkles size={24} />
              </div>
              <div className="user-modal-title-box">
                <h3>{selectedActivity.name}</h3>
                <p className="user-modal-handle">{selectedActivity.city} • Scheduled on {selectedActivity.date}</p>
              </div>
              <button className="modal-close-btn" onClick={() => setSelectedActivity(null)}>×</button>
            </div>

            <div className="user-modal-body">
              <div className="user-details-info-grid">
                <div className="info-item-card">
                  <span className="info-item-label">Scheduled Time</span>
                  <span className="info-item-value">{selectedActivity.time}</span>
                </div>
                <div className="info-item-card">
                  <span className="info-item-label">Estimated Cost</span>
                  <span className="info-item-value highlight">{selectedActivity.cost}</span>
                </div>
                <div className="info-item-card">
                  <span className="info-item-label">Duration</span>
                  <span className="info-item-value">{selectedActivity.duration || '2 hours'}</span>
                </div>
                <div className="info-item-card">
                  <span className="info-item-label">Destination</span>
                  <span className="info-item-value">{selectedActivity.city}</span>
                </div>
              </div>

              <div className="user-trips-overview-section">
                <h4>Experience Overview</h4>
                <p className="text-secondary font-sm">
                  {selectedActivity.description || 'Verified curated travel experience arranged in your customized daily itinerary.'}
                </p>
              </div>
            </div>

            <div className="modal-footer-row gap-2">
              <Button variant="outline" onClick={() => { setSelectedActivity(null); navigate('/search/activity'); }}>
                Explore Similar Activities
              </Button>
              <Button variant="primary" onClick={() => setSelectedActivity(null)}>
                Close Details
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

