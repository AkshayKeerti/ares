export const COLORS = {
  primary: {
    bg: '#050a14',
    bgSecondary: '#0d1524',
    bgCard: '#141b2e',
    border: '#1a2438',
  },
  accent: {
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
  },
  text: {
    primary: '#ffffff',
    secondary: '#b0b0b0',
  },
} as const;

export const FACILITIES = [
  {
    id: 'energa-delta',
    name: 'ENERGA Substation Delta',
    coordinates: { lat: 54.3520, lng: 18.6466 }, // Gdańsk area
  },
  {
    id: 'port-gdansk-3',
    name: 'Port of Gdańsk Terminal 3',
    coordinates: { lat: 54.3600, lng: 18.6500 },
  },
  {
    id: 'military-base-alpha',
    name: 'Military Base Alpha',
    coordinates: { lat: 52.2297, lng: 21.0122 }, // Warsaw area
  },
  {
    id: 'power-plant-beta',
    name: 'Power Plant Beta',
    coordinates: { lat: 50.0647, lng: 19.9450 }, // Kraków area
  },
] as const;

export const SENSOR_TYPES = ['Radar', 'RF Spectrum', 'Visual Camera', 'Acoustic'] as const;

export const THREAT_LEVELS = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as const;

export const THREAT_TYPES = [
  'DJI Mavic 3',
  'DJI Phantom 4',
  'Autel EVO II',
  'DIY Quadcopter',
  'Bird',
  'Unknown',
] as const;

