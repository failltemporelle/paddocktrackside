<template>
  <div class="page-container">
    <div class="grid gap-6">
      <!-- Hero / Search -->
      <div class="relative overflow-hidden rounded-3xl border border-white/10 bg-f1-dark-gray shadow-2xl px-6 py-10 md:px-10 md:py-14">
        <div class="absolute inset-0 bg-gradient-to-br from-f1-red/10 via-transparent to-transparent"></div>
        <div class="relative z-10 max-w-2xl mx-auto text-center">
          <h1 class="font-display italic font-extrabold uppercase text-3xl md:text-5xl text-white mb-3">
            Records <span class="text-f1-red">F1</span>
          </h1>
          <p class="text-white/50 mb-8">Cherche un record (ex: "victoires", "pole position", "titres constructeurs"...) parmi toute l'histoire de la F1, de 1950 à aujourd'hui.</p>

          <div class="relative">
            <input
              v-model="query"
              type="text"
              placeholder="Tape un record... ex: nombre de pole position"
              class="input input-lg w-full bg-f1-black/60 border-white/10 text-white placeholder:text-white/30 focus:border-f1-red focus:outline-none rounded-2xl px-6"
              @keydown.enter="selectTopMatch"
            />

            <!-- Suggestions dropdown -->
            <div
              v-if="query.trim() && suggestions.length"
              class="absolute left-0 right-0 mt-2 rounded-2xl border border-white/10 bg-f1-dark-gray shadow-2xl overflow-hidden z-20 text-left"
            >
              <button
                v-for="item in suggestions"
                :key="item.slug"
                class="w-full text-left px-5 py-3 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0"
                @click="selectRecord(item)"
              >
                <p class="text-white font-medium">{{ item.title }}</p>
                <p class="text-xs text-white/40">{{ item.category === 'driver' ? 'Pilotes' : 'Écuries' }} · {{ item.description }}</p>
              </button>
            </div>

            <div
              v-else-if="query.trim() && !suggestions.length"
              class="absolute left-0 right-0 mt-2 rounded-2xl border border-white/10 bg-f1-dark-gray shadow-2xl px-5 py-4 text-left z-20"
            >
              <p class="text-white/50 text-sm">Aucun record trouvé pour "{{ query }}". Essaie "victoires", "poles", "podiums", "points", "titres"...</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Active record leaderboard -->
      <div v-if="activeRecord" class="rounded-2xl border border-white/10 bg-f1-dark-gray/60 backdrop-blur-md p-6 shadow-lg">
        <div class="flex items-start justify-between gap-4 mb-5">
          <div>
            <span class="text-xs uppercase tracking-widest text-f1-red font-semibold">{{ activeRecord.category === 'driver' ? 'Pilotes' : 'Écuries' }}</span>
            <h2 class="text-xl md:text-2xl font-display font-bold text-white mt-1">{{ activeRecord.title }}</h2>
            <p class="text-sm text-white/50 mt-1">{{ activeRecord.description }}</p>
          </div>
          <button class="btn btn-sm btn-ghost text-white/50" @click="clearRecord">✕</button>
        </div>

        <div v-if="leaderboardLoading" class="grid gap-2">
          <div v-for="i in 5" :key="i" class="skeleton h-12 w-full bg-white/5 rounded-xl"></div>
        </div>
        <div v-else-if="leaderboardError" class="text-white/50 text-sm py-6 text-center">Erreur lors du chargement du classement.</div>
        <div v-else-if="!leaderboard.length" class="text-white/50 text-sm py-6 text-center">Pas encore de données pour ce record.</div>
        <div v-else class="divide-y divide-white/5">
          <div
            v-for="(row, index) in leaderboard"
            :key="row.entity_id"
            class="flex items-center gap-4 py-3"
          >
            <span
              class="w-8 h-8 flex items-center justify-center rounded-full font-display font-bold text-sm flex-shrink-0"
              :class="index === 0 ? 'bg-f1-red text-white' : 'bg-white/10 text-white/60'"
            >{{ index + 1 }}</span>
            <div class="flex-grow min-w-0">
              <p class="text-white font-medium truncate">{{ row.entity_name }}</p>
              <p v-if="row.extra" class="text-xs text-white/40 truncate">{{ row.extra }}</p>
            </div>
            <span class="text-f1-red font-display font-bold text-lg flex-shrink-0">{{ formatValue(activeRecord.unit, row.value) }}</span>
          </div>
        </div>
      </div>

      <!-- Popular records grid (default state) -->
      <div v-else>
        <h2 class="text-lg font-display font-bold text-white mb-4">Records populaires</h2>
        <div v-if="catalogLoading" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <div v-for="i in 8" :key="i" class="skeleton h-24 w-full bg-f1-dark-gray/60 rounded-2xl"></div>
        </div>
        <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <button
            v-for="item in popularRecords"
            :key="item.slug"
            class="text-left rounded-2xl border border-white/10 bg-f1-dark-gray/60 backdrop-blur-md p-5 shadow-lg transition-colors hover:border-f1-red/40"
            @click="selectRecord(item)"
          >
            <p class="text-xs uppercase tracking-widest text-white/40 font-semibold mb-2">{{ item.category === 'driver' ? 'Pilotes' : 'Écuries' }}</p>
            <p class="text-white font-medium leading-snug">{{ item.title }}</p>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRecords, type RecordCatalogItem, type RecordLeaderboardRow } from '@/composables/useRecords'

