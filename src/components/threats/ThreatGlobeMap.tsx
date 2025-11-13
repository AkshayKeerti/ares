import { useEffect, useRef, useState } from 'react';
import Globe from 'react-globe.gl';
import type { ThreatSimulation, ThreatPosition } from '../../data/mockThreats';
import { FACILITIES } from '../../utils/constants';

interface ThreatGlobeMapProps {
  simulation: ThreatSimulation;
  currentPosition: ThreatPosition;
}

export const ThreatGlobeMap = ({ simulation, currentPosition }: ThreatGlobeMapProps) => {
  const globeEl = useRef<any>(null);
  const [pulseTime, setPulseTime] = useState(0);

  // Update pulse animation for threat point
  useEffect(() => {
    const interval = setInterval(() => {
      setPulseTime(Date.now());
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Convert relative position to lat/lng (approximate, using first facility as center)
  const facility = FACILITIES[0];
  const baseLat = facility.coordinates.lat;
  const baseLng = facility.coordinates.lng;

  useEffect(() => {
    // Set initial view after a short delay to ensure globe is rendered
    // Use standard view (not zoomed in) - let user control zoom
    const timer = setTimeout(() => {
      if (globeEl.current) {
        // Center on Poland (Gdańsk area where facilities are located) - standard view
        globeEl.current.pointOfView({ lat: baseLat, lng: baseLng, altitude: 2.5 }, 0);
        
        const controls = globeEl.current.controls();
        if (controls) {
          controls.enableZoom = true;
          controls.enableRotate = true;
          controls.autoRotate = false;
        }
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, [baseLat, baseLng]);

  // Convert relative position (0-1) to lat/lng offset
  // Rough approximation: 0.1 in relative units ≈ 0.01 degrees
  // Use currentPosition to calculate threat location dynamically
  const threatLat = baseLat + (currentPosition.y - 0.5) * 0.02;
  const threatLng = baseLng + (currentPosition.x - 0.5) * 0.02;

  // Camera stays fixed - no automatic tracking

  const facilityPoint = {
    lat: baseLat,
    lng: baseLng,
    size: 0.5, // Reduced by ~95% from 10
    color: '#10b981',
    label: facility.name,
  };

  const threatPoint = {
    lat: threatLat,
    lng: threatLng,
    size: 0.15, // Very small - reduced by ~98% from 8px
    color: '#ef4444',
    altitude: currentPosition.altitude / 1000, // Convert meters to km
    label: 'Threat',
  };

  // Create trajectory path - extremely small dots
  const trajectoryPoints = simulation.trajectory
    .slice(0, Math.floor(simulation.trajectory.length * 0.8))
    .map((pos) => ({
      lat: baseLat + (pos.y - 0.5) * 0.02,
      lng: baseLng + (pos.x - 0.5) * 0.02,
      size: 0.1, // Extremely small
      color: '#ef4444',
      opacity: 0.5,
    }));

  // Arc from facility to threat - make it more visible
  const threatArc = {
    startLat: baseLat,
    startLng: baseLng,
    endLat: threatLat,
    endLng: threatLng,
    color: ['#ef4444'],
    stroke: 3,
  };

  // Remove detection rings - they're causing rectangular artifacts and aren't needed for close-up view

  // Calculate closest approach
  const closestApproach = Math.min(...simulation.trajectory.map((p) => p.distance));

  return (
    <div className="card p-0 overflow-hidden relative">
      <div className="p-4 border-b border-primary-border">
        <h3 className="text-lg font-black text-text-primary">Threat Position & Trajectory</h3>
      </div>
      <div className="relative w-full" style={{ height: '600px', background: '#0a1628' }}>
        <div className="globe-container w-full h-full">
          <Globe
            ref={globeEl}
            globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
            backgroundColor="rgba(10, 22, 40, 0)"
            height={600}
          pointsData={[facilityPoint, threatPoint, ...trajectoryPoints]}
          pointColor="color"
          pointRadius={(d: any) => {
            // Make threat point pulse slightly for visibility (extremely small)
            if (d.label === 'Threat') {
              const pulse = Math.sin(pulseTime / 500) * 0.05 + 0.15;
              return pulse;
            }
            return d.size;
          }}
          pointResolution={16}
          pointLabel={(d: any) => d.label || ''}
          arcsData={[threatArc]}
          arcColor="color"
          arcDashLength={0.3}
          arcDashGap={0.3}
          arcDashAnimateTime={2000}
          arcStroke={3}
          arcCurveResolution={64}
          arcAltitudeAutoScale={0.3}
          onGlobeReady={() => {
            if (globeEl.current) {
              // Standard view - no automatic zoom
              globeEl.current.pointOfView({ lat: baseLat, lng: baseLng, altitude: 2.5 }, 1000);
              
              const controls = globeEl.current.controls();
              if (controls) {
                controls.enableZoom = true;
                controls.enableRotate = true;
                controls.autoRotate = false;
              }
            }
          }}
          />
        </div>

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

