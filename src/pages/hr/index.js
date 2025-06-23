import React from 'react';

const HR = ({ activeSubTab, onSubTabChange }) => {
  const renderContent = () => {
    switch (activeSubTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">HR Overview</h3>
            <p className="text-gray-600">HR overview content coming soon.</p>
          </div>
        );
      case 'employees':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Employees</h3>
            <p className="text-gray-600">Employee management content coming soon.</p>
          </div>
        );
      case 'recruitment':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Recruitment</h3>
            <p className="text-gray-600">Recruitment content coming soon.</p>
          </div>
        );
      case 'performance':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Performance</h3>
            <p className="text-gray-600">Performance management content coming soon.</p>
          </div>
        );
      case 'time-tracking':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Time Tracking</h3>
            <p className="text-gray-600">Time tracking content coming soon.</p>
          </div>
        );
      default:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">HR Overview</h3>
            <p className="text-gray-600">HR overview content coming soon.</p>
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

export default HR; 