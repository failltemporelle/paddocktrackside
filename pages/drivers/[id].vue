<template>
  <div class="container mx-auto p-4">
    <div v-if="loading" class="flex justify-center">
      <span class="loading loading-spinner loading-lg"></span>
    </div>
    
    <template v-else-if="driverHistory.length > 0">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold">
          {{ driverHistory[0]?.Driver?.givenName }} {{ driverHistory[0]?.Driver?.familyName }}
        </h1>
        <NuxtLink to="/standings" class="btn btn-ghost">
          ← Retour aux classements
        </NuxtLink>
      </div>

      <div class="grid gap-6">
        <div class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <h2 class="card-title mb-4">Évolution des points en championnat</h2>
            <BarChart
              :labels="chartLabels"
              :datasets="[{
                label: 'Points',
                data: chartPoints,
                backgroundColor: '#E10600',
                borderColor: '#15151E'
              }]"
            />
          </div>
        </div>

        <div class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <h2 class="card-title mb-4">Statistiques de carrière</h2>
            <div class="stats stats-vertical lg:stats-horizontal shadow">
              <div class="stat">
                <div class="stat-title">Saisons</div>
                <div class="stat-value">{{ driverHistory.length }}</div>
              </div>
              
              <div class="stat">
                <div class="stat-title">Victoires totales</div>
                <div class="stat-value">{{ totalWins }}</div>
              </div>
              
              <div class="stat">
                <div class="stat-title">Meilleure position</div>
                <div class="stat-value">P{{ bestPosition }}</div>
              </div>
              
              <div class="stat">
                <div class="stat-title">Points totaux</div>
                <div class="stat-value">{{ totalPoints }}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <h2 class="card-title mb-4">Historique par saison</h2>
            <div class="overflow-x-auto">
              <table class="table">
                <thead>
                  <tr>
                    <th>Saison</th>
                    <th>Position</th>
                    <th>Points</th>
                    <th>Victoires</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="season in driverHistory.slice().reverse()" :key="season.year">
                    <td>{{ season.year }}</td>
                    <td>P{{ season.position }}</td>
                    <td>{{ season.points }}</td>
                    <td>{{ season.wins }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </template>
    
    <div v-else class="text-center py-12">
      <h2 class="text-2xl font-bold mb-4">Aucune donnée disponible pour ce pilote</h2>
      <p class="text-gray-600 mb-4">Les données historiques ne sont pas disponibles ou le pilote n'a pas encore marqué de points en F1.</p>
      <NuxtLink to="/standings" class="btn btn-primary">
        Retour aux classements
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const loading = ref(true)
const driverHistory = ref([])
const { getDriverHistory } = useDriverStats()

const chartLabels = computed(() => driverHistory.value.map(d => d.year.toString()))
const chartPoints = computed(() => driverHistory.value.map(d => d.points))

const totalWins = computed(() => 
  driverHistory.value.reduce((sum, season) => sum + season.wins, 0)
)

const totalPoints = computed(() => 
  driverHistory.value.reduce((sum, season) => sum + season.points, 0)
)

const bestPosition = computed(() => {
  const positions = driverHistory.value.map(d => d.position)
  return positions.length > 0 ? Math.min(...positions) : '-'
})

onMounted(async () => {
  try {
    const history = await getDriverHistory(route.params.id as string)
    driverHistory.value = history
  } catch (error) {
    console.error('Erreur lors du chargement des statistiques:', error)
  } finally {
    loading.value = false
  }
})
</script>