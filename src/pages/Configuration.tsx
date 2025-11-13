import { useState } from 'react';
import { Save, Users, Settings, AlertTriangle } from 'lucide-react';
import { Toast } from '../components/shared/Toast';

export const Configuration = () => {
  const [sensitivity, setSensitivity] = useState({
    radar: 75,
    rf: 80,
    visual: 70,
    acoustic: 65,
  });

  const [thresholds, setThresholds] = useState({
    distance: 1000,
    altitude: 100,
    duration: 60,
  });

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleSave = () => {
    setToastMessage('Configuration saved successfully');
    setShowToast(true);
  };

  const mockUsers = [
    { id: '1', name: 'Security Officer', email: 'security@ares.com', role: 'Administrator' },
    { id: '2', name: 'System Operator', email: 'operator@ares.com', role: 'Operator' },
    { id: '3', name: 'Analyst', email: 'analyst@ares.com', role: 'Viewer' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-text-primary mb-2">System Configuration</h1>
        <p className="text-text-secondary font-bold">Manage system settings and user access</p>
      </div>

      {/* Detection Sensitivity */}
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <Settings className="w-6 h-6 text-accent-success" />
          <h2 className="text-xl font-black text-text-primary">Detection Sensitivity</h2>
        </div>
        <div className="space-y-6">
          {Object.entries(sensitivity).map(([key, value]) => (
            <div key={key}>
              <div className="flex items-center justify-between mb-2">
                <label className="text-text-primary font-bold capitalize">{key}</label>
                <span className="text-text-secondary font-black">{value}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={value}
                onChange={(e) =>
                  setSensitivity({ ...sensitivity, [key]: parseInt(e.target.value) })
                }
                className="w-full h-2 bg-primary-bg-secondary rounded-lg appearance-none cursor-pointer accent-accent-success"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Alert Thresholds */}
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <AlertTriangle className="w-6 h-6 text-accent-warning" />
          <h2 className="text-xl font-black text-text-primary">Alert Thresholds</h2>
        </div>
        <div className="grid grid-cols-3 gap-6">
          <div>
            <label className="block text-text-secondary text-sm font-bold mb-2">Distance (meters)</label>
            <input
              type="number"
              value={thresholds.distance}
              onChange={(e) =>
                setThresholds({ ...thresholds, distance: parseInt(e.target.value) })
              }
              className="w-full px-4 py-2 bg-primary-bg-secondary border border-primary-border rounded-lg text-text-primary font-bold"
            />
          </div>
          <div>
            <label className="block text-text-secondary text-sm font-bold mb-2">Altitude (meters)</label>
            <input
              type="number"
              value={thresholds.altitude}
              onChange={(e) =>
                setThresholds({ ...thresholds, altitude: parseInt(e.target.value) })
              }
              className="w-full px-4 py-2 bg-primary-bg-secondary border border-primary-border rounded-lg text-text-primary font-bold"
            />
          </div>
          <div>
            <label className="block text-text-secondary text-sm font-bold mb-2">Duration (seconds)</label>
            <input
              type="number"
              value={thresholds.duration}
              onChange={(e) =>
                setThresholds({ ...thresholds, duration: parseInt(e.target.value) })
              }
              className="w-full px-4 py-2 bg-primary-bg-secondary border border-primary-border rounded-lg text-text-primary font-bold"
            />
          </div>
        </div>
      </div>

      {/* Authorized Flight Zones */}
      <div className="card">
        <h2 className="text-xl font-black text-text-primary mb-4">Authorized Flight Zones</h2>
        <div className="bg-primary-bg-secondary rounded-lg p-4" style={{ height: '300px' }}>
          <div className="flex items-center justify-center h-full text-text-secondary font-bold">
            Map drawing interface (Demo Mode)
          </div>
        </div>
      </div>

      {/* Countermeasure Authorization */}
      <div className="card">
        <h2 className="text-xl font-black text-text-primary mb-4">Countermeasure Authorization Levels</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-primary-bg-secondary rounded-lg">
            <div>
              <p className="text-text-primary font-bold">RF Disruption</p>
              <p className="text-text-secondary text-xs font-bold">Requires Administrator approval</p>
            </div>
            <select className="px-4 py-2 bg-primary-bg border border-primary-border rounded-lg text-text-primary font-bold">
              <option>Administrator</option>
              <option>Operator</option>
            </select>
          </div>
          <div className="flex items-center justify-between p-3 bg-primary-bg-secondary rounded-lg">
            <div>
              <p className="text-text-primary font-bold">Physical Interception</p>
              <p className="text-text-secondary text-xs font-bold">Requires Security Officer approval</p>
            </div>
            <select className="px-4 py-2 bg-primary-bg border border-primary-border rounded-lg text-text-primary font-bold">
              <option>Security Officer</option>
              <option>Administrator</option>
            </select>
          </div>
        </div>
      </div>

      {/* Integration Settings */}
      <div className="card">
        <h2 className="text-xl font-black text-text-primary mb-4">Integration Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-text-secondary text-sm font-bold mb-2">API Endpoint</label>
            <input
              type="text"
              defaultValue="https://api.ares.example.com/v1"
              className="w-full px-4 py-2 bg-primary-bg-secondary border border-primary-border rounded-lg text-text-primary font-bold"
            />
          </div>
          <div>
            <label className="block text-text-secondary text-sm font-bold mb-2">Notification Channels</label>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="accent-accent-success" />
                <span className="text-text-primary font-bold">Email</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="accent-accent-success" />
                <span className="text-text-primary font-bold">SMS</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="accent-accent-success" />
                <span className="text-text-primary font-bold">Webhook</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* User Management */}
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <Users className="w-6 h-6 text-accent-success" />
          <h2 className="text-xl font-black text-text-primary">User Management</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-primary-bg-secondary border-b border-primary-border">
              <tr>
                <th className="px-4 py-3 text-left text-text-secondary text-sm font-bold">Name</th>
                <th className="px-4 py-3 text-left text-text-secondary text-sm font-bold">Email</th>
                <th className="px-4 py-3 text-left text-text-secondary text-sm font-bold">Role</th>
                <th className="px-4 py-3 text-left text-text-secondary text-sm font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary-border">
              {mockUsers.map((user) => (
                <tr key={user.id} className="hover:bg-primary-bg-secondary transition-colors">
                  <td className="px-4 py-3 text-text-primary font-bold">{user.name}</td>
                  <td className="px-4 py-3 text-text-secondary font-bold">{user.email}</td>
                  <td className="px-4 py-3">
                    <span className="px-3 py-1 bg-accent-success/20 text-accent-success rounded-full text-xs font-bold">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button className="text-accent-success hover:text-accent-success/80 font-bold text-sm">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button onClick={handleSave} className="btn-primary flex items-center gap-2">
          <Save className="w-5 h-5" />
          Save Configuration
        </button>
      </div>

      {showToast && (
        <Toast
          message={toastMessage}
          type="success"
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
};

