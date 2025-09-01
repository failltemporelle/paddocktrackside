<template>
  <div data-theme="f1theme">
    <!-- top red line -->
    <div class="h-0.5 w-full bg-f1-red"></div>

    <!-- NAVBAR -->
    <div class="navbar bg-f1-black text-white shadow-md">
      <div class="navbar-start">
        <!-- burger mobile -->
        <div class="dropdown lg:hidden">
          <label tabindex="0" class="btn btn-ghost btn-square">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none"
                 viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </label>
          <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-f1-black rounded-box w-52">
            <li><NuxtLink to="/standings" class="nav-link">Classements</NuxtLink></li>
            <li><NuxtLink to="/races" class="nav-link">Courses</NuxtLink></li>
            <li><NuxtLink to="/stats" class="nav-link">Statistiques</NuxtLink></li>
            <li><NuxtLink to="/predictions" class="nav-link">Prédictions</NuxtLink></li>
          </ul>
        </div>

        <!-- brand -->
        <NuxtLink to="/" class="btn btn-ghost text-lg font-semibold hover:text-f1-red">
          Paddock Track Side
        </NuxtLink>
      </div>

      <!-- center links (desktop) -->
      <div class="navbar-center hidden lg:flex">
        <ul class="menu menu-horizontal px-1">
          <li><NuxtLink to="/standings" class="nav-link">Classements</NuxtLink></li>
          <li><NuxtLink to="/races" class="nav-link">Courses</NuxtLink></li>
          <li><NuxtLink to="/stats" class="nav-link">Statistiques</NuxtLink></li>
          <li><NuxtLink to="/predictions" class="nav-link">Prédictions</NuxtLink></li>
        </ul>
      </div>

      <!-- right actions -->
      <div class="navbar-end">
        <label class="btn btn-ghost btn-square" title="Thème">
          <input type="checkbox" class="hidden" @change="toggleTheme" />
          <!-- icône simple (pas d’animation) -->
          <svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg"
               viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M21.64 13a1 1 0 00-1.05-.14A8 8 0 0112 21a8.15 8.15 0 01-7.92-9.51 8.59 8.59 0 01.25-2A1 1 0 002 8.36 10.14 10.14 0 1022 14.05a1 1 0 00-.36-1.05z"/>
          </svg>
        </label>
      </div>
    </div>

    <NuxtPage />

    <!-- FOOTER inchangé -->
    <footer class="footer footer-center p-4 sm:p-10 bg-f1-black text-white rounded mt-8">
      <nav>
        <div class="grid grid-flow-col gap-2 sm:gap-4">
          <NuxtLink to="/standings" class="nav-link">Classements</NuxtLink>
          <NuxtLink to="/races" class="nav-link">Courses</NuxtLink>
          <NuxtLink to="/stats" class="nav-link">Statistiques</NuxtLink>
          <NuxtLink to="/predictions" class="nav-link">Prédictions</NuxtLink>
        </div>
      </nav>
      <aside>
        <p class="text-sm sm:text-base">Paddock Track Side © {{ new Date().getFullYear() }} - Tous droits réservés</p>
      </aside>
    </footer>
  </div>
</template>

<script setup>
const toggleTheme = () => {
  const html = document.querySelector('html')
  const currentTheme = html?.getAttribute('data-theme')
  html?.setAttribute('data-theme', currentTheme === 'light' ? 'dark' : 'light')
}
</script>

<style>
/* classe utilitaire unifiée pour les liens */
.nav-link {
  @apply text-white px-3 py-2 border-b-2 border-transparent hover:text-f1-red hover:border-f1-red [&.router-link-active]:text-f1-red [&.router-link-active]:border-f1-red;
}

/* container si besoin (garde ton réglage actuel) */
.container { @apply px-4 mx-auto max-w-7xl; }
@media (max-width: 640px) { .container { @apply px-2; } }
</style>
