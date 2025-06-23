import React from 'react';
import TopNav from './TopNav';
import SideNav from './SideNav';
import Footer from './Footer';

const MainLayout = ({ 
  children, 
  tabs, 
  activeTab, 
  onTabChange, 
  subTabs, 
  activeSubTab, 
  onSubTabChange, 
  showSideNav = true,
  onCreateOrganization,
  onJoinOrganization
}) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <TopNav 
        onTabChange={onTabChange} 
        onCreateOrganization={onCreateOrganization}
        onJoinOrganization={onJoinOrganization}
      />
      
      <div className="flex flex-1">
        {showSideNav && tabs && (
          <SideNav 
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={onTabChange}
            subTabs={subTabs}
            activeSubTab={activeSubTab}
            onSubTabChange={onSubTabChange}
          />
        )}
        
        <div className="flex-1 flex flex-col">
          <main className="flex-1">
            <div className="px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </div>
          </main>
          
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default MainLayout; 