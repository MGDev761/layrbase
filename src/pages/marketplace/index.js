import React, { useState, Fragment } from 'react';
import SubNav from '../../components/common/layout/SubNav';
import MyListing from './components/MyListing';
import MarketplaceListings from './components/MarketplaceListings';

const Marketplace = () => {
  const [activeSubTab, setActiveSubTab] = useState('marketplace');

  const subTabs = [
    { id: 'marketplace', name: 'Marketplace' },
    { id: 'my-listing', name: 'My Listing' },
  ];

  const renderContent = () => {
    switch (activeSubTab) {
      case 'marketplace':
        return <MarketplaceListings />;
      case 'my-listing':
        return <MyListing />;
      default:
        return <MarketplaceListings />;
    }
  };

  return (
    <Fragment>
      <SubNav
        subTabs={subTabs}
        activeSubTab={activeSubTab}
        onSubTabChange={setActiveSubTab}
      />
      <div className="mt-8">
        {renderContent()}
      </div>
    </Fragment>
  );
};

export default Marketplace; 