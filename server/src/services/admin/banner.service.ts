import Banner from '../../models/Banner.model';
import { ApiError } from '../../utils/ApiError';

class BannerService {
  public async getBanners() {
    return await Banner.find().sort({ position: 1, createdAt: -1 });
  }

  public async getBannerById(id: string) {
    const banner = await Banner.findById(id);
    if (!banner) {
      throw new ApiError(404, 'Banner not found');
    }
    return banner;
  }

  public async createBanner(data: any) {
    const banner = new Banner(data);
    await banner.save();
    return banner;
  }

  public async updateBanner(id: string, data: any) {
    const banner = await Banner.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!banner) {
      throw new ApiError(404, 'Banner not found');
    }
    return banner;
  }

  public async deleteBanner(id: string) {
    const banner = await Banner.findByIdAndDelete(id);
    if (!banner) {
      throw new ApiError(404, 'Banner not found');
    }
    return banner;
  }
}

export default new BannerService();
