<template>
  <div class="card bg-base-100 shadow-xl">
    <div class="card-body">
      <h2 class="card-title">Vos statistiques</h2>
      
      <div class="stats shadow">
        <div class="stat">
          <div class="stat-title">Prédictions</div>
          <div class="stat-value">{{ stats.totalPredictions }}</div>
        </div>
        
        <div class="stat">
          <div class="stat-title">Taux de réussite</div>
          <div class="stat-value">{{ stats.successRate }}%</div>
        </div>
        
        <div class="stat">
          <div class="stat-title">Précision moyenne</div>
          <div class="stat-value">{{ stats.averageAccuracy }}%</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PredictionStats } from '~/types/predictions'

defineProps<{
  stats: PredictionStats
}>()
</script>