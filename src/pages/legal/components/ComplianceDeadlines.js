import React, { useState, useEffect } from 'react';
import { PlusIcon, TrashIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { getComplianceDeadlines, createComplianceDeadline, updateComplianceDeadline, deleteComplianceDeadline } from '../../../services/legalService';
import { useAuth } from '../../../contexts/AuthContext';
import { supabase } from '../../../lib/supabase';

const ComplianceDeadlines = () => {
  const { currentOrganization } = useAuth();
  const [deadlines, setDeadlines] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDeadline, setNewDeadline] = useState({ name: '', description: '', dueDate: '', category: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadDeadlines();
  }, [currentOrganization]);

  const loadDeadlines = async () => {
    if (!currentOrganization?.organization_id) {
      console.warn('No organization_id found in currentOrganization:', currentOrganization);
      setDeadlines([]);
      setLoading(false);
      return;
    }
    try {
      // TEMP: Direct select instead of RPC
      const { data, error } = await supabase
        .from('legal_compliance_deadlines')
        .select('*')
        .eq('organization_id', currentOrganization.organization_id);
      console.log('Current org ID:', currentOrganization.organization_id, typeof currentOrganization.organization_id);
      console.log('Fetched deadlines:', data);
      const filtered = (data || []).filter(
        d => d.organization_id === currentOrganization.organization_id
      );
      setDeadlines(filtered);
    } catch (error) {
      console.error('Error loading deadlines:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDeadline = async (e) => {
    e.preventDefault();
    if (!newDeadline.name || !newDeadline.dueDate) {
      alert('Please fill in all required fields');
      return;
    }

    setSaving(true);
    try {
      const deadlineData = {
        name: newDeadline.name,
        description: newDeadline.description,
        due_date: newDeadline.dueDate,
        category: newDeadline.category || 'general',
        organization_id: currentOrganization?.organization_id
      };

      await createComplianceDeadline(deadlineData);
      await loadDeadlines();
      setNewDeadline({ name: '', description: '', dueDate: '', category: '' });
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding deadline:', error);
      alert('Error adding deadline. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteDeadline = async (id) => {
    if (window.confirm('Are you sure you want to delete this deadline?')) {
      try {
        await deleteComplianceDeadline(id);
        await loadDeadlines();
      } catch (error) {
        console.error('Error deleting deadline:', error);
        alert('Error deleting deadline. Please try again.');
      }
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateComplianceDeadline(id, { status: newStatus });
      await loadDeadlines();
    } catch (error) {
      console.error('Error updating deadline status:', error);
      alert('Error updating deadline status. Please try again.');
    }
  };

  const filteredDeadlines = deadlines.filter(d =>
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status, isOverdue) => {
    if (isOverdue) return 'bg-red-100 text-red-800';
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDaysUntilDueText = (daysUntilDue, isOverdue) => {
    if (isOverdue) return `${Math.abs(daysUntilDue)} days overdue`;
    if (daysUntilDue === 0) return 'Due today';
    if (daysUntilDue === 1) return 'Due tomorrow';
    if (daysUntilDue < 0) return `${Math.abs(daysUntilDue)} days ago`;
    return `${daysUntilDue} days remaining`;
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold leading-tight text-gray-900">Compliance Deadlines</h2>
          <p className="text-sm text-gray-500 mt-1">Track upcoming legal and regulatory deadlines to stay compliant.</p>
        </div>
        <div className="text-center py-20">
          <p className="text-gray-500">Loading deadlines...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold leading-tight text-gray-900">Compliance Deadlines</h2>
        <p className="text-sm text-gray-500 mt-1">Track upcoming legal and regulatory deadlines to stay compliant.</p>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex-1 relative max-w-xs">
          <MagnifyingGlassIcon className="pointer-events-none absolute top-2.5 left-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search deadlines..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          {showAddForm ? 'Cancel' : 'Add New Deadline'}
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Add New Compliance Deadline</h3>
          <form onSubmit={handleAddDeadline} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="deadlineName" className="block text-sm font-medium text-gray-700">Deadline Name *</label>
                <input
                  type="text"
                  id="deadlineName"
                  value={newDeadline.name}
                  onChange={(e) => setNewDeadline({ ...newDeadline, name: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="deadlineCategory" className="block text-sm font-medium text-gray-700">Category</label>
                <select
                  id="deadlineCategory"
                  value={newDeadline.category}
                  onChange={(e) => setNewDeadline({ ...newDeadline, category: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select category</option>
                  <option value="annual_filing">Annual Filing</option>
                  <option value="tax_return">Tax Return</option>
                  <option value="regulatory">Regulatory</option>
                  <option value="contract_renewal">Contract Renewal</option>
                  <option value="insurance">Insurance</option>
                  <option value="general">General</option>
                </select>
              </div>
            </div>
            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">Due Date *</label>
              <input
                type="date"
                id="dueDate"
                value={newDeadline.dueDate}
                onChange={(e) => setNewDeadline({ ...newDeadline, dueDate: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                id="description"
                value={newDeadline.description}
                onChange={(e) => setNewDeadline({ ...newDeadline, description: e.target.value })}
                rows={3}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Add any additional details about this deadline..."
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? 'Adding...' : 'Add Deadline'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Deadline
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Due Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredDeadlines.map(deadline => (
              <tr key={deadline.id} className={deadline.is_overdue ? 'bg-red-50' : ''}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{deadline.name}</div>
                  {deadline.description && (
                    <div className="text-sm text-gray-500">{deadline.description}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {new Date(deadline.due_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                  <div className="text-sm text-gray-500">
                    {getDaysUntilDueText(deadline.days_until_due, deadline.is_overdue)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={deadline.status}
                    onChange={(e) => handleStatusChange(deadline.id, e.target.value)}
                    className={`text-sm font-medium rounded-full px-2.5 py-0.5 ${getStatusColor(deadline.status, deadline.is_overdue)}`}
                  >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="overdue">Overdue</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {deadline.category ? deadline.category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'General'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleDeleteDeadline(deadline.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredDeadlines.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No deadlines found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComplianceDeadlines; 