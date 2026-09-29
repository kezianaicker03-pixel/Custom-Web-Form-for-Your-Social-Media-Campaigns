import React from 'react';
import { ActiveTab } from '../types';
import { FormInput, FileCode, Code, BookOpen, Database, Sparkles, CheckCircle, AlertCircle } from 'lucide-react';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  webAppUrl: string;
  setWebAppUrl: (url: string) => void;
  submissionCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  webAppUrl,
  setWebAppUrl,
  submissionCount
}) => {
  const isUrlConfigured = webAppUrl.trim().length > 10 && !webAppUrl.includes('YOUR_EXEC_ID');

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3 gap-3">
          {/* Brand Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-200">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-bold text-slate-900 text-lg leading-tight">
                  Campaign Intake Studio
                </h1>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Apps Script Ready
                </span>
              </div>
              <p className="text-xs text-slate-500">
                HTML/JS Form &amp; Google Apps Script <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-600">doPost</code> Generator
              </p>
            </div>
          </div>

          {/* Web App URL Config Box */}
          <div className="flex items-center space-x-2 bg-slate-50 p-1.5 rounded-xl border border-slate-200 text-xs flex-1 max-w-md">
            <div className="pl-2">
              {isUrlConfigured ? (
                <CheckCircle className="w-4 h-4 text-emerald-500" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-500" />
              )}
            </div>
            <input
              type="url"
              value={webAppUrl}
              onChange={(e) => setWebAppUrl(e.target.value)}
              placeholder="Paste Apps Script Web App URL (https://script.google.com/...)"
              className="w-full bg-transparent border-none text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-0 text-xs font-mono"
            />
            {webAppUrl && (
              <button
                onClick={() => setWebAppUrl('')}
                className="text-slate-400 hover:text-slate-600 px-1 text-xs"
                title="Clear Web App URL"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="flex space-x-1 overflow-x-auto pt-1 pb-2 scrollbar-none border-t border-slate-100">
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'preview'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <FormInput className="w-4 h-4" />
            <span>Form Interactive Preview</span>
          </button>

          <button
            onClick={() => setActiveTab('html-code')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'html-code'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <FileCode className="w-4 h-4" />
            <span>Single-File HTML/JS</span>
          </button>

          <button
            onClick={() => setActiveTab('script-code')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'script-code'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Code className="w-4 h-4" />
            <span>Google Apps Script (doPost)</span>
          </button>

          <button
            onClick={() => setActiveTab('setup-guide')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'setup-guide'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Setup Walkthrough</span>
          </button>

          <button
            onClick={() => setActiveTab('submissions')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'submissions'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Submissions Log</span>
            {submissionCount > 0 && (
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                activeTab === 'submissions' ? 'bg-indigo-700 text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                {submissionCount}
              </span>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
};
