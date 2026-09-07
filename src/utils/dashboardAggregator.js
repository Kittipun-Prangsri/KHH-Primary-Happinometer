import { SECTION1_QUESTIONS, SECTION2_QUESTIONS, PERSONNEL_TYPES } from '../data/questions'

const ALL_SCALE_QUESTIONS = [
  ...SECTION1_QUESTIONS.map((q) => ({ ...q, category: 'การงานดี' })),
  ...SECTION2_QUESTIONS.map((q) => ({ ...q, category: 'ความผูกพันองค์กร' })),
  { id: 'q30', text: 'ท่านมีความยืดหยุ่นในการทำงาน (เช่น ปรับเวลา/สลับเวร) มากน้อยเพียงใด', category: 'สมดุลชีวิตกับการทำงาน' },
  { id: 'q31', text: 'ท่านได้ทำงานตรงตามวุฒิการศึกษา/ความเชี่ยวชาญของท่านมากน้อยเพียงใด', category: 'สมดุลชีวิตกับการทำงาน' },
]

export function computeFirestoreDashboardStats(docs) {
  if (!docs || docs.length === 0) {
    return {
      totalResponses: 0,
      overallHappiness10: 0,
      strengthArea: { label: 'ยังไม่มีข้อมูล', score: 0 },
      painPointArea: { label: 'ยังไม่มีข้อมูล', score: 0 },
      radarData: [
        { subject: 'การงานดี', score: 0, fullMark: 5 },
        { subject: 'ความผูกพันองค์กร', score: 0, fullMark: 5 },
        { subject: 'สมดุลชีวิตกับการทำงาน', score: 0, fullMark: 5 },
      ],
      personnelHappiness: PERSONNEL_TYPES.map((type) => ({ type, score: 0 })),
      lowestQuestions: [],
      hasData: false,
    }
  }

  const totalResponses = docs.length

  // 1. Overall Happiness (Q32 out of 10)
  const q32Sum = docs.reduce((sum, doc) => sum + (Number(doc.answers?.q32) || 0), 0)
  const overallHappiness10 = Number((q32Sum / totalResponses).toFixed(2))

  // 2. Section Averages out of 5
  const getQuestionAvg = (qid) => {
    let sum = 0
    let count = 0
    docs.forEach((doc) => {
      const val = Number(doc.answers?.[qid])
      if (!Number.isNaN(val) && val > 0) {
        sum += val
        count += 1
      }
    })
    return count > 0 ? sum / count : 0
  }

  const s1Avgs = SECTION1_QUESTIONS.map((q) => getQuestionAvg(q.id))
  const s1Score = Number((s1Avgs.reduce((a, b) => a + b, 0) / s1Avgs.length).toFixed(2))

  const s2Avgs = SECTION2_QUESTIONS.map((q) => getQuestionAvg(q.id))
  const s2Score = Number((s2Avgs.reduce((a, b) => a + b, 0) / s2Avgs.length).toFixed(2))

  const s3Avgs = ['q30', 'q31'].map(getQuestionAvg)
  const s3Score = Number((s3Avgs.reduce((a, b) => a + b, 0) / s3Avgs.length).toFixed(2))

  const sectionScores = [
    { label: 'การงานดี', score: s1Score },
    { label: 'ความผูกพันองค์กร', score: s2Score },
    { label: 'สมดุลชีวิตกับการทำงาน', score: s3Score },
  ]

  const sortedSections = [...sectionScores].sort((a, b) => b.score - a.score)
  const strengthArea = sortedSections[0] || { label: 'ไม่มีข้อมูล', score: 0 }
  const painPointArea = sortedSections[sortedSections.length - 1] || { label: 'ไม่มีข้อมูล', score: 0 }

  const radarData = [
    { subject: 'การงานดี', score: s1Score, fullMark: 5 },
    { subject: 'ความผูกพันองค์กร', score: s2Score, fullMark: 5 },
    { subject: 'สมดุลชีวิตกับการทำงาน', score: s3Score, fullMark: 5 },
  ]

  // 3. Personnel Type Happiness Breakdown (out of 10)
  const personnelHappiness = PERSONNEL_TYPES.map((type) => {
    const typeDocs = docs.filter((d) => d.personnelType === type)
    if (typeDocs.length === 0) return { type, score: 0 }
    const typeQ32Sum = typeDocs.reduce((acc, d) => acc + (Number(d.answers?.q32) || 0), 0)
    return { type, score: Number((typeQ32Sum / typeDocs.length).toFixed(1)) }
  })

  // 4. Lowest Scored Questions (Ranked across all 1-5 scale questions)
  const questionAverages = ALL_SCALE_QUESTIONS.map((q) => {
    const score = Number(getQuestionAvg(q.id).toFixed(2))
    return { id: q.id, text: q.text, category: q.category, score }
  }).filter((q) => q.score > 0)

  questionAverages.sort((a, b) => a.score - b.score)

  const lowestQuestions = questionAverages.slice(0, 5).map((q, idx) => ({
    rank: idx + 1,
    ...q,
  }))

  return {
    totalResponses,
    overallHappiness10,
    strengthArea,
    painPointArea,
    radarData,
    personnelHappiness,
    lowestQuestions,
    hasData: true,
  }
}
