import User, { IUser } from '../models/User.model';
import Address, { IAddress } from '../models/Address.model';
import { ApiError } from '../utils/ApiError';

export class ProfileService {
  /**
   * Get user profile
   */
  static async getProfile(userId: string): Promise<IUser> {
    const user = await User.findById(userId).select('-password');
    if (!user) {
      throw new ApiError(404, 'User not found');
    }
    return user;
  }

  /**
   * Update user profile
   */
  static async updateProfile(
    userId: string,
    data: { firstName?: string; lastName?: string; fullName?: string; phone?: string },
  ): Promise<IUser> {
    const updateData: any = {};
    if (data.phone !== undefined) {
      updateData.phone = data.phone;
    }

    if (data.fullName !== undefined) {
      updateData.fullName = data.fullName;
    } else if (data.firstName !== undefined || data.lastName !== undefined) {
      const currentUser = await User.findById(userId);
      if (!currentUser) {
        throw new ApiError(404, 'User not found');
      }
      const parts = currentUser.fullName.split(' ');
      const currentFirstName = parts[0] || '';
      const currentLastName = parts.slice(1).join(' ') || '';
      const newFirstName = data.firstName !== undefined ? data.firstName : currentFirstName;
      const newLastName = data.lastName !== undefined ? data.lastName : currentLastName;
      updateData.fullName = `${newFirstName} ${newLastName}`.trim();
    }

    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    }).select('-password');
    if (!user) {
      throw new ApiError(404, 'User not found');
    }
    return user;
  }

  /**
   * Update avatar (mock implementation since no real file upload is configured in this module right now, but would be handled via Cloudinary util)
   */
  static async updateAvatar(userId: string, avatarUrl: string): Promise<IUser> {
    const user = await User.findByIdAndUpdate(userId, { avatar: avatarUrl }, { new: true }).select(
      '-password',
    );
    if (!user) {
      throw new ApiError(404, 'User not found');
    }
    return user;
  }

  /**
   * Soft delete user account
   */
  static async deleteAccount(userId: string): Promise<void> {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    user.isActive = false;
    await user.save();
  }

  /**
   * Get user addresses
   */
  static async getAddresses(userId: string): Promise<IAddress[]> {
    return Address.find({ customer: userId }).sort({ isDefault: -1, createdAt: -1 });
  }

  /**
   * Add a new address
   */
  static async addAddress(
    userId: string,
    data: {
      label?: string;
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
      isDefault?: boolean;
    },
  ): Promise<IAddress> {
    // If setting to default, unset other defaults
    if (data.isDefault) {
      await Address.updateMany({ customer: userId }, { isDefault: false });
    }

    // Check if this is the first address, make it default automatically
    const addressCount = await Address.countDocuments({ customer: userId });
    if (addressCount === 0) {
      data.isDefault = true;
    }

    return Address.create({ ...data, label: data.label as any, customer: userId });
  }

  /**
   * Update an address
   */
  static async updateAddress(
    userId: string,
    addressId: string,
    data: Partial<IAddress>,
  ): Promise<IAddress> {
    if (data.isDefault) {
      await Address.updateMany({ customer: userId }, { isDefault: false });
    }

    const address = await Address.findOneAndUpdate({ _id: addressId, customer: userId }, data, {
      new: true,
      runValidators: true,
    });

    if (!address) {
      throw new ApiError(404, 'Address not found');
    }
    return address;
  }

  /**
   * Delete an address
   */
  static async deleteAddress(userId: string, addressId: string): Promise<void> {
    const address = await Address.findOneAndDelete({ _id: addressId, customer: userId });
    if (!address) {
      throw new ApiError(404, 'Address not found');
    }
  }
}
