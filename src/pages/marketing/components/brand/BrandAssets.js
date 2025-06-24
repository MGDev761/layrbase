import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import { getBrandAssets, uploadBrandAsset, deleteBrandAsset, getBrandInformation, upsertBrandInformation, uploadBrandLogo } from '../../../../services/marketingService';
import { PencilIcon } from '@heroicons/react/24/outline';

const BrandAssets = () => {
  const { currentOrganization } = useAuth();
  const [brandInfo, setBrandInfo] = useState({
    tagline: '',
    brand_blurb: '',
    color_palette: ['#6366F1', '#8B5CF6', '#EC4899', '#F59E0B'],
    logo_url: ''
  });
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newAsset, setNewAsset] = useState({
    name: '',
    description: '',
    asset_type: 'logo'
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [showLogoUpload, setShowLogoUpload] = useState(false);
  const [logoFile, setLogoFile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [activeColorIndex, setActiveColorIndex] = useState(null);
  const [addingColor, setAddingColor] = useState(false);
  const [newColorValue, setNewColorValue] = useState('#000000');

  const assetTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'logo', label: 'Logos' },
    { value: 'icon', label: 'Icons' },
    { value: 'document', label: 'Documents' },
    { value: 'image', label: 'Images' }
  ];

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || asset.asset_type === filterType;
    return matchesSearch && matchesType;
  });

  useEffect(() => {
    if (currentOrganization?.organization_id) {
      loadData();
    }
  }, [currentOrganization]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [brandData, assetsData] = await Promise.all([
        getBrandInformation(currentOrganization.organization_id),
        getBrandAssets(currentOrganization.organization_id)
      ]);
      setBrandInfo(brandData);
      setAssets(assetsData);
    } catch (error) {
      console.error('Error loading brand data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveBrandInfo = async () => {
    try {
      setSaving(true);
      await upsertBrandInformation(brandInfo, currentOrganization.organization_id);
      alert('Brand information saved successfully!');
    } catch (error) {
      console.error('Error saving brand information:', error);
      alert('Failed to save brand information. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleUploadAsset = async () => {
    if (!selectedFile || !newAsset.name) return;

    try {
      setSaving(true);
      await uploadBrandAsset(selectedFile, newAsset, currentOrganization.organization_id);
      setShowUploadModal(false);
      setNewAsset({ name: '', description: '', asset_type: 'logo' });
      setSelectedFile(null);
      await loadData();
    } catch (error) {
      console.error('Error uploading asset:', error);
      alert('Failed to upload asset. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleUploadLogo = async () => {
    if (!logoFile) return;

    try {
      setSaving(true);
      const logoUrl = await uploadBrandLogo(logoFile, currentOrganization.organization_id);
      setBrandInfo(prev => ({ ...prev, logo_url: logoUrl }));
      setShowLogoUpload(false);
      setLogoFile(null);
      await loadData();
    } catch (error) {
      console.error('Error uploading logo:', error);
      alert('Failed to upload logo. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAsset = async (assetId) => {
    if (!window.confirm('Are you sure you want to delete this asset?')) return;

    try {
      await deleteBrandAsset(assetId);
      await loadData();
    } catch (error) {
      console.error('Error deleting asset:', error);
      alert('Failed to delete asset. Please try again.');
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const addColor = (color) => {
    setBrandInfo(prev => ({
      ...prev,
      color_palette: [...prev.color_palette, color]
    }));
  };

  const removeColor = (index) => {
    setBrandInfo(prev => ({
      ...prev,
      color_palette: prev.color_palette.filter((_, i) => i !== index)
    }));
  };

  const updateColor = (index, color) => {
    setBrandInfo(prev => ({
      ...prev,
      color_palette: prev.color_palette.map((c, i) => i === index ? color : c)
    }));
  };

  const handleUpdateColor = async (index, color) => {
    const updatedBrandInfo = {
      ...brandInfo,
      color_palette: brandInfo.color_palette.map((c, i) => i === index ? color : c)
    };
    setBrandInfo(updatedBrandInfo);
    try {
      setSaving(true);
      console.log('Saving brand info:', updatedBrandInfo);
      console.log('Organization ID:', currentOrganization.organization_id);
      const result = await upsertBrandInformation(updatedBrandInfo, currentOrganization.organization_id);
      console.log('Save result:', result);
      setActiveColorIndex(null);
      setAddingColor(false);
      setNewColorValue('#000000');
    } catch (error) {
      console.error('Error saving color:', error);
      alert('Failed to save color. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleAddColor = async (color) => {
    const updatedBrandInfo = {
      ...brandInfo,
      color_palette: [...brandInfo.color_palette, color]
    };
    setBrandInfo(updatedBrandInfo);
    try {
      setSaving(true);
      console.log('Saving brand info:', updatedBrandInfo);
      console.log('Organization ID:', currentOrganization.organization_id);
      const result = await upsertBrandInformation(updatedBrandInfo, currentOrganization.organization_id);
      console.log('Save result:', result);
      setActiveColorIndex(null);
      setAddingColor(false);
      setNewColorValue('#000000');
    } catch (error) {
      console.error('Error saving color:', error);
      alert('Failed to save color. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-10">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-500">Loading brand assets...</p>
      </div>
    );
  }

  return (
    <div>
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Brand Assets</h1>
        <p className="text-gray-600 text-sm mb-6">Manage your brand information, logo, color palette, and marketing assets.</p>
      </div>

      {/* Brand Information Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
        {/* Left: Logo + Tagline/Blurb */}
        <div className="bg-white shadow rounded-lg p-6 relative flex flex-col items-center">
          {/* Edit pencil (only for left box) */}
          <button
            className="absolute top-4 right-4 p-2 rounded hover:bg-gray-100 focus:outline-none"
            onClick={() => setEditing(!editing)}
            title={editing ? 'Cancel Edit' : 'Edit'}
          >
            <PencilIcon className="w-5 h-5 text-gray-400" />
          </button>
          {/* Logo with label */}
          <div className="flex flex-row items-center mb-8 w-full">
            <span className="text-xs font-semibold text-gray-500 mr-4 whitespace-nowrap">Main Logo</span>
            <div className="w-40 h-40 bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center relative overflow-hidden">
              {brandInfo.logo_url ? (
                <img src={brandInfo.logo_url} alt="Brand Logo" className="object-contain w-full h-full" />
              ) : (
                <svg className="w-16 h-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              )}
            </div>
          </div>
          {editing && (
            <button
              onClick={() => setShowLogoUpload(true)}
              className="mb-6 px-3 py-1 text-xs font-medium text-white bg-blue-600 rounded shadow hover:bg-blue-700 focus:outline-none"
            >
              {brandInfo.logo_url ? 'Change Logo' : 'Upload Logo'}
            </button>
          )}
          {/* Tagline & Blurb: label left, value right, same font, no box */}
          <div className="w-full space-y-4">
            {/* Tagline */}
            <div className="flex items-center">
              <span className="text-xs font-semibold text-gray-500 w-24">Tagline</span>
              {editing ? (
                <input
                  type="text"
                  value={brandInfo.tagline}
                  onChange={(e) => setBrandInfo({ ...brandInfo, tagline: e.target.value })}
                  className="flex-1 ml-4 px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                  placeholder="Your brand tagline"
                />
              ) : (
                <span className="flex-1 ml-4 text-base text-gray-900 min-h-[2.5rem]">{brandInfo.tagline || <span className="text-gray-400">No tagline set</span>}</span>
              )}
            </div>
            {/* Blurb */}
            <div className="flex items-center">
              <span className="text-xs font-semibold text-gray-500 w-24">Brand Description</span>
              {editing ? (
                <textarea
                  value={brandInfo.brand_blurb}
                  onChange={(e) => setBrandInfo({ ...brandInfo, brand_blurb: e.target.value })}
                  rows={2}
                  className="flex-1 ml-4 px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                  placeholder="Brief description of your brand"
                />
              ) : (
                <span className="flex-1 ml-4 text-base text-gray-900 min-h-[2.5rem]">{brandInfo.brand_blurb || <span className="text-gray-400">No description set</span>}</span>
              )}
            </div>
          </div>
          {editing && (
            <div className="mt-6 flex justify-end w-full">
              <button
                onClick={async () => { await handleSaveBrandInfo(); setEditing(false); }}
                disabled={saving}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Brand Information'}
              </button>
            </div>
          )}
        </div>
        {/* Right: Brand Colors - vertical, tall, gradient, hex at bottom left */}
        <div className="bg-white shadow rounded-lg p-6 flex flex-col">
          <label className="block text-sm font-medium text-gray-700 mb-4">Brand Colors</label>
          <div className="flex flex-row gap-4 items-end h-full">
            {brandInfo.color_palette.map((color, index) => (
              <div key={index} className="relative flex flex-col items-center group" style={{ minWidth: 80, width: 80, height: 240 }}>
                {/* Color swatch with gradient overlay */}
                <div
                  className="w-full h-full rounded-lg shadow border border-gray-200 flex flex-col justify-end relative cursor-pointer transition-transform group-hover:scale-105"
                  style={{ background: `linear-gradient(to bottom, ${color} 60%, #fff0 100%), ${color}` }}
                  onClick={() => setActiveColorIndex(index)}
                >
                  {/* HEX label/value at bottom left */}
                  <div className="absolute left-2 bottom-2 flex flex-col items-start">
                    <span className="text-[10px] text-white/80 font-bold tracking-wider">HEX</span>
                    <span className="text-xs text-white font-mono drop-shadow-sm">{color}</span>
                  </div>
                  {/* Color wheel and save/cancel in edit mode */}
                  {activeColorIndex === index && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 rounded-lg z-50">
                      <div className="bg-white rounded-lg p-4 shadow-lg relative z-50 transform -translate-x-20">
                        <input
                          type="color"
                          value={color}
                          onChange={e => setNewColorValue(e.target.value)}
                          className="w-16 h-16 border-2 border-white rounded-full shadow mb-3 mx-auto block"
                          autoFocus
                        />
                        <input
                          type="text"
                          value={newColorValue}
                          onChange={e => setNewColorValue(e.target.value)}
                          className="w-full px-2 py-1 text-xs border border-gray-300 rounded mb-3 text-center font-mono"
                          placeholder="#000000"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => { e.stopPropagation(); handleUpdateColor(index, newColorValue); }}
                            disabled={saving}
                            className="px-2 py-1 text-xs rounded bg-white text-gray-700 border border-gray-200 hover:bg-gray-100 disabled:opacity-50"
                          >
                            {saving ? 'Saving...' : 'Save'}
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); setActiveColorIndex(null); }}
                            className="px-2 py-1 text-xs rounded bg-gray-200 text-gray-700 border border-gray-300 hover:bg-gray-300"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); removeColor(index); setActiveColorIndex(null); }}
                            className="px-2 py-1 text-xs rounded bg-red-600 text-white border border-red-700 hover:bg-red-700"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {/* Add Color Box: always visible, click to open color picker + save/cancel */}
            <div className="relative flex flex-col items-center group" style={{ minWidth: 80, width: 80, height: 240 }}>
              <div
                className="w-full h-full rounded-lg shadow border-2 border-dashed border-gray-300 flex flex-col justify-center items-center cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => setAddingColor(true)}
              >
                <svg className="w-8 h-8 mb-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span className="text-xs text-gray-400">Add Color</span>
              </div>
              {addingColor && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 rounded-lg z-50">
                  <div className="bg-white rounded-lg p-4 shadow-lg relative z-50 transform -translate-x-20">
                    <input
                      type="color"
                      value={newColorValue}
                      onChange={e => setNewColorValue(e.target.value)}
                      className="w-16 h-16 border-2 border-white rounded-full shadow mb-3 mx-auto block"
                      autoFocus
                    />
                    <input
                      type="text"
                      value={newColorValue}
                      onChange={e => setNewColorValue(e.target.value)}
                      className="w-full px-2 py-1 text-xs border border-gray-300 rounded mb-3 text-center font-mono"
                      placeholder="#000000"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleAddColor(newColorValue); }}
                        disabled={saving}
                        className="px-2 py-1 text-xs rounded bg-white text-gray-700 border border-gray-200 hover:bg-gray-100 disabled:opacity-50"
                      >
                        {saving ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); setAddingColor(false); setNewColorValue('#000000'); }}
                        className="px-2 py-1 text-xs rounded bg-gray-200 text-gray-700 border border-gray-300 hover:bg-gray-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Assets Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-medium text-gray-900">Brand Assets</h2>
          <button
            onClick={() => setShowUploadModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            Upload Asset
          </button>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <svg className="absolute h-5 w-5 text-gray-400 left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search assets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {assetTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Assets Table */}
        <div className="overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Asset
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Size
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Uploaded
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAssets.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-16">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                      </div>
                      <p className="text-gray-500 text-sm">No brand assets uploaded yet.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredAssets.map((asset) => (
                  <tr key={asset.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {asset.file_type?.startsWith('image/') ? (
                            <img className="h-10 w-10 rounded object-cover" src={asset.file_path} alt={asset.name} />
                          ) : (
                            <div className="h-10 w-10 bg-gray-100 rounded flex items-center justify-center">
                              <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{asset.name}</div>
                          <div className="text-sm text-gray-500">{asset.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {asset.asset_type}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {formatFileSize(asset.file_size)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {new Date(asset.uploaded_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                      <a
                        href={asset.file_path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        Download
                      </a>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeleteAsset(asset.id); }}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Asset Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Upload Asset</h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Asset Name</label>
                <input
                  type="text"
                  value={newAsset.name}
                  onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter asset name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Asset Type</label>
                <select
                  value={newAsset.asset_type}
                  onChange={(e) => setNewAsset({ ...newAsset, asset_type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="logo">Logo</option>
                  <option value="icon">Icon</option>
                  <option value="document">Document</option>
                  <option value="image">Image</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description (Optional)</label>
                <textarea
                  value={newAsset.description}
                  onChange={(e) => setNewAsset({ ...newAsset, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Brief description of the asset"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">File</label>
                <input
                  type="file"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowUploadModal(false)}
                disabled={saving}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUploadAsset}
                disabled={saving || !selectedFile || !newAsset.name}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? 'Uploading...' : 'Upload Asset'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Logo Modal */}
      {showLogoUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Upload Logo</h3>
              <button
                onClick={() => setShowLogoUpload(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Logo File</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setLogoFile(e.target.files[0])}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowLogoUpload(false)}
                disabled={saving}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUploadLogo}
                disabled={saving || !logoFile}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? 'Uploading...' : 'Upload Logo'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrandAssets; 