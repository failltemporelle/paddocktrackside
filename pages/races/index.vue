<template>
  <div class="container mx-auto p-4">
    <div class="flex items-center justify-between mb-6">
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
    
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
const selectedYear = ref(new Date().getFullYear())

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
  loadRaces()
}

onMounted(loadRaces)
</script>