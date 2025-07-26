import React from 'react';
import { MapPin, LogOut, Shield, User } from 'lucide-react';

const Header = ({ currentUser, onLogin, onLogout, currentView, onViewChange }) => {
  const mockUsers = [
    { id: '1', name: 'John Citizen', email: 'john@example.com', role: 'citizen' },
    { id: '2', name: 'Admin User', email: 'admin@city.gov', role: 'admin' }
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-sky-500 rounded-lg">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">SCIT</h1>
              <p className="text-xs text-gray-500">Smart Civic Issue Tracker</p>
            </div>
          </div>

          {currentUser ? (
            <div className="flex items-center space-x-4">
              <nav className="flex space-x-1">
                <button
                  onClick={() => onViewChange('report')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentView === 'report'
                      ? 'bg-sky-100 text-sky-700'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Report Issue
                </button>
                <button
                  onClick={() => onViewChange('dashboard')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentView === 'dashboard'
                      ? 'bg-sky-100 text-sky-700'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Dashboard
                </button>
                {currentUser.role === 'admin' && (
                  <button
                    onClick={() => onViewChange('map')}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      currentView === 'map'
                        ? 'bg-sky-100 text-sky-700'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Map View
                  </button>
                )}
              </nav>

              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  {currentUser.role === 'admin' ? (
                    <Shield className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <User className="w-4 h-4 text-gray-600" />
                  )}
                  <span className="text-sm font-medium text-gray-700">
                    {currentUser.name}
                  </span>
                  <span className="text-xs text-gray-500 capitalize">
                    ({currentUser.role})
                  </span>
                </div>
                <button
                  onClick={onLogout}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Login as:</span>
              {mockUsers.map((user) => (
                <button
                  key={user.id}
                  onClick={() => onLogin(user)}
                  className="px-3 py-2 text-sm bg-sky-500 text-white rounded-md hover:bg-sky-600 transition-colors"
                >
                  {user.role === 'admin' ? 'Admin' : 'Citizen'}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
