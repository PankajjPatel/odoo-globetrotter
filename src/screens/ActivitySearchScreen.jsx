import React, { useState } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Search, MapPin, Clock, DollarSign, Plus } from 'lucide-react';
import './ActivitySearchScreen.css';

export const ActivitySearchScreen = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Dummy Data
  const activities = [
    { id: 1, name: 'Eiffel Tower Tour', city: 'Paris', type: 'Sightseeing', cost: '$30', duration: '2 hours', image: 'bg-paris' },
    { id: 2, name: 'Sushi Making Class', city: 'Tokyo', type: 'Food', cost: '$80', duration: '3 hours', image: 'bg-tokyo' },
    { id: 3, name: 'Colosseum Underground', city: 'Rome', type: 'History', cost: '$45', duration: '2.5 hours', image: 'bg-rome' },
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
          <option>Free</option>
          <option>Under $50</option>
          <option>$50 - $100</option>
          <option>Over $100</option>
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
            <div className={`activity-image ${act.image}`}>
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
