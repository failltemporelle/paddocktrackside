<template>
  <div class="bg-f1-dark-gray/40 backdrop-blur-md rounded-2xl border border-white/5 overflow-hidden">
    <div class="p-6 border-b border-white/5 flex items-center justify-between">
      <h2 class="text-xl font-display font-bold italic text-white flex items-center gap-3">
        <span class="w-1 h-6 bg-f1-red rounded-full"></span>
        Circuit Information
      </h2>
      <div class="flex gap-2">
        <a 
          :href="circuit.url" 
          target="_blank" 
          rel="noopener noreferrer"
          class="btn btn-sm bg-white/5 hover:bg-white/10 text-white border-none gap-2 rounded-lg"
          title="Détails du circuit"
        >
          <ArrowTopRightOnSquareIcon class="w-4 h-4" />
          <span class="hidden sm:inline">Détails</span>
        </a>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3">
      <!-- Circuit Layout (Large) -->
      <div class="lg:col-span-2 p-6 border-b lg:border-b-0 lg:border-r border-white/5 flex items-center justify-center bg-black/20">
        <CircuitLayout :circuit="circuit" class="max-h-[300px] w-full" />
      </div>

      <!-- Details (Compact Sidebar) -->
      <div class="p-6 space-y-6">
        <div>
          <div class="text-xs text-gray-500 uppercase tracking-wider mb-1">Nom du Circuit</div>
          <div class="text-lg font-bold text-white leading-tight">{{ circuit.circuitName }}</div>
        </div>
        
        <div>
          <div class="text-xs text-gray-500 uppercase tracking-wider mb-1">Localisation</div>
          <div class="flex items-center gap-2 text-white">
            <span>📍</span>
            <span class="font-medium">{{ circuit.Location.locality }}, {{ circuit.Location.country }}</span>
          </div>
        </div>

        <div class="pt-4 border-t border-white/5">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <div class="text-xs text-gray-500 uppercase tracking-wider mb-1">Latitude</div>
              <div class="text-sm font-mono text-gray-300">{{ circuit.Location.lat }}</div>
            </div>
            <div>
              <div class="text-xs text-gray-500 uppercase tracking-wider mb-1">Longitude</div>
              <div class="text-sm font-mono text-gray-300">{{ circuit.Location.long }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowTopRightOnSquareIcon } from '@heroicons/vue/24/outline'
import type { Race } from '~/types/f1'

defineProps<{
  circuit: Race['Circuit']
}>()
</script>