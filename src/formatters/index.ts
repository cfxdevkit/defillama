export const formatUtils = {
  number: (num: number | string): string => {
    if (!num) return "0";
    const value = Number(num);
    if (isNaN(value)) return "0";
    return value.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
  },

  currency: (num: number | string): string => {
    if (!num) return "$0.00";
    const value = Number(num);
    if (isNaN(value)) return "$0.00";
    return `$${value.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  },

  percentage: (num: number | string | null): string => {
    if (num === null || !num) return "0%";
    const value = Number(num);
    if (isNaN(value)) return "0%";
    return `${value.toFixed(2)}%`;
  },

  date: (timestamp: number): string => {
    return new Date(timestamp * 1000).toLocaleString();
  },

  // New formatters
  compactCurrency: (value: number): string => {
    if (value === 0) return "$0";
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      notation: "compact",
      compactDisplay: "short",
    });

    if (value < 0) {
      return `-${formatter.format(Math.abs(value))}`;
    }
    return formatter.format(value);
  },

  monthYear: (date: Date): string => {
    return date.toLocaleString("en-US", {
      month: "long",
      year: "numeric",
    });
  },

  changePercent: (value: number): string => {
    const formatted = value.toFixed(2) + "%";
    return value >= 0 ? `+${formatted}` : formatted;
  },

  volatility: (value: number): string => {
    if (value < 0.1) return "Very Low";
    if (value < 0.25) return "Low";
    if (value < 0.5) return "Moderate";
    if (value < 1) return "High";
    return "Very High";
  },
};

// Add other formatting functions from DeFiLlamaWrapper
