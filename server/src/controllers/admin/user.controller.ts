import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { ApiResponse } from '../../utils/ApiResponse';
import userService from '../../services/admin/user.service';

class UserController {
  public getUsers = asyncHandler(async (req: Request, res: Response) => {
    const { page = '1', limit = '10', search, role, isActive } = req.query;

    const result = await userService.getUsers({
      page: Number(page),
      limit: Number(limit),
      search: search as string,
      role: role as string,
      isActive: isActive as string,
    });

    res.status(200).json(new ApiResponse(200, 'Users retrieved successfully', result));
  });

  public getUserById = asyncHandler(async (req: Request, res: Response) => {
    const user = await userService.getUserById(req.params.id);
    res.status(200).json(new ApiResponse(200, 'User retrieved successfully', user));
  });

  public updateUserProfile = asyncHandler(async (req: Request, res: Response) => {
    const user = await userService.updateUserProfile(req.params.id, req.body);
    res.status(200).json(new ApiResponse(200, 'User updated successfully', user));
  });

  public changeRole = asyncHandler(async (req: Request, res: Response) => {
    const user = await userService.changeRole(req.params.id, req.body.role);
    res.status(200).json(new ApiResponse(200, 'User role updated successfully', user));
  });

  public suspendUser = asyncHandler(async (req: Request, res: Response) => {
    const user = await userService.changeStatus(req.params.id, false);
    res.status(200).json(new ApiResponse(200, 'User suspended successfully', user));
  });

  public activateUser = asyncHandler(async (req: Request, res: Response) => {
    const user = await userService.changeStatus(req.params.id, true);
    res.status(200).json(new ApiResponse(200, 'User activated successfully', user));
  });

  public softDeleteUser = asyncHandler(async (req: Request, res: Response) => {
    const user = await userService.softDelete(req.params.id);
    res.status(200).json(new ApiResponse(200, 'User soft deleted successfully', user));
  });

  public restoreUser = asyncHandler(async (req: Request, res: Response) => {
    const user = await userService.restore(req.params.id);
    res.status(200).json(new ApiResponse(200, 'User restored successfully', user));
  });
}

export default new UserController();
