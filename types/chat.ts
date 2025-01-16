export interface Message {
  id: string
  roomId: string
  userId: string
  userName: string
  content: string
  timestamp: string
}

export interface ChatRoom {
  id: string
  name: string
  type: 'driver' | 'constructor' | 'race' | 'qualifying'
  icon?: string
  lastMessage?: Message
  unreadCount?: number
}