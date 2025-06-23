import React from 'react';
import { DocumentMagnifyingGlassIcon, ChevronRightIcon, BuildingStorefrontIcon } from '@heroicons/react/20/solid';

const mockListings = [
  { name: 'Innovate Inc.', description: 'Cutting-edge AI solutions.', category: 'Tech', logo: 'https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg' },
  { name: 'Design Co.', description: 'Creative branding and design services.', category: 'Design', logo: 'https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg' },
  { name: 'Legal Eagles', description: 'Affordable legal services for startups.', category: 'Legal', logo: 'https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg' },
  { name: 'Number Crunchers', description: 'Accounting and financial consulting.', category: 'Finance', logo: 'https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg' },
  { name: 'Growth Hackers', description: 'Marketing services for fast growth.', category: 'Marketing' },
];

const ListingCard = ({ listing }) => (
  <div className="flex items-center p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50">
    <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center mr-4">
      {listing.logo ? (
        <img src={listing.logo} alt={`${listing.name} logo`} className="h-full w-full" />
      ) : (
        <BuildingStorefrontIcon className="h-8 w-8 text-gray-400" />
      )}
    </div>
    <div className="flex-grow">
      <h3 className="text-md font-medium text-gray-900">{listing.name}</h3>
      <p className="text-sm text-gray-500">{listing.description}</p>
    </div>
    <ChevronRightIcon className="h-5 w-5 text-gray-400" />
  </div>
);

const MarketplaceListings = () => {
  return (
    <div>
      {/* Search and Filters */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search services..."
            className="w-full pl-10 pr-4 py-2 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
          <DocumentMagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
        <div className="mt-4 flex space-x-2">
          <button className="px-3 py-1 text-sm font-medium text-white bg-primary-600 rounded-full">All</button>
          <button className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-full">Tech</button>
          <button className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-full">Design</button>
          <button className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-full">Legal</button>
          <button className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-full">Finance</button>
        </div>
      </div>

      {/* Listings */}
      <div className="space-y-4">
        {mockListings.map((listing, index) => (
          <ListingCard key={index} listing={listing} />
        ))}
      </div>
    </div>
  );
};

export default MarketplaceListings; 