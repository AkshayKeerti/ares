import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Non-functional login - just navigate to dashboard
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-primary-bg flex items-center justify-center relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }} />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="card text-center">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-16 h-16 bg-accent-success/20 rounded-lg flex items-center justify-center">
              <Shield className="w-8 h-8 text-accent-success" />
            </div>
            <div className="text-left">
              <h1 className="text-4xl font-black text-text-primary">ARES</h1>
              <p className="text-xs text-text-secondary font-bold">Autonomous Counter-UAS</p>
            </div>
          </div>

          {/* Tagline */}
          <p className="text-text-secondary font-bold mb-8 text-lg">
            Autonomous Airspace Protection for Critical Infrastructure
          </p>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-left text-text-secondary text-sm font-bold mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-primary-bg-secondary border border-primary-border rounded-lg text-text-primary font-bold focus:outline-none focus:ring-2 focus:ring-accent-success focus:border-transparent"
                placeholder="security@ares.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-left text-text-secondary text-sm font-bold mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-primary-bg-secondary border border-primary-border rounded-lg text-text-primary font-bold focus:outline-none focus:ring-2 focus:ring-accent-success focus:border-transparent"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full btn-primary"
            >
              Sign In
            </button>
          </form>

          <p className="mt-6 text-text-secondary text-xs font-bold">
            Demo Mode - No authentication required
          </p>
        </div>
      </div>
    </div>
  );
};

