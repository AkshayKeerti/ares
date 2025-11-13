import { useEffect, useRef, useState } from 'react';
import type { ThreatSimulation, ThreatPosition } from '../../data/mockThreats';

interface RadarScreenProps {
  simulation: ThreatSimulation;
  currentPosition: ThreatPosition;
}

export const RadarScreen = ({ simulation, currentPosition }: RadarScreenProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [sweepAngle, setSweepAngle] = useState(0);

  // Animate radar sweep
  useEffect(() => {
    const interval = setInterval(() => {
      setSweepAngle((prev) => (prev + 2) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Draw radar screen
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 40;

    // Clear canvas
    ctx.fillStyle = '#050a14';
    ctx.fillRect(0, 0, width, height);

    // Draw range rings
    const maxRange = 3000; // 3km in meters
    const ringCount = 3;
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 1;
    ctx.setLineDash([]);

    for (let i = 1; i <= ringCount; i++) {
      const ringRadius = (radius * i) / ringCount;
      ctx.beginPath();
      ctx.arc(centerX, centerY, ringRadius, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Draw bearing lines (every 30 degrees)
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 0.5;
    ctx.globalAlpha = 0.3;
    for (let angle = 0; angle < 360; angle += 30) {
      const rad = (angle * Math.PI) / 180;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(
        centerX + Math.cos(rad) * radius,
        centerY + Math.sin(rad) * radius
      );
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // Draw range labels
    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 12px JetBrains Mono';
    ctx.textAlign = 'center';
    for (let i = 1; i <= ringCount; i++) {
      const labelY = centerY - (radius * i) / ringCount;
      ctx.fillText(`${i}km`, centerX, labelY - 5);
    }

    // Draw cardinal directions
    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 14px JetBrains Mono';
    ctx.fillText('N', centerX, 20);
    ctx.fillText('E', width - 20, centerY + 5);
    ctx.fillText('S', centerX, height - 10);
    ctx.fillText('W', 20, centerY + 5);

    // Draw trajectory trail (fading)
    const currentIndex = simulation.trajectory.findIndex(p => Math.abs(p.distance - currentPosition.distance) < 10) || 0;
    const trailLength = Math.min(15, currentIndex);
    const startIndex = Math.max(0, currentIndex - trailLength);
    
    for (let i = startIndex; i <= currentIndex; i++) {
      const pos = simulation.trajectory[i];
      if (pos.distance > maxRange) continue;
      
      const distanceRatio = pos.distance / maxRange;
      const angle = (pos.bearing * Math.PI) / 180;
      const x = centerX + Math.cos(angle) * radius * distanceRatio;
      const y = centerY + Math.sin(angle) * radius * distanceRatio;

      const alpha = trailLength > 0 ? (i - startIndex) / trailLength : 1;
      ctx.fillStyle = `rgba(239, 68, 68, ${alpha * 0.5})`;
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw threat position (red dot)
    const distanceRatio = currentPosition.distance / maxRange;
    const threatAngle = (currentPosition.bearing * Math.PI) / 180;
    const threatX = centerX + Math.cos(threatAngle) * radius * distanceRatio;
    const threatY = centerY + Math.sin(threatAngle) * radius * distanceRatio;

    // Pulsing red dot
    const pulse = Math.sin(Date.now() / 200) * 0.3 + 1;
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(threatX, threatY, 6 * pulse, 0, Math.PI * 2);
    ctx.fill();

    // Outer glow
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#ef4444';
    ctx.beginPath();
    ctx.arc(threatX, threatY, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Draw line from center to threat
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(threatX, threatY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw center base (green dot)
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 4, 0, Math.PI * 2);
    ctx.fill();

    // Draw radar sweep line
    const sweepRad = (sweepAngle * Math.PI) / 180;
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.6)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(
      centerX + Math.cos(sweepRad) * radius,
      centerY + Math.sin(sweepRad) * radius
    );
    ctx.stroke();

    // Draw sweep arc (fading)
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
    gradient.addColorStop(0, 'rgba(16, 185, 129, 0.1)');
    gradient.addColorStop(1, 'rgba(16, 185, 129, 0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, sweepRad - 0.1, sweepRad + 0.1);
    ctx.lineTo(centerX, centerY);
    ctx.fill();

    // Draw threat info box
    ctx.fillStyle = 'rgba(30, 47, 74, 0.95)';
    ctx.fillRect(10, height - 80, 250, 70);
    ctx.strokeStyle = '#2a3d5a';
    ctx.lineWidth = 1;
    ctx.strokeRect(10, height - 80, 250, 70);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px JetBrains Mono';
    ctx.textAlign = 'left';
    ctx.fillText(`Range: ${(currentPosition.distance / 1000).toFixed(2)}km`, 20, height - 60);
    ctx.fillText(`Bearing: ${currentPosition.bearing.toFixed(0)}°`, 20, height - 45);
    ctx.fillText(`Altitude: ${currentPosition.altitude.toFixed(0)}m`, 20, height - 30);
    ctx.fillText(`Speed: ${simulation.speed.toFixed(1)}m/s`, 20, height - 15);
  }, [currentPosition, simulation, sweepAngle]);

  // Calculate closest approach
  const closestApproach = Math.min(...simulation.trajectory.map((p) => p.distance));

  return (
    <div className="relative w-full h-full" style={{ background: '#050a14' }}>
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        className="w-full h-full"
      />
      
      {/* Info Overlay */}
      <div className="absolute bottom-4 right-4 bg-primary-bg-card/90 border border-primary-border rounded-lg p-4 z-10">
        <p className="text-text-secondary text-xs font-bold mb-2">Closest Approach</p>
        <p className="text-text-primary font-black text-lg">
          {(closestApproach / 1000).toFixed(2)}km
        </p>
        <div className="mt-3 pt-3 border-t border-primary-border">
          <p className="text-text-secondary text-xs font-bold mb-1">Detection Range</p>
          <p className="text-text-primary font-bold text-sm">3.0km</p>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute top-4 right-4 bg-primary-bg-card/90 border border-primary-border rounded-lg p-3 z-10">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-accent-success" />
            <span className="text-text-primary text-xs font-bold">Base</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-accent-danger animate-pulse" />
            <span className="text-text-primary text-xs font-bold">Threat</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 bg-accent-success" />
            <span className="text-text-primary text-xs font-bold">Range Rings</span>
          </div>
        </div>
      </div>
    </div>
  );
};

