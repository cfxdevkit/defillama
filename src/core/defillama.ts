import { createLogger } from "../utils/logger";
import { DefiLlamaAPI } from "./api";
import type { Protocol, Chain, ChainTVLDataPoint, ProtocolTVLResponse } from "../types/responses";
import type { FormattedProtocolAnalysis, FormattedChainTVLAnalysis } from "../types/analysis";
import { ProtocolAnalyzer } from "../formatters/analysis";

const logger = createLogger("DeFiLlama");

/**
 * DeFi Llama API client
 * Provides methods to interact with DeFi Llama's API endpoints
 * @public
 */
export class DeFiLlama extends DefiLlamaAPI {
  /**
   * Get all protocols listed on DeFi Llama
   * @returns Promise with array of protocols
   */
  async getProtocols(): Promise<Protocol[]> {
    logger.debug("Getting all protocols");
    return this.fetchApi<Protocol[]>("/protocols");
  }

  /**
   * Get TVL data for a specific protocol
   * @param protocol - Protocol identifier
   * @param formatted - Whether to return formatted analysis
   * @returns Promise with protocol TVL data or formatted analysis
   */
  async getProtocolTVL(
    protocol: string,
    formatted: boolean = false
  ): Promise<ProtocolTVLResponse | FormattedProtocolAnalysis> {
    logger.debug(`Getting TVL data for protocol: ${protocol}`);
    const rawData = await this.fetchApi<ProtocolTVLResponse>(`/protocol/${protocol}`);

    if (!formatted) {
      return rawData;
    }

    return ProtocolAnalyzer.formatProtocolAnalysis(rawData);
  }

  /**
   * Get current TVL for a specific protocol
   * @param protocol - Protocol identifier
   * @returns Promise with current TVL value
   */
  async getCurrentProtocolTVL(protocol: string): Promise<number> {
    logger.debug(`Getting current TVL for protocol: ${protocol}`);
    return this.fetchApi<number>(`/tvl/${protocol}`);
  }

  /**
   * Get all chains tracked by DeFi Llama
   * @returns Promise with array of chains
   */
  async getChains(): Promise<Chain[]> {
    logger.debug("Getting all chains");
    return this.fetchApi<Chain[]>("/v2/chains");
  }

  /**
   * Get historical TVL data for a specific chain
   * @param chain - Chain name (optional)
   * @param formatted - Whether to return formatted analysis
   * @returns Promise with chain TVL data or formatted analysis
   */
  async getHistoricalChainTVL(
    chain?: string,
    formatted: boolean = false
  ): Promise<ChainTVLDataPoint[] | FormattedChainTVLAnalysis> {
    logger.debug(`Getting historical TVL data${chain ? ` for chain: ${chain}` : ""}`);
    const endpoint = chain ? `/v2/historicalChainTvl/${chain}` : "/v2/historicalChainTvl";
    const data = await this.fetchApi<ChainTVLDataPoint[]>(endpoint);

    if (!formatted) {
      return data;
    }

    return ProtocolAnalyzer.formatChainTVLAnalysis(data);
  }
}
