<template>
  <div data-theme="f1theme" class="min-h-screen bg-f1-black text-white flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
    <!-- Décor -->
    <div class="absolute -top-24 -right-24 w-96 h-96 bg-f1-red/20 rounded-full blur-3xl pointer-events-none" aria-hidden="true"></div>

    <main id="main" class="relative z-10 max-w-xl w-full text-center">
      <p class="font-display font-bold italic text-xl tracking-wider mb-10">
        PADDOCK<span class="text-f1-red">TRACKSIDE</span>
      </p>

      <p class="font-display font-extrabold italic text-7xl md:text-8xl text-f1-red leading-none mb-4" aria-hidden="true">
        {{ isNotFound ? '404' : statusCode }}
      </p>

      <h1 class="font-display font-bold italic text-3xl md:text-5xl text-white mb-4">
        {{ isNotFound ? 'Page introuvable' : 'Une erreur est survenue' }}
      </h1>

      <p class="text-gray-400 mb-10">
        <template v-if="isNotFound">
          La page que vous cherchez n'existe pas ou a été déplacée.
        </template>
        <template v-else>
          Un problème inattendu s'est produit. Vous pouvez retourner à l'accueil et réessayer.
        </template>
      </p>

      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          type="button"
          class="inline-flex items-center justify-center min-h-11 px-6 py-3 rounded-xl bg-f1-red-action text-white font-bold hover:brightness-110 transition"
          @click="goTo('/')"
        >
          Retour à l'accueil
        </button>
        <button
          type="button"
          class="inline-flex items-center justify-center min-h-11 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition"
          @click="goTo('/races')"
        >
          Voir le calendrier
        </button>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{
  error: NuxtError
}>()

const statusCode = computed(() => props.error?.statusCode || 500)
const isNotFound = computed(() => statusCode.value === 404)

const { generateMeta } = useSeo()
useHead(() => generateMeta({
  title: `${isNotFound.value ? 'Page introuvable' : 'Erreur'} | Paddock Track Side`,
  description: 'Cette page est introuvable. Retrouvez les classements, le calendrier et les statistiques de la Formule 1.',
  noindex: true
}))

// clearError réinitialise l'état d'erreur puis redirige
const goTo = (path: string) => clearError({ redirect: path })
</script>
