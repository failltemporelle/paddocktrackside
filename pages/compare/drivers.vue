<template>
  <div class="max-w-5xl mx-auto space-y-8">
    <!-- En-tête de page -->
    <header class="animate-fade-in">
      <h1 class="text-3xl md:text-5xl font-display font-bold italic text-white tracking-tight">
        Comparateur de <span class="text-f1-red">pilotes</span>
      </h1>
      <p class="text-gray-400 text-sm md:text-base mt-2 max-w-2xl">
        Choisissez une saison et deux pilotes pour comparer leurs points, victoires, podiums et résultats course par course.
      </p>
      <div class="mt-4 h-1 w-32 bg-gradient-to-r from-f1-red to-transparent rounded" aria-hidden="true"></div>
    </header>

    <!-- Sélection -->
    <section aria-labelledby="cmp-selection-title" class="surface p-5 md:p-6">
      <h2 id="cmp-selection-title" class="sr-only">Sélection de la saison et des pilotes</h2>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label for="cmp-year" class="cmp-label">Saison</label>
          <select id="cmp-year" v-model.number="year" class="select select-bordered cmp-select" @change="onYearChange">
            <option v-for="y in availableYears" :key="y" :value="y">Saison {{ y }}</option>
          </select>
        </div>

        <div>
          <label for="cmp-driver-1" class="cmp-label">
            <span class="cmp-swatch cmp-swatch-first" aria-hidden="true"></span>
            Premier pilote
          </label>
          <select
            id="cmp-driver-1"
            v-model="firstId"
            class="select select-bordered cmp-select"
            :disabled="driversLoading || !drivers.length"
            @change="onDriversChange"
          >
            <option value="">Choisir un pilote</option>
            <option
              v-for="d in drivers"
              :key="d.driverId"
              :value="d.driverId"
              :disabled="d.driverId === secondId"
            >
              {{ d.givenName }} {{ d.familyName }}
            </option>
          </select>
        </div>

        <div>
          <label for="cmp-driver-2" class="cmp-label">
            <span class="cmp-swatch cmp-swatch-second" aria-hidden="true"></span>
            Second pilote
          </label>
          <select
            id="cmp-driver-2"
            v-model="secondId"
            class="select select-bordered cmp-select"
            :disabled="driversLoading || !drivers.length"
            @change="onDriversChange"
          >
            <option value="">Choisir un pilote</option>
            <option
              v-for="d in drivers"
              :key="d.driverId"
              :value="d.driverId"
              :disabled="d.driverId === firstId"
            >
              {{ d.givenName }} {{ d.familyName }}
            </option>
          </select>
        </div>
      </div>

      <div class="mt-4 flex justify-end">
        <button
          type="button"
          class="btn btn-ghost min-h-11 text-gray-300 hover:text-white hover:bg-white/10"
          :disabled="!firstId && !secondId"
          @click="swapDrivers"
        >
          <span aria-hidden="true">⇄</span>
          Inverser les pilotes
        </button>
      </div>
    </section>

    <!-- Annonce vocale des changements d'état -->
    <p class="sr-only" role="status">{{ statusMessage }}</p>

    <!-- Chargement de la liste des pilotes -->
    <div v-if="driversLoading" class="surface p-6" aria-busy="true">
      <div class="skeleton h-6 w-1/2 bg-white/5 rounded-lg mb-3"></div>
      <div class="skeleton h-6 w-1/3 bg-white/5 rounded-lg"></div>
    </div>

    <!-- Erreur de chargement de la liste -->
    <div v-else-if="driversError" class="surface p-6 text-center" role="alert">
      <p class="text-white font-semibold mb-1">Impossible de charger la liste des pilotes.</p>
      <p class="text-gray-400 text-sm mb-5">Vérifiez votre connexion puis réessayez.</p>
      <button type="button" class="cmp-primary-button" @click="retry">Réessayer</button>
    </div>

    <!-- Aucun pilote pour cette saison -->
    <div v-else-if="!drivers.length" class="surface p-6 text-center">
      <p class="text-white font-semibold mb-1">Aucune donnée pour la saison {{ year }}.</p>
      <p class="text-gray-400 text-sm">Choisissez une autre saison.</p>
    </div>

    <!-- Invite : il manque un ou deux pilotes -->
    <div v-else-if="!firstId || !secondId" class="surface p-8 text-center">
      <p class="text-white font-semibold mb-1">Sélectionnez deux pilotes pour lancer la comparaison.</p>
      <p class="text-gray-400 text-sm">Vous pouvez aussi changer de saison à tout moment.</p>
    </div>

    <!-- Chargement de la comparaison -->
    <div v-else-if="compareLoading" class="space-y-4" aria-busy="true">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="skeleton h-28 w-full bg-f1-dark-gray/60 rounded-2xl"></div>
        <div class="skeleton h-28 w-full bg-f1-dark-gray/60 rounded-2xl"></div>
      </div>
      <div class="skeleton h-80 w-full bg-f1-dark-gray/60 rounded-2xl"></div>
    </div>

    <!-- Erreur de chargement de la comparaison -->
    <div v-else-if="compareError" class="surface p-6 text-center" role="alert">
      <p class="text-white font-semibold mb-1">Impossible de charger la comparaison.</p>
      <p class="text-gray-400 text-sm mb-5">Vérifiez votre connexion puis réessayez.</p>
      <button type="button" class="cmp-primary-button" @click="retry">Réessayer</button>
    </div>

    <!-- Résultat -->
    <template v-else-if="comparison">
      <!-- Cartes d'identité -->
      <section aria-label="Pilotes comparés" class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <article
          v-for="(side, index) in sides"
          :key="side.driver.driverId"
          class="surface p-5 flex items-center gap-4"
        >
          <img
            :src="getDriverImage(side.driver.driverId)"
            alt=""
            width="64"
            height="64"
            loading="lazy"
            class="w-16 h-16 rounded-full object-cover object-top bg-f1-black border border-white/10 shrink-0"
            @error="onImageError"
          />
          <div class="min-w-0">
            <h2 class="text-xl md:text-2xl font-display font-bold italic text-white leading-tight">
              <NuxtLink :to="`/drivers/${side.driver.driverId}`" class="hover:text-f1-red transition-colors">
                {{ side.driver.givenName }} {{ side.driver.familyName }}
              </NuxtLink>
            </h2>
            <p class="text-sm text-gray-300 flex items-center gap-2 mt-1">
              <span
                v-if="side.teamId"
                class="inline-block w-2 h-4 rounded-full shrink-0"
                :style="{ backgroundColor: getTeamColor(side.teamId) }"
                aria-hidden="true"
              ></span>
              <span class="truncate">{{ side.team || 'Écurie inconnue' }}</span>
              <span v-if="side.driver.permanentNumber" class="text-gray-400">· n° {{ side.driver.permanentNumber }}</span>
            </p>
            <p class="text-xs text-gray-400 mt-1">
              <span class="cmp-swatch" :class="index === 0 ? 'cmp-swatch-first' : 'cmp-swatch-second'" aria-hidden="true"></span>
              {{ index === 0 ? 'Premier pilote' : 'Second pilote' }}
            </p>
          </div>
        </article>
      </section>

      <p v-if="absentNotice" class="rounded-xl border border-yellow-400/30 bg-yellow-400/10 text-yellow-200 text-sm px-4 py-3" role="status">
        {{ absentNotice }}
      </p>

      <!-- Statistiques de la saison -->
      <section aria-labelledby="cmp-stats-title" class="surface p-5 md:p-6">
        <h2 id="cmp-stats-title" class="cmp-section-title">
          <span class="w-1 h-6 bg-f1-red rounded-full" aria-hidden="true"></span>
          Statistiques de la saison {{ year }}
        </h2>
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <caption class="sr-only">
              Comparaison des statistiques de {{ sides[0].driver.familyName }} et {{ sides[1].driver.familyName }} sur la saison {{ year }}.
              Le meilleur des deux pilotes est signalé par une coche.
            </caption>
            <thead>
              <tr class="text-xs uppercase tracking-wider text-gray-400 border-b border-white/10">
                <th scope="col" class="py-3 pr-3 font-semibold">Statistique</th>
                <th scope="col" class="py-3 px-3 font-semibold text-right">
                  <span class="cmp-swatch cmp-swatch-first" aria-hidden="true"></span>{{ sides[0].driver.familyName }}
                </th>
                <th scope="col" class="py-3 pl-3 font-semibold text-right">
                  <span class="cmp-swatch cmp-swatch-second" aria-hidden="true"></span>{{ sides[1].driver.familyName }}
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/5">
              <tr v-for="row in statRows" :key="row.label">
                <th scope="row" class="py-3 pr-3 text-sm font-medium text-gray-300">{{ row.label }}</th>
                <td
                  v-for="(cell, i) in row.cells"
                  :key="i"
                  class="py-3 text-right tabular-nums"
                  :class="[i === 0 ? 'px-3' : 'pl-3', cell.best ? 'text-white font-bold' : 'text-gray-300']"
                >
                  <span v-if="cell.best" class="text-emerald-400 mr-1" aria-hidden="true">✓</span>
                  {{ cell.text }}<span v-if="cell.best" class="sr-only"> (meilleur)</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- Duel direct -->
      <section v-if="duel" aria-labelledby="cmp-duel-title" class="surface p-5 md:p-6">
        <h2 id="cmp-duel-title" class="cmp-section-title">
          <span class="w-1 h-6 bg-f1-red rounded-full" aria-hidden="true"></span>
          Duel direct
        </h2>
        <p class="text-sm text-gray-400 mb-5">
          Nombre de manches où chaque pilote devance l'autre, sur les manches auxquelles les deux ont pris part.
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-for="item in duel" :key="item.label" class="rounded-xl bg-white/5 border border-white/10 p-4">
            <p class="text-xs uppercase tracking-wider text-gray-400 mb-3">{{ item.label }}</p>
            <p class="flex items-baseline justify-between gap-2 font-display font-bold text-white">
              <span class="text-3xl tabular-nums">{{ item.first }}</span>
              <span class="text-sm text-gray-400 font-sans font-medium text-center">
                {{ sides[0].driver.familyName }} – {{ sides[1].driver.familyName }}
              </span>
              <span class="text-3xl tabular-nums">{{ item.second }}</span>
            </p>
          </div>
        </div>
      </section>

      <!-- Points cumulés -->
      <section v-if="roundRows.length" aria-labelledby="cmp-chart-title" class="surface p-5 md:p-6">
        <h2 id="cmp-chart-title" class="cmp-section-title">
          <span class="w-1 h-6 bg-f1-red rounded-full" aria-hidden="true"></span>
          Points cumulés au fil de la saison
        </h2>
        <PointsChart
          :labels="chartLabels"
          :datasets="chartDatasets"
          :aria-label="chartAriaLabel"
        />
        <p class="text-xs text-gray-400 mt-3">Les points incluent les courses Sprint. Le détail manche par manche figure dans le tableau ci-dessous.</p>
      </section>

      <!-- Course par course -->
      <section v-if="roundRows.length" aria-labelledby="cmp-rounds-title" class="surface p-5 md:p-6">
        <h2 id="cmp-rounds-title" class="cmp-section-title">
          <span class="w-1 h-6 bg-f1-red rounded-full" aria-hidden="true"></span>
          Résultats course par course
        </h2>
        <div
          class="overflow-x-auto"
          role="region"
          tabindex="0"
          aria-label="Résultats course par course, défilement horizontal possible"
        >
          <table class="w-full min-w-[640px] text-left text-sm">
            <caption class="sr-only">
              Qualifications, arrivée et points de {{ sides[0].driver.familyName }} et {{ sides[1].driver.familyName }} pour chaque Grand Prix de {{ year }}.
            </caption>
            <thead>
              <tr class="text-xs uppercase tracking-wider text-gray-400">
                <th scope="col" rowspan="2" class="py-3 pr-3 font-semibold align-bottom">Grand Prix</th>
                <th scope="colgroup" colspan="3" class="pt-3 px-3 font-semibold text-center border-l border-white/10">
                  <span class="cmp-swatch cmp-swatch-first" aria-hidden="true"></span>{{ sides[0].driver.familyName }}
                </th>
                <th scope="colgroup" colspan="3" class="pt-3 pl-3 font-semibold text-center border-l border-white/10">
                  <span class="cmp-swatch cmp-swatch-second" aria-hidden="true"></span>{{ sides[1].driver.familyName }}
                </th>
              </tr>
              <tr class="text-xs text-gray-400 border-b border-white/10">
                <th scope="col" class="py-2 px-3 font-medium text-right border-l border-white/10">Qualif.</th>
                <th scope="col" class="py-2 px-3 font-medium text-right">Arrivée</th>
                <th scope="col" class="py-2 px-3 font-medium text-right">Pts</th>
                <th scope="col" class="py-2 px-3 font-medium text-right border-l border-white/10">Qualif.</th>
                <th scope="col" class="py-2 px-3 font-medium text-right">Arrivée</th>
                <th scope="col" class="py-2 pl-3 font-medium text-right">Pts</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/5">
              <tr v-for="row in roundRows" :key="row.round">
                <th scope="row" class="py-3 pr-3 font-medium text-gray-300">
                  <NuxtLink :to="`/races/${year}/${row.round}`" class="hover:text-white hover:underline underline-offset-2">
                    <span class="text-gray-400 tabular-nums">{{ row.round }}.</span> {{ row.name }}
                  </NuxtLink>
                </th>
                <template v-for="(entry, i) in [row.first, row.second]" :key="i">
                  <td class="py-3 px-3 text-right tabular-nums text-gray-300 border-l border-white/10">
                    {{ entry?.qualifying ?? '—' }}<span v-if="!entry" class="sr-only">Absent</span>
                  </td>
                  <td
                    class="py-3 px-3 text-right tabular-nums"
                    :class="row.winner === i ? 'text-white font-bold' : 'text-gray-300'"
                  >
                    {{ finishLabel(entry) }}
                  </td>
                  <td class="py-3 text-right tabular-nums text-gray-300" :class="i === 0 ? 'px-3' : 'pl-3'">
                    {{ entry ? formatNumber(entry.racePoints + entry.sprintPoints) : '—' }}
                  </td>
                </template>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { DriverSeason, RoundEntry, SeasonDriver } from '~/composables/useDriverComparison'
