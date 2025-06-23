// src/pages/Dashboard.jsx
import React, { useState } from 'react';
import DisasterForm from '../components/Disaster/DisasterForm';
import DisasterList from '../components/Disaster/DisasterList';
import ReportForm from '../components/Report/ReportForm';
import SocialMediaFeed from '../components/Social/SocialMediaFeed';
import ResourcesList from '../components/Resource/ResourcesList';
import VerificationStatus from '../components/Verification/VerificationStatus';
import Header from './Header';
const Dashboard = () => {
  const [selectedMenu, setSelectedMenu] = useState('disasters');

  const menuItems = [
    { key: 'disasters', label: 'Disaster List' },
    { key: 'create', label: 'Create Disaster' },
    { key: 'report', label: 'Submit Report' },
    { key: 'social', label: 'Social Media Feed' },
    { key: 'resources', label: 'Nearby Resources' },
    { key: 'verify', label: 'Verify Image' }
  ];

  const renderContent = () => {
    switch (selectedMenu) {
      case 'disasters':
        return <DisasterList />;
      case 'create':
        return <DisasterForm />;
      case 'report':
        return <ReportForm />;
      case 'social':
        return <SocialMediaFeed />;
      case 'resources':
        return <ResourcesList />;
      case 'verify':
        return <VerificationStatus />;
      default:
        return <DisasterList />;
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-6 space-y-4 border-r border-gray-200">
        <h2 className="text-2xl font-bold text-blue-600 mb-6">Dashboard</h2>
        {menuItems.map(item => (
          <button
            key={item.key}
            onClick={() => setSelectedMenu(item.key)}
            className={`block w-full text-left px-4 py-2 rounded-lg text-gray-700 font-medium hover:bg-blue-100 transition ${
              selectedMenu === item.key ? 'bg-blue-500 text-white' : ''
            }`}
          >
            {item.label}
          </button>
        ))}
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-md">
          <Header />
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
