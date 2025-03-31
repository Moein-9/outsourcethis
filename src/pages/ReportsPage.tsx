
import React from 'react';
import { Layout } from '@/components/Layout';

const ReportsPage: React.FC = () => {
  return (
    <Layout activeSection="reports" onNavigate={() => {}}>
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-4">Reports</h1>
        <p>View reports and analytics</p>
      </div>
    </Layout>
  );
};

export default ReportsPage;
