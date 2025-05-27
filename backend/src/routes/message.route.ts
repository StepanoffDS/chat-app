import messageController from '@controllers/message.controller';
import { protectRoute } from '@middleware/auth.middleware';
import express from 'express';

const router = express.Router();

router.get('/user', protectRoute, messageController.getUsersForSidebar);
router.get('/:id', protectRoute, messageController.getMessages);

router.post('/send/:id', protectRoute, messageController.sendMessage);

export default router;
