
import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Welcome to the Optician App</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link to="/dashboard" className="p-6 bg-white shadow-md rounded-lg hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-2">Dashboard</h2>
          <p className="text-gray-600">View your business overview and statistics</p>
        </Link>
        <Link to="/sales" className="p-6 bg-white shadow-md rounded-lg hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-2">Sales</h2>
          <p className="text-gray-600">Manage sales and invoices</p>
        </Link>
        <Link to="/patients" className="p-6 bg-white shadow-md rounded-lg hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-2">Patients</h2>
          <p className="text-gray-600">Manage patient records</p>
        </Link>
        <Link to="/work-orders" className="p-6 bg-white shadow-md rounded-lg hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-2">Work Orders</h2>
          <p className="text-gray-600">Manage work orders</p>
        </Link>
        <Link to="/inventory" className="p-6 bg-white shadow-md rounded-lg hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-2">Inventory</h2>
          <p className="text-gray-600">Manage your inventory</p>
        </Link>
        <Link to="/settings" className="p-6 bg-white shadow-md rounded-lg hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-2">Settings</h2>
          <p className="text-gray-600">Configure application settings</p>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
