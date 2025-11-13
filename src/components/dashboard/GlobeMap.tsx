import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Globe from 'react-globe.gl';
import { FACILITIES } from '../../utils/constants';

interface GlobeMapProps {
  onSimulateThreat?: () => void;
  threatPosition?: { lat: number; lng: number; altitude: number } | null;
}

export const GlobeMap = ({ onSimulateThreat, threatPosition }: GlobeMapProps) => {
  const navigate = useNavigate();
  const globeEl = useRef<any>(null);

  useEffect(() => {
    if (globeEl.current) {
      // Auto-rotate the globe
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = 0.5;
    }
  }, []);

  const handleSimulateThreat = () => {
    if (onSimulateThreat) {
      onSimulateThreat();
    }
    navigate('/threats');
  };

  // Convert facilities to points on the globe
  const facilityPoints = FACILITIES.map((facility) => ({
    lat: facility.coordinates.lat,
    lng: facility.coordinates.lng,
    size: 8,
    color: '#10b981',
    label: facility.name,
  }));

  // Sensor positions around the first facility
  const sensorPositions = [
    { lat: 54.3520 + 0.01, lng: 18.6466, type: 'radar', color: '#10b981' },
    { lat: 54.3520 - 0.01, lng: 18.6466, type: 'rf', color: '#f59e0b' },
    { lat: 54.3520, lng: 18.6466 + 0.01, type: 'visual', color: '#3b82f6' },
    { lat: 54.3520, lng: 18.6466 - 0.01, type: 'acoustic', color: '#8b5cf6' },
  ];

  const sensorPoints = sensorPositions.map((sensor) => ({
    lat: sensor.lat,
    lng: sensor.lng,
    size: 6,
    color: sensor.color,
    type: sensor.type,
  }));

  // Threat point if active
  const threatPoints = threatPosition
    ? [
        {
          lat: threatPosition.lat,
          lng: threatPosition.lng,
          size: 12,
          color: '#ef4444',
          altitude: threatPosition.altitude / 1000, // Convert meters to km
        },
      ]
    : [];

  // Arcs showing detection zones (from facility to sensors)
  const arcs = sensorPositions.map((sensor) => ({
    startLat: 54.3520,
    startLng: 18.6466,
    endLat: sensor.lat,
    endLng: sensor.lng,
    color: [sensor.color],
  }));

  return (
    <div className="card p-0 overflow-hidden relative">
      <div className="absolute top-4 left-4 z-10 flex items-center justify-between w-full pr-4">
        <h3 className="text-lg font-black text-text-primary">Live Airspace Map</h3>
        <button
          onClick={handleSimulateThreat}
          className="btn-secondary text-sm px-4 py-2 z-20"
        >
          Simulate Threat
        </button>
      </div>

      <div className="relative" style={{ height: '500px', background: '#0a1628' }}>
        <Globe
          ref={globeEl}
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
          backgroundColor="rgba(10, 22, 40, 0)"
          pointsData={[...facilityPoints, ...sensorPoints, ...threatPoints]}
          pointColor="color"
          pointRadius="size"
          pointResolution={2}
          pointLabel={(d: any) => d.label || ''}
          arcsData={arcs}
          arcColor="color"
          arcDashLength={0.4}
          arcDashGap={0.2}
          arcDashAnimateTime={2000}
          arcStroke={1}
          ringsData={facilityPoints.map((point) => ({
            lat: point.lat,
            lng: point.lng,
            maxRadius: 20,
            propagationSpeed: 2,
            repeatPeriod: 2000,
          }))}
          ringColor={() => 'rgba(16, 185, 129, 0.3)'}
          ringMaxRadius="maxRadius"
          ringPropagationSpeed="propagationSpeed"
          ringRepeatPeriod="repeatPeriod"
          onGlobeReady={() => {
            if (globeEl.current) {
              globeEl.current.pointOfView({ lat: 54.3520, lng: 18.6466, altitude: 2.5 }, 1000);
            }
          }}
        />

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-primary-bg-card/90 border border-primary-border rounded-lg p-3 z-10">
          <p className="text-text-secondary text-xs font-bold mb-2">Detection Zone: 3km radius</p>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-accent-success" />
              <span className="text-text-primary text-xs font-bold">Facility</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-accent-warning" />
              <span className="text-text-primary text-xs font-bold">Sensors</span>
            </div>
            {threatPosition && (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-accent-danger animate-pulse" />
                <span className="text-text-primary text-xs font-bold">Active Threat</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

