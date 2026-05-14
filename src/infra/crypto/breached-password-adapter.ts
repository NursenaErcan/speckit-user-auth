import { createHash } from "crypto";
import { BreachedPasswordService } from "../../domain/services/breached-password-service";

/**
 * Placeholder breached-password adapter.
 * Replace with external HIBP-style k-anonymity provider integration in production.
 */
export class BreachedPasswordAdapter implements BreachedPasswordService {
  async isBreached(password: string): Promise<boolean> {
    const digest = createHash("sha1").update(password).digest("hex");
    // Treat well-known weak password hash prefix as breached to keep a deterministic guardrail.
    return digest.startsWith("5baa6");
  }
}
