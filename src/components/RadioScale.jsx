export default function RadioScale({
  index,
  question,
  value,
  onChange,
  minLabel = 'น้อยที่สุด',
  maxLabel = 'มากที่สุด',
  scale = 5,
  showError = false,
}) {
  const options = Array.from({ length: scale }, (_, i) => i + 1)

  return (
    <div
      className={`rounded-2xl border bg-white/90 backdrop-blur-sm p-4 sm:p-5 transition-all duration-200 shadow-sm ${
        showError ? 'border-rose-400 ring-2 ring-rose-200 bg-rose-50/20' : 'border-slate-200/80 hover:border-cyan-200 hover:shadow-md'
      }`}
    >
      <p className="text-sm sm:text-base font-medium text-slate-800 mb-3.5 leading-relaxed">
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-cyan-100 text-cyan-800 font-bold text-xs mr-2 border border-cyan-200">
          {index}
        </span>
        {question}
      </p>
      <div className="flex items-center gap-1.5 sm:gap-2.5">
        {options.map((opt) => {
          const isActive = Number(value) === opt
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onChange(opt)}
              aria-pressed={isActive}
              className={`flex-1 h-11 sm:h-12 rounded-xl border-2 font-bold text-sm sm:text-base transition-all duration-200 active:scale-95 focus:outline-none ${
                isActive
                  ? 'bg-gradient-to-br from-cyan-500 via-teal-500 to-purple-600 border-transparent text-white shadow-md shadow-cyan-500/25 scale-[1.03]'
                  : 'scale-option-idle'
              }`}
            >
              {opt}
            </button>
          )
        })}
      </div>
      <div className="flex justify-between mt-2 text-[11px] font-medium text-slate-400 px-1">
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
      </div>
      {showError && <p className="mt-2 text-xs font-semibold text-rose-500 flex items-center gap-1">⚠️ กรุณาเลือกคำตอบข้อนี้</p>}
    </div>
  )
}

