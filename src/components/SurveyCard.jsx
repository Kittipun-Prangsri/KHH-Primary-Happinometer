export default function SurveyCard({ icon, title, subtitle, children }) {
  return (
    <div className="glass-card rounded-2xl border border-cyan-100/70 shadow-md shadow-slate-200/50 overflow-hidden">
      <div className="px-5 py-4 sm:px-6 bg-gradient-to-r from-cyan-50/90 via-teal-50/80 to-purple-50/90 border-b border-cyan-100/80">
        <h2 className="text-base sm:text-lg font-bold text-slate-800 flex items-center gap-2">
          {icon && <span className="text-xl">{icon}</span>}
          {title}
        </h2>
        {subtitle && <p className="text-xs sm:text-sm text-cyan-800/80 mt-0.5 font-medium">{subtitle}</p>}
      </div>
      <div className="p-5 sm:p-6 space-y-4">{children}</div>
    </div>
  )
}

