<template>
  <div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold mb-6">Calendrier F1 {{ currentYear }}</h1>
    
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
const currentYear = new Date().getFullYear()

const { fetchCurrentSeasonRaces } = useRaceData()

onMounted(async () => {
  try {
    races.value = await fetchCurrentSeasonRaces()
  } catch (e) {
    error.value = "Une erreur s'est produite lors du chargement des courses"
    console.error('Error loading races:', e)
  } finally {
    loading.value = false
  }
})
</script>