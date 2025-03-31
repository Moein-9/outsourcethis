
import React from 'react';
import { Layout } from '@/components/Layout';

const SettingsPage: React.FC = () => {
  return (
    <Layout activeSection="settings" onNavigate={() => {}}>
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-4">Settings</h1>
        <p>Application settings</p>
      </div>
    </Layout>
  );
};

export default SettingsPage;
