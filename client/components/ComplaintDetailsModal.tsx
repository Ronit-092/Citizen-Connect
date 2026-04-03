import { X, MapPin, Calendar, User, Clock, CheckCircle2, AlertCircle, Image as ImageIcon, MessageSquare } from "lucide-react";

interface ComplaintDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  complaint: any;
}

export default function ComplaintDetailsModal({ isOpen, onClose, complaint }: ComplaintDetailsModalProps) {
  if (!isOpen || !complaint) return null;

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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500/20 text-red-300 border-red-500/30";
      case "medium":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
      case "low":
        return "bg-green-500/20 text-green-300 border-green-500/30";
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    }
  };

  const formatLocation = () => {
    const parts = [];
    if (complaint.location?.landmark) parts.push(complaint.location.landmark);
    if (complaint.location?.area) parts.push(complaint.location.area);
    if (complaint.location?.city) parts.push(complaint.location.city);
    if (complaint.location?.state) parts.push(complaint.location.state);
    if (complaint.location?.pincode) parts.push(complaint.location.pincode);
    return parts.length > 0 ? parts.join(", ") : complaint.location?.address || "Location not specified";
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-[9999] flex items-start sm:items-center justify-center p-0 sm:p-4 overflow-y-auto backdrop-blur-sm">
      <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-t-2xl sm:rounded-2xl w-full sm:w-[95%] md:w-[90%] max-w-4xl my-0 sm:my-8 border-t sm:border border-white/10 shadow-2xl animate-slide-up min-h-screen sm:min-h-0 relative z-[10000]">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-br from-slate-900/95 via-purple-900/95 to-slate-900/95 backdrop-blur-sm flex justify-between items-start p-4 sm:p-6 border-b border-white/10 z-10">
          <div className="flex-1 pr-2">
            <div className="flex items-center gap-2 sm:gap-3 mb-2 flex-wrap">
              <span className={`px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-medium border ${getStatusColor(complaint.status)}`}>
                {complaint.status?.replace("-", " ").toUpperCase()}
              </span>
              {complaint.priority && (
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(complaint.priority)}`}>
                  {complaint.priority === 'high' ? '🔴' : complaint.priority === 'medium' ? '🟡' : '🟢'} {complaint.priority?.toUpperCase()}
                </span>
              )}
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30">
                {complaint.category?.toUpperCase()}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold line-clamp-2">{complaint.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 hover:bg-white/10 rounded-lg transition-colors flex-shrink-0"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 max-h-[calc(100vh-140px)] sm:max-h-[70vh] overflow-y-auto">
          {/* Timeline */}
          <div className="bg-white/5 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-white/10">
            <h3 className="text-sm font-semibold mb-3 text-gray-400">TIMELINE</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-4 h-4 text-blue-400" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">Complaint Filed</div>
                  <div className="text-xs text-gray-400">{new Date(complaint.createdAt).toLocaleString()}</div>
                </div>
              </div>
              
              {complaint.status === 'in-progress' && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-yellow-500/20 border border-yellow-500/30 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-4 h-4 text-yellow-400" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">In Progress</div>
                    <div className="text-xs text-gray-400">Work has started on this issue</div>
                  </div>
                </div>
              )}
              
              {complaint.status === 'resolved' && complaint.resolvedAt && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">Resolved</div>
                    <div className="text-xs text-gray-400">{new Date(complaint.resolvedAt).toLocaleString()}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Description */}
            <div className="md:col-span-2 bg-white/5 rounded-xl p-4 border border-white/10">
              <h3 className="text-sm font-semibold mb-2 text-gray-400">DESCRIPTION</h3>
              <p className="text-gray-300 text-sm leading-relaxed">{complaint.description}</p>
            </div>

            {/* Location */}
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h3 className="text-sm font-semibold mb-3 text-gray-400">LOCATION</h3>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-purple-400 mt-1 flex-shrink-0" />
                  <p className="text-sm text-gray-300">{formatLocation()}</p>
                </div>
                {complaint.location?.latitude && complaint.location?.longitude && (
                  <div className="text-xs text-gray-400 mt-2">
                    📐 {complaint.location.latitude.toFixed(4)}, {complaint.location.longitude.toFixed(4)}
                  </div>
                )}
              </div>
            </div>

            {/* Reporter Info */}
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h3 className="text-sm font-semibold mb-3 text-gray-400">REPORTED BY</h3>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center text-sm font-bold">
                  {complaint.citizen?.fullName?.charAt(0).toUpperCase() || "U"}
                </div>
                <div>
                  <div className="text-sm font-medium">{complaint.citizen?.fullName}</div>
                  <div className="text-xs text-gray-400">{complaint.citizen?.email}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Images */}
          {complaint.images && complaint.images.length > 0 && (
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h3 className="text-sm font-semibold mb-3 text-gray-400 flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                ATTACHED IMAGES
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {complaint.images.map((image: any, idx: number) => (
                  <a
                    key={idx}
                    href={image.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative aspect-video rounded-lg overflow-hidden border border-white/20 hover:border-purple-400/50 transition-all group"
                  >
                    <img
                      src={image.url}
                      alt={`Evidence ${idx + 1}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-xs text-white">View Full Size</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Government Remarks */}
          {complaint.remarks && complaint.remarks.length > 0 && (
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h3 className="text-sm font-semibold mb-3 text-gray-400 flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                GOVERNMENT UPDATES
              </h3>
              <div className="space-y-3">
                {complaint.remarks.map((remark: any, idx: number) => (
                  <div key={idx} className="bg-white/5 rounded-lg p-3 border border-white/10">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-xs font-bold">
                          {remark.addedBy?.fullName?.charAt(0).toUpperCase() || "G"}
                        </div>
                        <span className="text-xs font-medium">{remark.addedBy?.fullName || "Government Official"}</span>
                      </div>
                      <span className="text-xs text-gray-400">
                        {new Date(remark.addedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-300">{remark.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Assigned To */}
          {complaint.assignedTo && (
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h3 className="text-sm font-semibold mb-3 text-gray-400">ASSIGNED TO</h3>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-sm font-bold">
                  {complaint.assignedTo.fullName?.charAt(0).toUpperCase() || "G"}
                </div>
                <div>
                  <div className="text-sm font-medium">{complaint.assignedTo.fullName}</div>
                  <div className="text-xs text-gray-400">{complaint.assignedTo.department} Department</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/10 flex justify-between items-center">
          <div className="text-xs text-gray-400">
            ID: {complaint.id} • Created {new Date(complaint.createdAt).toLocaleDateString()}
          </div>
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all border border-white/20"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
