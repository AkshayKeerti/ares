import { useState, useEffect } from 'react';
import { Radio, Wifi, Camera, Volume2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface SensorData {
  id: string;
  name: string;
  type: string;
  icon: typeof Radio;
  status: 'Active' | 'Warning' | 'Error';
  data: Array<{ time: number; value: number }>;
  currentValue: string;
}

export const SensorFusion = () => {
  const [sensors, setSensors] = useState<SensorData[]>([
    {
      id: 'radar',
      name: 'Radar',
      type: 'Radar',
      icon: Radio,
      status: 'Active',
      data: Array.from({ length: 20 }, (_, i) => ({
        time: i,
        value: 2 + Math.random() * 0.5,
      })),
      currentValue: '2 objects tracked',
    },
    {
      id: 'rf',
      name: 'RF Spectrum',
      type: 'RF Spectrum',
      icon: Wifi,
      status: 'Active',
      data: Array.from({ length: 20 }, (_, i) => ({
        time: i,
        value: Math.random() * 0.3,
      })),
      currentValue: '0 drone signals',
    },
    {
      id: 'visual',
      name: 'Visual Camera',
      type: 'Visual Camera',
      icon: Camera,
      status: 'Active',
      data: Array.from({ length: 20 }, (_, i) => ({
        time: i,
        value: 0,
      })),
      currentValue: 'No threats',
    },
    {
      id: 'acoustic',
      name: 'Acoustic',
      type: 'Acoustic',
      icon: Volume2,
      status: 'Active',
      data: Array.from({ length: 20 }, (_, i) => ({
        time: i,
        value: 0.2 + Math.sin(i * 0.3) * 0.1 + Math.random() * 0.05,
      })),
      currentValue: 'Ambient noise only',
    },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSensors((prev) =>
        prev.map((sensor) => ({
          ...sensor,
          data: [
            ...sensor.data.slice(1),
            {
              time: sensor.data[sensor.data.length - 1].time + 1,
              value:
                sensor.type === 'Radar'
                  ? 2 + Math.random() * 0.5
                  : sensor.type === 'RF Spectrum'
                  ? Math.random() * 0.3
                  : sensor.type === 'Acoustic'
                  ? 0.2 + Math.sin(Date.now() * 0.001) * 0.1 + Math.random() * 0.05
                  : 0,
            },
          ],
        }))
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-black text-text-primary">Sensor Fusion</h3>
      <div className="grid grid-cols-2 gap-4" style={{ minWidth: 0 }}>
        {sensors.map((sensor) => {
          const Icon = sensor.icon;
          return (
            <div key={sensor.id} className="card relative" style={{ overflow: 'visible' }}>
              <div className="absolute top-4 right-4 z-10">
                <div className="w-3 h-3 rounded-full bg-accent-success" />
              </div>
              <div className="flex items-center mb-4 gap-3 pr-8">
                <div className="p-2 bg-primary-bg-secondary rounded-lg flex-shrink-0">
                  <Icon className="w-5 h-5 text-text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-black text-text-primary">{sensor.name}</h4>
                  <p className="text-text-secondary text-xs font-bold">{sensor.currentValue}</p>
                </div>
              </div>

              <div className="overflow-hidden">
                {sensor.type === 'Visual Camera' ? (
                  <div className="h-32 bg-primary-bg-secondary rounded-lg flex items-center justify-center border border-primary-border relative">
                    <div className="text-center z-10">
                      <Camera className="w-8 h-8 text-text-secondary mx-auto mb-2" />
                      <p className="text-text-secondary text-xs font-bold">Camera Feed</p>
                    </div>
                  </div>
                ) : sensor.type === 'Acoustic' ? (
                  <div className="h-32 w-full relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart 
                        data={sensor.data} 
                        margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
                      >
                        <defs>
                          <linearGradient id={`acousticGradient-${sensor.id}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.4} />
                            <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.1} />
                          </linearGradient>
                        </defs>
                        <Area
                          type="monotone"
                          dataKey="value"
                          stroke="#8b5cf6"
                          fill={`url(#acousticGradient-${sensor.id})`}
                          strokeWidth={2}
                        />
                        <XAxis dataKey="time" hide />
                        <YAxis hide />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-32 w-full relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart 
                        data={sensor.data} 
                        margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
                      >
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke={sensor.type === 'Radar' ? '#10b981' : '#f59e0b'}
                          strokeWidth={2}
                          dot={false}
                          isAnimationActive={false}
                        />
                        <XAxis dataKey="time" hide />
                        <YAxis hide />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

