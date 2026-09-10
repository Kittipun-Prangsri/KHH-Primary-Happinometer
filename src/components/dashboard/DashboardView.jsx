import { useEffect, useState } from 'react'
import { Users, Smile, TrendingUp, TrendingDown, Radio, Database } from 'lucide-react'
import KPICard from './KPICard'
import RadarChartCard from './RadarChartCard'
import PersonnelBarChart from './PersonnelBarChart'
import LowestQuestionsTable from './LowestQuestionsTable'
import { supabase } from '../../supabase'
import { computeDashboardStats } from '../../utils/dashboardAggregator'

export default function DashboardView() {
  const [stats, setStats] = useState(() => computeDashboardStats([]))

  useEffect(() => {
    let isMounted = true

    const loadAndCompute = async () => {
      const { data, error } = await supabase.from('happinometer_responses').select('department, personnel_type, answers')
      if (error) {
        console.error('[DashboardView] Supabase fetch error:', error)
        return
      }
      if (!isMounted) return
      const docs = data.map((row) => ({
        department: row.department,
        personnelType: row.personnel_type,
        answers: row.answers,
      }))
      setStats(computeDashboardStats(docs))
    }

    loadAndCompute()

    const channel = supabase
      .channel('happinometer_responses_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'happinometer_responses' }, loadAndCompute)
      .subscribe()

    return () => {
      isMounted = false
      supabase.removeChannel(channel)
    }
  }, [])

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <div className="rounded-3xl bg-gradient-to-br from-fuchsia-600 via-purple-600 to-indigo-700 px-6 py-6 sm:px-8 sm:py-7 shadow-lg shadow-purple-300/50 relative overflow-hidden">
        <h1 className="text-lg sm:text-2xl font-bold text-white flex items-center justify-between flex-wrap gap-2">
          <span>แผงควบคุมผู้บริหาร (Dashboard)</span>
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-500/25 text-emerald-100 border border-emerald-300/40 text-xs font-semibold backdrop-blur-md shadow-inner">
            <Database className="w-3.5 h-3.5 text-emerald-300" />
            <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
            100% Real-time Supabase ({stats.totalResponses} ตอบแล้ว)
          </span>
        </h1>
        <p className="text-sm text-fuchsia-50/90 mt-1">
          สรุปผลแบบประเมินความสุขบุคลากร โรงพยาบาลคลองหาด · กระทรวงสาธารณสุข จังหวัดสระแก้ว · ปีงบประมาณ พ.ศ. 2569
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <KPICard icon={Users} label="จำนวนผู้ตอบแบบสอบถามทั้งหมด" value={stats.totalResponses} unit="คน" accent="purple" />
        <KPICard icon={Smile} label="คะแนนความสุขเฉลี่ยภาพรวม" value={stats.overallHappiness10} unit="/ 10" accent="rose" />
        <KPICard icon={TrendingUp} label={`หมวดที่ได้คะแนนสูงสุด: ${stats.strengthArea.label}`} value={stats.strengthArea.score} unit="/ 5" accent="emerald" />
        <KPICard icon={TrendingDown} label={`หมวดที่ต้องพัฒนาเร่งด่วน: ${stats.painPointArea.label}`} value={stats.painPointArea.score} unit="/ 5" accent="rose" />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <RadarChartCard data={stats.radarData} />
        <PersonnelBarChart data={stats.personnelHappiness} />
      </div>

      <LowestQuestionsTable data={stats.lowestQuestions} />
    </div>
  )
}
