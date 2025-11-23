<template>
  <div 
    class="group relative bg-f1-dark-gray/40 backdrop-blur-md rounded-2xl border border-white/5 overflow-hidden transition-all duration-300 hover:border-f1-red/50 hover:shadow-[0_0_20px_rgba(255,24,1,0.15)] hover:-translate-y-1 cursor-pointer"
    :class="{ 'opacity-75 hover:opacity-100': isPastRace }"
    @click="navigateToResults"
  >
    <!-- Hover Gradient -->
    <div class="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

    <div class="p-6 relative z-10">
      <div class="flex justify-between items-start mb-4">
        <div class="flex flex-col">
          <span class="text-xs font-bold tracking-widest text-f1-red uppercase mb-1">Round {{ race.round }}</span>
          <h2 class="text-xl font-display font-bold italic text-white leading-tight group-hover:text-f1-red transition-colors">
            {{ race.raceName }}
          </h2>
        </div>
        <div v-if="isPastRace" class="px-2 py-1 rounded text-xs font-bold bg-white/10 text-gray-400 border border-white/10">
          Terminé
        </div>
        <div v-else class="px-2 py-1 rounded text-xs font-bold bg-f1-red text-white shadow-lg shadow-f1-red/20 animate-pulse-slow">
          À venir
        </div>
      </div>

      <div class="space-y-3">
        <div class="flex items-center gap-2 text-gray-300">
          <span class="text-lg">🏎️</span>
          <span class="font-medium">{{ race.Circuit.circuitName }}</span>
        </div>
        
        <div class="flex items-center gap-2 text-gray-400 text-sm">
          <span>📍</span>
          <span>{{ race.Circuit.Location.country }}</span>
        </div>

        <div class="pt-4 mt-4 border-t border-white/10 flex justify-between items-center text-sm">
          <div class="flex flex-col">
            <span class="text-xs text-gray-500 uppercase tracking-wider">Date</span>
            <span class="text-white font-medium">{{ formatDate(race.date) }}</span>
          </div>
          <div class="flex flex-col items-end">
            <span class="text-xs text-gray-500 uppercase tracking-wider">Heure</span>
            <span class="text-white font-medium">{{ formatTime(race.time) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Race } from '~/types/f1'

const props = defineProps({
  race: {
    type: Object as PropType<Race>,
    required: true
  }
})

const router = useRouter()
const { formatDate, formatTime } = useRaceData()

const isPastRace = computed(() => {
  const raceDate = new Date(`${props.race.date}T${props.race.time || '00:00:00'}`)
  return raceDate < new Date()
})

const navigateToResults = () => {
  if (isPastRace.value) {
    router.push(`/races/${props.race.season}/${props.race.round}`)
  }
}
</script>