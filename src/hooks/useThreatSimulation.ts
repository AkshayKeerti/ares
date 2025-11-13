import { useState, useEffect, useCallback } from 'react';
import type { ThreatSimulation, ThreatPosition } from '../data/mockThreats';
import { generateThreatSimulation } from '../data/mockThreats';

export const useThreatSimulation = () => {
  const [simulation, setSimulation] = useState<ThreatSimulation | null>(null);
  const [currentPosition, setCurrentPosition] = useState<ThreatPosition | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [threatLevel, setThreatLevel] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'>('LOW');

  const startSimulation = useCallback(() => {
    const newSimulation = generateThreatSimulation();
    setSimulation(newSimulation);
    setCurrentIndex(0);
    setIsRunning(true);
    setCurrentPosition(newSimulation.trajectory[0]);
    setThreatLevel(newSimulation.trajectory[0].distance > 1500 ? 'LOW' : 
                   newSimulation.trajectory[0].distance > 1000 ? 'MEDIUM' :
                   newSimulation.trajectory[0].distance > 500 ? 'HIGH' : 'CRITICAL');
  }, []);

  const stopSimulation = useCallback(() => {
    setIsRunning(false);
    setCurrentIndex(0);
    setCurrentPosition(null);
  }, []);

  const resetSimulation = useCallback(() => {
    stopSimulation();
    setSimulation(null);
  }, [stopSimulation]);

  useEffect(() => {
    if (!isRunning || !simulation) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const nextIndex = prev + 1;
        
        if (nextIndex >= simulation.trajectory.length) {
          setIsRunning(false);
          return prev;
        }

        const position = simulation.trajectory[nextIndex];
        setCurrentPosition(position);
        
        // Update threat level based on distance
        if (position.distance < 500) {
          setThreatLevel('CRITICAL');
        } else if (position.distance < 1000) {
          setThreatLevel('HIGH');
        } else if (position.distance < 1500) {
          setThreatLevel('MEDIUM');
        } else {
          setThreatLevel('LOW');
        }

        return nextIndex;
      });
    }, 500); // Update every 500ms for smooth animation

    return () => clearInterval(interval);
  }, [isRunning, simulation]);

  return {
    simulation,
    currentPosition,
    isRunning,
    threatLevel,
    startSimulation,
    stopSimulation,
    resetSimulation,
    progress: simulation ? (currentIndex / simulation.trajectory.length) * 100 : 0,
  };
};

