
import React from 'react';
import { useParams } from 'react-router-dom';
import { Layout } from '@/components/Layout';

const WorkOrderDetailsPage: React.FC = () => {
  const { workOrderId } = useParams<{ workOrderId: string }>();
  
  return (
    <Layout activeSection="work-orders" onNavigate={() => {}}>
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-4">Work Order Details</h1>
        <p>Details for work order ID: {workOrderId}</p>
      </div>
    </Layout>
  );
};

export default WorkOrderDetailsPage;
