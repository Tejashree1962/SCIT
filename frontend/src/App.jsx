import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import IssueForm from './components/IssueForm';
import Dashboard from './components/Dashboard';
import MapView from './components/MapView';
import { getStoredIssues, storeIssue, getCurrentUser, setCurrentUser, logout } from './utils/storage';

function App() {
  const [issues, setIssues] = useState([]);
  const [currentUser, setCurrentUserState] = useState(null);
  const [currentView, setCurrentView] = useState('report');

  // Load data on mount
  useEffect(() => {
    const storedIssues = getStoredIssues();
    setIssues(storedIssues);

    const storedUser = getCurrentUser();
    setCurrentUserState(storedUser);
  }, []);

  const handleLogin = (user) => {
    setCurrentUser(user);
    setCurrentUserState(user);
  };

  const handleLogout = () => {
    logout();
    setCurrentUserState(null);
    setCurrentView('report');
  };

  const handleSubmitIssue = (issueData) => {
    const newIssue = {
      ...issueData,
      id: `issue_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      reportedAt: new Date(),
      updatedAt: new Date()
    };

    storeIssue(newIssue);
    setIssues(prev => [newIssue, ...prev]);
  };

  const handleUpdateStatus = (issueId, status) => {
    setIssues(prev =>
      prev.map(issue => {
        if (issue.id === issueId) {
          const updatedIssue = { ...issue, status, updatedAt: new Date() };
          storeIssue(updatedIssue);
          return updatedIssue;
        }
        return issue;
      })
    );
  };

  const handleResolve = (issueId, resolutionPhoto, resolutionNotes) => {
    setIssues(prev =>
      prev.map(issue => {
        if (issue.id === issueId) {
          const updatedIssue = {
            ...issue,
            status: 'resolved',
            resolutionPhoto,
            resolutionNotes,
            resolvedAt: new Date(),
            resolvedBy: currentUser?.id,
            updatedAt: new Date()
          };
          storeIssue(updatedIssue);
          return updatedIssue;
        }
        return issue;
      })
    );
  };

  const renderContent = () => {
    if (!currentUser) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8 max-w-md w-full text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to SCIT</h2>
            <p className="text-gray-600 mb-6">
              Smart Civic Issue Tracker helps you report and track civic issues in your community.
            </p>
            <p className="text-sm text-gray-500">
              Please select a user type from the header to continue.
            </p>
          </div>
        </div>
      );
    }

    switch (currentView) {
      case 'report':
        return (
          <div className="min-h-screen bg-gray-50 py-6">
            <IssueForm currentUser={currentUser} onSubmit={handleSubmitIssue} />
          </div>
        );
      case 'dashboard':
        return (
          <div className="min-h-screen bg-gray-50 py-6">
            <Dashboard
              issues={issues}
              currentUser={currentUser}
              onUpdateStatus={handleUpdateStatus}
              onResolve={handleResolve}
            />
          </div>
        );
      case 'map':
        return (
          <div className="min-h-screen bg-gray-50 py-6">
            <div className="max-w-7xl mx-auto p-6">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Issue Map</h1>
                <p className="text-gray-600">
                  View all reported issues on an interactive map
                </p>
              </div>
              <MapView issues={issues} />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        currentUser={currentUser}
        onLogin={handleLogin}
        onLogout={handleLogout}
        currentView={currentView}
        onViewChange={setCurrentView}
      />
      {renderContent()}
    </div>
  );
}

export default App;
