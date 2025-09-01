<template>
  <section class="py-20 bg-f1-light relative overflow-hidden">
    <!-- décor gradient subtil -->
    <div class="pointer-events-none absolute inset-0 opacity-40 bg-gradient-to-br from-red-500/10 via-transparent to-black/5"></div>

    <div class="container mx-auto px-6 md:px-10 relative">
      <!-- header -->
      <div class="text-center max-w-3xl mx-auto mb-14">
        <h2 class="text-3xl md:text-5xl font-extrabold tracking-tight">
          Pourquoi choisir <span class="text-red-600">Paddock Track Side</span> ?
        </h2>
        <div class="mt-5 h-1 w-24 mx-auto rounded-full bg-gradient-to-r from-red-600 via-red-400 to-red-600"></div>
        <p class="mt-6 text-gray-600 md:text-lg">
          Des données fiables, des insights qui font gagner du temps.
        </p>
      </div>

      <!-- cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        <!-- Card 1 -->
        <div
          class="group relative rounded-2xl bg-white/80 backdrop-blur shadow-xl ring-1 ring-black/5 p-6 transition
                 hover:-translate-y-1 hover:shadow-2xl hover:ring-red-500/30"
        >
          <div class="absolute -inset-px rounded-2xl bg-gradient-to-b from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition"></div>

          <div class="relative">
            <h3 class="text-xl font-bold mb-2">Données en temps réel</h3>
            <p class="text-gray-600">
              Accédez aux résultats des courses, qualifications et essais dès qu'ils sont disponibles.
            </p>
          </div>
        </div>

        <!-- Card 2 -->
        <div
          class="group relative rounded-2xl bg-white/80 backdrop-blur shadow-xl ring-1 ring-black/5 p-6 transition
                 hover:-translate-y-1 hover:shadow-2xl hover:ring-red-500/30"
        >
          <div class="absolute -inset-px rounded-2xl bg-gradient-to-b from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition"></div>

          <div class="relative">
            <h3 class="text-xl font-bold mb-2">Statistiques détaillées</h3>
            <p class="text-gray-600">
              Analysez les performances des pilotes et des écuries avec nos outils statistiques avancés.
            </p>
          </div>
        </div>

        <!-- Card 3 -->
        <div
          class="group relative rounded-2xl bg-white/80 backdrop-blur shadow-xl ring-1 ring-black/5 p-6 transition
                 hover:-translate-y-1 hover:shadow-2xl hover:ring-red-500/30"
        >
          <div class="absolute -inset-px rounded-2xl bg-gradient-to-b from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition"></div>

          <div class="relative">
            <h3 class="text-xl font-bold mb-2">Expérience mobile</h3>
            <p class="text-gray-600">
              Profitez d'une expérience optimisée sur tous vos appareils.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
