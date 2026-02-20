import { useState } from 'react'
import Header from '../components/Header'
import Button from '../components/Button'

export default function SettingsScreen({ apiKey, venmoUsername, onSave, onBack }) {
  const [localApiKey, setLocalApiKey] = useState(apiKey);
  const [localVenmo, setLocalVenmo] = useState(venmoUsername);
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    onSave(localApiKey.trim(), localVenmo.trim().replace(/^@/, ''));
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onBack();
    }, 800);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header title="Settings" onBack={onBack} />

      <div className="flex-1 px-4 py-6 space-y-6 max-w-lg mx-auto w-full">
        {/* API Key section */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 bg-purple-100 rounded-xl flex items-center justify-center">
              <svg width="18" height="18" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">Anthropic API Key</h2>
              <p className="text-xs text-gray-500">Used for receipt scanning</p>
            </div>
          </div>

          <div className="relative">
            <input
              type={showKey ? 'text' : 'password'}
              value={localApiKey}
              onChange={e => setLocalApiKey(e.target.value)}
              placeholder="sk-ant-..."
              className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
            />
            <button
              type="button"
              onClick={() => setShowKey(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400"
            >
              {showKey ? (
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 11.94A10 10 0 0112 14c-2.76 0-5.26-1.12-7.07-2.93M9.88 9.88a3 3 0 104.24 4.24M1 1l22 22" />
                  <path d="M10.73 5.08A10.43 10.43 0 0112 5c5.52 0 10 4.5 10 7a7.84 7.84 0 01-.59 2.59" />
                </svg>
              ) : (
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>

          <p className="mt-3 text-xs text-gray-500 leading-relaxed">
            Get your API key from{' '}
            <span className="text-indigo-600 font-medium">console.anthropic.com</span>.
            Your key is stored locally in your browser and never sent anywhere except Anthropic's API.
          </p>
        </div>

        {/* Venmo section */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center">
              <svg width="18" height="18" fill="none" stroke="#1d4ed8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                <line x1="1" y1="10" x2="23" y2="10" />
              </svg>
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">Your Venmo Username</h2>
              <p className="text-xs text-gray-500">For payment requests</p>
            </div>
          </div>

          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium text-sm">@</span>
            <input
              type="text"
              value={localVenmo}
              onChange={e => setLocalVenmo(e.target.value.replace(/^@/, ''))}
              placeholder="your-username"
              className="w-full px-4 py-3 pl-8 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
            />
          </div>

          <p className="mt-3 text-xs text-gray-500">
            Others will be prompted to pay this Venmo account.
          </p>
        </div>

        {/* Privacy note */}
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex gap-3">
          <svg className="text-amber-500 shrink-0 mt-0.5" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <p className="text-sm text-amber-800">
            All data is stored locally on your device. Nothing is saved to any server.
          </p>
        </div>
      </div>

      {/* Save button */}
      <div className="sticky bottom-0 bg-white border-t border-gray-100 px-4 py-4 pb-safe">
        <Button
          onClick={handleSave}
          disabled={saved}
          className={saved ? 'bg-green-500!' : ''}
        >
          {saved ? (
            <span className="flex items-center gap-2">
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Saved!
            </span>
          ) : 'Save Settings'}
        </Button>
      </div>
    </div>
  );
}
