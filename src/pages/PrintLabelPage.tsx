
import React from 'react';
import { Layout } from '@/components/Layout';

const PrintLabelPage: React.FC = () => {
  return (
    <Layout activeSection="inventory" onNavigate={() => {}}>
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-4">Print Labels</h1>
        <p>Print inventory labels</p>
      </div>
    </Layout>
  );
};

export default PrintLabelPage;
