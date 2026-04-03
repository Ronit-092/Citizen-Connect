import { useState, useEffect, useRef } from "react";
import L from "leaflet";
import { Search, MapPin } from "lucide-react";
import "leaflet/dist/leaflet.css";

interface LeafletMapProps {
  onLocationSelect: (lat: number, lng: number, address: string, details?: any) => void;
  initialLat?: number;
  initialLng?: number;
}

const DEFAULT_LAT = 28.6139;
const DEFAULT_LNG = 77.209;

export default function LeafletMap({
  onLocationSelect,
  initialLat = DEFAULT_LAT,
  initialLng = DEFAULT_LNG,
}: LeafletMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [selectedAddress, setSelectedAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [latitude, setLatitude] = useState(initialLat);
  const [longitude, setLongitude] = useState(initialLng);

  useEffect(() => {
    if (!mapRef.current) return;

    // Fix marker icons
    const markerIcon = L.icon({
      iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
      shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      iconSize: [25, 41],
      shadowSize: [41, 41],
      iconAnchor: [12, 41],
      shadowAnchor: [12, 41],
      popupAnchor: [1, -34],
    });

    // Initialize map
    const map = L.map(mapRef.current).setView([latitude, longitude], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    // Add marker with custom icon
    const marker = L.marker([latitude, longitude], { icon: markerIcon }).addTo(
      map,
    );
    marker.bindPopup(`<b>${selectedAddress || "Selected Location"}</b>`);

    // Handle map clicks
    map.on("click", (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      updateLocation(lat, lng, `${lat.toFixed(4)}, ${lng.toFixed(4)}`);
    });

    mapInstanceRef.current = map;
    markerRef.current = marker;

    return () => {
      map.remove();
    };
  }, []);

  // Update marker when coordinates change
  useEffect(() => {
    if (mapInstanceRef.current && markerRef.current) {
      const markerIcon = L.icon({
        iconUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
        iconSize: [25, 41],
        shadowSize: [41, 41],
        iconAnchor: [12, 41],
        shadowAnchor: [12, 41],
        popupAnchor: [1, -34],
      });

      markerRef.current.setLatLng([latitude, longitude]);
      markerRef.current.setIcon(markerIcon);
      mapInstanceRef.current.setView([latitude, longitude], 13);
      markerRef.current.setPopupContent(
        `<b>${selectedAddress || "Selected Location"}</b>`,
      );
    }
  }, [latitude, longitude, selectedAddress]);

  const updateLocation = (lat: number, lng: number, address: string, details?: any) => {
    setLatitude(lat);
    setLongitude(lng);
    setSelectedAddress(address);
    onLocationSelect(lat, lng, address, details);
  };

  const handleSearch = async () => {
    if (!searchInput.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          searchInput,
        )}&format=json&limit=1&addressdetails=1`,
      );
      const data = await response.json();

      if (data.length > 0) {
        const { lat, lon, display_name, address } = data[0];
        const latNum = parseFloat(lat);
        const lonNum = parseFloat(lon);
        
        // Extract address components
        const details = {
          area: address?.neighbourhood || address?.suburb || address?.road || "",
          city: address?.city || address?.town || address?.village || address?.county || "",
          state: address?.state || address?.region || "",
          pincode: address?.postcode || "",
          country: address?.country || "",
        };
        
        updateLocation(latNum, lonNum, display_name, details);
        setSearchInput("");
      } else {
        alert("Location not found. Please try a different search.");
      }
    } catch (error) {
      console.error("Error searching location:", error);
      alert("Error searching location. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
            placeholder="Search location (e.g., Mumbai, Delhi, Bangalore)..."
            className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all"
          />
        </div>
        <button
          type="button"
          onClick={handleSearch}
          disabled={isLoading}
          className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all disabled:opacity-50"
        >
          {isLoading ? "Searching..." : "Search"}
        </button>
      </div>

      {/* Map */}
      <div
        ref={mapRef}
        className="w-full rounded-lg overflow-hidden border border-white/10 shadow-xl"
        style={{ height: "400px" }}
      />

      {/* Coordinates Display */}
      {selectedAddress && (
        <div className="p-3 rounded-lg bg-primary/10 border border-primary/30">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-primary font-medium">
                {selectedAddress}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Lat: {latitude.toFixed(4)}, Lng: {longitude.toFixed(4)}
              </p>
            </div>
          </div>
        </div>
      )}

      <p className="text-xs text-gray-400">
        💡 Tip: Click anywhere on the map or use the search to select your
        location
      </p>
    </div>
  );
}
