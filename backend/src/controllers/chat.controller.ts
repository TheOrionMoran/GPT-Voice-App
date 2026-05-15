import { Request, Response } from 'express';
import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
});

export const handleChatRequest = async (req: Request, res: Response): Promise<void> => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Сообщение обязательно и должно быть строкой' });
      return;
    }

    const completion = await client.chat.completions.create({
      model: 'openrouter/free',
      messages: [
        { role: 'system', content: 'Ты краткий и точный ИИ-ассистент.' },
        { role: 'user', content: message }
      ],
    });

    const reply = completion.choices[0]?.message?.content;
    
    if (!reply) {
      res.status(502).json({ error: 'AI вернул пустой ответ' });
      return;
    }

    res.json({ text: reply });
  } catch (error: any) {
    console.error('Chat API Error:', error);

    // Если API нейросети ругается, стараемся выдать пользователю что-то вменяемое
    const status = error.status || 500;
    const message = error.message || 'Ошибка при обращении к AI сервису';

    if (status === 401) {
      res.status(401).json({ error: 'Ошибка авторизации API. Проверьте ключ в .env' });
    } else if (status === 429) {
      res.status(429).json({ error: 'Превышен лимит запросов. Попробуйте позже' });
    } else {
      res.status(status).json({ 
        error: 'Ошибка при получении ответа от AI',
        details: message 
      });
    }
  }
};