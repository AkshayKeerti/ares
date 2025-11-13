import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  AlertTriangle,
  Radio,
  History,
  Settings,
  FileText,
  Menu,
} from 'lucide-react';

interface SidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
}

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/threats', label: 'Live Threats', icon: AlertTriangle },
  { path: '/sensors', label: 'Sensor Status', icon: Radio },
  { path: '/incidents', label: 'Incident History', icon: History },
  { path: '/configuration', label: 'System Configuration', icon: Settings },
  { path: '/reports', label: 'Reports', icon: FileText },
];

export const Sidebar = ({ isCollapsed = false, onToggle }: SidebarProps) => {
  return (
    <aside className={`bg-primary-bg-secondary border-r border-primary-border h-full transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'}`}>
      <div className="p-4">
        {onToggle && (
          <button
            onClick={onToggle}
            className="mb-4 p-2 hover:bg-primary-bg-card rounded-lg transition-colors"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-5 h-5 text-text-primary" />
          </button>
        )}
        
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-bold text-sm ${
                    isActive
                      ? 'bg-primary-bg-card text-accent-success border-l-4 border-accent-success'
                      : 'text-text-secondary hover:bg-primary-bg-card hover:text-text-primary'
                  }`
                }
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && <span>{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

