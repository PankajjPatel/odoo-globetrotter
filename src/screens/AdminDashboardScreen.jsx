import React from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Users, MapPin, Activity, Settings } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './AdminDashboardScreen.css';

export const AdminDashboardScreen = () => {
  // Dummy Data
  const stats = [
    { label: 'Total Users', value: '1,204', icon: Users, color: 'text-blue', bg: 'bg-blue-light' },
    { label: 'Active Trips', value: '342', icon: MapPin, color: 'text-green', bg: 'bg-green-light' },
    { label: 'Activities Booked', value: '890', icon: Activity, color: 'text-orange', bg: 'bg-orange-light' },
  ];

  const userGrowth = [
    { month: 'Jan', users: 400 },
    { month: 'Feb', users: 600 },
    { month: 'Mar', users: 800 },
    { month: 'Apr', users: 1204 },
  ];

  return (
    <div className="admin-container container animate-fade-in">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p className="text-secondary">Platform analytics and user management.</p>
      </div>

      <div className="admin-stats-row">
        {stats.map((stat, i) => (
          <Card key={i} className="admin-stat-card glass">
            <div className={`admin-stat-icon ${stat.bg} ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div className="admin-stat-info">
              <span className="admin-stat-value">{stat.value}</span>
              <span className="admin-stat-label">{stat.label}</span>
            </div>
          </Card>
        ))}
      </div>

      <div className="admin-content-grid">
        <Card className="admin-chart-card">
          <div className="card-header-flex">
            <h2>User Growth</h2>
            <Button variant="ghost" size="sm">Last 6 Months</Button>
          </div>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={userGrowth} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: 'rgba(0,0,0,0.05)'}} />
                <Bar dataKey="users" fill="var(--primary-color)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="admin-table-card">
          <div className="card-header-flex">
            <h2>Recent Users</h2>
            <Button variant="outline" size="sm"><Settings size={14} className="mr-1"/> Manage</Button>
          </div>
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Trips</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Explorer Doe</td>
                  <td>explorer@example.com</td>
                  <td>3</td>
                  <td><span className="status-badge active">Active</span></td>
                </tr>
                <tr>
                  <td>Jane Smith</td>
                  <td>jane@example.com</td>
                  <td>1</td>
                  <td><span className="status-badge active">Active</span></td>
                </tr>
                <tr>
                  <td>Mike Johnson</td>
                  <td>mike@example.com</td>
                  <td>0</td>
                  <td><span className="status-badge inactive">Inactive</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};
