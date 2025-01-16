<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
    <!-- Circuit Layout -->
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title">Circuit Layout</h2>
        <CircuitLayout :circuit="circuit" />
      </div>
    </div>

    <!-- Circuit Details -->
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body space-y-6">
        <h2 class="card-title">Circuit Information</h2>
        
        <div class="stats shadow">
          <div class="stat">
            <div class="stat-title">Circuit</div>
            <div class="stat-value text-lg">{{ circuit.circuitName }}</div>
          </div>
          
          <div class="stat">
            <div class="stat-title">Location</div>
            <div class="stat-value text-lg">{{ circuit.Location.locality }}</div>
            <div class="stat-desc">{{ circuit.Location.country }}</div>
          </div>
        </div>

        <div class="flex flex-wrap gap-4">
          <a 
            :href="circuit.url" 
            target="_blank" 
            rel="noopener noreferrer"
            class="btn btn-primary"
          >
            Circuit Details
            <ArrowTopRightOnSquareIcon class="w-5 h-5" />
          </a>
          
          <button class="btn btn-outline gap-2">
            <ShareIcon class="w-5 h-5" />
            Share
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowTopRightOnSquareIcon, ShareIcon } from '@heroicons/vue/24/outline'
import type { Race } from '~/types/f1'

defineProps<{
  circuit: Race['Circuit']
}>()
</script>