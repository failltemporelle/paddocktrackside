<template>
  <div class="flex items-center gap-2 mb-4">
    <button 
      class="btn btn-circle btn-sm" 
      @click="changeYear(-1)"
      :disabled="selectedYear <= minYear"
    >
      ❮
    </button>
    <select 
      v-model="selectedYear" 
      class="select select-bordered"
      @change="$emit('update:year', selectedYear)"
    >
      <option 
        v-for="year in availableYears" 
        :key="year" 
        :value="year"
      >
        Saison {{ year }}
      </option>
    </select>
    <button 
      class="btn btn-circle btn-sm" 
      @click="changeYear(1)"
      :disabled="selectedYear >= currentYear"
    >
      ❯
    </button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  year: {
    type: Number,
    required: true
  },
  minYear: {
    type: Number,
    default: 1950
  }
})

const emits = defineEmits(['update:year'])

const currentYear = new Date().getFullYear()
const selectedYear = ref(props.year)

const availableYears = computed(() => {
  const years = []
  for (let year = currentYear; year >= props.minYear; year--) {
    years.push(year)
  }
  return years
})

const changeYear = (delta: number) => {
  const newYear = selectedYear.value + delta
  if (newYear >= props.minYear && newYear <= currentYear) {
    selectedYear.value = newYear
    emits('update:year', newYear)
  }
}

watch(() => props.year, (newYear) => {
  selectedYear.value = newYear
})
</script>