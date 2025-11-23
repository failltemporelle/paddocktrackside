<template>
  <div data-theme="f1theme" class="min-h-screen bg-f1-black text-white selection:bg-f1-red selection:text-white flex flex-col">
    <!-- Background Elements -->
    <div class="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <div class="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-f1-red/10 to-transparent opacity-50"></div>
      <div class="absolute -top-24 -right-24 w-96 h-96 bg-f1-red/20 rounded-full blur-3xl"></div>
      <div class="absolute top-1/2 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
    </div>

    <!-- Top Progress Line -->
    <div class="fixed top-0 left-0 right-0 h-1 z-50 bg-gradient-to-r from-f1-red via-red-500 to-f1-red shadow-[0_0_10px_rgba(255,24,1,0.5)]"></div>

    <!-- NAVBAR -->
    <div class="sticky top-0 z-40 w-full px-4 py-3">
      <div class="navbar bg-glass-dark backdrop-blur-md rounded-2xl border border-white/10 shadow-lg max-w-7xl mx-auto">
        <div class="navbar-start">
          <!-- burger mobile -->
          <div class="dropdown lg:hidden">
            <label tabindex="0" class="btn btn-ghost btn-square btn-sm text-white hover:bg-white/10">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
                   viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
            </label>
            <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-xl bg-f1-dark-gray border border-white/10 rounded-xl w-52">
            <NuxtLink to="/standings" class="nav-link-mobile">Classements</NuxtLink>
              <li><NuxtLink to="/races" class="nav-link-mobile">Courses</NuxtLink></li>
              <li><NuxtLink to="/stats" class="nav-link-mobile">Statistiques</NuxtLink></li>
            </ul>
          </div>

          <!-- brand -->
          <NuxtLink to="/" class="btn btn-ghost text-xl font-display font-bold italic tracking-wider hover:bg-transparent pl-2">
            PADDOCK<span class="text-f1-red">TRACKSIDE</span>
          </NuxtLink>
        </div>

        <!-- center links (desktop) -->
        <div class="navbar-center hidden lg:flex">
          <ul class="menu menu-horizontal px-1 gap-1">
            <li><NuxtLink to="/standings" class="nav-link">Classements</NuxtLink></li>
            <li><NuxtLink to="/races" class="nav-link">Courses</NuxtLink></li>
            <li><NuxtLink to="/stats" class="nav-link">Statistiques</NuxtLink></li>
          </ul>
        </div>

        <!-- right actions -->
        <div class="navbar-end">
          <!-- Theme toggle removed as we are enforcing dark mode for premium feel, 
               but keeping structure if user wants it back later or for other actions -->
          <div class="w-8"></div> 
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <main class="flex-grow relative z-10 container mx-auto px-4 py-6">
      <NuxtPage />
    </main>

    <!-- FOOTER -->
    <footer class="relative z-10 mt-auto bg-f1-dark-gray/80 backdrop-blur border-t border-white/5">
      <div class="max-w-7xl mx-auto p-10">
        <div class="flex flex-col md:flex-row justify-between items-center gap-6">
          <div class="flex flex-col items-center md:items-start gap-2">
             <span class="text-xl font-display font-bold italic tracking-wider">
              PADDOCK<span class="text-f1-red">TRACKSIDE</span>
            </span>
            <p class="text-sm text-gray-400">Votre destination ultime pour suivre la Formule 1.</p>
          </div>
          
          <nav class="flex flex-wrap justify-center gap-6 text-sm font-medium text-gray-300">
            <NuxtLink to="/standings" class="hover:text-f1-red transition-colors">Classements</NuxtLink>
            <NuxtLink to="/races" class="hover:text-f1-red transition-colors">Courses</NuxtLink>
            <NuxtLink to="/stats" class="hover:text-f1-red transition-colors">Statistiques</NuxtLink>
          </nav>
        </div>
        
        <div class="divider divider-neutral my-6"></div>
        
        <div class="flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500 gap-4">
          <p>Paddock Track Side © {{ new Date().getFullYear() }} - Tous droits réservés</p>
          <p>F1, FORMULA 1, FORMULA ONE et les logos associés sont des marques déposées de Formula One Licensing BV.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
// Theme toggle logic removed to enforce premium dark theme
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
  @apply text-gray-300 hover:text-white hover:bg-white/5 active:bg-f1-red/20;
}
</style>
