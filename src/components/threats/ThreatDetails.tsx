import { Gauge, Navigation, Radio } from 'lucide-react';
import type { ThreatSimulation } from '../../data/mockThreats';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface ThreatDetailsProps {
  simulation: ThreatSimulation;
  currentPosition: { distance: number; bearing: number; altitude: number; speed: number } | null;
}

export const ThreatDetails = ({ simulation, currentPosition }: ThreatDetailsProps) => {
  return (
    <div className="card space-y-4">
      <h3 className="text-lg font-black text-text-primary">Threat Details</h3>
      
      {currentPosition && (
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3 bg-primary-bg-secondary rounded-lg">
            <Gauge className="w-5 h-5 text-accent-success" />
            <div>
              <p className="text-text-secondary text-xs font-bold">Speed</p>
              <p className="text-text-primary font-black">{currentPosition.speed} m/s</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-primary-bg-secondary rounded-lg">
            <Navigation className="w-5 h-5 text-accent-warning" />
            <div>
              <p className="text-text-secondary text-xs font-bold">Heading</p>
              <p className="text-text-primary font-black">{currentPosition.bearing}°</p>
            </div>
          </div>
        </div>
      )}

      <div>
        <h4 className="text-text-primary font-bold mb-2 flex items-center gap-2">
          <Radio className="w-4 h-4" />
          RF Signature
        </h4>
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={simulation.rfSignature.slice(0, 20)}>
              <Bar dataKey="strength" fill="#f59e0b" />
              <XAxis dataKey="frequency" hide />
              <YAxis hide />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div>
        <h4 className="text-text-primary font-bold mb-2">Visual Identification</h4>
        <div className="h-32 bg-primary-bg-secondary rounded-lg flex items-center justify-center border border-primary-border">
          <div className="text-center">
            <div className="w-16 h-16 bg-accent-warning/20 rounded-lg mx-auto mb-2 flex items-center justify-center">
              <Radio className="w-8 h-8 text-accent-warning" />
            </div>
            <p className="text-text-secondary text-xs font-bold">{simulation.threatType}</p>
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-text-primary font-bold mb-2">Audio Signature</h4>
        <div className="h-24">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={simulation.audioSignature.slice(0, 50)}>
              <Line
                type="monotone"
                dataKey="amplitude"
                stroke="#8b5cf6"
                strokeWidth={2}
                dot={false}
              />
              <XAxis dataKey="time" hide />
              <YAxis hide />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

