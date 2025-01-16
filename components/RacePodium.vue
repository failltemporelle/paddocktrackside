<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
    <!-- 2ème place -->
    <div class="card bg-base-100 shadow-xl order-2 md:order-1">
      <div class="card-body items-center text-center">
        <div class="relative w-24 h-24 rounded-full overflow-hidden mb-2 border-4 border-gray-300">
          <img 
            :src="getDriverImage(results[1]?.Driver.driverId)" 
            :alt="formatDriverName(results[1])"
            class="w-full h-full object-cover"
          />
        </div>
        <h3 class="card-title text-xl">{{ formatDriverName(results[1]) }}</h3>
        <p class="text-sm">{{ results[1]?.Constructor.name }}</p>
        <div class="badge badge-secondary">{{ results[1]?.Time?.time || results[1]?.status }}</div>
      </div>
    </div>

    <!-- 1ère place -->
    <div class="card bg-base-100 shadow-xl border-4 border-yellow-400 order-1 md:order-2 transform md:-translate-y-4">
      <div class="card-body items-center text-center">
        <div class="relative w-32 h-32 rounded-full overflow-hidden mb-2 border-4 border-yellow-400">
          <img 
            :src="getDriverImage(results[0]?.Driver.driverId)" 
            :alt="formatDriverName(results[0])"
            class="w-full h-full object-cover"
          />
        </div>
        <h3 class="card-title text-2xl">{{ formatDriverName(results[0]) }}</h3>
        <p class="text-sm">{{ results[0]?.Constructor.name }}</p>
        <div class="badge badge-primary">{{ results[0]?.Time?.time || results[0]?.status }}</div>
      </div>
    </div>

    <!-- 3ème place -->
    <div class="card bg-base-100 shadow-xl order-3">
      <div class="card-body items-center text-center">
        <div class="relative w-24 h-24 rounded-full overflow-hidden mb-2 border-4 border-amber-700">
          <img 
            :src="getDriverImage(results[2]?.Driver.driverId)" 
            :alt="formatDriverName(results[2])"
            class="w-full h-full object-cover"
          />
        </div>
        <h3 class="card-title text-xl">{{ formatDriverName(results[2]) }}</h3>
        <p class="text-sm">{{ results[2]?.Constructor.name }}</p>
        <div class="badge badge-accent">{{ results[2]?.Time?.time || results[2]?.status }}</div>
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