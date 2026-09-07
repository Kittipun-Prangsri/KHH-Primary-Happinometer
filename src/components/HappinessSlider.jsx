export const BOOTSTRAP_EMOJI_ICONS = [
  { icon: 'bi-emoji-tear-fill', color: 'text-rose-500', name: 'น้อยที่สุด' },
  { icon: 'bi-emoji-frown-fill', color: 'text-orange-500', name: 'น้อยมาก' },
  { icon: 'bi-emoji-grimace-fill', color: 'text-amber-500', name: 'ค่อนข้างน้อย' },
  { icon: 'bi-emoji-expressionless-fill', color: 'text-yellow-500', name: 'ปานกลางค่อนต่ำ' },
  { icon: 'bi-emoji-neutral-fill', color: 'text-cyan-500', name: 'ปานกลาง' },
  { icon: 'bi-emoji-smile-fill', color: 'text-teal-500', name: 'ปานกลางค่อนสูง' },
  { icon: 'bi-emoji-laughing-fill', color: 'text-emerald-500', name: 'ค่อนข้างมาก' },
  { icon: 'bi-emoji-grin-fill', color: 'text-blue-500', name: 'มาก' },
  { icon: 'bi-emoji-wink-fill', color: 'text-indigo-500', name: 'มากอย่างยิ่ง' },
  { icon: 'bi-emoji-heart-eyes-fill', color: 'text-fuchsia-500', name: 'มีความสุขที่สุด' },
]

export default function HappinessSlider({ value, onChange, showError = false }) {
  const current = value ? Number(value) : null

  return (
    <div
      className={`rounded-2xl border bg-white/90 backdrop-blur-sm p-5 sm:p-7 transition-all duration-200 shadow-sm ${
        showError ? 'border-rose-400 ring-2 ring-rose-200 bg-rose-50/20' : 'border-cyan-100'
      }`}
    >
      <div className="text-center mb-5">
        <div className="inline-flex items-center justify-center w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white shadow-xl ring-4 ring-cyan-100/80 mb-2 transform hover:scale-105 transition-transform duration-300">
          {current ? (
            <i key={current} className={`bi ${BOOTSTRAP_EMOJI_ICONS[current - 1].icon} ${BOOTSTRAP_EMOJI_ICONS[current - 1].color} text-6xl sm:text-7xl animate-pop-in`} />
          ) : (
            <i className="bi bi-emoji-smile text-slate-300 text-6xl sm:text-7xl" />
          )}
        </div>
        <p className="text-sm font-semibold text-slate-700 mt-2">
          {current ? (
            <span className="inline-flex flex-wrap items-center justify-center gap-1.5 px-3.5 py-1 rounded-full bg-cyan-50 text-cyan-900 border border-cyan-200 shadow-2xs">
              ระดับความสุขของคุณ: <strong className="text-cyan-600 text-base">{current}</strong> / 10
              <span className="text-xs font-normal text-slate-500">({BOOTSTRAP_EMOJI_ICONS[current - 1].name})</span>
            </span>
          ) : (
            <span className="text-slate-500 font-normal">แตะตัวเลข 1-10 ด้านล่างเพื่อบอกระดับความสุขของคุณในขณะนี้</span>
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

      <div className="flex justify-between mt-4 text-[11px] font-medium text-slate-400 px-1">
        <span className="flex items-center gap-1">
          <i className="bi bi-emoji-tear-fill text-rose-500 text-sm" /> 1 = ไม่มีความสุขเลย
        </span>
        <span className="flex items-center gap-1">
          <i className="bi bi-emoji-heart-eyes-fill text-fuchsia-500 text-sm" /> 10 = มีความสุขที่สุด
        </span>
      </div>
      {showError && <p className="mt-3 text-center text-xs font-semibold text-rose-500">⚠️ กรุณาเลือกระดับความสุขของคุณ</p>}
    </div>
  )
}


