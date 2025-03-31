
import React from 'react';
import { Navigate } from 'react-router-dom';

const HomePage: React.FC = () => {
  // For simplicity, we'll just redirect to the dashboard
  return <Navigate to="/dashboard" replace />;
};

export default HomePage;
