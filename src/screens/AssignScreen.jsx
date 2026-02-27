import { useState } from 'react'
import Header from '../components/Header'
import Button from '../components/Button'
import { getUnassignedItems } from '../utils/calculations'

// Color palette per person — bg + text + ring for the badge
const PERSON_COLORS = [
  { bg: 'bg-violet-500', light: 'bg-violet-100', text: 'text-violet-700', ring: 'ring-violet-300' },
  { bg: 'bg-blue-500',   light: 'bg-blue-100',   text: 'text-blue-700',   ring: 'ring-blue-300'   },
  { bg: 'bg-emerald-500',light: 'bg-emerald-100', text: 'text-emerald-700',ring: 'ring-emerald-300'},
  { bg: 'bg-rose-500',   light: 'bg-rose-100',    text: 'text-rose-700',   ring: 'ring-rose-300'   },
  { bg: 'bg-amber-500',  light: 'bg-amber-100',   text: 'text-amber-700',  ring: 'ring-amber-300'  },
  { bg: 'bg-cyan-500',   light: 'bg-cyan-100',    text: 'text-cyan-700',   ring: 'ring-cyan-300'   },
  { bg: 'bg-pink-500',   light: 'bg-pink-100',    text: 'text-pink-700',   ring: 'ring-pink-300'   },
  { bg: 'bg-lime-500',   light: 'bg-lime-100',    text: 'text-lime-700',   ring: 'ring-lime-300'   },
];

/**
 * A single item row inside a person's accordion.
 * Shows the item, current assignment state, and other assignees' initials.
 */
function ItemPickerRow({ item, people, personIdx, assigned, onToggle }) {
  const isAssigned = assigned.includes(personIdx);
  const otherAssignees = assigned.filter(i => i !== personIdx);

  // What the person would pay if added/kept
  const myShare = isAssigned
    ? item.price / assigned.length
    : item.price / (assigned.length + 1);

  return (
    <button
      onClick={() => onToggle(item.id, personIdx)}
      className={`w-full flex items-center gap-3 px-4 py-3 text-left border-b border-gray-50 last:border-b-0 transition-colors active:opacity-75 ${
        isAssigned ? 'bg-indigo-50' : 'bg-white'
      }`}
    >
      {/* Check circle */}
      <div
        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
          isAssigned
            ? 'bg-indigo-600 border-indigo-600'
            : 'border-gray-300 bg-white'
        }`}
      >
        {isAssigned && (
          <svg width="11" height="11" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="1.5 5.5 4.5 8.5 9.5 2.5" />
          </svg>
        )}
      </div>

      {/* Item name + price */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium truncate ${isAssigned ? 'text-indigo-900' : 'text-gray-800'}`}>
          {item.name}
        </p>
        <p className="text-xs text-gray-500 mt-0.5">
          {isAssigned
            ? `Your share: $${(item.price / assigned.length).toFixed(2)}${assigned.length > 1 ? ` (÷${assigned.length})` : ''}`
            : otherAssignees.length > 0
              ? `Join split → $${myShare.toFixed(2)} each`
              : `$${(parseFloat(item.price) || 0).toFixed(2)} — tap to claim`
          }
        </p>
      </div>

      {/* Other assignees' initials badges */}
      {otherAssignees.length > 0 && (
        <div className="flex -space-x-1.5 shrink-0">
          {otherAssignees.slice(0, 3).map(idx => {
            const c = PERSON_COLORS[idx % PERSON_COLORS.length];
            return (
              <div
                key={idx}
                className={`w-6 h-6 rounded-full ${c.bg} text-white flex items-center justify-center text-xs font-bold ring-2 ring-white`}
                title={people[idx]?.name}
              >
                {(people[idx]?.name || '?')[0].toUpperCase()}
              </div>
            );
          })}
          {otherAssignees.length > 3 && (
            <div className="w-6 h-6 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center text-xs font-bold ring-2 ring-white">
              +{otherAssignees.length - 3}
            </div>
          )}
        </div>
      )}
    </button>
  );
}

/**
 * One accordion card per person. Tap the header to open/close their item picker.
 */
