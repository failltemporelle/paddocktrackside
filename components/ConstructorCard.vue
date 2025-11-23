<template>
  <div class="group h-full">
    <div class="relative h-full bg-f1-dark-gray/40 backdrop-blur-md rounded-2xl border border-white/5 overflow-hidden transition-all duration-500 hover:border-f1-red/50 hover:shadow-[0_0_30px_rgba(255,24,1,0.15)] hover:-translate-y-1">
      
      <!-- Background Gradient -->
      <div class="absolute inset-0 opacity-10 transition-opacity duration-500 group-hover:opacity-20"
           :style="`background: ${constructorColors[constructor.Constructor.constructorId]?.background || 'linear-gradient(135deg, #333 0%, #000 100%)'}`">
      </div>

      <!-- Content -->
      <div class="relative z-10 p-6 flex flex-col h-full">
        
        <!-- Header -->
        <div class="flex justify-between items-start mb-6">
          <div class="flex flex-col">
            <span class="text-5xl font-display font-bold italic text-white/90 leading-none">{{ constructor.position }}</span>
            <span class="text-xs font-bold tracking-widest text-white/40 uppercase mt-1">Pos</span>
          </div>
          <img 
            :src="`https://flagcdn.com/w40/${getCountryCode(constructor.Constructor.nationality)}.png`" 
            :alt="constructor.Constructor.nationality"
            class="h-5 w-auto rounded shadow-sm opacity-80"
          />
        </div>

        <!-- Car/Logo Image Area -->
        <div class="relative h-32 mb-4 flex items-center justify-center">
           <img 
            :src="constructorImage" 
            :alt="constructor.Constructor.name"
            class="max-h-full max-w-full object-contain filter drop-shadow-2xl transform transition-transform duration-500 group-hover:scale-110"
            :class="{ 'opacity-0': loading, 'opacity-100': !loading }"
            @error="handleImageError"
            @load="loading = false"
            loading="lazy"
          />
           <div v-if="loading || showPlaceholder" class="absolute inset-0 flex items-center justify-center">
             <span class="loading loading-spinner text-f1-red"></span>
          </div>
        </div>

        <!-- Team Name -->
        <div class="mt-auto">
          <h2 class="text-2xl font-display font-bold italic text-white uppercase tracking-wide leading-tight mb-4 group-hover:text-f1-red transition-colors">
            {{ constructor.Constructor.name }}
          </h2>

          <!-- Stats Grid -->
          <div class="grid grid-cols-3 gap-4 border-t border-white/10 pt-4">
            <div class="text-center">
              <div class="text-xl font-bold text-f1-red">{{ constructor.points }}</div>
              <div class="text-[10px] font-bold text-white/40 uppercase tracking-wider">PTS</div>
            </div>
            <div class="text-center border-l border-white/5">
              <div class="text-xl font-bold text-white">{{ constructor.wins }}</div>
              <div class="text-[10px] font-bold text-white/40 uppercase tracking-wider">Wins</div>
            </div>
            <div class="text-center border-l border-white/5">
              <div class="text-xl font-bold text-white">{{ podiums }}</div>
              <div class="text-[10px] font-bold text-white/40 uppercase tracking-wider">Podiums</div>
            </div>
          </div>
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
  'haas': { primary: '#B6BABD', background: 'linear-gradient(135deg, #B6BABD 0%, #2C2C2C 100%)' }
}

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