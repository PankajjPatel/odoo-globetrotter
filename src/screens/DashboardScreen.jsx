import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { MapPin, Calendar, Plus, Search, Filter, SlidersHorizontal, DollarSign } from 'lucide-react';
import './DashboardScreen.css';

export const DashboardScreen = () => {
  // Dummy data
  const upcomingTrips = [
    { id: 1, name: 'Summer in Europe', dates: 'Jun 15 - Jun 30', cover: 'bg-europe' },
    { id: 2, name: 'Tokyo Adventure', dates: 'Oct 5 - Oct 15', cover: 'bg-tokyo' },
    { id: 3, name: 'New York Weekend', dates: 'Dec 1 - Dec 4', cover: 'bg-ny' },
  ];

  const regionalSelections = [
    { name: 'Bali', image: 'bg-bali' },
    { name: 'Rome', image: 'bg-rome' },
    { name: 'Kyoto', image: 'bg-kyoto' },
    { name: 'Paris', image: 'bg-paris' },
    { name: 'Cairo', image: 'bg-cairo' },
  ];

  return (
    <div className="dashboard-wrapper animate-fade-in">
      {/* Banner Section */}
      <div className="dashboard-banner">
        <div className="banner-content">
          <h1>Welcome back, Explorer! 👋</h1>
          <p>Ready for your next adventure?</p>
          
          {/* Budget Highlights inside banner to satisfy requirements */}
          <div className="budget-highlight-pill">
            <DollarSign size={16} /> 'Summer in Europe' is 10% under budget!
          </div>
        </div>
      </div>

      <div className="dashboard-container container">
        {/* Search and Filters Bar */}
        <div className="search-filter-bar">
          <div className="search-input-wrapper">
            <Search size={18} className="search-icon" />
            <input type="text" placeholder="Search bar ...." className="search-input" />
          </div>
          <div className="filter-actions">
            <Button variant="outline" size="sm" className="action-btn">Group by</Button>
            <Button variant="outline" size="sm" className="action-btn"><Filter size={14} className="mr-1"/> Filter</Button>
            <Button variant="outline" size="sm" className="action-btn"><SlidersHorizontal size={14} className="mr-1"/> Sort by...</Button>
          </div>
        </div>

        {/* Top Regional Selections */}
        <section className="dashboard-section">
          <h2 className="section-title">Top Regional Selections</h2>
          <div className="regional-grid">
            {regionalSelections.map((dest, i) => (
              <div key={i} className={`regional-card ${dest.image}`}>
                <div className="regional-overlay">
                  <span>{dest.name}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Previous Trips (Upcoming/Recent) */}
        <section className="dashboard-section">
          <h2 className="section-title">Previous Trips</h2>
          <div className="trips-grid-tall">
            {upcomingTrips.map(trip => (
              <Link to={`/trip/${trip.id}/builder`} key={trip.id} className="trip-link">
                <Card className={`trip-card-tall ${trip.cover} hoverable`}>
                  <div className="trip-card-tall-overlay">
                    <h3>{trip.name}</h3>
                    <p><Calendar size={14}/> {trip.dates}</p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </div>

      {/* Floating Action Button */}
      <Link to="/create-trip" className="fab-button">
        <Plus size={24} /> <span>Plan a trip</span>
      </Link>
    </div>
  );
};
