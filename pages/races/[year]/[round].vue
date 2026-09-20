<template>
  <div class="min-h-screen bg-f1-black relative">
    <div v-if="loading" class="flex justify-center items-center min-h-[50vh]">
      <span class="loading loading-spinner loading-lg text-f1-red"></span>
    </div>
    
    <template v-else-if="race">
      <!-- Fil d'Ariane : dans le flux sur mobile (sinon il chevauche le titre du hero), superposé au hero dès md -->
      <nav aria-label="Fil d'Ariane" class="relative z-20 pb-2 md:absolute md:top-0 md:left-0 md:right-0 md:container md:px-4 md:pt-4 md:pb-0">
        <ol class="flex flex-wrap items-center gap-x-2 text-sm text-gray-300">
          <li><NuxtLink to="/" class="inline-flex items-center min-h-11 hover:text-white underline-offset-2 hover:underline">Accueil</NuxtLink></li>
          <li aria-hidden="true">›</li>
          <li>
            <NuxtLink :to="{ path: '/races', query: { year: race.season } }" class="inline-flex items-center min-h-11 hover:text-white underline-offset-2 hover:underline">
              Calendrier {{ race.season }}
            </NuxtLink>
          </li>
          <li aria-hidden="true">›</li>
          <li aria-current="page" class="text-white font-medium">{{ race.raceName }}</li>
        </ol>
      </nav>

      <!-- Hero Section -->
      <RaceHero 
        :race-name="race.raceName"
        :season="race.season"
        :round="race.round"
        :date="race.date"
        :time="race.time"
        :circuit="race.Circuit"
      />

      <!-- Main Content -->
      <div class="container py-8 space-y-8 md:space-y-12 -mt-12 md:-mt-20 relative z-10">
        <RaceInfo :circuit="race.Circuit" />
        
        <div class="space-y-6">
          <RaceResults 
            :results="race.Results"
            :qualifying-results="qualifyingResults"
            :sprint-results="sprintResults"
          />
        </div>
      </div>
    </template>
    
    <div v-else class="py-4 flex flex-col items-center justify-center min-h-[50vh]">
      <div class="text-center py-12 space-y-4">
        <h2 class="text-3xl font-bold text-white">Course non trouvée</h2>
        <p class="text-gray-400">Les données pour cette course ne sont pas disponibles.</p>
        <NuxtLink :to="{ path: '/races', query: { year: String(route.params.year) } }" class="btn bg-f1-red-action hover:brightness-110 text-white border-none">
          Retour au calendrier
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Race, QualifyingResult, SprintResult } from '~/types/f1'

const route = useRoute()
const { generateMeta } = useSeo()
const { fetchRaceResults, fetchQualifyingResults, fetchSprintResults } = useJolpicaApi()

const loading = ref(true)
const race = ref<Race | null>(null)
const qualifyingResults = ref<QualifyingResult[]>([])
const sprintResults = ref<SprintResult[]>([])

// Titre et métadonnées réactifs : un seul appel dans le setup, mis à jour quand la course est chargée
useHead(() => race.value
  ? generateMeta({
      title: `${race.value.raceName} ${race.value.season} | Paddock Track Side`,
      description: `Suivez les résultats du Grand Prix ${race.value.raceName} ${race.value.season}. Qualifications, course et statistiques complètes.`,
      path: `/races/${race.value.season}/${race.value.round}`
    })
  : generateMeta({
      title: 'Résultats de course | Paddock Track Side',
      description: 'Consultez les résultats détaillés des Grands Prix de Formule 1.'
    })
)

onMounted(async () => {
  try {
    const year = route.params.year as string
    const round = route.params.round as string
    
    const [raceData, qualiData, sprintData] = await Promise.all([
      fetchRaceResults(year, round),
      fetchQualifyingResults(year, round),
      fetchSprintResults(year, round)
    ])

    race.value = raceData[0] || null
    qualifyingResults.value = qualiData[0]?.QualifyingResults || []
    sprintResults.value = sprintData[0]?.SprintResults || []
  } catch (error) {
    console.error('Erreur lors du chargement des résultats:', error)
  } finally {
    loading.value = false
  }
})
</script>