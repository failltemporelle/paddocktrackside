<template>
  <div class="flex flex-col h-[600px] bg-base-100 rounded-lg shadow-xl">
    <!-- Header -->
    <div class="p-4 border-b">
      <div class="flex items-center gap-4">
        <button class="btn btn-ghost btn-circle lg:hidden" @click="$emit('back')">
          <ArrowLeftIcon class="w-5 h-5" />
        </button>
        <div class="avatar">
          <div class="w-10 h-10 rounded-full">
            <img :src="room?.icon || '/images/chat-placeholder.png'" :alt="room?.name">
          </div>
        </div>
        <h3 class="font-bold">{{ room?.name }}</h3>
      </div>
    </div>

    <!-- Messages -->
    <div class="flex-1 overflow-y-auto p-4 space-y-4" ref="messagesContainer">
      <div v-for="message in messages" :key="message.id" 
        :class="[
          'flex',
          message.userId === currentUser?.uid ? 'justify-end' : 'justify-start'
        ]"
      >
        <div :class="[
          'max-w-[80%] rounded-lg p-3',
          message.userId === currentUser?.uid ? 'bg-primary text-white' : 'bg-base-200'
        ]">
          <div class="text-sm font-medium mb-1">{{ message.userName }}</div>
          <div>{{ message.content }}</div>
          <div class="text-xs opacity-70 mt-1">
            {{ new Date(message.timestamp).toLocaleTimeString() }}
          </div>
        </div>
      </div>
    </div>

    <!-- Input -->
    <form @submit.prevent="sendMessage" class="p-4 border-t">
      <div class="flex gap-2">
        <input 
          v-model="newMessage"
          type="text"
          class="input input-bordered flex-1"
          placeholder="Votre message..."
          :disabled="!currentUser"
        />
        <button 
          type="submit" 
          class="btn btn-primary"
          :disabled="!newMessage.trim() || !currentUser"
        >
          <PaperAirplaneIcon class="w-5 h-5" />
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ArrowLeftIcon, PaperAirplaneIcon } from '@heroicons/vue/24/outline'
import type { ChatRoom, Message } from '~/types/chat'

const props = defineProps<{
  room: ChatRoom | null
  messages: Message[]
}>()

const emit = defineEmits<{
  'send': [message: string]
  'back': []
}>()

const { user: currentUser } = useAuth()
const newMessage = ref('')
const messagesContainer = ref<HTMLElement | null>(null)

const sendMessage = () => {
  if (newMessage.value.trim() && currentUser?.value) {
    emit('send', newMessage.value)
    newMessage.value = ''
  }
}

// Scroll to bottom when new messages arrive
watch(() => props.messages, () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}, { deep: true })
</script>