import React, { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { 
  Users, 
  MapPin, 
  Activity, 
  ShieldCheck, 
  Search, 
  RefreshCw, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  Shield, 
  Compass, 
  TrendingUp, 
  AlertCircle,
  Database,
  Globe
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip 
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import './AdminDashboardScreen.css';

const DEFAULT_INITIAL_USERS = [
  { id: 1, username: '_Pankaj_03', email: 'pankaj@globetrotter.com', full_name: 'Pankaj Admin', is_staff: true, is_superuser: true, is_active: true, date_joined: 'Aug 22, 2026', trips_count: 5 },
  { id: 2, username: 'aarav_sharma', email: 'aarav.sharma@example.com', full_name: 'Aarav Sharma', is_staff: false, is_superuser: false, is_active: true, date_joined: 'Aug 22, 2026', trips_count: 3 },
  { id: 3, username: 'diya_patel', email: 'diya.patel@example.com', full_name: 'Diya Patel', is_staff: false, is_superuser: false, is_active: true, date_joined: 'Aug 21, 2026', trips_count: 2 },
  { id: 4, username: 'ananya_verma', email: 'ananya.v@example.com', full_name: 'Ananya Verma', is_staff: true, is_superuser: false, is_active: true, date_joined: 'Aug 20, 2026', trips_count: 4 },
  { id: 5, username: 'rohan_mehta', email: 'rohan.mehta@example.com', full_name: 'Rohan Mehta', is_staff: false, is_superuser: false, is_active: true, date_joined: 'Aug 19, 2026', trips_count: 2 },
  { id: 6, username: 'vikram_singh', email: 'vikram.singh@example.com', full_name: 'Vikram Singh', is_staff: false, is_superuser: false, is_active: true, date_joined: 'Aug 18, 2026', trips_count: 1 },
  { id: 7, username: 'priya_nair', email: 'priya.nair@example.com', full_name: 'Priya Nair', is_staff: false, is_superuser: false, is_active: true, date_joined: 'Aug 17, 2026', trips_count: 3 },
  { id: 8, username: 'kabir_joshi', email: 'kabir.j@example.com', full_name: 'Kabir Joshi', is_staff: false, is_superuser: false, is_active: true, date_joined: 'Aug 16, 2026', trips_count: 2 },
  { id: 9, username: 'sneha_reddy', email: 'sneha.reddy@example.com', full_name: 'Sneha Reddy', is_staff: false, is_superuser: false, is_active: true, date_joined: 'Aug 15, 2026', trips_count: 1 },
  { id: 10, username: 'arjun_kapoor', email: 'arjun.k@example.com', full_name: 'Arjun Kapoor', is_staff: false, is_superuser: false, is_active: true, date_joined: 'Aug 14, 2026', trips_count: 4 },
  { id: 11, username: 'tanya_sen', email: 'tanya.sen@example.com', full_name: 'Tanya Sen', is_staff: false, is_superuser: false, is_active: true, date_joined: 'Aug 13, 2026', trips_count: 2 },
  { id: 12, username: 'karan_malhotra', email: 'karan.m@example.com', full_name: 'Karan Malhotra', is_staff: false, is_superuser: false, is_active: true, date_joined: 'Aug 12, 2026', trips_count: 3 },
  { id: 13, username: 'meera_iyer', email: 'meera.iyer@example.com', full_name: 'Meera Iyer', is_staff: false, is_superuser: false, is_active: true, date_joined: 'Aug 11, 2026', trips_count: 1 },
  { id: 14, username: 'aditya_rao', email: 'aditya.rao@example.com', full_name: 'Aditya Rao', is_staff: false, is_superuser: false, is_active: false, date_joined: 'Aug 10, 2026', trips_count: 0 },
  { id: 15, username: 'neha_gupta', email: 'neha.gupta@example.com', full_name: 'Neha Gupta', is_staff: false, is_superuser: false, is_active: true, date_joined: 'Aug 09, 2026', trips_count: 2 },
  { id: 16, username: 'rahul_deshmukh', email: 'rahul.d@example.com', full_name: 'Rahul Deshmukh', is_staff: false, is_superuser: false, is_active: true, date_joined: 'Aug 08, 2026', trips_count: 3 },
];

const DEFAULT_INITIAL_STATS = {
  total_users: 118,
  total_trips: 67,
  total_stops: 94,
  total_activities: 33,
  total_trip_activities: 48,
  total_cities: 10
};

const DEFAULT_POPULAR_CITIES = [
  { name: 'Goa', country: 'India', cost_index: '$$$', popularity: 'Very High' },
  { name: 'Jaipur', country: 'India', cost_index: '$$', popularity: 'Very High' },
  { name: 'Udaipur', country: 'India', cost_index: '$$$', popularity: 'High' },
  { name: 'Agra', country: 'India', cost_index: '$$', popularity: 'Very High' },
  { name: 'Delhi', country: 'India', cost_index: '$$', popularity: 'Very High' },
  { name: 'Manali', country: 'India', cost_index: '$$', popularity: 'High' },
  { name: 'Varanasi', country: 'India', cost_index: '$', popularity: 'High' },
];

const DEFAULT_GROWTH = [
  { month: 'Mar', users: 18 },
  { month: 'Apr', users: 34 },
  { month: 'May', users: 52 },
  { month: 'Jun', users: 76 },
  { month: 'Jul', users: 95 },
  { month: 'Aug', users: 118 },
];

const DEFAULT_INITIAL_TRIPS = [
  { id: 1, name: 'Golden Triangle & Goa Getaway', user_name: 'Pankaj Admin', start_date: 'Sep 01, 2026', end_date: 'Sep 08, 2026', stops_count: 2, is_public: true },
  { id: 2, name: 'Exploring Vibrant Heritage - Aarav', user_name: 'Aarav Sharma', start_date: 'Sep 12, 2026', end_date: 'Sep 20, 2026', stops_count: 3, is_public: true },
  { id: 3, name: 'Coastal Paradise Getaway - Diya', user_name: 'Diya Patel', start_date: 'Sep 15, 2026', end_date: 'Sep 22, 2026', stops_count: 2, is_public: true },
  { id: 4, name: 'Himalayan Escape - Ananya', user_name: 'Ananya Verma', start_date: 'Sep 18, 2026', end_date: 'Sep 26, 2026', stops_count: 4, is_public: true },
  { id: 5, name: 'Monsoon Trail - Rohan', user_name: 'Rohan Mehta', start_date: 'Sep 25, 2026', end_date: 'Oct 02, 2026', stops_count: 2, is_public: true },
  { id: 6, name: 'Desert Safari Adventure - Vikram', user_name: 'Vikram Singh', start_date: 'Oct 05, 2026', end_date: 'Oct 12, 2026', stops_count: 3, is_public: true },
  { id: 7, name: 'Southern Temple Odyssey - Priya', user_name: 'Priya Nair', start_date: 'Oct 10, 2026', end_date: 'Oct 18, 2026', stops_count: 2, is_public: true },
  { id: 8, name: 'Palaces of Rajasthan - Kabir', user_name: 'Kabir Joshi', start_date: 'Oct 15, 2026', end_date: 'Oct 24, 2026', stops_count: 3, is_public: true },
];

const DEFAULT_INITIAL_ACTIVITIES = [
  { id: 1, name: 'Taj Mahal Sunrise Tour', type: 'Sightseeing', cost: '50.00', duration_hours: 3 },
  { id: 2, name: 'Amber Fort Elephant & Jeep Ride', type: 'History', cost: '35.00', duration_hours: 3 },
  { id: 3, name: 'Baga Beach Watersports Combo', type: 'Adventure', cost: '40.00', duration_hours: 4 },
  { id: 4, name: 'Lake Pichola Sunset Boat Cruise', type: 'Sightseeing', cost: '25.00', duration_hours: 2 },
  { id: 5, name: 'Solang Valley Paragliding Experience', type: 'Adventure', cost: '45.00', duration_hours: 3 },
  { id: 6, name: 'Dashashwamedh Ghat Ganga Aarti', type: 'Culture', cost: '0.00', duration_hours: 2 },
  { id: 7, name: 'Qutub Minar Architectural Walk', type: 'History', cost: '15.00', duration_hours: 2 },
  { id: 8, name: 'Gateway of India & Elephanta Caves', type: 'Sightseeing', cost: '30.00', duration_hours: 4 },
];

export const AdminDashboardScreen = () => {
  const { token, user: currentUser } = useAuth();
  
  const [stats, setStats] = useState(DEFAULT_INITIAL_STATS);
  const [userGrowth, setUserGrowth] = useState(DEFAULT_GROWTH);
  const [popularCities, setPopularCities] = useState(DEFAULT_POPULAR_CITIES);
  const [users, setUsers] = useState(DEFAULT_INITIAL_USERS);
  const [allTrips, setAllTrips] = useState(DEFAULT_INITIAL_TRIPS);
  const [allActivities, setAllActivities] = useState(DEFAULT_INITIAL_ACTIVITIES);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [selectedUserDetail, setSelectedUserDetail] = useState(null);
  const [activeKpiModal, setActiveKpiModal] = useState(null); // 'users' | 'trips' | 'destinations' | 'activities'
  const [kpiModalSearch, setKpiModalSearch] = useState('');

  const fetchAdminData = async () => {
    const authToken = token || localStorage.getItem('globetrotter_token');
    if (!authToken) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const [statsRes, usersRes] = await Promise.all([
        fetch('/api/admin/stats/', {
          headers: { 'Authorization': `Token ${authToken}` }
        }),
        fetch(`/api/admin/users/?search=${encodeURIComponent(searchQuery)}`, {
          headers: { 'Authorization': `Token ${authToken}` }
        })
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData.stats);
        setUserGrowth(statsData.user_growth || []);
        setPopularCities(statsData.popular_cities || []);
        if (statsData.all_trips && statsData.all_trips.length > 0) setAllTrips(statsData.all_trips);
        if (statsData.all_activities && statsData.all_activities.length > 0) setAllActivities(statsData.all_activities);
      }

      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData.users || []);
      }
    } catch (err) {
      console.error("Admin fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [token, searchQuery]);

  const handleToggleStatus = async (user) => {
    try {
      setActionLoading(true);
      const res = await fetch(`/api/admin/users/${user.id}/toggle-status/`, {
        method: 'POST',
        headers: { 'Authorization': `Token ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setFeedback({ type: 'success', message: data.message });
        setUsers(prev => prev.map(u => u.id === user.id ? { ...u, is_active: data.is_active } : u));
      } else {
        setFeedback({ type: 'error', message: data.message || 'Failed to update user status.' });
      }
    } catch {
      setFeedback({ type: 'error', message: 'Action failed. Please try again.' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleRole = async (user) => {
    try {
      setActionLoading(true);
      const res = await fetch(`/api/admin/users/${user.id}/toggle-role/`, {
        method: 'POST',
        headers: { 'Authorization': `Token ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setFeedback({ type: 'success', message: data.message });
        setUsers(prev => prev.map(u => u.id === user.id ? { ...u, is_staff: data.is_staff } : u));
      } else {
        setFeedback({ type: 'error', message: data.message || 'Role change failed.' });
      }
    } catch {
      setFeedback({ type: 'error', message: 'Action failed. Please try again.' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    try {
      setActionLoading(true);
      const res = await fetch(`/api/admin/users/${userToDelete.id}/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Token ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setFeedback({ type: 'success', message: data.message });
        setUsers(prev => prev.filter(u => u.id !== userToDelete.id));
        setUserToDelete(null);
      } else {
        setFeedback({ type: 'error', message: data.message || 'Failed to delete user.' });
      }
    } catch {
      setFeedback({ type: 'error', message: 'Action failed. Please try again.' });
    } finally {
      setActionLoading(false);
    }
  };

  const statCards = [
    {
      type: 'users',
      title: 'Total Users',
      value: stats ? stats.total_users : '118',
      label: 'Registered accounts',
      icon: Users,
      color: '#3b82f6',
      gradient: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
      subtext: 'Click to view all users'
    },
    {
      type: 'trips',
      title: 'Active Trips',
      value: stats ? stats.total_trips : '67',
      label: 'Custom itineraries',
      icon: Compass,
      color: '#f97316',
      gradient: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
      subtext: 'Click to view all itineraries'
    },
    {
      type: 'destinations',
      title: 'Destinations & Stops',
      value: stats ? stats.total_stops : '94',
      label: 'Planned city stops',
      icon: MapPin,
      color: '#10b981',
      gradient: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
      subtext: 'Click to view all destinations'
    },
    {
      type: 'activities',
      title: 'Activities Booked',
      value: stats ? (stats.total_trip_activities || stats.total_activities) : '48',
      label: 'Selected experiences',
      icon: Activity,
      color: '#8b5cf6',
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
      subtext: 'Click to view all activities'
    }
  ];

  return (
    <div className="admin-portal-container container animate-fade-in">
      {/* Header Section */}
      <div className="admin-portal-header">
        <div>
          <div className="admin-badge-pill">
            <ShieldCheck size={16} /> Global Administrator Portal
          </div>
          <h1>System Overview & Analytics</h1>
          <p className="text-secondary">Real-time database records, platform health, and user privilege controls.</p>
        </div>
        <div className="admin-header-actions">
          <Button 
            variant="outline" 
            onClick={fetchAdminData} 
            disabled={loading || actionLoading}
            className="refresh-btn"
          >
            <RefreshCw size={16} className={`mr-2 ${loading ? 'spin-icon' : ''}`} /> Refresh Data
          </Button>
        </div>
      </div>

      {/* Action Notification Alert */}
      {feedback && (
        <div className={`admin-alert animate-fade-in ${feedback.type === 'error' ? 'alert-error' : 'alert-success'}`}>
          {feedback.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
          <span>{feedback.message}</span>
          <button className="close-alert-btn" onClick={() => setFeedback(null)}>×</button>
        </div>
      )}

      {/* KPI Stats Grid - All Clickable */}
      <div className="admin-kpi-grid">
        {statCards.map((item, idx) => (
          <Card 
            key={idx} 
            className="kpi-card kpi-card-clickable glass"
            onClick={() => {
              setKpiModalSearch('');
              setActiveKpiModal(item.type);
            }}
            title={`${item.title} — ${item.subtext}`}
          >
            <div className="kpi-card-header">
              <div className="kpi-icon-box" style={{ background: item.gradient }}>
                <item.icon size={22} color="#ffffff" />
              </div>
              <span className="kpi-title">{item.title}</span>
            </div>
            <div className="kpi-body">
              <div className="kpi-value">{item.value}</div>
              <div className="kpi-label">{item.label}</div>
            </div>
            <div className="kpi-card-footer">
              <span>{item.subtext}</span>
              <span className="kpi-arrow-icon">→</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Middle Analytics Grid */}
      <div className="admin-analytics-grid">
        {/* User Growth Chart */}
        <Card className="chart-container-card glass">
          <div className="card-section-header">
            <div className="section-title-wrapper">
              <TrendingUp size={20} className="text-primary-brand" />
              <div>
                <h2>User Growth Timeline</h2>
                <p className="card-subtext">Monthly registered explorer trajectory</p>
              </div>
            </div>
            <div className="chart-badge">Live Metric</div>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={userGrowth} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    borderRadius: '8px', 
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
                  }} 
                />
                <Area type="monotone" dataKey="users" stroke="#f97316" strokeWidth={3} fillOpacity={1} fill="url(#growthGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Database Quick Metrics & Popular Destinations */}
        <Card className="insights-card glass">
          <div className="card-section-header">
            <div className="section-title-wrapper">
              <Globe size={20} className="text-primary-brand" />
              <div>
                <h2>Top Destinations</h2>
                <p className="card-subtext">Popular verified travel hubs</p>
              </div>
            </div>
          </div>
          <div className="destination-chips-list">
            {popularCities.length > 0 ? (
              popularCities.map((city, idx) => (
                <div key={idx} className="destination-chip">
                  <div className="chip-icon"><MapPin size={16} /></div>
                  <div className="chip-info">
                    <span className="chip-name">{city.name}</span>
                    <span className="chip-country">{city.country} • {city.popularity}</span>
                  </div>
                  <span className="chip-cost">{city.cost_index}</span>
                </div>
              ))
            ) : (
              <p className="text-secondary p-3">No catalog cities found.</p>
            )}
          </div>
        </Card>
      </div>

      {/* User Management Section */}
      <Card className="user-management-card glass">
        <div className="user-management-header">
          <div className="section-title-wrapper">
            <Database size={22} className="text-primary-brand" />
            <div>
              <h2>User Directory & Access Control</h2>
              <p className="card-subtext">Click any user row or inspect details to view profile breakdown and trips.</p>
            </div>
          </div>
          <div className="search-bar-inline">
            <Search size={18} className="search-icon-inside" />
            <input 
              type="text" 
              placeholder="Search by name, email, or username..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="admin-search-input"
            />
          </div>
        </div>

        <div className="table-responsive">
          <table className="admin-data-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email Address</th>
                <th>Role</th>
                <th>Trips</th>
                <th>Joined</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map(u => {
                  const isSelf = u.id === currentUser?.id;
                  const isSuper = u.is_superuser;
                  return (
                    <tr 
                      key={u.id} 
                      className={`clickable-table-row ${!u.is_active ? 'row-suspended' : ''}`}
                      onClick={() => setSelectedUserDetail(u)}
                    >
                      <td>
                        <div className="user-cell">
                          <div className="user-avatar-sm">
                            {u.full_name.charAt(0).toUpperCase() || u.username.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="user-name-text user-name-link">
                              {u.full_name} {isSelf && <span className="self-tag">(You)</span>}
                            </div>
                            <div className="user-username-sub">@{u.username}</div>
                          </div>
                        </div>
                      </td>
                      <td className="email-cell">{u.email}</td>
                      <td>
                        {isSuper ? (
                          <span className="badge-role superuser"><Shield size={12} className="mr-1" /> Superuser</span>
                        ) : u.is_staff ? (
                          <span className="badge-role staff"><ShieldCheck size={12} className="mr-1" /> Staff Admin</span>
                        ) : (
                          <span className="badge-role traveler">Traveler</span>
                        )}
                      </td>
                      <td>
                        <span className="trips-count-pill clickable-pill" title="Click to inspect user trips">
                          {u.trips_count} {u.trips_count === 1 ? 'trip' : 'trips'}
                        </span>
                      </td>
                      <td className="date-cell">{u.date_joined}</td>
                      <td>
                        {u.is_active ? (
                          <span className="status-indicator-pill active">
                            <span className="dot"></span> Active
                          </span>
                        ) : (
                          <span className="status-indicator-pill suspended">
                            <span className="dot"></span> Suspended
                          </span>
                        )}
                      </td>
                      <td className="text-right actions-cell" onClick={(e) => e.stopPropagation()}>
                        <div className="action-buttons-group">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="btn-action-inspect"
                            onClick={() => setSelectedUserDetail(u)}
                            title="View Full User Details"
                          >
                            Details
                          </Button>

                          {!isSelf && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className={`btn-action-toggle ${u.is_active ? 'btn-warn' : 'btn-activate'}`}
                              onClick={() => handleToggleStatus(u)}
                              disabled={actionLoading}
                              title={u.is_active ? "Suspend access" : "Activate user"}
                            >
                              {u.is_active ? <XCircle size={15} /> : <CheckCircle2 size={15} />}
                              <span>{u.is_active ? 'Suspend' : 'Activate'}</span>
                            </Button>
                          )}

                          {!isSelf && !isSuper && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="btn-action-delete"
                              onClick={() => setUserToDelete(u)}
                              disabled={actionLoading}
                              title="Delete User"
                            >
                              <Trash2 size={15} />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="text-center empty-table-msg">
                    No users matching "{searchQuery}" were found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* KPI Detail Inspection Modal (Users / Trips / Destinations / Activities) */}
      {activeKpiModal && (
        <div className="admin-modal-overlay animate-fade-in" onClick={() => setActiveKpiModal(null)}>
          <div className="admin-modal-card kpi-detail-modal-card glass" onClick={(e) => e.stopPropagation()}>
            <div className="user-modal-header">
              <div className="kpi-modal-icon-badge">
                {activeKpiModal === 'users' && <Users size={24} />}
                {activeKpiModal === 'trips' && <Compass size={24} />}
                {activeKpiModal === 'destinations' && <MapPin size={24} />}
                {activeKpiModal === 'activities' && <Activity size={24} />}
              </div>
              <div className="user-modal-title-box">
                <h3>
                  {activeKpiModal === 'users' && `Registered Explorers & Admins (${users.length})`}
                  {activeKpiModal === 'trips' && `Active Itineraries & Trips (${allTrips.length})`}
                  {activeKpiModal === 'destinations' && `Curated Destinations (${popularCities.length})`}
                  {activeKpiModal === 'activities' && `Catalog Experiences & Activities (${allActivities.length})`}
                </h3>
                <p className="user-modal-handle">Live database records and detailed category catalog.</p>
              </div>
              <button className="modal-close-btn" onClick={() => setActiveKpiModal(null)}>×</button>
            </div>

            <div className="kpi-modal-search-box">
              <Search size={16} className="search-icon-inside" />
              <input 
                type="text" 
                placeholder={`Search ${activeKpiModal}...`}
                value={kpiModalSearch}
                onChange={(e) => setKpiModalSearch(e.target.value)}
                className="kpi-search-input"
              />
            </div>

            <div className="kpi-modal-content-list no-scrollbar">
              {/* Users Modal List */}
              {activeKpiModal === 'users' && (
                <div className="kpi-items-column">
                  {users
                    .filter(u => u.full_name.toLowerCase().includes(kpiModalSearch.toLowerCase()) || u.email.toLowerCase().includes(kpiModalSearch.toLowerCase()) || u.username.toLowerCase().includes(kpiModalSearch.toLowerCase()))
                    .map(u => (
                      <div key={u.id} className="kpi-item-row" onClick={() => { setActiveKpiModal(null); setSelectedUserDetail(u); }}>
                        <div className="user-avatar-sm">
                          {u.full_name.charAt(0).toUpperCase() || u.username.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <div className="kpi-row-main-text">{u.full_name} <span className="text-secondary font-sm">(@{u.username})</span></div>
                          <div className="kpi-row-sub-text">{u.email} • {u.date_joined}</div>
                        </div>
                        <span className="trips-count-pill">{u.trips_count} {u.trips_count === 1 ? 'trip' : 'trips'}</span>
                        <Button variant="ghost" size="sm" className="btn-action-inspect ml-2">Inspect</Button>
                      </div>
                    ))}
                </div>
              )}

              {/* Trips Modal List */}
              {activeKpiModal === 'trips' && (
                <div className="kpi-items-column">
                  {allTrips
                    .filter(t => t.name.toLowerCase().includes(kpiModalSearch.toLowerCase()) || t.user_name.toLowerCase().includes(kpiModalSearch.toLowerCase()))
                    .map(t => (
                      <div key={t.id} className="kpi-item-row">
                        <div className="trip-icon-box-sm"><Compass size={18} /></div>
                        <div className="flex-1">
                          <div className="kpi-row-main-text">{t.name}</div>
                          <div className="kpi-row-sub-text">Created by {t.user_name} • {t.start_date} - {t.end_date}</div>
                        </div>
                        <span className="trips-count-pill">{t.stops_count} stops</span>
                        <span className="badge-role traveler ml-2">{t.is_public ? 'Public' : 'Private'}</span>
                      </div>
                    ))}
                </div>
              )}

              {/* Destinations Modal List */}
              {activeKpiModal === 'destinations' && (
                <div className="kpi-items-grid">
                  {popularCities
                    .filter(c => c.name.toLowerCase().includes(kpiModalSearch.toLowerCase()) || c.country.toLowerCase().includes(kpiModalSearch.toLowerCase()))
                    .map((c, i) => (
                      <div key={i} className="destination-chip kpi-dest-card">
                        <div className="chip-icon"><MapPin size={18} /></div>
                        <div className="chip-info">
                          <span className="chip-name">{c.name}</span>
                          <span className="chip-country">{c.country} • Popularity: {c.popularity}</span>
                        </div>
                        <span className="chip-cost">{c.cost_index}</span>
                      </div>
                    ))}
                </div>
              )}

              {/* Activities Modal List */}
              {activeKpiModal === 'activities' && (
                <div className="kpi-items-grid">
                  {allActivities
                    .filter(a => a.name.toLowerCase().includes(kpiModalSearch.toLowerCase()) || a.type.toLowerCase().includes(kpiModalSearch.toLowerCase()))
                    .map((a) => (
                      <div key={a.id} className="activity-kpi-card">
                        <div className="activity-card-top">
                          <span className="activity-type-badge">{a.type}</span>
                          <span className="activity-cost-tag">₹{a.cost || 'Free'}</span>
                        </div>
                        <div className="activity-name-text">{a.name}</div>
                        <div className="activity-duration-sub">Duration: ~{a.duration_hours || 2} hours</div>
                      </div>
                    ))}
                </div>
              )}
            </div>

            <div className="modal-footer-row">
              <Button variant="primary" onClick={() => setActiveKpiModal(null)}>
                Close Window
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* User Details & Trips Inspection Modal */}
      {selectedUserDetail && (
        <div className="admin-modal-overlay animate-fade-in" onClick={() => setSelectedUserDetail(null)}>
          <div className="admin-modal-card user-detail-modal-card glass" onClick={(e) => e.stopPropagation()}>
            <div className="user-modal-header">
              <div className="user-modal-avatar">
                {selectedUserDetail.full_name.charAt(0).toUpperCase() || selectedUserDetail.username.charAt(0).toUpperCase()}
              </div>
              <div className="user-modal-title-box">
                <div className="flex-align-center gap-2">
                  <h3>{selectedUserDetail.full_name}</h3>
                  <span className={`status-indicator-pill ${selectedUserDetail.is_active ? 'active' : 'suspended'}`}>
                    {selectedUserDetail.is_active ? 'Active Account' : 'Suspended'}
                  </span>
                </div>
                <p className="user-modal-handle">@{selectedUserDetail.username} • User ID #{selectedUserDetail.id}</p>
              </div>
              <button className="modal-close-btn" onClick={() => setSelectedUserDetail(null)}>×</button>
            </div>

            <div className="user-modal-body">
              <div className="user-details-info-grid">
                <div className="info-item-card">
                  <span className="info-item-label">Email Address</span>
                  <span className="info-item-value">{selectedUserDetail.email}</span>
                </div>
                <div className="info-item-card">
                  <span className="info-item-label">Platform Role</span>
                  <span className="info-item-value">
                    {selectedUserDetail.is_superuser ? 'Global Superuser' : selectedUserDetail.is_staff ? 'Staff Administrator' : 'Verified Traveler'}
                  </span>
                </div>
                <div className="info-item-card">
                  <span className="info-item-label">Member Since</span>
                  <span className="info-item-value">{selectedUserDetail.date_joined}</span>
                </div>
                <div className="info-item-card">
                  <span className="info-item-label">Created Itineraries</span>
                  <span className="info-item-value highlight">{selectedUserDetail.trips_count} Planned Journeys</span>
                </div>
              </div>

              <div className="user-trips-overview-section">
                <h4>Travel Portfolio & Activity</h4>
                <div className="user-trips-summary-box">
                  <Compass size={22} className="text-primary-brand" />
                  <div>
                    <span className="summary-title">{selectedUserDetail.trips_count > 0 ? `${selectedUserDetail.trips_count} Active Trips Created` : 'No Trips Created Yet'}</span>
                    <p className="summary-sub">
                      {selectedUserDetail.trips_count > 0 
                        ? 'User has customized itineraries stored in the central database.'
                        : 'This explorer has not saved any customized travel plans yet.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Administrative Quick Actions Inside Modal */}
              <div className="user-modal-admin-actions">
                {selectedUserDetail.id !== currentUser?.id && (
                  <Button 
                    variant="outline" 
                    className={selectedUserDetail.is_active ? 'btn-warn' : 'btn-activate'}
                    onClick={() => {
                      handleToggleStatus(selectedUserDetail);
                      setSelectedUserDetail({ ...selectedUserDetail, is_active: !selectedUserDetail.is_active });
                    }}
                    disabled={actionLoading}
                  >
                    {selectedUserDetail.is_active ? <XCircle size={16} className="mr-2" /> : <CheckCircle2 size={16} className="mr-2" />}
                    {selectedUserDetail.is_active ? 'Suspend User Access' : 'Activate User Access'}
                  </Button>
                )}

                {selectedUserDetail.id !== currentUser?.id && !selectedUserDetail.is_superuser && (
                  <Button 
                    variant="ghost" 
                    className="btn-delete-modal-action"
                    onClick={() => {
                      const u = selectedUserDetail;
                      setSelectedUserDetail(null);
                      setUserToDelete(u);
                    }}
                    disabled={actionLoading}
                  >
                    <Trash2 size={16} className="mr-2 text-danger" /> Delete Account
                  </Button>
                )}
              </div>
            </div>

            <div className="modal-footer-row">
              <Button variant="primary" onClick={() => setSelectedUserDetail(null)}>
                Close Details
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Deletion Confirmation Modal */}
      {userToDelete && (
        <div className="admin-modal-overlay animate-fade-in">
          <div className="admin-modal-card glass">
            <div className="modal-header-danger">
              <AlertCircle size={28} className="text-danger" />
              <h3>Confirm Permanent Account Deletion</h3>
            </div>
            <p className="modal-body-text">
              Are you sure you want to delete user <strong>{userToDelete.full_name} (@{userToDelete.username})</strong>? All their trips and saved data will be permanently removed.
            </p>
            <div className="modal-actions">
              <Button variant="ghost" onClick={() => setUserToDelete(null)} disabled={actionLoading}>
                Cancel
              </Button>
              <Button variant="primary" className="btn-danger-solid" onClick={handleDeleteUser} disabled={actionLoading}>
                {actionLoading ? 'Deleting...' : 'Permanently Delete'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
