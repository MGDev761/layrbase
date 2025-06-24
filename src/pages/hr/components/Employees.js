import React, { useState } from 'react';
import Card from '../../../components/common/layout/Card';

const Employees = () => {
  const [view, setView] = useState('table');

  // Mock employee data
  const employees = [
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@company.com',
      position: 'CEO',
      department: 'Executive',
      manager: null,
      startDate: '2020-01-15',
      contract: 'Full-time',
      birthday: '1985-03-22',
      holidayTaken: 15,
      holidayRemaining: 10,
      sickDays: 2,
      team: 'Leadership',
      profile: 'Experienced executive with 15+ years in tech leadership'
    },
    {
      id: 2,
      name: 'Michael Chen',
      email: 'michael.chen@company.com',
      position: 'CTO',
      department: 'Technology',
      manager: 'Sarah Johnson',
      startDate: '2020-02-01',
      contract: 'Full-time',
      birthday: '1982-07-14',
      holidayTaken: 12,
      holidayRemaining: 13,
      sickDays: 0,
      team: 'Engineering',
      profile: 'Technical leader with expertise in scalable architecture'
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      email: 'emily.rodriguez@company.com',
      position: 'Senior Developer',
      department: 'Technology',
      manager: 'Michael Chen',
      startDate: '2021-03-10',
      contract: 'Full-time',
      birthday: '1990-11-08',
      holidayTaken: 18,
      holidayRemaining: 7,
      sickDays: 1,
      team: 'Backend',
      profile: 'Full-stack developer specializing in React and Node.js'
    },
    {
      id: 4,
      name: 'David Kim',
      email: 'david.kim@company.com',
      position: 'Marketing Manager',
      department: 'Marketing',
      manager: 'Sarah Johnson',
      startDate: '2021-06-15',
      contract: 'Full-time',
      birthday: '1988-12-03',
      holidayTaken: 10,
      holidayRemaining: 15,
      sickDays: 0,
      team: 'Digital Marketing',
      profile: 'Marketing professional with focus on growth and analytics'
    },
    {
      id: 5,
      name: 'Lisa Thompson',
      email: 'lisa.thompson@company.com',
      position: 'HR Specialist',
      department: 'Human Resources',
      manager: 'Sarah Johnson',
      startDate: '2021-08-20',
      contract: 'Full-time',
      birthday: '1992-04-17',
      holidayTaken: 8,
      holidayRemaining: 17,
      sickDays: 3,
      team: 'HR Operations',
      profile: 'HR professional with expertise in employee relations'
    }
  ];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const calculateAge = (birthday) => {
    const today = new Date();
    const birthDate = new Date(birthday);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div>
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Employees</h1>
        <p className="text-gray-600 text-sm mb-6">Manage employee information, organizational structure, and team relationships.</p>
      </div>

      {/* Tabs */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setView('table')}
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              view === 'table' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            Table View
          </button>
          <button
            onClick={() => setView('orgchart')}
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              view === 'orgchart' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Org Chart
          </button>
        </div>

        <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
          Add Employee
        </button>
      </div>

      {view === 'table' ? (
        <div className="overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Position & Department
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Manager
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Start Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contract
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Holiday
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {employees.map((employee) => (
                <tr key={employee.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700">
                            {employee.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                        <div className="text-sm text-gray-500">{employee.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{employee.position}</div>
                    <div className="text-sm text-gray-500">{employee.department}</div>
                    <div className="text-xs text-gray-400">{employee.team}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {employee.manager || '-'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(employee.startDate)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {employee.contract}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {employee.holidayTaken}/{employee.holidayTaken + employee.holidayRemaining} taken
                    </div>
                    <div className="text-xs text-gray-500">
                      {employee.holidayRemaining} remaining
                    </div>
                    {employee.sickDays > 0 && (
                      <div className="text-xs text-red-500">
                        {employee.sickDays} sick days
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button className="text-purple-600 hover:text-purple-900">View</button>
                      <button className="text-gray-400 hover:text-gray-600">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <Card>
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Organization Chart</h3>
            <p className="text-gray-500">Interactive organizational chart coming soon.</p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Employees; 