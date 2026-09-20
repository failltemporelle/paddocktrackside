<template>
  <div class="py-4 md:px-4">
    <!-- Mobile : titre puis sélecteur d'année en dessous (plus de chevauchement) ; sm+ : sur une ligne -->
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
      <h1 class="text-3xl font-bold">Calendrier F1 {{ selectedYear }}</h1>
      <YearSelector 
        :year="selectedYear" 
        @update:year="updateYear"
      />
    </div>
    
    <div v-if="loading" class="flex justify-center">
      <span class="loading loading-spinner loading-lg"></span>
    </div>
    
    <div v-else-if="error" class="alert alert-error">
      <span>{{ error }}</span>
    </div>
    
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
      <RaceCard 
        v-for="race in races" 
        :key="race.round" 
        :race="race"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Race } from '~/types/f1'

const loading = ref(true)
const error = ref<string | null>(null)
const races = ref<Race[]>([])
const route = useRoute()
const router = useRouter()
const currentYear = new Date().getFullYear()

// L'année est portée par l'URL (?year=2019) pour que « Précédent » retrouve le contexte
const queryYear = parseInt(String(route.query.year), 10)
const selectedYear = ref(
  Number.isFinite(queryYear) && queryYear >= 1950 && queryYear <= currentYear ? queryYear : currentYear
)

const { generateMeta } = useSeo()
useHead(() => generateMeta({
  title: `Calendrier F1 ${selectedYear.value} : Grands Prix et résultats | Paddock Track Side`,
  description: `Calendrier complet de la saison de Formule 1 ${selectedYear.value} : dates, circuits et résultats de chaque Grand Prix.`,
  path: '/races'
}))

const { fetchRaces } = useJolpicaApi()

const loadRaces = async () => {
  loading.value = true
  error.value = null
  try {
    races.value = await fetchRaces(selectedYear.value)
  } catch (e) {
    error.value = "Une erreur s'est produite lors du chargement des courses"
    console.error('Error loading races:', e)
  } finally {
    loading.value = false
  }
}

const updateYear = (year: number) => {
  selectedYear.value = year
  router.replace({ query: { ...route.query, year: String(year) } })
  loadRaces()
}

onMounted(loadRaces)
</script>