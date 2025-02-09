import { createLogger } from "../utils/logger";

const logger = createLogger("DefiLlamaAPI");

export class DefiLlamaAPI {
  protected readonly BASE_URL = "https://api.llama.fi";

  constructor(protected customBaseUrl?: string) {}

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
      logger.debug('API Response:', { endpoint, data });
      logger.debug("Data fetched successfully");
      return data;
    } catch (error) {
      logger.error(`Error fetching ${endpoint}:`, error);
      throw error;
    }
  }
}
