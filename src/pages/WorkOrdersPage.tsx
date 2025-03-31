
import React from 'react';
import { Layout } from '@/components/Layout';

const WorkOrdersPage: React.FC = () => {
  return (
    <Layout activeSection="work-orders" onNavigate={() => {}}>
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-4">Work Orders</h1>
        <p>Manage work orders</p>
      </div>
    </Layout>
  );
};

export default WorkOrdersPage;
