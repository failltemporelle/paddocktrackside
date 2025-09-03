<template>
  <div class="container mx-auto p-4 md:p-6">
    <!-- HEADER -->
    <div class="mb-6 md:mb-8">
      <div class="flex items-center justify-between gap-3">
        <div>
          <h1 class="text-2xl md:text-3xl font-extrabold tracking-tight">Dashboard • Statistiques F1</h1>
          <p class="text-gray-500 text-sm md:text-base">Comparatifs pilotes & constructeurs — points, victoires, Top 5</p>
        </div>
        <span v-if="!loading" class="inline-flex items-center gap-2 text-xs md:text-sm text-gray-500">
          <span class="h-2 w-2 rounded-full bg-emerald-500"></span> Données à jour
        </span>
      </div>
      <div class="mt-3 h-1 w-28 bg-gradient-to-r from-red-600 to-red-400 rounded"></div>
    </div>

    <!-- KPI CARDS -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5 mb-6 md:mb-8">
      <div class="card bg-base-100 shadow-sm ring-1 ring-black/5">
        <div class="card-body p-4">
          <div class="text-xs uppercase text-gray-500">Leader Pilotes</div>
          <div class="mt-1 text-lg font-bold truncate">{{ kpi.leaderDriverName || '—' }}</div>
          <div class="text-xs text-gray-500">Points: <b>{{ kpi.leaderDriverPoints ?? '—' }}</b></div>
        </div>
      </div>
      <div class="card bg-base-100 shadow-sm ring-1 ring-black/5">
        <div class="card-body p-4">
          <div class="text-xs uppercase text-gray-500">Écart P1 → P2</div>
          <div class="mt-1 text-lg font-bold">{{ kpi.driverGapP1P2 ?? '—' }}</div>
          <div class="text-xs text-gray-500">points</div>
        </div>
      </div>
      <div class="card bg-base-100 shadow-sm ring-1 ring-black/5">
        <div class="card-body p-4">
          <div class="text-xs uppercase text-gray-500">Leader Constructeurs</div>
          <div class="mt-1 text-lg font-bold truncate">{{ kpi.leaderConstructorName || '—' }}</div>
          <div class="text-xs text-gray-500">Points: <b>{{ kpi.leaderConstructorPoints ?? '—' }}</b></div>
        </div>
      </div>
      <div class="card bg-base-100 shadow-sm ring-1 ring-black/5">
        <div class="card-body p-4">
          <div class="text-xs uppercase text-gray-500">Écart C1 → C2</div>
          <div class="mt-1 text-lg font-bold">{{ kpi.constructorGapC1C2 ?? '—' }}</div>
          <div class="text-xs text-gray-500">points</div>
        </div>
      </div>
    </div>

    <!-- CONTENT GRID -->
    <div class="grid gap-6 md:gap-8">
      <!-- DRIVERS POINTS -->
      <div class="card bg-base-100 shadow-xl ring-1 ring-black/5">
        <div class="card-body">
          <div class="flex items-center justify-between gap-3 mb-2">
            <h2 class="card-title">Points des pilotes</h2>
            <span class="badge badge-ghost">Total pilotes: {{ drivers.length || 0 }}</span>
          </div>
          <BarChart
            v-if="!loading"
            :labels="driverLabels"
            :datasets="driverDatasets"
          />
          <DashboardSkeleton v-else />
        </div>
      </div>

      <!-- CONSTRUCTORS POINTS -->
      <div class="card bg-base-100 shadow-xl ring-1 ring-black/5">
        <div class="card-body">
          <div class="flex items-center justify-between gap-3 mb-2">
            <h2 class="card-title">Points des constructeurs</h2>
            <span class="badge badge-ghost">Écuries: {{ constructors.length || 0 }}</span>
          </div>
          <BarChart
            v-if="!loading"
            :labels="constructorLabels"
            :datasets="constructorDatasets"
          />
          <DashboardSkeleton v-else />
        </div>
      </div>

      <!-- TABLES -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        <!-- TOP DRIVERS -->
        <div class="card bg-base-100 shadow-xl ring-1 ring-black/5">
          <div class="card-body">
            <h2 class="card-title mb-2">Top 5 Pilotes</h2>
            <div class="overflow-x-auto">
              <table class="table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Pilote</th>
                    <th class="text-right">Points</th>
                    <th class="text-right">Victoires</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="driver in topDrivers" :key="driver.position">
                    <td>{{ driver.position }}</td>
                    <td class="whitespace-nowrap">
                      {{ driver.Driver.givenName }} {{ driver.Driver.familyName }}
                      <div class="text-xs text-gray-500">{{ driver.Constructors?.[0]?.name || '—' }}</div>
                    </td>
                    <td class="text-right font-semibold">{{ driver.points }}</td>
                    <td class="text-right">{{ driver.wins }}</td>
                  </tr>
                  <tr v-if="!topDrivers.length">
                    <td colspan="4" class="text-center text-gray-500">Aucune donnée</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- TOP CONSTRUCTORS -->
        <div class="card bg-base-100 shadow-xl ring-1 ring-black/5">
          <div class="card-body">
            <h2 class="card-title mb-2">Top 5 Constructeurs</h2>
            <div class="overflow-x-auto">
              <table class="table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Écurie</th>
                    <th class="text-right">Points</th>
                    <th class="text-right">Victoires</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="constructor in topConstructors" :key="constructor.position">
                    <td>{{ constructor.position }}</td>
                    <td class="whitespace-nowrap">
                      {{ constructor.Constructor.name }}
                    </td>
                    <td class="text-right font-semibold">{{ constructor.points }}</td>
                    <td class="text-right">{{ constructor.wins }}</td>
                  </tr>
                  <tr v-if="!topConstructors.length">
                    <td colspan="4" class="text-center text-gray-500">Aucune donnée</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- WINS -->
      <div class="card bg-base-100 shadow-xl ring-1 ring-black/5">
        <div class="card-body">
          <div class="flex items-center justify-between gap-3 mb-2">
            <h2 class="card-title">Victoires des pilotes</h2>
            <span v-if="kpi.maxWins !== null" class="badge badge-outline">Max: {{ kpi.maxWins }}</span>
          </div>
          <BarChart
            v-if="!loading"
            :labels="driverLabels"
            :datasets="driverWinsDatasets"
          />
          <DashboardSkeleton v-else />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted } from 'vue'
