<template>
  <section class="py-16 bg-white">
    <div class="container mx-auto px-4">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <h2 class="text-3xl md:text-4xl font-bold mb-6">
            À propos de Paddock Track Side
          </h2>
          <p class="text-gray-600 mb-4">
            Paddock Track Side est votre destination ultime pour suivre la Formule 1. Notre plateforme combine données en temps réel, analyses approfondies et expérience utilisateur intuitive.
          </p>
          <p class="text-gray-600 mb-6">
            Que vous soyez fan occasionnel ou passionné de longue date, nous vous offrons tous les outils nécessaires pour vivre la F1 intensément.
          </p>
          <NuxtLink to="/about" class="btn btn-primary">
            En savoir plus
          </NuxtLink>
        </div>
        <div class="relative h-[400px] rounded-xl overflow-hidden">
          <img 
            src="https://media.formula1.com/image/upload/content/dam/fom-website/manual/Misc/2024manual/2024Launches/SF-24/SF24_3.jpg.transform/9col/image.jpg"
            alt="F1 Racing"
            class="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  </section>
</template>