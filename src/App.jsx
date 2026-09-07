import { useState, useRef, useEffect, Suspense, lazy } from 'react'
import { ChevronLeft, ChevronRight, Loader2, Send } from 'lucide-react'
import TopNavbar from './components/TopNavbar'
import HeroBanner from './components/HeroBanner'
import ProgressBar from './components/ProgressBar'
import CategorySidebar from './components/CategorySidebar'
import SurveyCard from './components/SurveyCard'
import GeneralInfoForm from './components/GeneralInfoForm'
import RadioScale from './components/RadioScale'
import ChoiceGroup from './components/ChoiceGroup'
import HappinessSlider from './components/HappinessSlider'
import ResultScreen from './components/ResultScreen'
import Footer from './components/Footer'
import StaffLoginScreen from './components/StaffLoginScreen'
import PendingApprovalScreen from './components/PendingApprovalScreen'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import {
  CATEGORIES,
  ALL_QUESTION_IDS,
  SECTION1_QUESTIONS,
  SECTION2_QUESTIONS,
  WORK_DAYS_OPTIONS,
  WORK_HOURS_OPTIONS,
  REST_HOURS_OPTIONS,
} from './data/questions'

import { db } from './firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'

const DashboardView = lazy(() => import('./components/dashboard/DashboardView'))

const CATEGORY_ORDER = CATEGORIES.map((c) => c.key)

const CATEGORY_REQUIRED_IDS = {
  general: ['department', 'personnelType'],
  section1: SECTION1_QUESTIONS.map((q) => q.id),
  section2: SECTION2_QUESTIONS.map((q) => q.id),
  section3: ['q27', 'q28', 'q29', 'q30', 'q31'],
  section4: ['q32'],
}

const CATEGORY_HEADERS = {
  general: { icon: '📋', title: 'ข้อมูลทั่วไป' },
  section1: { icon: '💼', title: 'Happy Work Life (การงานดี)', subtitle: 'ให้คะแนนตั้งแต่ 1 (น้อยที่สุด/ไม่มีเลย) ถึง 5 (มากที่สุด/มีมากที่สุด)' },
  section2: { icon: '🤝', title: 'ความผูกพันต่อองค์กร', subtitle: 'ให้คะแนนตั้งแต่ 1 (น้อยที่สุด) ถึง 5 (มากที่สุด)' },
  section3: { icon: '⚖️', title: 'สมดุลชีวิตกับการทำงาน', subtitle: 'กรุณาเลือกคำตอบที่ตรงกับสภาพการทำงานจริงของท่าน' },
  section4: { icon: <i className="bi bi-emoji-smile-fill text-amber-500 text-xl" />, title: 'ความสุขโดยรวม', subtitle: 'คำถามสุดท้ายแล้ว! กรุณาให้คะแนนความสุขโดยรวมของท่านในปัจจุบัน' },
}

// 100% Anonymous Firebase Firestore submission handler
async function submitHappinometerResponse(payload) {
  console.log('[Happinometer] Submitting 100% anonymized payload to Firebase Firestore:', payload)
  const docRef = await addDoc(collection(db, 'happinometer_responses'), {
    department: payload.department,
    personnelType: payload.personnelType,
    answers: payload.answers,
    submittedAt: serverTimestamp(),
    isAnonymous: true,
  })
  console.log('[Happinometer] Firestore submission successful! Document ID:', docRef.id)
  return { ok: true, id: docRef.id }
}

export default function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  )
}

