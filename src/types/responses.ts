// Base response types
export interface TVLDataPoint {
  date: string;
  tvl: number;
}

export interface ChainTVLDataPoint {
  date: number; // Unix timestamp
  tvl: number;
}

export interface TVLSummary {
  currentTVL: number;
  monthlyChange: number;
  maxTVL: number;
  minTVL: number;
  avgTVL: number;
  last12Months: TVLDataPoint[];
}

// Protocol types
export interface Protocol {
  id: string;
  name: string;
  address: string | null;
  symbol: string;
  url: string;
  description: string;
  chain: string;
  logo: string | null;
  audits: string | null;
  audit_note: string | null;
  gecko_id: string | null;
  cmcId: string | null;
  category: string;
  chains: string[];
  module: string;
  twitter: string | null;
  forkedFrom: string[];
  oracles: string[];
  listedAt: number;
  tvl: number;
  chainTvls: Record<string, number>;
  change_1h: number | null;
  change_1d: number | null;
  change_7d: number | null;
  methodology?: string | null;
}

export interface ProtocolTVLResponse {
  // Base Protocol fields
  id: string;
  name: string;
  address: string | null;
  symbol: string;
  url: string;
  description: string;
  chain: string;
  logo: string | null;
  audits: string | null;
  audit_note: string | null;
  gecko_id: string | null;
  cmcId: string | null;
  category: string;
  chains: string[];
  module: string;
  twitter: string | null;
  forkedFrom: string[];
  oracles: string[];
  methodology?: string | null;

  // TVL specific fields
  tvl: number[];
  tokensInUsd?: number[];
  tokens?: Record<string, number[]>;
  timestamp: number[];
  chainTvls: Record<
    string,
    {
      tvl: number[];
      tokensInUsd: number[];
      tokens: Record<string, number[]>[];
      timestamp: number[];
    }
  >;
}

// Chain types
export interface Chain {
  tvl: number;
  tokenSymbol: string;
  cmcId: number;
  name: string;
  chainId: number | null;
}

export interface ChainsResponse {
  chains: Chain[];
}
