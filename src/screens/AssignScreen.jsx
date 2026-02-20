import { useState } from 'react'
import Header from '../components/Header'
import Button from '../components/Button'
import { getUnassignedItems } from '../utils/calculations'

// Color palette for people avatars
const PERSON_COLORS = [
  'bg-violet-100 text-violet-700',
  'bg-blue-100 text-blue-700',
  'bg-emerald-100 text-emerald-700',
  'bg-rose-100 text-rose-700',
  'bg-amber-100 text-amber-700',
  'bg-cyan-100 text-cyan-700',
  'bg-pink-100 text-pink-700',
  'bg-lime-100 text-lime-700',
];

function ItemAssignCard({ item, people, assigned, onToggle, onAssignAll }) {
  const assignedCount = assigned.length;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Item header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50">
        <div className="flex-1 min-w-0 mr-3">
          <p className="font-semibold text-gray-900 text-sm truncate">{item.name}</p>
          <p className="text-xs text-gray-500 mt-0.5">
            ${(parseFloat(item.price) || 0).toFixed(2)}
            {assignedCount > 1 && (
              <span className="text-indigo-500 ml-1">
                • ${((parseFloat(item.price) || 0) / assignedCount).toFixed(2)} each
              </span>
            )}
          </p>
        </div>

        {/* Assign to all button */}
        <button
          onClick={onAssignAll}
          className={`text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${
            assignedCount === people.length
              ? 'bg-indigo-600 text-white'
              : 'bg-indigo-50 text-indigo-600 active:bg-indigo-100'
          }`}
        >
          {assignedCount === people.length ? 'Split All ✓' : 'Split All'}
        </button>
      </div>

      {/* Person checkboxes */}
      <div className="px-4 py-2">
        {people.map((person, idx) => {
          const isChecked = assigned.includes(idx);
          return (
            <label
              key={idx}
              className="flex items-center gap-3 py-2.5 cursor-pointer active:opacity-70"
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => onToggle(idx)}
                className="w-5 h-5 rounded-md border-gray-300 text-indigo-600 focus:ring-indigo-500 shrink-0"
              />
              <div className={`w-7 h-7 rounded-full ${PERSON_COLORS[idx % PERSON_COLORS.length]} flex items-center justify-center text-xs font-bold shrink-0`}>
                {person[0]?.toUpperCase() || '?'}
              </div>
              <span className="text-sm text-gray-800 font-medium flex-1">{person}</span>
              {isChecked && assignedCount > 0 && (
                <span className="text-xs text-indigo-500 font-medium">
                  ${((parseFloat(item.price) || 0) / assignedCount).toFixed(2)}
                </span>
              )}
            </label>
          );
        })}
      </div>
    </div>
  );
}

export default function AssignScreen({ items, people, assignments, setAssignments, onNext, onBack }) {
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'unassigned'

  const toggleAssignment = (itemId, personIdx) => {
    setAssignments(prev => {
      const current = prev[itemId] || [];
      const updated = current.includes(personIdx)
        ? current.filter(i => i !== personIdx)
        : [...current, personIdx];
      return { ...prev, [itemId]: updated };
    });
  };

  const toggleAssignAll = (itemId) => {
    setAssignments(prev => {
      const current = prev[itemId] || [];
      const allAssigned = current.length === people.length;
      return {
        ...prev,
        [itemId]: allAssigned ? [] : people.map((_, i) => i),
      };
    });
  };

  const assignAllToAll = () => {
    const newAssignments = {};
    items.forEach(item => {
      newAssignments[item.id] = people.map((_, i) => i);
    });
    setAssignments(newAssignments);
  };

  const unassigned = getUnassignedItems(items, assignments);
  const filteredItems = activeFilter === 'unassigned' ? unassigned : items;
  const allAssigned = unassigned.length === 0;

  const canProceed = allAssigned;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header
        title="Assign Items"
        onBack={onBack}
        rightAction={
          <button
            onClick={assignAllToAll}
            className="text-xs font-medium text-indigo-600 active:opacity-70 px-1"
          >
            All → All
          </button>
        }
      />

      <div className="flex-1 max-w-lg mx-auto w-full pb-36">
        {/* Progress indicator */}
        <div className="px-4 pt-4 pb-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500">
              {items.length - unassigned.length} of {items.length} items assigned
            </span>
            {!allAssigned && (
              <span className="text-xs font-medium text-amber-600">
                {unassigned.length} remaining
              </span>
            )}
            {allAssigned && (
              <span className="text-xs font-medium text-emerald-600 flex items-center gap-1">
                <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                All assigned!
              </span>
            )}
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 rounded-full transition-all duration-300"
              style={{ width: `${((items.length - unassigned.length) / items.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Filter tabs */}
        {unassigned.length > 0 && (
          <div className="flex gap-2 px-4 py-3">
            <button
              onClick={() => setActiveFilter('all')}
              className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${
                activeFilter === 'all'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-600 border border-gray-200'
              }`}
            >
              All ({items.length})
            </button>
            <button
              onClick={() => setActiveFilter('unassigned')}
              className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${
                activeFilter === 'unassigned'
                  ? 'bg-amber-500 text-white'
                  : 'bg-white text-gray-600 border border-gray-200'
              }`}
            >
              Unassigned ({unassigned.length})
            </button>
          </div>
        )}

        {/* Items list */}
        <div className="px-4 space-y-3 pt-1">
          {filteredItems.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg width="28" height="28" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <p className="text-gray-700 font-semibold">All items assigned!</p>
              <p className="text-gray-500 text-sm mt-1">Tap Continue to see the breakdown</p>
            </div>
          ) : (
            filteredItems.map(item => (
              <ItemAssignCard
                key={item.id}
                item={item}
                people={people}
                assigned={assignments[item.id] || []}
                onToggle={(personIdx) => toggleAssignment(item.id, personIdx)}
                onAssignAll={() => toggleAssignAll(item.id)}
              />
            ))
          )}
        </div>
      </div>

      {/* Next button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-4 pb-safe">
        <Button onClick={onNext} disabled={!canProceed}>
          {canProceed ? (
            <>
              See Summary
              <svg className="ml-2" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </>
          ) : (
            `Assign ${unassigned.length} more item${unassigned.length > 1 ? 's' : ''} to continue`
          )}
        </Button>
      </div>
    </div>
  );
}
