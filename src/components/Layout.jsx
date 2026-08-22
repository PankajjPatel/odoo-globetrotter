import React from 'react';
import { Navbar } from './Navbar';
import { Outlet } from 'react-router-dom';
import './Layout.css';

export const Layout = () => {
  return (
    <div className="layout-wrapper">
      <Navbar />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};
