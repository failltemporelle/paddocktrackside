<template>
  <div data-theme="f1theme" class="min-h-screen bg-f1-black text-white selection:bg-f1-red selection:text-white flex flex-col overflow-x-clip">
    <!-- Lien d'évitement : premier élément focalisable de la page -->
    <a
      href="#main"
      class="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:px-4 focus:py-3 focus:rounded-xl focus:bg-white focus:text-f1-black focus:font-bold"
      @click.prevent="focusMain"
    >
      Aller au contenu
    </a>

    <!-- Background Elements -->
    <div class="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
      <div class="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-f1-red/10 to-transparent opacity-50"></div>
      <div class="absolute -top-24 -right-24 w-96 h-96 bg-f1-red/20 rounded-full blur-3xl"></div>
      <div class="absolute top-1/2 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
    </div>

    <!-- Top Progress Line (décorative) -->
    <div class="fixed top-0 left-0 right-0 h-1 z-50 bg-gradient-to-r from-f1-red via-red-500 to-f1-red shadow-[0_0_10px_rgba(255,24,1,0.5)]" aria-hidden="true"></div>

    <!-- HEADER / NAVIGATION -->
    <header class="sticky top-0 z-40 w-full px-4 py-3">
      <div class="navbar justify-between bg-glass-dark backdrop-blur-md rounded-2xl border border-white/10 shadow-lg max-w-7xl mx-auto">
        <div class="flex items-center gap-1">
          <!-- burger mobile -->
          <div ref="mobileNavRoot" class="relative lg:hidden" @keydown.esc="closeMobileMenu(true)">
            <button
              ref="burgerButton"
              type="button"
              :aria-label="mobileMenuOpen ? 'Fermer le menu de navigation' : 'Ouvrir le menu de navigation'"
              :aria-expanded="mobileMenuOpen"
              aria-controls="mobile-menu"
              class="btn btn-ghost btn-square text-white hover:bg-white/10"
              @click="mobileMenuOpen = !mobileMenuOpen"
            >
              <svg v-if="!mobileMenuOpen" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
                   viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
                   viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M6 6l12 12M18 6L6 18"/>
              </svg>
            </button>
            <ul
              v-show="mobileMenuOpen"
              id="mobile-menu"
              class="menu absolute left-0 top-full mt-3 z-[1] p-2 gap-1 shadow-xl bg-f1-dark-gray border border-white/10 rounded-xl w-64"
            >
              <li v-for="item in navItems" :key="item.to">
                <NuxtLink :to="item.to" class="nav-link-mobile py-3">{{ item.label }}</NuxtLink>
              </li>
            </ul>
          </div>

          <!-- brand -->
          <NuxtLink to="/" class="btn btn-ghost text-base min-[360px]:text-xl font-display font-bold italic tracking-wider hover:bg-transparent pl-2" aria-label="Paddock Track Side, accueil">
            PADDOCK<span class="text-f1-red">TRACKSIDE</span>
          </NuxtLink>
        </div>

        <!-- liens (desktop) -->
        <nav aria-label="Navigation principale" class="hidden lg:block">
          <ul class="menu menu-horizontal px-1 gap-1">
            <li v-for="item in navItems" :key="item.to">
              <NuxtLink :to="item.to" class="nav-link">{{ item.label }}</NuxtLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>

    <!-- Main Content -->
    <main id="main" tabindex="-1" class="flex-grow relative z-10 container py-6 focus:outline-none">
      <NuxtPage />
    </main>

    <!-- FOOTER -->
    <footer class="relative z-10 mt-auto bg-f1-dark-gray/80 backdrop-blur border-t border-white/5">
      <div class="max-w-7xl mx-auto p-6 md:p-10">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="flex flex-col gap-2">
            <span class="text-xl font-display font-bold italic tracking-wider">
              PADDOCK<span class="text-f1-red">TRACKSIDE</span>
            </span>
            <p class="text-sm text-gray-400">Votre destination ultime pour suivre la Formule 1.</p>
          </div>

          <nav aria-label="Pied de page : explorer le site">
            <h2 class="footer-heading">Explorer</h2>
            <ul>
              <li v-for="item in navItems" :key="item.to">
                <NuxtLink :to="item.to" class="footer-link">{{ item.label }}</NuxtLink>
              </li>
            </ul>
          </nav>

          <div>
            <h2 class="footer-heading">Le site</h2>
            <ul>
              <li>
                <a
                  href="https://github.com/jolpica/jolpica-f1"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="footer-link"
                >
                  Source des données : Jolpica F1 API<span class="sr-only"> (s'ouvre dans un nouvel onglet)</span>
                </a>
              </li>
              <li>
                <button type="button" class="footer-link" @click="scrollToTop">Retour en haut</button>
              </li>
            </ul>
          </div>
        </div>

        <div class="divider divider-neutral my-6"></div>

        <div class="flex flex-col sm:flex-row justify-between items-center text-xs text-gray-400 gap-4">
          <p>Paddock Track Side © {{ new Date().getFullYear() }} - Tous droits réservés</p>
          <p>F1, FORMULA 1, FORMULA ONE et les logos associés sont des marques déposées de Formula One Licensing BV.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
// Données structurées : aide Google à identifier le site (nom, langue, URL)
const siteUrl = String(useRuntimeConfig().public.siteUrl).replace(/\/$/, '')
useHead({
  script: [{
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Paddock Track Side',
      url: `${siteUrl}/`,
      inLanguage: 'fr-FR',
      description: 'Classements, calendrier, statistiques et records de Formule 1.'
    })
  }]
})

