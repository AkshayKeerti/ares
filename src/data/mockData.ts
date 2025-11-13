// Mock data for incidents, sensors, and activity logs

export interface Incident {
  id: string;
  dateTime: Date;
  threatType: string;
  maxThreatLevel: string;
  closestDistance: number; // meters
  duration: number; // seconds
  actionTaken: string;
  status: 'Resolved' | 'False Positive';
  details?: {
    speed: number;
    altitude: number;
    bearing: number;
    aiConfidence: number;
  };
}

export interface SensorReading {
  sensorId: string;
  sensorType: string;
  status: 'Operational' | 'Warning' | 'Error';
  lastCalibration: Date;
  detectionRate: number;
  falsePositiveRate: number;
  currentValue: number;
  data: Array<{ timestamp: number; value: number }>;
}

export interface ActivityLog {
  id: string;
  timestamp: Date;
  event: string;
  type: 'info' | 'warning' | 'alert' | 'success';
}

// Generate incidents from last 30 days
const generateIncidents = (): Incident[] => {
  const incidents: Incident[] = [];
  const now = new Date();
  
  const incidentTemplates = [
    {
      threatType: 'DJI Mavic 3',
      maxThreatLevel: 'MEDIUM',
      closestDistance: 1200,
      duration: 180,
      actionTaken: 'Monitored and logged',
      status: 'Resolved' as const,
      speed: 15,
      altitude: 45,
      bearing: 287,
      aiConfidence: 94,
    },
    {
      threatType: 'Bird',
      maxThreatLevel: 'LOW',
      closestDistance: 800,
      duration: 45,
      actionTaken: 'Classified as false positive',
      status: 'False Positive' as const,
      speed: 8,
      altitude: 30,
      bearing: 120,
      aiConfidence: 98,
    },
    {
      threatType: 'DJI Phantom 4',
      maxThreatLevel: 'HIGH',
      closestDistance: 450,
      duration: 240,
      actionTaken: 'Alerted security personnel',
      status: 'Resolved' as const,
      speed: 18,
      altitude: 60,
      bearing: 45,
      aiConfidence: 89,
    },
    {
      threatType: 'Autel EVO II',
      maxThreatLevel: 'MEDIUM',
      closestDistance: 950,
      duration: 120,
      actionTaken: 'Monitored and logged',
      status: 'Resolved' as const,
      speed: 12,
      altitude: 35,
      bearing: 200,
      aiConfidence: 91,
    },
    {
      threatType: 'DIY Quadcopter',
      maxThreatLevel: 'HIGH',
      closestDistance: 600,
      duration: 300,
      actionTaken: 'RF disruption authorized',
      status: 'Resolved' as const,
      speed: 20,
      altitude: 50,
      bearing: 90,
      aiConfidence: 87,
    },
    {
      threatType: 'Bird',
      maxThreatLevel: 'LOW',
      closestDistance: 1500,
      duration: 30,
      actionTaken: 'Classified as false positive',
      status: 'False Positive' as const,
      speed: 6,
      altitude: 25,
      bearing: 180,
      aiConfidence: 96,
    },
    {
      threatType: 'DJI Mavic 3',
      maxThreatLevel: 'MEDIUM',
      closestDistance: 1100,
      duration: 150,
      actionTaken: 'Monitored and logged',
      status: 'Resolved' as const,
      speed: 14,
      altitude: 40,
      bearing: 315,
      aiConfidence: 92,
    },
    {
      threatType: 'Unknown',
      maxThreatLevel: 'HIGH',
      closestDistance: 700,
      duration: 210,
      actionTaken: 'Alerted security personnel',
      status: 'Resolved' as const,
      speed: 16,
      altitude: 55,
      bearing: 135,
      aiConfidence: 75,
    },
    {
      threatType: 'Bird',
      maxThreatLevel: 'LOW',
      closestDistance: 2000,
      duration: 60,
      actionTaken: 'Classified as false positive',
      status: 'False Positive' as const,
      speed: 7,
      altitude: 20,
      bearing: 270,
      aiConfidence: 97,
    },
    {
      threatType: 'DJI Phantom 4',
      maxThreatLevel: 'MEDIUM',
      closestDistance: 1300,
      duration: 165,
      actionTaken: 'Monitored and logged',
      status: 'Resolved' as const,
      speed: 13,
      altitude: 38,
      bearing: 225,
      aiConfidence: 88,
    },
    {
      threatType: 'Autel EVO II',
      maxThreatLevel: 'LOW',
      closestDistance: 1800,
      duration: 90,
      actionTaken: 'Monitored and logged',
      status: 'Resolved' as const,
      speed: 10,
      altitude: 42,
      bearing: 350,
      aiConfidence: 90,
    },
    {
      threatType: 'Bird',
      maxThreatLevel: 'LOW',
      closestDistance: 1600,
      duration: 40,
      actionTaken: 'Classified as false positive',
      status: 'False Positive' as const,
      speed: 5,
      altitude: 28,
      bearing: 100,
      aiConfidence: 99,
    },
    {
      threatType: 'DIY Quadcopter',
      maxThreatLevel: 'CRITICAL',
      closestDistance: 300,
      duration: 360,
      actionTaken: 'RF disruption executed',
      status: 'Resolved' as const,
      speed: 22,
      altitude: 70,
      bearing: 0,
      aiConfidence: 85,
    },
    {
      threatType: 'DJI Mavic 3',
      maxThreatLevel: 'MEDIUM',
      closestDistance: 1000,
      duration: 140,
      actionTaken: 'Monitored and logged',
      status: 'Resolved' as const,
      speed: 15,
      altitude: 48,
      bearing: 60,
      aiConfidence: 93,
    },
  ];

  incidentTemplates.forEach((template, index) => {
    const daysAgo = Math.floor(Math.random() * 30);
    const hoursAgo = Math.floor(Math.random() * 24);
    const dateTime = new Date(now);
    dateTime.setDate(dateTime.getDate() - daysAgo);
    dateTime.setHours(dateTime.getHours() - hoursAgo);
    dateTime.setMinutes(Math.floor(Math.random() * 60));

    incidents.push({
      id: `incident-${index + 1}`,
      dateTime,
      ...template,
      details: {
        speed: template.speed,
        altitude: template.altitude,
        bearing: template.bearing,
        aiConfidence: template.aiConfidence,
      },
    });
  });

  return incidents.sort((a, b) => b.dateTime.getTime() - a.dateTime.getTime());
};

