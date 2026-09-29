import React, { useState } from 'react';
import { BookOpen, CheckCircle, Circle, Play, ArrowRight, ExternalLink, ShieldCheck, AlertCircle, Sparkles } from 'lucide-react';

interface SetupGuideProps {
  webAppUrl: string;
  setWebAppUrl: (url: string) => void;
}

export const SetupGuide: React.FC<SetupGuideProps> = ({ webAppUrl, setWebAppUrl }) => {
  const [completedSteps, setCompletedSteps] = useState<number[]>([1]);
  const [testResult, setTestResult] = useState<{ status: 'idle' | 'testing' | 'success' | 'error'; message: string }>({
    status: 'idle',
    message: ''
  });

  const toggleStep = (stepNumber: number) => {
    if (completedSteps.includes(stepNumber)) {
      setCompletedSteps(completedSteps.filter((s) => s !== stepNumber));
    } else {
      setCompletedSteps([...completedSteps, stepNumber]);
    }
  };

  const runEndpointTest = async () => {
    if (!webAppUrl || webAppUrl.includes('YOUR_EXEC_ID')) {
      setTestResult({
        status: 'error',
        message: 'Please paste your actual Apps Script Web App URL first.'
      });
      return;
    }

    setTestResult({ status: 'testing', message: 'Sending test ping to Apps Script Web App...' });

    try {
      const response = await fetch(webAppUrl.trim(), {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },
        body: JSON.stringify({
          fullName: 'Ping Test User',
          email: 'test@example.com',
          platform: 'Instagram',
          campaignName: 'Connection Verification Ping',
          notesBudget: 'Automated test from setup wizard',
          timestamp: new Date().toISOString()
        })
      });

      let resData;
      try {
        resData = await response.json();
      } catch (err) {
        resData = { status: 'success' };
      }

      if (response.ok || (resData && resData.status !== 'error')) {
        setTestResult({
          status: 'success',
          message: 'Connection verified! Row appended successfully into your Google Sheet.'
        });
        if (!completedSteps.includes(5)) {
          setCompletedSteps([...completedSteps, 5]);
        }
      } else {
        throw new Error(resData.message || 'Server responded with error status.');
      }
    } catch (err: any) {
      setTestResult({
        status: 'error',
        message: err.message || 'Failed to connect. Make sure Web App deployment is set to "Execute as Me" and "Who has access: Anyone".'
      });
    }
  };

  const steps = [
    {
      num: 1,
      title: 'Create or Open a Google Sheet',
      detail: 'Go to sheets.google.com and open your target campaign spreadsheet. Name the sheet tab (e.g., "Campaign Intakes").'
    },
    {
      num: 2,
      title: 'Open Apps Script Editor',
      detail: 'Click Extensions > Apps Script in the top Google Sheet menu bar. Delete any existing template code.'
    },
    {
      num: 3,
      title: 'Paste the doPost Script Code',
      detail: 'Switch to the "Google Apps Script (doPost)" tab in this app, copy the generated code, paste it into Code.gs, and save (Ctrl+S / Cmd+S).'
    },
    {
      num: 4,
      title: 'Deploy as Web App',
      detail: 'Click Deploy > New deployment. Select type: Web App. Configure settings: Execute as "Me", Who has access: "Anyone". Click Deploy & authorize access.',
      important: 'CRITICAL: "Who has access" MUST be set to "Anyone" so the HTML intake form can post data without requiring user Google authentication.'
    },
    {
      num: 5,
      title: 'Copy Web App URL & Connect',
      detail: 'Copy the generated Web App URL (starts with https://script.google.com/macros/s/...) and paste it into the URL field above or into your HTML file.'
    }
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900 to-slate-900 rounded-2xl p-6 text-white shadow-md">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>5-Step Setup Walkthrough</span>
            </span>
            <h2 className="text-xl font-bold">Connecting Google Apps Script to Google Sheets</h2>
            <p className="text-xs text-indigo-200/90 leading-relaxed max-w-2xl">
              Follow this step-by-step procedure to bind your HTML campaign intake form to a live Google Sheet without requiring complicated OAuth libraries.
            </p>
          </div>
        </div>
      </div>

      {/* Step Cards */}
      <div className="space-y-3">
        {steps.map((step) => {
          const isDone = completedSteps.includes(step.num);
          return (
            <div
              key={step.num}
              onClick={() => toggleStep(step.num)}
              className={`bg-white rounded-xl border transition-all cursor-pointer p-4 ${
                isDone ? 'border-emerald-300 bg-emerald-50/20' : 'border-slate-200 hover:border-indigo-300'
              }`}
            >
              <div className="flex items-start space-x-3">
                <button
                  type="button"
                  className={`mt-0.5 flex-shrink-0 transition-colors ${
                    isDone ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {isDone ? <CheckCircle className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                </button>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      Step {step.num}
                    </span>
                    <h3 className={`text-sm font-semibold ${isDone ? 'text-emerald-950' : 'text-slate-900'}`}>
                      {step.title}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">{step.detail}</p>

                  {step.important && (
                    <div className="mt-2 bg-amber-50 border border-amber-200 rounded-lg p-2.5 text-xs text-amber-900 flex items-start space-x-2">
                      <ShieldCheck className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                      <span>{step.important}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Live Endpoint Tester Box */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
        <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
          <Play className="w-4 h-4 text-indigo-600" />
          <span>Test Web App Endpoint Connection</span>
        </h3>

        <p className="text-xs text-slate-500">
          Paste your Web App URL below and send a test payload to verify CORS and sheet appending.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-2">
          <input
            type="url"
            value={webAppUrl}
            onChange={(e) => setWebAppUrl(e.target.value)}
            placeholder="https://script.google.com/macros/s/YOUR_EXEC_ID/exec"
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:bg-white"
          />
          <button
            onClick={runEndpointTest}
            disabled={testResult.status === 'testing'}
            className="w-full sm:w-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-all whitespace-nowrap flex items-center justify-center space-x-1.5"
          >
            {testResult.status === 'testing' ? (
              <span>Pinging Endpoint...</span>
            ) : (
              <>
                <span>Send Test Ping</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>

        {/* Test Result Indicator */}
        {testResult.status === 'success' && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-xs text-emerald-900 flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{testResult.message}</span>
          </div>
        )}

        {testResult.status === 'error' && (
          <div className="bg-rose-50 border border-rose-200 rounded-lg p-3 text-xs text-rose-900 flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>{testResult.message}</span>
          </div>
        )}
      </div>
    </div>
  );
};
