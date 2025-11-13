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
    // Set initial view after a short delay to ensure globe is rendered
    const timer = setTimeout(() => {
      if (globeEl.current) {
        // Center on Poland (Gdańsk area where facilities are located)
        globeEl.current.pointOfView({ lat: 54.3520, lng: 18.6466, altitude: 2.5 }, 0);
        
        // Auto-rotate the globe
        const controls = globeEl.current.controls();
        if (controls) {
          controls.autoRotate = true;
          controls.autoRotateSpeed = 0.5;
        }
      }
    }, 100);
    
    return () => clearTimeout(timer);
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
    size: 10,
    color: '#10b981',
    label: facility.name,
    altitude: 0.01,
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
      <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between">
        <h3 className="text-lg font-black text-text-primary">Live Airspace Map</h3>
        <button
          onClick={handleSimulateThreat}
          className="btn-secondary text-sm px-4 py-2 z-20 relative"
        >
          Simulate Threat
        </button>
      </div>

      <div className="relative w-full" style={{ height: '500px', background: '#0a1628' }}>
        <div className="globe-container w-full h-full">
          <Globe
            ref={globeEl}
            globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
            backgroundColor="rgba(10, 22, 40, 0)"
            height={500}
          pointsData={[...facilityPoints, ...sensorPoints, ...threatPoints]}
          pointColor="color"
          pointRadius="size"
          pointResolution={8}
          pointLabel={(d: any) => d.label || ''}
          pointAltitude="altitude"
          arcsData={arcs}
          arcColor="color"
          arcDashLength={0.3}
          arcDashGap={0.4}
          arcDashAnimateTime={3000}
          arcStroke={0.8}
          arcCurveResolution={64}
          ringsData={facilityPoints.map((point) => ({
            lat: point.lat,
            lng: point.lng,
            maxRadius: 15,
            propagationSpeed: 1.5,
            repeatPeriod: 3000,
          }))}
          ringColor={(t: number) => {
            // Create a gradient effect that fades in and out
            const opacity = Math.sin(t * Math.PI) * 0.2 + 0.1;
            return `rgba(16, 185, 129, ${opacity})`;
          }}
          ringMaxRadius="maxRadius"
          ringPropagationSpeed="propagationSpeed"
          ringRepeatPeriod="repeatPeriod"
          ringResolution={64}
          onGlobeReady={() => {
            if (globeEl.current) {
              // Center on Poland (Gdańsk area where facilities are located)
              globeEl.current.pointOfView({ lat: 54.3520, lng: 18.6466, altitude: 2.5 }, 1000);
              
              // Enable auto-rotation
              const controls = globeEl.current.controls();
              if (controls) {
                controls.autoRotate = true;
                controls.autoRotateSpeed = 0.5;
                controls.enableZoom = true;
                controls.enableRotate = true;
              }
            }
          }}
          />
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-primary-bg-card/90 border border-primary-border rounded-lg p-3 z-10 backdrop-blur-sm">
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

