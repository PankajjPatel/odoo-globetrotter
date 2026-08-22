import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { MapPin, Calendar, Compass, TrendingUp, DollarSign } from 'lucide-react';
import './DashboardScreen.css';

export const DashboardScreen = () => {
  // Dummy data
  const upcomingTrips = [
    { id: 1, name: 'Summer in Europe', dates: 'Jun 15 - Jun 30, 2026', destCount: 4, cover: 'bg-europe' },
    { id: 2, name: 'Tokyo Adventure', dates: 'Oct 5 - Oct 15, 2026', destCount: 1, cover: 'bg-tokyo' },
  ];

  const popularDestinations = [
    { name: 'Bali, Indonesia', image: 'bg-bali' },
    { name: 'Rome, Italy', image: 'bg-rome' },
    { name: 'Kyoto, Japan', image: 'bg-kyoto' },
  ];

  return (
    <div className="dashboard-container container animate-fade-in">
      <div className="dashboard-header">
        <div>
          <h1>Welcome back, Explorer! 👋</h1>
          <p className="text-secondary">Ready for your next adventure?</p>
        </div>
        <Link to="/create-trip">
          <Button variant="primary" size="lg">
            <Compass size={20} className="mr-2" /> Plan New Trip
          </Button>
        </Link>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-main">
          <section className="upcoming-section">
            <div className="section-header">
              <h2>Upcoming Trips</h2>
              <Link to="/my-trips" className="view-all">View All</Link>
            </div>
            
            {upcomingTrips.length > 0 ? (
              <div className="trip-cards-list">
                {upcomingTrips.map(trip => (
                  <Link to={`/trip/${trip.id}/builder`} key={trip.id}>
                    <Card className="trip-card hoverable" hoverable>
                      <div className={`trip-cover ${trip.cover}`}></div>
                      <div className="trip-info">
                        <h3>{trip.name}</h3>
                        <div className="trip-meta">
                          <span><Calendar size={14}/> {trip.dates}</span>
                          <span><MapPin size={14}/> {trip.destCount} Destinations</span>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <Card className="empty-state">
                <Compass size={48} className="text-muted mb-4" />
                <h3>No upcoming trips</h3>
                <p>Start planning your next dream vacation.</p>
                <Link to="/create-trip">
                  <Button variant="outline" className="mt-4">Create a Trip</Button>
                </Link>
              </Card>
            )}
          </section>

          <section className="inspiration-section">
            <h2>Recommended Destinations</h2>
            <div className="destinations-grid">
              {popularDestinations.map((dest, i) => (
                <div key={i} className={`dest-card ${dest.image}`}>
                  <div className="dest-overlay">
                    <h4>{dest.name}</h4>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="dashboard-sidebar">
          <Card className="stats-card glass">
            <h3>Quick Stats</h3>
            <div className="stat-item">
              <div className="stat-icon bg-blue-light"><MapPin size={20} className="text-blue" /></div>
              <div className="stat-details">
                <span className="stat-value">12</span>
                <span className="stat-label">Cities Visited</span>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon bg-green-light"><TrendingUp size={20} className="text-green" /></div>
              <div className="stat-details">
                <span className="stat-value">5</span>
                <span className="stat-label">Trips Completed</span>
              </div>
            </div>
          </Card>

          <Card className="budget-alert-card bg-gradient">
            <div className="alert-content">
              <h3><DollarSign size={20} /> Budget Update</h3>
              <p>Your upcoming 'Summer in Europe' trip is 10% under budget!</p>
              <Link to="/trip/1/budget" className="btn-link">View Breakdown &rarr;</Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