function AppShell() {
  const { user, loading: authLoading, isApprovedStaff, staffProfile, completeProviderLogin, logout } = useAuth()
  const [view, setView] = useState('survey') // 'survey' | 'dashboard'
  const [surveyPhase, setSurveyPhase] = useState('form') // 'form' | 'result'
  const [activeCategory, setActiveCategory] = useState('general')
  const [department, setDepartment] = useState('')
  const [personnelType, setPersonnelType] = useState('')
  const [answers, setAnswers] = useState({})
  const [errorIds, setErrorIds] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const topRef = useRef(null)
  const surveyCardRef = useRef(null)

  const fieldValues = { department, personnelType, ...answers }

  const setAnswer = (id, value) => {
    setAnswers((prev) => ({ ...prev, [id]: value }))
    setErrorIds((prev) => prev.filter((e) => e !== id))
  }

  const setGeneralField = (id, value) => {
    if (id === 'department') setDepartment(value)
    if (id === 'personnelType') setPersonnelType(value)
    setErrorIds((prev) => prev.filter((e) => e !== id))
  }

  const scrollToTop = () => topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  const scrollToSurveyCard = () => {
    if (surveyCardRef.current) {
      const rect = surveyCardRef.current.getBoundingClientRect()
      if (rect.top < 0 || window.innerWidth < 768) {
        surveyCardRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }

  const isCategoryComplete = (key) =>
    CATEGORY_REQUIRED_IDS[key].every((id) => fieldValues[id] !== undefined && fieldValues[id] !== '')

  const completedKeys = CATEGORY_ORDER.filter(isCategoryComplete)
  const answeredCount = ALL_QUESTION_IDS.filter((id) => answers[id] !== undefined && answers[id] !== '').length

  const validateCategory = (key) => {
    const missing = CATEGORY_REQUIRED_IDS[key].filter((id) => fieldValues[id] === undefined || fieldValues[id] === '')
    setErrorIds(missing)
    return missing.length === 0
  }

  const handleSelectCategory = (key) => {
    setActiveCategory(key)
    scrollToSurveyCard()
  }

  const currentIndex = CATEGORY_ORDER.indexOf(activeCategory)
  const isLastCategory = currentIndex === CATEGORY_ORDER.length - 1

  const handleNext = () => {
    if (!validateCategory(activeCategory)) {
      scrollToSurveyCard()
      return
    }
    if (!isLastCategory) {
      setActiveCategory(CATEGORY_ORDER[currentIndex + 1])
      scrollToSurveyCard()
    }
  }

  const handleBack = () => {
    if (currentIndex > 0) {
      setActiveCategory(CATEGORY_ORDER[currentIndex - 1])
      scrollToSurveyCard()
    }
  }

  const handleSubmit = async () => {
    if (!validateCategory(activeCategory)) {
      scrollToTop()
      return
    }

    const payload = {
      submittedAt: new Date().toISOString(),
      department,
      personnelType,
      answers, // fully anonymous: no name, employee ID, or other identifying fields collected
    }

    setSubmitting(true)
    try {
      await submitHappinometerResponse(payload)
      setSubmitted(true)
      setSurveyPhase('result')
      scrollToTop()
    } catch (err) {
      console.error('[Happinometer] Submission failed:', err)
      alert('เกิดข้อผิดพลาดในการส่งแบบประเมิน กรุณาลองใหม่อีกครั้ง')
    } finally {
      setSubmitting(false)
    }
  }

  const handleRestart = () => {
    setAnswers({})
    setErrorIds([])
    setDepartment('')
    setPersonnelType('')
    setActiveCategory('general')
    setSubmitted(false)
    setSurveyPhase('form')
    scrollToTop()
  }

  const toggleView = () => setView((v) => (v === 'dashboard' ? 'survey' : 'dashboard'))

  // Returning from the MOPH Provider ID / Health ID redirect lands back here
  // with ?code=... or ?auth_data=... in the query string — exchange it, then clean the URL.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')
    const authData = params.get('auth_data')

    if (authData) {
      setView('dashboard')
      try {
        const decodedStr = atob(authData)
        const profile = JSON.parse(decodedStr)
        console.log('[Auth] Logged in via auth_data profile:', profile)
      } catch (err) {
        console.error('[Auth] Failed to decode auth_data:', err)
      } finally {
        window.history.replaceState({}, '', window.location.pathname)
      }
      return
    }

    if (!code) return

    setView('dashboard')
    completeProviderLogin(code).finally(() => {
      window.history.replaceState({}, '', window.location.pathname)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const header = CATEGORY_HEADERS[activeCategory]

  return (
    <div className="min-h-screen">
      <div ref={topRef} />
      <TopNavbar view={view} onToggleView={toggleView} staffName={staffProfile?.nameTh} onLogout={logout} />

      {view === 'dashboard' ? (
        authLoading ? (
          <div className="flex items-center justify-center py-24 text-cyan-600">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : !user ? (
          <StaffLoginScreen />
        ) : !isApprovedStaff ? (
          <PendingApprovalScreen />
        ) : (
          <Suspense
            fallback={
              <div className="flex items-center justify-center py-24 text-cyan-600">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            }
          >
            <DashboardView />
          </Suspense>
        )
      ) : surveyPhase === 'result' ? (
        <ResultScreen answers={answers} onRestart={handleRestart} submitted={submitted} />
      ) : (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-5 pb-28 md:pb-8">
          <HeroBanner />
          <ProgressBar answeredCount={answeredCount} totalCount={ALL_QUESTION_IDS.length} />

          <div ref={surveyCardRef} className="grid md:grid-cols-[240px_1fr] gap-5 items-start scroll-mt-20">
            <CategorySidebar activeKey={activeCategory} completedKeys={completedKeys} onSelect={handleSelectCategory} />

            <SurveyCard icon={header.icon} title={header.title} subtitle={header.subtitle}>
              {activeCategory === 'general' && (
                <GeneralInfoForm
                  department={department}
                  personnelType={personnelType}
                  onDepartmentChange={(v) => setGeneralField('department', v)}
                  onPersonnelChange={(v) => setGeneralField('personnelType', v)}
                  showError={errorIds}
                />
              )}

              {activeCategory === 'section1' &&
                SECTION1_QUESTIONS.map((q, i) => (
                  <RadioScale
                    key={q.id}
                    index={i + 1}
                    question={q.text}
                    value={answers[q.id]}
                    onChange={(v) => setAnswer(q.id, v)}
                    showError={errorIds.includes(q.id)}
                  />
                ))}

              {activeCategory === 'section2' &&
                SECTION2_QUESTIONS.map((q, i) => (
                  <RadioScale
                    key={q.id}
                    index={i + 18}
                    question={q.text}
                    value={answers[q.id]}
                    onChange={(v) => setAnswer(q.id, v)}
                    showError={errorIds.includes(q.id)}
                  />
                ))}

              {activeCategory === 'section3' && (
                <>
                  <ChoiceGroup
                    index={27}
                    question="จำนวนวันทำงานต่อสัปดาห์"
                    options={WORK_DAYS_OPTIONS}
                    value={answers.q27}
                    onChange={(v) => setAnswer('q27', v)}
                    showError={errorIds.includes('q27')}
                  />
                  <ChoiceGroup
                    index={28}
                    question="ชั่วโมงทำงานต่อวัน"
                    options={WORK_HOURS_OPTIONS}
                    value={answers.q28}
                    onChange={(v) => setAnswer('q28', v)}
                    showError={errorIds.includes('q28')}
                  />
                  <ChoiceGroup
                    index={29}
                    question="เวลาพักผ่อนต่อวัน (ไม่นับเวลานอน)"
                    options={REST_HOURS_OPTIONS}
                    value={answers.q29}
                    onChange={(v) => setAnswer('q29', v)}
                    showError={errorIds.includes('q29')}
                  />
                  <RadioScale
                    index={30}
                    question="ท่านมีความยืดหยุ่นในการทำงาน (เช่น ปรับเวลา/สลับเวร) มากน้อยเพียงใด"
                    value={answers.q30}
                    onChange={(v) => setAnswer('q30', v)}
                    showError={errorIds.includes('q30')}
                  />
                  <RadioScale
                    index={31}
                    question="ท่านได้ทำงานตรงตามวุฒิการศึกษา/ความเชี่ยวชาญของท่านมากน้อยเพียงใด"
                    value={answers.q31}
                    onChange={(v) => setAnswer('q31', v)}
                    showError={errorIds.includes('q31')}
                  />
                </>
              )}

              {activeCategory === 'section4' && (
                <HappinessSlider
                  value={answers.q32}
                  onChange={(v) => setAnswer('q32', v)}
                  showError={errorIds.includes('q32')}
                />
              )}

              <div className="hidden md:flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={currentIndex === 0}
                  className={`flex items-center gap-1 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
                    currentIndex === 0 ? 'text-slate-300 cursor-not-allowed' : 'text-cyan-700 hover:bg-cyan-50 active:scale-95'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                  ย้อนกลับ
                </button>

                {isLastCategory ? (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-xl py-3 font-semibold text-sm bg-gradient-to-r from-cyan-600 via-teal-600 to-purple-600 text-white shadow-md shadow-cyan-600/20 hover:shadow-lg hover:shadow-cyan-600/30 transition-all active:scale-[0.98] disabled:opacity-70"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        กำลังส่งคำตอบ...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        ส่งแบบประเมิน
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-xl py-3 font-semibold text-sm bg-gradient-to-r from-cyan-600 via-teal-600 to-purple-600 text-white shadow-md shadow-cyan-600/20 hover:shadow-lg hover:shadow-cyan-600/30 transition-all active:scale-[0.98]"
                  >
                    ถัดไป
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </SurveyCard>
          </div>
        </div>
      )}

      {view === 'survey' && surveyPhase === 'form' && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-cyan-100 px-4 py-3 z-20">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleBack}
              disabled={currentIndex === 0}
              className={`flex items-center gap-1 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                currentIndex === 0 ? 'text-slate-300 cursor-not-allowed' : 'text-cyan-700 hover:bg-cyan-50 active:scale-95'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              ย้อนกลับ
            </button>

            {isLastCategory ? (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-xl py-3.5 font-semibold text-sm bg-gradient-to-r from-cyan-600 via-teal-600 to-purple-600 text-white shadow-md shadow-cyan-600/20 hover:shadow-lg transition-all active:scale-[0.98] disabled:opacity-70"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    กำลังส่งคำตอบ...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    ส่งแบบประเมิน
                  </>
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-xl py-3.5 font-semibold text-sm bg-gradient-to-r from-cyan-600 via-teal-600 to-purple-600 text-white shadow-md shadow-cyan-600/20 hover:shadow-lg transition-all active:scale-[0.98]"
              >
                ถัดไป
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {view === 'survey' && <Footer />}
    </div>
  )
}

