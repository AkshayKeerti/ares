import { Radio, Wifi, Camera, Volume2 } from 'lucide-react';
import type { SensorReading } from '../../data/mockData';

interface SensorDetailViewProps {
  sensor: SensorReading;
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

export const SensorDetailView = ({ sensor }: SensorDetailViewProps) => {
  const Icon = sensorIcons[sensor.sensorType as keyof typeof sensorIcons] || Radio;
  const color = sensorColors[sensor.sensorType as keyof typeof sensorColors] || '#10b981';

  return (
    <div className="space-y-6">
      {/* Coverage Map */}
      <div className="card">
        <h3 className="text-lg font-black text-text-primary mb-4">Coverage Area</h3>
        <div className="relative bg-primary-bg-secondary rounded-lg" style={{ height: '300px' }}>
          <svg viewBox="0 0 1000 1000" className="w-full h-full">
            <circle
              cx="500"
              cy="500"
              r="400"
              fill="none"
              stroke={color}
              strokeWidth="3"
              strokeDasharray="10 5"
              opacity="0.3"
            />
            <circle
              cx="500"
              cy="500"
              r="20"
              fill={color}
              opacity="0.8"
            />
            <foreignObject x="450" y="480" width="100" height="40">
              <div className="text-center">
                <Icon className="w-6 h-6 mx-auto text-white" />
                <p className="text-white text-xs font-bold mt-1">{sensor.sensorType}</p>
              </div>
            </foreignObject>
          </svg>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <div className="card">
          <h4 className="text-text-primary font-bold mb-2">Performance Metrics</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-text-secondary text-sm font-bold">Detection Rate</span>
              <span className="text-text-primary font-black">{sensor.detectionRate}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary text-sm font-bold">False Positive Rate</span>
              <span className="text-text-primary font-black">{sensor.falsePositiveRate}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary text-sm font-bold">Uptime</span>
              <span className="text-text-primary font-black">99.2%</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h4 className="text-text-primary font-bold mb-2">System Information</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-text-secondary text-sm font-bold">Sensor ID</span>
              <span className="text-text-primary font-black text-xs">{sensor.sensorId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary text-sm font-bold">Last Calibration</span>
              <span className="text-text-primary font-black text-xs">
                {sensor.lastCalibration.toLocaleDateString('en-GB')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary text-sm font-bold">Status</span>
              <span className="text-text-primary font-black">{sensor.status}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Diagnostic Logs */}
      <div className="card">
        <h4 className="text-text-primary font-bold mb-4">Diagnostic Logs</h4>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {[
            { time: '14:32', message: 'System check completed - All systems operational', type: 'info' },
            { time: '14:15', message: 'Calibration routine executed successfully', type: 'success' },
            { time: '13:45', message: 'Data transmission verified', type: 'info' },
            { time: '13:20', message: 'Sensor sensitivity adjusted', type: 'warning' },
            { time: '12:55', message: 'Connection restored', type: 'success' },
          ].map((log, idx) => (
            <div key={idx} className="flex items-start gap-3 p-2 hover:bg-primary-bg-secondary rounded">
              <span className="text-text-secondary text-xs font-bold min-w-[50px]">{log.time}</span>
              <span className={`text-sm font-bold ${
                log.type === 'success' ? 'text-accent-success' :
                log.type === 'warning' ? 'text-accent-warning' :
                'text-text-secondary'
              }`}>
                {log.message}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

