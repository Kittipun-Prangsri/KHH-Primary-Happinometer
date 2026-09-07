export default function KPICard({ icon: Icon, label, value, unit, accent = 'purple' }) {
  const accentStyles = {
    purple: 'from-fuchsia-500 to-purple-600',
    emerald: 'from-emerald-500 to-teal-600',
    rose: 'from-rose-500 to-pink-600',
  }[accent]

  return (
    <div className="rounded-2xl bg-white border border-purple-100 shadow-sm p-4 sm:p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${accentStyles} flex items-center justify-center shrink-0`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <p className="text-xs sm:text-sm text-slate-500 leading-tight">{label}</p>
      </div>
      <p className="text-2xl sm:text-3xl font-bold text-slate-800">
        {value}
        {unit && <span className="text-sm font-medium text-slate-400 ml-1">{unit}</span>}
      </p>
    </div>
  )
}
