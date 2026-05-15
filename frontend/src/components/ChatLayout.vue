<script setup lang="ts">
import ChatMessages from './ChatMessages.vue'
import ChatInput from './ChatInput.vue'
import IconChat from './icons/IconChat.vue'
import { useChat } from '../composables/useChat'

const { messages, isLoading, sendMessage } = useChat()
</script>

<template>
  <div class="flex flex-col h-screen font-sans max-w-[800px] mx-auto px-10">

    <div class="flex flex-col pt-10 flex-shrink-0 gap-4">
      <div class="w-11 h-11 rounded-xl bg-[#1c4c9b] flex items-center justify-center shadow-lg">
        <IconChat class="w-5 h-5 text-white" />
      </div>

      <p class="text-white font-medium text-2xl">Hi there!</p>
      <h1 class="text-white font-bold text-4xl leading-tight">
        What would you like to know?
      </h1>
      <p class="text-white/70 text-xl leading-relaxed">
        Use one of the most common prompts below<br>
        or ask your own question
      </p>
    </div>


    <ChatMessages
      v-if="messages.length > 0"
      :messages="messages"
      :is-loading="isLoading"
    />
    <div v-else class="flex-1" />

    <div class="pb-8 pt-4">
      <ChatInput :is-loading="isLoading" @send="sendMessage" />
    </div>

  </div>
</template>

