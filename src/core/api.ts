import { createLogger } from "../utils/logger";

const logger = createLogger("DefiLlamaAPI");

/**
 * Base API client for DeFi Llama
 * Handles HTTP requests to the DeFi Llama API
 * @public
 */
export class DefiLlamaAPI {
  /**
   * Base URL for the DeFi Llama API
   */
  protected readonly BASE_URL = "https://api.llama.fi";

  /**
   * Creates a new DeFi Llama API client
   * @param customBaseUrl - Optional custom base URL for the API
   */
  constructor(protected customBaseUrl?: string) {}

  /**
   * Makes a request to the DeFi Llama API
   * @param endpoint - API endpoint to call
   * @param baseUrl - Base URL to use (defaults to BASE_URL)
   * @param params - Query parameters to include in the request
   * @returns Promise with the API response
   * @internal
   */
  protected async fetchApi<T>(
    endpoint: string,
    baseUrl: string = this.BASE_URL,
    params: Record<string, string | number | boolean> = {}
  ): Promise<T> {
    try {
      const url = new URL(endpoint, this.customBaseUrl || baseUrl);
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.append(key, String(value));
        }
      });

      logger.debug(`Fetching DeFiLlama data from: ${url.toString()}`);
      const response = await fetch(url.toString());

      if (!response.ok) {
        logger.error(`DeFiLlama API request failed with status: ${response.status}`);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      logger.debug("API Response:", { endpoint, data });
      logger.debug("Data fetched successfully");
      return data;
    } catch (error) {
      logger.error(`Error fetching ${endpoint}:`, error);
      throw error;
    }
  }
}
