import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { MapPin, Calendar, PlusCircle, Trash2, Edit3, Eye, Compass, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './MyTripsScreen.css';

export const MyTripsScreen = () => {
  const { token } = useAuth();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const fetchTrips = async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const res = await fetch('/api/trips/', {
        headers: { 'Authorization': `Token ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setTrips(data);
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, [token]);

  const handleDeleteTrip = async (e, tripId) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this trip itinerary?")) return;

    try {
      setDeletingId(tripId);
      const res = await fetch(`/api/trips/${tripId}/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Token ${token}` }
      });
      if (res.ok) {
        setTrips(prev => prev.filter(t => t.id !== tripId));
      }
    } catch {
      alert("Failed to delete trip. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="my-trips-container container animate-fade-in">
      <div className="page-header">
        <div>
          <h1>My Trips</h1>
          <p className="text-secondary">All your customized itineraries, past adventures, and upcoming flights.</p>
        </div>
        <Link to="/create-trip">
          <Button variant="primary">
            <PlusCircle size={18} className="mr-2" /> Plan New Trip
          </Button>
        </Link>
      </div>

      <div className="trips-grid">
        {loading ? (
          <div className="empty-state-card glass w-full" style={{ gridColumn: '1 / -1' }}>
            <Compass size={40} className="spin-icon text-primary-brand" />
            <h3 className="mt-3">Loading your journeys...</h3>
          </div>
        ) : trips.length > 0 ? (
          trips.map(trip => {
            const isPast = trip.end_date && new Date(trip.end_date) < new Date();
            const dateStr = trip.start_date && trip.end_date 
              ? `${trip.start_date} to ${trip.end_date}`
              : (trip.start_date || 'Dates TBD');
            const stopsCount = trip.stops_count || (trip.stops ? trip.stops.length : 0);
            const coverImage = trip.cover_image || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80';

            return (
              <Card key={trip.id} className="trip-card hoverable">
                <div className="trip-cover-container">
                  <img src={coverImage} alt={trip.name} className="trip-cover-real" />
                  <span className={`trip-badge ${isPast ? 'badge-past' : 'badge-upcoming'}`}>
                    {isPast ? 'Past' : 'Upcoming'}
                  </span>
                </div>
                <div className="trip-content">
                  <div className="trip-header-row">
                    <h2>{trip.name}</h2>
                    <button 
                      type="button" 
                      className="btn-icon text-danger" 
                      onClick={(e) => handleDeleteTrip(e, trip.id)}
                      disabled={deletingId === trip.id}
                      title="Delete Trip"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  
                  <div className="trip-meta-list">
                    <div className="meta-item">
                      <Calendar size={15} className="text-secondary" />
                      <span>{dateStr}</span>
                    </div>
                    <div className="meta-item">
                      <MapPin size={15} className="text-secondary" />
                      <span>{stopsCount} {stopsCount === 1 ? 'Stop' : 'Stops'}</span>
                    </div>
                  </div>
                  
                  <div className="trip-actions">
                    <Link to={`/trip/${trip.id}/builder`} className="w-full">
                      <Button variant="outline" className="w-full">
                        <Edit3 size={15} className="mr-1" /> Edit
                      </Button>
                    </Link>
                    <Link to={`/trip/${trip.id}/view`} className="w-full">
                      <Button variant="primary" className="w-full">
                        <Eye size={15} className="mr-1" /> Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            );
          })
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
