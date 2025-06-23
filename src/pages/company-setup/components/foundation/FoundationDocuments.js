import React, { useState, useEffect, useRef, useCallback } from 'react';
import { CheckCircleIcon, LinkIcon, ArrowUpOnSquareIcon, DocumentTextIcon, BuildingOfficeIcon } from '@heroicons/react/20/solid';
import { useAuth } from '../../../../contexts/AuthContext';
import { getCompanyProfile, upsertCompanyProfile } from '../../../../services/legalService';
import { supabase } from '../../../../lib/supabase';

// Modal components moved outside to prevent re-creation
const CompanyNamePopup = ({ 
  companyName, setCompanyName, logoUrl, fileInputRef, handleLogoUpload, 
  handleCompanyNameSubmit, setShowCompanyPopup 
}) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 w-96">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Enter Company Name & Logo</h3>
      <form onSubmit={handleCompanyNameSubmit}>
        <div className="flex flex-col items-center mb-4">
          <div className="mb-2 w-24 h-24 flex items-center justify-center bg-gray-100 rounded-full overflow-hidden">
            {logoUrl ? (
              <img src={logoUrl} alt="Company Logo" className="object-contain w-full h-full" />
            ) : (
              <span className="text-gray-400 text-2xl font-bold">Logo</span>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleLogoUpload}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
            className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-xs hover:bg-blue-700"
          >
            {logoUrl ? 'Change Logo' : 'Upload Logo'}
          </button>
        </div>
        <input
          type="text"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          placeholder="Enter your company name..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          autoFocus
        />
        <div className="mt-4 flex justify-end space-x-2">
          <button
            type="button"
            onClick={() => setShowCompanyPopup(false)}
            className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  </div>
);

const CompanyNumberPopup = ({ 
  companyNumber, setCompanyNumber, incorporationDate, setIncorporationDate,
  handleCompanyNumberSubmit, setShowCompanyNumberPopup 
}) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 w-96">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Company Number & Incorporation Date</h3>
      <form onSubmit={handleCompanyNumberSubmit}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company Number</label>
            <input
              type="text"
              value={companyNumber}
              onChange={(e) => setCompanyNumber(e.target.value)}
              placeholder="e.g., 12345678"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Incorporation Date</label>
            <input
              type="date"
              value={incorporationDate}
              onChange={(e) => setIncorporationDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="mt-4 flex justify-end space-x-2">
          <button
            type="button"
            onClick={() => setShowCompanyNumberPopup(false)}
            className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  </div>
);

const OfficePopup = ({ 
  registeredOffice, setRegisteredOffice, website, setWebsite, contactEmail, setContactEmail,
  linkedinProfile, setLinkedinProfile,
  handleOfficeSubmit, setShowOfficePopup 
}) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 w-96">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Registered Office & Contact Info</h3>
      <form onSubmit={handleOfficeSubmit}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Registered Office</label>
            <textarea
              value={registeredOffice}
              onChange={(e) => setRegisteredOffice(e.target.value)}
              placeholder="Full address..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
            <input
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="www.yourcompany.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
            <input
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              placeholder="hello@yourcompany.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn Profile</label>
            <input
              type="url"
              value={linkedinProfile}
              onChange={(e) => setLinkedinProfile(e.target.value)}
              placeholder="https://linkedin.com/company/yourcompany"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="mt-4 flex justify-end space-x-2">
          <button
            type="button"
            onClick={() => setShowOfficePopup(false)}
            className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  </div>
);

const BankPopup = ({ 
  bankProvider, setBankProvider, bankAccountOpened, setBankAccountOpened,
  handleBankSubmit, setShowBankPopup 
}) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 w-96">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Business Bank Account</h3>
      <form onSubmit={handleBankSubmit}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bank Provider</label>
            <input
              type="text"
              value={bankProvider}
              onChange={(e) => setBankProvider(e.target.value)}
              placeholder="e.g., Barclays Bank"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Account Opened Date</label>
            <input
              type="date"
              value={bankAccountOpened}
              onChange={(e) => setBankAccountOpened(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="mt-4 flex justify-end space-x-2">
          <button
            type="button"
            onClick={() => setShowBankPopup(false)}
            className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  </div>
);

const VatPopup = ({ 
  vatNumber, setVatNumber, handleVatSubmit, setShowVatPopup 
}) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 w-96">
      <h3 className="text-lg font-medium text-gray-900 mb-4">VAT Registration</h3>
      <form onSubmit={handleVatSubmit}>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">VAT Number</label>
          <input
            type="text"
            value={vatNumber}
            onChange={(e) => setVatNumber(e.target.value)}
            placeholder="e.g., GB123456789"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
        </div>
        <div className="mt-4 flex justify-end space-x-2">
          <button
            type="button"
            onClick={() => setShowVatPopup(false)}
            className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  </div>
);

