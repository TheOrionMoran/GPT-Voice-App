<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { useSpeech } from '../composables/useSpeech'
import IconMic from './icons/IconMic.vue'
import IconSend from './icons/IconSend.vue'

const props = defineProps<{ isLoading: boolean }>()
const emit = defineEmits<{ (e: 'send', text: string): void }>()

const text = ref('')
const textareaRef = ref<HTMLTextAreaElement | null>(null)
const { isListening, startListening, stopListening } = useSpeech()

const adjustHeight = () => {
  const textarea = textareaRef.value
  if (!textarea) return
  
  textarea.style.height = 'auto'
  const maxHeight = parseInt(getComputedStyle(textarea).lineHeight) * 4 + 32
  textarea.style.height = Math.min(textarea.scrollHeight, maxHeight) + 'px'
}

watch(text, () => {
  nextTick(adjustHeight)
})

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
  <div class="max-w-4xl mx-auto relative group">
    <div
      class="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-3xl blur opacity-20 transition duration-500"
      :class="{'group-hover:opacity-40': !isLoading, 'opacity-10': isLoading}"
    >
    </div>

    <div class="relative flex items-end gap-2 bg-slate-800 p-2 rounded-3xl border border-slate-700 shadow-2xl">
      <textarea 
        ref="textareaRef"
        v-model="text"
        @keydown="handleKeydown"
        :disabled="isLoading"
        rows="1"
        class="w-full bg-transparent text-slate-100 placeholder-slate-500 outline-none resize-none py-4 px-4 leading-relaxed disabled:opacity-50 custom-scrollbar"
        placeholder="Введите сообщение..."
      ></textarea>

      <button type="button"
        @click="handleMicClick"
        :disabled="isLoading"
        class="p-4 rounded-full transition-all duration-300 flex-shrink-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        :class="isListening ? 'text-red-400 bg-red-400/20 animate-pulse' : 'text-slate-400 hover:text-emerald-400 hover:bg-emerald-400/10'"
        title="Голосовой ввод">
        <IconMic class="w-6 h-6" />
      </button>

      <button type="button"
        @click="handleSend"
        :disabled="isLoading || !text.trim()"
        class="p-4 text-white bg-blue-600 hover:bg-blue-500 rounded-full shadow-lg transition-all duration-300 flex-shrink-0 transform disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none cursor-pointer"
        :class="{'hover:-translate-y-0.5 hover:shadow-blue-500/50': !isLoading && text.trim()}"
        title="Отправить">
        <IconSend class="w-6 h-6" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #334155; /* slate-700 */
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #475569; /* slate-600 */
}

/* Firefox */
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #334155 transparent;
}
</style>
