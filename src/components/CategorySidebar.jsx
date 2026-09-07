import { ClipboardList, Briefcase, HeartHandshake, Scale, Smile, CheckCircle2 } from 'lucide-react'
import { CATEGORIES } from '../data/questions'

const ICONS = {
  general: ClipboardList,
  section1: Briefcase,
  section2: HeartHandshake,
  section3: Scale,
  section4: Smile,
}

export default function CategorySidebar({ activeKey, completedKeys, onSelect }) {
  return (
    <>
      {/* Desktop vertical sidebar */}
      <nav className="hidden md:block rounded-2xl glass-card p-3 space-y-1.5 shadow-sm border border-cyan-100/60 sticky top-20">
        <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
          <span>หัวข้อแบบประเมิน</span>
          <span className="text-cyan-600 font-semibold">{completedKeys.length}/{CATEGORIES.length}</span>
        </div>
        {CATEGORIES.map((cat) => {
          const Icon = ICONS[cat.key]
          const isActive = cat.key === activeKey
          const isDone = completedKeys.includes(cat.key)
          return (
            <button
              key={cat.key}
              type="button"
              onClick={() => onSelect(cat.key)}
              className={`w-full flex items-center gap-3 rounded-xl px-3.5 py-3 text-left text-sm transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-50/90 via-teal-50/80 to-purple-50/90 text-cyan-900 font-semibold ring-1 ring-cyan-300/80 shadow-sm translate-x-0.5'
                  : 'text-slate-600 hover:bg-slate-50/90 hover:text-cyan-700'
              }`}
            >
              <span
                className={`shrink-0 flex items-center justify-center w-8 h-8 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-gradient-to-br from-cyan-500 to-purple-600 text-white shadow-sm shadow-cyan-500/20'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                <Icon className="w-4 h-4" />
              </span>
              <span className="flex-1 leading-snug">{cat.label}</span>
              {isDone && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />}
            </button>
          )
        })}
      </nav>

      {/* Mobile horizontal tabs */}
      <nav className="md:hidden -mx-4 px-4 flex gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden">
        {CATEGORIES.map((cat) => {
          const Icon = ICONS[cat.key]
          const isActive = cat.key === activeKey
          const isDone = completedKeys.includes(cat.key)
          return (
            <button
              key={cat.key}
              type="button"
              onClick={() => onSelect(cat.key)}
              className={`shrink-0 flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500 to-purple-600 border-transparent text-white shadow-md shadow-cyan-500/20 scale-[1.02]'
                  : 'bg-white/90 border-slate-200 text-slate-600 hover:border-cyan-200'
              }`}
            >
              {isDone ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" /> : <Icon className="w-3.5 h-3.5" />}
              {cat.short}
            </button>
          )
        })}
      </nav>
    </>
  )
}