import { getTeamColor } from '~/utils/teamColors'

const { generateMeta } = useSeo()
useHead(generateMeta({
  title: 'Comparateur de pilotes F1 : statistiques face à face | Paddock Track Side',
  description: 'Comparez deux pilotes de Formule 1 sur une saison : points, victoires, podiums, poles, duel direct et évolution course par course.',
  path: '/compare/drivers'
}))

const route = useRoute()
const router = useRouter()
const { fetchSeasonDrivers, fetchComparison } = useDriverComparison()
const { getDriverImage } = useDriverImages()

const currentYear = new Date().getFullYear()
const MIN_YEAR = 1950
const availableYears = Array.from({ length: currentYear - MIN_YEAR + 1 }, (_, i) => currentYear - i)

// ---------- État initial, lu dans l'URL (?year=2024&d1=...&d2=...) ----------
const queryYear = parseInt(String(route.query.year), 10)
const hasYearInQuery = Number.isFinite(queryYear) && queryYear >= MIN_YEAR && queryYear <= currentYear
const year = ref(hasYearInQuery ? queryYear : currentYear)
const firstId = ref(typeof route.query.d1 === 'string' ? route.query.d1 : '')
const secondId = ref(typeof route.query.d2 === 'string' ? route.query.d2 : '')

const drivers = ref<SeasonDriver[]>([])
const driversLoading = ref(true)
const driversError = ref(false)

