import express from 'express';
import { postChat, getConversation, listSessions } from '../controllers/chatController.js';

const router = express.Router();

router.post('/chat', postChat);
router.get('/conversations/:sessionId', getConversation);
router.get('/sessions', listSessions);

export default router;