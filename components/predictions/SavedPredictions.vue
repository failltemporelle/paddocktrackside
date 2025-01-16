<template>
  <div class="card bg-base-100 shadow-xl">
    <div class="card-body">
      <h2 class="card-title">Prédictions sauvegardées</h2>
      
      <div class="space-y-4">
        <div 
          v-for="prediction in predictions" 
          :key="prediction.id"
          class="card bg-base-200"
        >
          <div class="card-body">
            <div class="flex justify-between items-start">
              <div>
                <h3 class="font-semibold">Course #{{ prediction.raceId }}</h3>
                <p class="text-sm text-gray-600">
                  {{ new Date(prediction.createdAt).toLocaleDateString() }}
                </p>
              </div>
              <div class="badge" :class="getBadgeClass(prediction.confidence)">
                {{ prediction.confidence }}% confiance
              </div>
            </div>
            
            <div class="mt-4">
              <div class="text-sm">Podium prévu:</div>
              <ol class="list-decimal list-inside">
                <li v-for="(driverId, index) in prediction.podium" :key="index">
                  {{ driverId }}
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Prediction } from '~/types/predictions'

defineProps<{
  predictions: Prediction[]
}>()

const getBadgeClass = (confidence: number) => {
  if (confidence >= 80) return 'badge-success'
  if (confidence >= 50) return 'badge-warning'
  return 'badge-error'
}
</script>