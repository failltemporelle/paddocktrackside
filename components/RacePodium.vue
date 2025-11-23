<template>
  <div class="bg-f1-dark-gray/40 backdrop-blur-md rounded-2xl border border-white/5 p-8 relative overflow-hidden">
    <!-- Background Glow -->
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-f1-red/5 to-transparent pointer-events-none"></div>

    <h2 class="text-xl font-display font-bold italic text-white text-center mb-8 relative z-10">PODIUM</h2>

    <div class="flex justify-center items-end gap-4 md:gap-8 relative z-10">
      <!-- 2nd Place -->
      <div class="flex flex-col items-center group">
        <div class="relative mb-3 transition-transform duration-300 group-hover:-translate-y-1">
          <div class="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-gray-300 shadow-[0_0_15px_rgba(209,213,219,0.3)]">
            <img 
              :src="getDriverImage(results[1]?.Driver.driverId)" 
              :alt="formatDriverName(results[1])"
              class="w-full h-full object-cover"
            />
          </div>
          <div class="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-gray-300 text-f1-black font-bold text-xs px-2 py-0.5 rounded-full shadow-lg">
            2
          </div>
        </div>
        <div class="text-center">
          <div class="font-bold text-white text-sm md:text-base truncate max-w-[100px] md:max-w-[140px]">{{ results[1]?.Driver.familyName }}</div>
          <div class="text-xs text-gray-400 truncate max-w-[100px]">{{ results[1]?.Constructor.name }}</div>
        </div>
        <div class="h-16 md:h-24 w-16 md:w-24 bg-gradient-to-t from-gray-300/20 to-gray-300/5 rounded-t-lg mt-2 border-t border-gray-300/30"></div>
      </div>

      <!-- 1st Place -->
      <div class="flex flex-col items-center group -mb-2">
        <div class="relative mb-3 transition-transform duration-300 group-hover:-translate-y-2">
          <div class="absolute -inset-2 bg-yellow-400/20 rounded-full blur-xl animate-pulse-slow"></div>
          <div class="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.4)] relative">
            <img 
              :src="getDriverImage(results[0]?.Driver.driverId)" 
              :alt="formatDriverName(results[0])"
              class="w-full h-full object-cover"
            />
          </div>
          <div class="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-f1-black font-bold text-sm px-3 py-0.5 rounded-full shadow-lg">
            1
          </div>
        </div>
        <div class="text-center">
          <div class="font-bold text-white text-base md:text-lg truncate max-w-[120px] md:max-w-[160px]">{{ results[0]?.Driver.familyName }}</div>
          <div class="text-xs text-gray-400 truncate max-w-[120px]">{{ results[0]?.Constructor.name }}</div>
        </div>
        <div class="h-24 md:h-32 w-20 md:w-28 bg-gradient-to-t from-yellow-400/20 to-yellow-400/5 rounded-t-lg mt-2 border-t border-yellow-400/30 flex items-end justify-center pb-2">
          <span class="text-yellow-400/50 text-2xl">🏆</span>
        </div>
      </div>

      <!-- 3rd Place -->
      <div class="flex flex-col items-center group">
        <div class="relative mb-3 transition-transform duration-300 group-hover:-translate-y-1">
          <div class="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-amber-700 shadow-[0_0_15px_rgba(180,83,9,0.3)]">
            <img 
              :src="getDriverImage(results[2]?.Driver.driverId)" 
              :alt="formatDriverName(results[2])"
              class="w-full h-full object-cover"
            />
          </div>
          <div class="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-amber-700 text-white font-bold text-xs px-2 py-0.5 rounded-full shadow-lg">
            3
          </div>
        </div>
        <div class="text-center">
          <div class="font-bold text-white text-sm md:text-base truncate max-w-[100px] md:max-w-[140px]">{{ results[2]?.Driver.familyName }}</div>
          <div class="text-xs text-gray-400 truncate max-w-[100px]">{{ results[2]?.Constructor.name }}</div>
        </div>
        <div class="h-12 md:h-16 w-16 md:w-24 bg-gradient-to-t from-amber-700/20 to-amber-700/5 rounded-t-lg mt-2 border-t border-amber-700/30"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { RaceResult } from '~/types/f1'

const props = defineProps<{
  results: RaceResult[]
}>()

const { getDriverImage } = useDriverImages()

const formatDriverName = (result?: RaceResult) => {
  if (!result) return '-'
  return `${result.Driver.givenName} ${result.Driver.familyName}`
}
</script>