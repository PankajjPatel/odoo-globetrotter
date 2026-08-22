import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MapPin, LayoutDashboard, PlusCircle, Compass, User, LogOut, ShieldAlert, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

  if (location.pathname === '/login' || !isAuthenticated) return null;

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  const displayName = user?.full_name || user?.first_name || user?.username || 'Explorer';
  const initial = displayName.charAt(0).toUpperCase();
  const isAdmin = user?.is_superuser || user?.is_staff || user?.username === '_Pankaj_03';

  return (
    <header className="navbar-header glass">
      <div className="navbar-container container">
        <Link to="/" className="navbar-brand">
          <div className="brand-logo-wrapper">
            <Compass className="brand-icon" size={24} />
          </div>
          <span className="brand-title">Globe<span className="brand-highlight">Trotter</span></span>
        </Link>

        <div className="navbar-links">
          <Link to="/dashboard" className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}>
            <LayoutDashboard size={17} /> <span>Dashboard</span>
          </Link>
          <Link to="/my-trips" className={`nav-link ${location.pathname === '/my-trips' ? 'active' : ''}`}>
            <MapPin size={17} /> <span>My Trips</span>
          </Link>
          <Link to="/search/city" className={`nav-link ${location.pathname === '/search/city' ? 'active' : ''}`}>
            <Compass size={17} /> <span>Destinations</span>
          </Link>
          <Link to="/search/activity" className={`nav-link ${location.pathname === '/search/activity' ? 'active' : ''}`}>
            <Sparkles size={17} /> <span>Activities</span>
          </Link>
          <Link to="/create-trip" className="nav-link-cta">
            <PlusCircle size={17} /> <span>Plan Trip</span>
          </Link>
        </div>

        <div className="navbar-profile">
          <Link to="/profile" className={`profile-pill ${location.pathname === '/profile' ? 'active' : ''}`} title={`Profile: ${displayName}`}>
            <div className="avatar-circle">{initial}</div>
            <span className="navbar-username">{displayName.split(' ')[0]}</span>
          </Link>
          <button 
            type="button" 
            onClick={handleLogout} 
            className="logout-action-btn" 
            title="Log Out"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
};
