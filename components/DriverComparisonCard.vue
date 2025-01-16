<template>
  <div class="card bg-base-100 shadow-xl">
    <figure class="px-4 pt-4">
      <div class="relative w-full aspect-[3/4] rounded-xl overflow-hidden">
        <img 
          :src="driverImage" 
          :alt="`${driver.Driver.givenName} ${driver.Driver.familyName}`"
          class="object-cover w-full h-full"
          :class="{ 'opacity-0': loading, 'opacity-100': !loading }"
          @error="handleImageError"
          @load="loading = false"
          loading="lazy"
        />
        <div 
          v-if="loading || showPlaceholder" 
          class="absolute inset-0 bg-base-200 flex items-center justify-center"
        >
          <div v-if="loading" class="loading loading-spinner loading-lg"></div>
          <div v-else class="text-4xl">🏎️</div>
        </div>
      </div>
    </figure>
    <div class="card-body">
      <h2 class="card-title justify-center text-xl">
        {{ driver.Driver.givenName }} {{ driver.Driver.familyName }}
      </h2>
      
      <div class="stats shadow">
        <div class="stat">
          <div class="stat-title">Points</div>
          <div class="stat-value">{{ driver.points }}</div>
          <div 
            class="stat-desc" 
            :class="pointsDiff > 0 ? 'text-success' : pointsDiff < 0 ? 'text-error' : ''"
          >
            {{ formatPointsDiff(pointsDiff) }}
          </div>
        </div>
        
        <div class="stat">
          <div class="stat-title">Victoires</div>
          <div class="stat-value">{{ driver.wins }}</div>
          <div 
            class="stat-desc"
            :class="winsDiff > 0 ? 'text-success' : winsDiff < 0 ? 'text-error' : ''"
          >
            {{ formatDiff(winsDiff) }}
          </div>
        </div>
      </div>

      <div class="mt-4">
        <h3 class="font-semibold mb-2">Performance relative</h3>
        <ProgressBar 
          :value="Number(driver.points)"
          :max-value="Math.max(Number(driver.points), Number(opponent.points))"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Driver } from '~/types/f1'

const props = defineProps({
  driver: {
    type: Object as PropType<Driver>,
    required: true
  },
  opponent: {
    type: Object as PropType<Driver>,
    required: true
  }
})

const { getDriverImage } = useDriverImages()
const driverImage = getDriverImage(props.driver.Driver.driverId)
const showPlaceholder = ref(false)
const loading = ref(true)

const handleImageError = () => {
  showPlaceholder.value = true
  loading.value = false
}

const pointsDiff = computed(() => {
  return Number(props.driver.points) - Number(props.opponent.points)
})

const winsDiff = computed(() => {
  return Number(props.driver.wins) - Number(props.opponent.wins)
})

const formatPointsDiff = (diff: number) => {
  if (diff === 0) return 'Égalité'
  return diff > 0 ? `+${diff} points` : `${diff} points`
}

const formatDiff = (diff: number) => {
  if (diff === 0) return 'Égalité'
  return diff > 0 ? `+${diff}` : diff.toString()
}
</script>

<style scoped>
.card figure {
  @apply pb-0;
}

img {
  @apply transition-opacity duration-300;
}
</style>