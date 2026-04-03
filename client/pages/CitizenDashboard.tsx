import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import {
  MapPin,
  Plus,
  CheckCircle2,
  Clock,
  AlertCircle,
  LogOut,
  FileText,
  BarChart3,
  User,
  Search,
  Filter,
  X,
  Download,
  Share2,
  Copy,
  Calendar,
  Map,
  ThumbsUp,
  Loader,
} from "lucide-react";
import ComplaintModal from "../components/ComplaintModal";
import ComplaintDetailsModal from "../components/ComplaintDetailsModal";
import NotificationsDropdown from "../components/NotificationsDropdown";
import AnalyticsChart from "../components/AnalyticsChart";
import NearbyIssuesMap from "../components/NearbyIssuesMap";
import Logo from "../components/Logo";
import { useComplaints } from "@/hooks/use-complaints";
import { useAuth } from "@/hooks/use-auth";
import { CreateComplaintRequest } from "@shared/api";
import { exportToCSV, exportToJSON } from "@/lib/export-utils";
import { complaintApi } from "@/lib/api";

export default function CitizenDashboard() {
  const { user, logout } = useAuth();
  const { complaints, loading, create, fetchMy } = useComplaints();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<any>(null);
  const [selectedTab, setSelectedTab] = useState("overview");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [dateRange, setDateRange] = useState("all");
  const [showShareMenu, setShowShareMenu] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [allComplaints, setAllComplaints] = useState<any[]>([]); // For map view - all complaints
  const [loadingAllComplaints, setLoadingAllComplaints] = useState(false);

  // Fetch my complaints on mount
  useEffect(() => {
    fetchMy();
    setLastUpdate(new Date());
  }, []);

  // Set up auto-refresh separate from initial load
  useEffect(() => {
    const interval = setInterval(() => {
      fetchMy();
      setLastUpdate(new Date());
    }, 15000);
    
    return () => clearInterval(interval);
  }, []);

  // Fetch all complaints for map view
  const fetchAllComplaintsForMap = async () => {
    try {
      setLoadingAllComplaints(true);
      const result = await complaintApi.getAllPublic({ limit: 10000, sort: '-createdAt' });
      setAllComplaints(result.data?.complaints || []);
    } catch (err) {
      console.error("Failed to load all complaints for map:", err);
    } finally {
      setLoadingAllComplaints(false);
    }
  };

  // Load all complaints when map tab is selected
  useEffect(() => {
    if (selectedTab === 'map') {
      fetchAllComplaintsForMap();
      
      // Auto-refresh for map view every 10 seconds
      const interval = setInterval(() => {
        fetchAllComplaintsForMap();
      }, 10000);
      
      return () => clearInterval(interval);
    }
  }, [selectedTab]);

  const handleComplaintSubmit = async (formData: CreateComplaintRequest) => {
    try{
      setIsSubmitting(true);
      await create(formData);
      toast.success("Complaint submitted successfully!");
      setIsModalOpen(false);
      await fetchMy();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to create complaint";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleComplaintClick = (complaint: any) => {
    setSelectedComplaint(complaint);
    setIsDetailsModalOpen(true);
  };

  const handleUpvote = async (e: React.MouseEvent, complaintId: string) => {
    e.stopPropagation(); // Prevent opening details modal
    try {
      const result = await complaintApi.toggleUpvote(complaintId);
      toast.success(result.data.hasUpvoted ? 'Upvoted!' : 'Upvote removed');
      // Refresh complaints to show updated upvote count
      await fetchMy();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to upvote";
      toast.error(message);
    }
  };

  const handleExportCSV = () => {
    exportToCSV(filteredComplaints, 'my-complaints');
    toast.success('Complaints exported as CSV!');
    setShowExportMenu(false);
  };

  const handleExportJSON = () => {
    exportToJSON(filteredComplaints, 'my-complaints');
    toast.success('Complaints exported as JSON!');
    setShowExportMenu(false);
  };

  const handleShareComplaint = async (complaintId: string) => {
    const url = `${window.location.origin}/complaint/${complaintId}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Check out this complaint',
          text: 'I reported this issue on CitizenConnect',
          url: url
        });
        toast.success('Shared successfully!');
      } catch (err) {
        // User cancelled share
      }
    } else {
      // Fallback to copy link
      navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard!');
    }
    setShowShareMenu(null);
  };

  const copyComplaintLink = (complaintId: string) => {
    const url = `${window.location.origin}/complaint/${complaintId}`;
    navigator.clipboard.writeText(url);
    toast.success('Link copied to clipboard!');
    setShowShareMenu(null);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "resolved":
        return <CheckCircle2 className="w-5 h-5 text-teal-400" />;
      case "in-progress":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case "pending":
        return <AlertCircle className="w-5 h-5 text-orange-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved":
        return "bg-teal-500/20 text-teal-300 border-teal-500/30";
      case "in-progress":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
      case "pending":
        return "bg-orange-500/20 text-orange-300 border-orange-500/30";
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    }
  };

  const stats = {
    total: complaints.length,
    pending: complaints.filter((c) => c.status === "pending").length,
    inProgress: complaints.filter((c) => c.status === "in-progress").length,
    resolved: complaints.filter((c) => c.status === "resolved").length,
  };

  const formatLocation = (complaint: any) => {
    const parts = [];
    
    if (complaint.landmark) {
      parts.push(complaint.landmark);
    }
    
    if (complaint.area) {
      parts.push(complaint.area);
    }
    
    if (complaint.city) {
      parts.push(complaint.city);
    }
    
    if (complaint.state) {
      parts.push(complaint.state);
    }
    
    if (complaint.pincode) {
      parts.push(complaint.pincode);
    }
    
    if (parts.length > 0) {
      return parts.join(", ");
    }
    
    return complaint.location?.address || "Unknown Location";
  };

  // Filter complaints based on search, filters, and date range
  const filteredComplaints = complaints.filter((complaint) => {
    const matchesSearch = 
      complaint.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (complaint.location?.address && 
       complaint.location.address.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (complaint.location?.city && 
       complaint.location.city.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (complaint.location?.state && 
       complaint.location.state.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = statusFilter === "all" || complaint.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || complaint.category === categoryFilter;
    
    // Date range filter
    let matchesDateRange = true;
    if (dateRange !== "all") {
      const complaintDate = new Date(complaint.createdAt);
      const now = new Date();
      const daysDiff = Math.floor((now.getTime() - complaintDate.getTime()) / (1000 * 60 * 60 * 24));
      
      switch (dateRange) {
        case "today":
          matchesDateRange = daysDiff === 0;
          break;
        case "week":
          matchesDateRange = daysDiff <= 7;
          break;
        case "month":
          matchesDateRange = daysDiff <= 30;
          break;
        case "year":
          matchesDateRange = daysDiff <= 365;
          break;
      }
    }
    
    return matchesSearch && matchesStatus && matchesCategory && matchesDateRange;
  });

  const categories = Array.from(new Set(complaints.map(c => c.category)));

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setCategoryFilter("all");
    setDateRange("all");
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0a42] via-[#3a1a7e] to-[#2a1a60] text-white">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-md sticky top-0 z-50 bg-[#1a0a42]/95">
        <div className="px-4 sm:px-6 md:px-8 lg:px-12 py-3 sm:py-4 flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center gap-2 sm:gap-3">
            <Logo className="w-8 h-8 sm:w-10 sm:h-10" />
            <div>
              <h1 className="text-base sm:text-xl font-bold">CitizenConnect</h1>
              <p className="text-[10px] sm:text-xs text-gray-400 hidden xs:block">Citizen Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-1 sm:gap-2 md:gap-4">
            <NotificationsDropdown complaints={complaints} />
            <Link
              to="/citizen-profile"
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-white/10 transition-all duration-300 text-gray-400 hover:text-white"
              title="Profile"
            >
              <User className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden lg:inline text-sm">{user?.fullName}</span>
            </Link>
            <button
              onClick={logout}
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-red-500/20 transition-all duration-300 text-gray-400 hover:text-red-300"
              title="Logout"
            >
              <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden lg:inline text-sm">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="px-4 sm:px-6 md:px-8 lg:px-12 py-4 sm:py-6 md:py-8 max-w-7xl mx-auto">
        {/* Navigation Tabs */}
        <div className="flex gap-1 sm:gap-2 mb-6 sm:mb-8 border-b border-white/10 overflow-x-auto scrollbar-hide">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'map', label: 'Map View', icon: Map },
            { id: 'complaints', label: 'My Issues', icon: FileText },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3 border-b-2 font-medium transition-all whitespace-nowrap text-sm sm:text-base ${
                selectedTab === tab.id
                  ? 'text-purple-400 border-purple-400'
                  : 'text-gray-400 border-transparent hover:text-white hover:border-white/30'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {selectedTab === 'overview' && (
          <>
            {/* Hero Banner */}
            <div className="relative rounded-xl sm:rounded-2xl overflow-hidden mb-6 sm:mb-8 h-40 sm:h-48">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-900/95 via-purple-900/70 to-cyan-900/70"></div>
              <div className="absolute inset-0 flex items-center p-4 sm:p-6 md:p-8">
                <div>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2">Welcome back, {user?.fullName}!</h2>
                  <p className="text-gray-300 text-xs sm:text-sm md:text-base mb-1">Help improve your community by reporting civic issues</p>
                  <p className="text-gray-400 text-xs mb-3 sm:mb-4 flex items-center gap-2">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                      Live updates • Last refreshed: {lastUpdate.toLocaleTimeString()}
                    </span>
                  </p>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-lg bg-gradient-to-r from-purple-500 to-teal-400 text-white text-sm sm:text-base font-semibold hover:from-purple-600 hover:to-teal-500 hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 transform hover:scale-105"
                  >
                    <Plus className="w-5 h-5" />
                    File New Complaint
                  </button>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
              <div className="bg-gradient-to-br from-purple-900/40 to-purple-900/20 border border-white/10 rounded-lg sm:rounded-xl p-3 sm:p-4 text-center">
                <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400 mx-auto mb-1 sm:mb-2" />
                <p className="text-xl sm:text-2xl font-bold text-white">{stats.total}</p>
                <p className="text-[10px] sm:text-xs text-gray-400">Total Filed</p>
              </div>
              <div className="bg-gradient-to-br from-orange-500/10 to-orange-900/10 border border-orange-500/30 rounded-xl p-4 text-center">
                <AlertCircle className="w-6 h-6 text-orange-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-orange-400">{stats.pending}</p>
                <p className="text-xs text-gray-400">Pending</p>
              </div>
              <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-900/10 border border-yellow-500/30 rounded-xl p-4 text-center">
                <Clock className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-yellow-400">{stats.inProgress}</p>
                <p className="text-xs text-gray-400">In Progress</p>
              </div>
              <div className="bg-gradient-to-br from-teal-500/10 to-teal-900/10 border border-teal-500/30 rounded-xl p-4 text-center">
                <CheckCircle2 className="w-6 h-6 text-teal-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-teal-400">{stats.resolved}</p>
                <p className="text-xs text-gray-400">Resolved</p>
              </div>
            </div>

            {/* Analytics Chart */}
            <AnalyticsChart complaints={complaints} />

            {/* Recent Issues Preview */}
            <div className="bg-gradient-to-br from-purple-900/40 to-purple-900/20 border border-white/10 rounded-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Recent Issues</h3>
                <button
                  onClick={() => setSelectedTab('complaints')}
                  className="text-purple-400 hover:text-purple-300 text-sm transition-colors"
                >
                  View All →
                </button>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {complaints.slice(0, 3).map((complaint) => (
                  <div
                    key={complaint.id}
                    onClick={() => handleComplaintClick(complaint)}
                    className="bg-white/5 rounded-lg p-4 border border-white/10 hover:border-purple-400/30 transition-all cursor-pointer"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(complaint.status)}`}>
                          {complaint.status?.replace("-", " ")}
                        </span>
                        {complaint.priority && (
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                            complaint.priority === 'high' 
                              ? 'bg-red-500/10 border-red-500/30 text-red-300' 
                              : complaint.priority === 'medium'
                              ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-300'
                              : 'bg-green-500/10 border-green-500/30 text-green-300'
                          }`}>
                            {complaint.priority === 'high' ? '🔴' : complaint.priority === 'medium' ? '🟡' : '🟢'}
                          </span>
                        )}
                      </div>
                      {getStatusIcon(complaint.status)}
                    </div>
                    <h4 className="font-medium mb-2 line-clamp-1">{complaint.title}</h4>
                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">{complaint.description}</p>
                    <div className="flex items-start gap-2 text-xs text-gray-500">
                      <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
                      <span className="line-clamp-2">{formatLocation(complaint)}</span>
                    </div>
                  </div>
                ))}
              </div>
              {complaints.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No complaints filed yet</p>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="mt-4 text-purple-400 hover:text-purple-300 text-sm"
                  >
                    File your first complaint →
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {selectedTab === 'map' && (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2 flex items-center gap-3">
                Nearby Issues Map
                {loadingAllComplaints && <Loader className="w-5 h-5 animate-spin text-cyan-400" />}
              </h2>
              <p className="text-gray-400 text-sm flex items-center gap-2">
                View all complaints on an interactive map
                <span className="flex items-center gap-1 text-xs">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                  Live updates • {allComplaints.length} total complaints
                </span>
              </p>
            </div>
            <NearbyIssuesMap 
              complaints={allComplaints} 
              onComplaintClick={handleComplaintClick}
            />
          </>
        )}

        {selectedTab === 'complaints' && (
          <>
            {/* Search and Filter Section */}
            <div className="mb-4 sm:mb-6 space-y-3 sm:space-y-4">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-between items-start sm:items-center">
                <h2 className="text-xl sm:text-2xl font-bold">All My Issues</h2>
                <div className="flex gap-2 w-full sm:w-auto">
                  {/* Export Dropdown */}
                  <div className="relative flex-1 sm:flex-initial">
                    <button
                      onClick={() => setShowExportMenu(!showExportMenu)}
                      className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-sm sm:text-base font-semibold hover:bg-white/20 transition-all w-full sm:w-auto"
                    >
                      <Download className="w-4 h-4" />
                      <span className="hidden sm:inline">Export</span>
                    </button>
                    {showExportMenu && (
                      <>
                        <div 
                          className="fixed inset-0 z-40" 
                          onClick={() => setShowExportMenu(false)}
                        ></div>
                        <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-white/20 rounded-lg shadow-xl z-50 overflow-hidden">
                          <button
                            onClick={handleExportCSV}
                            className="w-full text-left px-4 py-3 hover:bg-purple-500/20 transition-colors flex items-center gap-2"
                          >
                            <FileText className="w-4 h-4" />
                            <span className="text-sm">Export as CSV</span>
                          </button>
                          <button
                            onClick={handleExportJSON}
                            className="w-full text-left px-4 py-3 hover:bg-purple-500/20 transition-colors flex items-center gap-2 border-t border-white/10"
                          >
                            <FileText className="w-4 h-4" />
                            <span className="text-sm">Export as JSON</span>
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-teal-400 text-white font-semibold hover:shadow-lg transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    New Issue
                  </button>
                </div>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by title, description, or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:border-purple-400/50 transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-3 items-center">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-400">Filters:</span>
                </div>
                
                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-400/50 transition-all cursor-pointer"
                >
                  <option value="all" className="bg-gray-900">All Status</option>
                  <option value="pending" className="bg-gray-900">Pending</option>
                  <option value="in-progress" className="bg-gray-900">In Progress</option>
                  <option value="resolved" className="bg-gray-900">Resolved</option>
                </select>

                {/* Category Filter */}
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-400/50 transition-all cursor-pointer"
                >
                  <option value="all" className="bg-gray-900">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat} className="bg-gray-900">
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>

                {/* Date Range Filter */}
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-400/50 transition-all cursor-pointer flex items-center gap-2"
                >
                  <option value="all" className="bg-gray-900">All Time</option>
                  <option value="today" className="bg-gray-900">Today</option>
                  <option value="week" className="bg-gray-900">Last Week</option>
                  <option value="month" className="bg-gray-900">Last Month</option>
                  <option value="year" className="bg-gray-900">This Year</option>
                </select>

                {/* Clear Filters */}
                {(searchQuery || statusFilter !== "all" || categoryFilter !== "all" || dateRange !== "all") && (
                  <button
                    onClick={clearFilters}
                    className="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm hover:bg-red-500/20 transition-all flex items-center gap-1"
                  >
                    <X className="w-3 h-3" />
                    Clear Filters
                  </button>
                )}

                {/* Results Count */}
                <span className="ml-auto text-sm text-gray-400">
                  Showing {filteredComplaints.length} of {complaints.length} issues
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
              {loading ? (
                Array(6).fill(0).map((_, i) => (
                  <div key={i} className="bg-white/5 rounded-xl p-6 animate-pulse">
                    <div className="h-4 bg-white/10 rounded w-3/4 mb-4"></div>
                    <div className="h-3 bg-white/10 rounded w-full mb-2"></div>
                    <div className="h-3 bg-white/10 rounded w-2/3"></div>
                  </div>
                ))
              ) : filteredComplaints.length > 0 ? (
                filteredComplaints.map((complaint) => (
                  <div
                    key={complaint.id}
                    onClick={() => handleComplaintClick(complaint)}
                    className="bg-gradient-to-br from-purple-900/40 to-purple-900/20 border border-white/10 rounded-xl p-6 hover:border-purple-400/30 transition-all group cursor-pointer"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(complaint.status)}`}>
                          {complaint.status?.replace("-", " ")}
                        </span>
                        {complaint.priority && (
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                            complaint.priority === 'high' 
                              ? 'bg-red-500/10 border-red-500/30 text-red-300' 
                              : complaint.priority === 'medium'
                              ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-300'
                              : 'bg-green-500/10 border-green-500/30 text-green-300'
                          }`}>
                            {complaint.priority === 'high' ? '🔴' : complaint.priority === 'medium' ? '🟡' : '🟢'} {complaint.priority}
                          </span>
                        )}
                      </div>
                      {getStatusIcon(complaint.status)}
                    </div>
                    <h3 className="text-lg font-bold mb-2 group-hover:text-purple-300 transition-colors line-clamp-2">
                      {complaint.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-3">{complaint.description}</p>
                    <div className="flex items-start gap-2 text-sm text-gray-500 mb-3">
                      <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span className="line-clamp-2">{formatLocation(complaint)}</span>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center text-xs text-gray-500">
                      <span>{complaint.category?.charAt(0).toUpperCase() + complaint.category?.slice(1)}</span>
                      <div className="flex items-center gap-3">
                        <span>{new Date(complaint.createdAt).toLocaleDateString()}</span>
                        
                        {/* Upvote Button */}
                        <button
                          onClick={(e) => handleUpvote(e, complaint.id)}
                          className={`flex items-center gap-1 px-2 py-1 rounded-lg transition-all ${
                            complaint.upvotes?.includes(user?.id)
                              ? 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/30'
                              : 'hover:bg-white/10 text-gray-400 hover:text-purple-400'
                          }`}
                          title="Support this issue"
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                          <span className="text-xs font-medium">{complaint.upvotes?.length || 0}</span>
                        </button>

                        <div className="relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowShareMenu(showShareMenu === complaint.id ? null : complaint.id);
                            }}
                            className="p-1.5 rounded-lg hover:bg-white/10 transition-all text-gray-400 hover:text-purple-400"
                            title="Share complaint"
                          >
                            <Share2 className="w-4 h-4" />
                          </button>
                          {showShareMenu === complaint.id && (
                            <>
                              <div 
                                className="fixed inset-0 z-40" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setShowShareMenu(null);
                                }}
                              ></div>
                              <div className="absolute right-0 bottom-full mb-2 w-40 bg-slate-900 border border-white/20 rounded-lg shadow-xl z-50 overflow-hidden">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleShareComplaint(complaint.id);
                                  }}
                                  className="w-full text-left px-3 py-2 hover:bg-purple-500/20 transition-colors flex items-center gap-2 text-sm"
                                >
                                  <Share2 className="w-3 h-3" />
                                  <span>Share</span>
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    copyComplaintLink(complaint.id);
                                  }}
                                  className="w-full text-left px-3 py-2 hover:bg-purple-500/20 transition-colors flex items-center gap-2 border-t border-white/10 text-sm"
                                >
                                  <Copy className="w-3 h-3" />
                                  <span>Copy Link</span>
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12 text-gray-400">
                  <MapPin className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg mb-2">No complaints found</p>
                  {(searchQuery || statusFilter !== "all" || categoryFilter !== "all") ? (
                    <div className="space-y-2">
                      <p className="text-sm text-gray-500">Try adjusting your search or filters</p>
                      <button
                        onClick={clearFilters}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-300 hover:bg-purple-500/20 transition-all text-sm"
                      >
                        <X className="w-4 h-4" />
                        Clear All Filters
                      </button>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">File your first complaint to get started</p>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Complaint Modal */}
      <ComplaintModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleComplaintSubmit}
      />

      {/* Complaint Details Modal */}
      <ComplaintDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        complaint={selectedComplaint}
      />
    </div>
  );
}
