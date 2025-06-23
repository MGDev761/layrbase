import React from 'react';

const Marketing = ({ activeSubTab, onSubTabChange }) => {
  const renderContent = () => {
    switch (activeSubTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Marketing Overview</h3>
            <p className="text-gray-600">Marketing overview content coming soon.</p>
          </div>
        );
      case 'campaigns':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Campaigns</h3>
            <p className="text-gray-600">Campaigns content coming soon.</p>
          </div>
        );
      case 'analytics':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Analytics</h3>
            <p className="text-gray-600">Analytics content coming soon.</p>
          </div>
        );
      case 'content':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Content</h3>
            <p className="text-gray-600">Content management coming soon.</p>
          </div>
        );
      case 'events':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Events</h3>
            <p className="text-gray-600">Events management coming soon.</p>
          </div>
        );
      default:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Marketing Overview</h3>
            <p className="text-gray-600">Marketing overview content coming soon.</p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="mt-8">
        {renderContent()}
      </div>
    </div>
  );
};

export default Marketing; 