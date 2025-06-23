import React from 'react';
import Contracts from './components/Contracts';
import Templates from './components/Templates';
import ComplianceDeadlines from './components/ComplianceDeadlines';
import RiskInsurance from './components/RiskInsurance';

const Legal = ({ activeSubTab, onSubTabChange }) => {
  const renderContent = () => {
    switch (activeSubTab) {
      case 'contracts':
        return <Contracts />;
      case 'templates':
        return <Templates />;
      case 'compliance':
        return <ComplianceDeadlines />;
      case 'risk':
        return <RiskInsurance />;
      default:
        return <Contracts />;
    }
  };

  return (
    <div>
      {renderContent()}
    </div>
  );
};

export default Legal; 