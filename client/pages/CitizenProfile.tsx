import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Award, 
  TrendingUp, 
  CheckCircle2,
  Clock,
  AlertCircle,
  Edit2,
  Camera,
  Shield,
  Activity,
  FileText
} from "lucide-react";
import Logo from "@/components/Logo";
import { useAuth } from "@/hooks/use-auth";
import { useComplaints } from "@/hooks/use-complaints";
import { toast } from "sonner";

export default function CitizenProfile() {
  const { user } = useAuth();
  const { complaints, fetchMy } = useComplaints();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchMy();
  }, [fetchMy]);

  // Calculate statistics
  const totalComplaints = complaints.length;
  const resolvedComplaints = complaints.filter(c => c.status === "resolved").length;
  const pendingComplaints = complaints.filter(c => c.status === "pending").length;
  const inProgressComplaints = complaints.filter(c => c.status === "in-progress").length;
  const resolutionRate = totalComplaints > 0 ? ((resolvedComplaints / totalComplaints) * 100).toFixed(1) : 0;
  
  // Calculate engagement score
  const engagementScore = Math.min(100, totalComplaints * 10 + resolvedComplaints * 5);
  
  // Get most used category
  const categoryCounts = complaints.reduce((acc: any, complaint: any) => {
    acc[complaint.category] = (acc[complaint.category] || 0) + 1;
    return acc;
  }, {});
  const mostUsedCategory = Object.keys(categoryCounts).length > 0 
    ? Object.entries(categoryCounts).sort(([,a]: any, [,b]: any) => b - a)[0][0] 
    : "None";

  // Calculate badge level
  const getBadgeLevel = () => {
    if (totalComplaints >= 50) return { name: "Champion", color: "from-yellow-400 to-orange-500", icon: "🏆" };
    if (totalComplaints >= 20) return { name: "Hero", color: "from-purple-400 to-pink-500", icon: "⭐" };
    if (totalComplaints >= 10) return { name: "Active Citizen", color: "from-blue-400 to-cyan-500", icon: "🎖️" };
    if (totalComplaints >= 5) return { name: "Contributor", color: "from-green-400 to-emerald-500", icon: "✨" };
    return { name: "Newcomer", color: "from-gray-400 to-gray-500", icon: "🌱" };
  };

  const badge = getBadgeLevel();
  const memberSince = user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : "Recently";

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0a42] via-[#3a1a7e] to-[#2a1a60] text-white">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-md bg-[#1a0a42]/95">
        <div className="px-6 md:px-12 py-4 flex justify-between items-center max-w-7xl mx-auto">
          <button
            onClick={() => navigate('/citizen-dashboard')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/10 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>
          <h1 className="text-xl font-bold">My Profile</h1>
          <div className="w-32"></div>
        </div>
      </header>

      <div className="px-6 md:px-12 py-8 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Info Card */}
            <div className="bg-gradient-to-br from-purple-900/40 to-purple-900/20 border border-white/10 rounded-2xl p-6">
              {/* Profile Picture */}
              <div className="flex flex-col items-center mb-6">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center text-4xl font-bold border-4 border-white/20">
                    {user?.fullName?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <button className="absolute bottom-0 right-0 p-2 rounded-full bg-purple-500 hover:bg-purple-600 transition-all shadow-lg opacity-0 group-hover:opacity-100">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                <h2 className="text-2xl font-bold mt-4 text-center">{user?.fullName}</h2>
                <p className="text-gray-400 text-sm">@{user?.username}</p>
                
                {/* Badge */}
                <div className={`mt-4 px-4 py-2 rounded-full bg-gradient-to-r ${badge.color} text-white font-semibold flex items-center gap-2`}>
                  <span>{badge.icon}</span>
                  <span>{badge.name}</span>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-300">{user?.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Shield className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-300 capitalize">{user?.role}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-300">Member since {memberSince}</span>
                </div>
              </div>

              <button
                onClick={() => setIsEditing(!isEditing)}
                className="w-full mt-6 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-white/10 hover:bg-white/20 transition-all border border-white/20"
              >
                <Edit2 className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>
            </div>

            {/* Engagement Score Card */}
            <div className="bg-gradient-to-br from-cyan-900/40 to-cyan-900/20 border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-5 h-5 text-cyan-400" />
                <h3 className="font-semibold">Engagement Score</h3>
              </div>
              <div className="relative">
                <div className="text-4xl font-bold text-cyan-400 mb-2">{engagementScore}/100</div>
                <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all duration-500"
                    style={{ width: `${engagementScore}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  {engagementScore < 30 ? "Keep reporting issues to increase your score!" :
                   engagementScore < 60 ? "Great job! You're making a difference!" :
                   "Outstanding engagement! You're a community champion!"}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Statistics and Activity */}
          <div className="lg:col-span-2 space-y-6">
            {/* Statistics Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-blue-900/40 to-blue-900/20 border border-white/10 rounded-xl p-4">
                <div className="flex justify-between items-start mb-2">
                  <FileText className="w-8 h-8 text-blue-400" />
                </div>
                <div className="text-2xl font-bold mb-1">{totalComplaints}</div>
                <div className="text-xs text-gray-400">Total Complaints</div>
              </div>

              <div className="bg-gradient-to-br from-green-900/40 to-green-900/20 border border-white/10 rounded-xl p-4">
                <div className="flex justify-between items-start mb-2">
                  <CheckCircle2 className="w-8 h-8 text-green-400" />
                </div>
                <div className="text-2xl font-bold mb-1">{resolvedComplaints}</div>
                <div className="text-xs text-gray-400">Resolved</div>
              </div>

              <div className="bg-gradient-to-br from-yellow-900/40 to-yellow-900/20 border border-white/10 rounded-xl p-4">
                <div className="flex justify-between items-start mb-2">
                  <Clock className="w-8 h-8 text-yellow-400" />
                </div>
                <div className="text-2xl font-bold mb-1">{inProgressComplaints}</div>
                <div className="text-xs text-gray-400">In Progress</div>
              </div>

              <div className="bg-gradient-to-br from-orange-900/40 to-orange-900/20 border border-white/10 rounded-xl p-4">
                <div className="flex justify-between items-start mb-2">
                  <AlertCircle className="w-8 h-8 text-orange-400" />
                </div>
                <div className="text-2xl font-bold mb-1">{pendingComplaints}</div>
                <div className="text-xs text-gray-400">Pending</div>
              </div>
            </div>

            {/* Insights Card */}
            <div className="bg-gradient-to-br from-purple-900/40 to-purple-900/20 border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-400" />
                Your Impact Insights
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="text-3xl font-bold text-purple-400 mb-1">{resolutionRate}%</div>
                  <div className="text-sm text-gray-400">Resolution Rate</div>
                </div>
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="text-lg font-bold text-cyan-400 mb-1 capitalize">{mostUsedCategory}</div>
                  <div className="text-sm text-gray-400">Most Reported</div>
                </div>
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="text-3xl font-bold text-green-400 mb-1">{badge.icon}</div>
                  <div className="text-sm text-gray-400">Current Badge</div>
                </div>
              </div>
            </div>

            {/* Achievement Milestones */}
            <div className="bg-gradient-to-br from-purple-900/40 to-purple-900/20 border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-400" />
                Achievement Milestones
              </h3>
              <div className="space-y-3">
                {[
                  { milestone: "First Issue Reporter", target: 1, icon: "🎯", achieved: totalComplaints >= 1 },
                  { milestone: "Active Reporter", target: 5, icon: "🔥", achieved: totalComplaints >= 5 },
                  { milestone: "Community Leader", target: 10, icon: "👑", achieved: totalComplaints >= 10 },
                  { milestone: "Change Maker", target: 20, icon: "💪", achieved: totalComplaints >= 20 },
                  { milestone: "City Champion", target: 50, icon: "🏆", achieved: totalComplaints >= 50 },
                ].map((item, idx) => (
                  <div 
                    key={idx}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      item.achieved 
                        ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30' 
                        : 'bg-white/5 border border-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{item.icon}</span>
                      <div>
                        <div className="font-medium">{item.milestone}</div>
                        <div className="text-xs text-gray-400">{item.target} complaints required</div>
                      </div>
                    </div>
                    {item.achieved ? (
                      <CheckCircle2 className="w-6 h-6 text-green-400" />
                    ) : (
                      <div className="text-sm text-gray-400">{totalComplaints}/{item.target}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-gradient-to-br from-purple-900/40 to-purple-900/20 border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {complaints.slice(0, 5).map((complaint: any) => (
                  <div key={complaint.id} className="flex items-start gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
                    <MapPin className="w-4 h-4 text-purple-400 mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="font-medium text-sm line-clamp-1">{complaint.title}</div>
                      <div className="text-xs text-gray-400 mt-1">
                        {new Date(complaint.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      complaint.status === 'resolved' 
                        ? 'bg-green-500/20 text-green-300' 
                        : complaint.status === 'in-progress'
                        ? 'bg-yellow-500/20 text-yellow-300'
                        : 'bg-orange-500/20 text-orange-300'
                    }`}>
                      {complaint.status}
                    </span>
                  </div>
                ))}
                {complaints.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    <p>No activity yet. Start reporting issues!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
