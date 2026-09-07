import { PartyPopper, Sparkles, RotateCcw, CheckCircle2 } from 'lucide-react'
import { computeScores, getHappinessLevel, getEncouragement } from '../utils/scoring'

const BAR_COLORS = ['from-fuchsia-500 to-purple-500', 'from-purple-500 to-indigo-500', 'from-pink-500 to-fuchsia-500']

export default function ResultScreen({ answers, onRestart, submitted }) {
  const scores = computeScores(answers)
  const level = getHappinessLevel(scores.happinessScore10)
  const encouragement = getEncouragement(scores.happinessScore10)

  const breakdown = [scores.section1, scores.section2, scores.section3]

  return (
    <div className="min-h-screen px-4 py-8 sm:py-10">
      <div className="w-full max-w-lg mx-auto animate-fade-in-up">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-fuchsia-100 text-fuchsia-700 text-xs font-medium px-3.5 py-1.5 mb-4">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {submitted ? 'บันทึกคำตอบของคุณเรียบร้อยแล้ว' : 'สรุปผลแบบประเมิน'}
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-800">ขอบคุณที่สละเวลาทำแบบประเมิน 🙏</h1>
        </div>

        <div className="rounded-2xl bg-white border border-purple-100 shadow-sm p-6 text-center mb-4 animate-pop-in">
          <div className="text-7xl mb-3 flex items-center justify-center">
            {level.icon ? <i className={`bi ${level.icon}`} /> : level.emoji}
          </div>
          <p className={`text-2xl font-bold ${level.color} mb-1`}>{level.label}</p>
          <p className="text-sm text-slate-500 mb-4">
            ระดับความสุขโดยรวม{' '}
            <span className="font-semibold text-slate-700">{scores.happinessScore10}/10</span>
          </p>
          <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-fuchsia-500 to-purple-600 transition-all duration-700"
              style={{ width: `${(scores.happinessScore10 / 10) * 100}%` }}
            />
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-fuchsia-600 via-purple-600 to-indigo-700 text-white p-5 mb-4 shadow-md shadow-purple-300/50">
          <div className="flex items-start gap-2.5">
            <Sparkles className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-sm leading-relaxed">{encouragement}</p>
          </div>
        </div>

        <div className="rounded-2xl bg-white border border-purple-100 shadow-sm p-5 mb-4">
          <h2 className="text-sm font-semibold text-slate-700 mb-4">คะแนนเฉลี่ยแยกตามหมวด</h2>
          <div className="space-y-4">
            {breakdown.map((item, i) => (
              <div key={item.label}>
                <div className="flex justify-between text-xs sm:text-sm mb-1.5">
                  <span className="font-medium text-slate-600">{item.label}</span>
                  <span className="font-semibold text-slate-700">
                    {item.score.toFixed(2)} / 5 · {item.percent}%
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${BAR_COLORS[i % BAR_COLORS.length]} transition-all duration-700`}
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-pink-50 border border-pink-200 p-4 text-center text-xs text-pink-700 mb-6 flex items-center justify-center gap-2">
          <PartyPopper className="w-4 h-4" />
          คำตอบของท่านเป็นความลับและไม่ระบุตัวตน ขอบคุณที่ร่วมเป็นส่วนหนึ่งในการพัฒนาองค์กรของเรา
        </div>

        <button
          type="button"
          onClick={onRestart}
          className="w-full flex items-center justify-center gap-2 rounded-xl py-3.5 font-semibold text-sm border-2 border-purple-200 text-purple-600 hover:bg-purple-50 transition-colors active:scale-[0.98]"
        >
          <RotateCcw className="w-4 h-4" />
          ทำแบบประเมินอีกครั้ง
        </button>
      </div>
    </div>
  )
}
