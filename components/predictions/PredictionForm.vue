<template>
  <form @submit.prevent="handleSubmit" class="card bg-base-100 shadow-xl">
    <div class="card-body space-y-6">
      <h2 class="card-title">Nouvelle prédiction</h2>
      
      <!-- Course et conditions -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="form-control">
          <label class="label">Course</label>
          <select v-model="form.raceId" class="select select-bordered" required>
            <option value="">Sélectionner une course</option>
            <option v-for="race in upcomingRaces" :key="race.round" :value="race.round">
              {{ race.raceName }}
            </option>
          </select>
        </div>
        
        <div class="form-control">
          <label class="label">Conditions</label>
          <select v-model="form.conditions" class="select select-bordered" required>
            <option value="">Sélectionner les conditions</option>
            <option value="dry">Sec</option>
            <option value="wet">Pluie</option>
            <option value="mixed">Mixte</option>
          </select>
        </div>
      </div>

      <!-- Podium prévu -->
      <div class="space-y-4">
        <h3 class="font-semibold">Podium prévu</h3>
        <div v-for="position in 3" :key="position" class="form-control">
          <label class="label">Position {{ position }}</label>
          <select 
            v-model="form.podium[position-1]" 
            class="select select-bordered"
            required
          >
            <option value="">Sélectionner un pilote</option>
            <option v-for="driver in currentDrivers" :key="driver.driverId" :value="driver.driverId">
              {{ driver.givenName }} {{ driver.familyName }}
            </option>
          </select>
        </div>
      </div>

      <!-- Confiance -->
      <div class="form-control">
        <label class="label">Niveau de confiance</label>
        <input 
          v-model="form.confidence" 
          type="range" 
          min="0" 
          max="100" 
          class="range" 
          step="10" 
        />
        <div class="w-full flex justify-between text-xs px-2">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>

      <!-- Actions -->
      <div class="card-actions justify-end">
        <button type="reset" class="btn btn-ghost">Réinitialiser</button>
        <button type="submit" class="btn btn-primary">
          Enregistrer la prédiction
        </button>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import type { Prediction } from '~/types/predictions'

const emit = defineEmits<{
  submit: [prediction: Prediction]
}>()

const { fetchDriverStandings } = useErgastApi()
const { fetchCurrentSeasonRaces } = useRaceData()

const currentDrivers = ref([])
const upcomingRaces = ref([])

const form = reactive({
  raceId: '',
  conditions: '',
  podium: ['', '', ''],
  confidence: 50
})

const handleSubmit = () => {
  emit('submit', {
    id: Date.now().toString(),
    raceId: form.raceId,
    conditions: form.conditions,
    podium: [...form.podium],
    confidence: form.confidence,
    createdAt: new Date().toISOString()
  })
  
  // Reset form
  form.raceId = ''
  form.conditions = ''
  form.podium = ['', '', '']
  form.confidence = 50
}

onMounted(async () => {
  const [drivers, races] = await Promise.all([
    fetchDriverStandings(),
    fetchCurrentSeasonRaces()
  ])
  
  currentDrivers.value = drivers.map(d => d.Driver)
  upcomingRaces.value = races.filter(race => 
    new Date(race.date) > new Date()
  )
})
</script>