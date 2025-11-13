import { useState } from 'react';
import { FileText, Download, Calendar } from 'lucide-react';
import { mockIncidents } from '../data/mockData';
import { formatDateTime, formatDistance, formatDuration } from '../utils/formatters';

const reportTypes = [
  'Daily Activity Summary',
  'Threat Analysis Report',
  'System Performance Report',
  'Compliance Report (EU Critical Infrastructure Directive)',
];

export const Reports = () => {
  const [selectedReportType, setSelectedReportType] = useState(reportTypes[0]);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [generatedReport, setGeneratedReport] = useState<any>(null);

  const handleGenerateReport = () => {
    // Mock report generation
    const filteredIncidents = mockIncidents.filter((incident) => {
      if (dateFrom && incident.dateTime < new Date(dateFrom)) return false;
      if (dateTo && incident.dateTime > new Date(dateTo)) return false;
      return true;
    });

    setGeneratedReport({
      type: selectedReportType,
      dateFrom,
      dateTo,
      incidents: filteredIncidents,
      summary: {
        totalIncidents: filteredIncidents.length,
        resolved: filteredIncidents.filter((i) => i.status === 'Resolved').length,
        falsePositives: filteredIncidents.filter((i) => i.status === 'False Positive').length,
        avgDistance: filteredIncidents.reduce((sum, i) => sum + i.closestDistance, 0) / filteredIncidents.length,
      },
    });
  };

  const handleExport = (format: 'pdf' | 'csv' | 'excel') => {
    // Mock export
    alert(`Exporting report as ${format.toUpperCase()}... (Demo Mode)`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-text-primary mb-2">Reports</h1>
        <p className="text-text-secondary font-bold">Generate and export system reports</p>
      </div>

      {/* Report Configuration */}
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <FileText className="w-6 h-6 text-accent-success" />
          <h2 className="text-xl font-black text-text-primary">Report Configuration</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-text-secondary text-sm font-bold mb-2">Report Type</label>
            <select
              value={selectedReportType}
              onChange={(e) => setSelectedReportType(e.target.value)}
              className="w-full px-4 py-2 bg-primary-bg-secondary border border-primary-border rounded-lg text-text-primary font-bold"
            >
              {reportTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-text-secondary text-sm font-bold mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Date From
              </label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full px-4 py-2 bg-primary-bg-secondary border border-primary-border rounded-lg text-text-primary font-bold"
              />
            </div>
            <div>
              <label className="block text-text-secondary text-sm font-bold mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Date To
              </label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full px-4 py-2 bg-primary-bg-secondary border border-primary-border rounded-lg text-text-primary font-bold"
              />
            </div>
          </div>

          <button onClick={handleGenerateReport} className="btn-primary w-full">
            Generate Report
          </button>
        </div>
      </div>

      {/* Generated Report Preview */}
      {generatedReport && (
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-black text-text-primary">{generatedReport.type}</h2>
              <p className="text-text-secondary text-sm font-bold">
                {generatedReport.dateFrom && generatedReport.dateTo
                  ? `${generatedReport.dateFrom} to ${generatedReport.dateTo}`
                  : 'All Time'}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleExport('pdf')}
                className="btn-secondary flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                PDF
              </button>
              <button
                onClick={() => handleExport('csv')}
                className="btn-secondary flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                CSV
              </button>
              <button
                onClick={() => handleExport('excel')}
                className="btn-secondary flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Excel
              </button>
            </div>
          </div>

          {/* Summary */}
          <div className="mb-6 p-4 bg-primary-bg-secondary rounded-lg">
            <h3 className="text-lg font-black text-text-primary mb-4">Summary</h3>
            <div className="grid grid-cols-4 gap-4">
              <div>
                <p className="text-text-secondary text-sm font-bold mb-1">Total Incidents</p>
                <p className="text-text-primary font-black text-2xl">{generatedReport.summary.totalIncidents}</p>
              </div>
              <div>
                <p className="text-text-secondary text-sm font-bold mb-1">Resolved</p>
                <p className="text-text-primary font-black text-2xl">{generatedReport.summary.resolved}</p>
              </div>
              <div>
                <p className="text-text-secondary text-sm font-bold mb-1">False Positives</p>
                <p className="text-text-primary font-black text-2xl">
                  {generatedReport.summary.falsePositives}
                </p>
              </div>
              <div>
                <p className="text-text-secondary text-sm font-bold mb-1">Avg. Distance</p>
                <p className="text-text-primary font-black text-2xl">
                  {formatDistance(generatedReport.summary.avgDistance)}
                </p>
              </div>
            </div>
          </div>

          {/* Incident Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-primary-bg-secondary border-b border-primary-border">
                <tr>
                  <th className="px-4 py-3 text-left text-text-secondary text-sm font-bold">Date/Time</th>
                  <th className="px-4 py-3 text-left text-text-secondary text-sm font-bold">Threat Type</th>
                  <th className="px-4 py-3 text-left text-text-secondary text-sm font-bold">Distance</th>
                  <th className="px-4 py-3 text-left text-text-secondary text-sm font-bold">Duration</th>
                  <th className="px-4 py-3 text-left text-text-secondary text-sm font-bold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary-border">
                {generatedReport.incidents.slice(0, 10).map((incident: any) => (
                  <tr key={incident.id} className="hover:bg-primary-bg-secondary transition-colors">
                    <td className="px-4 py-3 text-text-primary font-bold text-sm">
                      {formatDateTime(incident.dateTime)}
                    </td>
                    <td className="px-4 py-3 text-text-primary font-bold">{incident.threatType}</td>
                    <td className="px-4 py-3 text-text-primary font-bold">
                      {formatDistance(incident.closestDistance)}
                    </td>
                    <td className="px-4 py-3 text-text-primary font-bold">
                      {formatDuration(incident.duration)}
                    </td>
                    <td className="px-4 py-3 text-text-secondary font-bold">{incident.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