const FoundationDocuments = () => {
  const { currentOrganization } = useAuth();
  const [showCompanyPopup, setShowCompanyPopup] = useState(false);
  const [showCompanyNumberPopup, setShowCompanyNumberPopup] = useState(false);
  const [showOfficePopup, setShowOfficePopup] = useState(false);
  const [showBankPopup, setShowBankPopup] = useState(false);
  const [showVatPopup, setShowVatPopup] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [companyNumber, setCompanyNumber] = useState('');
  const [incorporationDate, setIncorporationDate] = useState('');
  const [registeredOffice, setRegisteredOffice] = useState('');
  const [website, setWebsite] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [linkedinProfile, setLinkedinProfile] = useState('');
  const [vatNumber, setVatNumber] = useState('');
  const [bankProvider, setBankProvider] = useState('');
  const [bankAccountOpened, setBankAccountOpened] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const fileInputRef = useRef();
  
  const [checklist, setChecklist] = useState([
    { step: 'Company Name & Logo', description: 'Set your legal company name and upload your logo.', hasUpload: true, uploadType: 'logo', completed: false, popup: 'companyName' },
    { step: 'Company Number & Incorporation Date', description: 'Record the Companies House number and date of incorporation.', completed: false, popup: 'companyNumber' },
    { step: 'Registered Office & Contact Info', description: 'Store your legal address, website, and contact emails.', completed: false, popup: 'office' },
    { step: 'Articles of Association', description: "Upload your articles and confirm they're accessible to the team.", hasUpload: true, uploadType: 'document', completed: false },
    { step: 'Shareholders & Cap Table', description: 'Ensure initial shareholders are logged and cap table is added.', hasLink: true, linkText: 'View Cap Table', linkTo: '/cap-table', completed: false },
    { step: 'Founder Agreements', description: 'Upload signed founder agreements or SAFEs if applicable.', hasUpload: true, uploadType: 'document', completed: false },
    { step: 'IP Assignment', description: 'Confirm IP assignment agreements are in place for founders and early team.', hasUpload: true, uploadType: 'document', completed: false },
    { step: 'NDAs', description: 'Add template NDAs for future use and upload any executed ones.', hasUpload: true, uploadType: 'document', completed: false },
    { step: 'Business Bank Account', description: 'Record banking provider and date account was opened.', completed: false, popup: 'bank' },
    { step: 'VAT Registration', description: 'Track your VAT registration number and effective date.', completed: false, popup: 'vat' },
    { step: 'Insurance', description: 'Upload insurance docs (public liability, employer liability, cyber etc).', hasUpload: true, uploadType: 'policy', completed: false },
    { step: 'Board Structure', description: 'Define board members and roles. Upload board meeting template.', hasUpload: true, uploadType: 'document', completed: false },
    { step: 'Org Chart', description: 'Add your org chart for internal visibility.', hasUpload: true, uploadType: 'image/file', completed: false },
    { step: "Founders' Equity Vesting", description: "Record any equity vesting schedules in place.", hasLink: true, linkText: 'Link to Cap Table', linkTo: '/cap-table', completed: false },
    { step: 'Compliance Deadlines', description: 'Add reminders for annual filings, confirmation statements, and accounts.', hasLink: true, linkText: 'Add to calendar', linkTo: '#', completed: false },
  ]);

  // Calculate progress percentage
  const completedSteps = checklist.filter(item => item.completed).length;
  const totalSteps = checklist.length;
  const progressPercentage = Math.round((completedSteps / totalSteps) * 100);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!currentOrganization?.organization_id) return;
      const data = await getCompanyProfile(currentOrganization.organization_id);
      if (data) {
        setCompanyName(data.name || '');
        setCompanyNumber(data.company_number || '');
        setIncorporationDate(data.incorporation_date || '');
        setRegisteredOffice(data.registered_office || '');
        setWebsite(data.website || '');
        setContactEmail(data.contact_email || '');
        setVatNumber(data.vat_number || '');
        setBankProvider(data.bank_provider || '');
        setBankAccountOpened(data.bank_account_opened || '');
        setLogoUrl(data.logo_url || '');
        setLinkedinProfile(data.linkedin_profile || '');
        
        // Set initial checklist completion based on fetched data
        setChecklist((prev) => prev.map((item, idx) => {
          switch (idx) {
            case 0: // Company Name & Logo
              return { ...item, completed: !!(data.name && data.logo_url) };
            case 1: // Company Number & Incorporation Date
              return { ...item, completed: !!(data.company_number && data.incorporation_date) };
            case 2: // Registered Office & Contact Info
              return { ...item, completed: !!(data.registered_office && data.website && data.contact_email) };
            case 8: // Business Bank Account
              return { ...item, completed: !!(data.bank_provider && data.bank_account_opened) };
            case 9: // VAT Registration
              return { ...item, completed: !!data.vat_number };
            default:
              return item;
          }
        }));
      }
    };
    fetchProfile();
  }, [currentOrganization]);

  const handleToggleComplete = useCallback((index) => {
    setChecklist((prev) => {
      const newChecklist = [...prev];
      newChecklist[index].completed = !newChecklist[index].completed;
      return newChecklist;
    });
  }, []);

  const handleStepClick = useCallback((index) => {
    const item = checklist[index];
    if (item.popup) {
      switch (item.popup) {
        case 'companyName':
          setShowCompanyPopup(true);
          break;
        case 'companyNumber':
          setShowCompanyNumberPopup(true);
          break;
        case 'office':
          setShowOfficePopup(true);
          break;
        case 'bank':
          setShowBankPopup(true);
          break;
        case 'vat':
          setShowVatPopup(true);
          break;
        default:
          break;
      }
    }
  }, []);

  const handleCompanyNameSubmit = async (e) => {
    e?.preventDefault();
    if (!companyName.trim() || !currentOrganization?.organization_id) return;
    await upsertCompanyProfile({ organization_id: currentOrganization.organization_id, name: companyName });
    setChecklist((prev) => {
      const newChecklist = [...prev];
      newChecklist[0].completed = !!(companyName && logoUrl);
      return newChecklist;
    });
    setShowCompanyPopup(false);
  };

  const handleCompanyNumberSubmit = async (e) => {
    e?.preventDefault();
    if (!companyNumber.trim() || !incorporationDate || !currentOrganization?.organization_id) return;
    await upsertCompanyProfile({ organization_id: currentOrganization.organization_id, company_number: companyNumber, incorporation_date: incorporationDate });
    setChecklist((prev) => {
      const newChecklist = [...prev];
      newChecklist[1].completed = true;
      return newChecklist;
    });
    setShowCompanyNumberPopup(false);
  };

  const handleOfficeSubmit = async (e) => {
    e?.preventDefault();
    if (!registeredOffice.trim() || !website.trim() || !contactEmail.trim() || !currentOrganization?.organization_id) return;
    await upsertCompanyProfile({ organization_id: currentOrganization.organization_id, registered_office: registeredOffice, website, contact_email: contactEmail, linkedin_profile: linkedinProfile });
    setChecklist((prev) => {
      const newChecklist = [...prev];
      newChecklist[2].completed = true;
      return newChecklist;
    });
    setShowOfficePopup(false);
  };

  const handleBankSubmit = async (e) => {
    e?.preventDefault();
    if (!bankProvider.trim() || !bankAccountOpened || !currentOrganization?.organization_id) return;
    await upsertCompanyProfile({ organization_id: currentOrganization.organization_id, bank_provider: bankProvider, bank_account_opened: bankAccountOpened });
    setChecklist((prev) => {
      const newChecklist = [...prev];
      newChecklist[8].completed = true;
      return newChecklist;
    });
    setShowBankPopup(false);
  };

  const handleVatSubmit = async (e) => {
    e?.preventDefault();
    if (!vatNumber.trim() || !currentOrganization?.organization_id) return;
    await upsertCompanyProfile({ organization_id: currentOrganization.organization_id, vat_number: vatNumber });
    setChecklist((prev) => {
      const newChecklist = [...prev];
      newChecklist[9].completed = true;
      return newChecklist;
    });
    setShowVatPopup(false);
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !currentOrganization?.organization_id) return;
    const fileExt = file.name.split('.').pop();
    const filePath = `${currentOrganization.organization_id}/logo.${fileExt}`;
    const { data: uploadData, error: uploadError } = await supabase.storage.from('company-logos').upload(filePath, file, { upsert: true });
    if (uploadError) {
      alert('Error uploading logo: ' + uploadError.message);
      return;
    }
    const { data: publicUrlData, error: urlError } = supabase.storage.from('company-logos').getPublicUrl(filePath);
    if (urlError || !publicUrlData?.publicUrl) {
      alert('Error getting logo URL');
      return;
    }
    const publicUrl = publicUrlData.publicUrl;
    setLogoUrl(publicUrl);
    await upsertCompanyProfile({ organization_id: currentOrganization.organization_id, logo_url: publicUrl });
  };

  const OrgChart = () => (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
      <h3 className="text-sm font-medium text-gray-800 mb-2">Org Chart</h3>
      <p className="text-sm text-gray-700">
        Org chart content will be displayed here.
      </p>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">Company Setup Wizard</h2>
        <p className="mt-1 text-sm text-gray-600">
          Complete your company setup step by step.
        </p>
      </div>

      {/* Progress Bar */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Setup Progress</h3>
          <span className="text-sm font-medium text-gray-600">{progressPercentage}% Complete</span>
        </div>
        
        {/* Overall Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-green-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Wizard Content */}
      <div className="p-6">
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-800 mb-2">Quick Setup</h3>
            <p className="text-sm text-blue-700 mb-3">
              Click on any step to complete it. Some steps will open forms to collect information.
            </p>
            <button
              onClick={() => setShowCompanyPopup(true)}
              className="text-sm text-blue-600 hover:text-blue-800 underline"
            >
              Start with Company Name →
            </button>
          </div>

          <div className="space-y-3">
            {checklist.map((item, index) => (
              <div
                key={item.step}
                className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${
                  item.completed ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                }`}
                onClick={() => handleStepClick(index)}
              >
                <div className="flex items-center space-x-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleComplete(index);
                    }}
                    className={`flex-shrink-0 ${
                      item.completed ? 'text-green-600' : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    <CheckCircleIcon className="h-6 w-6" />
                  </button>
                  <div>
                    <h4 className={`text-sm font-medium ${item.completed ? 'text-green-800' : 'text-gray-900'}`}>
                      {item.step}
                    </h4>
                    <p className={`text-sm ${item.completed ? 'text-green-700' : 'text-gray-600'}`}>
                      {item.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {item.hasUpload && (
                    <button 
                      onClick={(e) => e.stopPropagation()}
                      className="text-sm text-gray-600 hover:text-gray-800 flex items-center space-x-1"
                    >
                      <ArrowUpOnSquareIcon className="h-4 w-4" />
                      <span>Upload</span>
                    </button>
                  )}
                  {item.hasLink && (
                    <a 
                      href={item.linkTo} 
                      onClick={(e) => e.stopPropagation()}
                      className="text-sm text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                    >
                      <LinkIcon className="h-4 w-4" />
                      <span>{item.linkText}</span>
                    </a>
                  )}
                  {item.popup && (
                    <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                      Click to edit
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showCompanyPopup && <CompanyNamePopup 
        companyName={companyName}
        setCompanyName={setCompanyName}
        logoUrl={logoUrl}
        fileInputRef={fileInputRef}
        handleLogoUpload={handleLogoUpload}
        handleCompanyNameSubmit={handleCompanyNameSubmit}
        setShowCompanyPopup={setShowCompanyPopup}
      />}
      {showCompanyNumberPopup && <CompanyNumberPopup 
        companyNumber={companyNumber}
        setCompanyNumber={setCompanyNumber}
        incorporationDate={incorporationDate}
        setIncorporationDate={setIncorporationDate}
        handleCompanyNumberSubmit={handleCompanyNumberSubmit}
        setShowCompanyNumberPopup={setShowCompanyNumberPopup}
      />}
      {showOfficePopup && <OfficePopup 
        registeredOffice={registeredOffice}
        setRegisteredOffice={setRegisteredOffice}
        website={website}
        setWebsite={setWebsite}
        contactEmail={contactEmail}
        setContactEmail={setContactEmail}
        linkedinProfile={linkedinProfile}
        setLinkedinProfile={setLinkedinProfile}
        handleOfficeSubmit={handleOfficeSubmit}
        setShowOfficePopup={setShowOfficePopup}
      />}
      {showBankPopup && <BankPopup 
        bankProvider={bankProvider}
        setBankProvider={setBankProvider}
        bankAccountOpened={bankAccountOpened}
        setBankAccountOpened={setBankAccountOpened}
        handleBankSubmit={handleBankSubmit}
        setShowBankPopup={setShowBankPopup}
      />}
      {showVatPopup && <VatPopup 
        vatNumber={vatNumber}
        setVatNumber={setVatNumber}
        handleVatSubmit={handleVatSubmit}
        setShowVatPopup={setShowVatPopup}
      />}
    </div>
  );
};

export default FoundationDocuments; 