import { AlertTriangle, Inbox } from 'lucide-react'

export default function LowestQuestionsTable({ data = [] }) {
  return (
    <div className="rounded-2xl bg-white border border-purple-100 shadow-sm p-4 sm:p-5">
      <h3 className="text-sm sm:text-base font-bold text-slate-700 mb-1 flex items-center gap-1.5">
        <AlertTriangle className="w-4 h-4 text-rose-500" />
        อันดับข้อคำถามที่ได้คะแนนน้อยที่สุด (Urgent Improvement Areas)
      </h3>
      <p className="text-xs text-slate-400 mb-3">วิเคราะห์จากผลการประเมินจริงเพื่อวางแผนเชิงนโยบายพัฒนาองค์กร</p>

      {data.length === 0 ? (
        <div className="text-center py-6 text-slate-400 text-xs flex flex-col items-center gap-2">
          <Inbox className="w-8 h-8 text-slate-300" />
          <span>ยังไม่มีข้อมูลข้อคำถามที่ได้รับการประเมินในระบบ (รอข้อมูลจริงจากผู้ใช้)</span>
        </div>
      ) : (
        <div className="space-y-2.5">
          {data.map((item) => (
            <div key={item.id} className="flex items-start gap-3 rounded-xl bg-rose-50/60 border border-rose-100 p-3">
              <span className="shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-rose-500 to-pink-600 text-white text-xs font-bold flex items-center justify-center">
                {item.rank}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-700 leading-snug">{item.text}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{item.category}</p>
              </div>
              <span className="shrink-0 text-sm font-bold text-rose-600">{item.score.toFixed(2)} / 5</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

