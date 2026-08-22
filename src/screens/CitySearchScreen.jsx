import React, { useState } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Search, MapPin, TrendingUp, DollarSign, Plus } from 'lucide-react';
import './CitySearchScreen.css';

export const CitySearchScreen = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Real Image Data
  const cities = [
    { id: 1, name: 'Jaipur', country: 'India', costIndex: '₹₹', popularity: 'Very High', image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=600&q=80' },
    { id: 2, name: 'Varanasi', country: 'India', costIndex: '₹', popularity: 'High', image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=600&q=80' },
    { id: 3, name: 'Bali', country: 'Indonesia', costIndex: '₹₹', popularity: 'High', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80' },
    { id: 4, name: 'Tokyo', country: 'Japan', costIndex: '₹₹₹₹', popularity: 'Very High', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&q=80' },
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
          <option>Budget (₹)</option>
          <option>Moderate (₹₹)</option>
          <option>Luxury (₹₹₹₹)</option>
        </select>
      </div>

      <div className="cities-grid">
        {cities.map(city => (
          <Card key={city.id} className="city-card hoverable">
            <div className="city-image-container">
              <img src={city.image} alt={city.name} className="city-image-real" />
            </div>
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
