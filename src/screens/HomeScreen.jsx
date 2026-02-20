import Button from '../components/Button'

export default function HomeScreen({ onStartCamera, onStartManual, onOpenSettings, hasApiKey }) {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-indigo-600 to-indigo-700">
      {/* Settings button */}
      <div className="flex justify-end p-4 pt-safe">
        <button
          onClick={onOpenSettings}
          className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm text-white rounded-full px-3 py-2 text-sm font-medium active:bg-white/30 transition-colors"
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="8" cy="8" r="3" />
            <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.05 3.05l1.41 1.41M11.54 11.54l1.41 1.41M3.05 12.95l1.41-1.41M11.54 4.46l1.41-1.41" />
          </svg>
          Settings
        </button>
      </div>

      {/* Hero section */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-8">
        {/* Logo */}
        <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-xl mb-6">
          <span className="text-4xl">🍽️</span>
        </div>

        <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">SplitTab</h1>
        <p className="text-indigo-200 text-lg text-center mb-10 max-w-xs">
          Split restaurant bills fairly — no math, no drama
        </p>

        {/* API key warning */}
        {!hasApiKey && (
          <div className="w-full max-w-sm mb-6 bg-amber-400/20 border border-amber-300/30 rounded-2xl px-4 py-3 flex items-start gap-3">
            <svg className="text-amber-300 shrink-0 mt-0.5" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <p className="text-amber-100 text-sm">
              Add your Anthropic API key in Settings to use receipt scanning.
            </p>
          </div>
        )}

        {/* Action buttons */}
        <div className="w-full max-w-sm space-y-3">
          <button
            onClick={onStartCamera}
            className="w-full bg-white rounded-2xl p-5 flex items-center gap-4 shadow-lg active:scale-95 transition-transform text-left"
          >
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center shrink-0">
              <svg width="24" height="24" fill="none" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
            </div>
            <div>
              <div className="font-semibold text-gray-900">Scan Receipt</div>
              <div className="text-sm text-gray-500 mt-0.5">Take a photo or upload an image</div>
            </div>
            <svg className="ml-auto text-gray-300" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>

          <button
            onClick={onStartManual}
            className="w-full bg-white/15 backdrop-blur-sm border border-white/20 rounded-2xl p-5 flex items-center gap-4 active:bg-white/25 transition-colors text-left"
          >
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
              <svg width="24" height="24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </div>
            <div>
              <div className="font-semibold text-white">Enter Manually</div>
              <div className="text-sm text-indigo-200 mt-0.5">Type in items by hand</div>
            </div>
            <svg className="ml-auto text-indigo-300" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="pb-safe px-6">
        <p className="text-center text-indigo-300 text-xs pb-4">
          Powered by Claude AI
        </p>
      </div>
    </div>
  );
}
