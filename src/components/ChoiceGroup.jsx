export default function ChoiceGroup({ index, question, options, value, onChange, showError = false }) {
  return (
    <div
      className={`rounded-2xl border bg-white p-4 sm:p-5 transition-colors ${
        showError ? 'border-rose-300 ring-1 ring-rose-200' : 'border-purple-100'
      }`}
    >
      <p className="text-sm sm:text-base font-medium text-slate-700 mb-3 leading-relaxed">
        <span className="text-purple-600 font-semibold mr-1.5">{index}.</span>
        {question}
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {options.map((opt) => {
          const isActive = value === opt
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onChange(opt)}
              aria-pressed={isActive}
              className={`h-11 rounded-xl border-2 text-xs sm:text-sm font-medium px-2 transition-all active:scale-95 focus:outline-none focus:ring-4 focus:ring-pink-200 ${
                isActive
                  ? 'bg-gradient-to-br from-fuchsia-500 to-purple-600 border-transparent text-white shadow-md shadow-purple-200'
                  : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-purple-300 hover:text-purple-600'
              }`}
            >
              {opt}
            </button>
          )
        })}
      </div>
      {showError && <p className="mt-2 text-xs text-rose-500">กรุณาเลือกคำตอบข้อนี้</p>}
    </div>
  )
}
