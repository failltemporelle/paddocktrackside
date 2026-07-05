<template>
  <div class="page-container">
    <!-- Loading state -->
    <div v-if="loading" class="grid gap-4">
      <div class="skeleton h-56 w-full bg-f1-dark-gray/60 rounded-3xl"></div>
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <div class="skeleton h-32 w-full bg-f1-dark-gray/60 rounded-2xl"></div>
        <div class="skeleton h-32 w-full bg-f1-dark-gray/60 rounded-2xl"></div>
        <div class="skeleton h-32 w-full bg-f1-dark-gray/60 rounded-2xl"></div>
        <div class="skeleton h-32 w-full bg-f1-dark-gray/60 rounded-2xl"></div>
      </div>
      <div class="skeleton h-96 w-full bg-f1-dark-gray/60 rounded-2xl"></div>
    </div>

    <!-- Empty state -->
    <div v-else-if="!driverHistory.length" class="text-center py-20 rounded-3xl border border-white/10 bg-f1-dark-gray/60 backdrop-blur-md">
      <h2 class="text-2xl font-bold mb-2 text-white">Aucune donnée disponible pour ce pilote</h2>
      <p class="text-white/50 mb-6">Les données historiques ne sont pas disponibles ou le pilote n'a pas encore marqué de points en F1.</p>
      <NuxtLink to="/standings" class="btn btn-primary">Retour aux classements</NuxtLink>
    </div>

    <!-- Dashboard -->
    <div v-else class="grid gap-6">
      <!-- Hero -->
      <div class="relative overflow-hidden rounded-3xl border border-white/10 bg-f1-dark-gray shadow-2xl">
        <div class="absolute inset-0">
          <img
            :src="driverImage"
            :alt="driverName"
            class="w-full h-full object-cover object-top opacity-30 md:opacity-50"
          />
          <div class="absolute inset-0 bg-gradient-to-r from-f1-black via-f1-black/85 to-f1-black/30"></div>
          <div class="absolute inset-0 bg-gradient-to-t from-f1-black via-transparent to-transparent"></div>
        </div>

        <div class="relative z-10 px-6 py-8 md:px-10 md:py-12 flex flex-col gap-6">
          <div class="flex items-center justify-between">
            <NuxtLink to="/standings" class="text-sm text-white/60 hover:text-white transition-colors">← Retour aux classements</NuxtLink>
            <div v-if="profile?.permanentNumber" class="font-display italic font-extrabold text-5xl md:text-7xl text-white/10 select-none leading-none">
              #{{ profile.permanentNumber }}
            </div>
          </div>

          <div>
            <div class="flex items-center gap-2 mb-2">
              <img
                v-if="nationalityCode !== 'unknown'"
                :src="`https://flagcdn.com/w40/${nationalityCode}.png`"
                :alt="profile?.nationality || ''"
                class="h-3.5 w-5 object-cover rounded shadow-sm"
              />
              <span class="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">{{ profile?.nationality || '—' }}</span>
            </div>
            <h2 class="text-lg md:text-xl font-medium text-white/70 leading-tight">{{ profile?.givenName || '' }}</h2>
            <h1 class="font-display italic font-extrabold uppercase text-4xl md:text-6xl leading-none text-white">
              {{ profile?.familyName || driverName || 'Pilote inconnu' }}
            </h1>
          </div>

          <div class="flex flex-wrap items-center gap-3">
            <div class="flex items-center gap-2 bg-f1-black/60 backdrop-blur-md rounded-full pl-1.5 pr-4 py-1.5 border border-white/10">
              <div
                class="w-2 h-6 rounded-full"
                :style="{ backgroundColor: currentTeamColor, boxShadow: `0 0 10px ${currentTeamColor}80` }"
              ></div>
              <span class="text-sm font-bold text-white">{{ currentTeam || 'Écurie inconnue' }}</span>
            </div>
            <div v-if="profile?.dateOfBirth" class="badge badge-lg border-white/20 bg-transparent text-white/70">
              Né le {{ formatDate(profile.dateOfBirth) }} • {{ age }} ans
            </div>
            <div class="badge badge-lg border-white/20 bg-transparent text-white/70">Débuts {{ debutYear || '—' }}</div>
            <div v-if="driverCode" class="badge badge-lg border-white/20 bg-transparent text-white/70">{{ driverCode }}</div>
          </div>
        </div>
      </div>

      <!-- KPI Row -->
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <div class="rounded-2xl border border-white/10 bg-f1-dark-gray/60 backdrop-blur-md p-5 shadow-lg transition-colors hover:border-f1-red/40">
          <div class="flex items-center justify-between">
            <p class="text-xs uppercase tracking-widest text-white/50 font-semibold">Saisons</p>
            <span class="text-xl">📅</span>
          </div>
          <p class="text-4xl font-display font-bold text-white mt-2">{{ seasons }}</p>
          <p class="text-xs text-white/40 mt-2">De {{ firstSeason }} à {{ lastSeason }}</p>
        </div>

        <div class="rounded-2xl border border-white/10 bg-f1-dark-gray/60 backdrop-blur-md p-5 shadow-lg transition-colors hover:border-f1-red/40">
          <div class="flex items-center justify-between">
            <p class="text-xs uppercase tracking-widest text-white/50 font-semibold">Victoires</p>
            <span class="text-xl">🏆</span>
          </div>
          <p class="text-4xl font-display font-bold text-white mt-2">{{ totalWins }}</p>
          <div class="flex items-center gap-3 mt-3">
            <div class="radial-progress text-f1-red text-xs font-bold" :style="{ '--value': winRatePct, '--size': '2.75rem', '--thickness': '3px' }" role="progressbar">{{ winRatePct }}%</div>
            <p class="text-xs text-white/40">Taux de victoire</p>
          </div>
        </div>

        <div class="rounded-2xl border border-white/10 bg-f1-dark-gray/60 backdrop-blur-md p-5 shadow-lg transition-colors hover:border-f1-red/40">
          <div class="flex items-center justify-between">
            <p class="text-xs uppercase tracking-widest text-white/50 font-semibold">Points</p>
            <span class="text-xl">💯</span>
          </div>
          <p class="text-4xl font-display font-bold text-white mt-2">{{ totalPoints }}</p>
          <p class="text-xs text-white/40 mt-2">Meilleure position : P{{ bestPositionDisplay }}</p>
        </div>

        <div class="rounded-2xl border border-white/10 bg-f1-dark-gray/60 backdrop-blur-md p-5 shadow-lg transition-colors hover:border-f1-red/40">
          <div class="flex items-center justify-between">
            <p class="text-xs uppercase tracking-widest text-white/50 font-semibold">Podiums</p>
            <span class="text-xl">🥈</span>
          </div>
          <p class="text-4xl font-display font-bold text-white mt-2">{{ totalPodiums }}</p>
          <p class="text-xs text-white/40 mt-2">Poles : {{ polesFastest.poles }} • Meilleurs tours : {{ polesFastest.fastestLaps }}</p>
        </div>
      </div>

      <!-- Charts Row -->
      <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <!-- Points per season -->
        <div class="rounded-2xl border border-white/10 bg-f1-dark-gray/60 backdrop-blur-md p-5 shadow-lg xl:col-span-2">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-display font-bold text-white">Évolution des points par saison</h2>
            <div class="join">
              <button class="btn btn-xs join-item" :class="chartType==='bar' ? 'btn-primary' : 'btn-ghost text-white/60'" @click="chartType='bar'">Barres</button>
              <button class="btn btn-xs join-item" :class="chartType==='line' ? 'btn-primary' : 'btn-ghost text-white/60'" @click="chartType='line'">Ligne</button>
            </div>
          </div>

          <component
            :is="chartComponent"
            :labels="chartLabels"
            :datasets="chartDatasets"
          />
        </div>

        <!-- Finishes distribution -->
        <div class="rounded-2xl border border-white/10 bg-f1-dark-gray/60 backdrop-blur-md p-5 shadow-lg">
          <h2 class="text-lg font-display font-bold text-white mb-2">Répartition des résultats</h2>
          <div class="flex flex-col items-center gap-4">
            <DoughnutChart
              v-if="doughnutData.total > 0"
              :labels="['Victoires','Podiums (hors P1)','Autres']"
              :datasets="[{ data: [doughnutData.wins, doughnutData.podiumsOnly, doughnutData.others] }]"
            />
            <div class="w-full text-sm text-white/70 space-y-1.5">
              <p class="flex justify-between"><span class="text-white/40">Total courses</span><b class="text-white">{{ totalStarts ?? 'N/A' }}</b></p>
              <p class="flex justify-between"><span class="text-white/40">Arrivées dans les points</span><b class="text-white">{{ finishesInPoints ?? 'N/A' }}</b></p>
              <p class="flex justify-between"><span class="text-white/40">Abandons (DNF)</span><b class="text-white">{{ totalDNF ?? 'N/A' }}</b></p>
              <p class="flex justify-between"><span class="text-white/40">Grille moyenne</span><b class="text-white">{{ avgGrid ?? 'N/A' }}</b></p>
              <p class="flex justify-between"><span class="text-white/40">Arrivée moyenne</span><b class="text-white">{{ avgFinish ?? 'N/A' }}</b></p>
            </div>
          </div>
        </div>
      </div>

      <!-- Seasons table -->
      <div class="rounded-2xl border border-white/10 bg-f1-dark-gray/60 backdrop-blur-md p-5 shadow-lg">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-display font-bold text-white">Historique par saison</h2>
          <div class="tabs tabs-boxed bg-f1-black/40">
            <a class="tab" :class="{ 'tab-active': seasonsSort==='desc' }" @click="seasonsSort='desc'">Récent → Ancien</a>
            <a class="tab" :class="{ 'tab-active': seasonsSort==='asc' }" @click="seasonsSort='asc'">Ancien → Récent</a>
          </div>
        </div>
        <div class="overflow-x-auto">
          <table class="table">
            <thead>
              <tr class="text-white/40 text-xs uppercase tracking-widest border-white/10">
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
              <tr v-for="season in sortedSeasons" :key="season.year" class="border-white/5 hover:bg-white/5 transition-colors">
                <td class="font-display font-bold text-white">{{ season.year }}</td>
                <td>
                  <div class="flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full flex-shrink-0" :style="{ backgroundColor: getTeamColor(season.teamId) }"></span>
                    <span class="text-white/80">{{ season.team || '—' }}</span>
                  </div>
                </td>
                <td class="text-white/70">{{ season.races ?? '—' }}</td>
                <td>
                  <div class="flex items-center gap-2">
                    <span class="text-white/80">P{{ season.position }}</span>
                    <span v-if="bestPosition !== null && season.position === bestPosition" class="badge badge-sm badge-primary">Best</span>
                  </div>
                </td>
                <td class="text-white/80 font-medium">{{ season.points }}</td>
                <td class="text-white/70">{{ season.wins }}</td>
                <td class="text-white/70">{{ season.podiums ?? '—' }}</td>
                <td class="text-white/70">{{ season.poles ?? '—' }}</td>
                <td class="text-white/70">{{ season.fastestLaps ?? '—' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- About / Bio & quick facts -->
      <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div class="rounded-2xl border border-white/10 bg-f1-dark-gray/60 backdrop-blur-md p-5 shadow-lg xl:col-span-2">
          <h2 class="text-lg font-display font-bold text-white mb-4">Bio & Infos</h2>
          <div class="grid grid-cols-2 md:grid-cols-3 gap-5 text-sm">
            <div>
              <p class="text-white/40 text-xs uppercase tracking-widest mb-1">Débuts F1</p>
              <p class="font-medium text-white">{{ debutYear || '—' }}</p>
            </div>
            <div>
              <p class="text-white/40 text-xs uppercase tracking-widest mb-1">Dernière saison</p>
              <p class="font-medium text-white">{{ lastSeason }}</p>
            </div>
            <div>
              <p class="text-white/40 text-xs uppercase tracking-widest mb-1">Équipe actuelle</p>
              <p class="font-medium text-white">{{ currentTeam || '—' }}</p>
            </div>
            <div>
              <p class="text-white/40 text-xs uppercase tracking-widest mb-1">Pays</p>
              <p class="font-medium text-white">{{ profile?.nationality || '—' }}</p>
            </div>
            <div>
              <p class="text-white/40 text-xs uppercase tracking-widest mb-1">Code FIA</p>
              <p class="font-medium text-white">{{ driverCode || '—' }}</p>
            </div>
            <div>
              <p class="text-white/40 text-xs uppercase tracking-widest mb-1">Numéro</p>
              <p class="font-medium text-white">{{ profile?.permanentNumber || '—' }}</p>
            </div>
          </div>
        </div>

        <div class="rounded-2xl border border-white/10 bg-f1-dark-gray/60 backdrop-blur-md p-5 shadow-lg">
          <h2 class="text-lg font-display font-bold text-white mb-4">Liens rapides</h2>
          <div class="flex flex-wrap gap-2">
            <NuxtLink :to="`/drivers/${route.params.id}/races/${lastSeason}`" class="btn btn-sm btn-primary">Résultats {{ lastSeason }}</NuxtLink>
            <NuxtLink :to="`/drivers/${route.params.id}/qualifying/${lastSeason}`" class="btn btn-sm btn-ghost text-white/70">Qualifs {{ lastSeason }}</NuxtLink>
            <a v-if="profile?.url" :href="profile.url" target="_blank" class="btn btn-sm btn-outline border-white/20 text-white/70">Profil officiel</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

import BarChart from '@/components/BarChart.vue'
import PointsChart from '@/components/PointsChart.vue'
import DoughnutChart from '@/components/DoughnutChart.vue'

import { useDriverStats } from '@/composables/useDriverStats'
import { useDriverImages } from '@/composables/useDriverImages'
import { getTeamColor } from '@/utils/teamColors'
import { getCountryCode } from '@/utils/countryCodes'

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
  teamId?: string | null
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

const { getDriverHistory, getDriverProfile, getDriverCareerStats } = useDriverStats()
const { getDriverImage } = useDriverImages()

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
    teamId: h?.teamId ?? null,
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

// ---------- Image / identité visuelle ----------
const driverImage = computed(() => getDriverImage(String(route.params.id || '')))
const nationalityCode = computed(() => getCountryCode(profile.value?.nationality))

// ---------- Labels & datasets ----------
const chartLabels = computed(() => driverHistory.value.map(d => String(d.year)))
const chartPoints = computed(() => driverHistory.value.map(d => (Number.isFinite(d.points) ? d.points : 0)))
const chartComponent = computed(() => (chartType.value === 'line' ? PointsChart : BarChart))
const chartDatasets = computed(() => {
  if (chartType.value === 'line') {
    return [{ label: 'Points', data: chartPoints.value, borderColor: '#FF1801', backgroundColor: 'rgba(255,24,1,0.15)', fill: true }]
  }
  return [{ label: 'Points', data: chartPoints.value, backgroundColor: '#FF1801', borderColor: '#FF1801' }]
})

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
const currentTeamColor = computed(() => getTeamColor(driverHistory.value.length ? driverHistory.value[driverHistory.value.length - 1].teamId : null))
const debutYear = computed(() => (driverHistory.value.length ? driverHistory.value[0].year : null))

const polesFastest = computed(() => {
  const poles = driverHistory.value.reduce((s, x) => s + (Number.isFinite(x.poles as any) ? (x.poles as number) : 0), 0)
  const fl = driverHistory.value.reduce((s, x) => s + (Number.isFinite(x.fastestLaps as any) ? (x.fastestLaps as number) : 0), 0)
  return { poles, fastestLaps: fl }
})

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

    // Enchaînées (pas en parallèle) pour rester sous le rate-limit de l'API
    const profileRaw = await getDriverProfile(id).catch(() => null)
    const historyRaw = await getDriverHistory(id).catch(() => [])
    const careerStats = await getDriverCareerStats(id).catch(() => null)

    const normalized = (Array.isArray(historyRaw) ? historyRaw : []).map(normalizeSeason).filter((s: SeasonStat) => s.year)

    if (careerStats?.bySeason) {
      normalized.forEach(season => {
        const extra = careerStats.bySeason[season.year]
        if (!extra) return
        season.races = extra.races
        season.podiums = extra.podiums
        season.poles = extra.poles
        season.fastestLaps = extra.fastestLaps
        season.avgGrid = extra.avgGrid
        season.avgFinish = extra.avgFinish
      })
    }

    normalized.sort((a, b) => a.year - b.year)
    driverHistory.value = normalized

    profile.value = normalizeProfile(profileRaw)

    if (careerStats) {
      totalStarts.value = careerStats.starts ?? calcStartsFromSeasons(driverHistory.value)
      totalDNF.value = careerStats.dnf ?? null
      finishesInPoints.value = careerStats.finishesInPoints ?? null
      avgGrid.value = careerStats.avgGrid ?? avgFromSeasons(driverHistory.value, 'avgGrid')
      avgFinish.value = careerStats.avgFinish ?? avgFromSeasons(driverHistory.value, 'avgFinish')
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
