
import React from 'react';
import { Layout } from '@/components/Layout';

const DashboardPage: React.FC = () => {
  return (
    <Layout activeSection="dashboard" onNavigate={() => {}}>
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <p>Welcome to the Dashboard</p>
      </div>
    </Layout>
  );
};

export default DashboardPage;
