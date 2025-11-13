import { ThreatOverview } from '../components/dashboard/ThreatOverview';
import { AirspaceMap } from '../components/dashboard/AirspaceMap';
import { SensorFusion } from '../components/dashboard/SensorFusion';
import { ActivityFeed } from '../components/dashboard/ActivityFeed';

export const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-text-primary mb-2">Dashboard</h1>
          <p className="text-text-secondary font-bold">Real-time airspace monitoring and threat detection</p>
        </div>
        <div className="text-right">
          <p className="text-text-secondary text-xs font-bold">Press 'S' to simulate threat</p>
        </div>
      </div>

      <ThreatOverview />

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <AirspaceMap />
        </div>
        <div>
          <SensorFusion />
        </div>
      </div>

      <ActivityFeed />
    </div>
  );
};

