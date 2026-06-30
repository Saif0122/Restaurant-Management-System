import User, { UserRole } from '../../../models/User.model';
import { ApiError } from '../../../utils/ApiError';
import { FilterQuery } from 'mongoose';

class UserService {
  public async getUsers(options: {
    page: number;
    limit: number;
    search?: string;
    role?: string;
    isActive?: string;
  }) {
    const { page, limit, search, role, isActive } = options;
    const skip = (page - 1) * limit;

    const query: FilterQuery<any> = { isDeleted: false }; // Don't show soft deleted by default unless asked? Wait, actually admin might want to see all. Let's just say isDeleted: false. Or maybe admin should see soft deleted? Let's leave isDeleted: { $ne: true } as the base query.

    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    if (role) {
      query.role = role;
    }

    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    const [users, total] = await Promise.all([
      User.find(query).select('-password -__v').skip(skip).limit(limit).sort({ createdAt: -1 }),
      User.countDocuments(query),
    ]);

    return {
      users,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  public async getUserById(id: string) {
    const user = await User.findById(id).select('-password -__v');
    if (!user) {
      throw new ApiError(404, 'User not found');
    }
    return user;
  }

  public async updateUserProfile(
    id: string,
    data: { fullName?: string; phone?: string; avatar?: string },
  ) {
    const user = await User.findByIdAndUpdate(id, data, { new: true, runValidators: true }).select(
      '-password -__v',
    );
    if (!user) {
      throw new ApiError(404, 'User not found');
    }
    return user;
  }

  public async changeRole(id: string, role: UserRole) {
    const user = await User.findByIdAndUpdate(id, { role }, { new: true }).select('-password -__v');
    if (!user) {
      throw new ApiError(404, 'User not found');
    }
    return user;
  }

  public async changeStatus(id: string, isActive: boolean) {
    const user = await User.findByIdAndUpdate(id, { isActive }, { new: true }).select(
      '-password -__v',
    );
    if (!user) {
      throw new ApiError(404, 'User not found');
    }
    return user;
  }

  public async softDelete(id: string) {
    const user = await User.findByIdAndUpdate(
      id,
      { isDeleted: true, isActive: false },
      { new: true },
    ).select('-password -__v');
    if (!user) {
      throw new ApiError(404, 'User not found');
    }
    return user;
  }

  public async restore(id: string) {
    const user = await User.findByIdAndUpdate(
      id,
      { isDeleted: false, isActive: true },
      { new: true },
    ).select('-password -__v');
    if (!user) {
      throw new ApiError(404, 'User not found');
    }
    return user;
  }
}

export default new UserService();
