import React from 'react';

const Finance = ({ activeSubTab, onSubTabChange }) => {
  const renderContent = () => {
    switch (activeSubTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Finance Overview</h3>
            <p className="text-gray-600">Finance overview content coming soon.</p>
          </div>
        );
      case 'balance-sheet':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Balance Sheet</h3>
            <p className="text-gray-600">Balance sheet content coming soon.</p>
          </div>
        );
      case 'profit-loss':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Profit & Loss</h3>
            <p className="text-gray-600">Profit & loss content coming soon.</p>
          </div>
        );
      case 'cashflow':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Cash Flow</h3>
            <p className="text-gray-600">Cash flow content coming soon.</p>
          </div>
        );
      case 'budget':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Budget</h3>
            <p className="text-gray-600">Budget content coming soon.</p>
          </div>
        );
      case 'forecast':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Forecast</h3>
            <p className="text-gray-600">Forecast content coming soon.</p>
          </div>
        );
      case 'invoices':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Invoices</h3>
            <p className="text-gray-600">Invoices content coming soon.</p>
          </div>
        );
      default:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Finance Overview</h3>
            <p className="text-gray-600">Finance overview content coming soon.</p>
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

export default Finance; 