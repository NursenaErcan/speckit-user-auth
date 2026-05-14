import express from "express";
import { errorHandler } from "./middlewares/error-handler";
import { authRoutes } from "./routes/auth-routes";
import { passwordResetRoutes } from "./routes/password-reset-routes";
import { sessionRoutes } from "./routes/session-routes";

/** Constructs and configures the API application. */
export function createApp() {
  const app = express();
  app.use(express.json());

  app.use("/auth", authRoutes);
  app.use("/auth", passwordResetRoutes);
  app.use("/auth", sessionRoutes);

  app.use(errorHandler);
  return app;
}
