
import React from 'react';
import { Layout } from '@/components/Layout';
import { useParams } from 'react-router-dom';

const WorkOrderDetailsPage: React.FC = () => {
  const { workOrderId } = useParams<{ workOrderId: string }>();
  
  return (
    <Layout activeSection="sales" onNavigate={() => {}}>
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-4">Work Order Details</h1>
        <p>Viewing work order ID: {workOrderId}</p>
      </div>
    </Layout>
  );
};

export default WorkOrderDetailsPage;
