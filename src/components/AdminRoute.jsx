import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const AdminRoute = ({ children }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        color: '#ff5722',
        fontWeight: '600'
      }}>
        Verifying Admin Access...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Strict check: only superuser/staff or _Pankaj_03
  const isAdmin = user?.is_superuser || user?.is_staff || user?.username === '_Pankaj_03';

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};
