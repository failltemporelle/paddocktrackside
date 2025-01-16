export default defineNuxtRouteMiddleware((to) => {
  if (process.server) return

  const { user, loading } = useAuth()

  if (loading.value) return

  if (to.path === '/login') {
    if (user.value) {
      return navigateTo('/')
    }
    return
  }

  const publicRoutes = ['/', '/standings', '/races', '/stats']
  if (publicRoutes.includes(to.path)) return

  if (!user.value) {
    return navigateTo('/login')
  }
})