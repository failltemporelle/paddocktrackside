<template>
  <NuxtLink :to="`/drivers/${driver.Driver.driverId}`" class="block h-full hover-3d">
    <!-- 8 empty divs for 3D effect (plus one for center if we want 9, but user said 8, usually it's a grid so let's do 9 for full coverage) -->
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    
    <figure class="relative h-full bg-f1-dark-gray/40 backdrop-blur-md rounded-2xl border border-white/5 overflow-hidden transition-all duration-500 hover:border-f1-red/50 hover:shadow-[0_0_30px_rgba(255,24,1,0.15)]">
      
      <!-- Full Card Image -->
      <div class="absolute inset-0 z-0">
        <img 
          :src="driverImage" 
          :alt="`${driver.Driver.givenName} ${driver.Driver.familyName}`"
          class="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
          :class="{ 'opacity-0': loading, 'opacity-100': !loading }"
          @error="handleImageError"
          @load="loading = false"
          loading="lazy"
        />
        <!-- Gradient Overlays for readability -->
        <div class="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80"></div>
      </div>

      <!-- Loading/Placeholder -->
      <div v-if="loading || showPlaceholder" class="absolute inset-0 flex items-center justify-center bg-f1-dark-gray z-0">
         <span class="loading loading-spinner text-f1-red"></span>
      </div>

      <!-- Content Overlays -->
      <div class="relative z-10 flex flex-col h-full p-4">
        
        <!-- Top Row -->
        <div class="flex justify-between items-start">
          <!-- Top Left: Position -->
          <div class="flex flex-col items-center justify-center bg-f1-black/50 backdrop-blur-sm rounded-lg border border-white/10 px-3 py-1">
            <span class="text-3xl font-display font-bold italic text-white leading-none">{{ driver.position }}</span>
            <span class="text-[10px] font-bold tracking-widest text-white/60 uppercase">Pos</span>
          </div>

          <!-- Top Right: Points -->
          <div class="flex flex-col items-end justify-center bg-f1-red/80 backdrop-blur-sm rounded-lg border border-f1-red px-3 py-1 shadow-[0_0_15px_rgba(255,24,1,0.4)]">
            <span class="text-2xl font-bold text-white leading-none">{{ driver.points }}</span>
            <span class="text-[10px] font-bold tracking-widest text-white/90 uppercase">PTS</span>
          </div>
        </div>

        <!-- Spacer -->
        <div class="flex-grow"></div>

        <!-- Bottom Row -->
        <div class="flex justify-between items-end mt-2">
          
          <!-- Bottom Left: Name & Nationality -->
          <div class="flex flex-col">
            <div class="flex items-center gap-2 mb-1">
              <img 
                :src="`https://flagcdn.com/w40/${getCountryCode(driver.Driver.nationality)}.png`" 
                :alt="driver.Driver.nationality"
                class="h-3 w-5 object-cover rounded shadow-sm opacity-90"
              />
              <span class="text-xs font-medium text-gray-300 uppercase tracking-wider">{{ driver.Driver.nationality }}</span>
            </div>
            <h2 class="text-sm font-medium text-gray-300 leading-tight">{{ driver.Driver.givenName }}</h2>
            <h1 class="text-2xl font-display font-bold italic text-white uppercase tracking-wide leading-none group-hover:text-f1-red transition-colors">
              {{ driver.Driver.familyName }}
            </h1>
          </div>

          <!-- Bottom Right: Team & Color Bar -->
          <div class="flex flex-col items-end">
             <div class="flex items-center gap-2 bg-f1-black/60 backdrop-blur-md rounded-full pl-1 pr-3 py-1 border border-white/10">
                <div class="w-2 h-6 rounded-full" :style="`background-color: ${teamColor}; box-shadow: 0 0 10px ${teamColor}80`"></div>
                <span class="text-sm font-bold text-white truncate max-w-[100px]">
                  {{ driver.Constructors[0]?.name }}
                </span>
             </div>
          </div>

        </div>

      </div>
    </figure>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { Driver } from '~/types/f1'
import { ref, computed } from 'vue'
import { getTeamColor } from '~/utils/teamColors'
import { getCountryCode } from '~/utils/countryCodes'

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
const teamColor = computed(() => getTeamColor(props.driver.Constructors[0]?.constructorId))
</script>
