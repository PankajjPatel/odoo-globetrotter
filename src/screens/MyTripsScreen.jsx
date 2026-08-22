import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { MapPin, Calendar, PlusCircle, MoreVertical } from 'lucide-react';
import './MyTripsScreen.css';

export const MyTripsScreen = () => {
  // Real image data (empty to show empty state)
  const myTrips = [];

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
        {myTrips.length > 0 ? (
          myTrips.map(trip => (
            <Card key={trip.id} className="trip-card hoverable">
              <div className="trip-cover-container">
                <img src={trip.cover} alt={trip.name} className="trip-cover-real" />
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
                    <span>{trip.destinations} Destinations</span>
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
          ))
        ) : (
          <div className="empty-state-card glass w-full" style={{ gridColumn: '1 / -1' }}>
            <div className="empty-state-icon">
              <MapPin size={48} className="text-secondary opacity-50" />
            </div>
            <h3>You haven't planned any trips yet</h3>
            <p className="text-secondary">It's time to pack your bags and start a new adventure!</p>
            <Link to="/create-trip">
              <Button variant="primary" className="mt-4"><PlusCircle size={16} className="mr-2"/> Plan New Trip</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
