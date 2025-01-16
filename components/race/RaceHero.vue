<template>
  <div class="relative h-[50vh] min-h-[400px] bg-gradient-to-r from-f1-black to-f1-gray">
    <img 
      :src="circuitImage" 
      :alt="circuit.circuitName"
      class="absolute inset-0 w-full h-full object-cover opacity-50"
    />
    <div class="absolute inset-0 bg-gradient-to-t from-f1-black/80 to-transparent"></div>
    <div class="container relative h-full flex flex-col justify-end pb-12">
      <div class="space-y-4">
        <div class="flex items-center gap-2">
          <span class="badge badge-primary">Round {{ round }}</span>
          <span class="badge badge-ghost">{{ season }}</span>
        </div>
        <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
          {{ raceName }}
        </h1>
        <div class="flex flex-wrap items-center gap-4 text-white/80">
          <div class="flex items-center gap-2">
            <CalendarIcon class="w-5 h-5" />
            <span>{{ formatDate(date) }}</span>
          </div>
          <div class="flex items-center gap-2">
            <ClockIcon class="w-5 h-5" />
            <span>{{ formatTime(time) }}</span>
          </div>
          <div class="flex items-center gap-2">
            <MapPinIcon class="w-5 h-5" />
            <span>{{ circuit.Location.locality }}, {{ circuit.Location.country }}</span>
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