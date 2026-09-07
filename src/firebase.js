import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

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
