import React from 'react';
import { PlusIcon, DocumentTextIcon, CheckCircleIcon } from '@heroicons/react/20/solid';

const DocumentRow = ({ title, description, isAdded, addedDate }) => {
  return (
    <div className="flex items-center p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="flex-shrink-0 mr-4">
        <DocumentTextIcon className="h-8 w-8 text-gray-400" />
      </div>
      <div className="flex-grow">
        <div className="flex items-center">
          <h3 className="text-md font-medium text-gray-900">{title}</h3>
          {isAdded && <CheckCircleIcon className="ml-2 h-5 w-5 text-green-500" />}
        </div>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <div className="flex-shrink-0 ml-4 flex flex-col items-end" style={{ minWidth: '140px' }}>
        {isAdded ? (
          <>
            <button
              type="button"
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              View Document
            </button>
            <span className="mt-2 text-xs text-gray-400">
              Added on {addedDate}
            </span>
          </>
        ) : (
          <button
            type="button"
            className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Upload Document
          </button>
        )}
      </div>
    </div>
  );
};

const SalesCollateral = () => {
  const documents = [
    {
      title: 'Sales Deck',
      description: 'The primary presentation for sales pitches.',
      isAdded: true,
      addedDate: 'Mar 02, 2024',
    },
    {
      title: 'Sales One-Pager',
      description: 'A concise, one-page summary of the product.',
      isAdded: false,
    },
  ];

  return (
    <div>
      <h2 className="text-lg font-medium text-gray-900 mb-4">Sales Collateral</h2>
      <div className="space-y-3">
        {documents.map((doc, index) => (
          <DocumentRow key={index} {...doc} />
        ))}
      </div>
      
      <div className="mt-6 flex justify-center">
        <button
          type="button"
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
          <span>Add Another Document</span>
        </button>
      </div>
    </div>
  );
};

export default SalesCollateral; 