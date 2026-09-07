// Mock aggregate data for the admin analytics dashboard.
// Replace with real aggregation queries once a backend is wired up.

export const MOCK_KPI = {
  totalResponses: 87,
  overallHappiness10: 7.4,
  strengthArea: { label: 'ความผูกพันต่อองค์กร', score: 4.2 },
  painPointArea: { label: 'สมดุลชีวิตกับการทำงาน', score: 3.1 },
}

export const MOCK_RADAR_DATA = [
  { subject: 'การงานดี', score: 3.8, fullMark: 5 },
  { subject: 'ความผูกพันองค์กร', score: 4.2, fullMark: 5 },
  { subject: 'สมดุลชีวิตกับการทำงาน', score: 3.1, fullMark: 5 },
]

export const MOCK_PERSONNEL_HAPPINESS = [
  { type: 'ข้าราชการ', score: 7.9 },
  { type: 'พกส.', score: 7.6 },
  { type: 'พนักงานราชการ', score: 7.2 },
  { type: 'ลูกจ้างชั่วคราว', score: 6.5 },
]

export const MOCK_LOWEST_QUESTIONS = [
  { rank: 1, id: 'q9', text: 'ค่าตอบแทนที่ได้รับมีความคุ้มค่าเมื่อเทียบกับความเสี่ยงในการทำงาน', category: 'การงานดี', score: 2.6 },
  { rank: 2, id: 'q6', text: 'ท่านพึงพอใจต่อการพิจารณาขึ้นเงินเดือน/ค่าตอบแทนประจำปี', category: 'การงานดี', score: 2.8 },
  { rank: 3, id: 'q29', text: 'เวลาพักผ่อนต่อวัน (ไม่นับเวลานอน) เพียงพอ', category: 'สมดุลชีวิตกับการทำงาน', score: 3.0 },
]
