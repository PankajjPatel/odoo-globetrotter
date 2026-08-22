import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MapPin, LayoutDashboard, PlusCircle, Compass, User, LogOut, ShieldAlert } from 'lucide-react';
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
  const isAdmin = user?.is_superuser || user?.is_staff || user?.username === '_Pankaj_03';

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
          {isAdmin && (
            <Link
              to="/admin"
              className={`nav-link admin-nav-link ${location.pathname === '/admin' ? 'active' : ''}`}
              style={{
                color: '#ff5722',
                fontWeight: '700',
                border: '1px solid rgba(255, 87, 34, 0.3)',
                padding: '4px 10px',
                borderRadius: '6px',
                background: 'rgba(255, 87, 34, 0.08)'
              }}
            >
              <ShieldAlert size={18} style={{ marginRight: '4px' }} /> Admin Panel
            </Link>
          )}
        </div>
        <div className="navbar-profile">
          <Link to="/profile" className="profile-btn" title={`Profile: ${displayName}`}>
            <User size={20}/>
            <span className="navbar-username" style={{ fontSize: '0.85rem', fontWeight: '500', marginLeft: '6px' }}>
              {displayName.split(' ')[0]}
            </span>
          </Link>
          <button 
            type="button" 
            onClick={handleLogout} 
            className="logout-btn" 
            title="Log Out"
            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          >
            <LogOut size={20}/>
          </button>
        </div>
      </div>
    </nav>
  );
};
