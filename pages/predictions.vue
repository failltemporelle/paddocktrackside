<template>
  <div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold mb-6">Prédictions de course</h1>
    
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Formulaire de prédiction -->
      <div class="lg:col-span-2">
        <PredictionsForm @submit="handlePredictionSubmit" />
      </div>

      <!-- Résultats et statistiques -->
      <div class="space-y-6">
        <PredictionsStats :stats="userStats" />
        <PredictionsList :predictions="savedPredictions" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Prediction, PredictionStats } from '~/types/predictions'

const userStats = ref<PredictionStats>({
  totalPredictions: 0,
  successRate: 0,
  averageAccuracy: 0
})

const savedPredictions = ref<Prediction[]>([])

const handlePredictionSubmit = (prediction: Prediction) => {
  savedPredictions.value.unshift(prediction)
  userStats.value.totalPredictions++
}
</script>