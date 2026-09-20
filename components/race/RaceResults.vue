<template>
  <div class="space-y-8">
    <!-- Podium -->
    <div v-if="results && results.length > 0" class="card bg-base-100 shadow-xl">
      <div class="card-body p-2 sm:p-6 md:p-8">
        <!-- Sur mobile, le bloc podium affiche déjà son propre titre : celui-ci reste lu par les lecteurs d'écran -->
        <h2 class="card-title mb-6 max-sm:sr-only">Podium</h2>
        <RacePodium :results="results" />
      </div>
    </div>

    <!-- Results Tabs -->
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body p-2 sm:p-6 md:p-8">
        <div class="tabs tabs-boxed mb-4 md:mb-6 flex-nowrap md:flex-wrap" role="tablist" aria-label="Type de résultats">
          <button
            type="button"
            role="tab"
            class="tab min-h-11 flex-auto px-2 md:flex-none md:px-4"
            :class="{ 'tab-active': activeTab === 'race' }"
            :aria-selected="activeTab === 'race'"
            @click="activeTab = 'race'"
          >
            Course
          </button>
          <button
            type="button"
            role="tab"
            class="tab min-h-11 flex-auto px-2 md:flex-none md:px-4"
            :class="{ 'tab-active': activeTab === 'qualifying' }"
            :aria-selected="activeTab === 'qualifying'"
            @click="activeTab = 'qualifying'"
          >
            Qualifications
          </button>
          <button
            v-if="hasSprintWeekend"
            type="button"
            role="tab"
            class="tab min-h-11 flex-auto px-2 md:flex-none md:px-4"
            :class="{ 'tab-active': activeTab === 'sprint' }"
            :aria-selected="activeTab === 'sprint'"
            @click="activeTab = 'sprint'"
          >
            Sprint
          </button>
        </div>

        <div v-if="activeTab === 'race' && results">
          <RaceResult :results="results" />
        </div>
        
        <div v-if="activeTab === 'qualifying' && qualifyingResults">
          <QualifyingResult :results="qualifyingResults" />
        </div>
        
        <div v-if="activeTab === 'sprint' && sprintResults">
          <SprintResult :results="sprintResults" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { RaceResult, QualifyingResult, SprintResult } from '~/types/f1'

const props = defineProps<{
  results?: RaceResult[]
  qualifyingResults?: QualifyingResult[]
  sprintResults?: SprintResult[]
}>()

const activeTab = ref('race')
const hasSprintWeekend = computed(() => props.sprintResults && props.sprintResults.length > 0)
</script>