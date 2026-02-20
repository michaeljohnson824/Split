import { useState, useRef, useEffect } from 'react'
import Header from '../components/Header'
import Button from '../components/Button'

const SUGGESTED_NAMES = ['Alice', 'Bob', 'Charlie', 'David', 'Emma', 'Frank', 'Grace', 'Hannah'];

function PersonRow({ name, index, onUpdate, onRemove, inputRef }) {
  return (
    <div className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3 border border-gray-100 shadow-sm">
      <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
        <span className="text-sm font-bold text-indigo-700">
          {name ? name[0].toUpperCase() : (index + 1)}
        </span>
      </div>
      <input
        ref={inputRef}
        type="text"
        value={name}
        onChange={e => onUpdate(index, e.target.value)}
        placeholder={`Person ${index + 1}`}
        className="flex-1 text-sm text-gray-900 font-medium bg-transparent border-0 outline-none placeholder-gray-400"
        autoCapitalize="words"
        autoCorrect="off"
      />
      <button
        onClick={() => onRemove(index)}
        className="w-7 h-7 flex items-center justify-center text-gray-300 active:text-red-400 transition-colors"
      >
        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
}

export default function PeopleScreen({ people, setPeople, onNext, onBack }) {
  const lastInputRef = useRef(null);
  const [justAdded, setJustAdded] = useState(false);

  const addPerson = (name = '') => {
    setPeople(prev => [...prev, name]);
    setJustAdded(true);
  };

  const updatePerson = (index, name) => {
    setPeople(prev => {
      const next = [...prev];
      next[index] = name;
      return next;
    });
  };

  const removePerson = (index) => {
    setPeople(prev => prev.filter((_, i) => i !== index));
  };

  // Focus last input when a person is added
  useEffect(() => {
    if (justAdded && lastInputRef.current) {
      lastInputRef.current.focus();
      setJustAdded(false);
    }
  }, [people.length, justAdded]);

  const validPeople = people.filter(p => p.trim());
  const canProceed = validPeople.length >= 2;

  // Filter suggestions to exclude already-added names
  const availableSuggestions = SUGGESTED_NAMES.filter(
    name => !people.some(p => p.toLowerCase() === name.toLowerCase())
  ).slice(0, 4);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header title="Who's Splitting?" onBack={onBack} />

      <div className="flex-1 px-4 py-4 space-y-4 max-w-lg mx-auto w-full pb-36">
        {/* Subtitle */}
        <p className="text-sm text-gray-500 text-center">
          Enter the names of everyone splitting this bill
        </p>

        {/* People list */}
        <div className="space-y-2">
          {people.map((name, idx) => (
            <PersonRow
              key={idx}
              name={name}
              index={idx}
              onUpdate={updatePerson}
              onRemove={removePerson}
              inputRef={idx === people.length - 1 ? lastInputRef : null}
            />
          ))}
        </div>

        {/* Add person button */}
        <button
          onClick={() => addPerson()}
          className="w-full py-3.5 flex items-center justify-center gap-2 text-indigo-600 text-sm font-medium border-2 border-dashed border-indigo-200 rounded-2xl active:bg-indigo-50 transition-colors"
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Person
        </button>

        {/* Quick add suggestions */}
        {availableSuggestions.length > 0 && people.length < 8 && (
          <div>
            <p className="text-xs text-gray-400 mb-2 font-medium">Quick add:</p>
            <div className="flex flex-wrap gap-2">
              {availableSuggestions.map(name => (
                <button
                  key={name}
                  onClick={() => addPerson(name)}
                  className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-sm text-gray-700 font-medium active:bg-gray-50 active:scale-95 transition-all shadow-sm"
                >
                  + {name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Info tip */}
        {people.length === 0 && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg width="28" height="28" fill="none" stroke="#9ca3af" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 00-3-3.87" />
                <path d="M16 3.13a4 4 0 010 7.75" />
              </svg>
            </div>
            <p className="text-gray-500 font-medium">Add at least 2 people</p>
            <p className="text-gray-400 text-sm mt-1">to split the bill</p>
          </div>
        )}

        {validPeople.length === 1 && (
          <p className="text-center text-xs text-amber-600">
            Add at least one more person to continue
          </p>
        )}
      </div>

      {/* Next button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-4 pb-safe">
        <Button onClick={onNext} disabled={!canProceed}>
          Continue — Assign Items
          <svg className="ml-2" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Button>
      </div>
    </div>
  );
}
