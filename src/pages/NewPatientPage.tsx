
import React from 'react';
import { Layout } from '@/components/Layout';

const NewPatientPage: React.FC = () => {
  return (
    <Layout activeSection="patients" onNavigate={() => {}}>
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-4">New Patient</h1>
        <p>Create a new patient record</p>
      </div>
    </Layout>
  );
};

export default NewPatientPage;
