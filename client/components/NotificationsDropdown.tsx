import { useState, useEffect, useRef } from "react";
import { Bell, CheckCircle2, Clock, AlertCircle, X } from "lucide-react";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'warning' | 'info';
  timestamp: Date;
  read: boolean;
  complaintId?: string;
}

interface NotificationsDropdownProps {
  complaints: any[];
}

export default function NotificationsDropdown({ complaints }: NotificationsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Generate notifications based on complaint status changes
    const newNotifications: Notification[] = [];
    
    complaints.forEach((complaint) => {
      if (complaint.status === 'resolved') {
        newNotifications.push({
          id: `resolved-${complaint.id}`,
          title: 'Complaint Resolved',
          message: `Your complaint "${complaint.title}" has been resolved!`,
          type: 'success',
          timestamp: complaint.resolvedAt ? new Date(complaint.resolvedAt) : new Date(),
          read: false,
          complaintId: complaint.id
        });
      } else if (complaint.status === 'in-progress') {
        newNotifications.push({
          id: `progress-${complaint.id}`,
          title: 'Work Started',
          message: `Work has started on "${complaint.title}"`,
          type: 'info',
          timestamp: new Date(complaint.updatedAt),
          read: false,
          complaintId: complaint.id
        });
      }
      
      if (complaint.remarks && complaint.remarks.length > 0) {
        const latestRemark = complaint.remarks[complaint.remarks.length - 1];
        newNotifications.push({
          id: `remark-${complaint.id}-${complaint.remarks.length}`,
          title: 'New Update',
          message: `Government added an update to "${complaint.title}"`,
          type: 'info',
          timestamp: new Date(latestRemark.addedAt),
          read: false,
          complaintId: complaint.id
        });
      }
    });

    // Sort by timestamp descending
    newNotifications.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    
    // Keep only last 10 notifications
    setNotifications(newNotifications.slice(0, 10));
  }, [complaints]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-green-400" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-yellow-400" />;
      default:
        return <Clock className="w-4 h-4 text-blue-400" />;
    }
  };

  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-1.5 sm:p-2 rounded-lg hover:bg-white/10 transition-all"
        aria-label="Notifications"
      >
        <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-4 h-4 sm:w-5 sm:h-5 bg-red-500 text-white text-[10px] sm:text-xs font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-[calc(100vw-2rem)] sm:w-80 max-w-md bg-slate-900 border border-white/20 rounded-xl shadow-2xl z-50 overflow-hidden">
          {/* Header */}
          <div className="p-3 sm:p-4 border-b border-white/10 flex justify-between items-center bg-gradient-to-r from-purple-900/40 to-purple-900/20">
            <div>
              <h3 className="text-sm sm:text-base font-semibold">Notifications</h3>
              <p className="text-[10px] sm:text-xs text-gray-400">{unreadCount} unread</p>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-purple-400 hover:text-purple-300"
              >
                Mark all read
              </button>
            )}
          </div>

            {/* Notifications List */}
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-400">
                  <Bell className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">No notifications yet</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => markAsRead(notification.id)}
                    className={`p-4 border-b border-white/5 hover:bg-white/5 cursor-pointer transition-all ${
                      !notification.read ? 'bg-purple-500/5' : ''
                    }`}
                  >
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {getIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className="text-sm font-medium line-clamp-1">
                            {notification.title}
                          </h4>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0 mt-1"></div>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 line-clamp-2 mb-2">
                          {notification.message}
                        </p>
                        <span className="text-xs text-gray-500">
                          {getTimeAgo(notification.timestamp)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {notifications.length > 0 && (
              <div className="p-3 border-t border-white/10 text-center">
                <button className="text-xs text-purple-400 hover:text-purple-300 transition-colors">
                  View All Notifications
                </button>
              </div>
            )}
          </div>
      )}
    </div>
  );
}