const comparison = ref<[DriverSeason, DriverSeason] | null>(null)
const compareLoading = ref(false)
const compareError = ref(false)

// Jetons pour ignorer les réponses obsolètes quand l'utilisateur change vite de sélection
let driversToken = 0
let compareToken = 0

const syncUrl = () => {
  router.replace({
    query: {
      year: String(year.value),
      d1: firstId.value || undefined,
      d2: secondId.value || undefined
    }
  })
}

// ---------- Chargements ----------
const loadComparison = async () => {
  const first = drivers.value.find(d => d.driverId === firstId.value)
  const second = drivers.value.find(d => d.driverId === secondId.value)
  const token = ++compareToken
  comparison.value = null
  compareError.value = false

  if (!first || !second || first.driverId === second.driverId) {
    compareLoading.value = false
    return
  }

  compareLoading.value = true
  try {
    const result = await fetchComparison(year.value, first, second)
    if (token === compareToken) comparison.value = result
  } catch (error) {
    console.error('Erreur lors du chargement de la comparaison :', error)
    if (token === compareToken) compareError.value = true
  } finally {
    if (token === compareToken) compareLoading.value = false
  }
}

// allowFallback : au premier chargement sans année dans l'URL, si la saison en cours
// n'a pas encore de pilotes (intersaison), on bascule sur la saison précédente.
const loadDrivers = async (allowFallback = false) => {
  const token = ++driversToken
  driversLoading.value = true
  driversError.value = false
  comparison.value = null
  compareError.value = false
  try {
    let list = await fetchSeasonDrivers(year.value)
    if (!list.length && allowFallback && year.value === currentYear) {
      year.value = currentYear - 1
      list = await fetchSeasonDrivers(year.value)
    }
    if (token !== driversToken) return
    drivers.value = list
    // Retire les sélections absentes de la saison choisie
    if (!list.some(d => d.driverId === firstId.value)) firstId.value = ''
    if (!list.some(d => d.driverId === secondId.value)) secondId.value = ''
    if (firstId.value && firstId.value === secondId.value) secondId.value = ''
    driversLoading.value = false
    syncUrl()
    await loadComparison()
  } catch (error) {
    console.error('Erreur lors du chargement des pilotes :', error)
    if (token === driversToken) {
      drivers.value = []
      driversError.value = true
      driversLoading.value = false
    }
  }
}

