<template>
  <div class="min-h-screen bg-f1-black relative">
    <div v-if="loading" class="flex justify-center items-center min-h-[50vh]">
      <span class="loading loading-spinner loading-lg text-f1-red"></span>
    </div>
    
    <template v-else-if="race">
      <!-- Fil d'Ariane -->
      <nav aria-label="Fil d'Ariane" class="absolute top-0 left-0 right-0 z-20 container mx-auto px-4 pt-4">
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
      <div class="container mx-auto px-4 py-8 space-y-12 -mt-20 relative z-10">
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
    
    <div v-else class="container mx-auto p-4 flex flex-col items-center justify-center min-h-[50vh]">
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