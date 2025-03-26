
import React from 'react';
import { FrameLabelTemplate } from '@/components/FrameLabelTemplate';
import { Layout } from '@/components/Layout';

const PrintLabelPage: React.FC = () => {
  // We need to pass required props to Layout component based on its interface
  return (
    <Layout 
      activeSection="print-labels" 
      onNavigate={() => {}}
    >
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">Frame Label Printing</h1>
        <div className="bg-white p-4 rounded-lg shadow">
          <FrameLabelTemplate />
        </div>
      </div>
    </Layout>
  );
};

export default PrintLabelPage;
