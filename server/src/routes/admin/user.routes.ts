import { Router } from 'express';
import userController from '../../controllers/admin/user.controller';
import { validate } from '../../middleware/validate.middleware';
import {
  changeUserRoleSchema,
  userIdParamSchema,
  paginationSchema,
} from '../../validators/admin.validator';

const router = Router();

router.get('/', validate(paginationSchema), userController.getUsers);
router.get('/:id', validate(userIdParamSchema), userController.getUserById);
router.patch('/:id/profile', validate(userIdParamSchema), userController.updateUserProfile);
router.patch('/:id/role', validate(changeUserRoleSchema), userController.changeRole);
router.patch('/:id/suspend', validate(userIdParamSchema), userController.suspendUser);
router.patch('/:id/activate', validate(userIdParamSchema), userController.activateUser);
router.delete('/:id', validate(userIdParamSchema), userController.softDeleteUser);
router.patch('/:id/restore', validate(userIdParamSchema), userController.restoreUser);

export default router;
