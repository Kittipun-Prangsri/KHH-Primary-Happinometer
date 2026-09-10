import { createContext, useContext, useState, useCallback } from 'react'
import { signInWithCustomToken, signOut as firebaseSignOut } from 'firebase/auth'
import { auth } from '../firebase'

const AuthContext = createContext(null)

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'
const SESSION_KEY = 'khh_staff_session'

function readStoredSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    return raw ? JSON.parse(raw) : null
  } catch (err) {
    console.error('[Auth] Failed to read stored session:', err)
    return null
  }
}

// The MOPH Provider ID profile shape (see คู่มือ Provider ID, "API สำหรับขอข้อมูล
// Provider ID") — normalize the fields the UI actually needs.
function normalizeStaffProfile(profile) {
  const org = profile?.organization?.[0] || {}
  return {
    providerId: profile?.provider_id || profile?.account_id || `staff-${Date.now()}`,
    nameTh:
      profile?.name_th ||
      `${profile?.firstname_th || ''} ${profile?.lastname_th || ''}`.trim() ||
      'เจ้าหน้าที่',
    position: org.position || org.position_type || 'เจ้าหน้าที่ผู้ใช้งาน',
    hcode: org.hcode || '',
    hname: org.hname_th || '',
  }
}

export function AuthProvider({ children }) {
  const [staffProfile, setStaffProfile] = useState(() => readStoredSession())
  const [loggingIn, setLoggingIn] = useState(false)
  const [loginError, setLoginError] = useState(null)

  const loginWithProfile = useCallback(async (rawProfile, customToken) => {
    const normalized = normalizeStaffProfile(rawProfile)
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(normalized))
    } catch (err) {
      console.error('[Auth] Failed to persist session:', err)
    }
    setStaffProfile(normalized)
    setLoginError(null)

    // Signs into Firebase Auth so Firestore security rules (which check
    // request.auth.token.approved/role) let the dashboard read data.
    if (customToken) {
      try {
        await signInWithCustomToken(auth, customToken)
      } catch (err) {
        console.error('[Auth] Firebase sign-in with custom token failed:', err)
      }
    }
  }, [])

  const redirectToProviderLogin = useCallback(async () => {
    setLoginError(null)
    setLoggingIn(true)
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login-url`)
      if (!res.ok) throw new Error(`login-url request failed: ${res.status}`)
      const data = await res.json()
      if (!data?.url) throw new Error('login-url response missing url')
      window.location.href = data.url
    } catch (err) {
      console.error('[Auth] Failed to start Provider ID login:', err)
      setLoginError('ไม่สามารถเชื่อมต่อระบบเข้าสู่ระบบได้ กรุณาลองใหม่อีกครั้ง')
      setLoggingIn(false)
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      localStorage.removeItem(SESSION_KEY)
    } catch (err) {
      console.error('[Auth] Failed to clear stored session:', err)
    }
    setStaffProfile(null)
    try {
      await firebaseSignOut(auth)
    } catch (err) {
      console.error('[Auth] Firebase sign-out failed:', err)
    }
  }, [])

  const value = {
    staffProfile,
    isLoggedIn: Boolean(staffProfile),
    loggingIn,
    loginError,
    setLoginError,
    loginWithProfile,
    redirectToProviderLogin,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
