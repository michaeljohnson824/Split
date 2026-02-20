import { useRef } from 'react'
import Header from '../components/Header'
import Button from '../components/Button'

function ItemRow({ item, onUpdate, onRemove }) {
  return (
    <div className={`bg-white rounded-2xl p-4 border ${item.flagged ? 'border-amber-200 bg-amber-50/30' : 'border-gray-100'} shadow-sm`}>
      {item.flagged && (
        <div className="flex items-center gap-1.5 mb-2.5">
          <svg width="14" height="14" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <span className="text-xs font-medium text-amber-600">Please verify — may be inaccurate</span>
        </div>
      )}
      <div className="flex items-center gap-3">
        <input
          type="text"
          value={item.name}
          onChange={e => onUpdate(item.id, { name: e.target.value })}
          placeholder="Item name"
          className="flex-1 text-sm text-gray-900 font-medium bg-transparent border-0 outline-none placeholder-gray-400 min-w-0"
        />
        <div className="flex items-center gap-1 shrink-0">
          <span className="text-gray-400 text-sm">$</span>
          <input
            type="number"
            value={item.price}
            onChange={e => onUpdate(item.id, { price: parseFloat(e.target.value) || 0 })}
            placeholder="0.00"
            step="0.01"
            min="0"
            className="w-20 text-right text-sm font-semibold text-gray-900 bg-transparent border-0 outline-none placeholder-gray-400"
          />
        </div>
        <button
          onClick={() => onRemove(item.id)}
          className="w-7 h-7 flex items-center justify-center text-gray-300 active:text-red-400 transition-colors ml-1"
        >
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function TotalsSection({ subtotal, setSubtotal, tax, setTax, tip, setTip, computedSubtotal }) {
  const subIsComputed = !subtotal || Math.abs(parseFloat(subtotal) - computedSubtotal) < 0.01;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-50">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Totals</h3>
      </div>

      {/* Subtotal (computed or editable) */}
      <div className="flex items-center px-4 py-3 border-b border-gray-50">
        <span className="flex-1 text-sm text-gray-600">Subtotal</span>
        {subIsComputed ? (
          <span className="text-sm font-semibold text-gray-900">
            ${computedSubtotal.toFixed(2)}
            <span className="text-xs text-gray-400 font-normal ml-1">(from items)</span>
          </span>
        ) : (
          <div className="flex items-center gap-1">
            <span className="text-gray-400 text-sm">$</span>
            <input
              type="number"
              value={subtotal}
              onChange={e => setSubtotal(e.target.value)}
              placeholder="0.00"
              step="0.01"
              min="0"
              className="w-24 text-right text-sm font-semibold text-gray-900 bg-transparent border-0 outline-none"
            />
          </div>
        )}
      </div>

      {/* Tax */}
      <div className="flex items-center px-4 py-3 border-b border-gray-50">
        <span className="flex-1 text-sm text-gray-600">Tax</span>
        <div className="flex items-center gap-1">
          <span className="text-gray-400 text-sm">$</span>
          <input
            type="number"
            value={tax}
            onChange={e => setTax(e.target.value)}
            placeholder="0.00"
            step="0.01"
            min="0"
            className="w-24 text-right text-sm font-semibold text-gray-900 bg-transparent border-0 outline-none"
          />
        </div>
      </div>

      {/* Tip */}
      <div className="px-4 py-3">
        <div className="flex items-center">
          <span className="flex-1 text-sm text-gray-600">Tip</span>
          <div className="flex items-center gap-1">
            <span className="text-gray-400 text-sm">$</span>
            <input
              type="number"
              value={tip}
              onChange={e => setTip(e.target.value)}
              placeholder="0.00"
              step="0.01"
              min="0"
              className="w-24 text-right text-sm font-semibold text-gray-900 bg-transparent border-0 outline-none"
            />
          </div>
        </div>

        {/* Quick tip buttons */}
        {!tip && (
          <div className="mt-3 flex gap-2">
            <span className="text-xs text-gray-400 self-center">Quick:</span>
            {[15, 18, 20, 22].map(pct => {
              const tipAmount = (computedSubtotal * pct / 100).toFixed(2);
              return (
                <button
                  key={pct}
                  onClick={() => setTip(tipAmount)}
                  className="flex-1 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 rounded-lg active:bg-indigo-100 transition-colors"
                >
                  {pct}%
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Grand total */}
      <div className="flex items-center px-4 py-3 bg-gray-50 border-t border-gray-100">
        <span className="flex-1 text-sm font-semibold text-gray-900">Total</span>
        <span className="text-base font-bold text-indigo-700">
          ${((parseFloat(subtotal) || computedSubtotal) + (parseFloat(tax) || 0) + (parseFloat(tip) || 0)).toFixed(2)}
        </span>
      </div>
    </div>
  );
}

export default function ItemsScreen({ items, subtotal, setSubtotal, tax, setTax, tip, setTip, addItem, updateItem, removeItem, onNext, onBack }) {
  const computedSubtotal = items.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0);
  const flaggedCount = items.filter(i => i.flagged).length;

  const canProceed = items.length > 0 && items.every(i => i.name.trim() && parseFloat(i.price) >= 0);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header
        title="Review Items"
        onBack={onBack}
        rightAction={
          <button
            onClick={() => addItem()}
            className="w-9 h-9 flex items-center justify-center text-indigo-600 active:opacity-70"
          >
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
        }
      />

      <div className="flex-1 px-4 py-4 space-y-3 max-w-lg mx-auto w-full pb-36">
        {/* OCR flags warning */}
        {flaggedCount > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3">
            <svg className="text-amber-500 shrink-0 mt-0.5" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <p className="text-sm text-amber-800">
              <span className="font-semibold">{flaggedCount} item{flaggedCount > 1 ? 's' : ''}</span> may need review — please verify the highlighted items.
            </p>
          </div>
        )}

        {/* Items list */}
        {items.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg width="28" height="28" fill="none" stroke="#9ca3af" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-gray-500 font-medium">No items yet</p>
            <p className="text-gray-400 text-sm mt-1">Tap the + button to add items</p>
          </div>
        ) : (
          <div className="space-y-2">
            {items.map(item => (
              <ItemRow
                key={item.id}
                item={item}
                onUpdate={updateItem}
                onRemove={removeItem}
              />
            ))}
          </div>
        )}

        {/* Add item button (inline) */}
        <button
          onClick={() => addItem()}
          className="w-full py-3 flex items-center justify-center gap-2 text-indigo-600 text-sm font-medium border-2 border-dashed border-indigo-200 rounded-2xl active:bg-indigo-50 transition-colors"
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Item
        </button>

        {/* Totals */}
        {items.length > 0 && (
          <TotalsSection
            subtotal={subtotal}
            setSubtotal={setSubtotal}
            tax={tax}
            setTax={setTax}
            tip={tip}
            setTip={setTip}
            computedSubtotal={computedSubtotal}
          />
        )}
      </div>

      {/* Next button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-4 pb-safe">
        <Button onClick={onNext} disabled={!canProceed}>
          Continue — Add People
          <svg className="ml-2" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Button>
        {!canProceed && items.length > 0 && (
          <p className="text-center text-xs text-gray-400 mt-2">
            Make sure all items have a name and price
          </p>
        )}
      </div>
    </div>
  );
}
