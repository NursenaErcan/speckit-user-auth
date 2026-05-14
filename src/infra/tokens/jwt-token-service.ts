import jwt from "jsonwebtoken";
import { env } from "../../config/env";

export interface AccessTokenPayload {
  sub: string;
  jti: string;
  email: string;
}

/** Issues and validates 24-hour access tokens for authenticated sessions. */
export class JwtTokenService {
  private getConfig(): { secret: string; issuer: string; audience: string } {
    return {
      secret: process.env.JWT_SECRET ?? env.jwtSecret,
      issuer: process.env.JWT_ISSUER ?? env.jwtIssuer,
      audience: process.env.JWT_AUDIENCE ?? env.jwtAudience
    };
  }

  issue(payload: AccessTokenPayload): string {
    const config = this.getConfig();
    return jwt.sign(payload, config.secret, {
      issuer: config.issuer,
      audience: config.audience,
      expiresIn: "24h"
    });
  }

  verify(token: string): AccessTokenPayload {
    const config = this.getConfig();
    return jwt.verify(token, config.secret, {
      issuer: config.issuer,
      audience: config.audience
    }) as AccessTokenPayload;
  }
}
