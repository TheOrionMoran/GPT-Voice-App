<script setup lang="ts">
import type { ChatMessage } from '../composables/useChat'
import { ref, watch, nextTick } from 'vue'
import IconChat from './icons/IconChat.vue'

const props = defineProps<{
  messages: ChatMessage[]
  isLoading: boolean
}>()

const container = ref<HTMLElement | null>(null)

// Автоскролл вниз при добавлении сообщений
watch(() => props.messages.length, async () => {
  await nextTick()
  if (container.value) {
    container.value.scrollTop = container.value.scrollHeight
  }
})
</script>

<template>
  <div ref="container" class="h-full overflow-y-auto p-6 flex flex-col gap-6 max-w-5xl mx-auto scroll-smooth">
    <!-- Пустое состояние -->
    <div v-if="messages.length === 0" class="flex-1 flex items-center justify-center text-slate-500">
      <div class="text-center space-y-6">
        <div class="w-20 h-20 rounded-3xl bg-gradient-to-br from-slate-800 to-slate-900 mx-auto flex items-center justify-center border border-slate-700/50 shadow-inner">
          <IconChat class="w-10 h-10 text-blue-400" />
        </div>
        <p class="text-lg font-medium tracking-wide">Чем могу помочь сегодня?</p>
      </div>
    </div>

    <!-- Список сообщений -->
    <template v-else>
      <div 
        v-for="msg in messages" 
        :key="msg.id"
        class="max-w-[85%] rounded-3xl p-5 shadow-sm text-[15px] leading-relaxed"
        :class="msg.role === 'user' ? 'bg-blue-600 text-white self-end rounded-br-sm' : 'bg-slate-800 border border-slate-700/50 text-slate-200 self-start rounded-bl-sm'"
      >
        {{ msg.content }}
      </div>

      <!-- Индикатор загрузки ответа ИИ -->
      <div v-if="isLoading" class="bg-slate-800 border border-slate-700/50 text-slate-400 self-start rounded-3xl rounded-bl-sm py-4 px-5 flex items-center gap-2 max-w-fit shadow-sm">
        <span class="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
        <span class="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style="animation-delay: 0.15s"></span>
        <span class="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style="animation-delay: 0.3s"></span>
      </div>
    </template>
  </div>
</template>
