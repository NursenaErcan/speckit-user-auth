import pino from "pino";

/** Application logger configured for structured JSON output. */
export const logger = pino({ level: process.env.LOG_LEVEL ?? "info" });
