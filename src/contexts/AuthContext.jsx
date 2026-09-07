import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { onAuthStateChanged, signInWithCustomToken, signOut as firebaseSignOut } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '../firebase'

const AuthContext = createContext(null)

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [claims, setClaims] = useState(null)
  const [staffProfile, setStaffProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [exchanging, setExchanging] = useState(false)
  const [loginError, setLoginError] = useState(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const tokenResult = await firebaseUser.getIdTokenResult()
        setClaims(tokenResult.claims)
      } else {
        setClaims(null)
      }
      setUser(firebaseUser)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  useEffect(() => {
    if (!user) {
      setStaffProfile(null)
      return
    }
    let cancelled = false
    getDoc(doc(db, 'khh_staff', user.uid))
      .then((snap) => {
        if (!cancelled && snap.exists()) setStaffProfile(snap.data())
      })
      .catch((err) => console.error('[Auth] failed to load staff profile:', err))
    return () => {
      cancelled = true
    }
  }, [user])

  const redirectToProviderLogin = useCallback(async () => {
    setLoginError(null)
    try {
      const res = await fetch(`${API_BASE_URL}/auth/provider-redirect`, {
        headers: { Accept: 'application/json' },
      })
      if (!res.ok) throw new Error(`redirect fetch failed: ${res.status}`)
      const { url } = await res.json()
      window.location.href = url
    } catch (err) {
      console.warn('[Auth] provider-redirect fetch failed, using direct Health ID OAuth redirect URL:', err)
      const healthIdUrl = import.meta.env.VITE_HEALTH_ID_URL || 'https://uat-provider.id.th'
      const clientId = import.meta.env.VITE_HEALTH_CLIENT_ID
      const redirectUri = import.meta.env.VITE_PROVIDER_REDIRECT_URI || window.location.origin

      if (clientId) {
        window.location.href = `${healthIdUrl}/oauth/redirect?client_id=${encodeURIComponent(clientId)}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code`
      } else {
        window.location.href = 'https://authorized.one.th/authorize/options/login'
      }
    }
  }, [])

  const completeProviderLogin = useCallback(async (code) => {
    setExchanging(true)
    setLoginError(null)
    try {
      const res = await fetch(`${API_BASE_URL}/auth/provider-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setLoginError(data.message || 'เข้าสู่ระบบไม่สำเร็จ กรุณาลองใหม่อีกครั้ง')
        return
      }
      await signInWithCustomToken(auth, data.customToken)
    } catch (err) {
      console.error('[Auth] provider-login failed:', err)
      setLoginError('เกิดข้อผิดพลาดในการเข้าสู่ระบบ กรุณาลองใหม่อีกครั้ง')
    } finally {
      setExchanging(false)
    }
  }, [])

  const logout = useCallback(() => firebaseSignOut(auth), [])

  const value = {
    user,
    claims,
    staffProfile,
    loading,
    exchanging,
    loginError,
    isApprovedStaff: Boolean(claims?.approved && ['admin', 'superadmin'].includes(claims?.role)),
    redirectToProviderLogin,
    completeProviderLogin,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
