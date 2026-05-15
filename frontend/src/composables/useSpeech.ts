import { ref } from 'vue';

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export function useSpeech() {
    const isListening = ref(false);
    let recognition: any = null;

    const startListening = (onResult: (text: string) => void) => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert('Браузер не поддерживает запись голоса');
            return;
        }

        if (isListening.value) return;

        recognition = new SpeechRecognition();
        recognition.lang = 'ru-RU';
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => {
            isListening.value = true;
        };

        recognition.onresult = (event: any) => {
            const current = event.resultIndex;
            const text = event.results[current][0].transcript;
            if (text) {
                onResult(text);
            }
        };

        recognition.onerror = (event: any) => {
            if (event.error === 'no-speech') {
                // Если пользователь просто промолчал
                isListening.value = false;
                return;
            }
            console.error('Ошибка распознавания речи:', event.error);
            if (event.error === 'not-allowed') {
                alert('Нет доступа к микрофону. Проверьте разрешения браузера.');
            } else if (event.error === 'network') {
                alert('Сетевая ошибка Web Speech API. В некоторых браузерах (Brave, Chromium) или при использовании VPN/Proxy встроенный API распознавания голоса не может связаться с серверами.');
            }
            isListening.value = false;
        };

        recognition.onend = () => {
            isListening.value = false;
        };

        try {
            recognition.start();
        } catch (e) {
            console.error('Ошибка при запуске:', e);
            isListening.value = false;
        }
    };

    const stopListening = () => {
        if (recognition && isListening.value) {
            recognition.stop();
            isListening.value = false;
        }
    };

    return { isListening, startListening, stopListening };
}