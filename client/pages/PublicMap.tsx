import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  Filter,
  Search,
  X,
  AlertCircle,
  Clock,
  CheckCircle2,
  Loader,
  TrendingUp,
  Users,
  Calendar,
  Eye,
  ThumbsUp,
  MessageSquare,
  ImageIcon,
  ArrowLeft,
  RefreshCw,
  Zap,
  Map as MapIcon,
  List,
  Layers,
} from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { complaintApi } from "../lib/api";
import type { Complaint } from "@shared/api";
import { toast } from "sonner";

const indiaBounds: L.LatLngBoundsExpression = [
  [6.4627, 68.1097],   // Southwest
  [35.5133, 97.3954],  // Northeast
];


// Fix Leaflet default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom marker icons based on status and priority
const createCustomIcon = (status: string, priority: string) => {
  const getColor = () => {
    if (priority === "urgent") return "#ef4444";
    if (priority === "high") return "#f97316";
    if (status === "resolved") return "#10b981";
    if (status === "in-progress") return "#eab308";
    return "#f97316";
  };

  const color = getColor();
  const iconHtml = `
    <div style="
      background: ${color};
      width: 30px;
      height: 30px;
      border-radius: 50% 50% 50% 0;
      border: 3px solid white;
      transform: rotate(-45deg);
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    ">
      <div style="
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        transform: rotate(45deg);
        color: white;
        font-size: 16px;
        font-weight: bold;
      ">!</div>
    </div>
  `;

  return L.divIcon({
    html: iconHtml,
    className: "custom-marker",
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
  });
};

// Component to fit map bounds to markers
function MapBounds({ complaints }: { complaints: Complaint[] }) {
  const map = useMap();

  useEffect(() => {
    if (complaints.length > 0) {
      const bounds = complaints
        .filter((c) => c.location?.latitude && c.location?.longitude)
        .map((c) => [c.location.latitude, c.location.longitude] as [number, number]);

      if (bounds.length > 0) {
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 13 });
      }
    }
  }, [complaints, map]);

  return null;
}
// Component to lock map inside India's boundaries
function LockToIndia() {
  const map = useMap();

  useEffect(() => {
    map.setMaxBounds(indiaBounds);   // Stop panning outside India
    map.fitBounds(indiaBounds);      // Automatically center on India
  }, [map]);

  return null;
}


