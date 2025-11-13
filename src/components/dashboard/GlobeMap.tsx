import { useEffect, useRef, useState } from 'react';
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
  const [hoveredPoint, setHoveredPoint] = useState<any>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [pulseTime, setPulseTime] = useState(0);

  // Update pulse animation
  useEffect(() => {
    const interval = setInterval(() => {
      setPulseTime(Date.now());
    }, 50); // Update every 50ms for smooth animation
    return () => clearInterval(interval);
  }, []);

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

  // Convert facilities to points on the globe - very small pulsing dots
  const facilityPoints = FACILITIES.map((facility) => ({
    lat: facility.coordinates.lat,
    lng: facility.coordinates.lng,
    size: 0.5, // Reduced by ~85% from 3
    color: '#10b981',
    label: facility.name,
    altitude: 0.01,
    type: 'facility',
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
    size: 0.3, // Reduced by ~85% from 2
    color: sensor.color,
    type: sensor.type,
    label: `${sensor.type} Sensor`,
  }));

  // Threat point if active - also smaller
  const threatPoints = threatPosition
    ? [
        {
          lat: threatPosition.lat,
          lng: threatPosition.lng,
          size: 1.5, // Reduced by ~87% from 12
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

      <div
        className="relative w-full"
        style={{ height: '500px', background: '#050a14' }}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          setTooltipPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        }}
      >
        <div className="globe-container w-full h-full">
          <Globe
            ref={globeEl}
            globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
            backgroundColor="rgba(5, 10, 20, 0)"
            height={500}
          pointsData={[...facilityPoints, ...sensorPoints, ...threatPoints]}
          pointColor="color"
          pointRadius={(d: any) => {
            // Create pulsing effect for facilities - very small dots
            if (d.type === 'facility') {
              const pulse = Math.sin(pulseTime / 1000) * 0.3 + 0.5; // Reduced by ~85%
              return pulse;
            }
            return d.size;
          }}
          pointResolution={16}
          pointLabel={(d: any) => d.label || ''}
          pointAltitude="altitude"
          onPointHover={(point: any) => {
            if (point) {
              setHoveredPoint(point);
            } else {
              setHoveredPoint(null);
            }
          }}
          onPointClick={(point: any) => {
            if (point && point.label) {
              setHoveredPoint(point);
            }
          }}
          arcsData={arcs}
          arcColor="color"
          arcDashLength={0.3}
          arcDashGap={0.4}
          arcDashAnimateTime={3000}
          arcStroke={0.8}
          arcCurveResolution={64}
          // Remove rings - too intrusive, using small pulsing dots instead
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

        {/* Hover Tooltip */}
        {hoveredPoint && (
          <div
            className="absolute bg-primary-bg-card border border-primary-border rounded-lg p-3 z-50 shadow-xl pointer-events-none"
            style={{
              left: `${tooltipPosition.x + 10}px`,
              top: `${tooltipPosition.y - 10}px`,
              maxWidth: '250px',
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: hoveredPoint.color }}
              />
              <h4 className="text-text-primary font-black text-sm">
                {hoveredPoint.label || hoveredPoint.type}
              </h4>
            </div>
            {hoveredPoint.type === 'facility' && (
              <div className="space-y-1 text-xs">
                <p className="text-text-secondary font-bold">
                  Location: {hoveredPoint.lat.toFixed(4)}°, {hoveredPoint.lng.toFixed(4)}°
                </p>
                <p className="text-text-secondary font-bold">Status: Active Monitoring</p>
                <p className="text-text-secondary font-bold">Detection Range: 3km</p>
              </div>
            )}
            {hoveredPoint.type && hoveredPoint.type !== 'facility' && (
              <div className="space-y-1 text-xs">
                <p className="text-text-secondary font-bold">
                  Type: {hoveredPoint.type.toUpperCase()} Sensor
                </p>
                <p className="text-text-secondary font-bold">Status: Active</p>
              </div>
            )}
          </div>
        )}

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-primary-bg-card/90 border border-primary-border rounded-lg p-3 z-10 backdrop-blur-sm">
          <p className="text-text-secondary text-xs font-bold mb-2">Detection Zone: 3km radius</p>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent-success animate-pulse" />
              <span className="text-text-primary text-xs font-bold">Facility (hover for info)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent-warning" />
              <span className="text-text-primary text-xs font-bold">Sensors</span>
            </div>
            {threatPosition && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-accent-danger animate-pulse" />
                <span className="text-text-primary text-xs font-bold">Active Threat</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

