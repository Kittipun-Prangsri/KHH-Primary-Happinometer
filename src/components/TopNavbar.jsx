import { LayoutDashboard, ClipboardList, Stethoscope } from 'lucide-react'
import logo from '../assets/logo.png'

export default function TopNavbar({ view, onToggleView }) {
  return (
    <header className="sticky top-0 z-30 bg-white/85 backdrop-blur-md border-b border-cyan-100/70 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative shrink-0">
            <img src={logo} alt="โลโก้โรงพยาบาลคลองหาด" className="w-10 h-10 rounded-full object-contain shadow-sm ring-2 ring-cyan-500/20 bg-white" />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" title="ระบบพร้อมใช้งาน" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="text-sm font-bold text-slate-800 truncate">โรงพยาบาลคลองหาด</p>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-cyan-50 text-cyan-700 text-[10px] font-semibold border border-cyan-200/60">
                <Stethoscope className="w-3 h-3 text-cyan-600" />
                ปฐมภูมิ
              </span>
            </div>
            <p className="text-[11px] text-slate-500 truncate">กลุ่มงานบริการด้านปฐมภูมิและองค์รวม</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onToggleView}
          className="shrink-0 flex items-center gap-1.5 rounded-xl border border-cyan-200/80 bg-gradient-to-r from-cyan-50 via-teal-50 to-purple-50 px-3.5 py-2 text-xs sm:text-sm font-semibold text-cyan-800 hover:from-cyan-100 hover:to-purple-100 hover:border-cyan-300 transition-all active:scale-95 shadow-sm"
        >
          {view === 'dashboard' ? (
            <>
              <ClipboardList className="w-4 h-4 text-cyan-600" />
              <span className="hidden sm:inline">กลับหน้าแบบประเมิน</span>
              <span className="sm:hidden">แบบประเมิน</span>
            </>
          ) : (
            <>
              <LayoutDashboard className="w-4 h-4 text-purple-600" />
              <span className="hidden sm:inline">🔐 แผงควบคุม / Dashboard สำหรับผู้บริหาร</span>
              <span className="sm:hidden">🔐 Dashboard</span>
            </>
          )}
        </button>
      </div>
    </header>
  )
}

