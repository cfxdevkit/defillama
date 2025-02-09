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
  compactCurrency: (num: number): string => {
    if (!num) return "$0";
    const absNum = Math.abs(num);
    if (absNum >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (absNum >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    if (absNum >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
    return `$${num.toFixed(2)}`;
  },

  monthYear: (date: Date): string => {
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  },

  changePercent: (value: number): string => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}%`;
  },

  volatility: (value: number): string => {
    if (value < 0.1) return "Very Low";
    if (value < 0.25) return "Low";
    if (value < 0.5) return "Moderate";
    if (value < 1) return "High";
    return "Very High";
  }
};

// Add other formatting functions from DeFiLlamaWrapper
