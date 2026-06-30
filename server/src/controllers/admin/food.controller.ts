import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { ApiResponse } from '../../utils/ApiResponse';
import foodService from '../../services/admin/food.service';

class FoodController {
  public bulkAction = asyncHandler(async (req: Request, res: Response) => {
    const { foodIds, action } = req.body;
    const result = await foodService.bulkAction(foodIds, action);
    res.status(200).json(new ApiResponse(200, result, `Bulk ${action} completed successfully`));
  });

  public bulkUpdate = asyncHandler(async (req: Request, res: Response) => {
    const { foodIds, ...updateData } = req.body;
    const result = await foodService.bulkUpdate(foodIds, updateData);
    res.status(200).json(new ApiResponse(200, result, 'Bulk update completed successfully'));
  });

  public adjustInventory = asyncHandler(async (req: Request, res: Response) => {
    const { quantity, operation } = req.body;
    const food = await foodService.adjustInventory(req.params.id, quantity, operation);
    res.status(200).json(new ApiResponse(200, food, 'Inventory adjusted successfully'));
  });

  public toggleFlags = asyncHandler(async (req: Request, res: Response) => {
    const food = await foodService.toggleFlags(req.params.id, req.body);
    res.status(200).json(new ApiResponse(200, food, 'Food flags updated successfully'));
  });
}

export default new FoodController();
