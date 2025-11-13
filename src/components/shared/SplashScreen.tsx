import { useEffect, useState } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [logoScale, setLogoScale] = useState(0);
  const [textOpacity, setTextOpacity] = useState(0);
  const [textY, setTextY] = useState(20);

  useEffect(() => {
    // Logo scale animation
    const logoTimer = setTimeout(() => {
      setLogoScale(1);
    }, 100);

    // Text fade in and slide up animation
    const textTimer = setTimeout(() => {
      setTextOpacity(1);
      setTextY(0);
    }, 600);

    // Fade out and complete
    const completeTimer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        onComplete();
      }, 500);
    }, 2500);

    return () => {
      clearTimeout(logoTimer);
      clearTimeout(textTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-primary-bg flex items-center justify-center z-50 transition-opacity duration-500"
      style={{
        opacity: isVisible ? 1 : 0,
      }}
    >
      <div className="text-center">
        {/* Logo with scale animation */}
        <div
          className="mb-6 transition-transform duration-700 ease-out"
          style={{
            transform: `scale(${logoScale})`,
            transformOrigin: 'center',
            filter: logoScale > 0.5 ? 'drop-shadow(0 0 20px rgba(16, 185, 129, 0.3))' : 'none',
          }}
        >
          <img
            src="/aresLogo.png"
            alt="Ares Logo"
            className="w-32 h-32 mx-auto object-contain"
          />
        </div>

        {/* Text with fade and slide animation */}
        <div
          className="transition-all duration-700 ease-out"
          style={{
            opacity: textOpacity,
            transform: `translateY(${textY}px)`,
            fontFamily: 'Univers, sans-serif',
          }}
        >
          <h1 className="text-5xl font-black text-text-primary mb-2" style={{ fontFamily: 'Univers, sans-serif' }}>Ares</h1>
          <p className="text-text-secondary font-bold text-lg" style={{ fontFamily: 'Univers, sans-serif' }}>
            Autonomous Airspace Protection
          </p>
        </div>
      </div>
    </div>
  );
};