export default function PublicMap() {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [filteredComplaints, setFilteredComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<"map" | "list">("map");
  const [mapCenter] = useState<[number, number]>([20.5937, 78.9629]); // India center
  const [mapZoom] = useState(5);

  useEffect(() => {
    loadComplaints();
    // Auto-refresh every 10 seconds for live updates (changed from 30s for more frequent updates)
    const interval = setInterval(() => {
      loadComplaints(true);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    applyFilters();
  }, [complaints, searchQuery, filterStatus, filterCategory, filterPriority]);

  const loadComplaints = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      // Use public endpoint to get ALL complaints regardless of auth status
      const result = await complaintApi.getAllPublic({ limit: 10000, sort: '-createdAt' });
      setComplaints(result.data?.complaints || []);
      setLastUpdate(new Date());
      if (!silent) {
        toast.success(`Loaded ${result.data?.complaints?.length || 0} complaints`);
      }
    } catch (err) {
      console.error("Failed to load complaints:", err);
      if (!silent) toast.error("Failed to load complaints");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...complaints];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (c) =>
          c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.location?.address?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter((c) => c.status === filterStatus);
    }

    // Category filter
    if (filterCategory !== "all") {
      filtered = filtered.filter((c) => c.category === filterCategory);
    }

    // Priority filter
    if (filterPriority !== "all") {
      filtered = filtered.filter((c) => c.priority === filterPriority);
    }

    setFilteredComplaints(filtered);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved":
        return "text-emerald-400 bg-emerald-400/20 border-emerald-400/50";
      case "in-progress":
        return "text-yellow-400 bg-yellow-400/20 border-yellow-400/50";
      default:
        return "text-orange-400 bg-orange-400/20 border-orange-400/50";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-gradient-to-r from-red-500 to-pink-500";
      case "high":
        return "bg-gradient-to-r from-orange-500 to-red-500";
      case "medium":
        return "bg-gradient-to-r from-yellow-500 to-orange-500";
      default:
        return "bg-gradient-to-r from-blue-500 to-cyan-500";
    }
  };

  const stats = {
    total: complaints.length,
    pending: complaints.filter((c) => c.status === "pending").length,
    inProgress: complaints.filter((c) => c.status === "in-progress").length,
    resolved: complaints.filter((c) => c.status === "resolved").length,
    urgent: complaints.filter((c) => c.priority === "urgent").length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0a42] via-[#3a1a7e] to-[#2a1a60] text-white">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-float-delayed" />
      </div>

      {/* Header */}
      <header className="z-20 border-b border-white/10 backdrop-blur-md sticky top-0">
        <div className="px-4 sm:px-6 lg:px-12 py-4 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/")}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <MapPin className="w-6 h-6 text-cyan-400" />
                  Public Complaints Board
                </h1>
                <p className="text-sm text-gray-400 flex items-center gap-2">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    Live updates every 10s
                  </span>
                  • Last updated: {lastUpdate.toLocaleTimeString()}
                </p>
              </div>
            </div>
            <button
              onClick={() => loadComplaints()}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 transition-all border border-cyan-400/30 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>

          {/* Search and Filter Bar */}
          <div className="flex gap-2 flex-wrap">
            <div className="flex-1 min-w-[200px] relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search complaints..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-black/30 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-cyan-400/50 focus:outline-none"
              />
            </div>
            
            {/* View Toggle */}
            <div className="flex bg-black/30 border border-white/10 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode("map")}
                className={`px-4 py-2 flex items-center gap-2 transition-all ${
                  viewMode === "map"
                    ? "bg-cyan-500/20 text-cyan-400"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <MapIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Map</span>
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`px-4 py-2 flex items-center gap-2 transition-all border-l border-white/10 ${
                  viewMode === "list"
                    ? "bg-cyan-500/20 text-cyan-400"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <List className="w-4 h-4" />
                <span className="hidden sm:inline">List</span>
              </button>
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2 rounded-lg border transition-all flex items-center gap-2 ${
                showFilters
                  ? "bg-cyan-500/20 border-cyan-400/50 text-cyan-400"
                  : "bg-black/30 border-white/10 hover:border-cyan-400/30"
              }`}
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-4 p-4 bg-black/30 border border-white/10 rounded-lg">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Status</label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white focus:border-cyan-400/50 focus:outline-none"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Category</label>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white focus:border-cyan-400/50 focus:outline-none"
                  >
                    <option value="all">All Categories</option>
                    <option value="roads">Roads</option>
                    <option value="garbage">Garbage</option>
                    <option value="water">Water</option>
                    <option value="electricity">Electricity</option>
                    <option value="others">Others</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Priority</label>
                  <select
                    value={filterPriority}
                    onChange={(e) => setFilterPriority(e.target.value)}
                    className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white focus:border-cyan-400/50 focus:outline-none"
                  >
                    <option value="all">All Priorities</option>
                    <option value="urgent">Urgent</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Stats Bar */}
      <div className="relative z-0 px-4 sm:px-6 lg:px-12 py-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          <div className="bg-gradient-to-br from-cyan-500/10 to-blue-900/20 border border-cyan-400/30 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-cyan-400">{stats.total}</div>
            <div className="text-xs text-gray-400">Total</div>
          </div>
          <div className="bg-gradient-to-br from-orange-500/10 to-red-900/20 border border-orange-400/30 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-orange-400">{stats.pending}</div>
            <div className="text-xs text-gray-400">Pending</div>
          </div>
          <div className="bg-gradient-to-br from-yellow-500/10 to-orange-900/20 border border-yellow-400/30 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400">{stats.inProgress}</div>
            <div className="text-xs text-gray-400">In Progress</div>
          </div>
          <div className="bg-gradient-to-br from-emerald-500/10 to-green-900/20 border border-emerald-400/30 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-emerald-400">{stats.resolved}</div>
            <div className="text-xs text-gray-400">Resolved</div>
          </div>
          <div className="bg-gradient-to-br from-red-500/10 to-pink-900/20 border border-red-400/30 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-red-400">{stats.urgent}</div>
            <div className="text-xs text-gray-400">Urgent</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-4 sm:px-6 lg:px-12 pb-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map/List View */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
              {viewMode === "map" ? (
                <div className="relative">
                  <div className="h-[70vh] w-full">
                    <MapContainer
                      key="complaint-map"
                      center={mapCenter}
                      zoom={mapZoom}
                      style={{ height: "100%", width: "100%" }}
                      className="z-0"
                      scrollWheelZoom={true}
                      maxBounds={indiaBounds}
                      maxBoundsViscosity={1.0}
                      minZoom={4}
                      maxZoom={18}
                    >
                      <LockToIndia />
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      {filteredComplaints.length > 0 && (
                        <MapBounds complaints={filteredComplaints} />
                      )}
                      
                      {filteredComplaints.map((complaint) => {
                        if (!complaint.location?.latitude || !complaint.location?.longitude)
                          return null;

                        return (
                          <Marker
                            key={complaint.id}
                            position={[complaint.location.latitude, complaint.location.longitude]}
                            icon={createCustomIcon(complaint.status, complaint.priority)}
                            eventHandlers={{
                              click: () => setSelectedComplaint(complaint),
                            }}
                          >
                            <Popup>
                              <div className="min-w-[250px]">
                                <div className="flex items-center gap-2 mb-2">
                                  <span
                                    className={`px-2 py-0.5 rounded text-xs font-semibold ${getPriorityColor(
                                      complaint.priority
                                    )} text-white`}
                                  >
                                    {complaint.priority?.toUpperCase()}
                                  </span>
                                  <span
                                    className={`px-2 py-0.5 rounded text-xs border ${getStatusColor(
                                      complaint.status
                                    )}`}
                                  >
                                    {complaint.status}
                                  </span>
                                </div>
                                <h3 className="font-bold text-gray-900 mb-1">{complaint.title}</h3>
                                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                                  {complaint.description}
                                </p>
                                <div className="text-xs text-gray-500 space-y-1">
                                  <div className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    <span className="line-clamp-1">{complaint.location.address}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-1">
                                      <Users className="w-3 h-3" />
                                      <span>{complaint.citizen?.fullName}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <ThumbsUp className="w-3 h-3" />
                                      <span>{complaint.upvotes?.length || 0}</span>
                                    </div>
                                  </div>
                                </div>
                                <button
                                  onClick={() => setSelectedComplaint(complaint)}
                                  className="mt-2 w-full px-3 py-1 bg-cyan-500 text-white rounded text-sm hover:bg-cyan-600 transition-colors"
                                >
                                  View Details
                                </button>
                              </div>
                            </Popup>
                          </Marker>
                        );
                      })}
                    </MapContainer>
                  </div>
                  
                  {/* Map Legend */}
                  <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-sm border border-white/20 rounded-lg p-3 z-[1000]">
                    <div className="flex items-center gap-2 mb-2">
                      <Layers className="w-4 h-4 text-cyan-400" />
                      <span className="text-sm font-semibold text-white">Legend</span>
                    </div>
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <span className="text-gray-300">Urgent</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                        <span className="text-gray-300">High/Pending</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <span className="text-gray-300">In Progress</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span className="text-gray-300">Resolved</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Map Stats Overlay */}
                  <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm border border-white/20 rounded-lg p-3 z-[1000]">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-cyan-400">
                        {filteredComplaints.length}
                      </div>
                      <div className="text-xs text-gray-400">Showing</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">
                      All Complaints ({filteredComplaints.length})
                    </h2>
                    {loading && <Loader className="w-5 h-5 animate-spin text-cyan-400" />}
                  </div>

                  {loading && complaints.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                      <Loader className="w-12 h-12 mx-auto mb-4 animate-spin" />
                      <p>Loading complaints...</p>
                    </div>
                  ) : filteredComplaints.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                      <AlertCircle className="w-12 h-12 mx-auto mb-4" />
                      <p>No complaints found</p>
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
                      {filteredComplaints.map((complaint) => (
                        <div
                          key={complaint.id}
                          onClick={() => setSelectedComplaint(complaint)}
                          className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-all cursor-pointer group"
                        >
                          {/* Priority Badge */}
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span
                                  className={`px-2 py-0.5 rounded text-xs font-semibold ${getPriorityColor(
                                    complaint.priority
                                  )} text-white`}
                                >
                                  {complaint.priority?.toUpperCase()}
                                </span>
                                <span
                                  className={`px-2 py-0.5 rounded text-xs border ${getStatusColor(
                                    complaint.status
                                  )}`}
                                >
                                  {complaint.status}
                                </span>
                              </div>
                              <h3 className="font-semibold text-white group-hover:text-cyan-400 transition-colors">
                                {complaint.title}
                              </h3>
                              <p className="text-sm text-gray-400 line-clamp-2 mt-1">
                                {complaint.description}
                              </p>
                            </div>
                          </div>

                          {/* Location */}
                          <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                            <MapPin className="w-3 h-3" />
                            <span className="line-clamp-1">{complaint.location?.address}</span>
                          </div>

                          {/* Meta Info */}
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              <span>{complaint.citizen?.fullName}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>{new Date(complaint.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <ThumbsUp className="w-3 h-3" />
                              <span>{complaint.upvotes?.length || 0}</span>
                            </div>
                            {Array.isArray(complaint.images) && complaint.images.length > 0 && (
                              <div className="flex items-center gap-1">
                                <ImageIcon className="w-3 h-3" />
                                <span>{complaint.images.length}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Detail Panel */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-white/10 rounded-xl p-6 sticky top-24">
              {selectedComplaint ? (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">Details</h2>
                    <button
                      onClick={() => setSelectedComplaint(null)}
                      className="p-1 rounded hover:bg-white/10 transition-all"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    {/* Status & Priority */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`px-3 py-1 rounded font-semibold ${getPriorityColor(
                            selectedComplaint.priority
                          )} text-white`}
                        >
                          {selectedComplaint.priority?.toUpperCase()}
                        </span>
                        <span
                          className={`px-3 py-1 rounded border ${getStatusColor(
                            selectedComplaint.status
                          )}`}
                        >
                          {selectedComplaint.status}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-white">{selectedComplaint.title}</h3>
                    </div>

                    {/* Description */}
                    <div>
                      <h4 className="text-sm font-semibold text-cyan-400 mb-1">Description</h4>
                      <p className="text-sm text-gray-300">{selectedComplaint.description}</p>
                    </div>

                    {/* Location */}
                    <div>
                      <h4 className="text-sm font-semibold text-cyan-400 mb-1">Location</h4>
                      <div className="flex items-start gap-2 text-sm text-gray-300">
                        <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>{selectedComplaint.location?.address}</span>
                      </div>
                    </div>

                    {/* Images */}
                    {Array.isArray(selectedComplaint.images) &&
                      selectedComplaint.images.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-cyan-400 mb-2">
                            Images ({selectedComplaint.images.length})
                          </h4>
                          <div className="grid grid-cols-2 gap-2">
                            {selectedComplaint.images.map((image, idx) => (
                              <div
                                key={idx}
                                className="aspect-video rounded-lg overflow-hidden bg-black/50"
                              >
                                <img
                                  src={typeof image === "string" ? image : image.url}
                                  alt={`Evidence ${idx + 1}`}
                                  className="w-full h-full object-cover hover:scale-110 transition-transform cursor-pointer"
                                  onClick={() =>
                                    window.open(
                                      typeof image === "string" ? image : image.url,
                                      "_blank"
                                    )
                                  }
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    {/* Reported By */}
                    <div>
                      <h4 className="text-sm font-semibold text-cyan-400 mb-1">Reported By</h4>
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <Users className="w-4 h-4" />
                        <span>{selectedComplaint.citizen?.fullName}</span>
                      </div>
                    </div>

                    {/* Category */}
                    <div>
                      <h4 className="text-sm font-semibold text-cyan-400 mb-1">Category</h4>
                      <span className="text-sm text-gray-300 capitalize">
                        {selectedComplaint.category}
                      </span>
                    </div>

                    {/* Engagement Stats */}
                    <div>
                      <h4 className="text-sm font-semibold text-cyan-400 mb-2">Engagement</h4>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="bg-white/5 rounded-lg p-2 text-center">
                          <Eye className="w-4 h-4 mx-auto mb-1 text-blue-400" />
                          <div className="text-xs text-gray-400">Views</div>
                          <div className="text-sm font-semibold">
                            {selectedComplaint.viewCount || 0}
                          </div>
                        </div>
                        <div className="bg-white/5 rounded-lg p-2 text-center">
                          <ThumbsUp className="w-4 h-4 mx-auto mb-1 text-purple-400" />
                          <div className="text-xs text-gray-400">Upvotes</div>
                          <div className="text-sm font-semibold">
                            {selectedComplaint.upvotes?.length || 0}
                          </div>
                        </div>
                        <div className="bg-white/5 rounded-lg p-2 text-center">
                          <MessageSquare className="w-4 h-4 mx-auto mb-1 text-green-400" />
                          <div className="text-xs text-gray-400">Updates</div>
                          <div className="text-sm font-semibold">
                            {selectedComplaint.remarks?.length || 0}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Timestamps */}
                    <div>
                      <h4 className="text-sm font-semibold text-cyan-400 mb-1">Timeline</h4>
                      <div className="space-y-1 text-xs text-gray-400">
                        <div className="flex items-center gap-2">
                          <Clock className="w-3 h-3" />
                          <span>
                            Created: {new Date(selectedComplaint.createdAt).toLocaleString()}
                          </span>
                        </div>
                        {selectedComplaint.resolvedAt && (
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            <span>
                              Resolved: {new Date(selectedComplaint.resolvedAt).toLocaleString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Remarks/Updates */}
                    {Array.isArray(selectedComplaint.remarks) &&
                      selectedComplaint.remarks.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-cyan-400 mb-2">
                            Updates ({selectedComplaint.remarks.length})
                          </h4>
                          <div className="space-y-2">
                            {selectedComplaint.remarks.map((remark, idx) => (
                              <div
                                key={idx}
                                className="bg-white/5 border border-white/10 rounded-lg p-3"
                              >
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-xs font-semibold text-yellow-400">
                                    {remark.addedBy?.fullName || "Official"}
                                  </span>
                                  {remark.addedAt && (
                                    <span className="text-xs text-gray-500">
                                      {new Date(remark.addedAt).toLocaleDateString()}
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-gray-300">{remark.text}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-400">
                  <AlertCircle className="w-12 h-12 mx-auto mb-4" />
                  <p>Select a complaint to view details</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