export const mockIncidents: Incident[] = generateIncidents();

// Generate activity logs
export const generateActivityLogs = (): ActivityLog[] => {
  const logs: ActivityLog[] = [];
  const now = new Date();
  
  const events = [
    { event: 'Bird detected and classified', type: 'info' as const },
    { event: 'System self-test completed', type: 'success' as const },
    { event: 'Radar sensor calibration scheduled', type: 'info' as const },
    { event: 'RF spectrum analysis updated', type: 'info' as const },
    { event: 'Visual camera feed restored', type: 'success' as const },
    { event: 'Acoustic sensor sensitivity adjusted', type: 'info' as const },
    { event: 'Threat detection threshold updated', type: 'warning' as const },
    { event: 'Daily system health check passed', type: 'success' as const },
    { event: 'User login: Security Officer', type: 'info' as const },
    { event: 'Configuration saved', type: 'success' as const },
  ];

  events.forEach((event, index) => {
    const minutesAgo = index * 15 + Math.floor(Math.random() * 10);
    const timestamp = new Date(now);
    timestamp.setMinutes(timestamp.getMinutes() - minutesAgo);

    logs.push({
      id: `log-${index + 1}`,
      timestamp,
      ...event,
    });
  });

  return logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

export const mockActivityLogs: ActivityLog[] = generateActivityLogs();

// Generate sensor readings
export const generateSensorReadings = (): SensorReading[] => {
  const now = new Date();
  const sensors = [
    {
      sensorId: 'radar-01',
      sensorType: 'Radar',
      status: 'Operational' as const,
      lastCalibration: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      detectionRate: 98.5,
      falsePositiveRate: 2.1,
    },
    {
      sensorId: 'rf-01',
      sensorType: 'RF Spectrum',
      status: 'Operational' as const,
      lastCalibration: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
      detectionRate: 95.2,
      falsePositiveRate: 1.8,
    },
    {
      sensorId: 'visual-01',
      sensorType: 'Visual Camera',
      status: 'Operational' as const,
      lastCalibration: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
      detectionRate: 92.8,
      falsePositiveRate: 3.5,
    },
    {
      sensorId: 'acoustic-01',
      sensorType: 'Acoustic',
      status: 'Operational' as const,
      lastCalibration: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
      detectionRate: 88.3,
      falsePositiveRate: 4.2,
    },
  ];

  return sensors.map((sensor) => {
    const data: Array<{ timestamp: number; value: number }> = [];
    const baseValue = sensor.sensorType === 'Radar' ? 2 : 
                     sensor.sensorType === 'RF Spectrum' ? 0 :
                     sensor.sensorType === 'Visual Camera' ? 0 : 0;
    
    for (let i = 0; i < 20; i++) {
      data.push({
        timestamp: now.getTime() - (20 - i) * 60000,
        value: baseValue + Math.random() * 0.5 - 0.25,
      });
    }

    return {
      ...sensor,
      currentValue: baseValue + Math.random() * 0.3,
      data,
    };
  });
};

export const mockSensorReadings: SensorReading[] = generateSensorReadings();

