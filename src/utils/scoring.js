import { SECTION1_QUESTIONS, SECTION2_QUESTIONS } from '../data/questions'

const avg = (arr) => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0)

export function computeScores(answers) {
  const s1Values = SECTION1_QUESTIONS.map((q) => Number(answers[q.id])).filter((v) => !Number.isNaN(v))
  const s2Values = SECTION2_QUESTIONS.map((q) => Number(answers[q.id])).filter((v) => !Number.isNaN(v))
  const balanceScaleValues = [answers.q30, answers.q31].map(Number).filter((v) => !Number.isNaN(v))

  const s1Avg = avg(s1Values) // out of 5
  const s2Avg = avg(s2Values) // out of 5
  const s3Avg = avg(balanceScaleValues) // out of 5
  const overallHappiness = Number(answers.q32) || 0 // out of 10

  const toPercent = (score5) => Math.round((score5 / 5) * 100)

  const overallFrom5 = avg([s1Avg, s2Avg, s3Avg]) // combined 1-5 average across the three scaled sections

  return {
    section1: { label: 'การงานดี (Happy Work Life)', score: s1Avg, percent: toPercent(s1Avg) },
    section2: { label: 'ความผูกพันต่อองค์กร', score: s2Avg, percent: toPercent(s2Avg) },
    section3: { label: 'สมดุลชีวิตกับการทำงาน', score: s3Avg, percent: toPercent(s3Avg) },
    overallFrom5,
    overallPercent: toPercent(overallFrom5),
    happinessScore10: overallHappiness,
  }
}

export function getHappinessLevel(score10) {
  if (score10 >= 9) return { label: 'มีความสุขมากที่สุด', color: 'text-emerald-600', emoji: '🤩' }
  if (score10 >= 7) return { label: 'มีความสุขมาก', color: 'text-teal-600', emoji: '😄' }
  if (score10 >= 5) return { label: 'มีความสุขปานกลาง', color: 'text-amber-600', emoji: '🙂' }
  if (score10 >= 3) return { label: 'มีความสุขค่อนข้างน้อย', color: 'text-orange-600', emoji: '😕' }
  return { label: 'ควรได้รับการดูแลเป็นพิเศษ', color: 'text-rose-600', emoji: '😢' }
}

export function getEncouragement(score10) {
  if (score10 >= 9) {
    return 'สุดยอดไปเลย! ขอบคุณที่นำพลังบวกมาสู่ทีมของเรา ให้ความสุขนี้อยู่กับเราไปนาน ๆ นะ 💚'
  }
  if (score10 >= 7) {
    return 'เยี่ยมมาก! วันนี้ก็เป็นอีกวันที่ดีใช่ไหม ขอบคุณที่ตั้งใจทำงานเพื่อพี่น้องประชาชนเสมอมา 🌿'
  }
  if (score10 >= 5) {
    return 'ขอบคุณที่ยังคงมุ่งมั่นแม้บางวันจะเหนื่อยล้า พักผ่อนบ้างนะ เราเป็นทีมเดียวกัน 🤝'
  }
  if (score10 >= 3) {
    return 'ช่วงนี้อาจไม่ง่ายนัก แต่ท่านไม่ได้เผชิญมันคนเดียว หากต้องการพูดคุยหรือความช่วยเหลือ ทีมงานพร้อมรับฟังเสมอ 🫂'
  }
  return 'ขอบคุณที่กล้าสะท้อนความรู้สึกจริง ๆ ออกมา ทีมงานเป็นห่วงและพร้อมอยู่เคียงข้างเสมอ อย่าลืมดูแลตัวเองนะ 💙'
}
