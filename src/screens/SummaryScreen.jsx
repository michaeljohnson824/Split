import { useState, useRef } from 'react'
import { toPng } from 'html-to-image'
import Header from '../components/Header'
import Button from '../components/Button'
import { calculateSplit, formatCurrency } from '../utils/calculations'

const PERSON_COLORS = [
  { bg: 'bg-violet-100', text: 'text-violet-700', border: 'border-violet-200', solid: 'bg-violet-600', hex: '#7c3aed' },
  { bg: 'bg-blue-100',   text: 'text-blue-700',   border: 'border-blue-200',   solid: 'bg-blue-600',   hex: '#2563eb' },
  { bg: 'bg-emerald-100',text: 'text-emerald-700', border: 'border-emerald-200',solid: 'bg-emerald-600',hex: '#059669' },
  { bg: 'bg-rose-100',   text: 'text-rose-700',   border: 'border-rose-200',   solid: 'bg-rose-600',   hex: '#e11d48' },
  { bg: 'bg-amber-100',  text: 'text-amber-700',  border: 'border-amber-200',  solid: 'bg-amber-600',  hex: '#d97706' },
  { bg: 'bg-cyan-100',   text: 'text-cyan-700',   border: 'border-cyan-200',   solid: 'bg-cyan-600',   hex: '#0891b2' },
  { bg: 'bg-pink-100',   text: 'text-pink-700',   border: 'border-pink-200',   solid: 'bg-pink-600',   hex: '#db2777' },
  { bg: 'bg-lime-100',   text: 'text-lime-700',   border: 'border-lime-200',   solid: 'bg-lime-600',   hex: '#65a30d' },
];

/**
 * Off-screen card rendered purely for html-to-image capture.
 * Uses inline styles only (no Tailwind) for reliable cross-platform rendering.
 */
function ShareCard({ forwardRef, person, hostVenmo, colorHex }) {
  return (
    <div
      ref={forwardRef}
      style={{
        position: 'fixed',
        top: '-9999px',
        left: '-9999px',
        width: '375px',
        backgroundColor: '#ffffff',
        fontFamily: 'system-ui, -apple-system, Helvetica, Arial, sans-serif',
        padding: '28px 24px 24px',
        boxSizing: 'border-box',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <div style={{ fontSize: '28px' }}>🍽️</div>
        <div style={{ fontSize: '20px', fontWeight: '800', color: '#4f46e5', letterSpacing: '-0.5px' }}>
          SplitTab
        </div>
      </div>

      {/* Person name */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px',
      }}>
        <div style={{
          width: '44px', height: '44px', borderRadius: '50%', backgroundColor: colorHex,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontSize: '18px', fontWeight: '700', flexShrink: 0,
        }}>
          {(person.name || '?')[0].toUpperCase()}
        </div>
        <div>
          <div style={{ fontSize: '18px', fontWeight: '700', color: '#111827' }}>
            {person.name}'s Bill
          </div>
          <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '2px' }}>
            {person.items.length} item{person.items.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Items */}
      <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '14px', marginBottom: '12px' }}>
        {person.items.map(item => (
          <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '6px 0', gap: '8px' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '14px', color: '#1f2937', fontWeight: '500' }}>{item.name}</div>
              {item.splitWith && (
                <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '1px' }}>
                  split {item.splitWith} ways · full price {formatCurrency(item.fullPrice)}
                </div>
              )}
            </div>
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#111827', flexShrink: 0 }}>
              {formatCurrency(item.share)}
            </div>
          </div>
        ))}
      </div>

      {/* Tax & tip */}
      {(person.tax > 0.005 || person.tip > 0.005) && (
        <div style={{ backgroundColor: '#f9fafb', borderRadius: '8px', padding: '10px 12px', marginBottom: '12px' }}>
          {person.tax > 0.005 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#6b7280', padding: '3px 0' }}>
              <span>Tax (your share)</span>
              <span>{formatCurrency(person.tax)}</span>
            </div>
          )}
          {person.tip > 0.005 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#6b7280', padding: '3px 0' }}>
              <span>Tip (your share)</span>
              <span>{formatCurrency(person.tip)}</span>
            </div>
          )}
        </div>
      )}

      {/* Total */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        borderTop: '2px solid ' + colorHex, paddingTop: '14px', marginBottom: '16px',
      }}>
        <span style={{ fontSize: '16px', fontWeight: '700', color: '#111827' }}>Total</span>
        <span style={{ fontSize: '22px', fontWeight: '800', color: colorHex }}>
          {formatCurrency(person.total)}
        </span>
      </div>

      {/* Pay instructions */}
      {hostVenmo && (
        <div style={{
          backgroundColor: '#eef2ff', borderRadius: '10px', padding: '12px 14px',
          textAlign: 'center', marginBottom: '12px',
        }}>
          <div style={{ fontSize: '13px', color: '#4f46e5', fontWeight: '600' }}>
            Venmo @{hostVenmo} {formatCurrency(person.total)}
          </div>
          <div style={{ fontSize: '11px', color: '#818cf8', marginTop: '3px' }}>
            Use the note: SplitTab - Dinner
          </div>
        </div>
      )}

      <div style={{ fontSize: '11px', color: '#d1d5db', textAlign: 'center' }}>
        Split fairly with SplitTab
      </div>
    </div>
  );
}

