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


        <!-- Statistiques historiques -->
        <div class="mt-12">
          <h2 class="text-2xl font-bold mb-6">Statistiques historiques</h2>
          <div
            v-for="group in historicalStats"
            :key="group.category"
            class="mb-10"
          >
            <h3 class="text-xl font-semibold mb-4">{{ group.category }}</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <KpiCard
                v-for="stat in group.items"
                :key="stat.title"
                :title="stat.title"
                :value="stat.value"
                :subtitle="stat.subtitle"
                :tone="stat.tone"
              />
            </div>
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
  const historicalStats = [
    {
      category: 'Chiffres clés',
      items: [
        { title: "Année de création", value: '1950', subtitle: '', tone: 'emerald' },
        { title: 'Nombre total de Grands Prix', value: '1108', subtitle: '', tone: 'cyan' },
        { title: 'Nombre total de saisons', value: '75', subtitle: '', tone: 'violet' },
        { title: 'Circuits utilisés', value: '76', subtitle: '', tone: 'lime' },
        { title: 'Pays hôtes', value: '34', subtitle: '', tone: 'emerald' },
        { title: 'Pilotes ayant couru', value: '775', subtitle: '', tone: 'cyan' },
        { title: 'Écuries participantes', value: '170', subtitle: '', tone: 'violet' },
      ],
    },
    {
      category: 'Titres et records',
      items: [
        { title: 'Champions du monde', value: '34', subtitle: '', tone: 'emerald' },
        { title: 'Pilote le plus titré', value: 'M. Schumacher & L. Hamilton', subtitle: '7 titres', tone: 'cyan' },
        { title: 'Écurie la plus titrée', value: 'Ferrari', subtitle: '16 titres constructeurs', tone: 'violet' },
        { title: 'Plus jeune champion', value: 'S. Vettel', subtitle: '23 ans', tone: 'lime' },
        { title: 'Plus vieux champion', value: 'J. M. Fangio', subtitle: '46 ans', tone: 'emerald' },
        { title: 'Plus grand écart pour un titre', value: '155 pts', subtitle: 'Vettel 2013', tone: 'cyan' },
        { title: 'Plus petit écart pour un titre', value: '0,5 pt', subtitle: 'Lauda 1984', tone: 'violet' },
      ],
    },
    {
      category: 'Victoires et podiums',
      items: [
        { title: 'Pilote le plus victorieux', value: 'Lewis Hamilton', subtitle: '103 victoires', tone: 'emerald' },
        { title: 'Écurie la plus victorieuse', value: 'Ferrari', subtitle: '243 victoires', tone: 'cyan' },
        { title: 'Total des victoires', value: '1108', subtitle: '', tone: 'violet' },
        { title: 'Pays le plus victorieux', value: 'Royaume-Uni', subtitle: '299 victoires', tone: 'lime' },
        { title: 'Total des podiums', value: '3324', subtitle: '', tone: 'emerald' },
        { title: 'Podiums sans victoire', value: 'Nick Heidfeld', subtitle: '13 podiums', tone: 'cyan' },
        { title: 'Victoires sans titre', value: 'Stirling Moss', subtitle: '16 victoires', tone: 'violet' },
      ],
    },
    {
      category: 'Qualifications',
      items: [
        { title: 'Record de poles', value: 'Lewis Hamilton', subtitle: '104 poles', tone: 'emerald' },
        { title: 'Écurie avec le plus de poles', value: 'Ferrari', subtitle: '249 poles', tone: 'cyan' },
        { title: 'Plus jeune poleman', value: 'S. Vettel', subtitle: '21 ans', tone: 'violet' },
        { title: 'Plus vieux poleman', value: 'G. Farina', subtitle: '47 ans', tone: 'lime' },
        { title: 'Total des poles', value: '1108', subtitle: '', tone: 'emerald' },
      ],
    },
    {
      category: 'Records de tours',
      items: [
        { title: 'Meilleurs tours pilote', value: 'M. Schumacher', subtitle: '77', tone: 'cyan' },
        { title: 'Meilleurs tours écurie', value: 'Ferrari', subtitle: '259', tone: 'violet' },
        { title: 'Tour le plus rapide en course', value: '1:19.525', subtitle: 'Montoya, Monza 2004', tone: 'lime' },
        { title: 'Tour le plus rapide en qualifs', value: '1:18.887', subtitle: 'Hamilton, Monza 2020', tone: 'emerald' },
      ],
    },
    {
      category: 'Techniques & machines',
      items: [
        { title: 'Voiture la plus dominante', value: 'Mercedes W11', subtitle: '2020', tone: 'cyan' },
        { title: 'Moteur le plus victorieux', value: 'Ferrari', subtitle: '243 victoires', tone: 'violet' },
        { title: 'Motoristes différents', value: '73', subtitle: '', tone: 'lime' },
        { title: 'Conso moy. par course', value: '≈150 L', subtitle: '', tone: 'emerald' },
        { title: 'Fournisseurs de pneus', value: '12', subtitle: 'depuis 1950', tone: 'cyan' },
        { title: 'Pit stop le plus rapide', value: '1.82 s', subtitle: 'Red Bull 2019', tone: 'violet' },
      ],
    },
    {
      category: 'Géographie & circuits',
      items: [
        { title: 'Circuit le plus fréquenté', value: 'Monza', subtitle: '73 GP', tone: 'emerald' },
        { title: 'Circuit le plus rapide', value: 'Monza', subtitle: '≈264 km/h', tone: 'cyan' },
        { title: 'Circuit le plus lent', value: 'Monaco', subtitle: '≈160 km/h', tone: 'violet' },
        { title: 'Total des circuits', value: '76', subtitle: '', tone: 'lime' },
        { title: 'Pays le plus hôte', value: 'Italie', subtitle: '≈103 GP', tone: 'emerald' },
        { title: 'Premier GP hors-Europe', value: 'Indianapolis 1950', subtitle: 'États-Unis', tone: 'cyan' },
      ],
    },
    {
      category: 'Fiabilité & abandons',
      items: [
        { title: 'Total des abandons', value: '>16000', subtitle: '', tone: 'violet' },
        { title: 'Cause la plus fréquente', value: 'Mécanique', subtitle: '', tone: 'lime' },
        { title: 'Abandons dans une course', value: '18', subtitle: 'Monaco 1996', tone: 'emerald' },
        { title: 'Écurie la plus fiable', value: 'Mercedes', subtitle: '>90% de fins de course', tone: 'cyan' },
      ],
    },
    {
      category: 'Autres records',
      items: [
        { title: 'Course la plus longue', value: 'Canada 2011', subtitle: '4h04', tone: 'violet' },
        { title: 'Course la plus courte', value: 'Spa 2021', subtitle: '3 min', tone: 'lime' },
        { title: 'Dépassements record', value: '170', subtitle: 'Chine 2016', tone: 'emerald' },
        { title: 'Vitesse max en course', value: '372,5 km/h', subtitle: 'Montoya Monza 2005', tone: 'cyan' },
        { title: 'Pilotes tués en course', value: '52', subtitle: '', tone: 'violet' },
        { title: 'Introduction du halo', value: '2018', subtitle: 'aucun décès depuis', tone: 'lime' },
        { title: 'Introduction du DRS', value: '2011', subtitle: '+40% dépassements', tone: 'emerald' },
      ],
    },
    {
      category: 'Classements cumulés',
      items: [
        { title: 'Nation la plus titrée', value: 'Royaume-Uni', subtitle: 'pilotes + constructeurs', tone: 'cyan' },
        { title: 'Écurie la plus prolifique', value: 'Ferrari', subtitle: '~10k points', tone: 'violet' },
        { title: 'Pilote le plus expérimenté', value: 'Fernando Alonso', subtitle: '380+ GP', tone: 'lime' },
        { title: 'Circuit le plus disputé', value: 'Monza', subtitle: '73 GP', tone: 'emerald' },
      ],
    },
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
  