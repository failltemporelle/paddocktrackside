<template>
  <div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold mb-6">Discussions F1</h1>

    <div v-if="!currentUser" class="text-center py-12">
      <h2 class="text-2xl font-bold mb-4">Connectez-vous pour participer aux discussions</h2>
      <NuxtLink to="/login" class="btn btn-primary">Se connecter</NuxtLink>
    </div>

    <div v-else class="grid lg:grid-cols-[1fr,2fr] gap-6">
      <!-- Rooms Grid (hidden on mobile when chat is active) -->
      <div :class="{ 'hidden lg:block': activeRoom }">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
          <RoomCard 
            v-for="room in rooms" 
            :key="room.id"
            :room="room"
            @select="selectRoom(room)"
          />
        </div>
      </div>

      <!-- Chat Window (shown when room is selected) -->
      <div v-if="activeRoom" :class="{ 'col-span-2 lg:col-span-1': true }">
        <ChatWindow
          :room="activeRoom"
          :messages="messages"
          @send="sendMessage"
          @back="activeRoom = null"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ChatRoom, Message } from '~/types/chat'
import { useAuth } from '~/composables/useAuth'

const { user: currentUser } = useAuth()
const activeRoom = ref<ChatRoom | null>(null)
const messages = ref<Message[]>([])
const rooms = ref<ChatRoom[]>([
  {
    id: 'qualifying',
    name: 'Qualifications',
    type: 'qualifying',
    icon: '/images/qualifying.png'
  },
  {
    id: 'race',
    name: 'Course',
    type: 'race',
    icon: '/images/race.png'
  }
])

// Add driver and constructor rooms
onMounted(async () => {
  const [drivers, constructors] = await Promise.all([
    useJolpicaApi().fetchDriverStandings(),
    useJolpicaApi().fetchConstructorStandings()
  ])

  // Add driver rooms
  drivers.forEach(driver => {
    rooms.value.push({
      id: `driver-${driver.Driver.driverId}`,
      name: `${driver.Driver.givenName} ${driver.Driver.familyName}`,
      type: 'driver',
      icon: useDriverImages().getDriverImage(driver.Driver.driverId)
    })
  })

  // Add constructor rooms
  constructors.forEach(constructor => {
    rooms.value.push({
      id: `constructor-${constructor.Constructor.constructorId}`,
      name: constructor.Constructor.name,
      type: 'constructor',
      icon: useConstructorImages().getConstructorImage(constructor.Constructor.constructorId)
    })
  })
})

const selectRoom = (room: ChatRoom) => {
  activeRoom.value = room
  // TODO: Load messages for the selected room
}

const sendMessage = async (content: string) => {
  if (!currentUser.value || !activeRoom.value) return

  const message: Message = {
    id: Date.now().toString(),
    roomId: activeRoom.value.id,
    userId: currentUser.value.uid,
    userName: currentUser.value.displayName || 'Anonymous',
    content,
    timestamp: new Date().toISOString()
  }

  // TODO: Save message to database
  messages.value.push(message)
}
</script>