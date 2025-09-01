<template>
  <section class="relative min-h-[90vh] flex items-center justify-center bg-gradient-to-br from-f1-black via-f1-gray to-black overflow-hidden">

    <!-- Overlay gradient -->
    <div class="absolute inset-0 bg-gradient-to-r from-black/80 via-black/70 to-transparent"></div>

    <!-- Content -->
    <div class="relative container mx-auto px-6 md:px-12">
      <div class="max-w-2xl">
        <h1 class="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-6 drop-shadow-lg">
          Vivez la F1 <span class="text-red-600">comme jamais</span> auparavant
        </h1>
        <p class="text-lg md:text-xl text-gray-300 mb-10 leading-relaxed">
          Plongez dans les classements, les statistiques et les analyses exclusives de la Formule 1.<br/>
          Restez connecté à chaque tour, chaque course, chaque victoire.
        </p>

        <div class="flex flex-col sm:flex-row gap-5">
          <NuxtLink 
            to="/standings" 
            class="px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-2xl shadow-lg transition transform hover:scale-105">
            Voir les classements
          </NuxtLink>
          <NuxtLink 
            to="/races" 
            class="px-8 py-4 border-2 border-white text-white font-semibold rounded-2xl hover:bg-white hover:text-black transition transform hover:scale-105">
            Calendrier des courses
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>
