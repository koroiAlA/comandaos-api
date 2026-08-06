import { Router } from 'express';
import { createOrder, getOrders, updateOrderStatus } from '../controllers/order.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/role.middleware';

const router = Router();

router.post('/', authenticate, authorize('waiter', 'admin'), createOrder);
router.get('/', authenticate, getOrders);
router.patch('/:id/status', authenticate, authorize('chef', 'admin'), updateOrderStatus);

export default router;