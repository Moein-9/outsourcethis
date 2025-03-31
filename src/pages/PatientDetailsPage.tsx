
import React from 'react';
import { useParams } from 'react-router-dom';
import { Layout } from '@/components/Layout';

const PatientDetailsPage: React.FC = () => {
  const { patientId } = useParams<{ patientId: string }>();
  
  return (
    <Layout activeSection="patients" onNavigate={() => {}}>
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-4">Patient Details</h1>
        <p>Details for patient ID: {patientId}</p>
      </div>
    </Layout>
  );
};

export default PatientDetailsPage;
