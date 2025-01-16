<template>
  <div class="flex flex-col sm:flex-row gap-4">
    <div class="form-control">
      <label class="label">
        <span class="label-text">Année de début</span>
      </label>
      <select 
        v-model="localStartYear" 
        class="select select-bordered w-full"
        @change="emitUpdate"
      >
        <option v-for="year in availableYears" :key="year" :value="year">
          {{ year }}
        </option>
      </select>
    </div>
    
    <div class="form-control">
      <label class="label">
        <span class="label-text">Année de fin</span>
      </label>
      <select 
        v-model="localEndYear" 
        class="select select-bordered w-full"
        @change="emitUpdate"
      >
        <option v-for="year in availableEndYears" :key="year" :value="year">
          {{ year }}
        </option>
      </select>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  startYear: {
    type: Number,
    required: true
  },
  endYear: {
    type: Number,
    required: true
  }
})

const emits = defineEmits(['update:startYear', 'update:endYear'])

const localStartYear = ref(props.startYear)
const localEndYear = ref(props.endYear)

const currentYear = new Date().getFullYear()
const minYear = 1950

const availableYears = computed(() => {
  const years = []
  for (let year = currentYear; year >= minYear; year--) {
    years.push(year)
  }
  return years
})

const availableEndYears = computed(() => {
  return availableYears.value.filter(year => year >= localStartYear.value)
})

const emitUpdate = () => {
  emits('update:startYear', localStartYear.value)
  emits('update:endYear', localEndYear.value)
}

watch(() => props.startYear, (newValue) => {
  localStartYear.value = newValue
})

watch(() => props.endYear, (newValue) => {
  localEndYear.value = newValue
})

// Ajuster l'année de fin si elle devient invalide
watch(localStartYear, (newStartYear) => {
  if (localEndYear.value < newStartYear) {
    localEndYear.value = newStartYear
    emits('update:endYear', newStartYear)
  }
})
</script>