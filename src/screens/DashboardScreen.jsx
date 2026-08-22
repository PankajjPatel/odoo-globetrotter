import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Calendar, Plus, Search, MapPin, TrendingUp, DollarSign } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './DashboardScreen.css';

export const DashboardScreen = () => {
  const { user } = useAuth();
  const displayName = user?.full_name || user?.first_name || user?.username || 'Explorer';

  // Real Images for trips
  // Currently set to empty to show the empty state
  const upcomingTrips = [];

  const regionalSelections = [
    { name: 'Goa', cost: '₹15,000/trip', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80' },
    { name: 'Jaipur', cost: '₹12,000/trip', image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&q=80' },
    { name: 'Kerala', cost: '₹20,000/trip', image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80' },
    { name: 'Bali', cost: '₹40,000/trip', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80' },
    { name: 'Dubai', cost: '₹55,000/trip', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80' },
  ];

  return (
    <div className="dashboard-wrapper animate-fade-in">
      {/* Modern Hero Banner */}
      <div className="dashboard-hero">
        <div className="hero-background" style={{backgroundImage: `url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1600&q=80')`}}></div>
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">Welcome back, <span className="highlight-text">{displayName}!</span></h1>
            <p className="hero-subtitle">The world is waiting. Where to next?</p>
            
            <div className="hero-search-glass">
              <Search size={20} className="search-icon" />
              <input type="text" placeholder="Search destinations, trips, or activities..." className="glass-input" />
              <Button variant="primary" className="search-btn">Explore</Button>
            </div>
            
            <div className="budget-highlight-pill mt-4">
              <DollarSign size={16} /> <span className="fw-600">Smart Tip:</span> 'Summer in Europe' is currently tracking 10% under budget! 🎉
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-container container">
        {/* Previous Trips (Horizontal Scrollable) */}
        <section className="dashboard-section mt-xl">
          <div className="section-header-flex">
            <h2 className="section-title">Your Upcoming Trips</h2>
            <Link to="/my-trips" className="view-all-link">View all</Link>
          </div>
          
          <div className="trips-horizontal-scroll">
            {upcomingTrips.length > 0 ? (
              upcomingTrips.map(trip => (
                <Link to={`/trip/${trip.id}/builder`} key={trip.id} className="trip-card-link">
                  <Card className="trip-card-modern hoverable">
                    <div className="trip-image-container">
                      <img src={trip.image} alt={trip.name} className="trip-image" />
                      <div className="trip-image-overlay"></div>
                    </div>
                    <div className="trip-card-content">
                      <h3>{trip.name}</h3>
                      <p className="text-secondary flex-center gap-sm"><Calendar size={14}/> {trip.dates}</p>
                    </div>
                  </Card>
                </Link>
              ))
            ) : (
              <div className="empty-state-card glass">
                <div className="empty-state-icon">
                  <MapPin size={48} className="text-secondary opacity-50" />
                </div>
                <h3>No upcoming trips yet</h3>
                <p className="text-secondary">Your itinerary is a blank canvas. Start exploring the world!</p>
                <Link to="/create-trip">
                  <Button variant="primary" className="mt-4"><Plus size={16} className="mr-2"/> Plan Your First Trip</Button>
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Top Regional Selections (Masonry or Grid) */}
        <section className="dashboard-section">
          <div className="section-header-flex">
            <h2 className="section-title">Popular Destinations</h2>
            <Link to="/search/city" className="view-all-link">Explore more <TrendingUp size={16} className="ml-1" /></Link>
          </div>
          
          <div className="destinations-grid">
            {regionalSelections.map((dest, i) => (
              <Link 
                to="/trip/template/view" 
                state={{ templateCity: dest.name }} 
                key={i} 
                className={`destination-card card-size-${i % 3}`}
                style={{ textDecoration: 'none' }}
              >
                <img src={dest.image} alt={dest.name} className="destination-image" />
                <div className="destination-overlay-gradient" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                  <span className="destination-name"><MapPin size={16} className="mr-1"/> {dest.name}</span>
                  <span className="text-secondary" style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', marginTop: '0.25rem' }}>Est. {dest.cost}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>

      {/* Floating Action Button */}
      <Link to="/create-trip" className="fab-button-modern">
        <Plus size={24} /> <span>Plan New Trip</span>
      </Link>
    </div>
  );
};
