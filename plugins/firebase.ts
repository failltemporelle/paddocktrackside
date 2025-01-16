import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

export default defineNuxtPlugin(() => {
  // Only initialize Firebase on client-side
  if (process.client) {
    const firebaseConfig = {
      apiKey: "AIzaSyAl3jfqyotr16bUuD_M1Kys1jy7JvHzVDA",
      authDomain: "paddocktrackside.firebaseapp.com",
      projectId: "paddocktrackside",
      storageBucket: "paddocktrackside.appspot.com",
      messagingSenderId: "236905041011",
      appId: "1:236905041011:web:1cb0de0b7af73b0be3ae06"
    }

    const app = initializeApp(firebaseConfig)
    const auth = getAuth(app)

    return {
      provide: {
        firebase: { app, auth }
      }
    }
  }
})