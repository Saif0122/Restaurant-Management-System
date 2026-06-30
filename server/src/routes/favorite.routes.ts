import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { favoriteSchema } from '../validators/favorite.validator';
import { getFavorites, addFavorite, removeFavorite } from '../controllers/favorite.controller';

const router = Router();

// All favorite routes require authentication
router.use(authenticate);

router.route('/').get(getFavorites);

router
  .route('/:foodId')
  .post(validate(favoriteSchema), addFavorite)
  .delete(validate(favoriteSchema), removeFavorite);

export default router;
