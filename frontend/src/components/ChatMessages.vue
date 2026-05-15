<script setup lang="ts">
import type { ChatMessage } from '../composables/useChat'
import { ref, watch, nextTick } from 'vue'

const props = defineProps<{
  messages: ChatMessage[]
  isLoading: boolean
}>()

const container = ref<HTMLElement | null>(null)

watch(() => props.messages.length, async () => {
  await nextTick()
  if (container.value) {
    container.value.scrollTop = container.value.scrollHeight
  }
})
</script>

<template>
  <div ref="container" class="flex-1 overflow-y-auto py-6 flex flex-col gap-4 custom-scrollbar">
    <div
      v-for="msg in messages"
      :key="msg.id"
      class="max-w-[75%] rounded-2xl px-5 py-3.5 text-[15px] leading-relaxed"
      :class="msg.role === 'user'
        ? 'bg-[#164084] text-white self-end rounded-br-sm'
        : 'bg-white/10 text-white/90 self-start rounded-bl-sm border border-white/10'"
    >
      {{ msg.content }}
    </div>

    <!-- Индикатор загрузки -->
    <div
      v-if="isLoading"
      class="self-start bg-white/10 border border-white/10 text-white/60 rounded-2xl rounded-bl-sm py-3.5 px-5 flex items-center gap-1.5"
    >
      <span class="w-2 h-2 bg-white/60 rounded-full animate-bounce"></span>
      <span class="w-2 h-2 bg-white/60 rounded-full animate-bounce" style="animation-delay: 0.15s"></span>
      <span class="w-2 h-2 bg-white/60 rounded-full animate-bounce" style="animation-delay: 0.3s"></span>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 10px;
}
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.15) transparent;
}
</style>
