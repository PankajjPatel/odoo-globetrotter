import React, { useState } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Search, MapPin, Clock, DollarSign, Plus } from 'lucide-react';
import './ActivitySearchScreen.css';

export const ActivitySearchScreen = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Real Image Data
  const activities = [
    { id: 1, name: 'Taj Mahal Sunrise Tour', city: 'Agra', type: 'Sightseeing', cost: '₹2,500', duration: '3 hours', image: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=600&q=80' },
    { id: 2, name: 'Backwaters Houseboat', city: 'Kerala', type: 'Relaxation', cost: '₹8,000', duration: '6 hours', image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&q=80' },
    { id: 3, name: 'Street Food Walk', city: 'Old Delhi', type: 'Food', cost: '₹1,200', duration: '2.5 hours', image: 'https://images.unsplash.com/photo-1589301773820-2c7c5edc15eb?w=600&q=80' },
  ];

  return (
    <div className="activity-search-container container animate-fade-in">
      <div className="search-header-large">
        <h1>Discover Activities</h1>
        <p className="text-secondary">Find the best experiences for your trip.</p>
        
        <div className="search-bar-mega">
          <Search size={24} className="search-icon-mega" />
          <input 
            type="text" 
            placeholder="Search activities by name or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button variant="primary" className="search-btn-mega">Search</Button>
        </div>
      </div>

      <div className="filters-row">
        <select className="filter-select">
          <option>Any Type</option>
          <option>Sightseeing</option>
          <option>Food & Drink</option>
          <option>Adventure</option>
          <option>History</option>
        </select>
        <select className="filter-select">
          <option>Any Cost</option>
          <option>Cost</option>
          <option>Under ₹2,000</option>
          <option>₹2,000 - ₹5,000</option>
          <option>Over ₹5,000</option>
        </select>
        <select className="filter-select">
          <option>Any Duration</option>
          <option>1-2 hours</option>
          <option>Half Day</option>
          <option>Full Day</option>
        </select>
      </div>

      <div className="activities-grid">
        {activities.map(act => (
          <Card key={act.id} className="activity-card hoverable">
            <div className="activity-image-container">
              <img src={act.image} alt={act.name} className="activity-image-real" />
              <span className="activity-type-badge">{act.type}</span>
            </div>
            <div className="activity-info">
              <div className="activity-title-row">
                <h3>{act.name}</h3>
                <span className="text-secondary text-sm"><MapPin size={12} className="inline-icon"/> {act.city}</span>
              </div>
              <div className="activity-meta-tags">
                <span className="meta-tag"><Clock size={14}/> {act.duration}</span>
                <span className="meta-tag text-success"><DollarSign size={14}/> {act.cost}</span>
              </div>
              <Button variant="outline" className="w-full mt-auto">
                <Plus size={16} className="mr-2" /> Add to Itinerary
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
