import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons for different statuses
const createCustomIcon = (status) => {
  const colors = {
    pending: '#f59e0b',
    'in-progress': '#3b82f6',
    resolved: '#10b981',
    rejected: '#ef4444',
  };

  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background-color: ${colors[status] || '#6b7280'};
        border: 3px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      "></div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

const FitBoundsToIssues = ({ issues }) => {
  const map = useMap();

  useEffect(() => {
    if (issues.length > 0) {
      const bounds = L.latLngBounds(
        issues.map((issue) => [issue.location.lat, issue.location.lng])
      );
      map.fitBounds(bounds, { padding: [20, 20] });
    }
  }, [issues, map]);

  return null;
};

const MapView = ({ issues, onIssueSelect }) => {
  const mapRef = useRef(null);

  const categoryEmojis = {
    garbage: '🗑️',
    pothole: '🕳️',
    'dirty-toilet': '🚽',
    'street-light': '💡',
    'water-leak': '💧',
    'broken-sign': '🪧',
    other: '📝',
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (issues.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg">
        <div className="text-center">
          <p className="text-gray-500 text-lg mb-2">No issues to display on map</p>
          <p className="text-gray-400 text-sm">Issues will appear here once they are reported</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      <div className="h-96 sm:h-[500px] lg:h-[600px] relative">
        <MapContainer
          ref={mapRef}
          center={[40.7128, -74.006]}
          zoom={10}
          className="h-full w-full"
          zoomControl={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <FitBoundsToIssues issues={issues} />

          {issues.map((issue) => (
            <Marker
              key={issue.id}
              position={[issue.location.lat, issue.location.lng]}
              icon={createCustomIcon(issue.status)}
              eventHandlers={{
                click: () => onIssueSelect?.(issue),
              }}
            >
              <Popup>
                <div className="w-64 p-2">
                  <div className="flex items-start space-x-2 mb-2">
                    <span className="text-lg">{categoryEmojis[issue.category]}</span>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-sm leading-tight">
                        {issue.title}
                      </h3>
                      <span
                        className={`inline-block px-2 py-1 text-xs font-medium rounded mt-1 ${
                          issue.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : issue.status === 'in-progress'
                            ? 'bg-blue-100 text-blue-800'
                            : issue.status === 'resolved'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {issue.status.replace('-', ' ').toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-700 mb-2 line-clamp-2">{issue.description}</p>

                  {issue.photos.length > 0 && (
                    <div className="mb-2">
                      <img
                        src={issue.photos[0]}
                        alt="Issue"
                        className="w-full h-20 object-cover rounded border"
                      />
                      {issue.photos.length > 1 && (
                        <p className="text-xs text-gray-500 mt-1">
                          +{issue.photos.length - 1} more photo
                          {issue.photos.length > 2 ? 's' : ''}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="text-xs text-gray-500">
                    <div className="mb-1">
                      📍{' '}
                      {issue.location.address ||
                        `${issue.location.lat.toFixed(4)}, ${issue.location.lng.toFixed(4)}`}
                    </div>
                    <div>🕐 {formatDate(issue.reportedAt)}</div>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Map Legend */}
      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Map Legend</h4>
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
            <span className="text-gray-600">
              Pending ({issues.filter((i) => i.status === 'pending').length})
            </span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
            <span className="text-gray-600">
              In Progress ({issues.filter((i) => i.status === 'in-progress').length})
            </span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
            <span className="text-gray-600">
              Resolved ({issues.filter((i) => i.status === 'resolved').length})
            </span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
            <span className="text-gray-600">
              Rejected ({issues.filter((i) => i.status === 'rejected').length})
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;
