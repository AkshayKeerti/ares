import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { LiveThreats } from './pages/LiveThreats';
import { SensorStatus } from './pages/SensorStatus';
import { IncidentHistory } from './pages/IncidentHistory';
import { Configuration } from './pages/Configuration';
import { Reports } from './pages/Reports';
import { Layout } from './components/layout/Layout';
import { SplashScreen } from './components/shared/SplashScreen';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  // In a real app, check authentication here
  // For demo, always allow access
  return <Layout>{children}</Layout>;
};

function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Check if splash has been shown in this session
    const splashShown = sessionStorage.getItem('ares-splash-shown');
    if (splashShown) {
      setShowSplash(false);
    }
  }, []);

  const handleSplashComplete = () => {
    setShowSplash(false);
    sessionStorage.setItem('ares-splash-shown', 'true');
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/threats"
          element={
            <ProtectedRoute>
              <LiveThreats />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sensors"
          element={
            <ProtectedRoute>
              <SensorStatus />
            </ProtectedRoute>
          }
        />
        <Route
          path="/incidents"
          element={
            <ProtectedRoute>
              <IncidentHistory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/configuration"
          element={
            <ProtectedRoute>
              <Configuration />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <Reports />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
    </BrowserRouter>
  );
}

export default App;
