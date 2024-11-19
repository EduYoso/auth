import { Router } from "express";
import { login, refreshTokens } from "./auth";
import { registerUser } from "./users";
import { verifyAccessToken } from "./jwt";

export const authRouter = Router();

authRouter.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const tokens = await login(username, password);

  if (!tokens) {
    res.sendStatus(401);
  }

  res.json(tokens);
});

authRouter.post("/refresh", (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    res.status(400).json({ message: "Refresh token is required" });
    return;
  }

  const tokens = refreshTokens(refreshToken);

  if (!tokens) {
    res.status(401).json({ message: "Invalid refresh token" });
    return;
  }

  res.json({
    accessToken: tokens.newAccessToken,
    refreshToken: tokens.newRefreshToken,
  });
});

export const registerRouter = Router();

registerRouter.post("/", (req, res) => {
  const { username, password } = req.body;
  const registeredUser = registerUser({ username, password });
  res.json({ registeredUser });
});

export const userRequestRouter = Router();

userRequestRouter.post("/", async (req, res) => {
  const { accessToken } = req.body;

  const verifiedToken = verifyAccessToken(accessToken);

  if (!verifiedToken || typeof verifiedToken === "string") {
    res.status(401).json({
      message:
        "Invalid access token, please request a new one using you refresh token",
      obs: "Obviamente, na prática esse processo é feito automaticamente",
    });
    return;
  }

  res.json({ message: "User request successful" });
});
