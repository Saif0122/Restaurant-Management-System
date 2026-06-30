import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import {
  cartItemSchema,
  updateCartItemSchema,
  removeCartItemSchema,
} from '../validators/cart.validator';
import {
  getCart,
  addItemToCart,
  updateItemQuantity,
  removeItemFromCart,
  clearCart,
} from '../controllers/cart.controller';

const router = Router();

// All cart routes require authentication
router.use(authenticate);

router.route('/').get(getCart).delete(clearCart);

router.route('/items').post(validate(cartItemSchema), addItemToCart);

router
  .route('/items/:foodId')
  .put(validate(updateCartItemSchema), updateItemQuantity)
  .delete(validate(removeCartItemSchema), removeItemFromCart);

export default router;
