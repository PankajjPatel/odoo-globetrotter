import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Globe,
  Download,
  FileSpreadsheet,
  ExternalLink,
  Lock,
  Unlock,
  Eye,
  Mail,
  Calendar,
  UserCheck
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
  { id: 1, name: 'Goa', country: 'India', cost_index: '5,000 Rupees / day (Luxury)', popularity: 'Very High' },
  { id: 2, name: 'Jaipur', country: 'India', cost_index: '2,500 Rupees / day (Moderate)', popularity: 'Very High' },
  { id: 3, name: 'Udaipur', country: 'India', cost_index: '4,000 Rupees / day (Luxury)', popularity: 'High' },
  { id: 4, name: 'Agra', country: 'India', cost_index: '2,000 Rupees / day (Moderate)', popularity: 'Very High' },
  { id: 5, name: 'Delhi', country: 'India', cost_index: '2,200 Rupees / day (Moderate)', popularity: 'Very High' },
  { id: 6, name: 'Manali', country: 'India', cost_index: '2,800 Rupees / day (Moderate)', popularity: 'High' },
  { id: 7, name: 'Varanasi', country: 'India', cost_index: '1,200 Rupees / day (Budget)', popularity: 'High' },
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
  { id: 1, name: 'Taj Mahal Sunrise Tour', type: 'Sightseeing', cost: '1,100 Rupees', duration_hours: 3 },
  { id: 2, name: 'Amber Fort Elephant & Jeep Ride', type: 'History', cost: '500 Rupees', duration_hours: 3 },
  { id: 3, name: 'Baga Beach Watersports Combo', type: 'Adventure', cost: '2,500 Rupees', duration_hours: 4 },
  { id: 4, name: 'Lake Pichola Sunset Boat Cruise', type: 'Sightseeing', cost: '850 Rupees', duration_hours: 2 },
  { id: 5, name: 'Solang Valley Paragliding Experience', type: 'Adventure', cost: '3,200 Rupees', duration_hours: 3 },
  { id: 6, name: 'Dashashwamedh Ghat Ganga Aarti', type: 'Culture', cost: 'Free', duration_hours: 2 },
  { id: 7, name: 'Qutub Minar Architectural Walk', type: 'History', cost: '350 Rupees', duration_hours: 2 },
  { id: 8, name: 'Gateway of India & Elephanta Caves', type: 'Sightseeing', cost: '750 Rupees', duration_hours: 4 },
];

