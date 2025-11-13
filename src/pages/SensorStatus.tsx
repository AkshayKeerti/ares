import { useState } from 'react';
import { SensorCard } from '../components/sensors/SensorCard';
import { SensorDetailView } from '../components/sensors/SensorDetailView';
import { mockSensorReadings } from '../data/mockData';

export const SensorStatus = () => {
  const [expandedSensor, setExpandedSensor] = useState<string | null>(null);

  const handleToggleExpand = (sensorId: string) => {
    setExpandedSensor(expandedSensor === sensorId ? null : sensorId);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-text-primary mb-2">Sensor Status</h1>
        <p className="text-text-secondary font-bold">Real-time monitoring of all detection sensors</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {mockSensorReadings.map((sensor) => (
          <div key={sensor.sensorId}>
            <SensorCard
              sensor={sensor}
              onExpand={() => handleToggleExpand(sensor.sensorId)}
              isExpanded={expandedSensor === sensor.sensorId}
            />
            {expandedSensor === sensor.sensorId && (
              <div className="mt-4">
                <SensorDetailView sensor={sensor} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

