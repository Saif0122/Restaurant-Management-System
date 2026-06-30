import User, { IUser } from '../models/User.model';
import { ApiError } from '../utils/ApiError';
import { hashPassword, comparePassword } from '../utils/password.util';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt.util';
import { generateEmailToken, hashEmailToken } from '../utils/emailToken.util';
import emailService from './email.service';
import { verifyEmailTemplate, resetPasswordTemplate } from '../utils/emailTemplates';
import config from '../config';

export class AuthService {
  static async register(
    data: any,
  ): Promise<{ user: IUser; accessToken: string; refreshToken: string }> {
    const { fullName, email, password, phone } = data;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ApiError(400, 'Email already in use');
    }

    const hashedPassword = await hashPassword(password);
    const verificationToken = generateEmailToken();
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      phone,
      verificationToken: hashEmailToken(verificationToken),
      verificationTokenExpires,
    });

    const accessToken = generateAccessToken({ id: user.id, role: user.role });
    const refreshToken = generateRefreshToken({ id: user.id, role: user.role });

    user.refreshToken = refreshToken;
    await user.save();

    // Send verification email
    const verifyUrl = `${config.corsOrigin}/verify-email?token=${verificationToken}`;
    await emailService.sendEmail(
      user.email,
      'Verify your email address',
      verifyEmailTemplate(verifyUrl),
    );

    const userResponse = await User.findById(user.id);
    if (!userResponse) {
      throw new ApiError(500, 'Error retrieving user after registration');
    }

    return { user: userResponse, accessToken, refreshToken };
  }

  static async login(
    data: any,
  ): Promise<{ user: IUser; accessToken: string; refreshToken: string }> {
    const { email, password } = data;

    const user = await User.findOne({ email }).select('+password');
    if (!user || !user.password) {
      throw new ApiError(401, 'Invalid email or password');
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      throw new ApiError(401, 'Invalid email or password');
    }

    const accessToken = generateAccessToken({ id: user.id, role: user.role });
    const refreshToken = generateRefreshToken({ id: user.id, role: user.role });

    user.refreshToken = refreshToken;
    await user.save();

    const userResponse = await User.findById(user.id);
    if (!userResponse) {
      throw new ApiError(500, 'Error retrieving user');
    }

    return { user: userResponse, accessToken, refreshToken };
  }

  static async logout(userId: string): Promise<void> {
    await User.findByIdAndUpdate(userId, { $unset: { refreshToken: 1 } });
  }

  static async refresh(
    token: string,
  ): Promise<{ user: IUser; accessToken: string; refreshToken: string }> {
    const user = await User.findOne({ refreshToken: token });
    if (!user) {
      throw new ApiError(401, 'Invalid refresh token');
    }

    const accessToken = generateAccessToken({ id: user.id, role: user.role });
    const refreshToken = generateRefreshToken({ id: user.id, role: user.role });

    user.refreshToken = refreshToken;
    await user.save();

    return { user, accessToken, refreshToken };
  }

  static async forgotPassword(email: string): Promise<void> {
    const user = await User.findOne({ email });
    if (!user) {
      // Do not reveal that the user does not exist
      return;
    }

    const resetToken = generateEmailToken();
    user.resetPasswordToken = hashEmailToken(resetToken);
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save();

    const resetUrl = `${config.corsOrigin}/reset-password?token=${resetToken}`;
    await emailService.sendEmail(
      user.email,
      'Password Reset Request',
      resetPasswordTemplate(resetUrl),
    );
  }

  static async resetPassword(data: any): Promise<void> {
    const { token, password } = data;
    const hashedToken = hashEmailToken(token);

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      throw new ApiError(400, 'Invalid or expired token');
    }

    user.password = await hashPassword(password);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    user.passwordChangedAt = new Date();
    await user.save();
  }

  static async verifyEmail(token: string): Promise<void> {
    const hashedToken = hashEmailToken(token);

    const user = await User.findOne({
      verificationToken: hashedToken,
      verificationTokenExpires: { $gt: new Date() },
    });

    if (!user) {
      throw new ApiError(400, 'Invalid or expired token');
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();
  }

  static async changePassword(userId: string, data: any): Promise<void> {
    const { currentPassword, newPassword } = data;

    const user = await User.findById(userId).select('+password');
    if (!user || !user.password) {
      throw new ApiError(404, 'User not found');
    }

    const isMatch = await comparePassword(currentPassword, user.password);
    if (!isMatch) {
      throw new ApiError(400, 'Incorrect current password');
    }

    user.password = await hashPassword(newPassword);
    user.passwordChangedAt = new Date();
    await user.save();
  }

  static async getMe(userId: string): Promise<IUser> {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }
    return user;
  }
}
