import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { Map, Calendar, DollarSign, Users, Globe, ArrowRight } from 'lucide-react';
import './LandingScreen.css';

export const LandingScreen = () => {
  return (
    <div className="landing-container animate-fade-in">
      {/* Landing Navbar */}
      <nav className="landing-nav">
        <div className="landing-logo">
          <Map size={28} className="text-primary" />
          <span className="fw-700 font-heading" style={{ fontSize: '1.25rem' }}>GlobeTrotter</span>
        </div>
        <div className="landing-nav-links">
          <Link to="/login" className="text-secondary hover-primary font-medium" style={{ textDecoration: 'none', marginRight: '1.5rem' }}>
            Log in
          </Link>
          <Link to="/login">
            <Button variant="primary">Sign up free</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="landing-hero">
        <div className="hero-background" style={{backgroundImage: `url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1600&q=80')`}}></div>
        <div className="landing-hero-content">
          <h1>Plan your next adventure with zero stress.</h1>
          <p>The ultimate travel planner that brings your itineraries, budgets, and travel buddies into one beautiful dashboard.</p>
          <div className="hero-cta-group">
            <Link to="/login">
              <Button variant="primary" size="lg">Start Planning Now <ArrowRight size={18} className="ml-1"/></Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg" className="bg-white">Create an Account</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="landing-features container">
        <div className="features-header">
          <h2>Everything you need for the perfect trip</h2>
          <p className="text-secondary">Say goodbye to messy spreadsheets and scattered notes.</p>
        </div>
        
        <div className="features-grid">
          <div className="feature-card glass">
            <div className="feature-icon bg-orange-light text-primary">
              <Calendar size={24} />
            </div>
            <h3>Smart Itinerary Builder</h3>
            <p className="text-secondary">Drag and drop your stops and activities into a beautiful timeline. Keep track of timings easily.</p>
          </div>
          
          <div className="feature-card glass">
            <div className="feature-icon bg-green-light text-green">
              <DollarSign size={24} />
            </div>
            <h3>Budget Tracking</h3>
            <p className="text-secondary">Set a budget and monitor your estimated costs. Visual charts help you avoid overspending.</p>
          </div>
          
          <div className="feature-card glass">
            <div className="feature-icon bg-blue-light text-blue">
              <Users size={24} />
            </div>
            <h3>Collaborate with Friends</h3>
            <p className="text-secondary">Share your trip link with travel buddies. Everyone can view the plan and get excited together.</p>
          </div>
          
          <div className="feature-card glass">
            <div className="feature-icon bg-purple-light text-purple">
              <Globe size={24} />
            </div>
            <h3>Discover Destinations</h3>
            <p className="text-secondary">Get inspired by popular destinations and browse local activities tailored to your budget.</p>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="landing-bottom-cta">
        <div className="container text-center">
          <h2>Ready to explore the world?</h2>
          <p className="mb-4">Join thousands of travelers planning their dream trips on GlobeTrotter.</p>
          <Link to="/login">
            <Button variant="primary" size="lg">Get Started for Free</Button>
          </Link>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="landing-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-logo">
              <Map size={20} className="text-primary mr-1" />
              <span className="fw-600 font-heading">GlobeTrotter</span>
            </div>
            <p className="text-secondary" style={{ fontSize: '0.9rem' }}>&copy; 2026 GlobeTrotter Inc. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
