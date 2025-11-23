<template>
  <NuxtLink :to="`/drivers/${driver.Driver.driverId}`" class="block group h-full">
    <div class="relative h-full bg-f1-dark-gray/40 backdrop-blur-md rounded-2xl border border-white/5 overflow-hidden transition-all duration-500 hover:border-f1-red/50 hover:shadow-[0_0_30px_rgba(255,24,1,0.15)] hover:-translate-y-1">
      
      <!-- Background Gradient based on team -->
      <div class="absolute inset-0 opacity-20 transition-opacity duration-500 group-hover:opacity-30"
           :style="`background: linear-gradient(135deg, ${teamColor} 0%, transparent 100%)`">
      </div>

      <!-- Content Container -->
      <div class="relative z-10 flex flex-col h-full">
        
        <!-- Header: Position & Points -->
        <div class="flex justify-between items-start p-5">
          <div class="flex flex-col">
            <span class="text-4xl font-display font-bold italic text-white/90 leading-none">{{ driver.position }}</span>
            <span class="text-xs font-bold tracking-widest text-white/40 uppercase mt-1">Pos</span>
          </div>
          <div class="flex flex-col items-end">
            <span class="text-2xl font-bold text-f1-red leading-none">{{ driver.points }}</span>
            <span class="text-xs font-bold tracking-widest text-white/40 uppercase mt-1">PTS</span>
          </div>
        </div>

        <!-- Driver Image (Cutout style) -->
        <div class="relative flex-grow mt-2 overflow-hidden">
          <div class="absolute bottom-0 left-1/2 -translate-x-1/2 w-[120%] h-[120%] bg-gradient-to-t from-f1-black via-transparent to-transparent z-20"></div>
          <img 
            :src="driverImage" 
            :alt="`${driver.Driver.givenName} ${driver.Driver.familyName}`"
            class="w-full h-64 object-cover object-top transform transition-transform duration-700 group-hover:scale-110 origin-bottom"
            :class="{ 'opacity-0': loading, 'opacity-100': !loading }"
            @error="handleImageError"
            @load="loading = false"
            loading="lazy"
          />
          
          <!-- Loading State -->
          <div v-if="loading || showPlaceholder" class="absolute inset-0 flex items-center justify-center bg-f1-dark-gray/50">
             <span class="loading loading-spinner text-f1-red"></span>
          </div>
        </div>

        <!-- Driver Info -->
        <div class="p-5 pt-0 mt-auto relative z-20">
          <!-- Name -->
          <div class="mb-3">
            <h2 class="text-lg font-medium text-gray-300 leading-tight">{{ driver.Driver.givenName }}</h2>
            <h1 class="text-2xl font-display font-bold italic text-white uppercase tracking-wide leading-none group-hover:text-f1-red transition-colors">
              {{ driver.Driver.familyName }}
            </h1>
          </div>

          <!-- Team & Flag -->
          <div class="flex items-center justify-between border-t border-white/10 pt-3">
            <div class="flex items-center gap-2">
              <div class="w-1 h-8 rounded-full" :style="`background-color: ${teamColor}`"></div>
              <span class="text-sm font-medium text-gray-300 truncate max-w-[120px]">
                {{ driver.Constructors[0]?.name }}
              </span>
            </div>
            <img 
              :src="`https://flagcdn.com/w40/${getCountryCode(driver.Driver.nationality)}.png`" 
              :alt="driver.Driver.nationality"
              class="h-4 w-auto rounded shadow-sm opacity-80"
            />
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
const teamColor = computed(() => {
  const colors: Record<string, string> = {
    'red_bull': '#0600EF',
    'ferrari': '#DC0000',
    'mercedes': '#00D2BE',
    'mclaren': '#FF8700',
    'aston_martin': '#006F62',
    'alpine': '#0090FF',
    'williams': '#005AFF',
    'rb': '#1E3D9B',
    'sauber': '#52E252',
    'haas': '#B6BABD' 
  }
  
  const constructorId = props.driver.Constructors[0]?.constructorId
  return colors[constructorId] || '#666666'
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
    'Brazilian': 'br',
    'Argentinean': 'ar',
    'Argentine': 'ar',
  }
  return countryMap[nationality]?.toLowerCase() || 'unknown'
}
</script>
