import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Search, MapPin, Clock, Plus, Compass, Sparkles, Filter } from 'lucide-react';
import './ActivitySearchScreen.css';

const DEFAULT_ACTIVITIES_CATALOG = [
  { id: 1, name: 'Taj Mahal Sunrise Tour', city_name: 'Agra', type: 'Sightseeing', cost: '1,100', duration: '3 hours', image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600&q=80', description: 'Marvel at the ivory-white marble mausoleum on the south bank of the Yamuna river.' },
  { id: 2, name: 'Amber Fort Elephant & Jeep Experience', city_name: 'Jaipur', type: 'History', cost: '500', duration: '3.5 hours', image: 'https://images.unsplash.com/photo-1603258754179-c5c64ceadff3?w=600&q=80', description: 'Majestic hilltop fort known for artistic Hindu style elements and grand courtyards.' },
  { id: 3, name: 'Baga Beach Watersports Combo', city_name: 'Goa', type: 'Adventure', cost: '2,500', duration: '3 hours', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&q=80', description: 'Exciting jet ski, parasailing, and banana boat rides on the Arabian Sea.' },
  { id: 4, name: 'Scuba Diving & Coral Safari', city_name: 'Goa', type: 'Adventure', cost: '3,500', duration: '4 hours', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80', description: 'Guided underwater scuba dive near Grande Island exploring vibrant marine life.' },
  { id: 5, name: 'Lake Pichola Sunset Cruise', city_name: 'Udaipur', type: 'Sightseeing', cost: '850', duration: '1.5 hours', image: 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?w=600&q=80', description: 'Scenic boat cruise offering breathtaking sunset views over palace islands.' },
  { id: 6, name: 'City Palace Royal Walk', city_name: 'Udaipur', type: 'Culture', cost: '450', duration: '2.5 hours', image: 'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?w=600&q=80', description: 'A grand complex of palaces with mirrored chambers, balconies, and courtyards.' },
  { id: 7, name: 'Solang Valley Paragliding & Skiing', city_name: 'Manali', type: 'Adventure', cost: '3,200', duration: '3 hours', image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600&q=80', description: 'Tandem paragliding with panoramic views of snowcapped Himalayan peaks.' },
  { id: 8, name: 'Rohtang Pass Snow Excursion', city_name: 'Manali', type: 'Sightseeing', cost: '2,800', duration: '6 hours', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&q=80', description: 'High mountain pass connecting the Kullu Valley with the Lahaul and Spiti Valleys.' },
  { id: 9, name: 'Dashashwamedh Ghat Evening Ganga Aarti', city_name: 'Varanasi', type: 'Culture', cost: '0', duration: '2 hours', image: 'https://images.unsplash.com/photo-1561359313-0639aad49ca6?w=600&q=80', description: 'Spiritual ceremony with brass lamps and Vedic chants at the banks of the sacred Ganges.' },
  { id: 10, name: 'Kashi Vishwanath Temple Darshan', city_name: 'Varanasi', type: 'Culture', cost: '250', duration: '2 hours', image: 'https://images.unsplash.com/photo-1571536802807-30451e3955d8?w=600&q=80', description: 'One of the most famous Hindu temples dedicated to Lord Shiva.' },
  { id: 11, name: 'Gateway of India & Elephanta Caves', city_name: 'Mumbai', type: 'Sightseeing', cost: '750', duration: '4.5 hours', image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600&q=80', description: 'Ferry ride from the Gateway of India to UNESCO rock-cut cave temples.' },
  { id: 12, name: 'Marine Drive Sunset Stroll & Street Food', city_name: 'Mumbai', type: 'Food', cost: '400', duration: '2 hours', image: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=600&q=80', description: 'Iconic Queen\'s Necklace promenade with famous Mumbai chaat and cutting chai.' },
  { id: 13, name: 'Red Fort & Old Delhi Heritage Walk', city_name: 'Delhi', type: 'History', cost: '500', duration: '3 hours', image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&q=80', description: 'Walk through historic Chandni Chowk and the historic red sandstone fortress.' },
  { id: 14, name: 'Qutub Minar Architectural Tour', city_name: 'Delhi', type: 'History', cost: '350', duration: '2 hours', image: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=600&q=80', description: 'UNESCO World Heritage Minaret standing 73 meters tall built in 1193.' },
  { id: 15, name: 'India Gate & Kartavya Path Walk', city_name: 'Delhi', type: 'Sightseeing', cost: '0', duration: '1.5 hours', image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&q=80', description: 'Iconic war memorial arch located along the grand ceremonial boulevard.' },
  { id: 16, name: 'Jaipur Traditional Street Food Tour', city_name: 'Jaipur', type: 'Food', cost: '1,200', duration: '3 hours', image: 'https://images.unsplash.com/photo-1589301773820-2c7c5edc15eb?w=600&q=80', description: 'Culinary journey through Old City tasting pyaz kachori, ghevar, and lassi.' },
  { id: 17, name: 'Hawa Mahal & City Palace Combo', city_name: 'Jaipur', type: 'Sightseeing', cost: '700', duration: '3 hours', image: 'https://images.unsplash.com/photo-1603258754179-c5c64ceadff3?w=600&q=80', description: 'The famous Palace of Winds with 953 honeycomb windows and royal courtyards.' },
  { id: 18, name: 'Charminar & Laad Bazaar Bangles Walk', city_name: 'Hyderabad', type: 'Sightseeing', cost: '150', duration: '2.5 hours', image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=600&q=80', description: 'Historic 16th-century monument and bustling traditional perfume & bangle markets.' },
  { id: 19, name: 'Golconda Fort Sound & Light Show', city_name: 'Hyderabad', type: 'History', cost: '400', duration: '3 hours', image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&q=80', description: 'Acoustic marvel fortress known for the diamond trade and evening historical light show.' },
  { id: 20, name: 'Hyderabadi Dum Biryani Tasting Tour', city_name: 'Hyderabad', type: 'Food', cost: '950', duration: '2 hours', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&q=80', description: 'Authentic aromatic basmati rice cooked with saffron, tender meat, and rich spices.' },
  { id: 21, name: 'Bangalore Palace & Royal Gardens', city_name: 'Bengaluru', type: 'Culture', cost: '500', duration: '2.5 hours', image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=600&q=80', description: 'Tudor-style royal estate with fortified towers, stained glass, and lush courtyards.' },
  { id: 22, name: 'Lalbagh Botanical Garden Glass House', city_name: 'Bengaluru', type: 'Relaxation', cost: '100', duration: '2 hours', image: 'https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?w=600&q=80', description: '240-acre garden famous for century-old trees and Victorian glass conservatory.' },
  { id: 23, name: 'Agra Fort Mughal Architecture Walk', city_name: 'Agra', type: 'History', cost: '650', duration: '2.5 hours', image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600&q=80', description: 'Red sandstone fortress that served as the prime residence of Mughal emperors.' },
  { id: 24, name: 'Mehtab Bagh Taj Sunset Viewpoint', city_name: 'Agra', type: 'Sightseeing', cost: '300', duration: '1.5 hours', image: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=600&q=80', description: 'Charbagh garden complex situated across the Yamuna offering the best sunset reflection views.' },
  { id: 25, name: 'Fort Aguada & Sinquerim Coastal Tour', city_name: 'Goa', type: 'History', cost: '250', duration: '2 hours', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&q=80', description: '17th-century Portuguese fort and lighthouse overlooking the pristine Arabian Sea.' },
];

export const ActivitySearchScreen = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('Any Type');
  const [selectedCost, setSelectedCost] = useState('Any Cost');
  const [selectedDuration, setSelectedDuration] = useState('Any Duration');
  const [activities, setActivities] = useState(DEFAULT_ACTIVITIES_CATALOG);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        let url = `/api/activities/?search=${encodeURIComponent(searchTerm)}`;
        if (selectedType !== 'Any Type') url += `&type=${encodeURIComponent(selectedType)}`;
        
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setActivities(data);
          } else {
            // Apply in-memory search on default catalog if DB returns empty
            let filtered = DEFAULT_ACTIVITIES_CATALOG;
            if (searchTerm) {
              filtered = filtered.filter(a => 
                a.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                a.city_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                a.description.toLowerCase().includes(searchTerm.toLowerCase())
              );
            }
            if (selectedType !== 'Any Type') {
              filtered = filtered.filter(a => a.type.toLowerCase() === selectedType.toLowerCase());
            }
            setActivities(filtered);
          }
        }
      } catch {
        // Fallback filter
        let filtered = DEFAULT_ACTIVITIES_CATALOG;
        if (searchTerm) {
          filtered = filtered.filter(a => 
            a.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            a.city_name.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
        if (selectedType !== 'Any Type') {
          filtered = filtered.filter(a => a.type.toLowerCase() === selectedType.toLowerCase());
        }
        setActivities(filtered);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchActivities, 200);
    return () => clearTimeout(timer);
  }, [searchTerm, selectedType]);

  const handlePlanActivity = (activity) => {
    navigate('/create-trip', { state: { initialActivity: activity.name, initialCity: activity.city_name } });
  };

  return (
    <div className="activity-search-container container animate-fade-in">
      <div className="search-header-large">
        <div className="badge-pill mb-2">
          <Sparkles size={14} className="mr-1 text-primary-brand" /> {activities.length}+ Curated Experiences
        </div>
        <h1>Discover Top Activities & Tours</h1>
        <p className="text-secondary">Find authentic sightseeing, outdoor adventures, cultural landmarks, and culinary tours across India.</p>
        
        <div className="search-bar-mega">
          <Search size={22} className="search-icon-mega" />
          <input 
            type="text" 
            placeholder="Search activities by name, city, or keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="clear-search-btn" onClick={() => setSearchTerm('')}>×</button>
          )}
        </div>
      </div>

      <div className="filters-row">
        <select 
          className="filter-select"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
        >
          <option value="Any Type">All Categories</option>
          <option value="Sightseeing">Sightseeing</option>
          <option value="History">History & Heritage</option>
          <option value="Adventure">Outdoor & Adventure</option>
          <option value="Culture">Culture & Arts</option>
          <option value="Food">Food & Drink</option>
          <option value="Relaxation">Relaxation & Nature</option>
        </select>

        <select 
          className="filter-select"
          value={selectedCost}
          onChange={(e) => setSelectedCost(e.target.value)}
        >
          <option value="Any Cost">Any Price (₹)</option>
          <option value="free">Free / Entry Only</option>
          <option value="under1000">Under ₹1,000</option>
          <option value="1000to3000">₹1,000 - ₹3,000</option>
          <option value="over3000">Over ₹3,000</option>
        </select>

        <select 
          className="filter-select"
          value={selectedDuration}
          onChange={(e) => setSelectedDuration(e.target.value)}
        >
          <option value="Any Duration">Any Duration</option>
          <option value="1-2">1 - 2 hours</option>
          <option value="half">Half Day (3 - 4 hrs)</option>
          <option value="full">Full Day (5+ hrs)</option>
        </select>
      </div>

      <div className="activities-grid">
        {loading ? (
          <div className="empty-state-card glass w-full" style={{ gridColumn: '1 / -1' }}>
            <Compass size={40} className="spin-icon text-primary-brand" />
            <h3 className="mt-3">Finding top activities...</h3>
          </div>
        ) : activities.length > 0 ? (
          activities.map(act => (
            <Card key={act.id} className="activity-card hoverable">
              <div className="activity-image-container">
                <img 
                  src={act.image_url || act.image || 'https://images.unsplash.com/photo-1548013146-72479768bada?w=600&q=80'} 
                  alt={act.name} 
                  className="activity-image-real" 
                />
                <span className="activity-type-badge">{act.type || act.category || 'Sightseeing'}</span>
              </div>
              <div className="activity-info">
                <div className="activity-title-row">
                  <h3>{act.name}</h3>
                  <span className="text-secondary text-sm font-semibold">
                    <MapPin size={13} className="inline-icon mr-1"/> {act.city_name || act.city?.name || 'India'}
                  </span>
                </div>
                {act.description && (
                  <p className="activity-desc-snippet">{act.description}</p>
                )}
                <div className="activity-meta-tags">
                  <span className="meta-tag"><Clock size={13} className="mr-1"/> {act.duration || '2 hours'}</span>
                  <span className="meta-tag font-bold text-success">
                    {act.cost === '0' || act.cost === 0 || act.cost === '0.00' || act.cost === 'Free' ? 'Free' : `₹${act.cost}`}
                  </span>
                </div>
                <Button 
                  variant="primary" 
                  className="w-full mt-auto"
                  onClick={() => handlePlanActivity(act)}
                >
                  <Plus size={16} className="mr-2" /> Add to Itinerary
                </Button>
              </div>
            </Card>
          ))
        ) : (
          <div className="empty-state-card glass w-full" style={{ gridColumn: '1 / -1' }}>
            <Filter size={40} className="text-secondary opacity-50" />
            <h3 className="mt-3">No activities matched your search</h3>
            <p className="text-secondary">Try searching for a different city name or changing category filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

