import express from "express";
import { authRouter, registerRouter, userRequestRouter } from "./routers";

export const app = express();
app.use(express.json());
app.use("/auth", authRouter);
app.use("/register", registerRouter);
app.use("/user-request", userRequestRouter);
const HTTP_PORT = 3000;

app.listen(HTTP_PORT, () => {
  console.log(`Servidor rodando em http://localhost:${HTTP_PORT}`);
});
