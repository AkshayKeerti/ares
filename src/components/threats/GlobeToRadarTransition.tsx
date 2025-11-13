import { useEffect, useRef, useState } from 'react';
import Globe from 'react-globe.gl';
import type { ThreatSimulation, ThreatPosition } from '../../data/mockThreats';
import { FACILITIES } from '../../utils/constants';
import { RadarScreen } from './RadarScreen';

interface GlobeToRadarTransitionProps {
  simulation: ThreatSimulation;
  currentPosition: ThreatPosition;
}

export const GlobeToRadarTransition = ({ simulation, currentPosition }: GlobeToRadarTransitionProps) => {
  const globeEl = useRef<any>(null);
  const [phase, setPhase] = useState<'globe' | 'zooming' | 'transitioning' | 'radar'>('globe');
  const [globeOpacity, setGlobeOpacity] = useState(1);
  const [radarOpacity, setRadarOpacity] = useState(0);

  const facility = FACILITIES[0];
  const baseLat = facility.coordinates.lat;
  const baseLng = facility.coordinates.lng;

  useEffect(() => {
    // Initial setup - show globe
    const timer1 = setTimeout(() => {
      if (globeEl.current) {
        // Start with standard view
        globeEl.current.pointOfView({ lat: baseLat, lng: baseLng, altitude: 2.5 }, 0);
        
        const controls = globeEl.current.controls();
        if (controls) {
          controls.enableZoom = false;
          controls.enableRotate = false;
          controls.autoRotate = false;
        }
      }
    }, 100);

    // Start zoom after 1 second
    const timer2 = setTimeout(() => {
      setPhase('zooming');
      if (globeEl.current) {
        // Zoom in dramatically (altitude 0.1 = very close)
        globeEl.current.pointOfView({ lat: baseLat, lng: baseLng, altitude: 0.1 }, 2000);
      }
    }, 1500);

    // After zoom completes, start transition
    const timer3 = setTimeout(() => {
      setPhase('transitioning');
      // Fade out globe
      setGlobeOpacity(0);
    }, 3500);

    // Show radar after transition
    const timer4 = setTimeout(() => {
      setPhase('radar');
      setRadarOpacity(1);
    }, 4000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [baseLat, baseLng]);

  // No points on the globe - just show the globe itself

  return (
    <div className="card p-0 overflow-hidden relative">
      <div className="p-4 border-b border-primary-border">
        <h3 className="text-lg font-black text-text-primary">
          {phase === 'radar' ? 'Radar Display' : 'Threat Position & Trajectory'}
        </h3>
      </div>
      <div className="relative w-full" style={{ height: '600px', background: '#0a1628' }}>
        {/* Globe View */}
        <div
          className="absolute inset-0 globe-container"
          style={{
            opacity: globeOpacity,
            transition: 'opacity 0.5s ease-in-out',
            pointerEvents: phase === 'radar' ? 'none' : 'auto',
          }}
        >
          <Globe
            ref={globeEl}
            globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
            backgroundColor="rgba(10, 22, 40, 0)"
            height={600}
            onGlobeReady={() => {
              if (globeEl.current) {
                globeEl.current.pointOfView({ lat: baseLat, lng: baseLng, altitude: 2.5 }, 0);
                
                const controls = globeEl.current.controls();
                if (controls) {
                  controls.enableZoom = false;
                  controls.enableRotate = false;
                  controls.autoRotate = false;
                }
              }
            }}
          />
        </div>

        {/* Radar Screen View */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{
            opacity: radarOpacity,
            transition: 'opacity 0.5s ease-in-out',
            pointerEvents: phase === 'radar' ? 'auto' : 'none',
          }}
        >
          <RadarScreen simulation={simulation} currentPosition={currentPosition} />
        </div>
      </div>
    </div>
  );
};

