import React, { useState } from 'react';
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/20/solid';

const SideNav = ({ 
  tabs, 
  activeTab, 
  onTabChange, 
  subTabs, 
  activeSubTab, 
  onSubTabChange 
}) => {
  const [expandedSections, setExpandedSections] = useState([activeTab]);

  const toggleSection = (tabId) => {
    setExpandedSections(prev => 
      prev.includes(tabId) 
        ? prev.filter(id => id !== tabId)
        : [...prev, tabId]
    );
  };

  const handleTabClick = (tabId) => {
    onTabChange(tabId);
    if (!expandedSections.includes(tabId)) {
      setExpandedSections(prev => [...prev, tabId]);
    }
  };

  const handleTabButtonClick = (tabId, hasSubsections) => {
    if (hasSubsections) {
      toggleSection(tabId);
    } else {
      handleTabClick(tabId);
    }
  };

  const handleSubTabClick = (subTabId) => {
    // First ensure the parent tab is active
    const parentTab = Object.keys(sectionSubsections).find(tabId => 
      sectionSubsections[tabId].some(sub => sub.id === subTabId)
    );
    
    if (parentTab && parentTab !== activeTab) {
      onTabChange(parentTab);
    }
    
    // Then set the sub-tab
    onSubTabChange(subTabId);
  };

  // Define subsections for each main tab
  const sectionSubsections = {
    dashboard: [],
    company: [
      { id: 'foundation', name: 'Company Foundations' },
      { id: 'details', name: 'Company Details' },
    ],
    finance: [
      { id: 'overview', name: 'Overview' },
      { id: 'balance-sheet', name: 'Balance Sheet' },
      { id: 'profit-loss', name: 'Profit & Loss' },
      { id: 'cashflow', name: 'Cash Flow' },
      { id: 'budget', name: 'Budget' },
      { id: 'forecast', name: 'Forecast' },
      { id: 'invoices', name: 'Invoices' },
    ],
    legal: [
      { id: 'contracts', name: 'Contracts' },
      { id: 'templates', name: 'Templates' },
      { id: 'compliance', name: 'Compliance Deadlines' },
      { id: 'risk', name: 'Risk & Insurance' },
    ],
    captable: [
      { id: 'captable', name: 'Cap Table' },
      { id: 'rounds', name: 'Round History' },
      { id: 'exits', name: 'Exit Scenarios' },
      { id: 'investment', name: 'Investment Planning' },
    ],
    marketing: [
      { id: 'overview', name: 'Overview' },
      { id: 'campaigns', name: 'Campaigns' },
      { id: 'analytics', name: 'Analytics' },
      { id: 'content', name: 'Content' },
      { id: 'events', name: 'Events' },
    ],
    sales: [
      { id: 'dashboard', name: 'Sales Dashboard' },
      { id: 'customers', name: 'Customer Management' },
      { id: 'pipeline', name: 'Pipeline' },
      { id: 'reports', name: 'Reports' },
    ],
    hr: [
      { id: 'overview', name: 'Overview' },
      { id: 'employees', name: 'Employees' },
      { id: 'recruitment', name: 'Recruitment' },
      { id: 'performance', name: 'Performance' },
      { id: 'time-tracking', name: 'Time Tracking' },
    ],
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <nav className="space-y-1 pt-4">
        {tabs.map((tab) => {
          const isExpanded = expandedSections.includes(tab.id);
          const hasSubsections = sectionSubsections[tab.id]?.length > 0;
          
          return (
            <div key={tab.id}>
              <button
                onClick={() => handleTabButtonClick(tab.id, hasSubsections)}
                className={`w-full flex items-center justify-between px-4 py-3 text-left text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-500'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                  </svg>
                  <span>{tab.name}</span>
                </div>
                {hasSubsections && (
                  isExpanded ? (
                    <ChevronDownIcon className="h-4 w-4" />
                  ) : (
                    <ChevronRightIcon className="h-4 w-4" />
                  )
                )}
              </button>
              
              {isExpanded && hasSubsections && (
                <div className="bg-gray-50 border-l-2 border-gray-200">
                  {sectionSubsections[tab.id].map((subsection) => (
                    <button
                      key={subsection.id}
                      onClick={() => handleSubTabClick(subsection.id)}
                      className={`w-full flex items-center px-8 py-2 text-left text-sm transition-colors ${
                        activeSubTab === subsection.id
                          ? 'text-blue-700 bg-blue-50'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      {subsection.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
        
        {/* Divider */}
        <div className="border-t border-gray-200 my-2"></div>
        
        {/* Marketplace Link */}
        <button
          onClick={() => onTabChange('marketplace')}
          className={`w-full flex items-center px-4 py-3 text-left text-sm font-medium transition-colors ${
            activeTab === 'marketplace'
              ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-500'
              : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center space-x-3">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span>Marketplace</span>
          </div>
        </button>
      </nav>
    </div>
  );
};

export default SideNav; 