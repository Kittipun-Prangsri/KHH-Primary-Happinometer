import { useEffect, useState } from 'react'
import { Users, Smile, TrendingUp, TrendingDown, Radio } from 'lucide-react'
import KPICard from './KPICard'
import RadarChartCard from './RadarChartCard'
import PersonnelBarChart from './PersonnelBarChart'
import LowestQuestionsTable from './LowestQuestionsTable'
import { MOCK_KPI, MOCK_RADAR_DATA, MOCK_PERSONNEL_HAPPINESS, MOCK_LOWEST_QUESTIONS } from '../../data/mockDashboard'
import { db } from '../../firebase'
import { collection, onSnapshot } from 'firebase/firestore'
import { computeScores } from '../../utils/scoring'

export default function DashboardView() {
  const [liveData, setLiveData] = useState({
    totalResponses: 0,
    overallHappiness10: 0,
    isLive: false,
  })

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'happinometer_responses'), (snapshot) => {
      if (!snapshot.empty) {
        const docs = snapshot.docs.map((doc) => doc.data())
        const total = docs.length
        const totalH10 = docs.reduce((acc, curr) => acc + (Number(curr.answers?.q32) || 0), 0)
        const avgH10 = Number((totalH10 / total).toFixed(2))

        setLiveData({
          totalResponses: total,
          overallHappiness10: avgH10,
          isLive: true,
        })
      }
    }, (error) => {
      console.warn('[DashboardView] Firestore snapshot listener warning:', error)
    })

    return () => unsubscribe()
  }, [])

  const kpiTotal = liveData.isLive ? liveData.totalResponses : MOCK_KPI.totalResponses
  const kpiOverall = liveData.isLive ? liveData.overallHappiness10 : MOCK_KPI.overallHappiness10

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <div className="rounded-3xl bg-gradient-to-br from-fuchsia-600 via-purple-600 to-indigo-700 px-6 py-6 sm:px-8 sm:py-7 shadow-lg shadow-purple-300/50 relative overflow-hidden">
        <h1 className="text-lg sm:text-2xl font-bold text-white flex items-center gap-2">
          แผงควบคุมผู้บริหาร (Dashboard)
          {liveData.isLive && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 text-xs font-medium backdrop-blur-md">
              <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              Live Firebase Data ({liveData.totalResponses} ตอบแล้ว)
            </span>
          )}
        </h1>
        <p className="text-sm text-fuchsia-50/90 mt-1">
          สรุปผลแบบประเมินความสุขบุคลากร โรงพยาบาลคลองหาด · กระทรวงสาธารณสุข จังหวัดสระแก้ว · ปีงบประมาณ พ.ศ. 2569
          {!liveData.isLive && <span className="ml-1 opacity-75">(ข้อมูลตัวอย่าง / Mock Data)</span>}
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <KPICard icon={Users} label="จำนวนผู้ตอบแบบสอบถามทั้งหมด" value={kpiTotal} unit="คน" accent="purple" />
        <KPICard icon={Smile} label="คะแนนความสุขเฉลี่ยภาพรวม" value={kpiOverall} unit="/ 10" accent="rose" />
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

