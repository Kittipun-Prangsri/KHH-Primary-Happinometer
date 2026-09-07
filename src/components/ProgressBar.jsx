export default function ProgressBar({ answeredCount, totalCount }) {
  const percent = totalCount ? Math.round((answeredCount / totalCount) * 100) : 0

  return (
    <div className="glass-card rounded-2xl px-4 py-3.5 sm:px-6 shadow-sm border border-cyan-100/70">
      <div className="flex items-center justify-between text-xs sm:text-sm mb-2 font-medium">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500" />
          </span>
          <span className="text-slate-700">
            ความคืบหน้า: ตอบแล้ว <span className="text-cyan-600 font-bold">{answeredCount}</span> / {totalCount} ข้อ
          </span>
        </div>
        <span className="font-bold text-purple-700 bg-purple-50/80 px-2.5 py-0.5 rounded-full border border-purple-100/80">{percent}%</span>
      </div>
      <div className="h-3 w-full rounded-full bg-slate-100/90 p-0.5 overflow-hidden border border-slate-200/60 shadow-inner">
        <div
          className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-teal-500 to-purple-600 shadow-sm transition-all duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}

