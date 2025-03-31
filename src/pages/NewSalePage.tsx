
import React from 'react';
import { Layout } from '@/components/Layout';

const NewSalePage: React.FC = () => {
  return (
    <Layout activeSection="sales" onNavigate={() => {}}>
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-4">New Sale</h1>
        <p>Create a new sale record</p>
      </div>
    </Layout>
  );
};

export default NewSalePage;
