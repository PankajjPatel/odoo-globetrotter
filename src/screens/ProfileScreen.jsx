import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { 
  UserCircle, 
  Trash2, 
  Globe, 
  Heart, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Compass, 
  Plus, 
  X,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './ProfileScreen.css';

const AVATAR_COLORS = [
  { id: 'sunset', bg: 'linear-gradient(135deg, #ff5722 0%, #ff8a65 100%)', label: 'Sunset Orange' },
  { id: 'ocean', bg: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)', label: 'Ocean Blue' },
  { id: 'emerald', bg: 'linear-gradient(135deg, #059669 0%, #34d399 100%)', label: 'Emerald' },
  { id: 'royal', bg: 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)', label: 'Royal Purple' },
  { id: 'midnight', bg: 'linear-gradient(135deg, #0f172a 0%, #334155 100%)', label: 'Midnight' },
];

export const ProfileScreen = () => {
  const navigate = useNavigate();
  const { user, updateProfile, deleteAccount } = useAuth();

  const [profile, setProfile] = useState({
    name: user?.full_name || user?.first_name || user?.username || '',
    email: user?.email || '',
    language: localStorage.getItem('globetrotter_lang') || 'English',
  });

  const [selectedAvatarColor, setSelectedAvatarColor] = useState(
    localStorage.getItem('globetrotter_avatar_color') || 'sunset'
  );

  const [savedDestinations, setSavedDestinations] = useState(() => {
    try {
      const saved = localStorage.getItem('globetrotter_saved_destinations');
      return saved ? JSON.parse(saved) : ['Kyoto, Japan', 'Reykjavik, Iceland', 'Banff, Canada', 'Goa, India'];
    } catch {
      return ['Kyoto, Japan', 'Reykjavik, Iceland', 'Banff, Canada', 'Goa, India'];
    }
  });

  const [newCityInput, setNewCityInput] = useState('');
  const [showAddCity, setShowAddCity] = useState(false);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (user) {
      setProfile(prev => ({
        ...prev,
        name: user.full_name || user.first_name || user.username || '',
        email: user.email || '',
      }));
    }
  }, [user]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);
    try {
      await updateProfile({
        full_name: profile.name.trim(),
        email: profile.email.trim(),
      });
      localStorage.setItem('globetrotter_lang', profile.language);
      localStorage.setItem('globetrotter_avatar_color', selectedAvatarColor);
      setFeedback({ type: 'success', message: 'Profile & preferences updated successfully!' });
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Failed to update profile.' });
    } finally {
      setSaving(false);
    }
  };

  const handleAddDestination = () => {
    if (!newCityInput.trim()) return;
    const updated = Array.from(new Set([...savedDestinations, newCityInput.trim()]));
    setSavedDestinations(updated);
    localStorage.setItem('globetrotter_saved_destinations', JSON.stringify(updated));
    setNewCityInput('');
    setShowAddCity(false);
  };

  const handleRemoveDestination = (destToRemove) => {
    const updated = savedDestinations.filter(d => d !== destToRemove);
    setSavedDestinations(updated);
    localStorage.setItem('globetrotter_saved_destinations', JSON.stringify(updated));
  };

  const handleExploreDestination = (dest) => {
    navigate('/search/city', { state: { initialSearch: dest.split(',')[0] } });
  };

  const handleDeleteAccountConfirm = async () => {
    setDeleting(true);
    try {
      await deleteAccount();
      navigate('/login', { replace: true });
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Account deletion failed.' });
      setShowDeleteModal(false);
    } finally {
      setDeleting(false);
    }
  };

  const activeColorObj = AVATAR_COLORS.find(c => c.id === selectedAvatarColor) || AVATAR_COLORS[0];
  const initial = profile.name ? profile.name.charAt(0).toUpperCase() : 'E';

  return (
    <div className="profile-container container animate-fade-in">
      <div className="profile-header">
        <div className="profile-title-group">
          <h1>Account & Profile Settings</h1>
          <p className="text-secondary">Manage your personal credentials, customize avatar theme, and saved wishlist.</p>
        </div>
      </div>

      {feedback && (
        <div className={`profile-alert animate-fade-in ${feedback.type === 'error' ? 'alert-error' : 'alert-success'}`}>
          {feedback.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
          <span>{feedback.message}</span>
          <button className="close-alert-btn" onClick={() => setFeedback(null)}>×</button>
        </div>
      )}

      <div className="profile-layout-grid">
        {/* Main Settings Form */}
        <div className="profile-main-col">
          <Card className="profile-form-card glass">
            <div className="profile-avatar-banner">
              <div className="avatar-preview-box" style={{ background: activeColorObj.bg }}>
                <span>{initial}</span>
              </div>
              <div className="avatar-meta-info">
                <h3>{profile.name || 'Traveler'}</h3>
                <p className="text-secondary">{profile.email || 'traveler@globetrotter.com'}</p>
                <div className="avatar-color-selector">
                  <span className="color-picker-label">Avatar Color Theme:</span>
                  <div className="color-swatches-row">
                    {AVATAR_COLORS.map(c => (
                      <button
                        key={c.id}
                        type="button"
                        className={`color-swatch-btn ${selectedAvatarColor === c.id ? 'active' : ''}`}
                        style={{ background: c.bg }}
                        onClick={() => setSelectedAvatarColor(c.id)}
                        title={c.label}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={handleSaveProfile} className="profile-form-body">
              <div className="form-row-grid">
                <div className="input-group">
                  <label className="input-label" htmlFor="profile-fullname">Full Name</label>
                  <input
                    id="profile-fullname"
                    type="text"
                    className="styled-input-field"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div className="input-group">
                  <label className="input-label" htmlFor="profile-email">Email Address</label>
                  <input
                    id="profile-email"
                    type="email"
                    className="styled-input-field"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div className="input-group mt-3">
                <label className="input-label">Language Preference</label>
                <div className="select-with-icon">
                  <Globe size={18} className="select-icon-inside" />
                  <select 
                    className="styled-select-field"
                    value={profile.language}
                    onChange={(e) => setProfile({ ...profile, language: e.target.value })}
                  >
                    <option value="English">English (United States)</option>
                    <option value="Hindi">Hindi (हिन्दी)</option>
                    <option value="Spanish">Spanish (Español)</option>
                    <option value="French">French (Français)</option>
                    <option value="German">German (Deutsch)</option>
                  </select>
                </div>
              </div>

              <div className="profile-form-actions">
                <Button variant="primary" type="submit" disabled={saving} className="save-changes-btn">
                  {saving ? 'Saving Changes...' : 'Save Profile Changes'}
                </Button>
              </div>
            </form>
          </Card>

          {/* Danger Zone */}
          <Card className="danger-zone-card">
            <div className="danger-zone-header">
              <Trash2 size={22} className="text-danger" />
              <div>
                <h3 className="text-danger">Danger Zone</h3>
                <p className="text-secondary mb-0">Permanently delete your account, trips, and saved bookmarks.</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="btn-danger-outline" 
              onClick={() => setShowDeleteModal(true)}
            >
              Delete Account
            </Button>
          </Card>
        </div>

        {/* Saved Destinations Wishlist Sidebar */}
        <div className="profile-sidebar-col">
          <Card className="saved-destinations-card glass">
            <div className="sidebar-card-header">
              <div className="flex-align-center gap-2">
                <Heart size={20} className="text-danger" fill="#ef4444" />
                <h2>Saved Destinations</h2>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowAddCity(!showAddCity)}
                className="btn-add-dest"
              >
                <Plus size={16} /> Add
              </Button>
            </div>

            {showAddCity && (
              <div className="add-city-inline-form animate-fade-in">
                <input 
                  type="text" 
                  placeholder="e.g. Rome, Italy"
                  value={newCityInput}
                  onChange={(e) => setNewCityInput(e.target.value)}
                  className="add-city-input"
                  onKeyDown={(e) => e.key === 'Enter' && handleAddDestination()}
                />
                <Button variant="primary" size="sm" onClick={handleAddDestination}>Save</Button>
              </div>
            )}

            <div className="saved-destinations-list">
              {savedDestinations.map((dest, i) => (
                <div key={i} className="saved-destination-item">
                  <button 
                    type="button" 
                    className="dest-name-clickable"
                    onClick={() => handleExploreDestination(dest)}
                    title={`Explore ${dest}`}
                  >
                    <Compass size={15} className="dest-item-icon" />
                    <span>{dest}</span>
                  </button>
                  <div className="dest-actions-group">
                    <button 
                      type="button" 
                      onClick={() => handleExploreDestination(dest)}
                      className="dest-explore-btn"
                      title="View Destination"
                    >
                      <ExternalLink size={14} />
                    </button>
                    <button 
                      type="button" 
                      onClick={() => handleRemoveDestination(dest)}
                      className="dest-remove-btn"
                      title="Remove bookmark"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <Button 
              variant="outline" 
              className="w-full mt-4 explore-all-cities-btn"
              onClick={() => navigate('/search/city')}
            >
              Explore Destination Catalog
            </Button>
          </Card>
        </div>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="admin-modal-overlay animate-fade-in">
          <div className="admin-modal-card glass">
            <div className="modal-header-danger">
              <AlertCircle size={28} className="text-danger" />
              <h3>Delete Your Account?</h3>
            </div>
            <p className="modal-body-text">
              This action cannot be undone. All your created itineraries, saved trip activities, and personal settings will be permanently wiped.
            </p>
            <div className="modal-actions">
              <Button variant="ghost" onClick={() => setShowDeleteModal(false)} disabled={deleting}>
                Cancel
              </Button>
              <Button variant="primary" className="btn-danger-solid" onClick={handleDeleteAccountConfirm} disabled={deleting}>
                {deleting ? 'Deleting Account...' : 'Yes, Delete My Account'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
