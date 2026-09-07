import { HAPPINESS_EMOJIS } from '../data/questions'

export default function HappinessSlider({ value, onChange, showError = false }) {
  const current = value ? Number(value) : null

  return (
    <div
      className={`rounded-2xl border bg-white/90 backdrop-blur-sm p-5 sm:p-7 transition-all duration-200 shadow-sm ${
        showError ? 'border-rose-400 ring-2 ring-rose-200 bg-rose-50/20' : 'border-cyan-100'
      }`}
    >
      <div className="text-center mb-4">
        <span className="inline-block text-6xl sm:text-7xl transform hover:scale-110 transition-transform duration-300 drop-shadow-md">
          {current ? HAPPINESS_EMOJIS[current - 1] : '🤔'}
        </span>
        <p className="text-sm font-semibold text-slate-700 mt-2">
          {current ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 text-cyan-800 border border-cyan-200 shadow-xs">
              ระดับความสุขของคุณ: <strong className="text-cyan-600 text-base">{current}</strong> / 10
            </span>
          ) : (
            <span className="text-slate-500 font-normal">แตะตัวเลข 1-10 เพื่อบอกระดับความสุขของคุณในขณะนี้</span>
          )}
        </p>
      </div>

      <div className="grid grid-cols-5 gap-2 sm:gap-3">
        {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => {
          const isActive = current === num
          return (
            <button
              key={num}
              type="button"
              onClick={() => onChange(num)}
              aria-pressed={isActive}
              className={`h-12 sm:h-14 rounded-xl border-2 font-bold text-base transition-all duration-200 active:scale-95 focus:outline-none ${
                isActive
                  ? 'bg-gradient-to-br from-cyan-500 via-teal-500 to-purple-600 border-transparent text-white shadow-lg shadow-cyan-500/30 scale-105 ring-2 ring-cyan-200'
                  : 'scale-option-idle'
              }`}
            >
              {num}
            </button>
          )
        })}
      </div>

      <div className="flex justify-between mt-3 text-[11px] font-medium text-slate-400 px-1">
        <span>1 = ไม่มีความสุขเลย 😞</span>
        <span>10 = มีความสุขที่สุด 🥳</span>
      </div>
      {showError && <p className="mt-3 text-center text-xs font-semibold text-rose-500">⚠️ กรุณาเลือกระดับความสุขของคุณ</p>}
    </div>
  )
}

