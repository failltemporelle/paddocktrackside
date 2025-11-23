<template>
  <section class="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
    <!-- Background Image with Parallax Effect -->
    <div class="absolute inset-0 z-0">
      <div class="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40"></div>
      <div class="absolute inset-0 bg-gradient-to-b from-f1-black via-f1-black/80 to-f1-black"></div>
      <div class="absolute inset-0 bg-gradient-to-r from-f1-black via-transparent to-f1-black/50"></div>
    </div>

    <!-- Animated Shapes -->
    <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-f1-red/20 rounded-full blur-[120px] animate-pulse-slow"></div>
    <div class="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px]"></div>

    <!-- Content -->
    <div class="relative z-10 container mx-auto px-6 md:px-12">
      <div class="max-w-4xl">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-gray-300 mb-6 backdrop-blur-md animate-fade-in">
          <span class="w-2 h-2 rounded-full bg-f1-red animate-pulse"></span>
          Saison 2025 en direct
        </div>
        
        <h1 class="text-6xl md:text-8xl font-display font-bold italic text-white leading-tight mb-8 drop-shadow-2xl animate-slide-up">
          VIVEZ LA <span class="text-transparent bg-clip-text bg-gradient-to-r from-f1-red to-red-600">F1</span><br/>
          COMME JAMAIS
        </h1>
        
        <p class="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed max-w-2xl font-light animate-slide-up" style="animation-delay: 100ms;">
          Plongez au cœur du paddock. Classements en temps réel, statistiques avancées et analyses exclusives pour les vrais passionnés.
        </p>

        <div class="flex flex-col sm:flex-row gap-6 animate-slide-up" style="animation-delay: 200ms;">
          <NuxtLink 
            to="/standings" 
            class="group relative px-8 py-4 bg-f1-red text-white font-bold italic tracking-wider rounded-xl overflow-hidden transition-all hover:shadow-[0_0_20px_rgba(255,24,1,0.4)] hover:-translate-y-1">
            <div class="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span class="relative flex items-center gap-2">
              VOIR LES CLASSEMENTS
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </NuxtLink>
          
          <NuxtLink 
            to="/races" 
            class="group px-8 py-4 bg-white/5 backdrop-blur-md border border-white/10 text-white font-bold italic tracking-wider rounded-xl hover:bg-white/10 hover:border-white/20 transition-all hover:-translate-y-1">
            CALENDRIER 2025
          </NuxtLink>
        </div>
      </div>
    </div>
    
    <!-- Scroll Indicator -->
    <div class="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </svg>
    </div>
  </section>
</template>
