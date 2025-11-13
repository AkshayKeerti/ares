import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useThreatSimulation } from '../hooks/useThreatSimulation';
import { ThreatAlertBanner } from '../components/threats/ThreatAlertBanner';
import { ThreatDetails } from '../components/threats/ThreatDetails';
import { AIClassification } from '../components/threats/AIClassification';
import { RecommendedActions } from '../components/threats/RecommendedActions';
import { GlobeToRadarTransition } from '../components/threats/GlobeToRadarTransition';

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
        {/* Globe to Radar Transition */}
        <div className="col-span-2">
          <GlobeToRadarTransition simulation={simulation} currentPosition={currentPosition} />
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

