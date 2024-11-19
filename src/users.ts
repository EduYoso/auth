import bcrypt from "bcryptjs";

export const Users = new Map();

export type User = { username: string; password: string };

export const registerUser = (user: User) => {
  const { username, password } = user;
  const hashedPassword = bcrypt.hashSync(password, 10);
  Users.set(username, hashedPassword);
  return { username, hashedPassword };
};
