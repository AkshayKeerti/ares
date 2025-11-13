import { useState } from 'react';
import { Shield, Radio, Phone, AlertTriangle } from 'lucide-react';

interface RecommendedActionsProps {
  onExecuteCountermeasure: () => void;
}

export const RecommendedActions = ({ onExecuteCountermeasure }: RecommendedActionsProps) => {
  const [selectedAction, setSelectedAction] = useState('monitor');
  const [showAuthModal, setShowAuthModal] = useState(false);

  const actions = [
    {
      id: 'monitor',
      label: 'Monitor & Alert',
      description: 'Continue monitoring and log incident',
      icon: Shield,
      default: true,
    },
    {
      id: 'rf-disruption',
      label: 'RF Disruption',
      description: 'Requires authorization',
      icon: Radio,
      requiresAuth: true,
    },
    {
      id: 'contact-security',
      label: 'Contact Security Personnel',
      description: 'Alert on-site security team',
      icon: Phone,
    },
  ];

  const handleExecute = () => {
    const action = actions.find(a => a.id === selectedAction);
    if (action?.requiresAuth) {
      setShowAuthModal(true);
    } else {
      onExecuteCountermeasure();
    }
  };

  return (
    <div className="card space-y-4">
      <h3 className="text-lg font-black text-text-primary">Recommended Actions</h3>
      
      <div className="space-y-2">
        {actions.map((action) => {
          const Icon = action.icon;
          const isSelected = selectedAction === action.id;
          
          return (
            <button
              key={action.id}
              onClick={() => setSelectedAction(action.id)}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all font-bold ${
                isSelected
                  ? 'border-accent-success bg-accent-success/10'
                  : 'border-primary-border bg-primary-bg-secondary hover:border-primary-border/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 ${isSelected ? 'text-accent-success' : 'text-text-secondary'}`} />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`${isSelected ? 'text-accent-success' : 'text-text-primary'}`}>
                      {action.label}
                    </span>
                    {action.default && (
                      <span className="text-xs px-2 py-0.5 bg-accent-success/20 text-accent-success rounded">
                        Default
                      </span>
                    )}
                    {action.requiresAuth && (
                      <span className="text-xs px-2 py-0.5 bg-accent-warning/20 text-accent-warning rounded">
                        Auth Required
                      </span>
                    )}
                  </div>
                  <p className="text-text-secondary text-xs mt-1">{action.description}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <button
        onClick={handleExecute}
        className="w-full btn-danger"
        disabled={selectedAction === 'rf-disruption'}
      >
        EXECUTE COUNTERMEASURE
      </button>

      {showAuthModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-primary-bg-card border border-primary-border rounded-lg p-6 max-w-md">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-accent-warning" />
              <h3 className="text-xl font-black text-text-primary">Authorization Required</h3>
            </div>
            <p className="text-text-secondary font-bold mb-6">
              RF Disruption requires authorization from a security officer. This action is disabled in demo mode.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowAuthModal(false)}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

