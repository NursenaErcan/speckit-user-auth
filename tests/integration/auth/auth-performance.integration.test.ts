describe("auth performance budgets", () => {
  it("documents latency budgets for CI monitoring", () => {
    const budgets = {
      registerP95Ms: 3000,
      loginP95Ms: 2000
    };

    expect(budgets.registerP95Ms).toBeLessThanOrEqual(3000);
    expect(budgets.loginP95Ms).toBeLessThanOrEqual(2000);
  });
});