// Entrées de navigation, partagées par le menu desktop, le menu mobile et le pied de page
const navItems = [
  { to: '/standings', label: 'Classements' },
  { to: '/races', label: 'Calendrier' },
  { to: '/stats', label: 'Statistiques' },
  { to: '/records', label: 'Records' },
  { to: '/compare/drivers', label: 'Comparateur' }
]

const route = useRoute()
const mobileMenuOpen = ref(false)
const mobileNavRoot = ref(null)
const burgerButton = ref(null)

// Ferme le menu ; rend le focus au bouton si la fermeture vient du clavier (Échap)
const closeMobileMenu = (returnFocus = false) => {
  if (!mobileMenuOpen.value) return
  mobileMenuOpen.value = false
  if (returnFocus) burgerButton.value?.focus()
}

// Fermeture au clic / toucher en dehors du menu
const onPointerDown = (event) => {
  if (mobileMenuOpen.value && mobileNavRoot.value && !mobileNavRoot.value.contains(event.target)) {
    closeMobileMenu()
  }
}

onMounted(() => document.addEventListener('pointerdown', onPointerDown))
onBeforeUnmount(() => document.removeEventListener('pointerdown', onPointerDown))

// Fermeture à chaque changement de page (clic sur un lien, retour navigateur...)
watch(() => route.fullPath, () => closeMobileMenu())

// Lien d'évitement : place le focus sur le contenu principal
const focusMain = () => {
  const main = document.getElementById('main')
  main?.focus()
  main?.scrollIntoView()
}

const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })
</script>

<style>
/* Global transitions */
.page-enter-active,
.page-leave-active {
  transition: all 0.3s ease-out;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* Nav Link Styles */
.nav-link {
  @apply text-gray-300 font-medium px-4 py-2 rounded-lg transition-all duration-300 hover:text-white hover:bg-white/5 relative overflow-hidden;
}

.nav-link::after {
  content: '';
  @apply absolute bottom-0 left-0 w-full h-0.5 bg-f1-red transform scale-x-0 transition-transform duration-300 origin-right;
}

.nav-link:hover::after,
.nav-link.router-link-active::after {
  @apply transform scale-x-100 origin-left;
}

.nav-link.router-link-active {
  @apply text-white bg-white/5;
}

.nav-link-mobile {
  @apply relative text-gray-300 hover:text-white hover:bg-white/5 active:bg-f1-red/20 min-h-11;
}

/* Page active : fond teinté + barre rouge à gauche (pas seulement une couleur) */
.nav-link-mobile.router-link-active {
  @apply text-white bg-f1-red/20 font-semibold;
}

.nav-link-mobile.router-link-active::before {
  content: '';
  @apply absolute left-0 top-2 bottom-2 w-1 rounded-full bg-f1-red;
}

/* Pied de page */
.footer-heading {
  @apply font-sans text-xs font-bold uppercase tracking-widest text-gray-400 mb-3;
}

.footer-link {
  @apply inline-flex items-center min-h-11 py-2 text-sm font-medium text-gray-300 text-left transition-colors hover:text-white;
}
</style>
