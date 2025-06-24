import React, { useState } from 'react';
import Card from '../../../components/common/layout/Card';

const TimeManager = () => {
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock holiday request data
  const holidayRequests = [
    {
      id: 1,
      employeeName: 'Emily Rodriguez',
      employeeEmail: 'emily.rodriguez@company.com',
      requestType: 'Holiday',
      startDate: '2024-07-15',
      endDate: '2024-07-19',
      days: 5,
      reason: 'Summer vacation with family',
      status: 'pending',
      submittedDate: '2024-06-01',
      manager: 'Michael Chen',
      remainingHolidays: 7
    },
    {
      id: 2,
      employeeName: 'David Kim',
      employeeEmail: 'david.kim@company.com',
      requestType: 'Sick Leave',
      startDate: '2024-06-10',
      endDate: '2024-06-12',
      days: 3,
      reason: 'Medical appointment and recovery',
      status: 'approved',
      submittedDate: '2024-06-08',
      manager: 'Sarah Johnson',
      remainingHolidays: 15
    },
    {
      id: 3,
      employeeName: 'Lisa Thompson',
      employeeEmail: 'lisa.thompson@company.com',
      requestType: 'Holiday',
      startDate: '2024-08-05',
      endDate: '2024-08-09',
      days: 5,
      reason: 'Personal time off',
      status: 'approved',
      submittedDate: '2024-06-15',
      manager: 'Sarah Johnson',
      remainingHolidays: 17
    },
    {
      id: 4,
      employeeName: 'Michael Chen',
      employeeEmail: 'michael.chen@company.com',
      requestType: 'Holiday',
      startDate: '2024-09-20',
      endDate: '2024-09-27',
      days: 8,
      reason: 'Conference attendance and vacation',
      status: 'pending',
      submittedDate: '2024-06-20',
      manager: 'Sarah Johnson',
      remainingHolidays: 13
    },
    {
      id: 5,
      employeeName: 'Sarah Johnson',
      employeeEmail: 'sarah.johnson@company.com',
      requestType: 'Holiday',
      startDate: '2024-07-01',
      endDate: '2024-07-05',
      days: 5,
      reason: 'Independence Day long weekend',
      status: 'approved',
      submittedDate: '2024-05-25',
      manager: null,
      remainingHolidays: 10
    }
  ];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const filteredRequests = filterStatus === 'all' 
    ? holidayRequests 
    : holidayRequests.filter(request => request.status === filterStatus);

  return (
    <div>
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Time Manager</h1>
        <p className="text-gray-600 text-sm mb-6">Manage holiday requests, time off, and approval workflows for your team.</p>
      </div>

      {/* Actions Bar */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Requests</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
          Submit Request
        </button>
      </div>

      <Card>
        <div className="overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Request Details
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dates
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Manager
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <p className="text-gray-500 text-sm">No time off requests found.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-700">
                              {request.employeeName.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{request.employeeName}</div>
                          <div className="text-sm text-gray-500">{request.employeeEmail}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{request.requestType}</div>
                      <div className="text-sm text-gray-500">{request.days} days</div>
                      <div className="text-xs text-gray-400 max-w-xs truncate">{request.reason}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDate(request.startDate)}</div>
                      <div className="text-sm text-gray-500">to {formatDate(request.endDate)}</div>
                      <div className="text-xs text-gray-400">Submitted: {formatDate(request.submittedDate)}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {request.manager || '-'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                        {getStatusText(request.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        {request.status === 'pending' && (
                          <>
                            <button className="text-green-600 hover:text-green-900">Approve</button>
                            <button className="text-red-600 hover:text-red-900">Reject</button>
                          </>
                        )}
                        <button className="text-blue-600 hover:text-blue-900">View</button>
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
      </Card>
    </div>
  );
};

export default TimeManager; 