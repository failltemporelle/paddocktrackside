<template>
  <section class="py-20 md:py-28 bg-f1-black relative overflow-hidden">
    <!-- Decor -->
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-f1-red/5 rounded-full blur-[130px] pointer-events-none"></div>
    <div class="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none"></div>

    <div class="container mx-auto px-6 md:px-12 relative z-10">
      <!-- Header -->
      <div class="text-center max-w-3xl mx-auto mb-16">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-gray-300 mb-6 backdrop-blur-md">
          <span class="w-2 h-2 rounded-full bg-f1-red animate-pulse"></span>
          Saison {{ currentYear }}
        </div>
        <h2 class="text-4xl md:text-6xl font-display font-bold italic text-white tracking-tight mb-6">
          LE <span class="text-f1-red">PADDOCK</span> EN DIRECT
        </h2>
        <p class="text-xl text-gray-400 font-light">
          L'essentiel de la saison en un coup d'œil : pilotes, écuries et calendrier.
        </p>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex justify-center py-24">
        <span class="loading loading-spinner loading-lg text-f1-red"></span>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="alert alert-error max-w-xl mx-auto rounded-2xl">
        <span>{{ error }}</span>
      </div>

      <!-- Dashboard Grid -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <!-- NEXT RACE -->
        <div class="card bg-f1-dark-gray/40 backdrop-blur-md border border-white/5 rounded-3xl overflow-hidden relative group hover:border-f1-red/30 transition-all duration-500">
          <div class="absolute inset-0 opacity-10">
            <img v-if="nextRace" :src="nextRaceCircuitImage" :alt="nextRace.Circuit.circuitName" class="w-full h-full object-contain object-right p-6" />
          </div>
          <div class="card-body relative z-10">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-bold tracking-widest text-f1-red uppercase">Prochaine course</span>
              <span v-if="nextRace" class="badge bg-white/10 border-white/10 text-gray-300 font-bold">Round {{ nextRace.round }}</span>
            </div>

            <template v-if="nextRace">
              <h3 class="text-2xl md:text-3xl font-display font-bold italic text-white leading-tight mb-1">
                {{ nextRace.raceName }}
              </h3>
              <div class="flex items-center gap-2 text-gray-400 text-sm mb-6">
                <img
                  :src="`https://flagcdn.com/w40/${getCountryCode(nextRace.Circuit.Location.country)}.png`"
                  :alt="nextRace.Circuit.Location.country"
                  class="h-3 w-5 object-cover rounded shadow-sm"
                />
                <span>{{ nextRace.Circuit.circuitName }} · {{ nextRace.Circuit.Location.country }}</span>
              </div>

              <RaceCountdown :date="nextRace.date" :time="nextRace.time || '00:00:00'" />

              <div class="flex items-center justify-between mt-6 pt-6 border-t border-white/10 text-sm">
                <div class="flex flex-col">
                  <span class="text-xs text-gray-500 uppercase tracking-wider">Date</span>
                  <span class="text-white font-medium">{{ formatDate(nextRace.date) }}</span>
                </div>
                <div class="flex flex-col items-end">
                  <span class="text-xs text-gray-500 uppercase tracking-wider">Heure</span>
                  <span class="text-white font-medium">{{ formatTime(nextRace.time) }}</span>
                </div>
              </div>
            </template>
            <template v-else>
              <div class="flex flex-col items-center justify-center text-center py-10">
                <span class="text-4xl mb-4">🏁</span>
                <h3 class="text-xl font-display font-bold italic text-white mb-2">Saison terminée</h3>
                <p class="text-gray-400 text-sm">Rendez-vous la saison prochaine pour de nouvelles courses.</p>
              </div>
            </template>

            <NuxtLink to="/races" class="btn btn-sm bg-white/5 border-white/10 text-white hover:bg-f1-red hover:border-f1-red rounded-lg mt-6 self-start">
              Voir le calendrier
            </NuxtLink>
          </div>
        </div>

        <!-- SEASON PROGRESS -->
        <div class="card bg-f1-dark-gray/40 backdrop-blur-md border border-white/5 rounded-3xl hover:border-f1-red/30 transition-all duration-500">
          <div class="card-body items-center text-center justify-center">
            <span class="text-xs font-bold tracking-widest text-f1-red uppercase mb-4 self-start">Progression de la saison</span>

            <div
              class="radial-progress text-f1-red bg-white/5 border-4 border-white/5"
              :style="`--value:${seasonProgress}; --size:9rem; --thickness: 10px;`"
              role="progressbar"
            >
              <span class="text-3xl font-display font-bold italic text-white">{{ seasonProgress }}%</span>
            </div>

            <p class="text-gray-400 mt-6">
              <span class="text-white font-bold">{{ completedRaces }}</span> courses disputées sur
              <span class="text-white font-bold">{{ totalRaces }}</span>
            </p>

            <div class="w-full flex justify-center gap-8 mt-6 pt-6 border-t border-white/10">
              <div class="flex flex-col items-center">
                <span class="text-2xl font-display font-bold italic text-white">{{ completedRaces }}</span>
                <span class="text-xs text-gray-500 uppercase tracking-wider">Disputées</span>
              </div>
              <div class="flex flex-col items-center">
                <span class="text-2xl font-display font-bold italic text-white">{{ remainingRaces }}</span>
                <span class="text-xs text-gray-500 uppercase tracking-wider">Restantes</span>
              </div>
            </div>
          </div>
        </div>

        <!-- TOP 5 DRIVERS -->
        <div class="card bg-f1-dark-gray/40 backdrop-blur-md border border-white/5 rounded-3xl hover:border-f1-red/30 transition-all duration-500">
          <div class="card-body">
            <div class="flex items-center justify-between mb-4">
              <span class="text-xs font-bold tracking-widest text-f1-red uppercase">Top 5 pilotes</span>
              <NuxtLink to="/standings" class="text-xs font-bold text-gray-400 hover:text-white transition-colors">Tout voir →</NuxtLink>
            </div>

            <div class="flex flex-col divide-y divide-white/5">
              <NuxtLink
                v-for="driver in top5Drivers"
                :key="driver.Driver.driverId"
                :to="`/drivers/${driver.Driver.driverId}`"
                class="flex items-center gap-3 py-3 group/row hover:bg-white/5 rounded-lg px-2 -mx-2 transition-colors"
              >
                <span
                  class="flex items-center justify-center w-7 h-7 rounded-lg font-display font-bold italic text-sm shrink-0"
                  :class="medalClass(Number(driver.position))"
                >
                  {{ driver.position }}
                </span>

                <div class="avatar shrink-0">
                  <div class="w-10 h-10 rounded-full ring-1 ring-white/10">
                    <img :src="getDriverImage(driver.Driver.driverId)" :alt="driver.Driver.familyName" class="object-cover object-top" />
                  </div>
                </div>

                <div class="flex flex-col flex-grow min-w-0">
                  <span class="font-bold text-white truncate group-hover/row:text-f1-red transition-colors">
                    {{ driver.Driver.givenName }} {{ driver.Driver.familyName }}
                  </span>
                  <span class="flex items-center gap-1.5 text-xs text-gray-500 truncate">
                    <span class="w-1.5 h-1.5 rounded-full" :style="`background-color: ${getTeamColor(driver.Constructors[0]?.constructorId)}`"></span>
                    {{ driver.Constructors[0]?.name }}
                  </span>
                </div>

                <span class="font-display font-bold italic text-white shrink-0">{{ driver.points }} <span class="text-xs text-gray-500 font-sans not-italic">pts</span></span>
              </NuxtLink>
            </div>
          </div>
        </div>

        <!-- TOP 3 CONSTRUCTORS -->
        <div class="card bg-f1-dark-gray/40 backdrop-blur-md border border-white/5 rounded-3xl hover:border-f1-red/30 transition-all duration-500">
          <div class="card-body">
            <div class="flex items-center justify-between mb-4">
              <span class="text-xs font-bold tracking-widest text-f1-red uppercase">Top 3 écuries</span>
              <NuxtLink to="/standings" class="text-xs font-bold text-gray-400 hover:text-white transition-colors">Tout voir →</NuxtLink>
            </div>

            <div class="flex flex-col divide-y divide-white/5">
              <div
                v-for="team in top3Constructors"
                :key="team.Constructor.constructorId"
                class="flex items-center gap-3 py-3"
              >
                <span
                  class="flex items-center justify-center w-7 h-7 rounded-lg font-display font-bold italic text-sm shrink-0"
                  :class="medalClass(Number(team.position))"
                >
                  {{ team.position }}
                </span>

                <div class="w-12 h-9 rounded-lg bg-black/30 border border-white/10 flex items-center justify-center shrink-0 overflow-hidden">
                  <img :src="getConstructorImage(team.Constructor.constructorId).value" :alt="team.Constructor.name" class="w-full h-full object-contain p-1" />
                </div>

                <div class="flex flex-col flex-grow min-w-0">
                  <span class="font-bold text-white truncate">{{ team.Constructor.name }}</span>
                  <span class="flex items-center gap-1.5 text-xs text-gray-500">
                    <span class="w-1.5 h-1.5 rounded-full" :style="`background-color: ${getTeamColor(team.Constructor.constructorId)}`"></span>
                    {{ team.wins }} victoire{{ Number(team.wins) > 1 ? 's' : '' }}
                  </span>
                </div>

                <span class="font-display font-bold italic text-white shrink-0">{{ team.points }} <span class="text-xs text-gray-500 font-sans not-italic">pts</span></span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Driver, Constructor, Race } from '~/types/f1'
