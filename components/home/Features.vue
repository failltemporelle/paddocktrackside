<template>
  <section class="py-24 bg-f1-black relative overflow-hidden">
    <!-- Background Elements -->
    <div class="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-f1-dark-gray/20 to-transparent"></div>
    <div class="absolute bottom-0 left-0 w-96 h-96 bg-f1-red/5 rounded-full blur-[100px]"></div>

    <div class="container mx-auto px-6 md:px-10 relative z-10">
      <!-- Header -->
      <div class="text-center max-w-3xl mx-auto mb-20">
        <h2 class="text-4xl md:text-6xl font-display font-bold italic text-white tracking-tight mb-6">
          POURQUOI <span class="text-f1-red">PADDOCK</span> ?
        </h2>
        <p class="text-xl text-gray-400 font-light">
          Une plateforme conçue par des passionnés, pour des passionnés.
        </p>
      </div>

      <!-- Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Card 1 -->
        <div class="group relative bg-f1-dark-gray/40 backdrop-blur-md rounded-3xl border border-white/5 p-8 transition-all duration-500 hover:border-f1-red/30 hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]">
          <div class="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
          
          <div class="relative z-10">
            <div class="w-14 h-14 rounded-2xl bg-f1-red/10 flex items-center justify-center mb-6 group-hover:bg-f1-red transition-colors duration-300">
              <span class="text-2xl">⚡️</span>
            </div>
            <h3 class="text-2xl font-display font-bold italic text-white mb-4">Temps Réel</h3>
            <p class="text-gray-400 leading-relaxed">
              Accédez aux résultats des courses, qualifications et essais instantanément. Ne manquez plus aucune action en piste.
            </p>
          </div>
        </div>

        <!-- Card 2 -->
        <div class="group relative bg-f1-dark-gray/40 backdrop-blur-md rounded-3xl border border-white/5 p-8 transition-all duration-500 hover:border-f1-red/30 hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]">
          <div class="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
          
          <div class="relative z-10">
            <div class="w-14 h-14 rounded-2xl bg-f1-red/10 flex items-center justify-center mb-6 group-hover:bg-f1-red transition-colors duration-300">
              <span class="text-2xl">📊</span>
            </div>
            <h3 class="text-2xl font-display font-bold italic text-white mb-4">Analyses Précises</h3>
            <p class="text-gray-400 leading-relaxed">
              Plongez dans les données avec nos graphiques interactifs et comparez les performances des pilotes et écuries.
            </p>
          </div>
        </div>

        <!-- Card 3 -->
        <div class="group relative bg-f1-dark-gray/40 backdrop-blur-md rounded-3xl border border-white/5 p-8 transition-all duration-500 hover:border-f1-red/30 hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]">
          <div class="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
          
          <div class="relative z-10">
            <div class="w-14 h-14 rounded-2xl bg-f1-red/10 flex items-center justify-center mb-6 group-hover:bg-f1-red transition-colors duration-300">
              <span class="text-2xl">📱</span>
            </div>
            <h3 class="text-2xl font-display font-bold italic text-white mb-4">100% Mobile</h3>
            <p class="text-gray-400 leading-relaxed">
              Une expérience fluide et optimisée sur tous vos appareils. Suivez la F1 où que vous soyez.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
