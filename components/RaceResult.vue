<template>
  <div class="bg-f1-dark-gray/40 backdrop-blur-md rounded-2xl border border-white/5 overflow-hidden">
    <div class="p-4 md:p-6 border-b border-white/5">
      <h2 class="text-2xl font-display font-bold italic text-white flex items-center gap-3">
        <span class="w-1 h-6 bg-f1-red rounded-full"></span>
        Race Results
      </h2>
    </div>
    
    <!-- Mobile et tablette (< 1024 px) : une carte compacte par ligne, aucun défilement latéral -->
    <ol class="lg:hidden divide-y divide-white/5" aria-label="Classement de la course">
      <li v-for="result in results" :key="result.position" class="flex items-start gap-2 px-3 py-3">
        <span class="w-8 shrink-0 text-center font-display font-bold italic text-lg leading-8" :class="getPosColor(result.position)">
          {{ result.position }}
        </span>
        <div class="min-w-0 flex-1">
          <div class="flex items-center gap-2">
            <span class="w-1 h-4 rounded-full shrink-0" :style="getTeamColor(result.Constructor.constructorId)" aria-hidden="true"></span>
            <span class="font-bold text-white">{{ result.Driver.givenName }} {{ result.Driver.familyName }}</span>
            <span class="text-xs text-gray-400">#{{ result.number }}</span>
          </div>
          <p class="text-sm text-gray-300 mt-0.5">{{ result.Constructor.name }} · {{ result.laps }} tours</p>
          <p class="text-sm font-mono text-white mt-1">{{ result.Time?.time || result.status }}</p>
          <p v-if="result.FastestLap" class="text-xs text-f1-red flex items-center gap-1 mt-1">
            <span class="w-1.5 h-1.5 rounded-full bg-f1-red shrink-0" aria-hidden="true"></span>
            {{ result.FastestLap.Time.time }} (Lap {{ result.FastestLap.lap }})
          </p>
        </div>
        <span class="shrink-0 flex flex-col items-center justify-center min-w-[2.75rem] py-1 rounded-lg bg-white/10 text-white border border-white/10 leading-none">
          <span class="font-bold text-base">{{ result.points }}</span>
          <span class="text-xs text-gray-300 mt-0.5">pts</span>
        </span>
      </li>
    </ol>

    <!-- Bureau (>= 1024 px) : tableau complet -->
    <div class="hidden lg:block overflow-x-auto">
      <table class="w-full text-left">
        <thead class="bg-white/5 text-gray-400 text-xs uppercase tracking-wider font-medium">
          <tr>
            <th class="px-6 py-4">Pos</th>
            <th class="px-6 py-4">Driver</th>
            <th class="px-6 py-4">Team</th>
            <th class="px-6 py-4 text-center">Laps</th>
            <th class="px-6 py-4">Time/Status</th>
            <th class="px-6 py-4 text-center">Points</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-white/5">
          <tr v-for="result in results" :key="result.position" class="hover:bg-white/5 transition-colors group">
            <td class="px-6 py-4">
              <div class="font-display font-bold italic text-lg" :class="getPosColor(result.position)">
                {{ result.position }}
              </div>
            </td>
            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <div class="w-1 h-8 rounded-full" :style="getTeamColor(result.Constructor.constructorId)"></div>
                <div>
                  <div class="font-bold text-white group-hover:text-f1-red transition-colors">
                    {{ result.Driver.givenName }} {{ result.Driver.familyName }}
                  </div>
                  <div class="text-xs text-gray-400">#{{ result.number }}</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4">
              <span class="text-gray-300">{{ result.Constructor.name }}</span>
            </td>
            <td class="px-6 py-4 text-center text-gray-400">
              {{ result.laps }}
            </td>
            <td class="px-6 py-4">
              <div class="flex flex-col">
                <span class="text-white font-mono text-sm">{{ result.Time?.time || result.status }}</span>
                <span v-if="result.FastestLap" class="text-xs text-f1-red flex items-center gap-1 mt-1">
                  <span class="w-1.5 h-1.5 rounded-full bg-f1-red animate-pulse"></span>
                  {{ result.FastestLap.Time.time }} (Lap {{ result.FastestLap.lap }})
                </span>
              </div>
            </td>
            <td class="px-6 py-4 text-center">
              <span class="inline-flex items-center justify-center min-w-[2rem] h-8 px-2 rounded-lg bg-white/10 text-white font-bold border border-white/10 group-hover:border-f1-red/50 group-hover:bg-f1-red/10 transition-all">
                {{ result.points }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { RaceResult } from '~/types/f1'

defineProps({
  results: {
    type: Array as PropType<RaceResult[]>,
    required: true
  }
})

const getPosColor = (pos: string) => {
  switch(pos) {
    case '1': return 'text-yellow-400 text-2xl'
    case '2': return 'text-gray-300 text-xl'
    case '3': return 'text-amber-600 text-xl'
    default: return 'text-white/50'
  }
}

const getTeamColor = (constructorId: string) => {
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
    'haas': 'background-color: #B6BABD'
  }
  return colors[constructorId] || 'background-color: #666666'
}
</script>