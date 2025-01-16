<template>
  <div 
    class="card bg-base-100 shadow-xl hover:shadow-2xl transition-all cursor-pointer"
    @click="$emit('select')"
  >
    <div class="card-body">
      <div class="flex items-center gap-4">
        <div class="avatar">
          <div class="w-12 h-12 rounded-full">
            <img :src="room.icon || '/images/chat-placeholder.png'" :alt="room.name">
          </div>
        </div>
        <div>
          <h3 class="font-bold">{{ room.name }}</h3>
          <p class="text-sm text-gray-500">
            {{ room.lastMessage?.content || 'Aucun message' }}
          </p>
        </div>
      </div>
      <div v-if="room.unreadCount" class="badge badge-primary absolute top-2 right-2">
        {{ room.unreadCount }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ChatRoom } from '~/types/chat'

defineProps<{
  room: ChatRoom
}>()

defineEmits<{
  select: []
}>()
</script>