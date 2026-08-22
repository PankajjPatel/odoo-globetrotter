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

export const AdminDashboardScreen = () => {
  const { token, user: currentUser } = useAuth();
  
  const [stats, setStats] = useState(DEFAULT_INITIAL_STATS);
  const [userGrowth, setUserGrowth] = useState(DEFAULT_GROWTH);
  const [popularCities, setPopularCities] = useState(DEFAULT_POPULAR_CITIES);
  const [users, setUsers] = useState(DEFAULT_INITIAL_USERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);

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
        setFeedback({ type: 'error', message: data.message || 'Status toggle failed.' });
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
      title: 'Total Users',
      value: stats ? stats.total_users : '...',
      label: 'Registered accounts',
      icon: Users,
      color: '#3b82f6',
      gradient: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
    },
    {
      title: 'Active Trips',
      value: stats ? stats.total_trips : '...',
      label: 'Custom itineraries',
      icon: Compass,
      color: '#ff5722',
      gradient: 'linear-gradient(135deg, #ff5722 0%, #d84315 100%)'
    },
    {
      title: 'Destinations & Stops',
      value: stats ? stats.total_stops : '...',
      label: 'Planned city stops',
      icon: MapPin,
      color: '#10b981',
      gradient: 'linear-gradient(135deg, #10b981 0%, #047857 100%)'
    },
    {
      title: 'Activities Booked',
      value: stats ? (stats.total_trip_activities || stats.total_activities) : '...',
      label: 'Selected experiences',
      icon: Activity,
      color: '#8b5cf6',
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)'
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

      {/* KPI Stats Grid */}
      <div className="admin-kpi-grid">
        {statCards.map((item, idx) => (
          <Card key={idx} className="kpi-card glass">
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
                    <stop offset="5%" stopColor="#ff5722" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#ff5722" stopOpacity={0.0}/>
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
                <Area type="monotone" dataKey="users" stroke="#ff5722" strokeWidth={3} fillOpacity={1} fill="url(#growthGrad)" />
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
              <p className="card-subtext">Manage accounts, toggle roles, and control authorizations.</p>
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
                    <tr key={u.id} className={!u.is_active ? 'row-suspended' : ''}>
                      <td>
                        <div className="user-cell">
                          <div className="user-avatar-sm">
                            {u.full_name.charAt(0).toUpperCase() || u.username.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="user-name-text">
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
                        <span className="trips-count-pill">{u.trips_count} {u.trips_count === 1 ? 'trip' : 'trips'}</span>
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
                      <td className="text-right actions-cell">
                        {!isSelf && (
                          <div className="action-buttons-group">
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

                            {!isSuper && (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="btn-action-role"
                                onClick={() => handleToggleRole(u)}
                                disabled={actionLoading}
                                title={u.is_staff ? "Demote from Admin" : "Promote to Admin"}
                              >
                                <Shield size={15} />
                                <span>{u.is_staff ? 'Demote' : 'Make Admin'}</span>
                              </Button>
                            )}

                            {!isSuper && (
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
                        )}
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