function PersonCard({ person, colorScheme, hostVenmo, localVenmo, onVenmoChange }) {
  const [expanded, setExpanded] = useState(false); // Default closed
  const [isSharing, setIsSharing] = useState(false);
  const shareCardRef = useRef(null);

  // Venmo charge link: txn=charge requests money FROM the person
  const venmoHandle = localVenmo || person.venmo;
  const venmoLink = venmoHandle
    ? `venmo://paycharge?txn=charge&recipients=${encodeURIComponent(venmoHandle)}&amount=${person.total.toFixed(2)}&note=${encodeURIComponent('SplitTab - Dinner')}`
    : null;
  const webVenmoLink = venmoHandle
    ? `https://venmo.com/${encodeURIComponent(venmoHandle)}?txn=charge&amount=${person.total.toFixed(2)}&note=${encodeURIComponent('SplitTab - Dinner')}`
    : null;

  const handleShare = async () => {
    if (!shareCardRef.current || isSharing) return;
    setIsSharing(true);
    try {
      const dataUrl = await toPng(shareCardRef.current, { pixelRatio: 2, width: 375 });
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File(
        [blob],
        `splittab-${person.name.toLowerCase().replace(/\s+/g, '-')}.png`,
        { type: 'image/png' }
      );

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: `SplitTab — ${person.name}'s bill` });
      } else {
        // Fallback: download the image
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = `splittab-${person.name.toLowerCase()}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    } catch (err) {
      if (err?.name !== 'AbortError') console.error('Share failed:', err);
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <>
      {/* Off-screen share card for image capture */}
      <ShareCard
        forwardRef={shareCardRef}
        person={person}
        hostVenmo={hostVenmo}
        colorHex={colorScheme.hex}
      />

      <div className={`bg-white rounded-2xl border ${colorScheme.border} shadow-sm overflow-hidden`}>
        {/* Card header — tap to expand/collapse */}
        <button
          onClick={() => setExpanded(e => !e)}
          className="w-full flex items-center gap-3 px-4 py-4 text-left active:bg-gray-50/50 transition-colors"
        >
          <div className={`w-10 h-10 rounded-full ${colorScheme.bg} ${colorScheme.text} flex items-center justify-center text-sm font-bold shrink-0`}>
            {(person.name || '?')[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 text-sm">{person.name}</p>
            <p className="text-xs text-gray-500 mt-0.5">
              {person.items.length} item{person.items.length !== 1 ? 's' : ''}
              {!expanded && <span className="text-gray-400"> — tap to see breakdown</span>}
            </p>
          </div>
          <p className="text-lg font-bold text-gray-900 shrink-0">{formatCurrency(person.total)}</p>
          <svg
            className={`text-gray-400 transition-transform ml-1 shrink-0 ${expanded ? 'rotate-180' : ''}`}
            width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        {/* Expanded breakdown */}
        {expanded && (
          <div className="border-t border-gray-100">
            {/* Items */}
            <div className="px-4 py-2">
              {person.items.map(item => (
                <div key={item.id} className="flex items-start justify-between py-2 gap-3">
                  <div className="flex-1 min-w-0">
                    <span className="text-sm text-gray-700 truncate block">{item.name}</span>
                    {item.splitWith && (
                      <span className="text-xs text-gray-400">
                        split {item.splitWith} ways · {formatCurrency(item.fullPrice)} total
                      </span>
                    )}
                  </div>
                  <span className="text-sm font-medium text-gray-900 shrink-0">
                    {formatCurrency(item.share)}
                  </span>
                </div>
              ))}
            </div>

            {/* Tax & tip */}
            {(person.tax > 0.005 || person.tip > 0.005) && (
              <div className="mx-4 mb-2 bg-gray-50 rounded-xl px-3 py-2">
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
            <div className={`flex items-center justify-between px-4 py-3 border-t border-gray-100`}>
              <span className="text-sm font-semibold text-gray-900">Total</span>
              <span className={`text-base font-bold ${colorScheme.text}`}>{formatCurrency(person.total)}</span>
            </div>

            {/* Action buttons */}
            <div className="px-4 pb-4 pt-2 space-y-2">
              {/* Venmo handle input if missing */}
              {!venmoHandle && (
                <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2.5">
                  <span className="text-gray-400 text-sm">@</span>
                  <input
                    type="text"
                    value={localVenmo}
                    onChange={e => onVenmoChange(e.target.value.replace(/^@/, ''))}
                    placeholder="Enter their Venmo handle to request"
                    className="flex-1 text-sm text-gray-700 bg-transparent border-0 outline-none placeholder-gray-400"
                    autoCapitalize="none"
                    autoCorrect="off"
                  />
                </div>
              )}

              {/* Venmo + Share row */}
              <div className="flex gap-2">
                {venmoLink ? (
                  <a
                    href={venmoLink}
                    onClick={() => {
                      setTimeout(() => { window.location.href = webVenmoLink; }, 1500);
                    }}
                    className={`flex-1 flex items-center justify-center gap-2 py-3.5 ${colorScheme.solid} text-white rounded-xl font-semibold text-sm active:opacity-80 transition-opacity`}
                  >
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19.137 2.5c.607 1.012.879 2.051.879 3.365 0 4.195-3.578 9.639-6.485 13.482H7.687L5.5 3.503l5.354-.505 1.201 9.527c1.118-1.842 2.499-4.74 2.499-6.72 0-1.082-.187-1.817-.46-2.421L19.137 2.5z"/>
                    </svg>
                    Request {formatCurrency(person.total)}
                  </a>
                ) : (
                  <button
                    disabled
                    className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-gray-100 text-gray-400 rounded-xl font-semibold text-sm cursor-not-allowed"
                  >
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19.137 2.5c.607 1.012.879 2.051.879 3.365 0 4.195-3.578 9.639-6.485 13.482H7.687L5.5 3.503l5.354-.505 1.201 9.527c1.118-1.842 2.499-4.74 2.499-6.72 0-1.082-.187-1.817-.46-2.421L19.137 2.5z"/>
                    </svg>
                    Venmo
                  </button>
                )}

                {/* Share breakdown image button */}
                <button
                  onClick={handleShare}
                  disabled={isSharing}
                  className="flex items-center justify-center gap-2 px-4 py-3.5 bg-gray-100 text-gray-700 rounded-xl font-semibold text-sm active:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  {isSharing ? (
                    <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" />
                      <polyline points="16 6 12 2 8 6" />
                      <line x1="12" y1="2" x2="12" y2="15" />
                    </svg>
                  )}
                  Share
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default function SummaryScreen({ items, people, assignments, tax, tip, venmoUsername, onBack, onStartOver }) {
  const splits = calculateSplit(items, people, assignments, tax, tip);
  const grandTotal = splits.reduce((sum, p) => sum + p.total, 0);

  // Local venmo handles — allows entering on-the-fly for people who skipped it earlier
  const [localVenmos, setLocalVenmos] = useState(
    () => Object.fromEntries(splits.map((p, i) => [i, p.venmo || '']))
  );

  const updateLocalVenmo = (idx, val) => {
    setLocalVenmos(prev => ({ ...prev, [idx]: val }));
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header title="Summary" onBack={onBack} />

      <div className="flex-1 px-4 py-4 space-y-3 max-w-lg mx-auto w-full pb-36">
        {/* Grand total banner */}
        <div className="bg-indigo-600 rounded-2xl p-5 text-white">
          <p className="text-indigo-200 text-sm font-medium mb-1">Total Bill</p>
          <p className="text-4xl font-bold tracking-tight">{formatCurrency(grandTotal)}</p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-sm text-indigo-200">
            <span>{people.length} people</span>
            <span>·</span>
            <span>{items.length} items</span>
            {tax > 0 && <><span>·</span><span>Tax {formatCurrency(tax)}</span></>}
            {tip > 0 && <><span>·</span><span>Tip {formatCurrency(tip)}</span></>}
          </div>
        </div>

        {/* Helper tip */}
        <p className="text-xs text-gray-400 text-center">
          Tap a person's card to see their breakdown and payment options
        </p>

        {/* Per-person cards */}
        {splits.map((person, idx) => (
          <PersonCard
            key={idx}
            person={person}
            colorScheme={PERSON_COLORS[idx % PERSON_COLORS.length]}
            hostVenmo={venmoUsername}
            localVenmo={localVenmos[idx]}
            onVenmoChange={(val) => updateLocalVenmo(idx, val)}
          />
        ))}

        <p className="text-center text-xs text-gray-400 pb-2">
          Amounts prorated proportionally. Small rounding differences may occur.
        </p>
      </div>

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
