import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin, X, Navigation } from "lucide-react";

interface NearbyIssuesMapProps {
  complaints: any[];
  onComplaintClick: (complaint: any) => void;
}

const indiaBounds: [[number, number], [number, number]] = [
  [8.0, 68.0],      // Southwest corner (southern tip near Kanyakumari)
  [35.5, 97.5]      // Northeast corner (northern regions)
];

export default function NearbyIssuesMap({ complaints, onComplaintClick }: NearbyIssuesMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  useEffect(() => {
    if (!mapRef.current) return;
    
    // Don't reinitialize if map already exists
    if (mapInstanceRef.current) return;

    // Initialize map centered on India
    const map = L.map(mapRef.current, {
      maxBounds: indiaBounds,        // ⛔ Prevent panning outside India
      maxBoundsViscosity: 1.0,      // ❗ Resist dragging outside
      minZoom:5,
      maxZoom:18
    }).setView([20.5937, 78.9629], 5);


    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 18,
      
    }).addTo(map);
    
    map.fitBounds(indiaBounds);

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing markers
    markersRef.current.forEach(marker => {
      if (marker && map.hasLayer(marker)) {
        map.removeLayer(marker);
      }
    });
    markersRef.current = [];

    //  complaints
    const filteredComplaints = complaints.filter(c => {
      const categoryMatch = selectedCategory === "all" || c.category === selectedCategory;
      const statusMatch = selectedStatus === "all" || c.status === selectedStatus;
      return categoryMatch && statusMatch && c.location?.latitude && c.location?.longitude;
    });

    if (filteredComplaints.length === 0) return;

    // Define marker colors based on status
    const getMarkerColor = (status: string) => {
      switch (status) {
        case "resolved": return "#10b981";
        case "in-progress": return "#f59e0b";
        case "pending": return "#ef4444";
        default: return "#6b7280";
      }
    };

    // Add markers for filtered complaints
    filteredComplaints.forEach((complaint) => {
      if (!map) return; // Extra safety check
      
      const color = getMarkerColor(complaint.status);
      
      const customIcon = L.divIcon({
        className: 'custom-marker',
        html: `
          <div style="
            width: 30px;
            height: 30px;
            background: ${color};
            border: 3px solid white;
            border-radius: 50%;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            position: relative;
          ">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
          </div>
        `,
        iconSize: [30, 30],
        iconAnchor: [15, 30],
      });

      const marker = L.marker([complaint.location.latitude, complaint.location.longitude], {
        icon: customIcon
      }).addTo(map);

      const formatLocation = () => {
        const parts = [];
        if (complaint.location.landmark) parts.push(complaint.location.landmark);
        if (complaint.location.area) parts.push(complaint.location.area);
        if (complaint.location.city) parts.push(complaint.location.city);
        return parts.length > 0 ? parts.join(", ") : complaint.location.address;
      };

      marker.bindPopup(`
        <div style="min-width: 200px;">
          <h3 style="margin: 0 0 8px 0; font-weight: bold; font-size: 14px;">${complaint.title}</h3>
          <p style="margin: 0 0 8px 0; font-size: 12px; color: #666;">${complaint.description.substring(0, 100)}${complaint.description.length > 100 ? '...' : ''}</p>
          <div style="display: flex; gap: 8px; margin-bottom: 8px;">
            <span style="padding: 2px 8px; border-radius: 12px; font-size: 10px; background: ${color}20; color: ${color}; font-weight: 600;">
              ${complaint.status.replace("-", " ").toUpperCase()}
            </span>
            <span style="padding: 2px 8px; border-radius: 12px; font-size: 10px; background: #8b5cf620; color: #8b5cf6; font-weight: 600;">
              ${complaint.category.toUpperCase()}
            </span>
          </div>
          <p style="margin: 0; font-size: 11px; color: #999;">📍 ${formatLocation()}</p>
        </div>
      `);

      marker.on('click', () => {
        onComplaintClick(complaint);
      });

      markersRef.current.push(marker);
    });

    // Fit bounds to show all markers
    // Fit bounds to show all markers
    if (filteredComplaints.length > 0 && map) {
      const bounds = L.latLngBounds(
        filteredComplaints.map(c => [c.location.latitude, c.location.longitude])
      );
      // Ensure the bounds stay within India
      const constrainedBounds = bounds.pad(0.1); // Add 10% padding
      if (indiaBounds[0][0] <= constrainedBounds.getSouth() && 
          constrainedBounds.getNorth() <= indiaBounds[1][0] &&
          indiaBounds[0][1] <= constrainedBounds.getWest() && 
          constrainedBounds.getEast() <= indiaBounds[1][1]) {
        map.fitBounds(constrainedBounds);
      } else {
        map.fitBounds(indiaBounds); // Fallback to India bounds
      }
    }
  }, [complaints, selectedCategory, selectedStatus, onComplaintClick]);

  const categories = ["all", "road", "water", "utilities", "health", "other"];
  const statuses = ["all", "pending", "in-progress", "resolved"];

  return (
    <div className="bg-gradient-to-br from-purple-900/40 to-purple-900/20 border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
        <h3 className="text-base sm:text-lg font-semibold flex items-center gap-2">
          <Navigation className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
          <span className="text-sm sm:text-base">Nearby Issues Map</span>
        </h3>
        
        {/* Filters */}
        <div className="flex gap-2 flex-wrap w-full sm:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="flex-1 sm:flex-initial px-2 sm:px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 text-xs sm:text-sm text-white cursor-pointer"
          >
            {categories.map(cat => (
              <option key={cat} value={cat} className="bg-gray-900">
                {cat === "all" ? "All Categories" : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
          
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 text-sm text-white cursor-pointer"
          >
            {statuses.map(status => (
              <option key={status} value={status} className="bg-gray-900">
                {status === "all" ? "All Status" : status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ")}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-4 mb-4 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500 border-2 border-white"></div>
          <span className="text-gray-400">Pending</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-yellow-500 border-2 border-white"></div>
          <span className="text-gray-400">In Progress</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-green-500 border-2 border-white"></div>
          <span className="text-gray-400">Resolved</span>
        </div>
      </div>

      {/* Map */}
      <div 
        ref={mapRef} 
        className="w-full h-[300px] sm:h-[400px] md:h-[500px] rounded-lg sm:rounded-xl overflow-hidden border border-white/20"
      />

      <p className="text-[10px] sm:text-xs text-gray-400 mt-2 sm:mt-3 text-center">
        Click on any marker to view complaint details • {complaints.filter(c => c.location?.latitude).length} issues mapped
      </p>
    </div>
  );
}
