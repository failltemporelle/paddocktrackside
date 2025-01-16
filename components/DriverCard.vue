<template>
  <NuxtLink :to="`/drivers/${driver.Driver.driverId}`" class="block">
    <div class="card bg-white hover:shadow-xl transition-all duration-300">
      <!-- En-tête avec image et overlay -->
      <div class="relative h-64 bg-f1-red rounded-t-xl overflow-hidden">
        <img 
          :src="driverImage" 
          :alt="`${driver.Driver.givenName} ${driver.Driver.familyName}`"
          class="absolute right-0 h-full object-cover object-center transform hover:scale-105 transition-transform duration-500"
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
        
        <!-- Position -->
        <div class="absolute top-4 left-4 text-6xl font-bold text-white/80">
          {{ driver.position }}
        </div>
      </div>

      <!-- Contenu -->
      <div class="p-6 space-y-4">
        <!-- Nom et équipe -->
        <div>
          <h2 class="text-2xl font-bold tracking-tight">
            {{ driver.Driver.givenName }}
            <span class="text-f1-red">{{ driver.Driver.familyName }}</span>
          </h2>
          <div class="flex items-center gap-2 mt-1">
            <span class="text-lg font-semibold">{{ driver.Constructors[0]?.name }}</span>
            <div class="w-3 h-3 rounded-full" :style="constructorColor"></div>
          </div>
        </div>

        <!-- Stats principales -->
        <div class="grid grid-cols-3 gap-6">
          <div class="text-center">
            <div class="text-3xl font-bold text-f1-red">{{ driver.points }}</div>
            <div class="text-sm text-gray-600 uppercase">PTS</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold">{{ driver.wins }}</div>
            <div class="text-sm text-gray-600 uppercase">Wins</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold">{{ driver.Driver.permanentNumber }}</div>
            <div class="text-sm text-gray-600 uppercase">Num</div>
          </div>
        </div>

        <!-- Barre de progression -->
        <div class="w-full mt-4">
          <ProgressBar 
            :value="Number(driver.points)" 
            :max-value="maxPoints"
          />
        </div>

        <!-- Footer -->
        <div class="flex justify-between items-center pt-2">
          <div class="flex items-center gap-2">
            <img 
              :src="`https://flagcdn.com/24x18/${getCountryCode(driver.Driver.nationality)}.png`" 
              :alt="driver.Driver.nationality"
              class="w-6 h-4 object-cover rounded"
            />
            <span class="text-sm">{{ driver.Driver.nationality }}</span>
          </div>
          <div class="text-sm text-gray-600">
            {{ new Date().getFullYear() }}
          </div>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { Driver } from '~/types/f1'
import { ref, computed } from 'vue'

const props = defineProps({
  driver: {
    type: Object as PropType<Driver>,
    required: true
  },
  maxPoints: {
    type: Number,
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

// Couleur de l'écurie
const constructorColor = computed(() => {
  const colors: Record<string, string> = {
    'red_bull': 'background-color: #0600EF',
    'ferrari': 'background-color: #DC0000',
    'mercedes': 'background-color: #00D2BE',
    'mclaren': 'background-color: #FF8700',
    'aston_martin': 'background-color: #006F62',
    'alpine': 'background-color: #0090FF',
    'williams': 'background-color: #005AFF',
    'rb': 'background-color: #1E3D9B',
    'sauber': 'background-color: #52E252',
    'haas': 'background-color: #FFFFFF; border: 1px solid #cccccc'
  }
  
  const constructorId = props.driver.Constructors[0]?.constructorId
  return colors[constructorId] || 'background-color: #666666'
})

// Conversion nationalité en code pays
const getCountryCode = (nationality: string) => {
  const countryMap: Record<string, string> = {
    'British': 'gb',
    'Dutch': 'nl',
    'Mexican': 'mx',
    'Spanish': 'es',
    'French': 'fr',
    'Australian': 'au',
    'German': 'de',
    'Canadian': 'ca',
    'Japanese': 'jp',
    'Chinese': 'cn',
    'Thai': 'th',
    'Danish': 'dk',
    'Finnish': 'fi',
    'Italian': 'it',
    'Monegasque': 'mc',
    'American': 'us',
    'New Zealander': 'nz',
  }
  return countryMap[nationality]?.toLowerCase() || 'unknown'
}
</script>

<style scoped>
.card {
  @apply relative rounded-xl border border-gray-100;
}

.card:hover {
  @apply border-f1-red;
}
</style>