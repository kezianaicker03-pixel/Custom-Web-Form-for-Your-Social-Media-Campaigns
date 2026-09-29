import React, { useState, useEffect } from 'react';
import { ActiveTab, CampaignSubmission } from './types';
import { generateStandaloneHTML, generateAppsScriptCode, INITIAL_SUBMISSIONS } from './data/codeTemplates';
import { Navbar } from './components/Navbar';
import { IntakeForm } from './components/IntakeForm';
import { CodeViewer } from './components/CodeViewer';
import { SetupGuide } from './components/SetupGuide';
import { SubmissionsTable } from './components/SubmissionsTable';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('preview');
  const [webAppUrl, setWebAppUrl] = useState<string>(() => {
    return localStorage.getItem('campaign_webapp_url') || '';
  });
  const [useSimulationMode, setUseSimulationMode] = useState<boolean>(true);
  const [submissions, setSubmissions] = useState<CampaignSubmission[]>(() => {
    const saved = localStorage.getItem('campaign_submissions');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (err) {
        return INITIAL_SUBMISSIONS;
      }
    }
    return INITIAL_SUBMISSIONS;
  });

  useEffect(() => {
    localStorage.setItem('campaign_webapp_url', webAppUrl);
  }, [webAppUrl]);

  useEffect(() => {
    localStorage.setItem('campaign_submissions', JSON.stringify(submissions));
  }, [submissions]);

  const handleNewSubmission = (newSub: CampaignSubmission) => {
    setSubmissions((prev) => [newSub, ...prev]);
  };

  const handleAddSample = () => {
    const sample: CampaignSubmission = {
      id: `sub-${Date.now()}`,
      fullName: 'Jordan Taylor',
      email: 'jordan.t@creativepulse.agency',
      platform: 'YouTube',
      campaignName: 'Q4 Creator Product Showcase',
      notesBudget: '$25,000 budget - 10 dedicated video integrations + mid-roll sponsorships.',
      timestamp: new Date().toISOString(),
      status: 'simulated'
    };
    setSubmissions((prev) => [sample, ...prev]);
  };

  const htmlCode = generateStandaloneHTML(webAppUrl);
  const scriptCode = generateAppsScriptCode();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* App Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        webAppUrl={webAppUrl}
        setWebAppUrl={setWebAppUrl}
        submissionCount={submissions.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'preview' && (
          <IntakeForm
            webAppUrl={webAppUrl}
            useSimulationMode={useSimulationMode}
            setUseSimulationMode={setUseSimulationMode}
            onNewSubmission={handleNewSubmission}
          />
        )}

        {activeTab === 'html-code' && (
          <CodeViewer
            title="Single-File HTML/JS Social Media Campaign Intake Form"
            filename="campaign-intake-form.html"
            language="html"
            code={htmlCode}
            description="Complete standalone single-file HTML form with mobile-friendly CSS styles and fetch logic matching the 5 required headers."
            badgeText="Client-Side Form"
          />
        )}

        {activeTab === 'script-code' && (
          <CodeViewer
            title="Google Apps Script doPost Web App Handler"
            filename="Code.gs"
            language="javascript"
            code={scriptCode}
            description="Production Google Apps Script handling POST requests, header creation, timestamps, and CORS JSON responses."
            badgeText="Server-Side doPost"
          />
        )}

        {activeTab === 'setup-guide' && (
          <SetupGuide webAppUrl={webAppUrl} setWebAppUrl={setWebAppUrl} />
        )}

        {activeTab === 'submissions' && (
          <SubmissionsTable
            submissions={submissions}
            onClearSubmissions={() => setSubmissions([])}
            onAddSample={handleAddSample}
          />
        )}
      </main>

      {/* Minimalist Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Social Media Campaign Intake &amp; Google Apps Script Generator</span>
          <span className="text-slate-400">Headers: Full Name • Email Address • Platform/Channel • Campaign Name • Notes/Budget</span>
        </div>
      </footer>
    </div>
  );
}
