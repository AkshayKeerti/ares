import { useState } from 'react';
import type { ReactNode } from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { FACILITIES } from '../../utils/constants';
import { mockActivityLogs } from '../../data/mockData';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  useKeyboardShortcuts();
  const [selectedSite, setSelectedSite] = useState<string>(FACILITIES[0].id);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  // Convert activity logs to notifications format
  const notifications = mockActivityLogs
    .filter(log => log.type === 'alert' || log.type === 'warning')
    .slice(0, 5)
    .map(log => ({
      id: log.id,
      message: log.event,
      timestamp: log.timestamp,
      type: log.type === 'alert' ? 'alert' as const : log.type === 'warning' ? 'warning' as const : 'info' as const,
    }));

  return (
    <div className="flex h-screen bg-primary-bg overflow-hidden">
      <Sidebar isCollapsed={isSidebarCollapsed} onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar
          selectedSite={selectedSite}
          onSiteChange={setSelectedSite}
          notifications={notifications}
        />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