import { getTeamColor } from '~/utils/teamColors'
import { getCountryCode } from '~/utils/countryCodes'

const { fetchDriverStandings, fetchConstructorStandings, fetchRaces } = useJolpicaApi()
const { formatDate, formatTime } = useRaceData()
const { getDriverImage } = useDriverImages()
const { getConstructorImage } = useConstructorImages()
const { getCircuitImage } = useCircuitImages()

const currentYear = new Date().getFullYear()

const loading = ref(true)
const error = ref<string | null>(null)
const drivers = ref<Driver[]>([])
const constructors = ref<Constructor[]>([])
const races = ref<Race[]>([])

const top5Drivers = computed(() => drivers.value.slice(0, 5))
const top3Constructors = computed(() => constructors.value.slice(0, 3))

const nextRace = computed(() => {
  const now = new Date()
  return races.value.find(race => new Date(`${race.date}T${race.time || '23:59:59'}`) > now)
})

const nextRaceCircuitImage = computed(() => {
  if (!nextRace.value) return ''
  return getCircuitImage(nextRace.value.Circuit.circuitId).value
})

const totalRaces = computed(() => races.value.length)
const completedRaces = computed(() => {
  const now = new Date()
  return races.value.filter(race => new Date(`${race.date}T${race.time || '23:59:59'}`) < now).length
})
const remainingRaces = computed(() => totalRaces.value - completedRaces.value)
const seasonProgress = computed(() => totalRaces.value ? Math.round((completedRaces.value / totalRaces.value) * 100) : 0)

const medalClass = (pos: number) => {
  if (pos === 1) return 'bg-[#FFD700] text-black shadow-[0_0_10px_rgba(255,215,0,0.3)]'
  if (pos === 2) return 'bg-[#C0C0C0] text-black shadow-[0_0_10px_rgba(192,192,192,0.3)]'
  if (pos === 3) return 'bg-[#CD7F32] text-white shadow-[0_0_10px_rgba(205,127,50,0.3)]'
  return 'bg-white/10 text-gray-300'
}

onMounted(async () => {
  try {
    const [driversData, constructorsData, racesData] = await Promise.all([
      fetchDriverStandings(),
      fetchConstructorStandings(),
      fetchRaces()
    ])
    drivers.value = driversData
    constructors.value = constructorsData
    races.value = racesData
  } catch (e) {
    error.value = "Une erreur s'est produite lors du chargement du tableau de bord"
    console.error('Error loading home dashboard:', e)
  } finally {
    loading.value = false
  }
})
</script>
