import { Code2, GraduationCap, Hospital } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-cyan-100/70 bg-white/75 backdrop-blur-md py-8 text-center text-xs text-slate-500">
      <div className="max-w-6xl mx-auto px-4 space-y-3">
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-slate-600 font-medium">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-cyan-50 text-cyan-800 border border-cyan-200/60 shadow-2xs">
            <Code2 className="w-3.5 h-3.5 text-cyan-600" />
            พัฒนาโดย นายกิตติพันธ์ ปรางศรี นักวิชาการคอมพิวเตอร์
          </span>
          <span className="hidden sm:inline text-slate-300">•</span>
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-purple-50 text-purple-800 border border-purple-200/60 shadow-2xs">
            <Hospital className="w-3.5 h-3.5 text-purple-600" />
            โรงพยาบาลคลองหาด
          </span>
        </div>

        <p className="flex items-center justify-center gap-1.5 text-slate-500 text-[11px] sm:text-xs">
          <GraduationCap className="w-4 h-4 text-teal-600 shrink-0" />
          <span>
            แบบประเมิน HAPPINOMETER อ้างอิงจาก <strong className="font-semibold text-slate-700">สถาบันวิจัยประชากรและสังคม มหาวิทยาลัยมหิดล</strong>
          </span>
        </p>

        <p className="text-[10px] text-slate-400">
          © {new Date().getFullYear()} KHH Primary Happinometer · กลุ่มงานบริการด้านปฐมภูมิและองค์รวม โรงพยาบาลคลองหาด
        </p>
      </div>
    </footer>
  )
}