const { fetchDriverStandings, fetchConstructorStandings } = useJolpicaApi()

const loading = ref(true)
const drivers = ref<any[]>([])
const constructors = ref<any[]>([])

const driverLabels = computed(() => drivers.value.map(d => `${d.Driver.givenName} ${d.Driver.familyName}`))
const driverPoints = computed(() => drivers.value.map(d => Number(d.points)))
const driverWins   = computed(() => drivers.value.map(d => Number(d.wins)))

const constructorLabels = computed(() => constructors.value.map(c => c.Constructor.name))
const constructorPoints = computed(() => constructors.value.map(c => Number(c.points)))

const driverDatasets = computed(() => [{
  label: 'Points',
  data: driverPoints.value,
  backgroundColor: (ctx: any) => {
    const chart = ctx.chart
    const { ctx: c, chartArea } = chart
    if (!chartArea) return '#22c55e'
    const gradient = c.createLinearGradient(0, chartArea.bottom, 0, chartArea.top)
    gradient.addColorStop(0, '#16a34a')
    gradient.addColorStop(1, '#22c55e')
    return gradient
  },
  borderRadius: 6,
  borderWidth: 0
}])

const constructorDatasets = computed(() => [{
  label: 'Points',
  data: constructorPoints.value,
  backgroundColor: (ctx: any) => {
    const chart = ctx.chart
    const { ctx: c, chartArea } = chart
    if (!chartArea) return '#ef4444'
    const gradient = c.createLinearGradient(0, chartArea.bottom, 0, chartArea.top)
    gradient.addColorStop(0, '#b91c1c')
    gradient.addColorStop(1, '#ef4444')
    return gradient
  },
  borderRadius: 6,
  borderWidth: 0
}])

const driverWinsDatasets = computed(() => [{
  label: 'Victoires',
  data: driverWins.value,
  backgroundColor: (ctx: any) => {
    const chart = ctx.chart
    const { ctx: c, chartArea } = chart
    if (!chartArea) return '#fb923c'
    const gradient = c.createLinearGradient(0, chartArea.bottom, 0, chartArea.top)
    gradient.addColorStop(0, '#c2410c')
    gradient.addColorStop(1, '#fb923c')
    return gradient
  },
  borderRadius: 6,
  borderWidth: 0
}])

const topDrivers = computed(() => drivers.value.slice(0, 5))
const topConstructors = computed(() => constructors.value.slice(0, 5))

/** KPIs pour le bandeau du haut */
const kpi = reactive({
  leaderDriverName: null as string | null,
  leaderDriverPoints: null as number | null,
  driverGapP1P2: null as number | null,
  leaderConstructorName: null as string | null,
  leaderConstructorPoints: null as number | null,
  constructorGapC1C2: null as number | null,
  maxWins: null as number | null
})

onMounted(async () => {
  try {
    const [driversData, constructorsData] = await Promise.all([
      fetchDriverStandings(),
      fetchConstructorStandings()
    ])
    drivers.value = driversData || []
    constructors.value = constructorsData || []

    // KPIs pilotes
    if (drivers.value.length) {
      const p1 = drivers.value[0]
      const p2 = drivers.value[1]
      kpi.leaderDriverName = `${p1.Driver.givenName} ${p1.Driver.familyName}`
      kpi.leaderDriverPoints = Number(p1.points)
      kpi.driverGapP1P2 = p2 ? Number(p1.points) - Number(p2.points) : 0
      kpi.maxWins = Math.max(...drivers.value.map(d => Number(d.wins || 0)))
    }

    // KPIs constructeurs
    if (constructors.value.length) {
      const c1 = constructors.value[0]
      const c2 = constructors.value[1]
      kpi.leaderConstructorName = c1.Constructor.name
      kpi.leaderConstructorPoints = Number(c1.points)
      kpi.constructorGapC1C2 = c2 ? Number(c1.points) - Number(c2.points) : 0
    }
  } catch (error) {
    console.error('Erreur lors du chargement des données:', error)
  } finally {
    loading.value = false
  }
})
</script>





<style>
/* Tables: alignements cohérents sur mobile aussi */
.table th, .table td { vertical-align: middle; }
</style>
