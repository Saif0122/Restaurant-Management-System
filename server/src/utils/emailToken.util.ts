import crypto from 'crypto';

export const generateEmailToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

export const hashEmailToken = (token: string): string => {
  return crypto.createHash('sha256').update(token).digest('hex');
};
