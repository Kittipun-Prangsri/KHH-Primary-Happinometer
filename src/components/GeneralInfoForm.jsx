import { ChevronDown, ListChecks } from 'lucide-react'
import InfoAlert from './InfoAlert'
import { DEPARTMENTS, PERSONNEL_TYPES } from '../data/questions'

const SCALE_LEGEND = [
  { value: 1, label: 'น้อยที่สุด / ไม่มีเลย' },
  { value: 2, label: 'น้อย' },
  { value: 3, label: 'ปานกลาง' },
  { value: 4, label: 'มาก' },
  { value: 5, label: 'มากที่สุด' },
]

export default function GeneralInfoForm({ department, personnelType, onDepartmentChange, onPersonnelChange, showError = [] }) {
  return (
    <div className="space-y-4">
      <InfoAlert>
        แบบประเมินนี้เป็นความลับและ<span className="font-semibold">ไม่ระบุตัวตนของท่าน</span> ผลการประเมินจะใช้เพื่อพัฒนาคุณภาพชีวิตการทำงานของบุคลากรเท่านั้น
      </InfoAlert>

      <div>
        <label className="block text-sm font-medium text-slate-600 mb-1.5">กลุ่มงาน/งานย่อย</label>
        <div className="relative">
          <select
            value={department}
            onChange={(e) => onDepartmentChange(e.target.value)}
            className={`w-full appearance-none rounded-xl border-2 bg-slate-50 px-4 py-3 pr-10 text-sm text-slate-700 focus:bg-white focus:outline-none focus:ring-4 focus:ring-pink-100 transition-colors ${
              showError.includes('department') ? 'border-rose-300' : 'border-slate-200 focus:border-purple-400'
            }`}
          >
            <option value="">-- เลือกกลุ่มงาน/งานย่อย --</option>
            {DEPARTMENTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
        {showError.includes('department') && <p className="mt-1.5 text-xs text-rose-500">กรุณาเลือกกลุ่มงาน/งานย่อย</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-600 mb-1.5">กลุ่มบุคลากร</label>
        <div className="relative">
          <select
            value={personnelType}
            onChange={(e) => onPersonnelChange(e.target.value)}
            className={`w-full appearance-none rounded-xl border-2 bg-slate-50 px-4 py-3 pr-10 text-sm text-slate-700 focus:bg-white focus:outline-none focus:ring-4 focus:ring-pink-100 transition-colors ${
              showError.includes('personnelType') ? 'border-rose-300' : 'border-slate-200 focus:border-purple-400'
            }`}
          >
            <option value="">-- เลือกกลุ่มบุคลากร --</option>
            {PERSONNEL_TYPES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
        {showError.includes('personnelType') && <p className="mt-1.5 text-xs text-rose-500">กรุณาเลือกกลุ่มบุคลากร</p>}
      </div>

      <div className="rounded-xl border border-purple-100 bg-purple-50/60 p-4">
        <p className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-purple-700 mb-2.5">
          <ListChecks className="w-4 h-4" />
          คำชี้แจงเกณฑ์การให้คะแนน (ข้อ 1-31)
        </p>
        <div className="grid grid-cols-5 gap-1.5">
          {SCALE_LEGEND.map((item) => (
            <div key={item.value} className="text-center">
              <div className="mx-auto mb-1 w-6 h-6 rounded-full bg-gradient-to-br from-fuchsia-500 to-purple-600 text-white text-[11px] font-bold flex items-center justify-center">
                {item.value}
              </div>
              <p className="text-[10px] leading-tight text-purple-700/80">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
