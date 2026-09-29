import React, { useState } from 'react';
import { CampaignSubmission, FormState } from '../types';
import { Smartphone, Monitor, Send, CheckCircle2, AlertTriangle, RefreshCw, Sparkles, ExternalLink, Zap } from 'lucide-react';

interface IntakeFormProps {
  webAppUrl: string;
  useSimulationMode: boolean;
  setUseSimulationMode: (sim: boolean) => void;
  onNewSubmission: (submission: CampaignSubmission) => void;
}

export const IntakeForm: React.FC<IntakeFormProps> = ({
  webAppUrl,
  useSimulationMode,
  setUseSimulationMode,
  onNewSubmission
}) => {
  const [deviceView, setDeviceView] = useState<'mobile' | 'desktop'>('desktop');
  const [formState, setFormState] = useState<FormState>({
    fullName: '',
    email: '',
    platform: 'Instagram',
    campaignName: '',
    notesBudget: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [lastSubmittedData, setLastSubmittedData] = useState<FormState | null>(null);

  const isUrlConfigured = webAppUrl.trim().length > 10 && !webAppUrl.includes('YOUR_EXEC_ID');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    setFormState({
      fullName: '',
      email: '',
      platform: 'Instagram',
      campaignName: '',
      notesBudget: ''
    });
    setSubmitStatus('idle');
    setErrorMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    const newEntry: CampaignSubmission = {
      id: `sub-${Date.now()}`,
      fullName: formState.fullName.trim(),
      email: formState.email.trim(),
      platform: formState.platform,
      campaignName: formState.campaignName.trim(),
      notesBudget: formState.notesBudget.trim(),
      timestamp: new Date().toISOString(),
      status: 'submitted'
    };

    // If simulation mode or no configured URL:
    if (useSimulationMode || !isUrlConfigured) {
      setTimeout(() => {
        newEntry.status = 'simulated';
        onNewSubmission(newEntry);
        setLastSubmittedData({ ...formState });
        setSubmitStatus('success');
        setIsSubmitting(false);
      }, 700);
      return;
    }

    // Real API submit to Google Apps Script Web App
    try {
      const response = await fetch(webAppUrl.trim(), {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },
        body: JSON.stringify({
          fullName: formState.fullName.trim(),
          email: formState.email.trim(),
          platform: formState.platform,
          campaignName: formState.campaignName.trim(),
          notesBudget: formState.notesBudget.trim(),
          timestamp: newEntry.timestamp
        })
      });

      let jsonRes;
      try {
        jsonRes = await response.json();
      } catch (pErr) {
        jsonRes = { status: 'success' };
      }

      if (response.ok || (jsonRes && jsonRes.status !== 'error')) {
        newEntry.status = 'submitted';
        onNewSubmission(newEntry);
        setLastSubmittedData({ ...formState });
        setSubmitStatus('success');
      } else {
        throw new Error(jsonRes.message || 'Google Apps Script returned an error.');
      }
    } catch (err: any) {
      console.error('Fetch error:', err);
      newEntry.status = 'failed';
      newEntry.errorMessage = err.message || 'Failed to connect to Apps Script Web App';
      onNewSubmission(newEntry);
      setErrorMessage(err.message || 'Network request failed. Ensure your Apps Script Web App access is set to "Anyone".');
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillSampleData = () => {
    setFormState({
      fullName: 'Alex Rivera',
      email: 'alex.rivera@growthlaunch.com',
      platform: 'TikTok',
      campaignName: 'Summer Product Unboxing Blitz',
      notesBudget: '$15,000 budget. Need 20 tech influencers for 30s TikTok videos + link-in-bio promo code.'
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Controls Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
            <span>Live Form Interactive Sandbox</span>
            <span className="text-xs px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-normal">
              Header Matching Mode
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Test submissions locally or broadcast directly to your Google Sheet via Apps Script Web App.
          </p>
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-end">
          {/* Simulation vs Real Toggle */}
          <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-lg text-xs">
            <button
              type="button"
              onClick={() => setUseSimulationMode(true)}
              className={`px-2.5 py-1 rounded-md transition-all flex items-center space-x-1 ${
                useSimulationMode
                  ? 'bg-white text-indigo-700 font-medium shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Simulate</span>
            </button>
            <button
              type="button"
              onClick={() => setUseSimulationMode(false)}
              className={`px-2.5 py-1 rounded-md transition-all flex items-center space-x-1 ${
                !useSimulationMode
                  ? 'bg-white text-indigo-700 font-medium shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ExternalLink className="w-3.5 h-3.5 text-indigo-500" />
              <span>Real Apps Script</span>
            </button>
          </div>

          {/* Device Frame View Toggle */}
          <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg text-xs">
            <button
              type="button"
              onClick={() => setDeviceView('desktop')}
              className={`p-1.5 rounded-md transition-all ${
                deviceView === 'desktop' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-700'
              }`}
              title="Desktop View"
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setDeviceView('mobile')}
              className={`p-1.5 rounded-md transition-all ${
                deviceView === 'mobile' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-700'
              }`}
              title="Mobile Device Frame View"
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Mode Notification Banner */}
      {!useSimulationMode && !isUrlConfigured && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>
              <strong>Web App URL missing:</strong> Submissions will fall back to simulation mode until a valid Apps Script Web App URL is provided in the top bar.
            </span>
          </div>
          <button
            onClick={() => setUseSimulationMode(true)}
            className="text-amber-800 underline font-medium hover:text-amber-950 ml-2"
          >
            Switch to Simulator
          </button>
        </div>
      )}

      {/* Form Display Area */}
      <div className="flex justify-center">
        <div
          className={`transition-all duration-300 w-full ${
            deviceView === 'mobile'
              ? 'max-w-md bg-slate-900 p-4 rounded-3xl shadow-2xl border-4 border-slate-800'
              : 'max-w-2xl'
          }`}
        >
          {deviceView === 'mobile' && (
            <div className="flex justify-center mb-3">
              <div className="w-20 h-4 bg-slate-800 rounded-full"></div>
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
            {/* Header section */}
            <div className="text-center mb-6">
              <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-full uppercase tracking-wider mb-2">
                Intake Submission
              </span>
              <h3 className="text-xl font-bold text-slate-900">
                Social Media Campaign Intake
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Submit campaign strategy, target channel, and budget requirements to our master tracking sheet.
              </p>
            </div>

            {/* Success State */}
            {submitStatus === 'success' ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center space-y-4 animate-fadeIn">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="text-base font-semibold text-emerald-950">
                    Campaign Intake Submitted!
                  </h4>
                  <p className="text-xs text-emerald-800 mt-1">
                    {useSimulationMode || !isUrlConfigured
                      ? 'Saved to local submission log (Simulator Mode).'
                      : 'Data sent to Google Sheet via Apps Script doPost endpoint.'}
                  </p>
                </div>

                {lastSubmittedData && (
                  <div className="bg-white rounded-lg p-3 text-left border border-emerald-200 text-xs space-y-1 text-slate-700">
                    <p><strong>Name:</strong> {lastSubmittedData.fullName}</p>
                    <p><strong>Email:</strong> {lastSubmittedData.email}</p>
                    <p><strong>Platform:</strong> <span className="px-1.5 py-0.5 bg-indigo-50 text-indigo-700 rounded font-medium">{lastSubmittedData.platform}</span></p>
                    <p><strong>Campaign:</strong> {lastSubmittedData.campaignName}</p>
                  </div>
                )}

                <div className="pt-2 flex justify-center space-x-3">
                  <button
                    onClick={handleReset}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-medium transition-colors flex items-center space-x-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Submit Another Intake</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Intake Form Controls */
              <form onSubmit={handleSubmit} className="space-y-4">
                {submitStatus === 'error' && (
                  <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-xs text-rose-900 flex items-start space-x-2">
                    <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">Submission Error</p>
                      <p className="mt-0.5">{errorMessage}</p>
                    </div>
                  </div>
                )}

                {/* Field 1: Full Name */}
                <div>
                  <label htmlFor="fullName" className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formState.fullName}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Jane Doe"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                  />
                </div>

                {/* Field 2: Email Address */}
                <div>
                  <label htmlFor="email" className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formState.email}
                    onChange={handleChange}
                    required
                    placeholder="e.g. jane.doe@company.com"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                  />
                </div>

                {/* Field 3: Platform / Channel */}
                <div>
                  <label htmlFor="platform" className="block text-xs font-semibold text-slate-700 mb-1">
                    Platform / Channel <span className="text-rose-500">*</span>
                  </label>
                  <select
                    id="platform"
                    name="platform"
                    value={formState.platform}
                    onChange={handleChange}
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                  >
                    <option value="Instagram">Instagram</option>
                    <option value="TikTok">TikTok</option>
                    <option value="YouTube">YouTube</option>
                    <option value="X / Twitter">X / Twitter</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Facebook">Facebook</option>
                    <option value="Meta Ads">Meta Ads (FB + IG)</option>
                    <option value="Multi-Channel">Multi-Channel Campaign</option>
                  </select>
                </div>

                {/* Field 4: Campaign Name */}
                <div>
                  <label htmlFor="campaignName" className="block text-xs font-semibold text-slate-700 mb-1">
                    Campaign Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="campaignName"
                    name="campaignName"
                    value={formState.campaignName}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Q3 Summer Creator Push"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                  />
                </div>

                {/* Field 5: Notes / Budget */}
                <div>
                  <label htmlFor="notesBudget" className="block text-xs font-semibold text-slate-700 mb-1">
                    Notes / Budget
                  </label>
                  <textarea
                    id="notesBudget"
                    name="notesBudget"
                    value={formState.notesBudget}
                    onChange={handleChange}
                    rows={3}
                    placeholder="e.g. Budget: $10,000. Deliverables: 5 Reels + Stories..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                  ></textarea>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 space-y-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold text-xs rounded-lg transition-all shadow-xs flex items-center justify-center space-x-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Submitting Intake...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Campaign Intake</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-between text-xs text-slate-500 px-1 pt-1">
                    <button
                      type="button"
                      onClick={fillSampleData}
                      className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Auto-fill sample data
                    </button>
                    <span>Headers: 5 fields</span>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
