import React, { useState } from 'react';
import { Copy, Check, Download, FileCode, Code, ExternalLink, Sparkles } from 'lucide-react';

interface CodeViewerProps {
  title: string;
  filename: string;
  language: 'html' | 'javascript';
  code: string;
  description: string;
  badgeText: string;
}

export const CodeViewer: React.FC<CodeViewerProps> = ({
  title,
  filename,
  code,
  description,
  badgeText
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const lines = code.split('\n');

  return (
    <div className="space-y-4">
      {/* Header bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-base font-semibold text-slate-900">{title}</h2>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
              {badgeText}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">{description}</p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopy}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center space-x-1.5 ${
              copied
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Code'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-medium transition-all shadow-xs flex items-center space-x-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download {filename}</span>
          </button>
        </div>
      </div>

      {/* Code Container */}
      <div className="bg-slate-950 rounded-xl overflow-hidden border border-slate-800 shadow-lg">
        {/* Code Bar */}
        <div className="bg-slate-900 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center space-x-2 font-mono">
            {filename.endsWith('.html') ? (
              <FileCode className="w-4 h-4 text-amber-400" />
            ) : (
              <Code className="w-4 h-4 text-emerald-400" />
            )}
            <span className="text-slate-200 font-semibold">{filename}</span>
            <span className="text-slate-600">|</span>
            <span>{lines.length} lines</span>
          </div>

          <div className="flex items-center space-x-1.5 text-[11px] text-slate-400">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Standard UTF-8 encoding</span>
          </div>
        </div>

        {/* Code Body with Line Numbers */}
        <div className="overflow-x-auto max-h-[560px] p-4 text-xs font-mono leading-relaxed text-slate-200 select-text scrollbar-thin scrollbar-thumb-slate-700">
          <table className="w-full border-collapse">
            <tbody>
              {lines.map((line, idx) => (
                <tr key={idx} className="hover:bg-slate-900/50">
                  <td className="pr-4 text-right text-slate-600 select-none w-10 text-[11px] font-sans">
                    {idx + 1}
                  </td>
                  <td className="whitespace-pre">
                    {line}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
