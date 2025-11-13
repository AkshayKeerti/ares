import { useState } from 'react';
import { ChevronDown, User, LogOut } from 'lucide-react';
import { FACILITIES } from '../../utils/constants';
import { NotificationBell } from '../shared/NotificationBell';
import { StatusBadge } from '../shared/StatusBadge';

interface NavbarProps {
  selectedSite: string;
  onSiteChange: (siteId: string) => void;
  notifications: Array<{ id: string; message: string; timestamp: Date; type: 'alert' | 'info' | 'warning' }>;
}

export const Navbar = ({ selectedSite, onSiteChange, notifications }: NavbarProps) => {
  const [isSiteDropdownOpen, setIsSiteDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  
  const selectedFacility = FACILITIES.find(f => f.id === selectedSite) || FACILITIES[0];
  const alertCount = notifications.filter(n => n.type === 'alert').length;

  return (
    <nav className="bg-primary-bg-secondary border-b border-primary-border px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-4">
          <div className="text-2xl font-black text-text-primary">
            ARES
          </div>
          <div className="h-6 w-px bg-primary-border" />
          
          {/* Site Selector */}
          <div className="relative">
            <button
              onClick={() => setIsSiteDropdownOpen(!isSiteDropdownOpen)}
              className="flex items-center gap-2 px-4 py-2 hover:bg-primary-bg-card rounded-lg transition-colors font-bold"
            >
              <span className="text-text-primary">{selectedFacility.name}</span>
              <ChevronDown className="w-4 h-4 text-text-secondary" />
            </button>
            
            {isSiteDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-primary-bg-card border border-primary-border rounded-lg shadow-xl z-50">
                {FACILITIES.map((facility) => (
                  <button
                    key={facility.id}
                    onClick={() => {
                      onSiteChange(facility.id);
                      setIsSiteDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-primary-bg-secondary transition-colors font-bold text-sm"
                  >
                    <div className="text-text-primary">{facility.name}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* System Status */}
          <StatusBadge status="success">All Systems Operational</StatusBadge>
          
          {/* Alert Counter */}
          {alertCount > 0 && (
            <div className="px-3 py-1 bg-accent-danger/20 border border-accent-danger rounded-full">
              <span className="text-accent-danger font-black text-sm">{alertCount} Alerts</span>
            </div>
          )}
          
          {/* Notifications */}
          <NotificationBell notifications={notifications} />
          
          {/* Profile Menu */}
          <div className="relative">
            <button
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className="flex items-center gap-2 px-3 py-2 hover:bg-primary-bg-card rounded-lg transition-colors"
            >
              <div className="w-8 h-8 bg-accent-success rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
            </button>
            
            {isProfileDropdownOpen && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-primary-bg-card border border-primary-border rounded-lg shadow-xl z-50">
                <div className="p-3 border-b border-primary-border">
                  <div className="text-text-primary font-bold text-sm">Security Officer</div>
                  <div className="text-text-secondary text-xs font-bold">security@ares.com</div>
                </div>
                <button className="w-full text-left px-4 py-3 hover:bg-primary-bg-secondary transition-colors font-bold text-sm flex items-center gap-2 text-text-primary">
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

