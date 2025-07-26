import React, { useState, useRef } from 'react';
import { Camera, MapPin, Send, Loader, X } from 'lucide-react';
import { getCurrentLocation, reverseGeocode } from '../utils/location';

const categoryOptions = [
  { value: 'garbage', label: 'Garbage/Waste', emoji: '🗑️' },
  { value: 'pothole', label: 'Pothole', emoji: '🕳️' },
  { value: 'dirty-toilet', label: 'Dirty Toilet', emoji: '🚽' },
  { value: 'street-light', label: 'Street Light', emoji: '💡' },
  { value: 'water-leak', label: 'Water Leak', emoji: '💧' },
  { value: 'broken-sign', label: 'Broken Sign', emoji: '🪧' },
  { value: 'other', label: 'Other', emoji: '📝' }
];

const priorityOptions = [
  { value: 'low', label: 'Low', color: 'text-green-600 bg-green-50' },
  { value: 'medium', label: 'Medium', color: 'text-yellow-600 bg-yellow-50' },
  { value: 'high', label: 'High', color: 'text-orange-600 bg-orange-50' },
  { value: 'urgent', label: 'Urgent', color: 'text-red-600 bg-red-50' }
];

const IssueForm = ({ currentUser, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('garbage');
  const [priority, setPriority] = useState('medium');
  const [photos, setPhotos] = useState([]);
  const [location, setLocation] = useState(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef(null);

  const handlePhotoUpload = (event) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const dataUrl = e.target.result;
          setPhotos((prev) => [...prev, dataUrl]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removePhoto = (index) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const captureLocation = async () => {
    setIsLoadingLocation(true);
    try {
      const coords = await getCurrentLocation();
      const address = await reverseGeocode(coords.lat, coords.lng);
      setLocation({ ...coords, address });
    } catch (error) {
      console.error('Failed to get location:', error);
      alert('Failed to get your location. Please enable location services and try again.');
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    if (!location) {
      alert('Please capture your location');
      return;
    }

    if (photos.length === 0) {
      alert('Please add at least one photo');
      return;
    }

    setIsSubmitting(true);

    try {
      const issueData = {
        title: title.trim(),
        description: description.trim(),
        category,
        priority,
        photos,
        location,
        status: 'pending',
        reportedBy: currentUser.id
      };

      onSubmit(issueData);

      setTitle('');
      setDescription('');
      setCategory('garbage');
      setPriority('medium');
      setPhotos([]);
      setLocation(null);

      alert('Issue reported successfully!');
    } catch (error) {
      console.error('Failed to submit issue:', error);
      alert('Failed to submit issue. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Report New Issue</h2>
          <p className="text-sm text-gray-600 mt-1">Help improve your community by reporting civic issues</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Issue Title *
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              placeholder="Brief description of the issue"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {categoryOptions.map((option) => (
                <label
                  key={option.value}
                  className={`relative flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                    category === option.value
                      ? 'border-sky-500 bg-sky-50'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="category"
                    value={option.value}
                    checked={category === option.value}
                    onChange={(e) => setCategory(e.target.value)}
                    className="sr-only"
                  />
                  <span className="text-lg mr-2">{option.emoji}</span>
                  <span className="text-sm font-medium">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority Level *
            </label>
            <div className="flex space-x-3">
              {priorityOptions.map((option) => (
                <label
                  key={option.value}
                  className={`flex-1 flex items-center justify-center p-2 rounded-md cursor-pointer transition-colors ${
                    priority === option.value
                      ? option.color
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <input
                    type="radio"
                    name="priority"
                    value={option.value}
                    checked={priority === option.value}
                    onChange={(e) => setPriority(e.target.value)}
                    className="sr-only"
                  />
                  <span className="text-sm font-medium">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent resize-none"
              placeholder="Provide detailed information about the issue"
              required
            />
          </div>

          {/* Photo Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Photos * (Add at least one photo)
            </label>
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-sky-400 hover:bg-sky-50 transition-colors"
              >
                <Camera className="w-5 h-5 text-gray-400 mr-2" />
                <span className="text-sm text-gray-600">Add Photos</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoUpload}
                className="hidden"
              />
              
              {photos.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {photos.map((photo, index) => (
                    <div key={index} className="relative">
                      <img
                        src={photo}
                        alt={`Issue photo ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location *
            </label>
            <div className="space-y-3">
              <button
                type="button"
                onClick={captureLocation}
                disabled={isLoadingLocation}
                className="w-full flex items-center justify-center px-4 py-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600 disabled:bg-gray-400 transition-colors"
              >
                {isLoadingLocation ? (
                  <Loader className="w-5 h-5 animate-spin mr-2" />
                ) : (
                  <MapPin className="w-5 h-5 mr-2" />
                )}
                <span className="text-sm font-medium">
                  {isLoadingLocation ? 'Getting Location...' : 'Capture Current Location'}
                </span>
              </button>
              
              {location && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center text-green-800">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">Location Captured</span>
                  </div>
                  <p className="text-xs text-green-600 mt-1 break-all">
                    {location.address || `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || !location || photos.length === 0}
            className="w-full flex items-center justify-center px-4 py-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600 disabled:bg-gray-400 transition-colors"
          >
            {isSubmitting ? (
              <Loader className="w-5 h-5 animate-spin mr-2" />
            ) : (
              <Send className="w-5 h-5 mr-2" />
            )}
            <span className="text-sm font-medium">
              {isSubmitting ? 'Reporting Issue...' : 'Report Issue'}
            </span>
          </button>
        </form>
      </div>
    


      {/* Component JSX remains unchanged hereafter */}
      {/* All your form fields and UI JSX is already valid without TSX types */}
      {/* Continue rendering the form like in your code above */}
    </div>
  );
};

export default IssueForm;
