<template>
  <div class="card bg-white hover:shadow-xl transition-all duration-300">
    <!-- En-tête avec image et overlay -->
    <div class="relative h-48 rounded-t-xl overflow-hidden" :style="headerBackground">
      <img 
        :src="constructorImage" 
        :alt="constructor.Constructor.name"
        class="absolute left-1/2 -translate-x-1/2 h-full object-contain object-center transform hover:scale-105 transition-transform duration-500"
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
        {{ constructor.position }}
      </div>
    </div>

    <!-- Contenu -->
    <div class="p-6 space-y-4">
      <!-- Nom de l'écurie -->
      <div>
        <h2 class="text-2xl font-bold tracking-tight" :style="{ color: constructorColors[constructor.Constructor.constructorId]?.primary || '#000' }">
          {{ constructor.Constructor.name }}
        </h2>
      </div>

      <!-- Stats principales -->
      <div class="grid grid-cols-3 gap-6">
        <div class="text-center">
          <div class="text-3xl font-bold" :style="{ color: constructorColors[constructor.Constructor.constructorId]?.primary || '#000' }">
            {{ constructor.points }}
          </div>
          <div class="text-sm text-gray-600 uppercase">PTS</div>
        </div>
        <div class="text-center">
          <div class="text-3xl font-bold">{{ constructor.wins }}</div>
          <div class="text-sm text-gray-600 uppercase">Wins</div>
        </div>
        <div class="text-center">
          <div class="text-3xl font-bold">{{ podiums }}</div>
          <div class="text-sm text-gray-600 uppercase">Podiums</div>
        </div>
      </div>

      <!-- Barre de progression -->
      <div class="w-full mt-4">
        <ProgressBar 
          :value="Number(constructor.points)" 
          :max-value="maxPoints"
          :color="constructorColors[constructor.Constructor.constructorId]?.primary"
        />
      </div>

      <!-- Footer -->
      <div class="flex justify-between items-center pt-2">
        <div class="flex items-center gap-2">
          <img 
            :src="`https://flagcdn.com/24x18/${getCountryCode(constructor.Constructor.nationality)}.png`" 
            :alt="constructor.Constructor.nationality"
            class="w-6 h-4 object-cover rounded"
          />
          <span class="text-sm">{{ constructor.Constructor.nationality }}</span>
        </div>
        <div class="text-sm text-gray-600">
          {{ new Date().getFullYear() }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Constructor } from '~/types/f1'
import { ref, computed } from 'vue'

const props = defineProps({
  constructor: {
    type: Object as PropType<Constructor>,
    required: true
  },
  maxPoints: {
    type: Number,
    required: true
  }
})

const { getConstructorImage } = useConstructorImages()
const constructorImage = getConstructorImage(props.constructor.Constructor.constructorId)
const showPlaceholder = ref(false)
const loading = ref(true)

const handleImageError = () => {
  showPlaceholder.value = true
  loading.value = false
}

// Couleurs des écuries
const constructorColors = {
  'red_bull': { primary: '#0600EF', background: 'linear-gradient(135deg, #0600EF 0%, #000B3E 100%)' },
  'ferrari': { primary: '#DC0000', background: 'linear-gradient(135deg, #DC0000 0%, #840000 100%)' },
  'mercedes': { primary: '#00D2BE', background: 'linear-gradient(135deg, #00D2BE 0%, #007A6C 100%)' },
  'mclaren': { primary: '#FF8700', background: 'linear-gradient(135deg, #FF8700 0%, #C56600 100%)' },
  'aston_martin': { primary: '#006F62', background: 'linear-gradient(135deg, #006F62 0%, #003B34 100%)' },
  'alpine': { primary: '#0090FF', background: 'linear-gradient(135deg, #0090FF 0%, #005299 100%)' },
  'williams': { primary: '#005AFF', background: 'linear-gradient(135deg, #005AFF 0%, #003399 100%)' },
  'rb': { primary: '#1E3D9B', background: 'linear-gradient(135deg, #1E3D9B 0%, #0F1F4F 100%)' },
  'sauber': { primary: '#52E252', background: 'linear-gradient(135deg, #52E252 0%, #318631 100%)' },
  'haas': { primary: '#2C2C2C', background: 'linear-gradient(135deg, #2C2C2C 0%, #111111 100%)' }
}

const headerBackground = computed(() => ({
  background: constructorColors[props.constructor.Constructor.constructorId]?.background || 'linear-gradient(135deg, #666666 0%, #333333 100%)'
}))

// Simulation du nombre de podiums (à remplacer par des données réelles)
const podiums = computed(() => Math.floor(Number(props.constructor.wins) * 2.5))

// Conversion nationalité en code pays
const getCountryCode = (nationality: string) => {
  const countryMap: Record<string, string> = {
    'British': 'gb',
    'Austrian': 'at',
    'Italian': 'it',
    'German': 'de',
    'French': 'fr',
    'Swiss': 'ch',
    'American': 'us'
  }
  return countryMap[nationality]?.toLowerCase() || 'unknown'
}
</script>

<style scoped>
.card {
  @apply relative rounded-xl border border-gray-100;
}

.card:hover {
  @apply border-gray-300;
}
</style>