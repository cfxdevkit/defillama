import { formatUtils } from "../../formatters";

describe("formatUtils", () => {
  describe("compactCurrency", () => {
    it("should format numbers to compact currency", () => {
      expect(formatUtils.compactCurrency(1234)).toBe("$1.23K");
      expect(formatUtils.compactCurrency(1234567)).toBe("$1.23M");
      expect(formatUtils.compactCurrency(1234567890)).toBe("$1.23B");
    });

    it("should handle zero and negative numbers", () => {
      expect(formatUtils.compactCurrency(0)).toBe("$0");
      expect(formatUtils.compactCurrency(-1234)).toBe("-$1.23K");
    });
  });

  describe("changePercent", () => {
    it("should format percentage changes", () => {
      expect(formatUtils.changePercent(12.345)).toBe("+12.35%");
      expect(formatUtils.changePercent(-12.345)).toBe("-12.35%");
    });

    it("should handle zero and extreme values", () => {
      expect(formatUtils.changePercent(0)).toBe("+0.00%");
      expect(formatUtils.changePercent(1000)).toBe("+1000.00%");
    });
  });

  describe("monthYear", () => {
    it("should format dates to month/year", () => {
      const date = new Date("2024-02-15");
      expect(formatUtils.monthYear(date)).toBe("February 2024");
    });

    it("should handle different months", () => {
      expect(formatUtils.monthYear(new Date("2024-01-01"))).toBe("January 2024");
      expect(formatUtils.monthYear(new Date("2024-12-31"))).toBe("December 2024");
    });
  });
});
