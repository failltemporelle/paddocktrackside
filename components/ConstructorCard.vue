<template>
  <div class="h-full hover-3d">
    <!-- 9 empty divs for 3D effect -->
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
      
      <!-- Full Card Background/Image -->
      <div class="absolute inset-0 z-0 bg-f1-dark-gray">
        <!-- Team Gradient Background -->
        <div class="absolute inset-0 opacity-40 transition-opacity duration-500 group-hover:opacity-60"
             :style="`background: ${constructorColors[team.Constructor.constructorId]?.background || 'linear-gradient(135deg, #333 0%, #000 100%)'}`">
        </div>

        <!-- Car/Team Image -->
        <div class="absolute inset-0 flex items-center justify-center p-4">
             <img 
              :src="constructorImage" 
              :alt="team.Constructor.name"
              class="w-full h-auto max-h-[80%] object-contain filter drop-shadow-2xl transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
              :class="{ 'opacity-0': loading, 'opacity-100': !loading }"
              @error="handleImageError"
              @load="loading = false"
              loading="lazy"
            />
        </div>
        
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
            <span class="text-3xl font-display font-bold italic text-white leading-none">{{ team.position }}</span>
            <span class="text-[10px] font-bold tracking-widest text-white/60 uppercase">Pos</span>
          </div>

          <!-- Top Right: Points -->
          <div class="flex flex-col items-end justify-center bg-f1-red/80 backdrop-blur-sm rounded-lg border border-f1-red px-3 py-1 shadow-[0_0_15px_rgba(255,24,1,0.4)]">
            <span class="text-2xl font-bold text-white leading-none">{{ team.points }}</span>
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
                :src="`https://flagcdn.com/w40/${getCountryCode(team.Constructor.nationality)}.png`" 
                :alt="team.Constructor.nationality"
                class="h-3 w-5 object-cover rounded shadow-sm opacity-90"
              />
              <span class="text-xs font-medium text-gray-300 uppercase tracking-wider">{{ team.Constructor.nationality }}</span>
            </div>
            <h1 class="text-xl font-display font-bold italic text-white uppercase tracking-wide leading-none group-hover:text-f1-red transition-colors">
              {{ team.Constructor.name }}
            </h1>
          </div>

          <!-- Bottom Right: Team Color Bar & Wins -->
          <div class="flex flex-col items-end">
             <div class="flex items-center gap-2 bg-f1-black/60 backdrop-blur-md rounded-full pl-2 pr-3 py-1 border border-white/10">
                <div class="w-2 h-6 rounded-full" 
                     :style="`background: ${constructorColors[team.Constructor.constructorId]?.primary || '#666'}; box-shadow: 0 0 10px ${constructorColors[team.Constructor.constructorId]?.primary || '#666'}80`">
                </div>
                <div class="flex flex-col items-start leading-none">
                  <span class="text-[10px] text-gray-400 font-bold uppercase">Victoires</span>
                  <span class="text-sm font-bold text-white">{{ team.wins }}</span>
                </div>
             </div>
          </div>

        </div>

      </div>
    </figure>
  </div>
</template>

<script setup lang="ts">
import type { Constructor } from '~/types/f1'
import { ref, computed } from 'vue'

const props = defineProps({
  team: {
    type: Object as PropType<Constructor>,
    required: true
  },
  maxPoints: {
    type: Number,
    required: true
  }
})

const { getConstructorImage } = useConstructorImages()
const constructorImage = getConstructorImage(props.team.Constructor.constructorId)
const showPlaceholder = ref(false)
const loading = ref(true)

const handleImageError = () => {
  showPlaceholder.value = true
  loading.value = false
}

// Couleurs des écuries
const constructorColors: Record<string, { primary: string, background: string }> = {
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
const podiums = computed(() => Math.floor(Number(props.team.wins) * 2.5))

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