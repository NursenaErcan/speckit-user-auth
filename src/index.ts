import { createApp } from "./api/app";
import { env, validateEnv } from "./config/env";
import { logger } from "./shared/logging/logger";

validateEnv();

const app = createApp();
app.listen(env.port, () => {
  logger.info({ port: env.port }, "Auth service listening");
});
