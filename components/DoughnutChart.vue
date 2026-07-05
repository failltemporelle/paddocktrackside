<template>
  <div class="w-full h-[220px]">
    <Doughnut :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup lang="ts">
import { Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

const props = defineProps({
  labels: {
    type: Array as PropType<string[]>,
    required: true
  },
  datasets: {
    type: Array as PropType<{
      data: number[]
      backgroundColor?: string[]
      borderWidth?: number
    }[]>,
    required: true
  }
})

const palette = ['#FF1801', '#F8F4F4', '#38383F']

const chartData = computed(() => ({
  labels: props.labels,
  datasets: props.datasets.map(ds => ({
    backgroundColor: palette,
    borderColor: '#0B0B0F',
    borderWidth: 2,
    hoverOffset: 6,
    ...ds
  }))
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '68%',
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: {
        color: '#9ca3af',
        boxWidth: 10,
        padding: 12,
        font: { size: 11 }
      }
    },
    tooltip: {
      mode: 'index' as const,
      intersect: false
    }
  }
}
</script>
