import React, { useState } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Search, MapPin, TrendingUp, DollarSign, Plus } from 'lucide-react';
import './CitySearchScreen.css';

export const CitySearchScreen = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Dummy Data
  const cities = [
    { id: 1, name: 'Tokyo', country: 'Japan', costIndex: '$$$', popularity: 'Very High', image: 'bg-tokyo' },
    { id: 2, name: 'Paris', country: 'France', costIndex: '$$$$', popularity: 'High', image: 'bg-paris' },
    { id: 3, name: 'Bali', country: 'Indonesia', costIndex: '$', popularity: 'High', image: 'bg-bali' },
    { id: 4, name: 'Rome', country: 'Italy', costIndex: '$$', popularity: 'High', image: 'bg-rome' },
  ];

  return (
    <div className="city-search-container container animate-fade-in">
      <div className="search-header-large">
        <h1>Discover Destinations</h1>
        <p className="text-secondary">Find the perfect cities to add to your itinerary.</p>
        
        <div className="search-bar-mega">
          <Search size={24} className="search-icon-mega" />
          <input 
            type="text" 
            placeholder="Search by city, country, or region..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button variant="primary" className="search-btn-mega">Search</Button>
        </div>
      </div>

      <div className="filters-row">
        <select className="filter-select">
          <option>All Regions</option>
          <option>Europe</option>
          <option>Asia</option>
          <option>North America</option>
        </select>
        <select className="filter-select">
          <option>Any Cost</option>
          <option>Budget ($)</option>
          <option>Moderate ($$)</option>
          <option>Luxury ($$$$)</option>
        </select>
      </div>

      <div className="cities-grid">
        {cities.map(city => (
          <Card key={city.id} className="city-card hoverable">
            <div className={`city-image ${city.image}`}></div>
            <div className="city-info">
              <div className="city-title-row">
                <h3>{city.name}, <span className="text-secondary">{city.country}</span></h3>
              </div>
              <div className="city-meta-tags">
                <span className="meta-tag"><TrendingUp size={14}/> {city.popularity}</span>
                <span className="meta-tag"><DollarSign size={14}/> Cost: {city.costIndex}</span>
              </div>
              <Button variant="outline" className="w-full mt-4">
                <Plus size={16} className="mr-2" /> Add to Trip
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
