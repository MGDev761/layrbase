import React from 'react';
import SalesDashboard from './components/SalesDashboard';
import CustomerManagement from './components/CustomerManagement';
import PipelineManagement from './components/PipelineManagement';
import SalesReports from './components/SalesReports';

const Sales = ({ activeSubTab, onSubTabChange }) => {
  const renderContent = () => {
    switch (activeSubTab) {
      case 'dashboard':
        return <SalesDashboard />;
      case 'customers':
        return <CustomerManagement />;
      case 'pipeline':
        return <PipelineManagement />;
      case 'reports':
        return <SalesReports />;
      default:
        return <SalesDashboard />;
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

export default Sales; 