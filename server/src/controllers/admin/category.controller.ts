import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { ApiResponse } from '../../utils/ApiResponse';
import categoryService from '../../services/admin/category.service';

class CategoryController {
  public bulkAction = asyncHandler(async (req: Request, res: Response) => {
    const { categoryIds, action } = req.body;
    const result = await categoryService.bulkAction(categoryIds, action);
    res.status(200).json(new ApiResponse(200, result, `Bulk ${action} completed successfully`));
  });

  public reorderCategories = asyncHandler(async (req: Request, res: Response) => {
    const { orderedIds } = req.body;
    await categoryService.reorderCategories(orderedIds);
    res.status(200).json(new ApiResponse(200, null, 'Categories reordered successfully'));
  });
}

export default new CategoryController();
