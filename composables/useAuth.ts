import { ref } from 'vue'

export const useAuth = () => {
  return {
    user: ref(null),
    loading: ref(false),
    error: ref<string | null>(null),
    login: async (_email: string, _password: string) => {},
    register: async (_email: string, _password: string) => {},
    logout: async () => {}
  }
}