function PersonAccordion({ person, personIdx, isOpen, onToggle, items, people, assignments, onItemToggle, colorScheme }) {
  // Calculate this person's current subtotal from assignments
  const mySubtotal = items.reduce((sum, item) => {
    const assigned = assignments[item.id] || [];
    if (assigned.includes(personIdx)) {
      return sum + item.price / assigned.length;
    }
    return sum;
  }, 0);

  const myItemCount = items.filter(item =>
    (assignments[item.id] || []).includes(personIdx)
  ).length;

  return (
    <div className={`bg-white rounded-2xl shadow-sm overflow-hidden border transition-all ${
      isOpen ? 'border-indigo-200' : 'border-gray-100'
    }`}>
      {/* Accordion header — tap to toggle */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 px-4 py-4 text-left active:bg-gray-50"
      >
        {/* Avatar */}
        <div className={`w-10 h-10 rounded-full ${colorScheme.bg} text-white flex items-center justify-center text-sm font-bold shrink-0`}>
          {(person.name || '?')[0].toUpperCase()}
        </div>

        {/* Name + item summary */}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 text-sm">{person.name || `Person ${personIdx + 1}`}</p>
          <p className="text-xs text-gray-500 mt-0.5">
            {myItemCount === 0
              ? 'Tap to assign items'
              : `${myItemCount} item${myItemCount !== 1 ? 's' : ''} · $${mySubtotal.toFixed(2)}`
            }
          </p>
        </div>

        {/* Item count badge + chevron */}
        {myItemCount > 0 && (
          <div className={`${colorScheme.light} ${colorScheme.text} text-xs font-bold px-2 py-0.5 rounded-full`}>
            {myItemCount}
          </div>
        )}
        <svg
          className={`text-gray-400 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180' : ''}`}
          width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Item list */}
      {isOpen && (
        <div className="border-t border-indigo-100">
          {items.length === 0 ? (
            <p className="text-center text-sm text-gray-400 py-6">No items to assign</p>
          ) : (
            items.map(item => (
              <ItemPickerRow
                key={item.id}
                item={item}
                people={people}
                personIdx={personIdx}
                assigned={assignments[item.id] || []}
                onToggle={onItemToggle}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default function AssignScreen({ items, people, assignments, setAssignments, onNext, onBack }) {
  // Open the first person by default so the user immediately sees they can tap items
  const [openPersonIdx, setOpenPersonIdx] = useState(0);

  const toggleAssignment = (itemId, personIdx) => {
    setAssignments(prev => {
      const current = prev[itemId] || [];
      const updated = current.includes(personIdx)
        ? current.filter(i => i !== personIdx)
        : [...current, personIdx];
      return { ...prev, [itemId]: updated };
    });
  };

  const handlePersonToggle = (idx) => {
    setOpenPersonIdx(prev => (prev === idx ? null : idx));
  };

  const unassigned = getUnassignedItems(items, assignments);
  const allAssigned = unassigned.length === 0;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header title="Assign Items" onBack={onBack} />

      <div className="flex-1 max-w-lg mx-auto w-full pb-36">
        {/* Progress bar */}
        <div className="px-4 pt-4 pb-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500">
              {items.length - unassigned.length} of {items.length} items assigned
            </span>
            {allAssigned ? (
              <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="1.5 6.5 5 10 11.5 2.5" />
                </svg>
                All assigned!
              </span>
            ) : (
              <span className="text-xs font-medium text-amber-600">{unassigned.length} left</span>
            )}
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 rounded-full transition-all duration-300"
              style={{ width: `${items.length > 0 ? ((items.length - unassigned.length) / items.length) * 100 : 0}%` }}
            />
          </div>
        </div>

        {/* Unassigned items callout */}
        {unassigned.length > 0 && (
          <div className="mx-4 mb-3 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3">
            <p className="text-xs font-semibold text-amber-800 mb-1.5">Not yet assigned to anyone:</p>
            <div className="flex flex-wrap gap-1.5">
              {unassigned.map(item => (
                <span key={item.id} className="bg-amber-100 text-amber-800 text-xs font-medium px-2 py-0.5 rounded-full">
                  {item.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Instruction hint */}
        <p className="text-xs text-gray-400 text-center mb-3 px-4">
          Tap a person to open their item picker
        </p>

        {/* Person accordions */}
        <div className="px-4 space-y-2">
          {people.map((person, idx) => (
            <PersonAccordion
              key={idx}
              person={person}
              personIdx={idx}
              isOpen={openPersonIdx === idx}
              onToggle={() => handlePersonToggle(idx)}
              items={items}
              people={people}
              assignments={assignments}
              onItemToggle={toggleAssignment}
              colorScheme={PERSON_COLORS[idx % PERSON_COLORS.length]}
            />
          ))}
        </div>
      </div>

      {/* Continue button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-4 pb-safe">
        <Button onClick={onNext} disabled={!allAssigned}>
          {allAssigned ? (
            <>
              See Summary
              <svg className="ml-2" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </>
          ) : (
            `Assign ${unassigned.length} more item${unassigned.length !== 1 ? 's' : ''} to continue`
          )}
        </Button>
      </div>
    </div>
  );
}
