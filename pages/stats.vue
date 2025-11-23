<template>
  <div class="container mx-auto p-4 md:p-6">
    <!-- HEADER -->
    <div class="mb-8 md:mb-12 animate-fade-in">
      <div class="flex items-center justify-between gap-3">
        <div>
          <h1 class="text-3xl md:text-5xl font-display font-bold italic text-white tracking-tight">
            Dashboard <span class="text-f1-red">Statistiques</span>
          </h1>
          <p class="text-gray-400 text-sm md:text-base mt-2">Comparatifs pilotes & constructeurs — points, victoires, Top 5</p>
        </div>
        <span v-if="!loading" class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs md:text-sm text-emerald-400">
          <span class="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span> Données à jour
        </span>
      </div>
      <div class="mt-4 h-1 w-32 bg-gradient-to-r from-f1-red to-transparent rounded"></div>
    </div>

    <!-- KPI CARDS -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12">
      <!-- KPI 1 -->
      <div class="group bg-f1-dark-gray/40 backdrop-blur-md rounded-2xl border border-white/5 p-5 hover:border-f1-red/30 transition-all duration-300">
        <div class="text-xs uppercase tracking-widest text-gray-500 mb-2">Leader Pilotes</div>
        <div class="text-xl md:text-2xl font-display font-bold italic text-white truncate group-hover:text-f1-red transition-colors">
          {{ kpi.leaderDriverName || '—' }}
        </div>
        <div class="text-sm text-gray-400 mt-1">
          Points: <b class="text-white">{{ kpi.leaderDriverPoints ?? '—' }}</b>
        </div>
      </div>

      <!-- KPI 2 -->
      <div class="group bg-f1-dark-gray/40 backdrop-blur-md rounded-2xl border border-white/5 p-5 hover:border-f1-red/30 transition-all duration-300">
        <div class="text-xs uppercase tracking-widest text-gray-500 mb-2">Écart P1 → P2</div>
        <div class="text-3xl md:text-4xl font-bold text-white group-hover:text-f1-red transition-colors">
          {{ kpi.driverGapP1P2 ?? '—' }}
        </div>
        <div class="text-sm text-gray-400 mt-1">points d'avance</div>
      </div>

      <!-- KPI 3 -->
      <div class="group bg-f1-dark-gray/40 backdrop-blur-md rounded-2xl border border-white/5 p-5 hover:border-f1-red/30 transition-all duration-300">
        <div class="text-xs uppercase tracking-widest text-gray-500 mb-2">Leader Constructeurs</div>
        <div class="text-xl md:text-2xl font-display font-bold italic text-white truncate group-hover:text-f1-red transition-colors">
          {{ kpi.leaderConstructorName || '—' }}
        </div>
        <div class="text-sm text-gray-400 mt-1">
          Points: <b class="text-white">{{ kpi.leaderConstructorPoints ?? '—' }}</b>
        </div>
      </div>

      <!-- KPI 4 -->
      <div class="group bg-f1-dark-gray/40 backdrop-blur-md rounded-2xl border border-white/5 p-5 hover:border-f1-red/30 transition-all duration-300">
        <div class="text-xs uppercase tracking-widest text-gray-500 mb-2">Écart C1 → C2</div>
        <div class="text-3xl md:text-4xl font-bold text-white group-hover:text-f1-red transition-colors">
          {{ kpi.constructorGapC1C2 ?? '—' }}
        </div>
        <div class="text-sm text-gray-400 mt-1">points d'avance</div>
      </div>
    </div>

    <!-- CONTENT GRID -->
    <div class="grid gap-8 md:gap-12">
      <!-- DRIVERS POINTS -->
      <div class="bg-f1-dark-gray/40 backdrop-blur-md rounded-2xl border border-white/5 p-6 md:p-8">
        <div class="flex items-center justify-between gap-3 mb-6">
          <h2 class="text-2xl font-display font-bold italic text-white flex items-center gap-3">
            <span class="w-1 h-6 bg-f1-red rounded-full"></span>
            Points des pilotes
          </h2>
          <span class="px-3 py-1 rounded-full bg-white/5 text-xs font-bold text-gray-400 border border-white/10">
            Total: {{ drivers.length || 0 }}
          </span>
        </div>
        <div class="h-[400px] w-full">
          <BarChart
            v-if="!loading"
            :labels="driverLabels"
            :datasets="driverDatasets"
          />
          <div v-else class="h-full flex items-center justify-center">
            <span class="loading loading-spinner loading-lg text-f1-red"></span>
          </div>
        </div>
      </div>

      <!-- CONSTRUCTORS POINTS -->
      <div class="bg-f1-dark-gray/40 backdrop-blur-md rounded-2xl border border-white/5 p-6 md:p-8">
        <div class="flex items-center justify-between gap-3 mb-6">
          <h2 class="text-2xl font-display font-bold italic text-white flex items-center gap-3">
            <span class="w-1 h-6 bg-f1-red rounded-full"></span>
            Points des constructeurs
          </h2>
          <span class="px-3 py-1 rounded-full bg-white/5 text-xs font-bold text-gray-400 border border-white/10">
            Écuries: {{ constructors.length || 0 }}
          </span>
        </div>
        <div class="h-[400px] w-full">
          <BarChart
            v-if="!loading"
            :labels="constructorLabels"
            :datasets="constructorDatasets"
          />
          <div v-else class="h-full flex items-center justify-center">
            <span class="loading loading-spinner loading-lg text-f1-red"></span>
          </div>
        </div>
      </div>

      <!-- TABLES -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- TOP DRIVERS -->
        <div class="bg-f1-dark-gray/40 backdrop-blur-md rounded-2xl border border-white/5 overflow-hidden">
          <div class="p-6 border-b border-white/5">
            <h2 class="text-xl font-display font-bold italic text-white">Top 5 Pilotes</h2>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-left">
              <thead class="bg-white/5 text-gray-400 text-xs uppercase tracking-wider font-medium">
                <tr>
                  <th class="px-6 py-4">#</th>
                  <th class="px-6 py-4">Pilote</th>
                  <th class="px-6 py-4 text-right">Points</th>
                  <th class="px-6 py-4 text-right">Victoires</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-white/5">
                <tr v-for="driver in topDrivers" :key="driver.position" class="hover:bg-white/5 transition-colors group">
                  <td class="px-6 py-4">
                    <span class="font-display font-bold italic text-lg" :class="getPosColor(driver.position)">{{ driver.position }}</span>
                  </td>
                  <td class="px-6 py-4">
                    <div class="font-bold text-white group-hover:text-f1-red transition-colors">
                      {{ driver.Driver.givenName }} {{ driver.Driver.familyName }}
                    </div>
                    <div class="text-xs text-gray-500">{{ driver.Constructors?.[0]?.name || '—' }}</div>
                  </td>
                  <td class="px-6 py-4 text-right font-bold text-white">{{ driver.points }}</td>
                  <td class="px-6 py-4 text-right text-gray-400">{{ driver.wins }}</td>
                </tr>
                <tr v-if="!topDrivers.length">
                  <td colspan="4" class="px-6 py-8 text-center text-gray-500">Aucune donnée</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- TOP CONSTRUCTORS -->
        <div class="bg-f1-dark-gray/40 backdrop-blur-md rounded-2xl border border-white/5 overflow-hidden">
          <div class="p-6 border-b border-white/5">
            <h2 class="text-xl font-display font-bold italic text-white">Top 5 Constructeurs</h2>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-left">
              <thead class="bg-white/5 text-gray-400 text-xs uppercase tracking-wider font-medium">
                <tr>
                  <th class="px-6 py-4">#</th>
                  <th class="px-6 py-4">Écurie</th>
                  <th class="px-6 py-4 text-right">Points</th>
                  <th class="px-6 py-4 text-right">Victoires</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-white/5">
                <tr v-for="constructor in topConstructors" :key="constructor.position" class="hover:bg-white/5 transition-colors group">
                  <td class="px-6 py-4">
                    <span class="font-display font-bold italic text-lg" :class="getPosColor(constructor.position)">{{ constructor.position }}</span>
                  </td>
                  <td class="px-6 py-4">
                    <div class="font-bold text-white group-hover:text-f1-red transition-colors">
                      {{ constructor.Constructor.name }}
                    </div>
                  </td>
                  <td class="px-6 py-4 text-right font-bold text-white">{{ constructor.points }}</td>
                  <td class="px-6 py-4 text-right text-gray-400">{{ constructor.wins }}</td>
                </tr>
                <tr v-if="!topConstructors.length">
                  <td colspan="4" class="px-6 py-8 text-center text-gray-500">Aucune donnée</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- WINS -->
      <div class="bg-f1-dark-gray/40 backdrop-blur-md rounded-2xl border border-white/5 p-6 md:p-8">
        <div class="flex items-center justify-between gap-3 mb-6">
          <h2 class="text-2xl font-display font-bold italic text-white flex items-center gap-3">
            <span class="w-1 h-6 bg-f1-red rounded-full"></span>
            Victoires des pilotes
          </h2>
          <span v-if="kpi.maxWins !== null" class="px-3 py-1 rounded-full bg-f1-red/10 text-xs font-bold text-f1-red border border-f1-red/20">
            Max: {{ kpi.maxWins }}
          </span>
        </div>
        <div class="h-[400px] w-full">
          <BarChart
            v-if="!loading"
            :labels="driverLabels"
            :datasets="driverWinsDatasets"
          />
          <div v-else class="h-full flex items-center justify-center">
            <span class="loading loading-spinner loading-lg text-f1-red"></span>
          </div>
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

// Chart Colors
const driverDatasets = computed(() => [{
  label: 'Points',
  data: driverPoints.value,
  backgroundColor: '#FF1801',
  borderRadius: 4,
  borderWidth: 0,
  barThickness: 'flex',
  maxBarThickness: 30
}])

const constructorDatasets = computed(() => [{
  label: 'Points',
  data: constructorPoints.value,
  backgroundColor: '#38383F',
  hoverBackgroundColor: '#FF1801',
  borderRadius: 4,
  borderWidth: 0,
  barThickness: 'flex',
  maxBarThickness: 40
}])

const driverWinsDatasets = computed(() => [{
  label: 'Victoires',
  data: driverWins.value,
  backgroundColor: '#FFD700', // Gold for wins
  borderRadius: 4,
  borderWidth: 0,
  barThickness: 'flex',
  maxBarThickness: 30
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

const getPosColor = (pos: string) => {
  switch(pos) {
    case '1': return 'text-yellow-400 text-2xl'
    case '2': return 'text-gray-300 text-xl'
    case '3': return 'text-amber-600 text-xl'
    default: return 'text-white/50'
  }
}

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
