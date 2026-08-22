import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { MapPin, Calendar, PlusCircle, MoreVertical } from 'lucide-react';
import './MyTripsScreen.css';

export const MyTripsScreen = () => {
  // Dummy data
  const trips = [
    { id: 1, name: 'Summer in Europe', dates: 'Jun 15 - Jun 30, 2026', destCount: 4, cover: 'bg-europe', status: 'Upcoming' },
    { id: 2, name: 'Tokyo Adventure', dates: 'Oct 5 - Oct 15, 2026', destCount: 1, cover: 'bg-tokyo', status: 'Upcoming' },
    { id: 3, name: 'Weekend in New York', dates: 'May 1 - May 3, 2026', destCount: 1, cover: 'bg-ny', status: 'Past' },
  ];

  return (
    <div className="my-trips-container container animate-fade-in">
      <div className="page-header">
        <h1>My Trips</h1>
        <Link to="/create-trip">
          <Button variant="primary">
            <PlusCircle size={20} className="mr-2" /> Plan New Trip
          </Button>
        </Link>
      </div>

      <div className="trips-grid">
        {trips.map(trip => (
          <Card key={trip.id} className="trip-card-large hoverable">
            <div className={`trip-cover-large ${trip.cover}`}>
              <span className={`trip-badge ${trip.status === 'Past' ? 'badge-past' : 'badge-upcoming'}`}>
                {trip.status}
              </span>
            </div>
            <div className="trip-content">
              <div className="trip-header-row">
                <h2>{trip.name}</h2>
                <button className="btn-icon"><MoreVertical size={20} /></button>
              </div>
              
              <div className="trip-meta-list">
                <div className="meta-item">
                  <Calendar size={16} className="text-secondary" />
                  <span>{trip.dates}</span>
                </div>
                <div className="meta-item">
                  <MapPin size={16} className="text-secondary" />
                  <span>{trip.destCount} Destinations</span>
                </div>
              </div>
              
              <div className="trip-actions">
                <Link to={`/trip/${trip.id}/builder`} className="w-full">
                  <Button variant="outline" className="w-full">Edit Itinerary</Button>
                </Link>
                <Link to={`/trip/${trip.id}/view`} className="w-full">
                  <Button variant="primary" className="w-full">View Details</Button>
                </Link>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
