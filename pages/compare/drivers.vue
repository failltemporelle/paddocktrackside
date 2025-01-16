<template>
  <div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold mb-6">Comparaison de Pilotes</h1>

    <div class="card bg-base-100 shadow-xl mb-6">
      <div class="card-body">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Sélecteur de pilotes -->
          <div class="form-control">
            <label class="label">
              <span class="label-text">Premier pilote</span>
            </label>
            <select v-model="selectedDriver1" class="select select-bordered w-full">
              <option value="">Sélectionner un pilote</option>
              <option v-for="driver in availableDrivers" :key="driver.driverId" :value="driver.driverId">
                {{ driver.givenName }} {{ driver.familyName }}
              </option>
            </select>
          </div>
          <div class="form-control">
            <label class="label">
              <span class="label-text">Second pilote</span>
            </label>
            <select v-model="selectedDriver2" class="select select-bordered w-full">
              <option value="">Sélectionner un pilote</option>
              <option v-for="driver in availableDrivers" :key="driver.driverId" :value="driver.driverId">
                {{ driver.givenName }} {{ driver.familyName }}
              </option>
            </select>
          </div>
        </div>

        <!-- Sélecteur de période -->
        <div class="mt-4">
          <YearRangeSelector v-model:startYear="startYear" v-model:endYear="endYear" />
        </div>
      </div>
    </div>

    <div v-if="loading" class="flex justify-center my-8">
      <span class="loading loading-spinner loading-lg"></span>
    </div>

    <template v-else-if="driver1Stats && driver2Stats">
      <!-- Comparaison des pilotes -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DriverComparisonCard :driver="driver1Stats" :opponent="driver2Stats" />
        <DriverComparisonCard :driver="driver2Stats" :opponent="driver1Stats" />
      </div>

      <!-- Statistiques détaillées -->
      <div class="grid gap-6 mt-6">
        <!-- Points par course -->
        <div class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <h2 class="card-title">Points par course</h2>
            <PointsChart
              :labels="raceLabels"
              :datasets="[
                {
                  label: `${driver1Stats.Driver.givenName} ${driver1Stats.Driver.familyName}`,
                  data: driver1Points,
                  borderColor: '#E10600',
                  backgroundColor: '#E10600',
                  fill: false
                },
                {
                  label: `${driver2Stats.Driver.givenName} ${driver2Stats.Driver.familyName}`,
                  data: driver2Points,
                  borderColor: '#15151E',
                  backgroundColor: '#15151E',
                  fill: false
                }
              ]"
            />
          </div>
        </div>

        <!-- Statistiques comparatives -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Qualifications -->
          <div class="card bg-base-100 shadow-xl">
            <div class="card-body">
              <h2 class="card-title">Qualifications</h2>
              <div class="stats shadow">
                <div class="stat">
                  <div class="stat-title">Position moyenne</div>
                  <div class="stat-value">{{ averageQualifyingPosition(driver1Stats) }}</div>
                  <div class="stat-desc">{{ driver1Stats.Driver.givenName }}</div>
                </div>
                <div class="stat">
                  <div class="stat-title">Position moyenne</div>
                  <div class="stat-value">{{ averageQualifyingPosition(driver2Stats) }}</div>
                  <div class="stat-desc">{{ driver2Stats.Driver.givenName }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Courses -->
          <div class="card bg-base-100 shadow-xl">
            <div class="card-body">
              <h2 class="card-title">Courses</h2>
              <div class="stats shadow">
                <div class="stat">
                  <div class="stat-title">Position moyenne</div>
                  <div class="stat-value">{{ averageRacePosition(driver1Stats) }}</div>
                  <div class="stat-desc">{{ driver1Stats.Driver.givenName }}</div>
                </div>
                <div class="stat">
                  <div class="stat-title">Position moyenne</div>
                  <div class="stat-value">{{ averageRacePosition(driver2Stats) }}</div>
                  <div class="stat-desc">{{ driver2Stats.Driver.givenName }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <div v-else-if="selectedDriver1 && selectedDriver2" class="text-center py-12">
      <p class="text-lg">Chargement des données...</p>
    </div>

    <div v-else class="text-center py-12">
      <p class="text-lg">Sélectionnez deux pilotes pour voir la comparaison</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Driver } from '~/types/f1'

const selectedDriver1 = ref('')
const selectedDriver2 = ref('')
const startYear = ref(new Date().getFullYear())
const endYear = ref(new Date().getFullYear())
const loading = ref(false)

const driver1Stats = ref<Driver | null>(null)
const driver2Stats = ref<Driver | null>(null)
const availableDrivers = ref([])
const raceLabels = ref<string[]>([])
const driver1Points = ref<number[]>([])
const driver2Points = ref<number[]>([])

const { fetchDriverStandings } = useErgastApi()

// Charger la liste des pilotes disponibles
onMounted(async () => {
  try {
    const drivers = await fetchDriverStandings()
    availableDrivers.value = drivers.map(d => d.Driver)
  } catch (error) {
    console.error('Erreur lors du chargement des pilotes:', error)
  }
})

// Fonctions utilitaires pour les statistiques
const averageQualifyingPosition = (driver: Driver) => {
  // À implémenter avec les données réelles
  return Math.round(Math.random() * 10)
}

const averageRacePosition = (driver: Driver) => {
  // À implémenter avec les données réelles
  return Math.round(Math.random() * 10)
}

// Observer les changements de sélection
watch([selectedDriver1, selectedDriver2, startYear, endYear], async ([newDriver1, newDriver2]) => {
  if (!newDriver1 || !newDriver2) return

  loading.value = true
  try {
    // Simuler le chargement des données
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const drivers = await fetchDriverStandings()
    driver1Stats.value = drivers.find(d => d.Driver.driverId === newDriver1) || null
    driver2Stats.value = drivers.find(d => d.Driver.driverId === newDriver2) || null

    // Simuler des données de course
    raceLabels.value = Array.from({ length: 10 }, (_, i) => `Course ${i + 1}`)
    driver1Points.value = Array.from({ length: 10 }, () => Math.round(Math.random() * 25))
    driver2Points.value = Array.from({ length: 10 }, () => Math.round(Math.random() * 25))
  } catch (error) {
    console.error('Erreur lors du chargement des statistiques:', error)
  } finally {
    loading.value = false
  }
})
</script>