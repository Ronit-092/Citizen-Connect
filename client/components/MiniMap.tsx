import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface MiniMapProps {
  latitude: number;
  longitude: number;
  title: string;
}

export default function MiniMap({ latitude, longitude, title }: MiniMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

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

    // Initialize or update map
    if (!mapInstanceRef.current) {
      const map = L.map(mapRef.current).setView([latitude, longitude], 13);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      const marker = L.marker([latitude, longitude], {
        icon: markerIcon,
      }).addTo(map);
      marker.bindPopup(`<b>${title}</b>`);

      mapInstanceRef.current = map;
      markerRef.current = marker;
    } else {
      // Update existing map and marker
      if (markerRef.current) {
        markerRef.current.setLatLng([latitude, longitude]);
        markerRef.current.setPopupContent(`<b>${title}</b>`);
      }
      mapInstanceRef.current.setView([latitude, longitude], 13);
    }

    return () => {
      // Don't destroy the map, just update it
    };
  }, [latitude, longitude, title]);

  return (
    <div
      ref={mapRef}
      className="w-full rounded-lg overflow-hidden border border-white/10 shadow-lg"
      style={{ height: "280px" }}
    />
  );
}
