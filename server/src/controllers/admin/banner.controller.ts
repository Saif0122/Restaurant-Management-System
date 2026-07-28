import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { ApiResponse } from '../../utils/ApiResponse';
import bannerService from '../../services/admin/banner.service';

class BannerController {
  public getBanners = asyncHandler(async (_req: Request, res: Response) => {
    const banners = await bannerService.getBanners();
    res.status(200).json(new ApiResponse(200, banners, 'Banners retrieved successfully'));
  });

  public getBannerById = asyncHandler(async (req: Request, res: Response) => {
    const banner = await bannerService.getBannerById(req.params.id);
    res.status(200).json(new ApiResponse(200, banner, 'Banner retrieved successfully'));
  });

  public createBanner = asyncHandler(async (req: Request, res: Response) => {
    const banner = await bannerService.createBanner(req.body);
    res.status(201).json(new ApiResponse(201, banner, 'Banner created successfully'));
  });

  public updateBanner = asyncHandler(async (req: Request, res: Response) => {
    const banner = await bannerService.updateBanner(req.params.id, req.body);
    res.status(200).json(new ApiResponse(200, banner, 'Banner updated successfully'));
  });

  public deleteBanner = asyncHandler(async (req: Request, res: Response) => {
    await bannerService.deleteBanner(req.params.id);
    res.status(200).json(new ApiResponse(200, null, 'Banner deleted successfully'));
  });
}

export default new BannerController();