const onYearChange = () => loadDrivers()

const onDriversChange = () => {
  syncUrl()
  loadComparison()
}

const swapDrivers = () => {
  ;[firstId.value, secondId.value] = [secondId.value, firstId.value]
  onDriversChange()
}

// « Réessayer » relance l'étape qui a échoué
const retry = () => (driversError.value ? loadDrivers() : loadComparison())

onMounted(() => loadDrivers(!hasYearInQuery))

// ---------- Présentation ----------
const sides = computed(() => comparison.value as [DriverSeason, DriverSeason])

const formatNumber = (value: number | null, digits = 1) =>
  value === null || value === undefined
    ? '—'
    : value.toLocaleString('fr-FR', { maximumFractionDigits: digits })

const ordinal = (position: number | null) =>
  position === null ? '—' : position === 1 ? '1er' : `${position}e`

// Libellés des résultats non classés (positionText de l'API)
const NON_CLASSIFIED: Record<string, string> = {
  R: 'Abandon',
  D: 'Disqualifié',
  E: 'Exclu',
  W: 'Forfait',
  F: 'Non qualifié',
  N: 'Non classé'
}

const finishLabel = (entry?: RoundEntry) => {
  if (!entry) return '—'
  if (entry.finish !== null) return String(entry.finish)
  return NON_CLASSIFIED[entry.positionText ?? ''] ?? 'Non classé'
}

