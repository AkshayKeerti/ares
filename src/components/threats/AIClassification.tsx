import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';
import { getAIClassification } from '../../data/mockThreats';

interface AIClassificationProps {
  threatType: string;
}

export const AIClassification = ({ threatType }: AIClassificationProps) => {
  const classification = getAIClassification(threatType);
  
  const colors = ['#10b981', '#f59e0b', '#3b82f6'];

  return (
    <div className="card">
      <h3 className="text-lg font-black text-text-primary mb-4">AI Classification</h3>
      <div className="h-48 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={classification} layout="vertical">
            <Bar dataKey="value" radius={[0, 8, 8, 0]}>
              {classification.map((_, index) => (
                <Cell key={`cell-${index}`} fill={colors[index]} />
              ))}
            </Bar>
            <XAxis type="number" domain={[0, 100]} hide />
            <YAxis
              dataKey="label"
              type="category"
              width={120}
              tick={{ fill: '#b0b0b0', fontSize: 12, fontWeight: 'bold' }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="space-y-2">
        {classification.map((item, index) => (
          <div key={item.label} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: colors[index] }}
              />
              <span className="text-text-secondary text-sm font-bold">{item.label}</span>
            </div>
            <span className="text-text-primary font-black">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

