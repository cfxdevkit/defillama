import { DeFiLlama } from "../../core/defillama";
import type { ProtocolTVLResponse } from "../../types/responses";

// Create a type for our mocked instance
type MockedDeFiLlama = {
  fetchApi: jest.Mock;
};

// Mock the API class
jest.mock("../../core/api", () => {
  return {
    DefiLlamaAPI: jest.fn().mockImplementation(function (this: MockedDeFiLlama) {
      this.fetchApi = jest.fn();
    }),
  };
});

describe("DeFiLlama", () => {
  let defiLlama: DeFiLlama;
  let mockFetchApi: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    defiLlama = new DeFiLlama();
    // Access the mock function using unknown as intermediate step
    mockFetchApi = (defiLlama as unknown as MockedDeFiLlama).fetchApi;
  });

  describe("getProtocolTVL", () => {
    const mockRawData: Partial<ProtocolTVLResponse> = {
      id: "test-protocol",
      name: "Test Protocol",
      address: "chain:0x123",
      symbol: "TEST",
      chain: "ethereum",
      chains: ["ethereum"],
      tvl: [{ date: 1600000000, totalLiquidityUSD: 1000000 }],
      chainTvls: {
        ethereum: {
          tvl: [{ date: 1600000000, totalLiquidityUSD: 1000000 }],
        },
      },
      timestamp: [1600000000],
      tokensInUsd: [],
      tokens: {},
    };

    it("should return raw data when formatted is false", async () => {
      mockFetchApi.mockResolvedValue(mockRawData);

      const result = await defiLlama.getProtocolTVL("test-protocol");
      expect(result).toEqual(mockRawData);
      expect(mockFetchApi).toHaveBeenCalledWith("/protocol/test-protocol");
    });

    it("should return formatted data when formatted is true", async () => {
      mockFetchApi.mockResolvedValue(mockRawData);

      const result = await defiLlama.getProtocolTVL("test-protocol", true);
      expect(result).toHaveProperty("protocolInfo");
      expect(result).toHaveProperty("tvlAnalysis");
    });

    it("should handle API errors", async () => {
      mockFetchApi.mockRejectedValue(new Error("API Error"));

      await expect(defiLlama.getProtocolTVL("test-protocol")).rejects.toThrow("API Error");
    });
  });

  describe("getHistoricalChainTVL", () => {
    const mockChainData = [{ date: 1600000000, tvl: 1000000 }];

    it("should return raw data when formatted is false", async () => {
      mockFetchApi.mockResolvedValue(mockChainData);

      const result = await defiLlama.getHistoricalChainTVL("ethereum");
      expect(result).toEqual(mockChainData);
      expect(mockFetchApi).toHaveBeenCalledWith("/v2/historicalChainTvl/ethereum");
    });

    it("should return formatted data when formatted is true", async () => {
      mockFetchApi.mockResolvedValue(mockChainData);

      const result = await defiLlama.getHistoricalChainTVL("ethereum", true);
      expect(result).toHaveProperty("chainAnalysis");
    });

    it("should handle missing chain parameter", async () => {
      mockFetchApi.mockResolvedValue(mockChainData);

      const result = await defiLlama.getHistoricalChainTVL();
      expect(result).toEqual(mockChainData);
      expect(mockFetchApi).toHaveBeenCalledWith("/v2/historicalChainTvl");
    });
  });

  describe("getProtocols", () => {
    const mockProtocols = [
      { id: "1", name: "Protocol 1" },
      { id: "2", name: "Protocol 2" },
    ];

    it("should fetch all protocols", async () => {
      mockFetchApi.mockResolvedValue(mockProtocols);

      const result = await defiLlama.getProtocols();
      expect(result).toEqual(mockProtocols);
      expect(mockFetchApi).toHaveBeenCalledWith("/protocols");
    });
  });

  describe("getCurrentProtocolTVL", () => {
    it("should fetch current TVL for a protocol", async () => {
      const mockTVL = 1000000;
      mockFetchApi.mockResolvedValue(mockTVL);

      const result = await defiLlama.getCurrentProtocolTVL("test-protocol");
      expect(result).toBe(mockTVL);
      expect(mockFetchApi).toHaveBeenCalledWith("/tvl/test-protocol");
    });
  });

  describe("getChains", () => {
    const mockChains = [
      { name: "Ethereum", tvl: 1000000 },
      { name: "BSC", tvl: 500000 },
    ];

    it("should fetch all chains", async () => {
      mockFetchApi.mockResolvedValue(mockChains);

      const result = await defiLlama.getChains();
      expect(result).toEqual(mockChains);
      expect(mockFetchApi).toHaveBeenCalledWith("/v2/chains");
    });
  });

  // Add tests for other methods...
});
