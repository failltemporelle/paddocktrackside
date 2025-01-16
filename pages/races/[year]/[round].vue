<template>
  <div>
    <div v-if="loading" class="flex justify-center p-12">
      <span class="loading loading-spinner loading-lg"></span>
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
      <div class="container mx-auto p-4 space-y-8 -mt-8">
        <RaceInfo :circuit="race.Circuit" />
        <RaceResults 
          :results="race.Results"
          :qualifying-results="qualifyingResults"
          :sprint-results="sprintResults"
        />
      </div>
    </template>
    
    <div v-else class="container mx-auto p-4">
      <div class="text-center py-12">
        <h2 class="text-2xl font-bold mb-4">Course non trouvée</h2>
        <NuxtLink to="/races" class="btn btn-primary">
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
const { fetchRaceResults, fetchQualifyingResults, fetchSprintResults } = useErgastApi()

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