interface StatCell { text: string; best: boolean }
interface StatRow { label: string; cells: [StatCell, StatCell] }

// « high » : la plus grande valeur est la meilleure ; « low » : la plus petite ; « none » : pas de gagnant
const buildRow = (
  label: string,
  pick: (s: DriverSeason) => number | null,
  better: 'high' | 'low' | 'none',
  format: (v: number | null) => string = v => formatNumber(v, 0)
): StatRow => {
  const a = pick(sides.value[0])
  const b = pick(sides.value[1])
  const comparable = better !== 'none' && a !== null && b !== null && a !== b
  const firstBest = comparable && (better === 'high' ? a! > b! : a! < b!)
  const secondBest = comparable && !firstBest
  return {
    label,
    cells: [
      { text: format(a), best: firstBest },
      { text: format(b), best: secondBest }
    ]
  }
}

const statRows = computed<StatRow[]>(() => {
  if (!comparison.value) return []
  return [
    buildRow('Position au championnat', s => s.championshipPosition, 'low', ordinal),
    buildRow('Points', s => s.points, 'high', v => formatNumber(v, 1)),
    buildRow('Victoires', s => s.wins, 'high'),
    buildRow('Podiums', s => s.podiums, 'high'),
    buildRow('Pole positions', s => s.poles, 'high'),
    buildRow('Meilleurs tours en course', s => s.fastestLaps, 'high'),
    buildRow('Courses avec des points', s => s.pointsFinishes, 'high'),
    buildRow('Meilleur résultat en course', s => s.bestFinish, 'low', v => (v === null ? '—' : `P${v}`)),
    buildRow('Position d\'arrivée moyenne', s => s.avgFinish, 'low', v => formatNumber(v, 1)),
    buildRow('Position moyenne en qualifications', s => s.avgQualifying, 'low', v => formatNumber(v, 1)),
    buildRow('Abandons / non classés', s => s.nonClassified, 'low'),
    buildRow('Courses disputées', s => s.races, 'none')
  ]
})

