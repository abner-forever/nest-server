import * as crypto from 'crypto';

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

export function convertKeysToCamelCase(obj) {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  const newObj = Array.isArray(obj) ? [] : {};

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const newKey = key.replace(/_([a-z])/g, function (match, group1) {
        return group1.toUpperCase();
      });
      newObj[newKey] = convertKeysToCamelCase(obj[key]);
    }
  }

  return newObj;
}