const { fetchCatalog, searchCatalog, getLeaderboard } = useRecords()

const catalog = ref<RecordCatalogItem[]>([])
const catalogLoading = ref(true)

const query = ref('')
const activeRecord = ref<RecordCatalogItem | null>(null)
const leaderboard = ref<RecordLeaderboardRow[]>([])
const leaderboardLoading = ref(false)
const leaderboardError = ref(false)

const POPULAR_SLUGS = [
  'driver_most_wins',
  'driver_most_poles',
  'driver_most_podiums',
  'driver_most_championships',
  'driver_most_points',
  'constructor_most_wins',
  'constructor_most_championships',
  'driver_youngest_winner'
]

const popularRecords = computed(() => {
  const bySlug = new Map(catalog.value.map(item => [item.slug, item]))
  return POPULAR_SLUGS.map(slug => bySlug.get(slug)).filter((x): x is RecordCatalogItem => !!x)
})

const suggestions = computed(() => searchCatalog(catalog.value, query.value).slice(0, 6))

function formatValue(unit: string, value: number) {
  switch (unit) {
    case 'wins': return `${value} victoire${value > 1 ? 's' : ''}`
    case 'poles': return `${value} pole${value > 1 ? 's' : ''}`
    case 'podiums': return `${value} podium${value > 1 ? 's' : ''}`
    case 'points': return `${value} pts`
    case 'races': return `${value} courses`
    case 'fastest_laps': return `${value} tour${value > 1 ? 's' : ''}`
    case 'dnf': return `${value} abandon${value > 1 ? 's' : ''}`
    case 'championships': return `${value} titre${value > 1 ? 's' : ''}`
    case 'percent': return `${value}%`
    case 'age': return `${value.toFixed(1)} ans`
    default: return `${value}`
  }
}

async function selectRecord(item: RecordCatalogItem) {
  activeRecord.value = item
  query.value = ''
  leaderboard.value = []
  leaderboardLoading.value = true
  leaderboardError.value = false
  try {
    leaderboard.value = await getLeaderboard(item.slug, 10)
  } catch (error) {
    console.error('Erreur lors du chargement du classement:', error)
    leaderboardError.value = true
  } finally {
    leaderboardLoading.value = false
  }
}

function selectTopMatch() {
  if (suggestions.value.length) selectRecord(suggestions.value[0])
}

function clearRecord() {
  activeRecord.value = null
  leaderboard.value = []
}

onMounted(async () => {
  try {
    catalog.value = await fetchCatalog()
  } catch (error) {
    console.error('Erreur lors du chargement du catalogue de records:', error)
  } finally {
    catalogLoading.value = false
  }
})
</script>
