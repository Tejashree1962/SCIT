import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Search, Filter, BarChart3, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import IssueCard from './IssueCard';

/*
  Plain JSX version (no TypeScript types) of the Dashboard component.
  Props:
    issues: Array of issue objects. Expected shape:
      {
        id: string,
        title: string,
        description: string,
        status: 'pending'|'in-progress'|'resolved'|'rejected',
        category: string,
        reportedBy: string (user id),
        reportedAt: string|Date,
        ... // other fields consumed by IssueCard
      }
    currentUser: {
      id: string,
      role: 'admin'|'user'|string
      ... // other user fields as needed
    }
    onUpdateStatus(issueId, newStatus)
    onResolve(issueId, resolutionPhotoUrl, notes)
*/

const Dashboard = ({ issues, currentUser, onUpdateStatus, onResolve }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | status values
  const [categoryFilter, setCategoryFilter] = useState('all'); // 'all' | category values

  // Filter issues based on user role
  const userIssues = useMemo(() => {
    return currentUser.role === 'admin'
      ? issues
      : issues.filter((issue) => issue.reportedBy === currentUser.id);
  }, [issues, currentUser]);

  // Apply filters
  const filteredIssues = useMemo(() => {
    return userIssues.filter((issue) => {
      const matchesSearch =
        (issue.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (issue.description || '').toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all' || issue.status === statusFilter;
      const matchesCategory =
        categoryFilter === 'all' || issue.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [userIssues, searchTerm, statusFilter, categoryFilter]);

  // Statistics
  const stats = useMemo(() => {
    const total = userIssues.length;
    const pending = userIssues.filter((i) => i.status === 'pending').length;
    const inProgress = userIssues.filter((i) => i.status === 'in-progress').length;
    const resolved = userIssues.filter((i) => i.status === 'resolved').length;
    const rejected = userIssues.filter((i) => i.status === 'rejected').length;

    return { total, pending, inProgress, resolved, rejected };
  }, [userIssues]);

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'garbage', label: '🗑️ Garbage/Waste' },
    { value: 'pothole', label: '🕳️ Pothole' },
    { value: 'dirty-toilet', label: '🚽 Dirty Toilet' },
    { value: 'street-light', label: '💡 Street Light' },
    { value: 'water-leak', label: '💧 Water Leak' },
    { value: 'broken-sign', label: '🪧 Broken Sign' },
    { value: 'other', label: '📝 Other' },
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'rejected', label: 'Rejected' },
  ];

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {currentUser.role === 'admin' ? 'Admin Dashboard' : 'My Reports'}
        </h1>
        <p className="text-gray-600">
          {currentUser.role === 'admin'
            ? 'Monitor and manage all civic issues reported in the system'
            : 'Track the status of your reported civic issues'}
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <BarChart3 className="w-5 h-5 text-gray-500 mr-2" />
            <div>
              <p className="text-sm font-medium text-gray-600">Total Issues</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-yellow-500 mr-2" />
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <TrendingUp className="w-5 h-5 text-blue-500 mr-2" />
            <div>
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
            <div>
              <p className="text-sm font-medium text-gray-600">Resolved</p>
              <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-5 h-5 bg-red-500 rounded mr-2"></div>
            <div>
              <p className="text-sm font-medium text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search issues..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="sm:w-40">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div className="sm:w-48">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              {categoryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
          <span className="text-sm text-gray-600">
            Showing {filteredIssues.length} of {userIssues.length} issues
          </span>
          {(searchTerm || statusFilter !== 'all' || categoryFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setCategoryFilter('all');
              }}
              className="text-sm text-sky-600 hover:text-sky-700 font-medium"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Issues List */}
      {filteredIssues.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <Filter className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No issues found</h3>
          <p className="text-gray-500">
            {searchTerm || statusFilter !== 'all' || categoryFilter !== 'all'
              ? 'Try adjusting your filters or search terms'
              : currentUser.role === 'admin'
              ? 'No issues have been reported yet'
              : "You haven't reported any issues yet"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredIssues
            .slice() // copy before sort to avoid mutating memoized array
            .sort((a, b) => new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime())
            .map((issue) => (
              <IssueCard
                key={issue.id}
                issue={issue}
                currentUser={currentUser}
                onUpdateStatus={onUpdateStatus}
                onResolve={onResolve}
              />
            ))}
        </div>
      )}
    </div>
  );
};

Dashboard.propTypes = {
  issues: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    status: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    reportedBy: PropTypes.string.isRequired,
    reportedAt: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  })).isRequired,
  currentUser: PropTypes.shape({
    id: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
  }).isRequired,
  onUpdateStatus: PropTypes.func.isRequired,
  onResolve: PropTypes.func.isRequired,
};

export default Dashboard;
