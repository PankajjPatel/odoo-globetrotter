import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Search, MapPin, TrendingUp, DollarSign, PlusCircle, Compass, Sparkles } from 'lucide-react';
import './CitySearchScreen.css';

const DEFAULT_CITY_IMAGES = {
  'Delhi': 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&q=80',
  'Jaipur': 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&q=80',
  'Varanasi': 'https://images.unsplash.com/photo-1561359313-0639aad49ca6?w=800&q=80',
  'Goa': 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80',
  'Mumbai': 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&q=80',
  'Bengaluru': 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800&q=80',
  'Agra': 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=80',
  'Udaipur': 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?w=800&q=80',
  'Manali': 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&q=80',
  'Hyderabad': 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=800&q=80',
  'Gangtok': 'https://images.unsplash.com/photo-1622308644420-a7d5c52c6767?w=800&q=80',
  'Guwahati': 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=800&q=80',
  'Kochi': 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80',
  'Kerala': 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80',
  'Shimla': 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?w=800&q=80',
  'Rishikesh': 'https://images.unsplash.com/photo-1600100397608-f010f443b711?w=800&q=80',
  'Amritsar': 'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?w=800&q=80',
  'Kolkata': 'https://images.unsplash.com/photo-1558431382-27e303142255?w=800&q=80',
  'Chennai': 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&q=80',
  'Darjeeling': 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&q=80',
  'Srinagar': 'https://images.unsplash.com/photo-1598091383021-15ddea10925d?w=800&q=80',
  'Leh': 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?w=800&q=80',
  'Ladakh': 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?w=800&q=80',
  'Jodhpur': 'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?w=800&q=80',
  'Jaisalmer': 'https://images.unsplash.com/photo-1603258754179-c5c64ceadff3?w=800&q=80',
  'Mysore': 'https://images.unsplash.com/photo-1600100397608-f010f443b711?w=800&q=80',
  'Pune': 'https://images.unsplash.com/photo-1571536802807-30451e3955d8?w=800&q=80',
  'Bali': 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
  'Tokyo': 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80',
  'Dubai': 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80',
  'Paris': 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80',
  'London': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80',
  'Rome': 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=80',
  'Singapore': 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&q=80',
  'New York': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=80',
};

const getCityLandmarkImage = (cityName, serverUrl) => {
  if (cityName && DEFAULT_CITY_IMAGES[cityName]) {
    return DEFAULT_CITY_IMAGES[cityName];
  }
  if (serverUrl && typeof serverUrl === 'string' && serverUrl.startsWith('http')) {
    return serverUrl;
  }
  // Try case-insensitive lookup
  const cleanName = (cityName || '').trim().toLowerCase();
  for (const [key, url] of Object.entries(DEFAULT_CITY_IMAGES)) {
    if (key.toLowerCase() === cleanName || cleanName.includes(key.toLowerCase())) {
      return url;
    }
  }
  return 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80';
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

  const displayCityCost = (cost) => {
    if (!cost) return '2,500 Rupees / day';
    if (cost.includes('Rupees') || cost.includes('rupees')) return cost;
    if (cost === '₹₹₹' || cost === '$$$') return '5,000 Rupees / day (Luxury)';
    if (cost === '₹₹' || cost === '$$') return '2,500 Rupees / day (Moderate)';
    if (cost === '₹' || cost === '$') return '1,200 Rupees / day (Budget)';
    return `${cost} Rupees / day`;
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
          <option value="Any Cost">Any Price Range</option>
          <option value="₹">Budget (1,200 Rupees/day)</option>
          <option value="₹₹">Moderate (2,500 Rupees/day)</option>
          <option value="₹₹₹">Luxury (5,000 Rupees/day)</option>
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
            const cityImg = getCityLandmarkImage(city.name, city.image_url || city.image);
            return (
              <Card key={city.id} className="city-card hoverable">
                <div className="city-image-container">
                  <img 
                    src={cityImg} 
                    alt={city.name} 
                    className="city-image-real" 
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80';
                    }}
                  />
                </div>
                <div className="city-info">
                  <div className="city-title-row">
                    <h3>{city.name}, <span className="text-secondary">{city.country}</span></h3>
                  </div>
                  <div className="city-meta-tags">
                    <span className="meta-tag"><TrendingUp size={14}/> {city.popularity || 'Popular'}</span>
                    <span className="meta-tag font-semibold text-success">{displayCityCost(city.cost_index)}</span>
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
