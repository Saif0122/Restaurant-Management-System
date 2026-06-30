export const verifyEmailTemplate = (url: string): string => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Verify Your Email Address</h2>
      <p>Thank you for registering. Please confirm your email address by clicking the link below:</p>
      <a href="${url}" style="display: inline-block; padding: 10px 20px; color: #fff; background-color: #007bff; text-decoration: none; border-radius: 5px;">Verify Email</a>
      <p>If you did not request this, please ignore this email.</p>
      <p>This link is valid for 24 hours.</p>
    </div>
  `;
};

export const resetPasswordTemplate = (url: string): string => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Reset Your Password</h2>
      <p>You requested a password reset. Click the link below to set a new password:</p>
      <a href="${url}" style="display: inline-block; padding: 10px 20px; color: #fff; background-color: #28a745; text-decoration: none; border-radius: 5px;">Reset Password</a>
      <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
      <p>This link is valid for 1 hour.</p>
    </div>
  `;
};
