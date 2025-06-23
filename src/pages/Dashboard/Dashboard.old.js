import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getCompanyProfile } from '../../services/legalService';
import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon, 
  InformationCircleIcon,
  BellIcon 
} from '@heroicons/react/20/solid';

const Dashboard = () => {
  const { currentOrganization } = useAuth();
  const [companyProfile, setCompanyProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  // Mock notifications data
  const notifications = [
    {
      id: 1,
      type: 'success',
      title: 'Company profile updated',
      message: 'Your company logo and details have been successfully updated.',
      time: '2 hours ago',
      read: false
    },
    {
      id: 2,
      type: 'warning',
      title: 'Compliance deadline approaching',
      message: 'Annual confirmation statement due in 30 days.',
      time: '1 day ago',
      read: false
    },
    {
      id: 3,
      type: 'info',
      title: 'New contract template available',
      message: 'Employment agreement template has been added to your library.',
      time: '3 days ago',
      read: true
    },
    {
      id: 4,
      type: 'success',
      title: 'Insurance policy renewed',
      message: 'Public liability insurance has been automatically renewed.',
      time: '1 week ago',
      read: true
    },
    {
      id: 5,
      type: 'warning',
      title: 'VAT registration reminder',
      message: 'Consider registering for VAT if your turnover exceeds £85,000.',
      time: '1 week ago',
      read: true
    }
  ];

  // Fetch company profile data
  useEffect(() => {
    const fetchCompanyProfile = async () => {
      if (!currentOrganization?.organization_id) return;
      
      try {
        setLoading(true);
        const data = await getCompanyProfile(currentOrganization.organization_id);
        setCompanyProfile(data);
      } catch (error) {
        console.error('Error fetching company profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyProfile();
  }, [currentOrganization]);

  const financialMetrics = [
    { name: 'Revenue', value: '$2.4M', change: '+12%', changeType: 'positive' },
    { name: 'Cash', value: '$850K', change: '-5%', changeType: 'negative' },
    { name: 'Monthly Costs', value: '$180K', change: '+8%', changeType: 'negative' },
    { name: 'Runway', value: '4.7 months', change: '-0.3', changeType: 'negative' },
  ];

  const upcomingReleases = [
    { title: 'Q1 Product Launch', date: 'Mar 15, 2024', status: 'On Track' },
    { title: 'Brand Campaign', date: 'Apr 1, 2024', status: 'In Progress' },
    { title: 'Website Redesign', date: 'Apr 15, 2024', status: 'Planning' },
  ];

  const teamHolidays = [
    { name: 'Sarah Johnson', role: 'Marketing Manager', dates: 'Mar 18-22, 2024', status: 'Approved' },
    { name: 'Mike Chen', role: 'Developer', dates: 'Mar 25-29, 2024', status: 'Pending' },
    { name: 'Emma Davis', role: 'Sales Rep', dates: 'Apr 1-5, 2024', status: 'Approved' },
    { name: 'Alex Thompson', role: 'Designer', dates: 'Apr 8-12, 2024', status: 'Requested' },
  ];

  const handleNotificationClick = (notification) => {
    setSelectedNotification(notification);
    setShowNotificationModal(true);
  };

  // Notifications component
  const Notifications = ({ notifications }) => {
    const getIcon = (type) => {
      switch (type) {
        case 'success':
          return <CheckCircleIcon className="h-4 w-4 text-green-500" />;
        case 'warning':
          return <ExclamationTriangleIcon className="h-4 w-4 text-yellow-500" />;
        case 'info':
          return <InformationCircleIcon className="h-4 w-4 text-blue-500" />;
        default:
          return <BellIcon className="h-4 w-4 text-gray-500" />;
      }
    };

    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Notifications</h2>
        </div>
        <div className="bg-white rounded-lg shadow p-0 h-[216px] overflow-hidden">
          <div className="divide-y divide-gray-100 max-h-full overflow-y-auto">
            {notifications.map((notification) => (
              <button
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={`w-full text-left p-3 hover:bg-gray-50 transition-colors ${
                  !notification.read ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className={`text-sm font-medium truncate ${
                        !notification.read ? 'text-gray-900' : 'text-gray-600'
                      }`}>
                        {notification.title}
                      </p>
                      <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                        {notification.time}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
          {notifications.length === 0 && (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <BellIcon className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No notifications</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Notification Modal
  const NotificationModal = () => {
    if (!selectedNotification) return null;

    const getIcon = (type) => {
      switch (type) {
        case 'success':
          return <CheckCircleIcon className="h-6 w-6 text-green-500" />;
        case 'warning':
          return <ExclamationTriangleIcon className="h-6 w-6 text-yellow-500" />;
        case 'info':
          return <InformationCircleIcon className="h-6 w-6 text-blue-500" />;
        default:
          return <BellIcon className="h-6 w-6 text-gray-500" />;
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-96 max-w-md">
          <div className="flex items-start space-x-3 mb-4">
            <div className="flex-shrink-0 mt-1">
              {getIcon(selectedNotification.type)}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-medium text-gray-900">
                {selectedNotification.title}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {selectedNotification.time}
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-700 mb-6">
            {selectedNotification.message}
          </p>
          <div className="flex justify-end">
            <button
              onClick={() => setShowNotificationModal(false)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Company Profile and Notifications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Company Profile */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Company Profile</h2>
          <div className="bg-white rounded-lg shadow">
            {loading ? (
              <div className="flex h-[216px]">
                <div className="w-48 border-r border-gray-100">
                  <div className="w-full h-full flex items-center justify-center p-4">
                    <div className="animate-pulse bg-gray-200 w-20 h-20 rounded"></div>
                  </div>
                </div>
                <div className="flex-1 p-6">
                  <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded mb-4"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex h-[216px]">
                <div className="w-48 border-r border-gray-100">
                  {companyProfile?.logo_url ? (
                    <img src={companyProfile.logo_url} alt="Company logo" className="w-full h-full object-contain p-4" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center p-4">
                      <svg className="w-20 h-20 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="flex-1 p-6">
                  <h3 className="text-xl font-medium text-gray-900 mb-4">{companyProfile?.name || 'Loading...'}</h3>
                  <div className="space-y-2">
                    {companyProfile?.website && (
                      <div className="flex items-center text-sm text-gray-500">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                        </svg>
                        <a href={`https://${companyProfile.website}`} target="_blank" rel="noopener noreferrer" className="hover:text-gray-700">
                          {companyProfile.website}
                        </a>
                      </div>
                    )}
                    {companyProfile?.linkedin_profile && (
                      <div className="flex items-center text-sm text-gray-500">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                        </svg>
                        <a href={companyProfile.linkedin_profile} target="_blank" rel="noopener noreferrer" className="hover:text-gray-700">
                          {companyProfile.linkedin_profile}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Notifications */}
        <Notifications notifications={notifications} />
      </div>

      {/* Financial Metrics */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Financial Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {financialMetrics.map((metric) => (
            <div key={metric.name} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{metric.name}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</p>
                </div>
                <div className={`text-sm font-medium ${metric.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                  {metric.change}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Marketing Releases and Team Holidays */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Marketing Releases */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Marketing Releases</h2>
          <div className="bg-white rounded-lg shadow">
            <div className="divide-y divide-gray-100">
              {upcomingReleases.map((release, index) => (
                <div key={index} className="flex items-center justify-between p-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">{release.title}</h4>
                    <p className="text-xs text-gray-500 mt-1">{release.date}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    release.status === 'On Track' ? 'bg-green-100 text-green-800' :
                    release.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {release.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Team Holidays */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Team Holidays</h2>
          <div className="bg-white rounded-lg shadow">
            <div className="divide-y divide-gray-100">
              {teamHolidays.map((holiday, index) => (
                <div key={index} className="flex items-center justify-between p-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">{holiday.name}</h4>
                    <p className="text-xs text-gray-500">{holiday.role}</p>
                    <p className="text-xs text-gray-500 mt-1">{holiday.dates}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    holiday.status === 'Approved' ? 'bg-green-100 text-green-800' :
                    holiday.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {holiday.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="bg-white rounded-lg shadow p-4 text-left hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-2 bg-teal-100 rounded-lg">
                <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Add Company Info</p>
                <p className="text-sm text-gray-500">Complete your profile</p>
              </div>
            </div>
          </button>

          <button className="bg-white rounded-lg shadow p-4 text-left hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-2 bg-pink-100 rounded-lg">
                <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Update Finances</p>
                <p className="text-sm text-gray-500">Add latest numbers</p>
              </div>
            </div>
          </button>

          <button className="bg-white rounded-lg shadow p-4 text-left hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Manage Cap Table</p>
                <p className="text-sm text-gray-500">Update ownership</p>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Notification Modal */}
      {showNotificationModal && (
        <NotificationModal />
      )}
    </div>
  );
};

export default Dashboard; 