import { Radio, Wifi, Camera, Volume2, ChevronDown, ChevronUp } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { StatusBadge } from '../shared/StatusBadge';
import type { SensorReading } from '../../data/mockData';

interface SensorCardProps {
  sensor: SensorReading;
  onExpand?: () => void;
  isExpanded?: boolean;
}

const sensorIcons = {
  Radar: Radio,
  'RF Spectrum': Wifi,
  'Visual Camera': Camera,
  Acoustic: Volume2,
};

const sensorColors = {
  Radar: '#10b981',
  'RF Spectrum': '#f59e0b',
  'Visual Camera': '#3b82f6',
  Acoustic: '#8b5cf6',
};

export const SensorCard = ({ sensor, onExpand, isExpanded }: SensorCardProps) => {
  const Icon = sensorIcons[sensor.sensorType as keyof typeof sensorIcons] || Radio;
  const color = sensorColors[sensor.sensorType as keyof typeof sensorColors] || '#10b981';

  const statusColor =
    sensor.status === 'Operational'
      ? 'success'
      : sensor.status === 'Warning'
      ? 'warning'
      : 'danger';

  return (
    <div className="card">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary-bg-secondary rounded-lg" style={{ backgroundColor: `${color}20` }}>
            <Icon className="w-6 h-6" style={{ color }} />
          </div>
          <div>
            <h3 className="text-lg font-black text-text-primary">{sensor.sensorType}</h3>
            <p className="text-text-secondary text-xs font-bold">ID: {sensor.sensorId}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={statusColor}>{sensor.status}</StatusBadge>
          {onExpand && (
            <button
              onClick={onExpand}
              className="p-2 hover:bg-primary-bg-secondary rounded-lg transition-colors"
            >
              {isExpanded ? (
                <ChevronUp className="w-5 h-5 text-text-secondary" />
              ) : (
                <ChevronDown className="w-5 h-5 text-text-secondary" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Live Data Visualization */}
      <div className="mb-4">
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            {sensor.sensorType === 'Acoustic' ? (
              <AreaChart data={sensor.data}>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={color}
                  fill={color}
                  fillOpacity={0.3}
                />
                <XAxis dataKey="timestamp" hide />
                <YAxis hide />
              </AreaChart>
            ) : (
              <LineChart data={sensor.data}>
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={color}
                  strokeWidth={2}
                  dot={false}
                />
                <XAxis dataKey="timestamp" hide />
                <YAxis hide />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-text-secondary font-bold mb-1">Detection Rate</p>
          <p className="text-text-primary font-black">{sensor.detectionRate}%</p>
        </div>
        <div>
          <p className="text-text-secondary font-bold mb-1">False Positive Rate</p>
          <p className="text-text-primary font-black">{sensor.falsePositiveRate}%</p>
        </div>
        <div>
          <p className="text-text-secondary font-bold mb-1">Current Value</p>
          <p className="text-text-primary font-black">{sensor.currentValue.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-text-secondary font-bold mb-1">Last Calibration</p>
          <p className="text-text-primary font-black text-xs">
            {sensor.lastCalibration.toLocaleDateString('en-GB')}
          </p>
        </div>
      </div>
    </div>
  );
};

