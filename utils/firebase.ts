import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyAl3jfqyotr16bUuD_M1Kys1jy7JvHzVDA",
  authDomain: "paddocktrackside.firebaseapp.com",
  projectId: "paddocktrackside",
  storageBucket: "paddocktrackside.appspot.com",
  messagingSenderId: "236905041011",
  appId: "1:236905041011:web:1cb0de0b7af73b0be3ae06"
}

export const initFirebase = () => {
  const app = initializeApp(firebaseConfig)
  const auth = getAuth(app)
  return { app, auth }
}