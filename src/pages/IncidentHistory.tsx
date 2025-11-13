import { useState } from 'react';
import { ChevronDown, ChevronUp, Filter } from 'lucide-react';
import { mockIncidents } from '../data/mockData';
import { formatDateTime, formatDistance, formatDuration, formatTime } from '../utils/formatters';
import { StatusBadge } from '../components/shared/StatusBadge';
import { THREAT_TYPES, THREAT_LEVELS } from '../utils/constants';

export const IncidentHistory = () => {
  const [expandedIncident, setExpandedIncident] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    threatType: '',
    threatLevel: '',
    dateFrom: '',
    dateTo: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  const filteredIncidents = mockIncidents.filter((incident) => {
    if (filters.threatType && incident.threatType !== filters.threatType) return false;
    if (filters.threatLevel && incident.maxThreatLevel !== filters.threatLevel) return false;
    if (filters.dateFrom && incident.dateTime < new Date(filters.dateFrom)) return false;
    if (filters.dateTo && incident.dateTime > new Date(filters.dateTo)) return false;
    return true;
  });

  const getThreatLevelColor = (level: string) => {
    switch (level) {
      case 'CRITICAL':
        return 'danger';
      case 'HIGH':
        return 'danger';
      case 'MEDIUM':
        return 'warning';
      default:
        return 'info';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-text-primary mb-2">Incident History</h1>
          <p className="text-text-secondary font-bold">Historical threat detection and response records</p>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="btn-secondary flex items-center gap-2"
        >
          <Filter className="w-4 h-4" />
          Filters
        </button>
      </div>

      {showFilters && (
        <div className="card">
          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="block text-text-secondary text-sm font-bold mb-2">Threat Type</label>
              <select
                value={filters.threatType}
                onChange={(e) => setFilters({ ...filters, threatType: e.target.value })}
                className="w-full px-4 py-2 bg-primary-bg-secondary border border-primary-border rounded-lg text-text-primary font-bold"
              >
                <option value="">All Types</option>
                {THREAT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-text-secondary text-sm font-bold mb-2">Threat Level</label>
              <select
                value={filters.threatLevel}
                onChange={(e) => setFilters({ ...filters, threatLevel: e.target.value })}
                className="w-full px-4 py-2 bg-primary-bg-secondary border border-primary-border rounded-lg text-text-primary font-bold"
              >
                <option value="">All Levels</option>
                {THREAT_LEVELS.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-text-secondary text-sm font-bold mb-2">Date From</label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                className="w-full px-4 py-2 bg-primary-bg-secondary border border-primary-border rounded-lg text-text-primary font-bold"
              />
            </div>
            <div>
              <label className="block text-text-secondary text-sm font-bold mb-2">Date To</label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                className="w-full px-4 py-2 bg-primary-bg-secondary border border-primary-border rounded-lg text-text-primary font-bold"
              />
            </div>
          </div>
        </div>
      )}

      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-primary-bg-secondary border-b border-primary-border">
              <tr>
                <th className="px-6 py-4 text-left text-text-secondary text-sm font-bold">Date/Time</th>
                <th className="px-6 py-4 text-left text-text-secondary text-sm font-bold">Threat Type</th>
                <th className="px-6 py-4 text-left text-text-secondary text-sm font-bold">Max Threat Level</th>
                <th className="px-6 py-4 text-left text-text-secondary text-sm font-bold">Closest Distance</th>
                <th className="px-6 py-4 text-left text-text-secondary text-sm font-bold">Duration</th>
                <th className="px-6 py-4 text-left text-text-secondary text-sm font-bold">Action Taken</th>
                <th className="px-6 py-4 text-left text-text-secondary text-sm font-bold">Status</th>
                <th className="px-6 py-4 text-left text-text-secondary text-sm font-bold"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary-border">
              {filteredIncidents.map((incident) => (
                <>
                  <tr
                    key={incident.id}
                    className="hover:bg-primary-bg-secondary transition-colors cursor-pointer"
                    onClick={() =>
                      setExpandedIncident(expandedIncident === incident.id ? null : incident.id)
                    }
                  >
                    <td className="px-6 py-4 text-text-primary font-bold text-sm">
                      {formatDateTime(incident.dateTime)}
                    </td>
                    <td className="px-6 py-4 text-text-primary font-bold">{incident.threatType}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={getThreatLevelColor(incident.maxThreatLevel) as any}>
                        {incident.maxThreatLevel}
                      </StatusBadge>
                    </td>
                    <td className="px-6 py-4 text-text-primary font-bold">
                      {formatDistance(incident.closestDistance)}
                    </td>
                    <td className="px-6 py-4 text-text-primary font-bold">
                      {formatDuration(incident.duration)}
                    </td>
                    <td className="px-6 py-4 text-text-secondary font-bold text-sm">
                      {incident.actionTaken}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge
                        status={incident.status === 'Resolved' ? 'success' : 'info'}
                      >
                        {incident.status}
                      </StatusBadge>
                    </td>
                    <td className="px-6 py-4">
                      {expandedIncident === incident.id ? (
                        <ChevronUp className="w-5 h-5 text-text-secondary" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-text-secondary" />
                      )}
                    </td>
                  </tr>
                  {expandedIncident === incident.id && incident.details && (
                    <tr>
                      <td colSpan={8} className="px-6 py-4 bg-primary-bg-secondary">
                        <div className="space-y-4">
                          <h4 className="text-text-primary font-black mb-3">Incident Details</h4>
                          <div className="grid grid-cols-4 gap-4">
                            <div>
                              <p className="text-text-secondary text-xs font-bold mb-1">Speed</p>
                              <p className="text-text-primary font-black">{incident.details.speed} m/s</p>
                            </div>
                            <div>
                              <p className="text-text-secondary text-xs font-bold mb-1">Altitude</p>
                              <p className="text-text-primary font-black">{incident.details.altitude}m</p>
                            </div>
                            <div>
                              <p className="text-text-secondary text-xs font-bold mb-1">Bearing</p>
                              <p className="text-text-primary font-black">{incident.details.bearing}°</p>
                            </div>
                            <div>
                              <p className="text-text-secondary text-xs font-bold mb-1">AI Confidence</p>
                              <p className="text-text-primary font-black">{incident.details.aiConfidence}%</p>
                            </div>
                          </div>
                          <div className="mt-4 pt-4 border-t border-primary-border">
                            <h5 className="text-text-primary font-bold mb-2">Timeline</h5>
                            <div className="space-y-2">
                              <div className="flex items-center gap-3 text-sm">
                                <span className="text-text-secondary font-bold min-w-[100px]">
                                  {formatTime(incident.dateTime)}
                                </span>
                                <span className="text-text-primary font-bold">Threat detected</span>
                              </div>
                              <div className="flex items-center gap-3 text-sm">
                                <span className="text-text-secondary font-bold min-w-[100px]">
                                  {formatTime(
                                    new Date(incident.dateTime.getTime() + incident.duration * 1000)
                                  )}
                                </span>
                                <span className="text-text-primary font-bold">{incident.actionTaken}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