// Prévient si un pilote sélectionné n'a disputé aucune course cette saison
const absentNotice = computed(() => {
  if (!comparison.value) return ''
  const missing = comparison.value.filter(s => s.races === 0).map(s => `${s.driver.givenName} ${s.driver.familyName}`)
  if (!missing.length) return ''
  return missing.length === 2
    ? `Aucun des deux pilotes n'a de résultat de course en ${year.value}.`
    : `${missing[0]} n'a pas de résultat de course en ${year.value} : ses statistiques sont vides.`
})

// Une ligne par manche à laquelle au moins un des deux pilotes a participé
const roundRows = computed(() => {
  if (!comparison.value) return []
  const [a, b] = comparison.value
  const names = new Map<number, string>()
  ;[...a.rounds, ...b.rounds].forEach(r => names.set(r.round, r.raceName.replace(/ Grand Prix$/, '')))
  const isRaceEntry = (e?: RoundEntry) => !!e && (e.finish !== null || e.positionText !== null)
  return [...names.keys()]
    .sort((x, y) => x - y)
    .map(round => {
      const first = a.rounds.find(r => r.round === round)
      const second = b.rounds.find(r => r.round === round)
      let winner: number | null = null
      if (isRaceEntry(first) && isRaceEntry(second)) {
        const fa = first!.finish ?? Infinity
        const fb = second!.finish ?? Infinity
        if (fa !== fb) winner = fa < fb ? 0 : 1
      }
      return { round, name: names.get(round)!, first, second, winner }
    })
})

