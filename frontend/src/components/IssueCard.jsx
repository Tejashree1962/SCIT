import React, { useState } from 'react';
import { MapPin, Clock, CheckCircle, AlertCircle, Camera, X } from 'lucide-react';

const categoryEmojis = {
  garbage: '🗑️',
  pothole: '🕳️',
  'dirty-toilet': '🚽',
  'street-light': '💡',
  'water-leak': '💧',
  'broken-sign': '🪧',
  other: '📝'
};

const statusStyles = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'in-progress': 'bg-blue-100 text-blue-800 border-blue-200',
  resolved: 'bg-green-100 text-green-800 border-green-200',
  rejected: 'bg-red-100 text-red-800 border-red-200'
};

const priorityStyles = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-orange-100 text-orange-800',
  urgent: 'bg-red-100 text-red-800'
};

const IssueCard = ({ issue, currentUser, onUpdateStatus, onResolve }) => {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [showResolveForm, setShowResolveForm] = useState(false);
  const [resolutionPhoto, setResolutionPhoto] = useState('');
  const [resolutionNotes, setResolutionNotes] = useState('');

  const handlePhotoUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setResolutionPhoto(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResolve = () => {
    if (!resolutionPhoto || !resolutionNotes.trim()) {
      alert('Please provide both a resolution photo and notes');
      return;
    }
    onResolve?.(issue.id, resolutionPhoto, resolutionNotes.trim());
    setShowResolveForm(false);
    setResolutionPhoto('');
    setResolutionNotes('');
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-xl">{categoryEmojis[issue.category]}</span>
                <h3 className="text-lg font-semibold text-gray-900">{issue.title}</h3>
              </div>
              <div className="flex items-center space-x-3 mb-3">
                <span className={`px-2 py-1 text-xs font-medium rounded-full border ${statusStyles[issue.status]}`}>
                  {issue.status.replace('-', ' ').toUpperCase()}
                </span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${priorityStyles[issue.priority]}`}>
                  {issue.priority.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          <p className="text-gray-700 mb-4 text-sm leading-relaxed">{issue.description}</p>

          {issue.photos.length > 0 && (
            <div className="mb-4">
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {issue.photos.map((photo, index) => (
                  <img
                    key={index}
                    src={photo}
                    alt={`Issue photo ${index + 1}`}
                    className="w-20 h-20 object-cover rounded-lg border border-gray-200 cursor-pointer hover:opacity-80 transition-opacity flex-shrink-0"
                    onClick={() => setSelectedPhoto(photo)}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center text-gray-600 mb-4">
            <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="text-sm break-all">
              {issue.location.address || `${issue.location.lat.toFixed(4)}, ${issue.location.lng.toFixed(4)}`}
            </span>
          </div>

          {issue.status === 'resolved' && issue.resolutionPhoto && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <div className="flex items-center text-green-800 mb-2">
                <CheckCircle className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">Resolved</span>
              </div>
              <div className="flex space-x-3">
                <img
                  src={issue.resolutionPhoto}
                  alt="Resolution proof"
                  className="w-16 h-16 object-cover rounded-lg cursor-pointer"
                  onClick={() => setSelectedPhoto(issue.resolutionPhoto)}
                />
                <div className="flex-1">
                  <p className="text-sm text-green-700">{issue.resolutionNotes}</p>
                  {issue.resolvedAt && (
                    <p className="text-xs text-green-600 mt-1">
                      Resolved on {formatDate(issue.resolvedAt)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center text-gray-500 text-xs space-x-4 mb-4">
            <div className="flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              Reported {formatDate(issue.reportedAt)}
            </div>
            {issue.updatedAt !== issue.reportedAt && (
              <div className="flex items-center">
                <AlertCircle className="w-3 h-3 mr-1" />
                Updated {formatDate(issue.updatedAt)}
              </div>
            )}
          </div>

          {currentUser.role === 'admin' && issue.status !== 'resolved' && (
            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center space-x-2 mb-3">
                <span className="text-sm font-medium text-gray-700">Update Status:</span>
                <select
                  value={issue.status}
                  onChange={(e) => onUpdateStatus?.(issue.id, e.target.value)}
                  className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              {issue.status === 'in-progress' && !showResolveForm && (
                <button
                  onClick={() => setShowResolveForm(true)}
                  className="w-full px-3 py-2 bg-green-500 text-white text-sm font-medium rounded-md hover:bg-green-600 transition-colors"
                >
                  Mark as Resolved
                </button>
              )}

              {showResolveForm && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-3">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Mark as Resolved</h4>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Resolution Photo *
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="w-full text-xs file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100"
                      />
                      {resolutionPhoto && (
                        <img
                          src={resolutionPhoto}
                          alt="Resolution proof"
                          className="mt-2 w-16 h-16 object-cover rounded border"
                        />
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Resolution Notes *
                      </label>
                      <textarea
                        value={resolutionNotes}
                        onChange={(e) => setResolutionNotes(e.target.value)}
                        placeholder="Describe how the issue was resolved"
                        rows={3}
                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-sky-500 resize-none"
                      />
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={handleResolve}
                        className="flex-1 px-3 py-2 bg-green-500 text-white text-xs font-medium rounded hover:bg-green-600 transition-colors"
                      >
                        Confirm Resolution
                      </button>
                      <button
                        onClick={() => {
                          setShowResolveForm(false);
                          setResolutionPhoto('');
                          setResolutionNotes('');
                        }}
                        className="px-3 py-2 bg-gray-300 text-gray-700 text-xs font-medium rounded hover:bg-gray-400 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {selectedPhoto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-full">
            <img
              src={selectedPhoto}
              alt="Full size"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 w-8 h-8 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center hover:bg-opacity-70 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default IssueCard;
