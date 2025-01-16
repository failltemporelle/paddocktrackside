<template>
  <div class="space-y-8">
    <!-- Podium -->
    <div v-if="results && results.length > 0" class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title mb-6">Podium</h2>
        <RacePodium :results="results" />
      </div>
    </div>

    <!-- Results Tabs -->
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <div class="tabs tabs-boxed mb-6">
          <a 
            class="tab" 
            :class="{ 'tab-active': activeTab === 'race' }"
            @click="activeTab = 'race'"
          >
            Course
          </a>
          <a 
            class="tab" 
            :class="{ 'tab-active': activeTab === 'qualifying' }"
            @click="activeTab = 'qualifying'"
          >
            Qualifications
          </a>
          <a 
            v-if="hasSprintWeekend"
            class="tab" 
            :class="{ 'tab-active': activeTab === 'sprint' }"
            @click="activeTab = 'sprint'"
          >
            Sprint
          </a>
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