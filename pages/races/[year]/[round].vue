<template>
  <div class="min-h-screen bg-f1-black">
    <div v-if="loading" class="flex justify-center items-center min-h-[50vh]">
      <span class="loading loading-spinner loading-lg text-f1-red"></span>
    </div>
    
    <template v-else-if="race">
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
        <NuxtLink to="/races" class="btn bg-f1-red hover:bg-red-600 text-white border-none">
          Retour au calendrier
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Race } from '~/types/f1'

const route = useRoute()
const { generateMeta } = useSeo()
const { fetchRaceResults, fetchQualifyingResults, fetchSprintResults } = useJolpicaApi()

const loading = ref(true)
const race = ref<Race | null>(null)
const qualifyingResults = ref<QualifyingResult[]>([])
const sprintResults = ref<SprintResult[]>([])

// Set default meta tags
useHead(generateMeta({
  title: 'Résultats de course | Paddock Track Side',
  description: 'Consultez les résultats détaillés des Grands Prix de Formule 1.'
}))

// Update meta tags when race data is available
watch(() => race.value, (newRace) => {
  if (newRace) {
    useHead(generateMeta({
      title: `${newRace.raceName} ${newRace.season} | Paddock Track Side`,
      description: `Suivez les résultats du Grand Prix ${newRace.raceName} ${newRace.season}. Qualifications, course et statistiques complètes.`,
      url: `https://paddocktrackside.com/races/${newRace.season}/${newRace.round}`
    }))
  }
})

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