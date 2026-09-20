<template>
  <div class="bg-f1-dark-gray/40 backdrop-blur-md rounded-2xl border border-white/5 overflow-hidden">
    <div class="p-4 md:p-6 border-b border-white/5">
      <h2 class="text-xl font-display font-bold italic text-white flex items-center gap-3">
        <span class="w-1 h-6 bg-f1-red rounded-full"></span>
        Résultats Qualifications
      </h2>
    </div>
    
    <!-- Mobile et tablette (< 1024 px) : une carte compacte par ligne, aucun défilement latéral -->
    <ol class="lg:hidden divide-y divide-white/5" aria-label="Classement des qualifications">
      <li v-for="result in results" :key="result.position" class="flex items-start gap-2 px-3 py-3">
        <span class="w-8 shrink-0 text-center font-display font-bold italic text-lg leading-6 text-white">{{ result.position }}</span>
        <div class="min-w-0 flex-1">
          <p class="font-bold text-white">{{ result.Driver.givenName }} {{ result.Driver.familyName }}</p>
          <p class="text-sm text-gray-300">{{ result.Constructor.name }}</p>
          <dl class="grid grid-cols-3 gap-2 mt-2 text-xs">
            <div>
              <dt class="text-gray-400">Q1</dt>
              <dd class="font-mono text-gray-300">{{ result.Q1 || '-' }}</dd>
            </div>
            <div>
              <dt class="text-gray-400">Q2</dt>
              <dd class="font-mono text-gray-300">{{ result.Q2 || '-' }}</dd>
            </div>
            <div>
              <dt class="text-gray-400">Q3</dt>
              <dd class="font-mono text-white font-bold">{{ result.Q3 || '-' }}</dd>
            </div>
          </dl>
        </div>
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
            <th class="px-6 py-4 text-center">Q1</th>
            <th class="px-6 py-4 text-center">Q2</th>
            <th class="px-6 py-4 text-center">Q3</th>
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
            <td class="px-6 py-4 text-center font-mono text-sm text-gray-400">{{ result.Q1 || '-' }}</td>
            <td class="px-6 py-4 text-center font-mono text-sm text-gray-400">{{ result.Q2 || '-' }}</td>
            <td class="px-6 py-4 text-center font-mono text-sm text-white font-bold">{{ result.Q3 || '-' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { QualifyingResult } from '~/types/f1'

defineProps({
  results: {
    type: Array as PropType<QualifyingResult[]>,
    required: true
  }
})
</script>