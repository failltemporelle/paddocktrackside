<template>
  <div class="container mx-auto px-4 py-6">
    <!-- Header / Breadcrumb -->
    <div class="flex flex-col gap-4 mb-6 lg:flex-row lg:items-center lg:justify-between">
      <div class="flex items-center gap-4">
        <div class="avatar placeholder">
          <div class="bg-neutral text-neutral-content rounded-full w-16">
            <span class="text-xl">{{ driverCode || '?' }}</span>
          </div>
        </div>
        <div>
          <div class="flex items-center gap-3">
            <h1 class="text-3xl font-bold leading-tight">
              {{ driverName || 'Pilote inconnu' }}
            </h1>
            <div v-if="profile?.permanentNumber" class="badge badge-lg badge-neutral">#{{ profile.permanentNumber }}</div>
            <div v-if="profile?.nationality" class="badge badge-outline">{{ profile.nationality }}</div>
          </div>
          <p v-if="profile?.dateOfBirth" class="text-sm opacity-70 mt-1">
            Né le {{ formatDate(profile.dateOfBirth) }} • {{ age }} ans
          </p>
        </div>
      </div>

      <NuxtLink to="/standings" class="btn btn-ghost">← Retour aux classements</NuxtLink>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="grid gap-4">
      <div class="skeleton h-28 w-full"></div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="skeleton h-36 w-full"></div>
        <div class="skeleton h-36 w-full"></div>
        <div class="skeleton h-36 w-full"></div>
      </div>
      <div class="skeleton h-96 w-full"></div>
    </div>

    <!-- Empty state -->
    <div v-else-if="!driverHistory.length" class="text-center py-12">
      <h2 class="text-2xl font-bold mb-2">Aucune donnée disponible pour ce pilote</h2>
      <p class="text-base-content/60 mb-6">Les données historiques ne sont pas disponibles ou le pilote n'a pas encore marqué de points en F1.</p>
      <NuxtLink to="/standings" class="btn btn-primary">Retour aux classements</NuxtLink>
    </div>

    <!-- Dashboard -->
    <div v-else class="grid gap-6">
      <!-- KPI Row -->
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <div class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm opacity-70">Saisons</p>
                <p class="text-3xl font-bold">{{ seasons }}</p>
              </div>
              <div class="btn btn-circle btn-ghost">📅</div>
            </div>
            <p class="text-xs opacity-70 mt-2">De {{ firstSeason }} à {{ lastSeason }}</p>
          </div>
        </div>

        <div class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm opacity-70">Victoires</p>
                <p class="text-3xl font-bold">{{ totalWins }}</p>
              </div>
              <div class="btn btn-circle btn-ghost">🏆</div>
            </div>
            <div class="mt-3">
              <div class="radial-progress" :style="{ '--value': winRatePct, '--size': '3rem' }" role="progressbar">{{ winRatePct }}%</div>
              <p class="text-xs opacity-70 mt-1">Taux de victoire</p>
            </div>
          </div>
        </div>

        <div class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm opacity-70">Points</p>
                <p class="text-3xl font-bold">{{ totalPoints }}</p>
              </div>
              <div class="btn btn-circle btn-ghost">💯</div>
            </div>
            <p class="text-xs opacity-70 mt-2">Meilleure position : P{{ bestPositionDisplay }}</p>
          </div>
        </div>

        <div class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm opacity-70">Podiums</p>
                <p class="text-3xl font-bold">{{ totalPodiums }}</p>
              </div>
              <div class="btn btn-circle btn-ghost">🥈</div>
            </div>
            <p v-if="polesFastest?.poles !== null" class="text-xs opacity-70 mt-2">Poles: {{ polesFastest.poles }} • Meilleurs tours: {{ polesFastest.fastestLaps }}</p>
            <p v-else class="text-xs opacity-70 mt-2">Poles / meilleurs tours indisponibles</p>
          </div>
        </div>
      </div>

      <!-- Charts Row -->
      <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <!-- Points per season -->
        <div class="card bg-base-100 shadow-xl xl:col-span-2">
          <div class="card-body">
            <div class="flex items-center justify-between mb-2">
              <h2 class="card-title">Évolution des points par saison</h2>
              <div class="join">
                <button class="btn btn-sm join-item" :class="{ 'btn-active': chartType==='bar' }" @click="chartType='bar'">Barres</button>
                <button class="btn btn-sm join-item" :class="{ 'btn-active': chartType==='line' }" @click="chartType='line'">Ligne</button>
              </div>
            </div>

            <component
              :is="chartComponent"
              :labels="chartLabels"
              :datasets="[{ label: 'Points', data: chartPoints, backgroundColor: '#E10600', borderColor: '#E10600' }]"
            />
          </div>
        </div>

        <!-- Finishes distribution -->
        <div class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <h2 class="card-title mb-2">Répartition des résultats</h2>
            <div class="flex items-start gap-6">
              <DoughnutChart
                v-if="doughnutData.total > 0"
                :labels="['Victoires','Podiums (hors P1)','Autres']"
                :datasets="[{ data: [doughnutData.wins, doughnutData.podiumsOnly, doughnutData.others] }]"
              />
              <div class="text-sm opacity-80">
                <p>Total courses: <b>{{ totalStarts || 'N/A' }}</b></p>
                <p>Arrivées dans les points: <b>{{ finishesInPoints ?? 'N/A' }}</b></p>
                <p>Abandons (DNF): <b>{{ totalDNF ?? 'N/A' }}</b></p>
                <p>Avg. grille: <b>{{ avgGrid ?? 'N/A' }}</b> • Avg. arrivée: <b>{{ avgFinish ?? 'N/A' }}</b></p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Seasons table -->
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <div class="flex items-center justify-between mb-2">
            <h2 class="card-title">Historique par saison</h2>
            <div class="tabs tabs-boxed">
              <a class="tab" :class="{ 'tab-active': seasonsSort==='desc' }" @click="seasonsSort='desc'">Récent → Ancien</a>
              <a class="tab" :class="{ 'tab-active': seasonsSort==='asc' }" @click="seasonsSort='asc'">Ancien → Récent</a>
            </div>
          </div>
          <div class="overflow-x-auto">
            <table class="table">
              <thead>
                <tr>
                  <th>Saison</th>
                  <th>Équipe</th>
                  <th>Courses</th>
                  <th>Position</th>
                  <th>Points</th>
                  <th>Victoires</th>
                  <th>Podiums</th>
                  <th>Poles</th>
                  <th>Meilleurs tours</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="season in sortedSeasons" :key="season.year">
                  <td class="font-medium">{{ season.year }}</td>
                  <td><div class="badge badge-outline">{{ season.team || '—' }}</div></td>
                  <td>{{ season.races ?? '—' }}</td>
                  <td>
                    <div class="flex items-center gap-2">
                      <span> P{{ season.position }}</span>
                      <span v-if="bestPosition !== null && season.position === bestPosition" class="badge badge-success">Best</span>
                    </div>
                  </td>
                  <td>{{ season.points }}</td>
                  <td>{{ season.wins }}</td>
                  <td>{{ season.podiums ?? '—' }}</td>
                  <td>{{ season.poles ?? '—' }}</td>
                  <td>{{ season.fastestLaps ?? '—' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- About / Bio & quick facts -->
      <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div class="card bg-base-100 shadow-xl xl:col-span-2">
          <div class="card-body">
            <h2 class="card-title">Bio & Infos</h2>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p class="opacity-70">Débuts F1</p>
                <p class="font-medium">{{ debutYear || '—' }}</p>
              </div>
              <div>
                <p class="opacity-70">Dernière saison</p>
                <p class="font-medium">{{ lastSeason }}</p>
              </div>
              <div>
                <p class="opacity-70">Équipe actuelle</p>
                <p class="font-medium">{{ currentTeam || '—' }}</p>
              </div>
              <div>
                <p class="opacity-70">Pays</p>
                <p class="font-medium">{{ profile?.nationality || '—' }}</p>
              </div>
              <div>
                <p class="opacity-70">Code FIA</p>
                <p class="font-medium">{{ driverCode || '—' }}</p>
              </div>
              <div>
                <p class="opacity-70">Numéro</p>
                <p class="font-medium">{{ profile?.permanentNumber || '—' }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <h2 class="card-title">Liens rapides</h2>
            <div class="flex flex-wrap gap-2">
              <NuxtLink :to="`/drivers/${route.params.id}/races/${lastSeason}`" class="btn btn-sm">Résultats {{ lastSeason }}</NuxtLink>
              <NuxtLink :to="`/drivers/${route.params.id}/qualifying/${lastSeason}`" class="btn btn-sm btn-ghost">Qualifs {{ lastSeason }}</NuxtLink>
              <a v-if="profile?.url" :href="profile.url" target="_blank" class="btn btn-sm btn-outline">Profil officiel</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

// Charts: on garde uniquement BarChart pour éviter les imports manquants
import BarChart from '@/components/BarChart.vue'

// Composable
import { useDriverStats } from '@/composables/useDriverStats'

// Types locaux
interface SeasonStat {
  year: number
  position: number
  points: number
  wins: number
  podiums?: number | null
  poles?: number | null
  fastestLaps?: number | null
  team?: string | null
  races?: number | null
  avgGrid?: number | null
  avgFinish?: number | null
}

interface DriverProfile {
  code?: string | null
  givenName?: string | null
  familyName?: string | null
  dateOfBirth?: string | null // ISO
  nationality?: string | null
  permanentNumber?: string | number | null
  url?: string | null
}

const route = useRoute()
const loading = ref(true)

const driverHistory = ref<SeasonStat[]>([])
const profile = ref<DriverProfile | null>(null)

const chartType = ref<'bar' | 'line'>('bar')

const { getDriverHistory, getDriverProfile, getDriverCareerStats } = (useDriverStats?.() as any) ?? {}

// ---------- Helpers de normalisation ----------
function toInt(v: any, def = 0) {
  const n = parseInt(v, 10)
  return Number.isFinite(n) ? n : def
}
function toFloat(v: any, def = 0) {
  const n = parseFloat(v)
  return Number.isFinite(n) ? n : def
}
function orNull<T>(v: T | undefined | null) {
  return v == null ? null : (v as any)
}

function normalizeSeason(h: any): SeasonStat {
  return {
    year: toInt(h?.year ?? h?.season ?? h?.Season, 0),
    position: toInt(h?.position ?? h?.Position, 0),
    points: toFloat(h?.points ?? h?.Points, 0),
    wins: toInt(h?.wins ?? h?.Wins, 0),
    podiums: orNull(h?.podiums),
    poles: orNull(h?.poles),
    fastestLaps: orNull(h?.fastestLaps),
    team: h?.team ?? h?.constructorName ?? h?.Constructor?.name ?? null,
    races: orNull(h?.races),
    avgGrid: orNull(h?.avgGrid),
    avgFinish: orNull(h?.avgFinish),
  }
}

function normalizeProfile(p: any): DriverProfile {
  const d = p?.Driver ?? p ?? {}
  return {
    code: d?.code ?? d?.driverCode ?? null,
    givenName: d?.givenName ?? d?.firstName ?? null,
    familyName: d?.familyName ?? d?.lastName ?? null,
    dateOfBirth: d?.dateOfBirth ?? d?.dob ?? null,
    nationality: d?.nationality ?? null,
    permanentNumber: d?.permanentNumber ?? d?.number ?? null,
    url: d?.url ?? null,
  }
}

// ---------- Labels & datasets ----------
const chartLabels = computed(() => driverHistory.value.map(d => String(d.year)))
const chartPoints = computed(() => driverHistory.value.map(d => (Number.isFinite(d.points) ? d.points : 0)))

// ---------- Aggregations ----------
const totalWins = computed(() => driverHistory.value.reduce((s, x) => s + (Number.isFinite(x.wins) ? x.wins : 0), 0))
const totalPoints = computed(() => driverHistory.value.reduce((s, x) => s + (Number.isFinite(x.points) ? x.points : 0), 0))
const totalPodiums = computed(() => driverHistory.value.reduce((s, x) => s + (Number.isFinite(x.podiums as any) ? (x.podiums as number) : 0), 0))

const firstSeason = computed(() => (driverHistory.value.length ? driverHistory.value[0].year : '—'))
const lastSeason = computed(() => (driverHistory.value.length ? driverHistory.value[driverHistory.value.length - 1].year : '—'))
const seasons = computed(() => driverHistory.value.length)

const bestPosition = computed<number | null>(() => {
  const arr = driverHistory.value.map(d => d.position).filter(n => Number.isFinite(n) && n > 0)
  return arr.length ? Math.min(...arr) : null
})
const bestPositionDisplay = computed(() => bestPosition.value ?? '—')

// ---------- Career stats ----------
const totalStarts = ref<number | null>(null)
const totalDNF = ref<number | null>(null)
const finishesInPoints = ref<number | null>(null)
const avgGrid = ref<number | null>(null)
const avgFinish = ref<number | null>(null)

const winRatePct = computed(() => {
  const starts = totalStarts.value ?? 0
  const wins = totalWins.value ?? 0
  if (!starts) return 0
  const pct = Math.round((wins / starts) * 100)
  return Math.max(0, Math.min(100, pct))
})

const doughnutData = computed(() => {
  const wins = totalWins.value || 0
  const podiums = totalPodiums.value || 0
  const podiumsOnly = Math.max(podiums - wins, 0)
  const starts = totalStarts.value ?? 0
  const others = Math.max(starts - (podiumsOnly + wins), 0)
  return { wins, podiumsOnly, others, total: wins + podiumsOnly + others }
})

const seasonsSort = ref<'asc' | 'desc'>('desc')
const sortedSeasons = computed(() => {
  const data = [...driverHistory.value].sort((a, b) => a.year - b.year)
  return seasonsSort.value === 'asc' ? data : data.reverse()
})

// ---------- Identity helpers ----------
const driverName = computed(() => {
  if (profile.value?.givenName || profile.value?.familyName) {
    return `${profile.value?.givenName ?? ''} ${profile.value?.familyName ?? ''}`.trim()
  }
  const s = driverHistory.value[0] as any
  if (s?.Driver) return `${s.Driver.givenName} ${s.Driver.familyName}`
  return ''
})

const driverCode = computed(() => {
  if (profile.value?.code) return profile.value.code as string
  const s: any = driverHistory.value[0] ?? null
  return s?.Driver?.code ?? ''
})

const currentTeam = computed(() => (driverHistory.value.length ? driverHistory.value[driverHistory.value.length - 1].team ?? null : null))
const debutYear = computed(() => (driverHistory.value.length ? driverHistory.value[0].year : null))

const polesFastest = computed(() => {
  const poles = driverHistory.value.reduce((s, x) => s + (Number.isFinite(x.poles as any) ? (x.poles as number) : 0), 0)
  const fl = driverHistory.value.reduce((s, x) => s + (Number.isFinite(x.fastestLaps as any) ? (x.fastestLaps as number) : 0), 0)
  return { poles, fastestLaps: fl }
})

const chartComponent = computed(() => BarChart) // toggle in UI mais un seul composant actif ici

// ---------- Utils ----------
function formatDate(iso?: string | null) {
  if (!iso) return ''
  const d = new Date(iso)
  return isNaN(d.getTime())
    ? String(iso)
    : d.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
}

const age = computed(() => {
  const dobStr = profile.value?.dateOfBirth
  if (!dobStr) return ''
  const dob = new Date(dobStr)
  if (isNaN(dob.getTime())) return ''
  const diff = Date.now() - dob.getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25))
})

// ---------- Load ----------
onMounted(async () => {
  try {
    const id = String(route.params.id || '').trim()

    // 1) History
    let historyRaw: any = []
    try { historyRaw = await getDriverHistory?.(id) } catch {}
    if (!Array.isArray(historyRaw)) historyRaw = []

    const normalized = historyRaw.map(normalizeSeason).filter((s: SeasonStat) => s.year)
    normalized.sort((a, b) => a.year - b.year)
    driverHistory.value = normalized

    // 2) Profile
    if (getDriverProfile) {
      try {
        const p = await getDriverProfile(id)
        profile.value = normalizeProfile(p)
      } catch { /* noop */ }
    }

    // 3) Career stats
    if (getDriverCareerStats) {
      try {
        const s = await getDriverCareerStats(id)
        totalStarts.value = s?.starts ?? calcStartsFromSeasons(driverHistory.value)
        totalDNF.value = s?.dnf ?? null
        finishesInPoints.value = s?.finishesInPoints ?? null
        avgGrid.value = s?.avgGrid ?? avgFromSeasons(driverHistory.value, 'avgGrid')
        avgFinish.value = s?.avgFinish ?? avgFromSeasons(driverHistory.value, 'avgFinish')
      } catch {
        totalStarts.value = calcStartsFromSeasons(driverHistory.value)
      }
    } else {
      totalStarts.value = calcStartsFromSeasons(driverHistory.value)
    }
  } catch (error) {
    console.error('Erreur lors du chargement des statistiques:', error)
  } finally {
    loading.value = false
  }
})

function calcStartsFromSeasons(seasons: SeasonStat[]): number | null {
  const races = seasons.map(s => s.races).filter((x): x is number => typeof x === 'number' && Number.isFinite(x))
  if (!races.length) return null
  return races.reduce((a, b) => a + b, 0)
}

function avgFromSeasons<T extends keyof SeasonStat>(seasons: SeasonStat[], key: T): number | null {
  const vals = seasons.map(s => s[key]).filter((x): x is number => typeof x === 'number' && Number.isFinite(x))
  if (!vals.length) return null
  const avg = vals.reduce((a, b) => a + b, 0) / vals.length
  return Math.round(avg * 10) / 10
}
</script>

<style scoped>
/* Petits ajustements de layout */
.radial-progress { --thickness: 6px; }
</style>
