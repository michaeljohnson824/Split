export default function Header({ title, onBack, rightAction }) {
  return (
    <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
      <div className="w-10">
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center justify-center w-9 h-9 -ml-1 rounded-full text-gray-600 active:bg-gray-100 transition-colors"
            aria-label="Go back"
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12.5 5l-7 7 7 7" />
            </svg>
          </button>
        )}
      </div>

      <h1 className="text-base font-semibold text-gray-900 tracking-tight">{title}</h1>

      <div className="w-10 flex justify-end">
        {rightAction}
      </div>
    </div>
  );
}
