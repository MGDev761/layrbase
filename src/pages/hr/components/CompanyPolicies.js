import React, { useState } from 'react';
import Card from '../../../components/common/layout/Card';

const CompanyPolicies = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  // Mock policy data
  const policies = [
    {
      id: 1,
      name: 'Staff Handbook',
      category: 'General',
      description: 'Comprehensive guide covering company culture, values, and general policies for all employees.',
      version: '2.1',
      lastUpdated: '2024-01-15',
      status: 'active',
      fileSize: '2.4 MB',
      fileType: 'PDF',
      department: 'HR',
      requiredReading: true
    },
    {
      id: 2,
      name: 'Expenses Policy',
      category: 'Finance',
      description: 'Guidelines for submitting and approving business expenses, including travel and entertainment.',
      version: '1.8',
      lastUpdated: '2024-02-20',
      status: 'active',
      fileSize: '1.2 MB',
      fileType: 'PDF',
      department: 'Finance',
      requiredReading: true
    },
    {
      id: 3,
      name: 'Remote Work Policy',
      category: 'Workplace',
      description: 'Policy governing remote work arrangements, expectations, and communication protocols.',
      version: '3.0',
      lastUpdated: '2024-03-10',
      status: 'active',
      fileSize: '856 KB',
      fileType: 'PDF',
      department: 'HR',
      requiredReading: true
    },
    {
      id: 4,
      name: 'IT Security Policy',
      category: 'Technology',
      description: 'Security guidelines for handling company data, passwords, and technology resources.',
      version: '2.3',
      lastUpdated: '2024-01-30',
      status: 'active',
      fileSize: '1.8 MB',
      fileType: 'PDF',
      department: 'IT',
      requiredReading: true
    },
    {
      id: 5,
      name: 'Leave and Time Off Policy',
      category: 'HR',
      description: 'Comprehensive policy covering vacation, sick leave, personal days, and other time off.',
      version: '1.5',
      lastUpdated: '2024-02-05',
      status: 'active',
      fileSize: '1.1 MB',
      fileType: 'PDF',
      department: 'HR',
      requiredReading: true
    },
    {
      id: 6,
      name: 'Dress Code Policy',
      category: 'Workplace',
      description: 'Guidelines for appropriate workplace attire and professional appearance standards.',
      version: '1.2',
      lastUpdated: '2023-12-15',
      status: 'active',
      fileSize: '512 KB',
      fileType: 'PDF',
      department: 'HR',
      requiredReading: false
    },
    {
      id: 7,
      name: 'Social Media Policy',
      category: 'Communication',
      description: 'Guidelines for employee social media use and representation of the company online.',
      version: '1.7',
      lastUpdated: '2024-01-20',
      status: 'active',
      fileSize: '768 KB',
      fileType: 'PDF',
      department: 'Marketing',
      requiredReading: true
    },
    {
      id: 8,
      name: 'Health and Safety Policy',
      category: 'Workplace',
      description: 'Workplace safety guidelines and procedures for maintaining a safe work environment.',
      version: '2.0',
      lastUpdated: '2024-02-28',
      status: 'active',
      fileSize: '1.5 MB',
      fileType: 'PDF',
      department: 'Operations',
      requiredReading: true
    }
  ];

  const categories = ['all', 'General', 'Finance', 'Workplace', 'Technology', 'HR', 'Communication'];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatFileSize = (size) => {
    return size;
  };

  const filteredPolicies = policies.filter(policy => {
    const matchesSearch = policy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         policy.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || policy.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Company Policies</h1>
        <p className="text-gray-600 text-sm mb-6">Access and manage company policies, procedures, and guidelines for employees.</p>
      </div>

      {/* Actions Bar */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Search policies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>
        </div>

        <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
          Add Policy
        </button>
      </div>

      <div className="overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Policy
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category & Department
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Version & Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Updated
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                File Details
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredPolicies.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-16">
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <p className="text-gray-500 text-sm">No policies found.</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredPolicies.map((policy) => (
                <tr key={policy.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 bg-purple-100 rounded flex items-center justify-center">
                          <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{policy.name}</div>
                        <div className="text-sm text-gray-500 max-w-xs truncate">{policy.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{policy.category}</div>
                    <div className="text-sm text-gray-500">{policy.department}</div>
                    {policy.requiredReading && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                        Required
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">v{policy.version}</div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {policy.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(policy.lastUpdated)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{policy.fileType}</div>
                    <div className="text-sm text-gray-500">{formatFileSize(policy.fileSize)}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button className="text-purple-600 hover:text-purple-900">View</button>
                      <button className="text-green-600 hover:text-green-900">Download</button>
                      <button className="text-gray-400 hover:text-gray-600">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CompanyPolicies; 