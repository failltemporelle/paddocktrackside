<template>
  <div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold mb-6">Statistiques comparatives</h1>

    <div class="grid gap-6">
      <!-- Points des pilotes -->
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title mb-4">Comparaison des points des pilotes</h2>
          <BarChart
            :labels="driverLabels"
            :datasets="[{
              label: 'Points',
              data: driverPoints,
              backgroundColor: '#E10600',
              borderColor: '#15151E'
            }]"
          />
        </div>
      </div>

      <!-- Points des constructeurs -->
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title mb-4">Comparaison des points des constructeurs</h2>
          <BarChart
            :labels="constructorLabels"
            :datasets="[{
              label: 'Points',
              data: constructorPoints,
              backgroundColor: '#15151E',
              borderColor: '#E10600'
            }]"
          />
        </div>
      </div>

      <!-- Statistiques détaillées -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <h2 class="card-title mb-4">Top 5 Pilotes</h2>
            <div class="overflow-x-auto">
              <table class="table">
                <thead>
                  <tr>
                    <th>Position</th>
                    <th>Pilote</th>
                    <th>Points</th>
                    <th>Victoires</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="driver in topDrivers" :key="driver.position">
                    <td>{{ driver.position }}</td>
                    <td>{{ `${driver.Driver.givenName} ${driver.Driver.familyName}` }}</td>
                    <td>{{ driver.points }}</td>
                    <td>{{ driver.wins }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <h2 class="card-title mb-4">Top 5 Constructeurs</h2>
            <div class="overflow-x-auto">
              <table class="table">
                <thead>
                  <tr>
                    <th>Position</th>
                    <th>Écurie</th>
                    <th>Points</th>
                    <th>Victoires</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="constructor in topConstructors" :key="constructor.position">
                    <td>{{ constructor.position }}</td>
                    <td>{{ constructor.Constructor.name }}</td>
                    <td>{{ constructor.points }}</td>
                    <td>{{ constructor.wins }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- Victoires -->
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title mb-4">Comparaison des victoires</h2>
          <BarChart
            :labels="driverLabels"
            :datasets="[{
              label: 'Victoires',
              data: driverWins,
              backgroundColor: '#38383F',
              borderColor: '#E10600'
            }]"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { fetchDriverStandings, fetchConstructorStandings } = useErgastApi()
const loading = ref(true)
const drivers = ref([])
const constructors = ref([])

const driverLabels = computed(() => 
  drivers.value.map(d => `${d.Driver.givenName} ${d.Driver.familyName}`)
)
const driverPoints = computed(() => 
  drivers.value.map(d => Number(d.points))
)
const driverWins = computed(() => 
  drivers.value.map(d => Number(d.wins))
)

const constructorLabels = computed(() => 
  constructors.value.map(c => c.Constructor.name)
)
const constructorPoints = computed(() => 
  constructors.value.map(c => Number(c.points))
)

const topDrivers = computed(() => 
  drivers.value.slice(0, 5)
)

const topConstructors = computed(() => 
  constructors.value.slice(0, 5)
)

onMounted(async () => {
  try {
    const [driversData, constructorsData] = await Promise.all([
      fetchDriverStandings(),
      fetchConstructorStandings()
    ])
    drivers.value = driversData
    constructors.value = constructorsData
  } catch (error) {
    console.error('Erreur lors du chargement des données:', error)
  } finally {
    loading.value = false
  }
})
</script>