// Duel direct : uniquement sur les manches communes aux deux pilotes
const duel = computed(() => {
  if (!comparison.value) return null
  const count = (pick: (e: RoundEntry) => number | null) => {
    let first = 0
    let second = 0
    for (const row of roundRows.value) {
      if (!row.first || !row.second) continue
      const fa = pick(row.first)
      const fb = pick(row.second)
      if (fa === null && fb === null) continue
      // un résultat absent (non classé) est considéré derrière un résultat valide
      const ra = fa ?? Infinity
      const rb = fb ?? Infinity
      if (ra < rb) first++
      else if (rb < ra) second++
    }
    return { first, second }
  }
  return [
    { label: 'En course (position d\'arrivée)', ...count(e => e.finish) },
    { label: 'En qualifications', ...count(e => e.qualifying) }
  ]
})

// Points cumulés (course + sprint) au fil des manches
const chartLabels = computed(() => roundRows.value.map(r => `${r.round}. ${r.name}`))

const cumulative = (side: 0 | 1) => {
  let total = 0
  return roundRows.value.map(row => {
    const entry = side === 0 ? row.first : row.second
    total += entry ? entry.racePoints + entry.sprintPoints : 0
    return total
  })
}

// Deux séries distinctes par la couleur ET par le trait (plein / pointillé)
const chartDatasets = computed(() => {
  if (!comparison.value) return []
  const [a, b] = comparison.value
  return [
    {
      label: `${a.driver.givenName} ${a.driver.familyName}`,
      data: cumulative(0),
      borderColor: '#FF1801',
      backgroundColor: '#FF1801',
      fill: false,
      tension: 0.2
    },
    {
      label: `${b.driver.givenName} ${b.driver.familyName}`,
      data: cumulative(1),
      borderColor: '#E5E7EB',
      backgroundColor: '#E5E7EB',
      borderDash: [6, 4],
      fill: false,
      tension: 0.2
    }
  ]
})

const chartAriaLabel = computed(() => {
  if (!comparison.value) return ''
  const [a, b] = comparison.value
  const last = (side: 0 | 1) => cumulative(side).slice(-1)[0] ?? 0
  return `Courbes des points cumulés en ${year.value} : ${a.driver.familyName} ${formatNumber(last(0))} points, ${b.driver.familyName} ${formatNumber(last(1))} points.`
})

const statusMessage = computed(() => {
  if (compareLoading.value) return 'Chargement de la comparaison'
  if (comparison.value) {
    return `Comparaison chargée : ${comparison.value[0].driver.familyName} et ${comparison.value[1].driver.familyName}, saison ${year.value}`
  }
  return ''
})

const onImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  if (!img.src.endsWith('/images/driver-placeholder.jpg')) img.src = '/images/driver-placeholder.jpg'
}
</script>

<style scoped>
/* Surface : même recette que les autres cartes du site */
.surface {
  @apply bg-f1-dark-gray/60 backdrop-blur-md border border-white/10 rounded-2xl shadow-lg;
}

.cmp-label {
  @apply flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-gray-300;
}

.cmp-select {
  @apply w-full min-h-11 bg-f1-black/60 border-white/20 text-white rounded-xl;
}

.cmp-select:disabled {
  @apply opacity-60 cursor-not-allowed;
}

.cmp-section-title {
  @apply flex items-center gap-3 mb-4 text-xl md:text-2xl font-display font-bold italic text-white;
}

.cmp-primary-button {
  @apply inline-flex items-center justify-center min-h-11 px-6 py-3 rounded-xl bg-f1-red-action text-white font-bold hover:brightness-110 transition;
}

/* Pastilles d'identification des deux pilotes : trait plein rouge / trait blanc pointillé
   (la couleur n'est pas la seule information : le libellé est toujours présent). */
.cmp-swatch {
  @apply inline-block w-4 h-1 rounded-full mr-2 align-middle;
}

.cmp-swatch-first {
  background-color: #FF1801;
}

.cmp-swatch-second {
  background-image: repeating-linear-gradient(90deg, #E5E7EB 0 4px, transparent 4px 6px);
}
</style>
