import { useState, useRef, useEffect } from 'react';
import { Bell } from 'lucide-react';

interface Notification {
  id: string;
  message: string;
  timestamp: Date;
  type: 'alert' | 'info' | 'warning';
}

interface NotificationBellProps {
  notifications: Notification[];
}

export const NotificationBell = ({ notifications }: NotificationBellProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const unreadCount = notifications.filter(n => n.type === 'alert').length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-primary-bg-card rounded-lg transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5 text-text-primary" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-4 h-4 bg-accent-danger rounded-full text-xs font-black flex items-center justify-center text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-primary-bg-card border border-primary-border rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
          <div className="p-4 border-b border-primary-border">
            <h3 className="font-black text-text-primary">Notifications</h3>
          </div>
          <div className="divide-y divide-primary-border">
            {notifications.length === 0 ? (
              <div className="p-4 text-text-secondary text-sm font-bold text-center">
                No notifications
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="p-4 hover:bg-primary-bg-secondary transition-colors cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-2 h-2 rounded-full mt-2 ${
                        notification.type === 'alert'
                          ? 'bg-accent-danger'
                          : notification.type === 'warning'
                          ? 'bg-accent-warning'
                          : 'bg-blue-500'
                      }`}
                    />
                    <div className="flex-1">
                      <p className="text-text-primary font-bold text-sm">{notification.message}</p>
                      <p className="text-text-secondary text-xs font-bold mt-1">
                        {notification.timestamp.toLocaleTimeString('en-GB', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

