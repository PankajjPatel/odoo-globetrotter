import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Search, MapPin, TrendingUp, DollarSign, PlusCircle, Compass, Sparkles } from 'lucide-react';
import './CitySearchScreen.css';

const DEFAULT_CITY_IMAGES = {
  'Delhi': 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&q=80',
  'Jaipur': 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&q=80',
  'Varanasi': 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800&q=80',
  'Goa': 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80',
  'Mumbai': 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&q=80',
  'Bengaluru': 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800&q=80',
  'Agra': 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=80',
  'Bali': 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
  'Tokyo': 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80',
};

export const CitySearchScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState(location.state?.initialSearch || '');
  const [selectedRegion, setSelectedRegion] = useState('All Regions');
  const [selectedCost, setSelectedCost] = useState('Any Cost');
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCities = async () => {
    try {
      setLoading(true);
      let url = `/api/cities/?search=${encodeURIComponent(searchTerm)}`;
      if (selectedRegion !== 'All Regions') {
        url += `&region=${encodeURIComponent(selectedRegion)}`;
      }
      const res = await fetch(url);
      if (res.ok) {
        let data = await res.json();
        if (selectedCost !== 'Any Cost') {
          data = data.filter(c => c.cost_index === selectedCost);
        }
        setCities(data);
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCities();
  }, [searchTerm, selectedRegion, selectedCost]);

  const handlePlanTripForCity = (cityName) => {
    navigate('/create-trip', { state: { prefilledDestination: cityName } });
  };

  return (
    <div className="city-search-container container animate-fade-in">
      <div className="search-header-large">
        <div className="flex-center gap-2 mb-2">
          <Sparkles size={20} className="text-primary-brand" />
          <span className="fw-600 text-primary-brand">Curated Travel Catalog</span>
        </div>
        <h1>Discover Global Destinations</h1>
        <p className="text-secondary">Find the ideal cities to include in your personalized journey itinerary.</p>
        
        <div className="search-bar-mega">
          <Search size={22} className="search-icon-mega" />
          <input 
            type="text" 
            placeholder="Search by city, country, or region..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <Button variant="ghost" size="sm" onClick={() => setSearchTerm('')}>Clear</Button>
          )}
        </div>
      </div>

      <div className="filters-row">
        <select 
          className="filter-select"
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(e.target.value)}
        >
          <option value="All Regions">All Regions</option>
          <option value="North India">North India</option>
          <option value="South India">South India</option>
          <option value="West India">West India</option>
          <option value="East India">East India</option>
          <option value="Asia">Asia</option>
          <option value="Europe">Europe</option>
        </select>

        <select 
          className="filter-select"
          value={selectedCost}
          onChange={(e) => setSelectedCost(e.target.value)}
        >
          <option value="Any Cost">Any Cost</option>
          <option value="₹">Budget (₹)</option>
          <option value="₹₹">Moderate (₹₹)</option>
          <option value="₹₹₹">Luxury (₹₹₹)</option>
        </select>
      </div>

      <div className="cities-grid">
        {loading ? (
          <div className="empty-state-card glass w-full" style={{ gridColumn: '1 / -1' }}>
            <Compass size={40} className="spin-icon text-primary-brand" />
            <h3 className="mt-3">Searching destinations...</h3>
          </div>
        ) : cities.length > 0 ? (
          cities.map(city => {
            const cityImg = DEFAULT_CITY_IMAGES[city.name] || city.image_url || 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=600&q=80';
            return (
              <Card key={city.id} className="city-card hoverable">
                <div className="city-image-container">
                  <img src={cityImg} alt={city.name} className="city-image-real" />
                </div>
                <div className="city-info">
                  <div className="city-title-row">
                    <h3>{city.name}, <span className="text-secondary">{city.country}</span></h3>
                  </div>
                  <div className="city-meta-tags">
                    <span className="meta-tag"><TrendingUp size={14}/> {city.popularity || 'Popular'}</span>
                    <span className="meta-tag">₹ Cost: {city.cost_index || '₹₹'}</span>
                  </div>
                  <Button 
                    variant="primary" 
                    className="w-full mt-4"
                    onClick={() => handlePlanTripForCity(city.name)}
                  >
                    <PlusCircle size={16} className="mr-2" /> Plan Trip Here
                  </Button>
                </div>
              </Card>
            );
          })
        ) : (
          <div className="empty-state-card glass w-full" style={{ gridColumn: '1 / -1' }}>
            <MapPin size={48} className="text-secondary opacity-50" />
            <h3>No destinations found</h3>
            <p className="text-secondary">Try adjusting your search query or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};
