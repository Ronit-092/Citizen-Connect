import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  MapPin,
  CheckCircle2,
  Clock,
  AlertCircle,
  LogOut,
  Edit2,
  Zap,
  BarChart3,
  Loader,
} from "lucide-react";
import MiniMap from "../components/MiniMap";
import Logo from "@/components/Logo";
import { useAuth } from "../hooks/use-auth";
import { useComplaints } from "../hooks/use-complaints";
import type { Complaint } from "@shared/api";

export default function GovtDashboard() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { complaints, loading, error, fetchByStatus, updateStatus, addRemark } = useComplaints();
  
  const [selectedStatus, setSelectedStatus] = useState<"pending" | "in-progress" | "resolved">("pending");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(
    null,
  );
  const [updateRemark, setUpdateRemark] = useState("");
  const [loadingComplaints, setLoadingComplaints] = useState(false);
  const [updatingComplaint, setUpdatingComplaint] = useState(false);

  // Load complaints by status
  useEffect(() => {
    const loadComplaints = async () => {
      setLoadingComplaints(true);
      try {
        await fetchByStatus(selectedStatus);
      } catch (err) {
        console.error("Failed to load complaints:", err);
      } finally {
        setLoadingComplaints(false);
      }
    };

    loadComplaints();
  }, [selectedStatus, fetchByStatus]);

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
    return matchesCategory;
  });

  const handleStatusUpdate = async (
    complaintId: string,
    newStatus: "pending" | "in-progress" | "resolved",
  ) => {
    setUpdatingComplaint(true);
    try {
      await updateStatus(complaintId, newStatus);
      if (selectedComplaint?.id === complaintId) {
        setSelectedComplaint({ ...selectedComplaint, status: newStatus });
      }
      toast.success(`Status updated to ${newStatus.replace("-", " ")}`);
      // Refresh complaints
      await fetchByStatus(selectedStatus);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to update status";
      toast.error(msg);
      console.error("Failed to update status:", err);
    } finally {
      setUpdatingComplaint(false);
    }
  };

  const handleAddRemark = async () => {
    if (selectedComplaint && updateRemark.trim()) {
      setUpdatingComplaint(true);
      try {
        await addRemark(selectedComplaint.id, updateRemark);
        setUpdateRemark("");
        toast.success("Remark added successfully!");
        // Refresh complaints
        await fetchByStatus(selectedStatus);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to add remark";
        toast.error(msg);
        console.error("Failed to add remark:", err);
      } finally {
        setUpdatingComplaint(false);
      }
    }
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
              <p className="text-xs sm:text-sm text-gray-400">
                Manage & resolve issues
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all text-gray-400 hover:text-white border border-white/20 text-sm sm:text-base"
          >
            <LogOut className="w-4 sm:w-5 h-4 sm:h-5" />
            <span className="hidden sm:inline">Logout</span>
            <span className="sm:hidden">Exit</span>
          </button>
        </div>
      </header>

      <div className="relative z-10 px-4 sm:px-6 lg:px-12 py-8 sm:py-12 max-w-7xl mx-auto">
       
       
        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
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
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Reports List */}
          <div className="md:col-span-2">
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-white/10 rounded-xl p-6">
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
                  filteredComplaints.map((complaint, idx) => (
                    <div
                      key={complaint.id}
                      onClick={() => setSelectedComplaint(complaint)}
                      style={{ animationDelay: `${idx * 0.1}s` }}
                      className={`group p-4 rounded-lg cursor-pointer transition-all border ${
                        selectedComplaint?.id === complaint.id
                          ? "bg-cyan-400/20 border-cyan-400/50 scale-102"
                          : "bg-white/5 border-white/10 hover:border-cyan-400/30 hover:bg-white/[0.08]"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">{getStatusIcon(complaint.status)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h3 className="font-semibold truncate">
                              {complaint.title}
                            </h3>
                            <span className="text-xs text-cyan-400 whitespace-nowrap">
                              #{complaint.id}
                            </span>
                          </div>
                          <p className="text-xs text-orange-400/80 mb-1 uppercase tracking-wider">
                            {complaint.citizenId || "Unknown"}
                          </p>
                          <p className="text-sm text-gray-300 line-clamp-2">
                            {complaint.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
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
              <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-white/10 rounded-xl p-6 sticky top-20">
                <div className="mb-4 pb-4 border-b border-white/10">
                  <h2 className="text-lg font-bold leading-tight">
                    {selectedComplaint.title}
                  </h2>
                  <p className="text-xs text-cyan-400 mt-1 tracking-wider uppercase">
                    ID: {selectedComplaint.id}
                  </p>
                </div>

                <div className="space-y-3 mb-6 pb-6 border-b border-white/10">
                  <div>
                    <p className="text-xs text-cyan-400 mb-1 font-semibold tracking-widest">
                      ▐ REPORTER
                    </p>
                    <p className="text-sm">{selectedComplaint.citizenId || "Unknown"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-cyan-400 mb-1 font-semibold tracking-widest">
                      ▐ LOCATION
                    </p>
                    <p className="text-sm flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-emerald-400" />
                      {selectedComplaint.location?.address || "Unknown Location"}
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
                  {selectedComplaint.location?.latitude && selectedComplaint.location?.longitude && (
                    <div>
                      <p className="text-xs text-cyan-400 mb-1 font-semibold tracking-widest">
                        ▐ COORDINATES
                      </p>
                      <p className="text-xs font-mono bg-black/30 p-2 rounded border border-white/10">
                        {selectedComplaint.location.latitude.toFixed(4)},{" "}
                        {selectedComplaint.location.longitude.toFixed(4)}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-cyan-400 mb-1 font-semibold tracking-widest">
                      ▐ FILED
                    </p>
                    <p className="text-sm">{new Date(selectedComplaint.createdAt || "").toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="mb-6 pb-6 border-b border-white/10">
                  <p className="text-xs text-emerald-400 mb-2 font-semibold tracking-widest">
                    ▐ DETAILS
                  </p>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {selectedComplaint.description}
                  </p>
                </div>

                {/* Location Map */}
                {selectedComplaint.location?.latitude && selectedComplaint.location?.longitude && (
                  <div className="mb-6 pb-6 border-b border-white/10">
                    <p className="text-xs text-emerald-400 mb-3 font-semibold tracking-widest">
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
                <div className="mb-6 pb-6 border-b border-white/10">
                  <p className="text-xs text-cyan-400 mb-3 font-semibold tracking-widest">
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
                <div>
                  <p className="text-xs text-emerald-400 mb-2 font-semibold tracking-widest">
                    ▐ ADD NOTE
                  </p>
                  <textarea
                    value={updateRemark}
                    onChange={(e) => setUpdateRemark(e.target.value)}
                    placeholder="Add update message..."
                    disabled={updatingComplaint}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-gray-600 focus:outline-none focus:border-cyan-400/50 focus:bg-white/[0.08] transition-all resize-none text-xs mb-3 disabled:opacity-50"
                    rows={3}
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
    </div>
  );
}
