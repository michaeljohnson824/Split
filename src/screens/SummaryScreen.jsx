import { useState } from 'react'
import Header from '../components/Header'
import Button from '../components/Button'
import { calculateSplit, formatCurrency } from '../utils/calculations'

const PERSON_COLORS = [
  { bg: 'bg-violet-100', text: 'text-violet-700', border: 'border-violet-200', accent: 'bg-violet-600' },
  { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200', accent: 'bg-blue-600' },
  { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200', accent: 'bg-emerald-600' },
  { bg: 'bg-rose-100', text: 'text-rose-700', border: 'border-rose-200', accent: 'bg-rose-600' },
  { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200', accent: 'bg-amber-600' },
  { bg: 'bg-cyan-100', text: 'text-cyan-700', border: 'border-cyan-200', accent: 'bg-cyan-600' },
  { bg: 'bg-pink-100', text: 'text-pink-700', border: 'border-pink-200', accent: 'bg-pink-600' },
  { bg: 'bg-lime-100', text: 'text-lime-700', border: 'border-lime-200', accent: 'bg-lime-600' },
];

function PersonCard({ person, colorScheme, venmoUsername }) {
  const [expanded, setExpanded] = useState(true);

  const venmoLink = venmoUsername
    ? `venmo://paycharge?txn=charge&recipients=${encodeURIComponent(venmoUsername)}&amount=${person.total.toFixed(2)}&note=${encodeURIComponent('SplitTab - Dinner')}`
    : null;

  const webVenmoLink = venmoUsername
    ? `https://venmo.com/${venmoUsername}?txn=charge&amount=${person.total.toFixed(2)}&note=${encodeURIComponent('SplitTab - Dinner')}`
    : null;

  return (
    <div className={`bg-white rounded-2xl border ${colorScheme.border} shadow-sm overflow-hidden`}>
      {/* Header */}
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center gap-3 px-4 py-4 text-left active:opacity-80"
      >
        <div className={`w-10 h-10 rounded-full ${colorScheme.bg} ${colorScheme.text} flex items-center justify-center text-sm font-bold shrink-0`}>
          {person.name[0]?.toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 text-sm">{person.name}</p>
          <p className="text-xs text-gray-500 mt-0.5">
            {person.items.length} item{person.items.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-lg font-bold text-gray-900">{formatCurrency(person.total)}</p>
        </div>
        <svg
          className={`text-gray-400 transition-transform ml-1 shrink-0 ${expanded ? 'rotate-180' : ''}`}
          width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Expanded breakdown */}
      {expanded && (
        <div className="border-t border-gray-50">
          {/* Items */}
          <div className="px-4 py-2">
            {person.items.map(item => (
              <div key={item.id} className="flex items-center justify-between py-2">
                <div className="flex-1 min-w-0 mr-3">
                  <span className="text-sm text-gray-700 truncate block">{item.name}</span>
                  {item.splitWith && (
                    <span className="text-xs text-gray-400">
                      Split {item.splitWith} ways ({formatCurrency(item.fullPrice)})
                    </span>
                  )}
                </div>
                <span className="text-sm font-medium text-gray-900 shrink-0">
                  {formatCurrency(item.share)}
                </span>
              </div>
            ))}
          </div>

          {/* Tax + Tip breakdown */}
          {(person.tax > 0.005 || person.tip > 0.005) && (
            <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
              {person.tax > 0.005 && (
                <div className="flex justify-between py-1">
                  <span className="text-xs text-gray-500">Tax (prorated)</span>
                  <span className="text-xs font-medium text-gray-700">{formatCurrency(person.tax)}</span>
                </div>
              )}
              {person.tip > 0.005 && (
                <div className="flex justify-between py-1">
                  <span className="text-xs text-gray-500">Tip (prorated)</span>
                  <span className="text-xs font-medium text-gray-700">{formatCurrency(person.tip)}</span>
                </div>
              )}
            </div>
          )}

          {/* Total row */}
          <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t border-gray-100">
            <span className="text-sm font-semibold text-gray-900">Total</span>
            <span className={`text-base font-bold ${colorScheme.text}`}>{formatCurrency(person.total)}</span>
          </div>

          {/* Venmo button */}
          {venmoLink && (
            <div className="px-4 pb-4 pt-2">
              <a
                href={venmoLink}
                onClick={(e) => {
                  // Fall back to web if app not installed
                  setTimeout(() => {
                    window.location.href = webVenmoLink;
                  }, 1500);
                }}
                className={`flex items-center justify-center gap-2 w-full py-3.5 ${colorScheme.accent} text-white rounded-xl font-semibold text-sm active:opacity-80 transition-opacity`}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.137 2.5c.607 1.012.879 2.051.879 3.365 0 4.195-3.578 9.639-6.485 13.482H7.687L5.5 3.503l5.354-.505 1.201 9.527c1.118-1.842 2.499-4.74 2.499-6.72 0-1.082-.187-1.817-.46-2.421L19.137 2.5z"/>
                </svg>
                Request {formatCurrency(person.total)} on Venmo
              </a>
            </div>
          )}

          {!venmoLink && (
            <div className="px-4 pb-4 pt-2">
              <div className="text-center py-2 text-xs text-gray-400">
                Add your Venmo username in Settings to enable payment requests
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function SummaryScreen({ items, people, assignments, tax, tip, venmoUsername, onBack, onStartOver }) {
  const splits = calculateSplit(items, people, assignments, tax, tip);
  const grandTotal = splits.reduce((sum, p) => sum + p.total, 0);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header
        title="Summary"
        onBack={onBack}
      />

      <div className="flex-1 px-4 py-4 space-y-3 max-w-lg mx-auto w-full pb-36">
        {/* Grand total banner */}
        <div className="bg-indigo-600 rounded-2xl p-5 text-white">
          <p className="text-indigo-200 text-sm font-medium mb-1">Total Bill</p>
          <p className="text-4xl font-bold tracking-tight">{formatCurrency(grandTotal)}</p>
          <div className="flex gap-4 mt-3 text-sm text-indigo-200">
            <span>{people.length} people</span>
            <span>•</span>
            <span>{items.length} items</span>
            {tax > 0 && <><span>•</span><span>Tax {formatCurrency(tax)}</span></>}
            {tip > 0 && <><span>•</span><span>Tip {formatCurrency(tip)}</span></>}
          </div>
        </div>

        {/* Venmo note if no username */}
        {!venmoUsername && (
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex gap-3">
            <svg className="text-blue-500 shrink-0 mt-0.5" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <p className="text-sm text-blue-800">
              Add your Venmo username in{' '}
              <span className="font-semibold">Settings</span>{' '}
              to show payment request buttons.
            </p>
          </div>
        )}

        {/* Per-person cards */}
        {splits.map((person, idx) => (
          <PersonCard
            key={idx}
            person={person}
            colorScheme={PERSON_COLORS[idx % PERSON_COLORS.length]}
            venmoUsername={venmoUsername}
          />
        ))}

        {/* Disclaimer */}
        <p className="text-center text-xs text-gray-400 pb-2">
          Amounts are rounded to the nearest cent. Small rounding differences may occur.
        </p>
      </div>

      {/* Footer actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-4 pb-safe space-y-2">
        <Button variant="secondary" onClick={onBack}>
          <svg className="mr-2" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5l-7 7 7 7" />
          </svg>
          Edit Assignments
        </Button>
        <Button variant="ghost" onClick={onStartOver}>
          Start New Split
        </Button>
      </div>
    </div>
  );
}
