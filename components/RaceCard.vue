<template>
  <div 
    class="card bg-base-100 shadow-xl cursor-pointer transition-transform hover:scale-102"
    :class="{ 'opacity-75': isPastRace }"
    @click="navigateToResults"
  >
    <div class="card-body">
      <h2 class="card-title">
        {{ race.raceName }}
        <div 
          class="badge" 
          :class="isPastRace ? 'badge-secondary' : 'badge-primary'"
        >
          Round {{ race.round }}
        </div>
      </h2>
      <div class="flex flex-col gap-2">
        <div class="flex items-center gap-2">
          <div class="badge badge-ghost">{{ race.Circuit.circuitName }}</div>
          <div class="badge badge-ghost">{{ race.Circuit.Location.country }}</div>
        </div>
        <p class="text-sm">
          {{ formatDate(race.date) }} - {{ formatTime(race.time) }}
        </p>
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

<style scoped>
.hover\:scale-102:hover {
  transform: scale(1.02);
}
</style>