import bcrypt from "bcryptjs";
import {
  generateAccessToken,
  generateRefreshToken,
  invalidateToken,
  verifyRefreshToken,
} from "./jwt";
import { Users } from "./users";

export const authenticateUser = async (username: string, password: string) => {
  const hashedPassword = Users.get(username);
  if (!hashedPassword) return;
  const isPasswordValid = await bcrypt.compare(password, hashedPassword);
  if (!isPasswordValid) return;

  return username;
};

export const login = async (username: string, password: string) => {
  const userId = await authenticateUser(username, password);
  if (!userId) return;

  const accessToken = generateAccessToken(userId);
  const refreshToken = generateRefreshToken(userId);

  return { accessToken, refreshToken };
};

export const refreshTokens = (refreshToken: string) => {
  const verifiedToken = verifyRefreshToken(refreshToken);
  if (!verifiedToken || typeof verifiedToken === "string") return;

  invalidateToken(refreshToken);

  const newAccessToken = generateAccessToken(verifiedToken.userId);
  const newRefreshToken = generateRefreshToken(verifiedToken.userId);

  return { newAccessToken, newRefreshToken };
};
