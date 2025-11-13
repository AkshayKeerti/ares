import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Radio, Wifi, Camera, Volume2 } from 'lucide-react';

interface AirspaceMapProps {
  onSimulateThreat?: () => void;
}

export const AirspaceMap = ({ onSimulateThreat }: AirspaceMapProps) => {
  const navigate = useNavigate();
  const [hoveredSensor, setHoveredSensor] = useState<string | null>(null);

  const handleSimulateThreat = () => {
    if (onSimulateThreat) {
      onSimulateThreat();
    }
    navigate('/threats');
  };

  const sensors = [
    { id: 'radar', x: 0.2, y: 0.3, icon: Radio, label: 'Radar', color: '#10b981' },
    { id: 'rf', x: 0.8, y: 0.3, icon: Wifi, label: 'RF', color: '#f59e0b' },
    { id: 'visual', x: 0.2, y: 0.7, icon: Camera, label: 'Visual', color: '#3b82f6' },
    { id: 'acoustic', x: 0.8, y: 0.7, icon: Volume2, label: 'Acoustic', color: '#8b5cf6' },
  ];

  const centerX = 0.5;
  const centerY = 0.5;
  const detectionRadius = 0.3; // 3km radius in relative units

  return (
    <div className="card p-0 overflow-hidden">
      <div className="p-4 border-b border-primary-border flex items-center justify-between">
        <h3 className="text-lg font-black text-text-primary">Live Airspace Map</h3>
        <button
          onClick={handleSimulateThreat}
          className="btn-secondary text-sm px-4 py-2"
        >
          Simulate Threat
        </button>
      </div>
      
      <div className="relative bg-primary-bg-secondary" style={{ height: '500px' }}>
        <svg
          viewBox="0 0 1000 1000"
          className="w-full h-full"
          style={{ background: 'radial-gradient(circle at center, #2d2d2d 0%, #1a1a1a 100%)' }}
        >
          {/* Detection Zone Circle */}
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
          
          {/* Facility Perimeter */}
          <rect
            x={centerX * 1000 - 50}
            y={centerY * 1000 - 50}
            width="100"
            height="100"
            fill="#3a3a3a"
            stroke="#10b981"
            strokeWidth="3"
          />
          <text
            x={centerX * 1000}
            y={centerY * 1000 + 5}
            textAnchor="middle"
            className="fill-text-primary font-bold text-sm"
            style={{ fontSize: '24px' }}
          >
            Facility
          </text>

          {/* Sensors */}
          {sensors.map((sensor) => {
            const Icon = sensor.icon;
            const isHovered = hoveredSensor === sensor.id;
            const sensorX = sensor.x * 1000;
            const sensorY = sensor.y * 1000;
            
            // Draw connection line to center
            return (
              <g key={sensor.id}>
                <line
                  x1={sensorX}
                  y1={sensorY}
                  x2={centerX * 1000}
                  y2={centerY * 1000}
                  stroke={sensor.color}
                  strokeWidth="1"
                  opacity="0.2"
                />
                <circle
                  cx={sensorX}
                  cy={sensorY}
                  r={isHovered ? 25 : 20}
                  fill={sensor.color}
                  opacity={isHovered ? 0.8 : 0.6}
                  className="cursor-pointer transition-all"
                  onMouseEnter={() => setHoveredSensor(sensor.id)}
                  onMouseLeave={() => setHoveredSensor(null)}
                />
                <foreignObject
                  x={sensorX - 30}
                  y={sensorY - 50}
                  width="60"
                  height="40"
                >
                  <div className="text-center">
                    <Icon className="w-6 h-6 mx-auto text-white" />
                    <p className="text-white text-xs font-bold mt-1">{sensor.label}</p>
                  </div>
                </foreignObject>
              </g>
            );
          })}

          {/* Grid lines */}
          <defs>
            <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
              <path
                d="M 100 0 L 0 0 0 100"
                fill="none"
                stroke="#4a4a4a"
                strokeWidth="0.5"
                opacity="0.3"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-primary-bg-card/90 border border-primary-border rounded-lg p-3">
          <p className="text-text-secondary text-xs font-bold mb-2">Detection Zone: 3km radius</p>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-accent-success" />
            <span className="text-text-primary text-xs font-bold">Active Monitoring</span>
          </div>
        </div>
      </div>
    </div>
  );
};

