
import React from 'react';
import { Layout } from '@/components/Layout';

const PatientsPage: React.FC = () => {
  return (
    <Layout activeSection="patients" onNavigate={() => {}}>
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-4">Patients</h1>
        <p>Patient management page</p>
      </div>
    </Layout>
  );
};

export default PatientsPage;
