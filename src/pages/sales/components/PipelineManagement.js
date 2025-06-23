import React, { useState } from 'react';
import { PlusIcon, CurrencyDollarIcon, CalendarIcon } from '@heroicons/react/20/solid';

const initialDeals = [
  { id: 1, title: 'TechCorp Ltd', value: '£25,000', stage: 'lead', customer: 'TechCorp Ltd', created: '2024-01-10', nextAction: 'Initial call' },
  { id: 2, title: 'Acme Solutions', value: '£15,000', stage: 'qualified', customer: 'Acme Solutions', created: '2024-01-08', nextAction: 'Send proposal' },
  { id: 3, title: 'StartupXYZ', value: '£8,000', stage: 'proposal', customer: 'StartupXYZ', created: '2024-01-05', nextAction: 'Follow up' },
  { id: 4, title: 'InnovateTech', value: '£35,000', stage: 'negotiation', customer: 'InnovateTech', created: '2024-01-03', nextAction: 'Contract review' },
  { id: 5, title: 'GrowthCo', value: '£12,000', stage: 'closed', customer: 'GrowthCo', created: '2024-01-01', nextAction: 'Onboarding' },
];

const PipelineManagement = () => {
  const [deals] = useState(initialDeals);

  const stages = [
    { id: 'lead', name: 'Lead', color: 'bg-gray-200', deals: deals.filter(d => d.stage === 'lead') },
    { id: 'qualified', name: 'Qualified', color: 'bg-blue-200', deals: deals.filter(d => d.stage === 'qualified') },
    { id: 'proposal', name: 'Proposal', color: 'bg-yellow-200', deals: deals.filter(d => d.stage === 'proposal') },
    { id: 'negotiation', name: 'Negotiation', color: 'bg-orange-200', deals: deals.filter(d => d.stage === 'negotiation') },
    { id: 'closed', name: 'Closed', color: 'bg-green-200', deals: deals.filter(d => d.stage === 'closed') },
  ];

  const getStageValue = (stageDeals) => {
    return stageDeals.reduce((total, deal) => {
      const value = parseInt(deal.value.replace(/[£,]/g, ''));
      return total + value;
    }, 0);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Sales Pipeline</h3>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2">
          <PlusIcon className="h-4 w-4" />
          <span>Add Deal</span>
        </button>
      </div>

      {/* Pipeline Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {stages.map((stage) => (
          <div key={stage.id} className="bg-white rounded-lg shadow border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-gray-900">{stage.name}</h4>
              <span className="text-xs text-gray-500">{stage.deals.length}</span>
            </div>
            <div className={`w-full h-2 rounded-full ${stage.color} mb-2`} />
            <p className="text-lg font-semibold text-gray-900">£{getStageValue(stage.deals).toLocaleString()}</p>
          </div>
        ))}
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {stages.map((stage) => (
          <div key={stage.id} className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-medium text-gray-900">{stage.name}</h4>
              <span className="text-xs text-gray-500">{stage.deals.length}</span>
            </div>
            
            <div className="space-y-3">
              {stage.deals.map((deal) => (
                <div key={deal.id} className="bg-white rounded-lg shadow border border-gray-200 p-3 cursor-pointer hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <h5 className="text-sm font-medium text-gray-900">{deal.title}</h5>
                    <span className="text-sm font-semibold text-gray-900">{deal.value}</span>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center text-xs text-gray-500">
                      <CurrencyDollarIcon className="h-3 w-3 mr-1" />
                      {deal.customer}
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <CalendarIcon className="h-3 w-3 mr-1" />
                      Created: {deal.created}
                    </div>
                    <div className="text-xs text-blue-600 font-medium">
                      Next: {deal.nextAction}
                    </div>
                  </div>
                </div>
              ))}
              
              <button className="w-full p-2 text-sm text-gray-500 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 hover:text-gray-700 transition-colors">
                + Add Deal
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PipelineManagement; 