export interface ThreatPosition {
  x: number; // relative position 0-1
  y: number; // relative position 0-1
  distance: number; // meters from center
  bearing: number; // degrees
  altitude: number; // meters
  timestamp: number; // relative time in simulation
}

export interface ThreatSimulation {
  id: string;
  threatType: string;
  aiConfidence: number;
  speed: number; // m/s
  initialDistance: number; // meters
  trajectory: ThreatPosition[];
  threatLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  rfSignature: Array<{ frequency: number; strength: number }>;
  audioSignature: Array<{ time: number; amplitude: number }>;
}

// Generate threat simulation data
export const generateThreatSimulation = (): ThreatSimulation => {
  const threatTypes = ['DJI Mavic 3', 'DJI Phantom 4', 'Autel EVO II', 'DIY Quadcopter'];
  const threatType = threatTypes[Math.floor(Math.random() * threatTypes.length)];
  
  const initialDistance = 2300; // meters
  const speed = 15; // m/s
  const duration = 25; // seconds
  const steps = 50;
  const stepTime = duration / steps;
  
  const trajectory: ThreatPosition[] = [];
  const centerX = 0.5;
  const centerY = 0.5;
  const bearing = 287; // degrees
  const bearingRad = (bearing * Math.PI) / 180;
  
  for (let i = 0; i <= steps; i++) {
    const time = i * stepTime;
    const distance = initialDistance - speed * time;
    const progress = 1 - distance / initialDistance;
    
    const x = centerX + Math.cos(bearingRad) * progress * 0.3;
    const y = centerY + Math.sin(bearingRad) * progress * 0.3;
    
    const altitude = 45 + Math.sin(time * 0.1) * 5;
    
    trajectory.push({
      x,
      y,
      distance: Math.max(0, distance),
      bearing,
      altitude,
      timestamp: time,
    });
  }
  
  // Generate RF signature
  const rfSignature: Array<{ frequency: number; strength: number }> = [];
  const baseFreq = threatType.includes('DJI') ? 2400 : 5800;
  for (let i = 0; i < 50; i++) {
    rfSignature.push({
      frequency: baseFreq + i * 10,
      strength: Math.max(0, 80 - Math.abs(i - 25) * 2 + Math.random() * 5),
    });
  }
  
  // Generate audio signature
  const audioSignature: Array<{ time: number; amplitude: number }> = [];
  for (let i = 0; i < 100; i++) {
    audioSignature.push({
      time: i * 0.1,
      amplitude: Math.sin(i * 0.5) * 0.5 + Math.random() * 0.2,
    });
  }
  
  return {
    id: `threat-${Date.now()}`,
    threatType,
    aiConfidence: 94,
    speed,
    initialDistance,
    trajectory,
    threatLevel: 'MEDIUM',
    rfSignature,
    audioSignature,
  };
};

// AI Classification breakdown
export const getAIClassification = (threatType: string) => {
  const baseConfidence = {
    'DJI Mavic 3': 94,
    'DJI Phantom 4': 89,
    'Autel EVO II': 91,
    'DIY Quadcopter': 87,
  };
  
  const confidence = baseConfidence[threatType as keyof typeof baseConfidence] || 85;
  
  return [
    { label: 'Commercial drone', value: confidence },
    { label: 'DIY drone', value: 100 - confidence },
    { label: 'Bird', value: 2 },
  ];
};

