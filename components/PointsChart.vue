<template>
  <div class="w-full h-[400px]" role="img" :aria-label="ariaLabel">
    <Line
      :data="chartData"
      :options="chartOptions"
    />
  </div>
</template>

<script setup lang="ts">
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const props = defineProps({
  labels: {
    type: Array as PropType<string[]>,
    required: true
  },
  datasets: {
    type: Array as PropType<{
      label: string
      data: number[]
      borderColor: string
      backgroundColor: string
      fill?: boolean
      borderDash?: number[]
      pointRadius?: number
      tension?: number
    }[]>,
    required: true
  },
  // Alternative textuelle du graphique (lecteurs d'écran)
  ariaLabel: {
    type: String,
    default: 'Graphique en courbes'
  }
})

const chartData = computed(() => ({
  labels: props.labels,
  datasets: props.datasets
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
      labels: {
        color: '#d1d5db'
      }
    },
    tooltip: {
      mode: 'index' as const,
      intersect: false
    }
  },
  scales: {
    x: {
      grid: {
        display: false
      },
      ticks: {
        color: '#9ca3af'
      }
    },
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(156,163,175,0.15)'
      },
      ticks: {
        color: '#9ca3af'
      }
    }
  }
}
</script>