import { useEffect, useRef } from 'react';
import Globe from 'react-globe.gl';
import type { ThreatSimulation, ThreatPosition } from '../../data/mockThreats';
import { FACILITIES } from '../../utils/constants';

interface ThreatGlobeMapProps {
  simulation: ThreatSimulation;
  currentPosition: ThreatPosition;
}

export const ThreatGlobeMap = ({ simulation, currentPosition }: ThreatGlobeMapProps) => {
  const globeEl = useRef<any>(null);

  useEffect(() => {
    if (globeEl.current) {
      globeEl.current.controls().enableZoom = true;
      globeEl.current.controls().enableRotate = true;
      globeEl.current.controls().autoRotate = false;
    }
  }, []);

  // Convert relative position to lat/lng (approximate, using first facility as center)
  const facility = FACILITIES[0];
  const baseLat = facility.coordinates.lat;
  const baseLng = facility.coordinates.lng;

  // Convert relative position (0-1) to lat/lng offset
  // Rough approximation: 0.1 in relative units ≈ 0.01 degrees
  const threatLat = baseLat + (currentPosition.y - 0.5) * 0.02;
  const threatLng = baseLng + (currentPosition.x - 0.5) * 0.02;

  const facilityPoint = {
    lat: baseLat,
    lng: baseLng,
    size: 10,
    color: '#10b981',
    label: facility.name,
  };

  const threatPoint = {
    lat: threatLat,
    lng: threatLng,
    size: 15,
    color: '#ef4444',
    altitude: currentPosition.altitude / 1000, // Convert meters to km
  };

  // Create trajectory path
  const trajectoryPoints = simulation.trajectory
    .slice(0, Math.floor(simulation.trajectory.length * 0.8))
    .map((pos) => ({
      lat: baseLat + (pos.y - 0.5) * 0.02,
      lng: baseLng + (pos.x - 0.5) * 0.02,
      size: 3,
      color: '#ef4444',
      opacity: 0.5,
    }));

  // Arc from facility to threat
  const threatArc = {
    startLat: baseLat,
    startLng: baseLng,
    endLat: threatLat,
    endLng: threatLng,
    color: ['#ef4444'],
  };

  // Detection rings
  const rings = [
    {
      lat: baseLat,
      lng: baseLng,
      maxRadius: 30,
      propagationSpeed: 3,
      repeatPeriod: 2000,
    },
  ];

  // Calculate closest approach
  const closestApproach = Math.min(...simulation.trajectory.map((p) => p.distance));

  return (
    <div className="card p-0 overflow-hidden relative">
      <div className="p-4 border-b border-primary-border">
        <h3 className="text-lg font-black text-text-primary">Threat Position & Trajectory</h3>
      </div>
      <div className="relative" style={{ height: '600px', background: '#0a1628' }}>
        <Globe
          ref={globeEl}
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
          backgroundColor="rgba(10, 22, 40, 0)"
          pointsData={[facilityPoint, threatPoint, ...trajectoryPoints]}
          pointColor="color"
          pointRadius="size"
          pointResolution={2}
          pointLabel={(d: any) => d.label || ''}
          arcsData={[threatArc]}
          arcColor="color"
          arcDashLength={0.4}
          arcDashGap={0.2}
          arcDashAnimateTime={1000}
          arcStroke={2}
          ringsData={rings}
          ringColor={() => 'rgba(239, 68, 68, 0.4)'}
          ringMaxRadius="maxRadius"
          ringPropagationSpeed="propagationSpeed"
          ringRepeatPeriod="repeatPeriod"
          onGlobeReady={() => {
            if (globeEl.current) {
              globeEl.current.pointOfView({ lat: baseLat, lng: baseLng, altitude: 2 }, 1000);
            }
          }}
        />

        {/* Info Overlay */}
        <div className="absolute bottom-4 left-4 bg-primary-bg-card/90 border border-primary-border rounded-lg p-4 z-10">
          <p className="text-text-secondary text-xs font-bold mb-2">Closest Approach Estimate</p>
          <p className="text-text-primary font-black">
            {(closestApproach / 1000).toFixed(2)}km
          </p>
          <div className="mt-3 pt-3 border-t border-primary-border">
            <p className="text-text-secondary text-xs font-bold mb-1">Threat Position</p>
            <p className="text-text-primary font-bold text-sm">
              {(currentPosition.distance / 1000).toFixed(2)}km away
            </p>
            <p className="text-text-primary font-bold text-sm">
              Altitude: {currentPosition.altitude.toFixed(0)}m
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

