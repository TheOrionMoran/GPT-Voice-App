<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { useSpeech } from '../composables/useSpeech'
import IconMic from './icons/IconMic.vue'
import IconArrow from './icons/IconArrow.vue'

const props = defineProps<{ isLoading: boolean }>()
const emit = defineEmits<{ (e: 'send', text: string): void }>()

const text = ref('')
const textareaRef = ref<HTMLTextAreaElement | null>(null)
const isOverflowing = ref(false)
const { isListening, startListening, stopListening } = useSpeech()

const adjustHeight = () => {
  const textarea = textareaRef.value
  if (!textarea) return
  textarea.style.height = 'auto'
  const style = getComputedStyle(textarea)
  // Берем lineHeight, либо вычисляем его на основе fontSize (стандарт ~1.5 для relaxed)
  const lineHeight = parseInt(style.lineHeight) || parseInt(style.fontSize) * 1.6
  const paddingY = parseInt(style.paddingTop) + parseInt(style.paddingBottom)
  // Добавляем небольшой запас (2px), чтобы избежать проблем с округлением в разных браузерах
  const maxHeight = (lineHeight * 4) + paddingY + 2
  textarea.style.height = Math.min(textarea.scrollHeight, maxHeight) + 'px'
  isOverflowing.value = textarea.scrollHeight > maxHeight
}

watch(text, () => nextTick(adjustHeight))

const handleSend = () => {
  if (!text.value.trim() || props.isLoading) return
  emit('send', text.value)
  text.value = ''
  nextTick(adjustHeight)
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    handleSend()
  }
}

const handleMicClick = () => {
  if (isListening.value) {
    stopListening()
    return
  }
  startListening((speechText) => {
    text.value += (text.value ? ' ' : '') + speechText
  })
}
</script>

<template>
  <div class="relative flex items-center rounded-2xl border-2 border-[#164084]">
    <!-- Кнопка микрофона -->
    <button type="button" @click="handleMicClick" :disabled="isLoading"
      class="flex-shrink-0 ml-5 transition-all hover:cursor-pointer duration-200 disabled:opacity-40" :class="isListening
        ? 'text-red-400 animate-pulse'
        : 'text-[#2556a8] hover:text-white'" title="Голосовой ввод">
      <IconMic class="w-6 h-6" />
    </button>

    <!-- Поле ввода -->
    <textarea ref="textareaRef" v-model="text" @keydown="handleKeydown" :disabled="isLoading" rows="1"
      class="flex-1 text-white placeholder-white/40 outline-none resize-none px-4 leading-relaxed disabled:opacity-50 custom-scrollbar text-[15px]"
      :class="{ 'overflow-y-auto': isOverflowing, 'overflow-y-hidden': !isOverflowing }"
      placeholder="Ask whatever you want"></textarea>

    <!-- Кнопка отправки -->
    <button type="button" @click="handleSend" :disabled="isLoading || !text.trim()"
      class="flex-shrink-0 w-12 h-12 rounded-xl bg-[#1d4c9a] hover:cursor-pointer group hover:bg-white flex items-center justify-center transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-blue-500"
      title="Отправить">
      <IconArrow class="w-6 h-6 text-white group-hover:text-[#1d4c9a]" />
    </button>
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
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
}

.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
}
</style>
