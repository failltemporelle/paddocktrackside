<template>
  <section class="py-24 bg-f1-dark-gray relative">
    <div class="container mx-auto px-6 md:px-12">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <!-- Image/Visual Side -->
        <div class="relative">
          <div class="absolute inset-0 bg-f1-red/20 blur-[80px] rounded-full"></div>
          <div class="relative bg-f1-black/50 backdrop-blur-xl rounded-3xl border border-white/10 p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500">
            <div class="aspect-video bg-gradient-to-br from-f1-gray to-black rounded-2xl overflow-hidden relative">
              <div class="absolute inset-0 flex items-center justify-center">
                <span class="text-6xl">🏎️</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Text Side -->
        <div>
          <h2 class="text-4xl md:text-5xl font-display font-bold italic text-white mb-8 leading-tight">
            PLUS QU'UN SIMPLE<br/>
            <span class="text-f1-red">TABLEAU DE BORD</span>
          </h2>
          
          <div class="space-y-6 text-lg text-gray-400 font-light">
            <p>
              <strong class="text-white font-bold">Paddock Track Side</strong> redéfinit la façon dont vous suivez la Formule 1. Nous ne nous contentons pas d'afficher des chiffres ; nous racontons l'histoire de chaque course.
            </p>
            <p>
              De la grille de départ au drapeau à damier, vivez l'intensité de la compétition avec une interface conçue pour la vitesse et la clarté.
            </p>
          </div>

          <div class="mt-10">
            <NuxtLink to="/about" class="inline-flex items-center gap-3 text-white font-bold hover:text-f1-red transition-colors group">
              EN SAVOIR PLUS
              <span class="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-f1-red transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