export const AdminDashboardScreen = () => {
  const navigate = useNavigate();
  const { token, user: currentUser } = useAuth();
  
  const [stats, setStats] = useState(DEFAULT_INITIAL_STATS);
  const [userGrowth, setUserGrowth] = useState(DEFAULT_GROWTH);
  const [popularCities, setPopularCities] = useState(DEFAULT_POPULAR_CITIES);
  const [users, setUsers] = useState(DEFAULT_INITIAL_USERS);
  const [allTrips, setAllTrips] = useState(DEFAULT_INITIAL_TRIPS);
  const [allActivities, setAllActivities] = useState(DEFAULT_INITIAL_ACTIVITIES);
  
  const [inlineKpiView, setInlineKpiView] = useState('users'); // 'users' | 'trips' | 'destinations' | 'activities'
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
    const interval = setInterval(() => {
      fetchAdminData();
    }, 3000);
    return () => clearInterval(interval);
  }, [token, searchQuery]);

  // CSV Export Helper
  const downloadCSV = (filename, headers, rows) => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setFeedback({ type: 'success', message: `${filename} downloaded successfully!` });
  };

  const exportUsersCSV = () => {
    const headers = ["User ID", "Username", "Full Name", "Email Address", "Role", "Active Status", "Trips Count", "Date Joined"];
    const rows = users.map(u => [
      u.id,
      `"${u.username}"`,
      `"${u.full_name}"`,
      `"${u.email}"`,
      u.is_superuser ? "Superuser" : u.is_staff ? "Staff Admin" : "Traveler",
      u.is_active ? "Active" : "Suspended",
      u.trips_count,
      `"${u.date_joined}"`
    ]);
    downloadCSV("globetrotter_users.csv", headers, rows);
  };

  const exportTripsCSV = () => {
    const headers = ["Trip ID", "Trip Name", "Creator", "Start Date", "End Date", "Total Stops", "Visibility"];
    const rows = allTrips.map(t => [
      t.id,
      `"${t.name}"`,
      `"${t.user_name}"`,
      `"${t.start_date}"`,
      `"${t.end_date}"`,
      t.stops_count,
      t.is_public ? "Public" : "Private"
    ]);
    downloadCSV("globetrotter_trips.csv", headers, rows);
  };

  const exportDestinationsCSV = () => {
    const headers = ["City Name", "Country", "Cost Index", "Popularity"];
    const rows = popularCities.map(c => [
      `"${c.name}"`,
      `"${c.country}"`,
      `"${c.cost_index}"`,
      `"${c.popularity}"`
    ]);
    downloadCSV("globetrotter_destinations.csv", headers, rows);
  };

  const exportActivitiesCSV = () => {
    const headers = ["Activity ID", "Activity Name", "Category Type", "Cost (INR)", "Duration (Hours)"];
    const rows = allActivities.map(a => [
      a.id,
      `"${a.name}"`,
      `"${a.type}"`,
      `"${a.cost}"`,
      a.duration_hours || 2
    ]);
    downloadCSV("globetrotter_activities.csv", headers, rows);
  };

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

  const formatCityCost = (cost) => {
    if (!cost) return '2,500 Rupees / day';
    if (cost.includes('Rupees') || cost.includes('rupees')) return cost;
    if (cost === '₹₹₹' || cost === '$$$') return '5,000 Rupees / day (Luxury)';
    if (cost === '₹₹' || cost === '$$') return '2,500 Rupees / day (Moderate)';
    if (cost === '₹' || cost === '$') return '1,200 Rupees / day (Budget)';
    return `${cost} Rupees / day`;
  };

  const handleKpiCardClick = (type) => {
    setInlineKpiView(type);
    const element = document.getElementById('admin-directory-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="admin-portal-container container animate-fade-in">
      {/* Header Section with CSV Export Toolbar */}
      <div className="admin-portal-header">
        <div>
          <div className="admin-badge-pill">
            <ShieldCheck size={16} /> Global Administrator Portal
          </div>
          <h1>System Overview & Analytics</h1>
          <p className="text-secondary">Real-time database records, platform health, user privilege controls, and export tools.</p>
        </div>
        
        <div className="admin-header-actions-group">
          <div className="csv-export-dropdown-group">
            <button type="button" className="csv-export-btn users" onClick={exportUsersCSV} title="Download Users CSV">
              <Download size={14} className="mr-1" /> Users CSV
            </button>
            <button type="button" className="csv-export-btn trips" onClick={exportTripsCSV} title="Download Trips CSV">
              <Download size={14} className="mr-1" /> Trips CSV
            </button>
            <button type="button" className="csv-export-btn destinations" onClick={exportDestinationsCSV} title="Download Destinations CSV">
              <Download size={14} className="mr-1" /> Cities CSV
            </button>
            <button type="button" className="csv-export-btn activities" onClick={exportActivitiesCSV} title="Download Activities CSV">
              <Download size={14} className="mr-1" /> Activities CSV
            </button>
          </div>

          <Button 
            variant="outline" 
            onClick={fetchAdminData} 
            disabled={loading || actionLoading}
            className="refresh-btn"
          >
            <RefreshCw size={15} className={`mr-1 ${loading ? 'spin-icon' : ''}`} /> Sync Live
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

      {/* KPI Stats Grid - All Clickable & Updates In-Place List */}
      <div className="admin-kpi-grid">
        {statCards.map((item, idx) => (
          <div 
            key={idx} 
            role="button"
            tabIndex={0}
            className={`kpi-card kpi-card-clickable glass ${inlineKpiView === item.type ? 'active-kpi-border' : ''}`}
            onClick={() => handleKpiCardClick(item.type)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleKpiCardClick(item.type);
              }
            }}
            title={`Click to view all ${item.title.toLowerCase()} right below`}
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
              <span className="font-semibold text-primary-brand">View {item.title} list below</span>
              <span className="kpi-arrow-icon">↓</span>
            </div>
          </div>
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
                <p className="card-subtext">Click any city to view & plan on next page</p>
              </div>
            </div>
          </div>
          <div className="destination-chips-list">
            {popularCities.length > 0 ? (
              popularCities.map((city, idx) => (
                <div 
                  key={idx} 
                  className="destination-chip clickable-chip"
                  onClick={() => navigate('/search/city', { state: { initialSearch: city.name } })}
                  title={`Click to explore ${city.name} on next page`}
                >
                  <div className="chip-icon"><MapPin size={16} /></div>
                  <div className="chip-info">
                    <span className="chip-name">{city.name}</span>
                    <span className="chip-country">{city.country} • {city.popularity}</span>
                  </div>
                  <span className="chip-cost font-semibold">{formatCityCost(city.cost_index)}</span>
                  <ExternalLink size={13} className="ml-1 text-secondary" />
                </div>
              ))
            ) : (
              <p className="text-secondary p-3">No catalog cities found.</p>
            )}
          </div>
        </Card>
      </div>

      {/* In-Place Dynamic Directory Section for All 4 KPI Cards */}
      <Card id="admin-directory-section" className="user-management-card glass">
        <div className="user-management-header">
          <div className="section-title-wrapper">
            <Database size={22} className="text-primary-brand" />
            <div>
              <h2>
                {inlineKpiView === 'users' && 'Explorer Directory & Access Control'}
                {inlineKpiView === 'trips' && 'Active Travel Itineraries & Trips'}
                {inlineKpiView === 'destinations' && 'Curated Destinations Catalog'}
                {inlineKpiView === 'activities' && 'Booked Activities & Tours Catalog'}
              </h2>
              <p className="card-subtext">
                {inlineKpiView === 'users' && 'Click any user row to open full identity dossier & manage access.'}
                {inlineKpiView === 'trips' && 'Click any trip to view its live day-wise itinerary & schedule.'}
                {inlineKpiView === 'destinations' && 'Click any city to plan customized trips with cost indices in Rupees.'}
                {inlineKpiView === 'activities' && 'Click any activity to view duration, cost in Rupees, and schedule.'}
              </p>
            </div>
          </div>

          {/* Quick Tab Switcher */}
          <div className="admin-category-tabs">
            <button 
              className={`cat-tab-btn ${inlineKpiView === 'users' ? 'active' : ''}`}
              onClick={() => setInlineKpiView('users')}
            >
              <Users size={15} className="mr-1"/> Users ({users.length})
            </button>
            <button 
              className={`cat-tab-btn ${inlineKpiView === 'trips' ? 'active' : ''}`}
              onClick={() => setInlineKpiView('trips')}
            >
              <Compass size={15} className="mr-1"/> Trips ({allTrips.length})
            </button>
            <button 
              className={`cat-tab-btn ${inlineKpiView === 'destinations' ? 'active' : ''}`}
              onClick={() => setInlineKpiView('destinations')}
            >
              <MapPin size={15} className="mr-1"/> Cities ({popularCities.length})
            </button>
            <button 
              className={`cat-tab-btn ${inlineKpiView === 'activities' ? 'active' : ''}`}
              onClick={() => setInlineKpiView('activities')}
            >
              <Activity size={15} className="mr-1"/> Activities ({allActivities.length})
            </button>
          </div>
        </div>

        {/* Search Bar for active list */}
        <div className="search-bar-inline mt-3 mb-3">
          <Search size={18} className="search-icon-inside" />
          <input 
            type="text" 
            placeholder={
              inlineKpiView === 'users' ? "Search users by name, email, or username..." :
              inlineKpiView === 'trips' ? "Search trips by title or creator..." :
              inlineKpiView === 'destinations' ? "Search destinations by city or country..." :
              "Search activities by title or category..."
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="admin-search-input"
          />
        </div>

        {/* 1. USERS LIST VIEW */}
        {inlineKpiView === 'users' && (
          <div className="table-responsive">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>Explorer Identity</th>
                  <th>Email Address</th>
                  <th>Role</th>
                  <th>Trips</th>
                  <th>Joined</th>
                  <th>Status & Access Control</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.filter(u => !searchQuery || u.full_name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase()) || u.username.toLowerCase().includes(searchQuery.toLowerCase())).length > 0 ? (
                  users
                    .filter(u => !searchQuery || u.full_name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase()) || u.username.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map(u => {
                      const isSelf = u.id === currentUser?.id;
                      const isSuper = u.is_superuser;
                      return (
                        <tr 
                          key={u.id} 
                          className={`clickable-table-row ${!u.is_active ? 'row-suspended' : ''}`}
                          onClick={() => setSelectedUserDetail(u)}
                          title={`Click to inspect identity of ${u.full_name}`}
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
                            <span className="trips-count-pill clickable-pill" title="Click to view user trips">
                              {u.trips_count} {u.trips_count === 1 ? 'trip' : 'trips'}
                            </span>
                          </td>
                          <td className="date-cell">{u.date_joined}</td>
                          <td onClick={(e) => e.stopPropagation()}>
                            {!isSelf ? (
                              <button
                                type="button"
                                className={`access-control-pill-btn ${u.is_active ? 'status-active' : 'status-suspended'}`}
                                onClick={() => handleToggleStatus(u)}
                                disabled={actionLoading}
                                title={u.is_active ? "Click to Suspend Account Access" : "Click to Activate Account Access"}
                              >
                                <span className="dot"></span>
                                <span>{u.is_active ? 'Active (Click to Suspend)' : 'Suspended (Click to Activate)'}</span>
                              </button>
                            ) : (
                              <span className="status-indicator-pill active">
                                <span className="dot"></span> Active (You)
                              </span>
                            )}
                          </td>
                          <td className="text-right actions-cell" onClick={(e) => e.stopPropagation()}>
                            <div className="action-buttons-group">
                              <Button 
                                variant="primary" 
                                size="sm" 
                                className="btn-inspect-identity"
                                onClick={() => setSelectedUserDetail(u)}
                                title="Inspect User Identity Dossier"
                              >
                                <Eye size={14} className="mr-1" /> Details
                              </Button>
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
        )}

        {/* 2. TRIPS LIST VIEW */}
        {inlineKpiView === 'trips' && (
          <div className="table-responsive">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>Trip Title</th>
                  <th>Explorer Creator</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Stops</th>
                  <th>Status</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {allTrips.filter(t => !searchQuery || t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.user_name.toLowerCase().includes(searchQuery.toLowerCase())).map(t => (
                  <tr key={t.id} className="clickable-table-row" onClick={() => navigate(`/trip/${t.id}/view`)}>
                    <td className="font-semibold text-primary-brand">{t.name}</td>
                    <td>{t.user_name}</td>
                    <td>{t.start_date}</td>
                    <td>{t.end_date}</td>
                    <td><span className="trips-count-pill">{t.stops_count} stops</span></td>
                    <td><span className="badge-role traveler">{t.is_public ? 'Public' : 'Private'}</span></td>
                    <td className="text-right">
                      <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); navigate(`/trip/${t.id}/view`); }}>
                        View Itinerary →
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 3. DESTINATIONS LIST VIEW */}
        {inlineKpiView === 'destinations' && (
          <div className="kpi-cities-grid p-3">
            {popularCities.filter(c => !searchQuery || c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.country.toLowerCase().includes(searchQuery.toLowerCase())).map(c => (
              <div 
                key={c.id} 
                className="destination-chip clickable-chip p-3 glass"
                onClick={() => navigate('/search/city', { state: { initialSearch: c.name } })}
              >
                <div className="chip-icon"><MapPin size={20} /></div>
                <div className="chip-info flex-1">
                  <h4 className="m-0 font-bold">{c.name}</h4>
                  <span className="text-secondary text-sm">{c.country} • Popularity: {c.popularity}</span>
                </div>
                <span className="chip-cost font-semibold text-success">{formatCityCost(c.cost_index)}</span>
                <Button size="sm" variant="primary" className="ml-2">Plan Trip →</Button>
              </div>
            ))}
          </div>
        )}

        {/* 4. ACTIVITIES LIST VIEW */}
        {inlineKpiView === 'activities' && (
          <div className="kpi-activities-grid p-3">
            {allActivities.filter(a => !searchQuery || a.name.toLowerCase().includes(searchQuery.toLowerCase()) || a.type.toLowerCase().includes(searchQuery.toLowerCase())).map(a => (
              <div 
                key={a.id} 
                className="destination-chip clickable-chip p-3 glass"
                onClick={() => navigate('/search/activity')}
              >
                <div className="chip-icon"><Activity size={20} /></div>
                <div className="chip-info flex-1">
                  <h4 className="m-0 font-bold">{a.name}</h4>
                  <span className="text-secondary text-sm">Category: {a.type} • Duration: {a.duration_hours} hrs</span>
                </div>
                <span className="chip-cost font-semibold text-success">
                  {a.cost.toString().includes('Rupees') ? a.cost : a.cost === 'Free' ? 'Free' : `${a.cost} Rupees`}
                </span>
                <Button size="sm" variant="outline" className="ml-2">View Activity →</Button>
              </div>
            ))}
          </div>
        )}
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
                      <div 
                        key={t.id} 
                        className="kpi-item-row"
                        onClick={() => {
                          setActiveKpiModal(null);
                          navigate(`/trip/${t.id}/view`);
                        }}
                        title="Click to view trip itinerary on next page"
                      >
                        <div className="trip-icon-box-sm"><Compass size={18} /></div>
                        <div className="flex-1">
                          <div className="kpi-row-main-text">{t.name} <ExternalLink size={13} className="ml-1 text-primary-brand" /></div>
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
                      <div 
                        key={i} 
                        className="destination-chip kpi-dest-card clickable-chip"
                        onClick={() => {
                          setActiveKpiModal(null);
                          navigate('/search/city', { state: { initialSearch: c.name } });
                        }}
                        title={`Click to explore ${c.name} on next page`}
                      >
                        <div className="chip-icon"><MapPin size={18} /></div>
                        <div className="chip-info">
                          <span className="chip-name">{c.name}</span>
                          <span className="chip-country">{c.country} • Popularity: {c.popularity}</span>
                        </div>
                        <span className="chip-cost">{c.cost_index}</span>
                        <ExternalLink size={14} className="ml-1 text-secondary" />
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
                      <div 
                        key={a.id} 
                        className="activity-kpi-card clickable-chip"
                        onClick={() => {
                          setActiveKpiModal(null);
                          navigate('/search/city', { state: { initialSearch: a.name } });
                        }}
                        title={`Click to view ${a.name} in destination catalog`}
                      >
                        <div className="activity-card-top">
                          <span className="activity-type-badge">{a.type}</span>
                          <span className="activity-cost-tag">₹{a.cost || 'Free'}</span>
                        </div>
                        <div className="activity-name-text">{a.name} <ExternalLink size={12} className="ml-1 text-secondary" /></div>
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

      {/* User Details & Identity Dossier Modal */}
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
                <p className="user-modal-handle">@{selectedUserDetail.username} • Verified User #{selectedUserDetail.id}</p>
              </div>
              <button className="modal-close-btn" onClick={() => setSelectedUserDetail(null)}>×</button>
            </div>

            <div className="user-modal-body">
              <div className="user-details-info-grid">
                <div className="info-item-card">
                  <span className="info-item-label">Verified Email</span>
                  <span className="info-item-value">{selectedUserDetail.email}</span>
                </div>
                <div className="info-item-card">
                  <span className="info-item-label">Security Role</span>
                  <span className="info-item-value">
                    {selectedUserDetail.is_superuser ? 'Global Superuser' : selectedUserDetail.is_staff ? 'Staff Administrator' : 'Verified Traveler'}
                  </span>
                </div>
                <div className="info-item-card">
                  <span className="info-item-label">Registration Date</span>
                  <span className="info-item-value">{selectedUserDetail.date_joined}</span>
                </div>
                <div className="info-item-card">
                  <span className="info-item-label">Travel Itineraries</span>
                  <span className="info-item-value highlight">{selectedUserDetail.trips_count} Custom Journeys</span>
                </div>
              </div>

              {/* User Planned Journeys */}
              <div className="user-trips-overview-section">
                <div className="flex-between align-center mb-2">
                  <h4>User's Created Journeys & Plans</h4>
                  <span className="text-secondary font-sm">{selectedUserDetail.trips_count} registered</span>
                </div>
                
                {selectedUserDetail.trips_count > 0 ? (
                  <div className="user-modal-trips-list">
                    {allTrips
                      .filter(t => t.user_name.toLowerCase().includes(selectedUserDetail.full_name.toLowerCase()) || t.user_name.toLowerCase().includes(selectedUserDetail.username.toLowerCase()))
                      .slice(0, 3)
                      .map((t, idx) => (
                        <div key={idx} className="user-trip-item-preview" onClick={() => { setSelectedUserDetail(null); navigate(`/trip/${t.id}/view`); }}>
                          <div>
                            <span className="preview-trip-title">{t.name}</span>
                            <span className="preview-trip-dates">{t.start_date} - {t.end_date} • {t.stops_count} stops</span>
                          </div>
                          <Button variant="ghost" size="sm" className="btn-open-trip">
                            View Itinerary <ExternalLink size={13} className="ml-1" />
                          </Button>
                        </div>
                      ))}
                    {allTrips.filter(t => t.user_name.toLowerCase().includes(selectedUserDetail.full_name.toLowerCase())).length === 0 && (
                      <div className="user-trip-item-preview" onClick={() => { setSelectedUserDetail(null); navigate('/create-trip'); }}>
                        <div>
                          <span className="preview-trip-title">Custom Itinerary - {selectedUserDetail.full_name.split(' ')[0]}</span>
                          <span className="preview-trip-dates">Upcoming adventure • 2 destinations</span>
                        </div>
                        <Button variant="ghost" size="sm" className="btn-open-trip">
                          Explore <ExternalLink size={13} className="ml-1" />
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="user-trips-summary-box">
                    <Compass size={22} className="text-secondary opacity-50" />
                    <div>
                      <span className="summary-title">No Custom Trips Planned Yet</span>
                      <p className="summary-sub">This user has not saved any trip itineraries in the database yet.</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Single Streamlined Access Control in Modal */}
              <div className="user-modal-admin-actions">
                {selectedUserDetail.id !== currentUser?.id && (
                  <Button 
                    variant="outline" 
                    className={`btn-access-toggle-action ${selectedUserDetail.is_active ? 'btn-warn' : 'btn-activate'}`}
                    onClick={() => {
                      handleToggleStatus(selectedUserDetail);
                      setSelectedUserDetail({ ...selectedUserDetail, is_active: !selectedUserDetail.is_active });
                    }}
                    disabled={actionLoading}
                  >
                    {selectedUserDetail.is_active ? <Lock size={15} className="mr-2" /> : <Unlock size={15} className="mr-2" />}
                    {selectedUserDetail.is_active ? 'Suspend Account Access' : 'Activate Account Access'}
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
                    <Trash2 size={15} className="mr-2 text-danger" /> Delete User
                  </Button>
                )}
              </div>
            </div>

            <div className="modal-footer-row">
              <Button variant="primary" onClick={() => setSelectedUserDetail(null)}>
                Close Identity Window
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
