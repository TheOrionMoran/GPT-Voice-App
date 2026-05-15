import { Router } from 'express';
import { handleChatRequest } from '../controllers/chat.controller';

const router = Router();

router.post('/chat', handleChatRequest);

export default router;