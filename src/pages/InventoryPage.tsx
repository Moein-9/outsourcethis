
import React from 'react';
import { Layout } from '@/components/Layout';

const InventoryPage: React.FC = () => {
  return (
    <Layout activeSection="inventory" onNavigate={() => {}}>
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-4">Inventory</h1>
        <p>Inventory management page</p>
      </div>
    </Layout>
  );
};

export default InventoryPage;
