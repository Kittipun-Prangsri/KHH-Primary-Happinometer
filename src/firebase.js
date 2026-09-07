import { initializeApp } from 'firebase/app'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
import { getAuth, connectAuthEmulator } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyAPDovU8rO2EkG_-VX7izQSQHDmqOLAXLY",
  authDomain: "khh-primary-happinometer.firebaseapp.com",
  projectId: "khh-primary-happinometer",
  storageBucket: "khh-primary-happinometer.firebasestorage.app",
  messagingSenderId: "493615081272",
  appId: "1:493615081272:web:d366a24f20078ab3e3c3cd",
  measurementId: "G-FE3QRV7MJD"
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const auth = getAuth(app)

// Opt-in local emulator connection — never affects production builds.
// Enable with VITE_USE_FIREBASE_EMULATORS=true in a local .env.local file.
if (import.meta.env.DEV && import.meta.env.VITE_USE_FIREBASE_EMULATORS === 'true') {
  connectFirestoreEmulator(db, '127.0.0.1', 8080)
  connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true })
}
