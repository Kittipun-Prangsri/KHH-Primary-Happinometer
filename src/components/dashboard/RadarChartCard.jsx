import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts'

export default function RadarChartCard({ data }) {
  return (
    <div className="rounded-2xl bg-white border border-purple-100 shadow-sm p-4 sm:p-5">
      <h3 className="text-sm sm:text-base font-bold text-slate-700 mb-1">คะแนนเฉลี่ยราย 3 มิติหลัก</h3>
      <p className="text-xs text-slate-400 mb-2">คะแนนเต็ม 5 ต่อหมวด</p>
      <div className="h-64 sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data} outerRadius="70%">
            <defs>
              <linearGradient id="radarFill" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#e879f9" stopOpacity={0.65} />
                <stop offset="100%" stopColor="#9333ea" stopOpacity={0.35} />
              </linearGradient>
            </defs>
            <PolarGrid stroke="#f3e8ff" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b21a8', fontSize: 11 }} />
            <PolarRadiusAxis angle={30} domain={[0, 5]} tick={{ fill: '#c4b5fd', fontSize: 10 }} />
            <Radar name="คะแนนเฉลี่ย" dataKey="score" stroke="#c026d3" strokeWidth={2} fill="url(#radarFill)" />
            <Tooltip
              formatter={(v) => [`${v} / 5`, 'คะแนนเฉลี่ย']}
              contentStyle={{ borderRadius: 12, border: '1px solid #f3e8ff', fontSize: 12 }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
