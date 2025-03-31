
import React from 'react';
import { useParams } from 'react-router-dom';
import { Layout } from '@/components/Layout';

const InvoiceDetailsPage: React.FC = () => {
  const { invoiceId } = useParams<{ invoiceId: string }>();
  
  return (
    <Layout activeSection="sales" onNavigate={() => {}}>
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-4">Invoice Details</h1>
        <p>Details for invoice ID: {invoiceId}</p>
      </div>
    </Layout>
  );
};

export default InvoiceDetailsPage;
