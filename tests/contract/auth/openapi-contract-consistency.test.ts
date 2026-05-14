import fs from "fs";
import path from "path";

describe("openapi contract consistency", () => {
  it("contains required authentication endpoints", () => {
    const contractPath = path.resolve(process.cwd(), "specs/001-user-authentication/contracts/auth.openapi.yaml");
    const content = fs.readFileSync(contractPath, "utf-8");

    expect(content).toContain("/auth/register");
    expect(content).toContain("/auth/login");
    expect(content).toContain("/auth/password-reset/request");
    expect(content).toContain("/auth/password-reset/confirm");
    expect(content).toContain("/auth/session/validate");
  });
});
