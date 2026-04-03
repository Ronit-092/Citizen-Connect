import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  MapPin,
  CheckCircle2,
  Clock,
  AlertCircle,
  LogOut,
  Zap,
  BarChart3,
  Loader,
  Search,
  Filter,
  X,
  TrendingUp,
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  Download,
  ThumbsUp,
  MessageSquare,
  Calendar,
  User,
  Image as ImageIcon,
} from "lucide-react";
import MiniMap from "../components/MiniMap";
import { useAuth } from "../hooks/use-auth";
import { complaintApi } from "../lib/api";
import type { Complaint } from "@shared/api";

export default function GovtDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<"pending" | "in-progress" | "resolved">("pending");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedPriority, setSelectedPriority] = useState<string>("all");
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [updateRemark, setUpdateRemark] = useState("");
  const [loadingComplaints, setLoadingComplaints] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updatingComplaint, setUpdatingComplaint] = useState(false);
  
  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  
  // Bulk Actions
  const [selectedComplaints, setSelectedComplaints] = useState<Set<string>>(new Set());
  const [showBulkActions, setShowBulkActions] = useState(false);
  
  // Analytics
  const [analytics, setAnalytics] = useState<any>(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);
  
  // Image Lightbox
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Load complaints when status changes
  useEffect(() => {
    loadComplaints();
    setLastUpdate(new Date());
  }, [selectedStatus]);

  // Set up auto-refresh
  useEffect(() => {
    const interval = setInterval(() => {
      loadComplaints();
      setLastUpdate(new Date());
    }, 20000);
    
    return () => clearInterval(interval);
  }, [selectedStatus]); // Recreate interval when status changes

  const loadComplaints = async () => {
    setLoadingComplaints(true);
    setError(null);
    try {
      const result = await complaintApi.getByStatus(selectedStatus);
      setComplaints(result.data.complaints || []);
    } catch (err) {
      console.error("Failed to load complaints:", err);
      toast.error("Failed to load complaints");
      setError("Failed to load complaints");
    } finally {
      setLoadingComplaints(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim() && !dateFrom && !dateTo && selectedCategory === "all" && selectedPriority === "all") {
      loadComplaints();
      return;
    }

    setLoadingComplaints(true);
    setError(null);
    try {
      const result = await complaintApi.search({
        q: searchQuery,
        status: selectedStatus,
        category: selectedCategory !== "all" ? selectedCategory : undefined,
        priority: selectedPriority !== "all" ? selectedPriority : undefined,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
      });
      setComplaints(result.data.complaints || []);
    } catch (err) {
      console.error("Search failed:", err);
      toast.error("Search failed");
      setError("Search failed");
    } finally {
      setLoadingComplaints(false);
    }
  };

  const loadAnalytics = async () => {
    setLoadingAnalytics(true);
    try {
      const result = await complaintApi.getAnalytics(30);
      // Transform the data to match frontend expectations
      const transformedData = {
        byCategory: result.data.categories || [],
        byPriority: result.data.priorities || [],
        byStatus: result.data.statuses || [],
        trend: result.data.trend || [],
        avgResolutionTime: result.data.avgResolutionTime 
          ? result.data.avgResolutionTime / (1000 * 60 * 60 * 24) // Convert milliseconds to days
          : 0
      };
      console.log("Analytics data loaded:", transformedData);
      setAnalytics(transformedData);
      setShowAnalytics(true);
    } catch (err) {
      console.error("Failed to load analytics:", err);
      toast.error("Failed to load analytics");
    } finally {
      setLoadingAnalytics(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "resolved":
        return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
      case "in-progress":
        return <Clock className="w-5 h-5 text-yellow-400" />;
      case "pending":
        return <AlertCircle className="w-5 h-5 text-orange-400" />;
      default:
        return null;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-500/20 text-red-300 border-red-500/30";
      case "high":
        return "bg-orange-500/20 text-orange-300 border-orange-500/30";
      case "medium":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
      case "low":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved":
        return "bg-primary/20 text-primary border-primary/30";
      case "in-progress":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
      case "pending":
        return "bg-orange-500/20 text-orange-300 border-orange-500/30";
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    }
  };

  const filteredComplaints = complaints.filter((complaint) => {
    const matchesCategory =
      selectedCategory === "all" || complaint.category === selectedCategory;
    const matchesPriority =
      selectedPriority === "all" || complaint.priority === selectedPriority;
    return matchesCategory && matchesPriority;
  });

  const handleStatusUpdate = async (
    complaintId: string,
    newStatus: "pending" | "in-progress" | "resolved",
  ) => {
    setUpdatingComplaint(true);
    try {
      await complaintApi.updateStatus(complaintId, { status: newStatus });
      if (selectedComplaint?.id === complaintId) {
        setSelectedComplaint({ ...selectedComplaint, status: newStatus });
      }
      toast.success(`Status updated to ${newStatus.replace("-", " ")}`);
      await loadComplaints();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to update status";
      toast.error(msg);
      console.error("Failed to update status:", err);
    } finally {
      setUpdatingComplaint(false);
    }
  };

  const handlePriorityUpdate = async (complaintId: string, newPriority: string) => {
    setUpdatingComplaint(true);
    try {
      await complaintApi.updatePriority(complaintId, newPriority);
      if (selectedComplaint?.id === complaintId) {
        setSelectedComplaint({ ...selectedComplaint, priority: newPriority as any });
      }
      toast.success(`Priority updated to ${newPriority}`);
      await loadComplaints();
    } catch (err) {
      toast.error("Failed to update priority");
    } finally {
      setUpdatingComplaint(false);
    }
  };

  const handleAddRemark = async () => {
    if (selectedComplaint && updateRemark.trim()) {
      setUpdatingComplaint(true);
      try {
        await complaintApi.addRemark(selectedComplaint.id, { text: updateRemark });
        setUpdateRemark("");
        toast.success("Remark added successfully!");
        await loadComplaints();
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to add remark";
        toast.error(msg);
        console.error("Failed to add remark:", err);
      } finally {
        setUpdatingComplaint(false);
      }
    }
  };

  const handleBulkUpdate = async (updates: Record<string, any>) => {
    if (selectedComplaints.size === 0) {
      toast.error("Please select complaints first");
      return;
    }

    setLoadingComplaints(true);
    try {
      const result = await complaintApi.bulkUpdate(Array.from(selectedComplaints), updates);
      toast.success(`Updated ${result.data.modifiedCount} complaints`);
      setSelectedComplaints(new Set());
      setShowBulkActions(false);
      await loadComplaints();
    } catch (err) {
      toast.error("Bulk update failed");
    } finally {
      setLoadingComplaints(false);
    }
  };

  const toggleComplaintSelection = (id: string) => {
    const newSet = new Set(selectedComplaints);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedComplaints(newSet);
  };

  const selectAllComplaints = () => {
    if (selectedComplaints.size === filteredComplaints.length) {
      setSelectedComplaints(new Set());
    } else {
      setSelectedComplaints(new Set(filteredComplaints.map(c => c.id)));
    }
  };

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const nextImage = () => {
    if (selectedComplaint?.images) {
      setCurrentImageIndex((prev) => 
        prev < selectedComplaint.images.length - 1 ? prev + 1 : 0
      );
    }
  };

  const prevImage = () => {
    if (selectedComplaint?.images) {
      setCurrentImageIndex((prev) => 
        prev > 0 ? prev - 1 : selectedComplaint.images.length - 1
      );
    }
  };

  const exportComplaint = (complaint: Complaint) => {
    const exportData = {
      id: complaint.id,
      title: complaint.title,
      description: complaint.description,
      category: complaint.category,
      status: complaint.status,
      priority: complaint.priority || "medium",
      location: complaint.location?.address,
      coordinates: complaint.location ? `${complaint.location.latitude}, ${complaint.location.longitude}` : "N/A",
      upvotes: complaint.upvotes || 0,
      reportedBy: complaint.citizen?.id || complaint.citizen?.fullName || "Unknown",
      createdAt: new Date(complaint.createdAt || "").toLocaleString(),
      remarks: complaint.remarks || [],
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `complaint-${complaint.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Complaint exported successfully");
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const stats = {
    total: complaints.length,
    pending: complaints.filter((c) => c.status === "pending").length,
    inProgress: complaints.filter((c) => c.status === "in-progress").length,
    resolved: complaints.filter((c) => c.status === "resolved").length,
    urgent: complaints.filter((c) => c.priority === "urgent").length,
    high: complaints.filter((c) => c.priority === "high").length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0a42] via-[#3a1a7e] to-[#2a1a60] text-white overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-float-delayed" />
      </div>

      {/* Header */}
      {/* Navbar  */}
      <header className="border-b border-white/10 backdrop-blur-md sticky top-0 z-50">
        <div className="px-4 sm:px-6 lg:px-12 py-3 sm:py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 max-w-7xl mx-auto">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center">
              <BarChart3 className="w-4 sm:w-5 h-4 sm:h-5 text-black" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold">
                {user ? `Welcome, ${user.fullName}` : "Admin Dashboard"}
              </h1>
              <p className="text-xs sm:text-sm text-gray-400 flex items-center gap-2">
                {user?.department ? `${user.department} Department` : "Manage & resolve issues"}
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                  Live • {lastUpdate.toLocaleTimeString()}
                </span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={loadAnalytics}
              disabled={loadingAnalytics}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 transition-all text-cyan-400 border border-cyan-400/30 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loadingAnalytics ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <TrendingUp className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">
                {loadingAnalytics ? "Loading..." : "Analytics"}
              </span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all text-gray-400 hover:text-white border border-white/20 text-sm sm:text-base"
            >
              <LogOut className="w-4 sm:w-5 h-4 sm:h-5" />
              <span className="hidden sm:inline">Logout</span>
              <span className="sm:hidden">Exit</span>
            </button>
          </div>
        </div>
      </header>

      <div className="relative z-10 px-4 sm:px-6 lg:px-12 py-8 sm:py-12 max-w-7xl mx-auto">
       
       
        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
          <div className="bg-gradient-to-br from-cyan-500/10 to-blue-900/20 border border-cyan-400/30 rounded-xl p-4 sm:p-6 text-center group hover:border-cyan-400/50 transition-all">
            <div className="text-2xl sm:text-4xl font-bold text-cyan-400 mb-1 sm:mb-2">
              {stats.total}
            </div>
            <p className="text-xs sm:text-sm text-gray-400">Total Reports</p>
          </div>
          <div className="bg-gradient-to-br from-orange-500/10 to-red-900/20 border border-orange-400/30 rounded-xl p-4 sm:p-6 text-center group hover:border-orange-400/50 transition-all">
            <div className="text-2xl sm:text-4xl font-bold text-orange-400 mb-1 sm:mb-2">
              {stats.pending}
            </div>
            <p className="text-xs sm:text-sm text-gray-400">Needs Review</p>
          </div>
          <div className="bg-gradient-to-br from-yellow-500/10 to-orange-900/20 border border-yellow-400/30 rounded-xl p-4 sm:p-6 text-center group hover:border-yellow-400/50 transition-all">
            <div className="text-2xl sm:text-4xl font-bold text-yellow-400 mb-1 sm:mb-2">
              {stats.inProgress}
            </div>
            <p className="text-xs sm:text-sm text-gray-400">In Progress</p>
          </div>
          <div className="bg-gradient-to-br from-emerald-500/10 to-green-900/20 border border-emerald-400/30 rounded-xl p-4 sm:p-6 text-center group hover:border-emerald-400/50 transition-all">
            <div className="text-2xl sm:text-4xl font-bold text-emerald-400 mb-1 sm:mb-2">
              {stats.resolved}
            </div>
            <p className="text-xs sm:text-sm text-gray-400">Completed</p>
          </div>
          <div className="bg-gradient-to-br from-red-500/10 to-pink-900/20 border border-red-400/30 rounded-xl p-4 sm:p-6 text-center group hover:border-red-400/50 transition-all">
            <div className="text-2xl sm:text-4xl font-bold text-red-400 mb-1 sm:mb-2">
              {stats.urgent}
            </div>
            <p className="text-xs sm:text-sm text-gray-400">Urgent</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500/10 to-indigo-900/20 border border-purple-400/30 rounded-xl p-4 sm:p-6 text-center group hover:border-purple-400/50 transition-all">
            <div className="text-2xl sm:text-4xl font-bold text-purple-400 mb-1 sm:mb-2">
              {stats.high}
            </div>
            <p className="text-xs sm:text-sm text-gray-400">High Priority</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Reports List */}
          <div className="md:col-span-2">
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-white/10 rounded-xl p-6">
              {/* Search and Filter Bar */}
              <div className="mb-6 space-y-4">
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="text"
                      placeholder="Search by title, description, or address..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-black/30 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-cyan-400/50 focus:outline-none text-sm"
                    />
                  </div>
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`px-4 py-2 rounded-lg border transition-all flex items-center gap-2 ${
                      showFilters
                        ? "bg-cyan-500/20 border-cyan-400/50 text-cyan-400"
                        : "bg-black/30 border-white/10 text-gray-400 hover:border-cyan-400/30"
                    }`}
                  >
                    <Filter className="w-4 h-4" />
                    <span className="hidden sm:inline">Filters</span>
                  </button>
                  {selectedComplaints.size > 0 && (
                    <button
                      onClick={() => setShowBulkActions(!showBulkActions)}
                      className="px-4 py-2 rounded-lg bg-purple-500/20 border border-purple-400/50 text-purple-400 hover:bg-purple-500/30 transition-all flex items-center gap-2"
                    >
                      <CheckSquare className="w-4 h-4" />
                      <span className="hidden sm:inline">
                        {selectedComplaints.size} Selected
                      </span>
                    </button>
                  )}
                </div>

                {/* Advanced Filters */}
                {showFilters && (
                  <div className="bg-black/30 border border-white/10 rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-cyan-400">
                        Advanced Filters
                      </h3>
                      <button
                        onClick={() => {
                          setShowFilters(false);
                          handleSearch();
                        }}
                        className="text-xs text-gray-400 hover:text-white transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-gray-400 mb-1 block">
                          Category
                        </label>
                        <select
                          value={selectedCategory}
                          onChange={(e) =>
                            setSelectedCategory(
                              e.target.value as typeof selectedCategory
                            )
                          }
                          className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white text-sm focus:border-cyan-400/50 focus:outline-none"
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
                        <label className="text-xs text-gray-400 mb-1 block">
                          Priority
                        </label>
                        <select
                          value={selectedPriority}
                          onChange={(e) =>
                            setSelectedPriority(
                              e.target.value as typeof selectedPriority
                            )
                          }
                          className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white text-sm focus:border-cyan-400/50 focus:outline-none"
                        >
                          <option value="all">All Priorities</option>
                          <option value="urgent">Urgent</option>
                          <option value="high">High</option>
                          <option value="medium">Medium</option>
                          <option value="low">Low</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs text-gray-400 mb-1 block">
                          Date From
                        </label>
                        <input
                          type="date"
                          value={dateFrom}
                          onChange={(e) => setDateFrom(e.target.value)}
                          className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white text-sm focus:border-cyan-400/50 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-400 mb-1 block">
                          Date To
                        </label>
                        <input
                          type="date"
                          value={dateTo}
                          onChange={(e) => setDateTo(e.target.value)}
                          className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white text-sm focus:border-cyan-400/50 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Bulk Actions Toolbar */}
                {showBulkActions && selectedComplaints.size > 0 && (
                  <div className="bg-purple-500/10 border border-purple-400/30 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold text-purple-400">
                        Bulk Actions ({selectedComplaints.size} selected)
                      </h3>
                      <button
                        onClick={() => {
                          selectedComplaints.clear();
                          setShowBulkActions(false);
                        }}
                        className="text-xs text-gray-400 hover:text-white transition-colors flex items-center gap-1"
                      >
                        <X className="w-3 h-3" />
                        Clear
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() =>
                          handleBulkUpdate({ status: "in-progress" })
                        }
                        className="px-3 py-1.5 bg-yellow-500/20 border border-yellow-400/30 text-yellow-400 rounded-lg text-xs hover:bg-yellow-500/30 transition-all"
                      >
                        Mark In Progress
                      </button>
                      <button
                        onClick={() => handleBulkUpdate({ status: "resolved" })}
                        className="px-3 py-1.5 bg-emerald-500/20 border border-emerald-400/30 text-emerald-400 rounded-lg text-xs hover:bg-emerald-500/30 transition-all"
                      >
                        Mark Resolved
                      </button>
                      <button
                        onClick={() => handleBulkUpdate({ priority: "urgent" })}
                        className="px-3 py-1.5 bg-red-500/20 border border-red-400/30 text-red-400 rounded-lg text-xs hover:bg-red-500/30 transition-all"
                      >
                        Set Urgent
                      </button>
                      <button
                        onClick={() => handleBulkUpdate({ priority: "high" })}
                        className="px-3 py-1.5 bg-orange-500/20 border border-orange-400/30 text-orange-400 rounded-lg text-xs hover:bg-orange-500/30 transition-all"
                      >
                        Set High
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="mb-6 pb-4 border-b border-white/10">
                <p className="text-xs text-cyan-400 mb-3 font-semibold tracking-wider">
                  ▐ FILTER BY STATUS
                </p>
                <div className="flex gap-2 mb-4">
                  {["pending", "in-progress", "resolved"].map((status) => (
                    <button
                      key={status}
                      onClick={() => {
                        setSelectedStatus(status as "pending" | "in-progress" | "resolved");
                        setSelectedComplaint(null);
                      }}
                      disabled={loadingComplaints}
                      className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all uppercase tracking-widest ${
                        selectedStatus === status
                          ? "bg-gradient-to-r from-cyan-400 to-emerald-400 text-black border border-cyan-300"
                          : "bg-white/10 text-gray-400 hover:bg-white/20 border border-white/20"
                      } ${loadingComplaints ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      {status === "in-progress" ? "In Progress" : status}
                    </button>
                  ))}
                </div>

                <p className="text-xs text-emerald-400 mb-3 font-semibold tracking-wider">
                  ▐ CATEGORY FILTER
                </p>
                <div className="flex flex-wrap gap-2">
                  {["all", "road", "water", "utilities", "health"].map(
                    (category) => (
                      <button
                        key={category}
                        onClick={() => {
                          setSelectedCategory(category);
                          setSelectedComplaint(null);
                        }}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                          selectedCategory === category
                            ? "bg-emerald-400/30 text-emerald-300 border border-emerald-400/50"
                            : "bg-white/10 text-gray-400 hover:bg-white/20 border border-white/20"
                        }`}
                      >
                        {category === "all" ? "All" : category}
                      </button>
                    ),
                  )}
                </div>
              </div>

              {/* Select All Checkbox */}
              <div className="mb-4 flex items-center gap-2 px-2">
                <input
                  type="checkbox"
                  checked={
                    filteredComplaints.length > 0 &&
                    selectedComplaints.size === filteredComplaints.length
                  }
                  onChange={selectAllComplaints}
                  className="w-4 h-4 rounded border-white/20 bg-black/30 text-cyan-400 focus:ring-cyan-400 focus:ring-offset-0"
                />
                <label className="text-sm text-gray-400">
                  Select All ({filteredComplaints.length})
                </label>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
                {loadingComplaints ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader className="w-8 h-8 text-cyan-400 animate-spin" />
                  </div>
                ) : error ? (
                  <div className="text-center py-12">
                    <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                ) : filteredComplaints.length > 0 ? (
                  filteredComplaints.map((complaint, idx) => {
                    // Debug: Log the first complaint to see structure
                    if (idx === 0) {
                      console.log('First complaint data:', {
                        id: complaint.id,
                        images: complaint.images,
                        imageCount: Array.isArray(complaint.images) ? complaint.images.length : 'not an array'
                      });
                    }
                    return (
                    <div
                      key={complaint.id}
                      style={{ animationDelay: `${idx * 0.1}s` }}
                      className={`group p-4 rounded-lg transition-all border ${
                        selectedComplaint?.id === complaint.id
                          ? "bg-cyan-400/20 border-cyan-400/50 scale-102"
                          : "bg-white/5 border-white/10 hover:border-cyan-400/30 hover:bg-white/[0.08]"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={selectedComplaints.has(complaint.id)}
                          onChange={(e) => {
                            e.stopPropagation();
                            toggleComplaintSelection(complaint.id);
                          }}
                          onClick={(e) => e.stopPropagation()}
                          className="mt-1 w-4 h-4 rounded border-white/20 bg-black/30 text-cyan-400 focus:ring-cyan-400 focus:ring-offset-0"
                        />
                        <div
                          onClick={() => setSelectedComplaint(complaint)}
                          className="flex-1 min-w-0 cursor-pointer"
                        >
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <div className="flex items-center gap-2 flex-1">
                              <div className="mt-0.5">{getStatusIcon(complaint.status)}</div>
                              <h3 className="font-semibold truncate flex-1">
                              {complaint.title}
                            </h3>
                            </div>
                            <div className="flex items-center gap-2">
                              <span
                                className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider shadow-lg ${
                                  (complaint.priority || "medium") === "urgent"
                                    ? "bg-gradient-to-r from-red-500 to-pink-500 text-white border border-red-400"
                                    : (complaint.priority || "medium") === "high"
                                    ? "bg-gradient-to-r from-orange-500 to-red-500 text-white border border-orange-400"
                                    : (complaint.priority || "medium") === "medium"
                                    ? "bg-gradient-to-r from-yellow-500 to-orange-400 text-black border border-yellow-400"
                                    : "bg-gradient-to-r from-blue-500 to-cyan-500 text-white border border-blue-400"
                                }`}
                              >
                                {complaint.priority || "medium"}
                              </span>
                              <span className="text-xs text-cyan-400 whitespace-nowrap">
                                #{complaint.id}
                              </span>
                            </div>
                          </div>
                          <p className="text-xs text-orange-400/80 mb-2 uppercase tracking-wider">
                            👤 {complaint.citizen?.fullName || complaint.citizen?.username || "Unknown"}
                          </p>
                          <p className="text-sm text-gray-300 line-clamp-2 mb-3">
                            {complaint.description}
                          </p>
                          <div className="flex items-center gap-4 text-xs pt-2 border-t border-white/10">
                            <div className="flex items-center gap-1.5 text-purple-400 font-semibold">
                              <ThumbsUp className="w-4 h-4" />
                              <span>{complaint.upvoteCount || (complaint.upvotes as any)?.length || 0}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-orange-400 font-semibold">
                              <ImageIcon className="w-4 h-4" />
                              <span>{Array.isArray(complaint.images) ? complaint.images.length : 0}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                              <MessageSquare className="w-4 h-4" />
                              <span>{Array.isArray(complaint.remarks) ? complaint.remarks.length : 0}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    );
                  })
                ) : (
                  <div className="text-center py-12">
                    <AlertCircle className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">
                      No complaints with this status
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Complaint Details */}
          <div>
            {selectedComplaint ? (
              <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-white/10 rounded-xl p-6 sticky top-20 max-h-[calc(100vh-120px)] overflow-y-auto custom-scrollbar">
                <div className="mb-4 pb-4 border-b border-white/10 flex items-start justify-between">
                  <div className="flex-1">
                    <h2 className="text-lg font-bold leading-tight">
                      {selectedComplaint.title}
                    </h2>
                    <p className="text-xs text-cyan-400 mt-1 tracking-wider uppercase">
                      ID: {selectedComplaint.id}
                    </p>
                  </div>
                  <button
                    onClick={() => exportComplaint(selectedComplaint)}
                    className="p-2 rounded-lg bg-cyan-500/20 border border-cyan-400/50 text-cyan-400 hover:bg-cyan-500/30 transition-all"
                    title="Export complaint"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2 mb-4 pb-4 border-b border-white/10">
                  {(selectedComplaint.upvoteCount !== undefined || selectedComplaint.upvotes !== undefined) && (
                    <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-400/30 rounded-lg">
                      <ThumbsUp className="w-4 h-4 text-purple-400" />
                      <div>
                        <p className="text-xs text-purple-400 font-semibold">
                          COMMUNITY SUPPORT
                        </p>
                        <p className="text-sm font-bold text-white">
                          {selectedComplaint.upvoteCount || (selectedComplaint.upvotes as any)?.length || 0} citizen{((selectedComplaint.upvoteCount || (selectedComplaint.upvotes as any)?.length || 0) !== 1) ? 's' : ''} upvoted this issue
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Engagement Stats */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-gradient-to-br from-purple-500/10 to-purple-900/20 border border-purple-400/30 rounded-lg p-2 text-center">
                      <ThumbsUp className="w-4 h-4 text-purple-400 mx-auto mb-1" />
                      <div className="text-xl font-bold text-purple-400">
                        {selectedComplaint.upvoteCount || (selectedComplaint.upvotes as any)?.length || 0}
                      </div>
                      <div className="text-[10px] text-gray-400">Upvotes</div>
                    </div>
                    <div className="bg-gradient-to-br from-orange-500/10 to-orange-900/20 border border-orange-400/30 rounded-lg p-2 text-center">
                      <ImageIcon className="w-4 h-4 text-orange-400 mx-auto mb-1" />
                      <div className="text-xl font-bold text-orange-400">
                        {selectedComplaint.images?.length || 0}
                      </div>
                      <div className="text-[10px] text-gray-400">Photos</div>
                    </div>
                    <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-900/20 border border-emerald-400/30 rounded-lg p-2 text-center">
                      <MessageSquare className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                      <div className="text-xl font-bold text-emerald-400">
                        {selectedComplaint.remarks?.length || 0}
                      </div>
                      <div className="text-[10px] text-gray-400">Updates</div>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-cyan-400 mb-1 font-semibold tracking-widest">
                      ▐ REPORTER
                    </p>
                    <p className="text-sm">{selectedComplaint.citizen?.fullName || selectedComplaint.citizen?.username || "Unknown"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-cyan-400 mb-1 font-semibold tracking-widest">
                      ▐ LOCATION
                    </p>
                    <p className="text-sm flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span className="break-words">{selectedComplaint.location?.address || "Unknown Location"}</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-cyan-400 mb-1 font-semibold tracking-widest">
                      ▐ CATEGORY
                    </p>
                    <p className="text-xs capitalize px-2 py-1 rounded bg-white/10 border border-white/20 w-fit">
                      {selectedComplaint.category.replace("_", " ")}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-cyan-400 mb-1 font-semibold tracking-widest">
                      ▐ FILED
                    </p>
                    <p className="text-sm">{new Date(selectedComplaint.createdAt || "").toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Priority Update Section */}
                <div className="mb-4 pb-4 border-b border-white/10">
                  <p className="text-xs text-purple-400 mb-2 font-semibold tracking-widest">
                    ▐ PRIORITY LEVEL
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {["urgent", "high", "medium", "low"].map((priority) => (
                      <button
                        key={priority}
                        onClick={() => handlePriorityUpdate(selectedComplaint.id, priority as "urgent" | "high" | "medium" | "low")}
                        className={`px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all shadow-lg ${
                          (selectedComplaint.priority || "medium") === priority
                            ? priority === "urgent"
                              ? "bg-gradient-to-r from-red-500 to-pink-500 text-white border-2 border-red-400 scale-105"
                              : priority === "high"
                              ? "bg-gradient-to-r from-orange-500 to-red-500 text-white border-2 border-orange-400 scale-105"
                              : priority === "medium"
                              ? "bg-gradient-to-r from-yellow-500 to-orange-400 text-black border-2 border-yellow-400 scale-105"
                              : "bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-2 border-blue-400 scale-105"
                            : "bg-white/5 text-gray-400 hover:bg-white/10 border border-white/20 hover:border-white/40"
                        }`}
                      >
                        {priority}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-4 pb-4 border-b border-white/10">
                  <p className="text-xs text-emerald-400 mb-1 font-semibold tracking-widest">
                    ▐ DETAILS
                  </p>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {selectedComplaint.description}
                  </p>
                </div>

                {/* Images */}
                {selectedComplaint.images && selectedComplaint.images.length > 0 && (
                  <div className="mb-4 pb-4 border-b border-white/10">
                    <p className="text-xs text-orange-400 mb-2 font-semibold tracking-widest flex items-center gap-2">
                      ▐ UPLOADED IMAGES
                      <span className="px-1.5 py-0.5 bg-orange-500/20 rounded text-[10px]">
                        {selectedComplaint.images.length}
                      </span>
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedComplaint.images.map((image, index) => (
                        <div
                          key={index}
                          className="relative group rounded-lg overflow-hidden border border-white/10 hover:border-orange-400/50 transition-all cursor-pointer aspect-video"
                        >
                          <img
                            src={typeof image === 'string' ? image : image.url}
                            alt={`Evidence ${index + 1}`}
                            onClick={() => openLightbox(index)}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-2">
                            <span className="text-[10px] text-white font-semibold">
                              #{index + 1}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(typeof image === 'string' ? image : image.url, '_blank');
                              }}
                              className="text-orange-400 hover:text-orange-300"
                            >
                              <ImageIcon className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Location Map */}
                {selectedComplaint.location?.latitude && selectedComplaint.location?.longitude && (
                  <div className="mb-4 pb-4 border-b border-white/10">
                    <p className="text-xs text-emerald-400 mb-2 font-semibold tracking-widest">
                      ▐ LOCATION MAP
                    </p>
                    <div className="border border-white/10 rounded-lg overflow-hidden">
                      <MiniMap
                        latitude={selectedComplaint.location.latitude}
                        longitude={selectedComplaint.location.longitude}
                        title={selectedComplaint.title}
                      />
                    </div>
                  </div>
                )}

                {/* Status Update */}
                <div className="mb-4 pb-4 border-b border-white/10">
                  <p className="text-xs text-cyan-400 mb-2 font-semibold tracking-widest">
                    ▐ UPDATE STATUS
                  </p>
                  <div className="space-y-2">
                    <button
                      onClick={() =>
                        handleStatusUpdate(selectedComplaint.id, "in-progress")
                      }
                      disabled={updatingComplaint}
                      className={`w-full px-3 py-2 rounded-lg text-xs font-semibold transition-all uppercase tracking-widest ${
                        selectedComplaint.status === "in-progress"
                          ? "bg-yellow-400/30 border border-yellow-400/50 text-yellow-300"
                          : "bg-white/10 border border-white/20 text-gray-400 hover:bg-white/20"
                      } ${updatingComplaint ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      {updatingComplaint ? (
                        <Loader className="w-3 h-3 inline mr-2 animate-spin" />
                      ) : (
                        "⚡"
                      )}{" "}
                      IN PROGRESS
                    </button>
                    <button
                      onClick={() =>
                        handleStatusUpdate(selectedComplaint.id, "resolved")
                      }
                      disabled={updatingComplaint}
                      className={`w-full px-3 py-2 rounded-lg text-xs font-semibold transition-all uppercase tracking-widest ${
                        selectedComplaint.status === "resolved"
                          ? "bg-emerald-400/30 border border-emerald-400/50 text-emerald-300"
                          : "bg-white/10 border border-white/20 text-gray-400 hover:bg-white/20"
                      } ${updatingComplaint ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      {updatingComplaint ? (
                        <Loader className="w-3 h-3 inline mr-2 animate-spin" />
                      ) : (
                        "✓"
                      )}{" "}
                      RESOLVED
                    </button>
                  </div>
                </div>

                {/* Add Remark */}
                <div className="mb-4">
                  <p className="text-xs text-emerald-400 mb-1 font-semibold tracking-widest">
                    ▐ ADD NOTE
                  </p>
                  <textarea
                    value={updateRemark}
                    onChange={(e) => setUpdateRemark(e.target.value)}
                    placeholder="Add update message..."
                    disabled={updatingComplaint}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-gray-600 focus:outline-none focus:border-cyan-400/50 focus:bg-white/[0.08] transition-all resize-none text-xs mb-2 disabled:opacity-50"
                    rows={2}
                  />
                  <button
                    onClick={handleAddRemark}
                    disabled={updatingComplaint}
                    className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-400 to-emerald-400 text-black font-semibold text-xs hover:shadow-lg hover:shadow-cyan-400/50 transition-all uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {updatingComplaint ? (
                      <Loader className="w-3 h-3 inline mr-2 animate-spin" />
                    ) : (
                      "📡"
                    )}{" "}
                    SEND
                  </button>
                </div>

                {/* Activity Timeline */}
                {selectedComplaint.remarks && selectedComplaint.remarks.length > 0 && (
                  <div>
                    <p className="text-xs text-yellow-400 mb-2 font-semibold tracking-widest flex items-center gap-2">
                      ▐ ACTIVITY TIMELINE
                      <span className="px-1.5 py-0.5 bg-yellow-500/20 rounded text-[10px]">
                        {selectedComplaint.remarks.length}
                      </span>
                    </p>
                    <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                      {[...selectedComplaint.remarks].reverse().map((remark, index) => (
                        <div
                          key={index}
                          className="relative pl-4 pb-2 border-l-2 border-yellow-400/30 last:border-l-0 last:pb-0"
                        >
                          <div className="absolute left-0 top-0 w-2 h-2 -translate-x-[5px] rounded-full bg-yellow-400" />
                          <div className="bg-white/5 border border-white/10 rounded-lg p-2">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <div className="flex items-center gap-2">
                                <User className="w-3 h-3 text-yellow-400" />
                                <span className="text-xs font-semibold text-yellow-400">
                                  {remark.addedBy?.fullName || "Official"}
                                </span>
                              </div>
                              {remark.addedAt && (
                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                  <Calendar className="w-3 h-3" />
                                  {new Date(remark.addedAt).toLocaleDateString()}
                                </div>
                              )}
                            </div>
                            <p className="text-sm text-gray-300">{remark.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center h-96 flex flex-col items-center justify-center">
                <Zap className="w-12 h-12 text-gray-600 mb-4" />
                <p className="text-gray-500 text-sm">
                  Select a report to view details
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Analytics Modal */}
      {showAnalytics && analytics && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowAnalytics(false)}
        >
          <div
            className="bg-gradient-to-br from-gray-900 to-black border border-cyan-400/30 rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-6 h-6 text-cyan-400" />
                <h2 className="text-2xl font-bold text-white">Analytics Dashboard</h2>
              </div>
              <button
                onClick={() => setShowAnalytics(false)}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category Distribution */}
              <div className="bg-black/30 border border-white/10 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-cyan-400 mb-4">
                  Category Distribution
                </h3>
                <div className="space-y-2">
                  {analytics.byCategory && analytics.byCategory.length > 0 ? (
                    analytics.byCategory.map((item) => (
                      <div key={item._id} className="flex items-center justify-between">
                        <span className="text-sm text-gray-300 capitalize">
                          {item._id || "Unknown"}
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400"
                              style={{
                                width: `${
                                  (item.count /
                                    Math.max(
                                      ...analytics.byCategory.map((c) => c.count)
                                    )) *
                                  100
                                }%`,
                              }}
                            />
                          </div>
                          <span className="text-sm font-semibold text-white w-8 text-right">
                            {item.count}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 text-center py-4">No data available</p>
                  )}
                </div>
              </div>

              {/* Priority Distribution */}
              <div className="bg-black/30 border border-white/10 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-purple-400 mb-4">
                  Priority Distribution
                </h3>
                <div className="space-y-2">
                  {analytics.byPriority && analytics.byPriority.length > 0 ? (
                    analytics.byPriority.map((item) => (
                      <div key={item._id} className="flex items-center justify-between">
                        <span className="text-sm text-gray-300 capitalize">
                          {item._id || "None"}
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${
                                item._id === "urgent"
                                  ? "bg-red-400"
                                  : item._id === "high"
                                  ? "bg-orange-400"
                                  : item._id === "medium"
                                  ? "bg-yellow-400"
                                  : "bg-blue-400"
                              }`}
                              style={{
                                width: `${
                                  (item.count /
                                    Math.max(
                                      ...analytics.byPriority.map((c) => c.count)
                                    )) *
                                  100
                                }%`,
                              }}
                            />
                          </div>
                          <span className="text-sm font-semibold text-white w-8 text-right">
                            {item.count}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 text-center py-4">No data available</p>
                  )}
                </div>
              </div>

              {/* Status Distribution */}
              <div className="bg-black/30 border border-white/10 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-emerald-400 mb-4">
                  Status Distribution
                </h3>
                <div className="space-y-2">
                  {analytics.byStatus && analytics.byStatus.length > 0 ? (
                    analytics.byStatus.map((item) => (
                      <div key={item._id} className="flex items-center justify-between">
                        <span className="text-sm text-gray-300 capitalize">
                          {item._id === "in-progress" ? "In Progress" : item._id}
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${
                                item._id === "resolved"
                                  ? "bg-emerald-400"
                                  : item._id === "in-progress"
                                  ? "bg-yellow-400"
                                  : "bg-orange-400"
                              }`}
                              style={{
                                width: `${
                                  (item.count /
                                    Math.max(
                                      ...analytics.byStatus.map((c) => c.count)
                                    )) *
                                  100
                                }%`,
                              }}
                            />
                          </div>
                          <span className="text-sm font-semibold text-white w-8 text-right">
                            {item.count}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 text-center py-4">No data available</p>
                  )}
                </div>
              </div>

              {/* Average Resolution Time */}
              <div className="bg-black/30 border border-white/10 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-yellow-400 mb-4">
                  Performance Metrics
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">
                      Average Resolution Time
                    </p>
                    <p className="text-3xl font-bold text-white">
                      {analytics.avgResolutionTime
                        ? `${analytics.avgResolutionTime.toFixed(1)} days`
                        : "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Total Complaints</p>
                    <p className="text-2xl font-bold text-cyan-400">
                      {analytics.byStatus?.reduce(
                        (acc, item) => acc + item.count,
                        0
                      ) || 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Lightbox Modal */}
      {lightboxOpen && selectedComplaint?.images && (
        <div
          className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors z-10"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          {selectedComplaint.images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                className="absolute left-4 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="absolute right-4 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm"
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </button>
            </>
          )}

          <div
            className="max-w-5xl max-h-[90vh] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <img
                src={typeof selectedComplaint.images[currentImageIndex] === 'string' 
                  ? selectedComplaint.images[currentImageIndex] 
                  : selectedComplaint.images[currentImageIndex].url}
                alt={`Evidence ${currentImageIndex + 1}`}
                className="w-full h-auto max-h-[85vh] object-contain rounded-lg"
              />
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                <p className="text-white text-sm font-semibold">
                  {currentImageIndex + 1} / {selectedComplaint.images.length}
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between bg-black/50 backdrop-blur-sm border border-white/10 rounded-lg p-4">
              <div>
                <p className="text-xs text-gray-400">Evidence Photo</p>
                <p className="text-white font-semibold">
                  {selectedComplaint.title}
                </p>
              </div>
              <button
                onClick={() => {
                  const imageUrl = typeof selectedComplaint.images[currentImageIndex] === 'string' 
                    ? selectedComplaint.images[currentImageIndex] 
                    : selectedComplaint.images[currentImageIndex].url;
                  window.open(imageUrl, '_blank');
                }}
                className="px-4 py-2 bg-cyan-500/20 border border-cyan-400/50 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-all flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span className="text-sm">Download</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
