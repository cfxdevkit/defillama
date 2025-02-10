/**
 * Base TVL data point with string date
 * @public
 */
export interface TVLDataPoint {
  date: string;
  tvl: number;
}

/**
 * Chain TVL data point with numeric date
 * @public
 */
export interface ChainTVLDataPoint {
  date: number;
  tvl: number;
}

/**
 * Summary of TVL statistics
 * @public
 */
export interface TVLSummary {
  currentTVL: number;
  monthlyChange: number;
  maxTVL: number;
  minTVL: number;
  avgTVL: number;
  last12Months: TVLDataPoint[];
}

/**
 * Protocol information from DeFi Llama
 * @public
 */
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

/**
 * Raw TVL data point for a protocol
 * @public
 */
export interface RawProtocolTVLEntry {
  date: number;
  totalLiquidityUSD?: number;
  tokens?: Record<string, number>;
}

/**
 * Complete protocol TVL response
 * @public
 */
export interface ProtocolTVLResponse {
  // Base Protocol fields
  id: string;
  name: string;
  address: string | null;
  symbol: string;
  url: string;
  description: string;
  chain: string;
  chains: string[];
  logo: string | null;
  audits: string | null;
  audit_note: string | null;
  category: string;
  oracles: string[];
  forkedFrom: string[];
  twitter: string | null;
  audit_links: string[];
  listedAt: number;
  github: string[];
  currentChainTvls: Record<string, number>;
  tvl: RawProtocolTVLEntry[];
  chainTvls: Record<
    string,
    {
      tvl: RawProtocolTVLEntry[];
    }
  >;

  // TVL specific fields
  tokensInUsd?: number[];
  tokens?: Record<string, number[]>;
  timestamp: number[];
}

/**
 * Chain information
 * @public
 */
export interface Chain {
  tvl: number;
  tokenSymbol: string;
  cmcId: number;
  name: string;
  chainId: number | null;
}

/**
 * Response containing chain information
 * @public
 */
export interface ChainsResponse {
  chains: Chain[];
}
