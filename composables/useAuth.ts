import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User
} from 'firebase/auth'
import { ref } from 'vue'

export const useAuth = () => {
  const { $firebase } = useNuxtApp()
  const user = ref<User | null>(null)
  const loading = ref(true)
  const error = ref<string | null>(null)

  if (process.client && $firebase?.auth) {
    onAuthStateChanged($firebase.auth, (newUser) => {
      user.value = newUser
      loading.value = false
    })

    const login = async (email: string, password: string) => {
      try {
        error.value = null
        const userCredential = await signInWithEmailAndPassword($firebase.auth, email, password)
        return userCredential.user
      } catch (e: any) {
        error.value = e.message
        throw e
      }
    }

    const register = async (email: string, password: string) => {
      try {
        error.value = null
        const userCredential = await createUserWithEmailAndPassword($firebase.auth, email, password)
        return userCredential.user
      } catch (e: any) {
        error.value = e.message
        throw e
      }
    }

    const logout = async () => {
      try {
        await signOut($firebase.auth)
        error.value = null
      } catch (e: any) {
        error.value = e.message
        throw e
      }
    }

    return {
      user,
      loading,
      error,
      login,
      register,
      logout
    }
  }

  // Return default values for SSR
  return {
    user: ref(null),
    loading: ref(false),
    error: ref(null),
    login: async () => {},
    register: async () => {},
    logout: async () => {}
  }
}