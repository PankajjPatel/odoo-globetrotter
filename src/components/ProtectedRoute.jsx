import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        color: '#ff5722',
        fontSize: '1.25rem',
        fontWeight: '600'
      }}>
        <div className="spinner mr-2" style={{
          width: '24px',
          height: '24px',
          border: '3px solid rgba(255,87,34,0.2)',
          borderTopColor: '#ff5722',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
          marginRight: '12px'
        }}></div>
        Loading GlobeTrotter...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};
