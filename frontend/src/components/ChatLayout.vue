<script setup lang="ts">
import ChatMessages from './ChatMessages.vue'
import ChatInput from './ChatInput.vue'
import IconBolt from './icons/IconBolt.vue'
import { useChat } from '../composables/useChat'

const { messages, isLoading, sendMessage } = useChat()

const handleSend = (text: string) => {
  sendMessage(text)
}
</script>

<template>
  <div class="flex flex-col h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-500/30">
    <!-- Шапка -->
    <header class="px-8 py-5 border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-xl z-10 flex items-center justify-between shadow-sm">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
          <IconBolt class="w-4 h-4 text-white" />
        </div>
        <h1 class="text-xl font-bold bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text text-transparent">
          AI Assistant
        </h1>
      </div>
    </header>
    
    <!-- Область сообщений -->
    <main class="flex-1 overflow-hidden relative bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 to-slate-950">
      <ChatMessages :messages="messages" :is-loading="isLoading" />
    </main>

    <!-- Область ввода -->
    <footer class="p-6 bg-transparent pb-8">
      <ChatInput :is-loading="isLoading" @send="handleSend" />
    </footer>
  </div>
</template>
