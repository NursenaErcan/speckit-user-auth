import dotenv from "dotenv";

dotenv.config();

/** Runtime configuration loaded from environment variables. */
export const env = {
  databaseUrl: process.env.DATABASE_URL ?? "",
  jwtSecret: process.env.JWT_SECRET ?? "",
  jwtIssuer: process.env.JWT_ISSUER ?? "speckit-lab",
  jwtAudience: process.env.JWT_AUDIENCE ?? "speckit-clients",
  bcryptCost: Number(process.env.BCRYPT_COST ?? "12"),
  emailProviderApiKey: process.env.EMAIL_PROVIDER_API_KEY ?? "",
  rateLimitWindowSeconds: Number(process.env.RATE_LIMIT_WINDOW_SECONDS ?? "900"),
  rateLimitMaxAttempts: Number(process.env.RATE_LIMIT_MAX_ATTEMPTS ?? "5"),
  port: Number(process.env.PORT ?? "3000")
};

/** Throws early when required configuration values are not set. */
export function validateEnv(): void {
  const required = ["databaseUrl", "jwtSecret"] as const;
  for (const key of required) {
    if (!env[key]) {
      throw new Error(`Missing required environment value: ${key}`);
    }
  }
}
