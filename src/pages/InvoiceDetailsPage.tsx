
import React from 'react';
import { Layout } from '@/components/Layout';
import { useParams } from 'react-router-dom';

const InvoiceDetailsPage: React.FC = () => {
  const { invoiceId } = useParams<{ invoiceId: string }>();
  
  return (
    <Layout activeSection="sales" onNavigate={() => {}}>
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-4">Invoice Details</h1>
        <p>Viewing invoice ID: {invoiceId}</p>
      </div>
    </Layout>
  );
};

export default InvoiceDetailsPage;
