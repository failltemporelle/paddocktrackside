<template>
  <section class="relative bg-gradient-to-r from-f1-black to-f1-gray min-h-[80vh] flex items-center">
    <div class="container mx-auto px-4">
      <div class="max-w-3xl">
        <h1 class="text-4xl md:text-6xl font-bold text-white mb-6">
          Vivez la F1 comme jamais auparavant
        </h1>
        <p class="text-lg md:text-xl text-gray-300 mb-8">
          Découvrez les derniers classements, statistiques et analyses de la Formule 1. 
          Restez connecté avec votre sport favori.
        </p>
        <div class="flex flex-col sm:flex-row gap-4">
          <NuxtLink to="/standings" class="btn btn-primary">
            Voir les classements
          </NuxtLink>
          <NuxtLink to="/races" class="btn btn-outline text-white hover:bg-white hover:text-f1-black">
            Calendrier des courses
          </NuxtLink>
        </div>
      </div>
    </div>
    <div class="absolute bottom-0 right-0 w-full md:w-1/2 h-full opacity-20 bg-[url('https://media.formula1.com/image/upload/content/dam/fom-website/manual/Misc/2024manual/WinterTesting/Day3/GettyImages-2031097446.jpg.transform/9col/image.jpg')] bg-cover bg-center"></div>
  </section>
</template>