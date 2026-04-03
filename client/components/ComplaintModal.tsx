import { useState, useRef } from "react";
import { X, MapPin, Trash2 } from "lucide-react";
import { toast } from "sonner";
import CategorySelect from "./CategorySelect";
import LeafletMap from "./LeafletMap";

interface ComplaintModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: any) => void;
}

export default function ComplaintModal({
  isOpen,
  onClose,
  onSubmit,
}: ComplaintModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "road",
    priority: "medium",
    latitude: "",
    longitude: "",
    locationAddress: "",
    area: "",
    city: "",
    state: "",
    pincode: "",
    landmark: "",
    image: null as File | null,
  });
  
  const [locationSuggestions, setLocationSuggestions] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFormData((prev) => ({
        ...prev,
        image: e.target.files![0],
      }));
    }
  };

  const handleClearImage = () => {
    setFormData((prev) => ({
      ...prev,
      image: null,
    }));
    // Reset the file input
    const fileInput = document.getElementById('photo-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const searchLocation = async (query: string) => {
    if (query.length < 3) {
      setLocationSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=5`
      );
      const data = await response.json();
      setLocationSuggestions(data);
      setShowSuggestions(data.length > 0);
    } catch (error) {
      console.error('Location search error:', error);
      setLocationSuggestions([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleLocationInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData((prev) => ({ ...prev, locationAddress: value }));
    
    // Clear existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // Set new timeout for debounced search
    if (value.length >= 3) {
      searchTimeoutRef.current = setTimeout(() => {
        searchLocation(value);
      }, 500);
    } else {
      setLocationSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const selectSuggestion = (suggestion: any) => {
    const address = suggestion.display_name;
    const lat = parseFloat(suggestion.lat);
    const lng = parseFloat(suggestion.lon);
    
    // Parse address details
    const addr = suggestion.address || {};
    const city = addr.city || addr.town || addr.village || addr.county || '';
    const state = addr.state || addr.region || '';
    const pincode = addr.postcode || '';
    const area = addr.neighbourhood || addr.suburb || addr.road || '';

    setFormData((prev) => ({
      ...prev,
      latitude: lat.toString(),
      longitude: lng.toString(),
      locationAddress: address,
      area: area,
      city: city,
      state: state,
      pincode: pincode,
    }));
    
    setShowSuggestions(false);
    setLocationSuggestions([]);
  };

  const handleLocationSelect = (lat: number, lng: number, address: string, details?: any) => {
    setFormData((prev) => ({
      ...prev,
      latitude: lat.toString(),
      longitude: lng.toString(),
      locationAddress: address,
      area: details?.area || "",
      city: details?.city || "",
      state: details?.state || "",
      pincode: details?.pincode || "",
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.latitude || !formData.longitude) {
      toast.error("Please select a location on the map");
      return;
    }
    onSubmit(formData);
    setFormData({
      title: "",
      description: "",
      category: "road",
      priority: "medium",
      latitude: "",
      longitude: "",
      locationAddress: "",
      area: "",
      city: "",
      state: "",
      pincode: "",
      landmark: "",
      image: null,
    });
    setLocationSuggestions([]);
    setShowSuggestions(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-start sm:items-center justify-center p-0 sm:p-4 overflow-y-auto">
      <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-t-2xl sm:rounded-2xl w-full sm:w-[95%] md:w-[90%] max-w-4xl my-0 sm:my-8 border-t sm:border border-white/10 shadow-2xl animate-slide-up min-h-screen sm:min-h-0">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-br from-slate-900/95 via-purple-900/95 to-slate-900/95 backdrop-blur-sm flex justify-between items-center p-4 sm:p-6 border-b border-white/10 z-10">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold">File a New Complaint</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Content */}
        <form
          onSubmit={handleSubmit}
          className="p-4 sm:p-6 space-y-4 sm:space-y-6 max-h-[calc(100vh-80px)] sm:max-h-[70vh] overflow-y-auto custom-scrollbar"
        >
          <div className="grid md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="md:col-span-2">
              <label className="form-label-dark">
                Complaint Title <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleFormChange}
                placeholder="e.g., Pothole on Main Street causing accidents"
                className="form-input-dark"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="form-label-dark">Category <span className="text-red-400">*</span></label>
              <CategorySelect
                value={formData.category}
                onChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    category: value,
                  }))
                }
              />
            </div>

            {/* Priority */}
            <div>
              <label className="form-label-dark">Priority Level</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleFormChange}
                className="form-input-dark cursor-pointer"
              >
                <option value="low" className="bg-gray-900">🟢 Low - Minor issue</option>
                <option value="medium" className="bg-gray-900">🟡 Medium - Needs attention</option>
                <option value="high" className="bg-gray-900">🔴 High - Urgent</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="form-label-dark">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleFormChange}
              placeholder="Provide detailed information about the issue..."
              rows={4}
              className="form-input-dark resize-none"
              required
            />
          </div>

          {/* Location */}
          <div className="relative">
            <label className="block text-sm font-medium mb-4">
              Select Location <span className="text-red-400">*</span>
            </label>
            
            {/* Location Search Input with Autocomplete */}
            <div className="mb-4 relative z-[60]">
              <label className="form-label-dark mb-2">Search Location</label>
              <input
                type="text"
                value={formData.locationAddress}
                onChange={handleLocationInputChange}
                onFocus={() => formData.locationAddress.length >= 3 && locationSuggestions.length > 0 && setShowSuggestions(true)}
                placeholder="Type to search for a location (e.g., Mumbai, Delhi, Bangalore)..."
                className="form-input-dark"
              />
              
              {/* Autocomplete Suggestions Dropdown */}
              {showSuggestions && locationSuggestions.length > 0 && (
                <div 
                  className="absolute z-[70] w-full mt-1 bg-slate-900 border border-white/20 rounded-lg shadow-xl max-h-60 overflow-y-auto"
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                >
                  {locationSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => selectSuggestion(suggestion)}
                      className="w-full text-left px-4 py-3 hover:bg-purple-500/20 transition-colors border-b border-white/5 last:border-b-0"
                    >
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 mt-1 text-purple-400 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-white">{suggestion.display_name}</p>
                          {suggestion.address && (
                            <p className="text-xs text-gray-400 mt-1">
                              {[suggestion.address.city, suggestion.address.state, suggestion.address.country].filter(Boolean).join(', ')}
                            </p>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
              
              {isSearching && (
                <p className="text-xs text-gray-400 mt-1">Searching locations...</p>
              )}
            </div>
            
            {/* Map for manual selection */}
            <div className="relative z-10">
              <label className="form-label-dark mb-2">Or Select on Map</label>
              <LeafletMap onLocationSelect={handleLocationSelect} />
            </div>
            
            {/* Display selected location details */}
            {formData.locationAddress && (
              <div className="mt-4 p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-start gap-2 mb-2">
                  <MapPin className="w-4 h-4 mt-1 text-purple-400 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white mb-1">Selected Location</p>
                    <p className="text-sm text-gray-400">{formData.locationAddress}</p>
                  </div>
                </div>
                {(formData.area || formData.city || formData.state) && (
                  <div className="flex flex-wrap gap-2 text-xs text-gray-500 mt-2 pl-6">
                    {formData.area && <span className="px-2 py-1 rounded bg-white/5">🏘️ {formData.area}</span>}
                    {formData.city && <span className="px-2 py-1 rounded bg-white/5">📍 {formData.city}</span>}
                    {formData.state && <span className="px-2 py-1 rounded bg-white/5">🗺️ {formData.state}</span>}
                    {formData.latitude && formData.longitude && (
                      <span className="px-2 py-1 rounded bg-white/5">📐 {parseFloat(formData.latitude).toFixed(4)}, {parseFloat(formData.longitude).toFixed(4)}</span>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Additional Location Details */}
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="form-label-dark">Area/Locality</label>
              <input
                type="text"
                name="area"
                value={formData.area}
                onChange={handleFormChange}
                placeholder="e.g., Sector 15, MG Road Area"
                className="form-input-dark"
              />
            </div>
            <div>
              <label className="form-label-dark">Nearby Landmark</label>
              <input
                type="text"
                name="landmark"
                value={formData.landmark}
                onChange={handleFormChange}
                placeholder="e.g., Near City Mall"
                className="form-input-dark"
              />
            </div>
            <div>
              <label className="form-label-dark">Pincode</label>
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleFormChange}
                placeholder="e.g., 110001"
                maxLength={6}
                className="form-input-dark"
              />
            </div>
          </div>

          {/* Upload Photo */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Upload Photo (Optional)
            </label>
            <div className="relative">
              <input
                type="file"
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
                id="photo-upload"
              />
              {!formData.image ? (
                <label
                  htmlFor="photo-upload"
                  className="cursor-pointer block px-4 py-3 rounded-lg bg-white/5 border-2 border-dashed border-white/20 text-center hover:border-primary/50 hover:bg-white/10 transition-all"
                >
                  <p className="text-sm text-gray-400">
                    Click to upload photo
                  </p>
                </label>
              ) : (
                <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/5 border border-white/20">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">{formData.image.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {(formData.image.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleClearImage}
                    className="p-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-all"
                    title="Remove image"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4 border-t border-white/10">
            <button
              type="submit"
              className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-primary to-emerald-400 text-primary-foreground font-semibold hover:shadow-lg hover:shadow-primary/50 transition-all"
            >
              Submit Complaint
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-lg bg-white/10 border border-white/20 text-white font-semibold hover:bg-white/20 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
