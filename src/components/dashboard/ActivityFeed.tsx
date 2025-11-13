import { Clock } from 'lucide-react';
import { mockActivityLogs } from '../../data/mockData';

export const ActivityFeed = () => {
  const logs = mockActivityLogs.slice(0, 10);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'alert':
        return 'text-accent-danger';
      case 'warning':
        return 'text-accent-warning';
      case 'success':
        return 'text-accent-success';
      default:
        return 'text-text-secondary';
    }
  };

  return (
    <div className="card">
      <h3 className="text-lg font-black text-text-primary mb-4">Recent Activity</h3>
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {logs.map((log) => (
          <div
            key={log.id}
            className="flex items-start gap-3 p-3 hover:bg-primary-bg-secondary rounded-lg transition-colors"
          >
            <div className={`w-2 h-2 rounded-full mt-2 ${
              log.type === 'alert' ? 'bg-accent-danger' :
              log.type === 'warning' ? 'bg-accent-warning' :
              log.type === 'success' ? 'bg-accent-success' :
              'bg-blue-500'
            }`} />
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-bold ${getTypeColor(log.type)}`}>
                {log.event}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <Clock className="w-3 h-3 text-text-secondary" />
                <p className="text-text-secondary text-xs font-bold">
                  {log.timestamp.toLocaleTimeString('en-GB', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

