import { StatusBadge } from '../shared/StatusBadge';
import { StatCard } from '../shared/StatCard';
import { Shield, AlertTriangle, Activity, Clock } from 'lucide-react';
import { mockIncidents } from '../../data/mockData';

export const ThreatOverview = () => {
  const threatsToday = mockIncidents.filter(
    incident => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return incident.dateTime >= today;
    }
  ).length;

  const activeMonitors = 4;
  const systemUptime = 99.7;
  
  const lastIncident = mockIncidents[0];
  const lastIncidentDate = lastIncident ? lastIncident.dateTime : new Date();
  const daysSinceLastIncident = Math.floor(
    (Date.now() - lastIncidentDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="space-y-4">
      {/* Main Status Card */}
      <div className="card bg-gradient-to-r from-accent-success/20 to-accent-success/10 border-accent-success">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Shield className="w-6 h-6 text-accent-success" />
              <h2 className="text-2xl font-black text-text-primary">Airspace Status</h2>
            </div>
            <StatusBadge status="success" className="text-lg px-4 py-2">
              SECURE
            </StatusBadge>
          </div>
          <div className="text-right">
            <p className="text-text-secondary text-sm font-bold mb-1">Last Updated</p>
            <p className="text-text-primary font-black">
              {new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          title="Threats Detected Today"
          value={threatsToday}
          icon={AlertTriangle}
        />
        <StatCard
          title="Active Monitors"
          value={`${activeMonitors}/4`}
          icon={Activity}
        />
        <StatCard
          title="System Uptime"
          value={`${systemUptime}%`}
          icon={Shield}
        />
        <StatCard
          title="Last Incident"
          value={daysSinceLastIncident === 0 ? 'Today' : `${daysSinceLastIncident} days ago`}
          icon={Clock}
        />
      </div>
    </div>
  );
};

