<template>
    <div class="min-h-screen bg-[#1a1b1f] text-white">
      <div class="max-w-7xl mx-auto px-4 py-8">
        <!-- Header -->
        <div class="flex items-center justify-between mb-8">
          <div>
            <h1 class="text-3xl font-bold tracking-tight">F1 Dashboard</h1>
            <p class="text-zinc-400">Données en direct via l'API Jolpica — saison en cours</p>
          </div>
          <div class="flex items-center gap-2 text-zinc-300">
            <Icon name="mdi:car-sports" class="w-6 h-6" />
            <span v-if="season">{{ season }}</span>
            <span v-if="updatedAt" class="text-xs text-zinc-500">MAJ {{ updatedAt }}</span>
          </div>
        </div>
  
        <!-- KPI Row -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <KpiCard title="Courses disputées" :value="racesCompleted" :subtitle="'Sur ' + totalRounds + ' prévues'" tone="emerald" />
          <KpiCard title="Prochaine course" :value="nextRace?.raceName || '—'" :subtitle="nextRaceSubtitle" tone="cyan" />
          <KpiCard title="Leader pilotes" :value="topDriver?.Driver?.familyName || '—'" :subtitle="(topDriver?.points || 0) + ' pts'" tone="violet" />
          <KpiCard title="Leader écuries" :value="topTeam?.Constructor?.name || '—'" :subtitle="(topTeam?.points || 0) + ' pts'" tone="lime" />
        </div>
  
        <!-- Charts Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <NeonCard title="Points — Top 10 pilotes" subtitle="Comparaison des points cumulés">
            <ClientOnly>
              <apexchart height="260" type="bar" :options="charts.pointsTop10.options" :series="charts.pointsTop10.series" />
            </ClientOnly>
          </NeonCard>
  
          <NeonCard title="Points — Constructeurs" subtitle="Classement écuries">
            <ClientOnly>
              <apexchart height="260" type="bar" :options="charts.teams.options" :series="charts.teams.series" />
            </ClientOnly>
          </NeonCard>
  
          <NeonCard title="Victoires par pilote" subtitle="Saison en cours">
            <ClientOnly>
              <apexchart height="260" type="bar" :options="charts.winsByDriver.options" :series="charts.winsByDriver.series" />
            </ClientOnly>
          </NeonCard>
  
          <NeonCard title="Victoires par écurie" subtitle="Répartition" variant="glow-red">
            <ClientOnly>
              <apexchart height="260" type="radialBar" :options="charts.winsByTeam.options" :series="charts.winsByTeam.series" />
            </ClientOnly>
          </NeonCard>
  
          <NeonCard title="Meilleurs tours" subtitle="Par pilote">
            <ClientOnly>
              <apexchart height="260" type="bar" :options="charts.fastestByDriver.options" :series="charts.fastestByDriver.series" />
            </ClientOnly>
          </NeonCard>
  
          <NeonCard title="Podiums par pilote" subtitle="Top 12">
            <ClientOnly>
              <apexchart height="260" type="bar" :options="charts.podiums.options" :series="charts.podiums.series" />
            </ClientOnly>
          </NeonCard>
  
          <NeonCard title="Progression points (Top 5)" subtitle="par manche" variant="glow-green">
            <ClientOnly>
              <apexchart height="260" type="line" :options="charts.pointsProgress.options" :series="charts.pointsProgress.series" />
            </ClientOnly>
          </NeonCard>
  
          <NeonCard title="Abandons par écurie" subtitle="DNF ou DSQ">
            <ClientOnly>
              <apexchart height="260" type="bar" :options="charts.dnfByTeam.options" :series="charts.dnfByTeam.series" />
            </ClientOnly>
          </NeonCard>
        </div>

        <!-- Statistiques historiques -->
        <div class="mt-12">
          <h2 class="text-2xl font-bold mb-6">Statistiques historiques</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <KpiCard
              v-for="stat in allTimeStats"
              :key="stat.title"
              :title="stat.title"
              :value="stat.value"
              :subtitle="stat.subtitle"
              :tone="stat.tone"
            />
          </div>
        </div>

        <p class="mt-10 text-xs text-zinc-500">
          Source: <a class="underline" href="https://jolpi.ca/" target="_blank" rel="noopener noreferrer">Jolpica API</a>
      </p>
      </div>
    </div>
  </template>
  
  <script setup lang="tsx">
  // Dépendances :
  // npm i -S apexcharts vue3-apexcharts
  // plugins/apexcharts.client.ts :
  // import VueApexCharts from 'vue3-apexcharts'
  // export default defineNuxtPlugin((nuxtApp) => {
  //   nuxtApp.vueApp.use(VueApexCharts)
  //   nuxtApp.vueApp.component('apexchart', VueApexCharts)
  // })
  
  import { ref, computed, reactive, watchEffect, defineComponent, onMounted } from 'vue'

  /* -------------------- Fetch Jolpica -------------------- */
  const { fetchDriverStandings, fetchConstructorStandings, fetchRaces, fetchRaceResults } = useJolpicaApi()

  const driverStandings = ref<any[]>([])
  const constructorStandings = ref<any[]>([])
  const schedule = ref<any[]>([])
  const allResults = ref<any[]>([])

  // Statistiques historiques (données arrêtées en 2024)
  const allTimeStats = [
    { title: 'Pilote le plus titré', value: 'M. Schumacher & L. Hamilton', subtitle: '7 titres', tone: 'emerald' },
    { title: 'Pilote le plus victorieux', value: 'Lewis Hamilton', subtitle: '103 victoires', tone: 'cyan' },
    { title: 'Écurie la plus victorieuse', value: 'Ferrari', subtitle: '243 victoires', tone: 'violet' },
    { title: 'Écurie la plus titrée', value: 'Ferrari', subtitle: '16 titres constructeurs', tone: 'lime' },
    { title: 'Record de pole positions', value: 'Lewis Hamilton', subtitle: '104 poles', tone: 'emerald' },
    { title: 'Record de podiums', value: 'Lewis Hamilton', subtitle: '197 podiums', tone: 'cyan' }
  ]

  onMounted(async () => {
    try {
      const [driversData, constructorsData, races] = await Promise.all([
        fetchDriverStandings(),
        fetchConstructorStandings(),
        fetchRaces()
      ])
      driverStandings.value = driversData || []
      constructorStandings.value = constructorsData || []
      schedule.value = races || []

      for (const race of races || []) {
        const res = await fetchRaceResults(race.season, race.round)
        if (res[0]?.Results?.length) {
          allResults.value.push(res[0])
        }
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error)
    }
  })
  
  /* -------------------- Méta/KPI -------------------- */
  const season = computed(() => schedule.value?.[0]?.season)
  const updatedAt = new Date().toLocaleTimeString()
  
  const standingsList = computed(() => driverStandings.value || [])
  const teamStandingsList = computed(() => constructorStandings.value || [])
  
  const totalRounds = computed(() => schedule.value.length)
  const racesCompleted = computed(() => allResults.value.length)
  const nextRace = computed(() => {
    const now = new Date()
    return schedule.value.find((r: any) => new Date(r.date + 'T' + (r.time || '00:00:00Z')) > now)
  })
  const nextRaceSubtitle = computed(() => {
    if (!nextRace.value) return '—'
    const d = new Date(nextRace.value.date + 'T' + (nextRace.value.time || '00:00:00Z'))
    return (nextRace.value?.Circuit?.Location?.country || '') + ' • ' + d.toLocaleDateString()
  })
  const topDriver = computed(() => standingsList.value?.[0])
  const topTeam   = computed(() => teamStandingsList.value?.[0])
  
  /* -------------------- Options helpers -------------------- */
  function buildBarOptions(categories: string[], color = '#22d3ee') {
    return {
      chart: { background: 'transparent', toolbar: { show: false } },
      grid: { borderColor: 'rgba(255,255,255,0.08)', yaxis: { lines: { show: false } } },
      xaxis: {
        categories,
        labels: { style: { colors: '#a1a1aa' } },
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      yaxis: { labels: { style: { colors: '#71717a' } } },
      tooltip: { theme: 'dark' },
      plotOptions: {
        bar: { horizontal: false, columnWidth: '55%', borderRadius: 6, colors: { ranges: [], backgroundBarOpacity: 0.1 } },
      },
      dataLabels: { enabled: false },
      theme: { mode: 'dark' },
      colors: [color],
    }
  }
  
  /* -------------------- Charts data -------------------- */
  const charts = reactive({
    pointsTop10: { options: {}, series: [] as any[] },
    teams: { options: {}, series: [] as any[] },
    winsByDriver: { options: {}, series: [] as any[] },
    winsByTeam: { options: {}, series: [] as any[] },
    fastestByDriver: { options: {}, series: [] as any[] },
    podiums: { options: {}, series: [] as any[] },
    pointsProgress: { options: {}, series: [] as any[] },
    dnfByTeam: { options: {}, series: [] as any[] },
  })
  
  watchEffect(() => {
    // Points Top 10 pilotes
    const top10 = standingsList.value.slice(0, 10)
    const cats  = top10.map((d: any) => d.Driver.familyName + '')
    const vals  = top10.map((d: any) => Number(d.points))
    charts.pointsTop10 = { options: buildBarOptions(cats, '#22d3ee'), series: [{ name: 'Points', data: vals }] }
  
    // Points constructeurs
    const tCats = teamStandingsList.value.map((c: any) => c.Constructor.name)
    const tVals = teamStandingsList.value.map((c: any) => Number(c.points))
    charts.teams = { options: buildBarOptions(tCats, '#34d399'), series: [{ name: 'Points', data: tVals }] }
  
    // Victoires
    const winRaces = allResults.value
    const winByDriver: Record<string, number> = {}
    const winByTeam:   Record<string, number> = {}
    for (const r of winRaces) {
      const res = r.Results?.[0]
      if (!res) continue
      const driver = res.Driver.familyName + ''
      const team   = res.Constructor?.name
      winByDriver[driver] = (winByDriver[driver] || 0) + 1
      winByTeam[team]     = (winByTeam[team]     || 0) + 1
    }
    const dPairs = Object.entries(winByDriver).sort((a, b) => b[1] - a[1])
    charts.winsByDriver = { options: buildBarOptions(dPairs.map(([k]) => k), '#a78bfa'), series: [{ name: 'Victoires', data: dPairs.map(([, v]) => v) }] }

    const tPairs = Object.entries(winByTeam).sort((a, b) => b[1] - a[1])
    charts.winsByTeam = {
      options: {
        chart: { background: 'transparent', toolbar: { show: false } },
        labels: tPairs.map(([k]) => k),
        legend: { show: true, labels: { colors: '#a1a1aa' } },
        plotOptions: { radialBar: { hollow: { size: '35%' }, dataLabels: { name: { color: '#a1a1aa' }, value: { color: '#fff' } } } },
        theme: { mode: 'dark' },
        colors: ['#34d399', '#22d3ee', '#a78bfa', '#bef264', '#f87171', '#86efac'],
      },
      series: tPairs.map(([, v]) => v),
    }
  
    // Meilleurs tours
    const flRaces = allResults.value
    const flByDriver: Record<string, number> = {}
    for (const r of flRaces) {
      const dr = r.Results?.find((res: any) => res.FastestLap?.rank === '1')?.Driver?.familyName
      if (!dr) continue
      flByDriver[dr] = (flByDriver[dr] || 0) + 1
    }
    const flPairs = Object.entries(flByDriver).sort((a, b) => b[1] - a[1]).slice(0, 12)
    charts.fastestByDriver = { options: buildBarOptions(flPairs.map(([k]) => k), '#bef264'), series: [{ name: 'Fastest Laps', data: flPairs.map(([, v]) => v) }] }
  
    // Podiums (P1/P2/P3)
    const results = allResults.value
    const podiums: Record<string, { P1: number; P2: number; P3: number }> = {}
    for (const r of results) {
      for (const res of (r as any).Results || []) {
        const pos = Number(res.position)
        if (pos >= 1 && pos <= 3) {
          const d = res.Driver.familyName
          podiums[d] = podiums[d] || { P1: 0, P2: 0, P3: 0 }
          if (pos === 1) podiums[d].P1++
          if (pos === 2) podiums[d].P2++
          if (pos === 3) podiums[d].P3++
        }
      }
    }
    const podPairs = Object.entries(podiums).map(([k, v]) => [k, v.P1 + v.P2 + v.P3] as [string, number]).sort((a, b) => b[1] - a[1]).slice(0, 12)
    const labels   = podPairs.map(([k]) => k)
    charts.podiums = {
      options: { ...buildBarOptions(labels), plotOptions: { bar: { horizontal: false, columnWidth: '55%', borderRadius: 6, stacked: true } }, legend: { labels: { colors: '#a1a1aa' } } },
      series: [
        { name: 'P1', data: labels.map((n) => podiums[n].P1) },
        { name: 'P2', data: labels.map((n) => podiums[n].P2) },
        { name: 'P3', data: labels.map((n) => podiums[n].P3) },
      ],
    }
  
    // Progression des points (Top 5)
    const rounds   = schedule.value.map((r: any) => r.round)
    const byDriver: Record<string, number[]> = {}
    const points:   Record<string, number>   = {}
    for (const r of results) {
      const roundIdx = Number((r as any).round) - 1
      for (const res of (r as any).Results || []) {
        const d = res.Driver.familyName
        const pts = Number(res.points)
        points[d] = (points[d] || 0) + pts
        if (!byDriver[d]) byDriver[d] = Array(rounds.length).fill(0)
        byDriver[d][roundIdx] = points[d]
      }
    }
    const top5Names = cats.slice(0, 5)
    charts.pointsProgress = {
      options: {
        chart: { background: 'transparent', toolbar: { show: false } },
        xaxis: { categories: rounds.map((r) => 'R' + r), labels: { style: { colors: '#a1a1aa' } } },
        yaxis: { labels: { style: { colors: '#a1a1aa' } } },
        grid:  { borderColor: 'rgba(255,255,255,0.08)' },
        stroke:{ width: 2, curve: 'smooth' },
        legend:{ labels: { colors: '#a1a1aa' } },
        theme: { mode: 'dark' },
      },
      series: top5Names.map((name) => ({ name, data: byDriver[name] || [] })),
    }
  
    // Abandons par écurie (DNF)
    const dnfByTeam: Record<string, number> = {}
    for (const r of results) {
      for (const res of (r as any).Results || []) {
        const status = res.status as string
        const team   = res.Constructor?.name
        const finished = status === 'Finished' || /\+\d+ Laps?/.test(status)
        if (!finished) dnfByTeam[team] = (dnfByTeam[team] || 0) + 1
      }
    }
    const dnfPairs = Object.entries(dnfByTeam).sort((a, b) => b[1] - a[1])
    charts.dnfByTeam = { options: buildBarOptions(dnfPairs.map(([k]) => k), '#f87171'), series: [{ name: 'DNF', data: dnfPairs.map(([, v]) => v) }] }
  })
  
  /* -------------------- Composants locaux (TSX) -------------------- */
  const NeonCard = defineComponent({
    name: 'NeonCard',
    props: { title: String, subtitle: String, variant: { type: String, default: 'glow-blue' } },
    setup(props, { slots }) {
      const ring =
        computed(() =>
          props.variant === 'glow-green'
            ? 'shadow-[0_0_60px_rgba(34,197,94,0.25)]'
            : props.variant === 'glow-red'
            ? 'shadow-[0_0_60px_rgba(248,113,113,0.25)]'
            : 'shadow-[0_0_60px_rgba(59,130,246,0.15)]'
        )
      return () => (
        <div class={["relative rounded-3xl p-4 bg-[#111214] border border-white/10", ring.value] as any}>
          <div class="flex items-start justify-between mb-2">
            <div>
              <h3 class="text-lg font-semibold">{props.title}</h3>
              <p class="text-xs text-zinc-500">{props.subtitle}</p>
            </div>
            <div class="w-6 h-6 rounded-full bg-white/5 grid place-items-center">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            </div>
          </div>
          <div class="mt-2">{slots.default?.()}</div>
        </div>
      )
    },
  })
  
  const KpiCard = defineComponent({
    name: 'KpiCard',
    props: { title: String, value: [String, Number] as any, subtitle: String, tone: String },
    setup(props) {
      const toneMap: Record<string, string> = {
        emerald: 'from-emerald-500/30 to-emerald-400/10',
        cyan:    'from-cyan-500/30 to-cyan-400/10',
        violet:  'from-violet-500/30 to-violet-400/10',
        lime:    'from-lime-400/30 to-lime-300/10',
      }
      return () => (
        <div class="relative rounded-3xl p-5 bg-[#111214] border border-white/10 overflow-hidden">
          <div class={[`absolute inset-0 opacity-40 blur-2xl pointer-events-none bg-gradient-to-br ${toneMap[props.tone || 'emerald']}`] as any}></div>
          <div class="relative">
            <p class="text-sm text-zinc-400">{props.title}</p>
            <p class="text-3xl font-extrabold tracking-tight mt-1">{props.value as any}</p>
            <p class="text-xs text-zinc-500 mt-1">{props.subtitle}</p>
          </div>
        </div>
      )
    },
  })
  </script>
  
  <style scoped>
  :deep(.apexcharts-canvas){border-radius:1rem}
  :deep(.apexcharts-tooltip){background:#0b0c0f!important;color:#fff!important}
  </style>
  