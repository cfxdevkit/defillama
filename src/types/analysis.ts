// New file for analysis-related types
/**
 * Protocol information with additional details
 * @public
 */
export interface ProtocolInfo {
  name: string;
  address: string;
  symbol: string;
  url: string;
  description: string;
  chains: string[];
  logo: string;
  audits: number;
  audit_note: string | null;
  category: string;
  oracles: string[];
  forkedFrom: string[];
  twitter: string;
  audit_links: string[];
  listedAt: Date;
  github: string[];
  currentChainTvls: Record<string, number>;
}

/**
 * TVL analysis data structure
 * @public
 */
export interface TVLAnalysis {
  byMonth: {
    month: string;
    avgTVL: number;
    minTVL: number;
    maxTVL: number;
    startTVL: number;
    endTVL: number;
    changePercent: number;
  }[];
  byYear: {
    year: number;
    avgTVL: number;
    minTVL: number;
    maxTVL: number;
    startTVL: number;
    endTVL: number;
    changePercent: number;
  }[];
  overall: {
    avgTVL: number;
    minTVL: number;
    maxTVL: number;
    startTVL: number;
    currentTVL: number;
    totalChangePercent: number;
    volatility: number;
  };
}

/**
 * Formatted protocol analysis with detailed metrics
 * @public
 */
export interface FormattedProtocolAnalysis {
  protocolInfo: {
    name: string;
    address: string;
    symbol: string;
    url: string;
    description: string;
    chains: string[];
    logo: string;
    audits: number;
    audit_note: string | null;
    category: string;
    oracles: string[];
    forkedFrom: string[];
    twitter: string;
    audit_links: string[];
    listedAt: string;
    github: string[];
    currentChainTvls: Record<string, string>;
  };
  tvlAnalysis: {
    overall: {
      currentTVL: string;
      startingTVL: string;
      averageTVL: string;
      minimumTVL: string;
      maximumTVL: string;
      totalChange: string;
      volatility: number;
    };
    yearlyAnalysis: {
      year: number;
      average: string;
      minimum: string;
      maximum: string;
      startingTVL: string;
      endingTVL: string;
      percentageChange: string;
    }[];
    monthlyAnalysis: {
      month: string;
      average: string;
      minimum: string;
      maximum: string;
      startingTVL: string;
      endingTVL: string;
      percentageChange: string;
    }[];
  };
}

/**
 * Single TVL data point
 * @public
 */
export interface TVLDataPoint {
  date: Date;
  tvl: number;
}

/**
 * Monthly TVL accumulator
 * @public
 */
export interface MonthlyAccumulator {
  [key: string]: {
    tvls: number[];
    startTVL: number;
    endTVL: number;
  };
}

/**
 * Yearly TVL accumulator
 * @public
 */
export interface YearlyAccumulator {
  [key: number]: {
    tvls: number[];
    startTVL: number;
    endTVL: number;
  };
}

// Add new interfaces for chain analysis
/**
 * Chain TVL analysis data
 * @public
 */
export interface ChainTVLAnalysis {
  byMonth: {
    month: string;
    avgTVL: number;
    minTVL: number;
    maxTVL: number;
    startTVL: number;
    endTVL: number;
    changePercent: number;
  }[];
  byYear: {
    year: number;
    avgTVL: number;
    minTVL: number;
    maxTVL: number;
    startTVL: number;
    endTVL: number;
    changePercent: number;
  }[];
  overall: {
    avgTVL: number;
    minTVL: number;
    maxTVL: number;
    startTVL: number;
    currentTVL: number;
    totalChangePercent: number;
    volatility: number;
  };
}

/**
 * Formatted chain TVL analysis with detailed metrics
 * @public
 */
export interface FormattedChainTVLAnalysis {
  chainAnalysis: {
    overall: {
      currentTVL: string;
      startingTVL: string;
      averageTVL: string;
      minimumTVL: string;
      maximumTVL: string;
      totalChange: string;
      volatility: number;
    };
    yearlyAnalysis: {
      year: number;
      average: string;
      minimum: string;
      maximum: string;
      startingTVL: string;
      endingTVL: string;
      percentageChange: string;
    }[];
    monthlyAnalysis: {
      month: string;
      average: string;
      minimum: string;
      maximum: string;
      startingTVL: string;
      endingTVL: string;
      percentageChange: string;
    }[];
  };
}
