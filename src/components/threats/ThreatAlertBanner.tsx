import { AlertTriangle } from 'lucide-react';
import type { ThreatSimulation } from '../../data/mockThreats';

interface ThreatAlertBannerProps {
  simulation: ThreatSimulation;
  threatLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  currentPosition: { distance: number; bearing: number; altitude: number } | null;
}

export const ThreatAlertBanner = ({ simulation, threatLevel, currentPosition }: ThreatAlertBannerProps) => {
  const getThreatLevelColor = () => {
    switch (threatLevel) {
      case 'CRITICAL':
        return 'bg-accent-danger';
      case 'HIGH':
        return 'bg-accent-danger/80';
      case 'MEDIUM':
        return 'bg-accent-warning';
      default:
        return 'bg-accent-warning/60';
    }
  };

  return (
    <div className={`${getThreatLevelColor()} animate-pulse-red p-6 rounded-lg mb-6`}>
      <div className="flex items-center gap-4 mb-4">
        <AlertTriangle className="w-8 h-8 text-white" />
        <h2 className="text-2xl font-black text-white">UNAUTHORIZED DRONE DETECTED</h2>
      </div>
      
      <div className="grid grid-cols-4 gap-4">
        <div>
          <p className="text-white/80 text-sm font-bold mb-1">Threat Classification</p>
          <p className="text-white font-black text-lg">{simulation.threatType}</p>
        </div>
        <div>
          <p className="text-white/80 text-sm font-bold mb-1">AI Confidence</p>
          <p className="text-white font-black text-lg">{simulation.aiConfidence}%</p>
        </div>
        {currentPosition && (
          <>
            <div>
              <p className="text-white/80 text-sm font-bold mb-1">Distance</p>
              <p className="text-white font-black text-lg">
                {(currentPosition.distance / 1000).toFixed(2)}km
              </p>
            </div>
            <div>
              <p className="text-white/80 text-sm font-bold mb-1">Bearing / Altitude</p>
              <p className="text-white font-black text-lg">
                {currentPosition.bearing}° / {currentPosition.altitude.toFixed(0)}m
              </p>
            </div>
          </>
        )}
      </div>
      
      <div className="mt-4">
        <span className="inline-block px-4 py-2 bg-white/20 rounded-full">
          <span className="text-white font-black">Threat Level: {threatLevel}</span>
        </span>
      </div>
    </div>
  );
};

