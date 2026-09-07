import { CalendarDays, Activity, HeartPulse } from 'lucide-react'
import logo from '../assets/logo.png'

export default function HeroBanner() {
  return (
    <div className="relative overflow-hidden rounded-3xl hospital-hero-bg px-6 py-8 sm:px-10 sm:py-10 text-center shadow-xl shadow-cyan-900/15 border border-white/20">
      {/* Decorative ambient lights & medical grid circles */}
      <div className="pointer-events-none absolute -top-12 -left-12 w-48 h-48 rounded-full bg-cyan-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -right-12 w-60 h-60 rounded-full bg-fuchsia-400/25 blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-white/5 blur-2xl" />

      {/* Hospital Logo Container with glowing ring */}
      <div className="relative inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white shadow-lg mb-4 ring-4 ring-white/40 overflow-hidden transform hover:scale-105 transition-transform duration-300">
        <img src={logo} alt="โลโก้โรงพยาบาลคลองหาด" className="w-full h-full object-contain p-1.5" />
      </div>

      {/* Health & Wellness Header */}
      <div className="relative flex items-center justify-center gap-2 mb-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-cyan-100 text-xs font-medium ring-1 ring-white/25">
          <HeartPulse className="w-3.5 h-3.5 text-cyan-300 animate-heartbeat" />
          KHH Primary Healthcare & Happinometer
        </span>
      </div>

      <h1 className="relative text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-snug tracking-tight drop-shadow-sm">
        แบบประเมินความสุขด้วยตนเอง
        <br className="sm:hidden" /> (HAPPINOMETER)
      </h1>
      <p className="relative text-sm sm:text-base text-cyan-50/90 font-medium mt-2 max-w-xl mx-auto">
        โรงพยาบาลคลองหาด กระทรวงสาธารณสุข จังหวัดสระแก้ว
      </p>

      {/* Fiscal Year & Hospital Badge */}
      <div className="relative inline-flex flex-wrap items-center justify-center gap-2 mt-5">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 backdrop-blur-md px-4 py-1.5 text-xs sm:text-sm font-semibold text-white ring-1 ring-white/30 shadow-inner">
          <CalendarDays className="w-4 h-4 text-cyan-200" />
          ปีงบประมาณ พ.ศ. 2569
        </div>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-teal-500/30 backdrop-blur-md px-3.5 py-1.5 text-xs font-medium text-teal-100 ring-1 ring-teal-300/40">
          <Activity className="w-3.5 h-3.5 text-teal-300" />
          ระบบประเมินความสุขบุคลากรทางการแพทย์
        </div>
      </div>
    </div>
  )
}

