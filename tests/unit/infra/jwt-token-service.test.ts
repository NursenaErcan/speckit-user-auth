import { JwtTokenService } from "../../../src/infra/tokens/jwt-token-service";

describe("jwt token service", () => {
  it("issues and verifies access token", () => {
    process.env.JWT_SECRET = "test-secret";
    process.env.JWT_ISSUER = "test-issuer";
    process.env.JWT_AUDIENCE = "test-audience";

    const service = new JwtTokenService();
    const token = service.issue({
      sub: "u-1",
      jti: "j-1",
      email: "u1@example.com"
    });

    const payload = service.verify(token);
    expect(payload.sub).toBe("u-1");
    expect(payload.email).toBe("u1@example.com");
  });
});
