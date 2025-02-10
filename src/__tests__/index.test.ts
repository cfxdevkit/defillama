import { DeFiLlama } from "../index";

describe("Package exports", () => {
  it("should export DeFiLlama class", () => {
    expect(DeFiLlama).toBeDefined();
    expect(new DeFiLlama()).toBeInstanceOf(DeFiLlama);
  });
});
