import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getCompanyProfile } from '../../services/legalService';
import { getUpcomingMarketingEvents } from '../../services/marketingService';
import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon, 
  InformationCircleIcon,
  BellIcon 
} from '@heroicons/react/20/solid';

// Icon helper for notifications
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

const Dashboard = () => {
  const { currentOrganization } = useAuth();
  const [companyProfile, setCompanyProfile] = useState(null);
  const [marketingEvents, setMarketingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [dashboardSections, setDashboardSections] = useState({
    financial: true,
    notifications: true,
    salesActivity: true,
    marketing: true,
    holidays: true,
    businessDetails: false
  });

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
    const fetchData = async () => {
      if (!currentOrganization?.organization_id) return;
      
      try {
        setLoading(true);
        const [profileData, eventsData] = await Promise.all([
          getCompanyProfile(currentOrganization.organization_id),
          getUpcomingMarketingEvents(currentOrganization.organization_id, 5)
        ]);
        setCompanyProfile(profileData);
        setMarketingEvents(eventsData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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

  const handleSectionToggle = (section) => {
    setDashboardSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Notifications component
  const Notifications = ({ notifications }) => {
  return (
        <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Notifications</h2>
        </div>
        <div className="bg-white rounded-md flex flex-col h-[216px] overflow-hidden">
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

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-md p-6 w-96 max-w-md">
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
      {/* Page Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            Welcome back! Here's an overview of your organization's key metrics and activities.
          </p>
        </div>
        <div className="relative">
          <button 
            onClick={() => setShowEditModal(!showEditModal)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Edit Dashboard
          </button>
          
          {/* Edit Dashboard Modal */}
          {showEditModal && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-md shadow-2xl border border-gray-300 z-50">
              <div className="p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Dashboard Sections</h3>
                <div className="space-y-2">
                  {Object.entries(dashboardSections).map(([section, isVisible]) => (
                    <label key={section} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isVisible}
                        onChange={() => handleSectionToggle(section)}
                        className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                      />
                      <span className="text-sm text-gray-700 capitalize">
                        {section === 'salesActivity' ? 'Sales Activity' : 
                         section === 'businessDetails' ? 'Business Details' : 
                         section}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Financial Overview - Full Width */}
      {dashboardSections.financial && (
        <div>
          <div className="bg-white rounded-md flex flex-col border border-gray-300">
            {/* Top Bar */}
            <div className="flex items-center justify-between px-4 py-2 bg-gray-50 rounded-t-lg border-b border-gray-100">
              <h2 className="text-base font-semibold text-gray-900">Financial Overview</h2>
              <div className="flex space-x-2">
                <button className="p-1 rounded hover:bg-gray-200" title="Settings">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </button>
              </div>
            </div>
            {/* Content */}
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 divide-x divide-gray-200">
                {financialMetrics.map((metric, i) => (
                  <div key={metric.name} className="flex flex-col items-start justify-center p-3">
                    <p className="text-sm font-medium text-gray-600 mb-1">{metric.name}</p>
                    <div className="flex items-center gap-2">
                      <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                      <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        metric.changeType === 'positive' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {metric.changeType === 'positive' ? (
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1v-5a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586l-4.293-4.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" clipRule="evenodd" />
                          </svg>
                        )}
                        {metric.change}
                      </div>
                    </div>
                  </div>
                ))}
                </div>
            </div>
          </div>
        </div>
      )}

      {/* Notifications and Sales Activities - Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notifications */}
        {dashboardSections.notifications && (
          <div>
            <div className="bg-white rounded-md flex flex-col h-[280px] border border-gray-300">
              {/* Top Bar */}
              <div className="flex items-center justify-between px-4 py-2 bg-gray-50 rounded-t-lg border-b border-gray-100">
                <h2 className="text-base font-semibold text-gray-900">Notifications</h2>
                <div className="flex space-x-2">
                  <button className="p-1 rounded hover:bg-gray-200" title="Settings">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
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
                  ))
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <div className="text-center">
                      <svg className="w-8 h-8 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                      <p className="text-sm">No notifications</p>
                    </div>
                  </div>
                )}
              </div>
              {/* Footer */}
              <div className="px-4 py-2 bg-gray-50 rounded-b-lg border-t border-gray-100 flex items-center justify-end">
                <a href="/notifications" className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
                  Go to Notifications
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Sales Activities */}
        {dashboardSections.salesActivity && (
                <div>
            <div className="bg-white rounded-md flex flex-col h-[280px] border border-gray-300">
              {/* Top Bar */}
              <div className="flex items-center justify-between px-4 py-2 bg-gray-50 rounded-t-lg border-b border-gray-100">
                <h2 className="text-base font-semibold text-gray-900">Sales Activities</h2>
                <div className="flex space-x-2">
                  <button className="p-1 rounded hover:bg-gray-200" title="Add Lead">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </button>
                  <button className="p-1 rounded hover:bg-gray-200" title="Settings">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </button>
                </div>
              </div>
              {/* Content */}
              <div className="flex-1 p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-900">New Leads</span>
                    </div>
                    <span className="text-lg font-bold text-gray-900">12</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-900">Active Deals</span>
                    </div>
                    <span className="text-lg font-bold text-gray-900">8</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-900">Pending Quotes</span>
                    </div>
                    <span className="text-lg font-bold text-gray-900">5</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-900">This Month Revenue</span>
                    </div>
                    <span className="text-lg font-bold text-gray-900">$45K</span>
                  </div>
                </div>
              </div>
              {/* Footer */}
              <div className="px-4 py-2 bg-gray-50 rounded-b-lg border-t border-gray-100 flex items-center justify-end">
                <a href="/sales" className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
                  Go to CRM
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </div>
            </div>
        </div>
        )}
      </div>

      {/* Marketing Releases and Team Holidays */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Marketing Releases */}
        {dashboardSections.marketing && (
          <div>
            <div className="bg-white rounded-md flex flex-col h-[280px] border border-gray-300">
              {/* Top Bar */}
              <div className="flex items-center justify-between px-4 py-2 bg-gray-50 rounded-t-lg border-b border-gray-100">
                <h2 className="text-base font-semibold text-gray-900">Upcoming Marketing Releases</h2>
                {/* Options (add, calendar, filter) */}
                <div className="flex space-x-2">
                  <button className="p-1 rounded hover:bg-gray-200" title="Add Event">
                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </button>
                  <button className="p-1 rounded hover:bg-gray-200" title="View Calendar">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </button>
                  <button className="p-1 rounded hover:bg-gray-200" title="Filter">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707l-6.414 6.414A1 1 0 0013 13.414V19a1 1 0 01-1.447.894l-4-2A1 1 0 017 17v-3.586a1 1 0 00-.293-.707L3.293 6.707A1 1 0 013 6V4z" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
                {loading ? (
                  [1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between p-4 animate-pulse">
        <div>
                        <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-24"></div>
                      </div>
                      <div className="h-6 bg-gray-200 rounded w-16"></div>
                    </div>
                  ))
                ) : marketingEvents.length > 0 ? (
                  marketingEvents.map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-4">
                  <div>
                        <h4 className="text-sm font-medium text-gray-900">{event.title}</h4>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(event.event_date).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })}
                        </p>
                        {event.description && (
                          <p className="text-xs text-gray-500 mt-1 truncate max-w-48">{event.description}</p>
                        )}
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          event.status === 'published' ? 'bg-green-100 text-green-800' :
                          event.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                          {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                  </span>
                </div>
                  ))
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <div className="text-center">
                      <svg className="w-8 h-8 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-sm">No upcoming events</p>
                    </div>
                  </div>
                )}
              </div>
              {/* Footer */}
              <div className="px-4 py-2 bg-gray-50 rounded-b-lg border-t border-gray-100 flex items-center justify-end">
                <a href="/marketing/events" className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
                  Go to Events Calendar
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Team Holidays */}
        {dashboardSections.holidays && (
        <div>
            <div className="bg-white rounded-md flex flex-col h-[280px] border border-gray-300">
              {/* Top Bar */}
              <div className="flex items-center justify-between px-4 py-2 bg-gray-50 rounded-t-lg border-b border-gray-100">
                <h2 className="text-base font-semibold text-gray-900">Team Holidays</h2>
                <div className="flex space-x-2">
                  <button className="p-1 rounded hover:bg-gray-200" title="Add Holiday">
                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </button>
                  <button className="p-1 rounded hover:bg-gray-200" title="Filter">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707l-6.414 6.414A1 1 0 0013 13.414V19a1 1 0 01-1.447.894l-4-2A1 1 0 017 17v-3.586a1 1 0 00-.293-.707L3.293 6.707A1 1 0 013 6V4z" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
                {teamHolidays.length > 0 ? (
                  teamHolidays.map((holiday, index) => (
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
                  ))
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <div className="text-center">
                      <svg className="w-8 h-8 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-sm">No holidays</p>
            </div>
          </div>
                )}
              </div>
              {/* Footer */}
              <div className="px-4 py-2 bg-gray-50 rounded-b-lg border-t border-gray-100 flex items-center justify-end">
                <a href="/hr/holiday" className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
                  Go to Holidays
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </div>
            </div>
              </div>
        )}
            </div>

      {/* No dashboard components selected */}
      {Object.values(dashboardSections).every(v => !v) && (
        <div className="flex items-center justify-center min-h-[220px]">
          <div className="bg-white rounded-md shadow flex flex-col items-center justify-center w-full max-w-2xl mx-auto p-12 border border-gray-100">
            <svg className="w-12 h-12 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2a4 4 0 018 0v2M9 17a4 4 0 01-8 0v-2a4 4 0 018 0v2zm0 0v2a4 4 0 008 0v-2m0 0a4 4 0 01-8 0" />
                </svg>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">No Dashboard Components Selected</h2>
            <p className="text-gray-500 text-center">Select at least one component to display your dashboard.</p>
            </div>
        </div>
      )}

      {/* Notification Modal */}
      {showNotificationModal && (
        <NotificationModal />
      )}
    </div>
  );
};

export default Dashboard; 