<template>
  <div class="bg-f1-dark-gray/40 backdrop-blur-md rounded-2xl border border-white/5 overflow-hidden">
    <div class="p-4 md:p-6 border-b border-white/5">
      <h2 class="text-xl font-display font-bold italic text-white flex items-center gap-3">
        <span class="w-1 h-6 bg-f1-red rounded-full"></span>
        Résultats Sprint
      </h2>
    </div>

    <!-- Mobile et tablette (< 1024 px) : une carte compacte par ligne, aucun défilement latéral -->
    <ol class="lg:hidden divide-y divide-white/5" aria-label="Classement du sprint">
      <li v-for="result in results" :key="result.position" class="flex items-start gap-2 px-3 py-3">
        <span class="w-8 shrink-0 text-center font-display font-bold italic text-lg leading-8 text-white">{{ result.position }}</span>
        <div class="min-w-0 flex-1">
          <p class="font-bold text-white">{{ result.Driver.givenName }} {{ result.Driver.familyName }}</p>
          <p class="text-sm text-gray-300">{{ result.Constructor.name }}</p>
          <p class="text-xs text-gray-400 mt-0.5">Grille {{ result.grid }} · {{ result.laps }} tours</p>
          <p class="text-sm font-mono text-white mt-1">{{ result.Time?.time || result.status }}</p>
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
            <th class="px-6 py-4">Pilote</th>
            <th class="px-6 py-4">Écurie</th>
            <th class="px-6 py-4 text-center">Grille</th>
            <th class="px-6 py-4 text-center">Tours</th>
            <th class="px-6 py-4">Temps/Status</th>
            <th class="px-6 py-4 text-center">Points</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-white/5">
          <tr v-for="result in results" :key="result.position" class="hover:bg-white/5 transition-colors group">
            <td class="px-6 py-4">
              <span class="font-display font-bold italic text-white">{{ result.position }}</span>
            </td>
            <td class="px-6 py-4">
              <div class="font-bold text-white group-hover:text-f1-red transition-colors">
                {{ result.Driver.givenName }} {{ result.Driver.familyName }}
              </div>
            </td>
            <td class="px-6 py-4 text-gray-300">{{ result.Constructor.name }}</td>
            <td class="px-6 py-4 text-center text-gray-400">{{ result.grid }}</td>
            <td class="px-6 py-4 text-center text-gray-400">{{ result.laps }}</td>
            <td class="px-6 py-4 font-mono text-sm text-white">{{ result.Time?.time || result.status }}</td>
            <td class="px-6 py-4 text-center">
              <span class="inline-flex items-center justify-center min-w-[2rem] h-8 px-2 rounded-lg bg-white/10 text-white font-bold border border-white/10">
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
import type { SprintResult } from '~/types/f1'

defineProps({
  results: {
    type: Array as PropType<SprintResult[]>,
    required: true
  }
})
</script>