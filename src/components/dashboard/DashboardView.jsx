import { Users, Smile, TrendingUp, TrendingDown } from 'lucide-react'
import KPICard from './KPICard'
import RadarChartCard from './RadarChartCard'
import PersonnelBarChart from './PersonnelBarChart'
import LowestQuestionsTable from './LowestQuestionsTable'
import { MOCK_KPI, MOCK_RADAR_DATA, MOCK_PERSONNEL_HAPPINESS, MOCK_LOWEST_QUESTIONS } from '../../data/mockDashboard'

export default function DashboardView() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <div className="rounded-3xl bg-gradient-to-br from-fuchsia-600 via-purple-600 to-indigo-700 px-6 py-6 sm:px-8 sm:py-7 shadow-lg shadow-purple-300/50">
        <h1 className="text-lg sm:text-2xl font-bold text-white">แผงควบคุมผู้บริหาร (Dashboard)</h1>
        <p className="text-sm text-fuchsia-50/90 mt-1">
          สรุปผลแบบประเมินความสุขบุคลากร กลุ่มงานบริการด้านปฐมภูมิและองค์รวม · ปีงบประมาณ พ.ศ. 2569
          <span className="ml-1 opacity-75">(ข้อมูลตัวอย่าง / Mock Data)</span>
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <KPICard icon={Users} label="จำนวนผู้ตอบแบบสอบถามทั้งหมด" value={MOCK_KPI.totalResponses} unit="คน" accent="purple" />
        <KPICard icon={Smile} label="คะแนนความสุขเฉลี่ยภาพรวม" value={MOCK_KPI.overallHappiness10} unit="/ 10" accent="rose" />
        <KPICard icon={TrendingUp} label={`หมวดที่ได้คะแนนสูงสุด: ${MOCK_KPI.strengthArea.label}`} value={MOCK_KPI.strengthArea.score} unit="/ 5" accent="emerald" />
        <KPICard icon={TrendingDown} label={`หมวดที่ต้องพัฒนาเร่งด่วน: ${MOCK_KPI.painPointArea.label}`} value={MOCK_KPI.painPointArea.score} unit="/ 5" accent="rose" />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <RadarChartCard data={MOCK_RADAR_DATA} />
        <PersonnelBarChart data={MOCK_PERSONNEL_HAPPINESS} />
      </div>

      <LowestQuestionsTable data={MOCK_LOWEST_QUESTIONS} />
    </div>
  )
}
