import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from 'recharts'

const BAR_COLORS = ['#c026d3', '#a21caf', '#9333ea', '#7e22ce']

export default function PersonnelBarChart({ data }) {
  return (
    <div className="rounded-2xl bg-white border border-purple-100 shadow-sm p-4 sm:p-5">
      <h3 className="text-sm sm:text-base font-bold text-slate-700 mb-1">คะแนนความสุขเฉลี่ยแยกตามประเภทบุคลากร</h3>
      <p className="text-xs text-slate-400 mb-2">คะแนนเต็ม 10</p>
      <div className="h-64 sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3e8ff" vertical={false} />
            <XAxis dataKey="type" tick={{ fill: '#6b7280', fontSize: 11 }} />
            <YAxis domain={[0, 10]} tick={{ fill: '#6b7280', fontSize: 11 }} />
            <Tooltip
              formatter={(v) => [`${v} / 10`, 'คะแนนเฉลี่ย']}
              contentStyle={{ borderRadius: 12, border: '1px solid #f3e8ff', fontSize: 12 }}
              cursor={{ fill: '#fdf4ff' }}
            />
            <Bar dataKey="score" radius={[8, 8, 0, 0]}>
              {data.map((entry, i) => (
                <Cell key={entry.type} fill={BAR_COLORS[i % BAR_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
