<template>
  <div class="flex items-center gap-2 mb-4 max-w-full">
    <!-- Cibles tactiles 44 px sur mobile ; taille compacte d'origine à partir de lg -->
    <button
      type="button"
      class="btn btn-circle shrink-0 h-11 w-11 min-h-11 lg:h-8 lg:w-8 lg:min-h-8"
      aria-label="Saison précédente"
      @click="changeYear(-1)"
      :disabled="selectedYear <= minYear"
    >
      <span aria-hidden="true">❮</span>
    </button>
    <select
      v-model="selectedYear"
      class="select select-bordered min-w-0 flex-1 sm:flex-none"
      aria-label="Saison"
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
      type="button"
      class="btn btn-circle shrink-0 h-11 w-11 min-h-11 lg:h-8 lg:w-8 lg:min-h-8"
      aria-label="Saison suivante"
      @click="changeYear(1)"
      :disabled="selectedYear >= currentYear"
    >
      <span aria-hidden="true">❯</span>
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