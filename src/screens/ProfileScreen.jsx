import React, { useState } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { UserCircle, Trash2, Globe, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './ProfileScreen.css';

export const ProfileScreen = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    name: user?.full_name || user?.first_name || 'Explorer Doe',
    email: user?.email || 'explorer@example.com',
    language: 'English',
  });


  const savedDestinations = ['Kyoto, Japan', 'Reykjavik, Iceland', 'Banff, Canada'];

  return (
    <div className="profile-container container animate-fade-in">
      <div className="profile-header">
        <h1>Profile & Settings</h1>
        <p className="text-secondary">Manage your personal data, preferences, and privacy.</p>
      </div>

      <div className="profile-content">
        <div className="profile-main">
          <Card className="profile-card glass">
            <h2>Personal Information</h2>
            <div className="profile-photo-section">
              <UserCircle size={80} className="text-secondary" />
              <Button variant="outline" size="sm">Change Photo</Button>
            </div>
            
            <form className="profile-form">
              <Input 
                label="Full Name" 
                id="name" 
                value={profile.name} 
                onChange={(e) => setProfile({...profile, name: e.target.value})} 
              />
              <Input 
                label="Email Address" 
                id="email" 
                type="email" 
                value={profile.email} 
                onChange={(e) => setProfile({...profile, email: e.target.value})} 
              />
              
              <div className="input-group">
                <label className="input-label">Language Preference</label>
                <div className="input-with-icon">
                  <Globe size={18} />
                  <select 
                    className="inline-input w-full" 
                    value={profile.language}
                    onChange={(e) => setProfile({...profile, language: e.target.value})}
                  >
                    <option>English</option>
                    <option>Spanish</option>
                    <option>French</option>
                  </select>
                </div>
              </div>

              <div className="form-actions mt-4">
                <Button variant="primary">Save Changes</Button>
              </div>
            </form>
          </Card>

          <Card className="danger-zone-card">
            <h2 className="text-danger">Danger Zone</h2>
            <p className="text-secondary mb-4">Once you delete your account, there is no going back. Please be certain.</p>
            <Button variant="outline" className="btn-danger-outline">
              <Trash2 size={16} className="mr-2" /> Delete Account
            </Button>
          </Card>
        </div>

        <div className="profile-sidebar">
          <Card className="saved-destinations-card glass">
            <h2><Heart size={20} className="text-red mr-2 inline-icon" /> Saved Destinations</h2>
            <ul className="saved-list">
              {savedDestinations.map((dest, i) => (
                <li key={i} className="saved-item">{dest}</li>
              ))}
            </ul>
            <Button variant="ghost" className="w-full mt-4 text-primary">Explore More</Button>
          </Card>
        </div>
      </div>
    </div>
  );
};
