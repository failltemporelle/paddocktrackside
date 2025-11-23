<template>
  <div class="relative h-[60vh] min-h-[500px] w-full overflow-hidden">
    <!-- Background Image with Overlay -->
    <div class="absolute inset-0">
      <img 
        :src="circuitImage" 
        :alt="circuit.circuitName"
        class="w-full h-full object-cover transform scale-105"
      />
      <div class="absolute inset-0 bg-gradient-to-b from-f1-black/30 via-f1-black/60 to-f1-black"></div>
      <div class="absolute inset-0 bg-gradient-to-r from-f1-black/80 via-transparent to-transparent"></div>
    </div>

    <!-- Content -->
    <div class="container relative h-full flex flex-col justify-end pb-16 px-4 mx-auto">
      <div class="max-w-4xl space-y-6 animate-slide-up">
        <!-- Badges -->
        <div class="flex items-center gap-3">
          <span class="px-3 py-1 rounded-full bg-f1-red text-white text-sm font-bold tracking-wider uppercase shadow-[0_0_15px_rgba(255,24,1,0.4)]">
            Round {{ round }}
          </span>
          <span class="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-white text-sm font-bold border border-white/20">
            {{ season }} Season
          </span>
        </div>

        <!-- Title -->
        <h1 class="text-5xl md:text-7xl lg:text-8xl font-display font-bold italic text-white leading-none tracking-tight">
          {{ raceName }}
        </h1>

        <!-- Circuit Name -->
        <h2 class="text-2xl md:text-3xl text-gray-300 font-light">
          {{ circuit.circuitName }}
        </h2>

        <!-- Details Grid -->
        <div class="flex flex-wrap gap-8 pt-4 border-t border-white/10">
          <div class="flex items-center gap-3 text-white/90">
            <div class="p-2 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
              <CalendarIcon class="w-6 h-6 text-f1-red" />
            </div>
            <div class="flex flex-col">
              <span class="text-xs text-gray-400 uppercase tracking-wider">Date</span>
              <span class="font-medium">{{ formatDate(date) }}</span>
            </div>
          </div>

          <div class="flex items-center gap-3 text-white/90">
            <div class="p-2 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
              <ClockIcon class="w-6 h-6 text-f1-red" />
            </div>
            <div class="flex flex-col">
              <span class="text-xs text-gray-400 uppercase tracking-wider">Heure</span>
              <span class="font-medium">{{ formatTime(time) }}</span>
            </div>
          </div>

          <div class="flex items-center gap-3 text-white/90">
            <div class="p-2 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
              <MapPinIcon class="w-6 h-6 text-f1-red" />
            </div>
            <div class="flex flex-col">
              <span class="text-xs text-gray-400 uppercase tracking-wider">Lieu</span>
              <span class="font-medium">{{ circuit.Location.locality }}, {{ circuit.Location.country }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CalendarIcon, ClockIcon, MapPinIcon } from '@heroicons/vue/24/outline'
import type { Race } from '~/types/f1'
const { getCircuitImage } = useCircuitImages()
const { formatDate, formatTime } = useRaceData()

const props = defineProps<{
  raceName: string
  season: string
  round: string
  date: string
  time: string
  circuit: Race['Circuit']
}>()

const circuitImage = computed(() => getCircuitImage(props.circuit.circuitId))
</script>