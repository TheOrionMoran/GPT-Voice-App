import { ref } from 'vue';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export function useChat() {
  const messages = ref<ChatMessage[]>([]);
  const isLoading = ref(false);

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading.value) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content
    };
    messages.value.push(userMsg);
    isLoading.value = true;

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: content })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Ошибка сервера: ${response.status}`);
      }
      
      messages.value.push({
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.text || 'Пустой ответ'
      });
    } catch (error: any) {
      console.error('Ошибка API:', error);
      messages.value.push({
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Ошибка: ${error.message || 'Не удалось получить ответ'}`
      });
    } finally {
      isLoading.value = false;
    }
  };

  return { messages, isLoading, sendMessage };
}
