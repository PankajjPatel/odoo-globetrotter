import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MapPin, LayoutDashboard, PlusCircle, Compass, Settings, User, LogOut } from 'lucide-react';
import './Navbar.css';

export const Navbar = () => {
  const location = useLocation();

  if (location.pathname === '/login') return null;

  return (
    <nav className="navbar glass">
      <div className="navbar-container container">
        <Link to="/" className="navbar-brand">
          <Compass className="brand-icon" />
          <span>GlobeTrotter</span>
        </Link>
        <div className="navbar-links">
          <Link to="/dashboard" className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}>
            <LayoutDashboard size={20} /> Dashboard
          </Link>
          <Link to="/my-trips" className={`nav-link ${location.pathname === '/my-trips' ? 'active' : ''}`}>
            <MapPin size={20} /> My Trips
          </Link>
          <Link to="/create-trip" className={`nav-link btn-primary-nav`}>
            <PlusCircle size={20} /> Plan New Trip
          </Link>
        </div>
        <div className="navbar-profile">
          <Link to="/profile" className="profile-btn"><User size={20}/></Link>
          <Link to="/login" className="logout-btn"><LogOut size={20}/></Link>
        </div>
      </div>
    </nav>
  );
};
