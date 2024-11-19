import jwt from "jsonwebtoken";
import {
  JWT_ACCESS_EXPIRATION,
  JWT_ACCESS_SECRET,
  JWT_REFRESH_EXPIRATION,
  JWT_REFRESH_SECRET,
} from "./env-fake";

const accessTokenSecret = JWT_ACCESS_SECRET;
const refreshTokenSecret = JWT_REFRESH_SECRET;

export const generateAccessToken = (userId: string): string => {
  return jwt.sign({ userId }, accessTokenSecret, {
    expiresIn: JWT_ACCESS_EXPIRATION,
  });
};

export const generateRefreshToken = (userId: string): string => {
  return jwt.sign({ userId }, refreshTokenSecret, {
    expiresIn: JWT_REFRESH_EXPIRATION,
  });
};

export const verifyAccessToken = (token: string) => {
  try {
    return jwt.verify(token, accessTokenSecret);
  } catch (error) {
    return;
  }
};

export const verifyRefreshToken = (token: string) => {
  try {
    if (isTokenBlacklisted(token)) return;
    return jwt.verify(token, refreshTokenSecret);
  } catch (error) {
    return;
  }
};

// Tem muitos jeitos de garantir que um refresh token não seja utilizado várias vezes, esse é só um exemplo
const TOKENS_BLACKLIST: string[] = [];

export const invalidateToken = (token: string) => {
  TOKENS_BLACKLIST.push(token);
};

export const isTokenBlacklisted = (token: string) => {
  return TOKENS_BLACKLIST.includes(token);
};
