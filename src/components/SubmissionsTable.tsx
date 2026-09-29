import React, { useState } from 'react';
import { CampaignSubmission } from '../types';
import { Download, Search, Trash2, CheckCircle2, Zap, AlertCircle, Eye, Filter, Plus } from 'lucide-react';

interface SubmissionsTableProps {
  submissions: CampaignSubmission[];
  onClearSubmissions: () => void;
  onAddSample: () => void;
}

export const SubmissionsTable: React.FC<SubmissionsTableProps> = ({
  submissions,
  onClearSubmissions,
  onAddSample
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [selectedSubmission, setSelectedSubmission] = useState<CampaignSubmission | null>(null);

  const filteredSubmissions = submissions.filter((sub) => {
    const matchesSearch =
      sub.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.campaignName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlatform = selectedPlatform === 'all' || sub.platform === selectedPlatform;
    return matchesSearch && matchesPlatform;
  });

  const exportToCSV = () => {
    if (submissions.length === 0) return;

    const headers = ['Full Name', 'Email Address', 'Platform/Channel', 'Campaign Name', 'Notes/Budget', 'Timestamp', 'Status'];
    const rows = submissions.map((sub) => [
      `"${sub.fullName.replace(/"/g, '""')}"`,
      `"${sub.email.replace(/"/g, '""')}"`,
      `"${sub.platform.replace(/"/g, '""')}"`,
      `"${sub.campaignName.replace(/"/g, '""')}"`,
      `"${sub.notesBudget.replace(/"/g, '""')}"`,
      `"${sub.timestamp}"`,
      `"${sub.status}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `campaign_intakes_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Top Filter & Actions Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-col sm:flex-row items-center gap-2 flex-1">
          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search name, email, campaign..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
            />
          </div>

          {/* Filter dropdown */}
          <div className="relative w-full sm:w-48">
            <Filter className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
            >
              <option value="all">All Platforms</option>
              <option value="Instagram">Instagram</option>
              <option value="TikTok">TikTok</option>
              <option value="YouTube">YouTube</option>
              <option value="LinkedIn">LinkedIn</option>
              <option value="Meta Ads">Meta Ads</option>
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={onAddSample}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors flex items-center space-x-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Sample</span>
          </button>

          <button
            onClick={exportToCSV}
            disabled={submissions.length === 0}
            className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg text-xs font-medium transition-colors flex items-center space-x-1.5 shadow-2xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          {submissions.length > 0 && (
            <button
              onClick={onClearSubmissions}
              className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
              title="Clear Log"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Full Name</th>
                <th className="py-3 px-4">Email Address</th>
                <th className="py-3 px-4">Platform / Channel</th>
                <th className="py-3 px-4">Campaign Name</th>
                <th className="py-3 px-4">Notes / Budget</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSubmissions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No campaign intakes found matching your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredSubmissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-900">{sub.fullName}</td>
                    <td className="py-3 px-4 text-slate-600 font-mono">{sub.email}</td>
                    <td className="py-3 px-4">
                      <span className="inline-block px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-medium">
                        {sub.platform}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-800 font-medium">{sub.campaignName}</td>
                    <td className="py-3 px-4 text-slate-500 max-w-xs truncate">{sub.notesBudget || '—'}</td>
                    <td className="py-3 px-4">
                      {sub.status === 'submitted' && (
                        <span className="inline-flex items-center space-x-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px] font-medium border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Submitted</span>
                        </span>
                      )}
                      {sub.status === 'simulated' && (
                        <span className="inline-flex items-center space-x-1 text-amber-700 bg-amber-50 px-2 py-0.5 rounded text-[11px] font-medium border border-amber-200">
                          <Zap className="w-3 h-3" />
                          <span>Simulated</span>
                        </span>
                      )}
                      {sub.status === 'failed' && (
                        <span className="inline-flex items-center space-x-1 text-rose-700 bg-rose-50 px-2 py-0.5 rounded text-[11px] font-medium border border-rose-200">
                          <AlertCircle className="w-3 h-3" />
                          <span>Failed</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedSubmission(sub)}
                        className="p-1 text-slate-400 hover:text-indigo-600 rounded"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">Campaign Intake Detail</h3>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div>
                <span className="text-slate-400 block text-[11px]">Full Name</span>
                <span className="font-semibold text-slate-900 text-sm">{selectedSubmission.fullName}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Email Address</span>
                <span className="font-mono">{selectedSubmission.email}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Platform / Channel</span>
                <span className="inline-block mt-0.5 px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded font-medium">
                  {selectedSubmission.platform}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Campaign Name</span>
                <span className="font-medium text-slate-900">{selectedSubmission.campaignName}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Notes / Budget</span>
                <p className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-slate-800 whitespace-pre-wrap mt-0.5">
                  {selectedSubmission.notesBudget || 'No notes specified.'}
                </p>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Timestamp</span>
                <span>{new Date(selectedSubmission.timestamp).toLocaleString()}</span>
              </div>
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setSelectedSubmission(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
