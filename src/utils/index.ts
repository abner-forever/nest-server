import crypto from 'crypto';

// 生成随机盐值
export const generateSalt = () => {
  return crypto.randomBytes(16).toString('hex');
};

// 对密码进行哈希加密
export const hashPassword = (password: string, salt: string) => {
  return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
};

// 验证密码
export const verifyPassword = (password, hashedPassword, salt) => {
  const hashedInputPassword = hashPassword(password, salt);
  return hashedInputPassword === hashedPassword;
};
