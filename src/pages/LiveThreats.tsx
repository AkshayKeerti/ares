import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useThreatSimulation } from '../hooks/useThreatSimulation';
import { ThreatAlertBanner } from '../components/threats/ThreatAlertBanner';
import { ThreatDetails } from '../components/threats/ThreatDetails';
import { AIClassification } from '../components/threats/AIClassification';
import { RecommendedActions } from '../components/threats/RecommendedActions';
import { Radio, Wifi, Camera, Volume2 } from 'lucide-react';

export const LiveThreats = () => {
  const navigate = useNavigate();
  const {
    simulation,
    currentPosition,
    threatLevel,
    startSimulation,
    resetSimulation,
  } = useThreatSimulation();

  useEffect(() => {
    if (!simulation) {
      startSimulation();
    }
  }, [simulation, startSimulation]);

  const handleExecuteCountermeasure = () => {
    // Log incident and return to dashboard
    setTimeout(() => {
      navigate('/dashboard');
    }, 2000);
  };

  if (!simulation || !currentPosition) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-text-secondary font-bold mb-4">No active threat detected</p>
          <button onClick={startSimulation} className="btn-primary">
            Start Threat Simulation
          </button>
        </div>
      </div>
    );
  }

  const centerX = 0.5;
  const centerY = 0.5;
  const detectionRadius = 0.3;

  // Calculate closest approach
  const closestApproach = Math.min(...simulation.trajectory.map(p => p.distance));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-text-primary mb-2">Live Threat Detection</h1>
          <p className="text-text-secondary font-bold">Real-time threat monitoring and response</p>
        </div>
        <button onClick={resetSimulation} className="btn-secondary">
          Clear Threat
        </button>
      </div>

      <ThreatAlertBanner
        simulation={simulation}
        threatLevel={threatLevel}
        currentPosition={currentPosition}
      />

      <div className="grid grid-cols-3 gap-6">
        {/* Map */}
        <div className="col-span-2">
          <div className="card p-0 overflow-hidden">
            <div className="p-4 border-b border-primary-border">
              <h3 className="text-lg font-black text-text-primary">Threat Position & Trajectory</h3>
            </div>
            <div className="relative bg-primary-bg-secondary" style={{ height: '600px' }}>
              <svg
                viewBox="0 0 1000 1000"
                className="w-full h-full"
                style={{ background: 'radial-gradient(circle at center, #2d2d2d 0%, #1a1a1a 100%)' }}
              >
                {/* Detection Zone */}
                <circle
                  cx={centerX * 1000}
                  cy={centerY * 1000}
                  r={detectionRadius * 1000}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2"
                  strokeDasharray="10 5"
                  opacity="0.3"
                />

                {/* Facility */}
                <rect
                  x={centerX * 1000 - 50}
                  y={centerY * 1000 - 50}
                  width="100"
                  height="100"
                  fill="#3a3a3a"
                  stroke="#10b981"
                  strokeWidth="3"
                />

                {/* Trajectory Line */}
                <polyline
                  points={simulation.trajectory
                    .slice(0, Math.floor(simulation.trajectory.length * (currentPosition ? 1 : 0)))
                    .map(p => `${p.x * 1000},${p.y * 1000}`)
                    .join(' ')}
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="2"
                  opacity="0.5"
                />

                {/* Current Threat Position */}
                <circle
                  cx={currentPosition.x * 1000}
                  cy={currentPosition.y * 1000}
                  r="15"
                  fill="#ef4444"
                  className="animate-pulse-red"
                />
                <circle
                  cx={currentPosition.x * 1000}
                  cy={currentPosition.y * 1000}
                  r="25"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="2"
                  opacity="0.5"
                  className="animate-pulse-red"
                />

                {/* Sensors */}
                {[
                  { x: 0.2, y: 0.3, icon: Radio },
                  { x: 0.8, y: 0.3, icon: Wifi },
                  { x: 0.2, y: 0.7, icon: Camera },
                  { x: 0.8, y: 0.7, icon: Volume2 },
                ].map((sensor, idx) => (
                  <circle
                    key={idx}
                    cx={sensor.x * 1000}
                    cy={sensor.y * 1000}
                    r="20"
                    fill="#10b981"
                    opacity="0.6"
                  />
                ))}
              </svg>

              {/* Info Overlay */}
              <div className="absolute bottom-4 left-4 bg-primary-bg-card/90 border border-primary-border rounded-lg p-4">
                <p className="text-text-secondary text-xs font-bold mb-2">Closest Approach Estimate</p>
                <p className="text-text-primary font-black">
                  {(closestApproach / 1000).toFixed(2)}km
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="space-y-4">
          <ThreatDetails
            simulation={simulation}
            currentPosition={{
              ...currentPosition,
              speed: simulation.speed,
            }}
          />
          <AIClassification threatType={simulation.threatType} />
          <RecommendedActions onExecuteCountermeasure={handleExecuteCountermeasure} />

          {/* Timeline */}
          <div className="card">
            <h3 className="text-lg font-black text-text-primary mb-4">Threat Timeline</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-secondary font-bold">Detection</span>
                <span className="text-text-primary font-black">00:00</span>
              </div>
              <div className="h-2 bg-primary-bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent-danger transition-all duration-500"
                  style={{
                    width: `${(currentPosition.distance / simulation.initialDistance) * 100}%`,
                  }}
                />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-secondary font-bold">Current</span>
                <span className="text-text-primary font-black">
                  {((currentPosition.distance / simulation.initialDistance) * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

