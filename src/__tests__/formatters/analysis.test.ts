import { ProtocolAnalyzer } from "../../formatters/analysis";
import { ChainTVLDataPoint, ProtocolTVLResponse } from "../../types/responses";

describe("ProtocolAnalyzer", () => {
  describe("analyzeProtocolData", () => {
    const mockProtocolData: ProtocolTVLResponse = {
      id: "test-protocol",
      name: "Test Protocol",
      address: "chain:0x123",
      symbol: "TEST",
      url: "https://test.com",
      description: "Test Description",
      chain: "ethereum",
      chains: ["ethereum", "bsc"],
      logo: "https://test.com/logo.png",
      audits: "2",
      audit_note: "Audited by XYZ",
      category: "DEX",
      oracles: ["chainlink"],
      forkedFrom: ["uniswap"],
      twitter: "testprotocol",
      audit_links: ["https://audit.com"],
      listedAt: 1600000000,
      github: ["org/repo"],
      currentChainTvls: { ethereum: 1000000 },
      tvl: [
        { date: 1600000000, totalLiquidityUSD: 1000000 },
        { date: 1600086400, totalLiquidityUSD: 1100000 },
        { date: 1600172800, totalLiquidityUSD: 900000 },
      ],
      chainTvls: {
        ethereum: {
          tvl: [
            { date: 1600000000, totalLiquidityUSD: 1000000 },
            { date: 1600086400, totalLiquidityUSD: 1100000 },
            { date: 1600172800, totalLiquidityUSD: 900000 },
          ],
        },
      },
      timestamp: [1600000000, 1600086400, 1600172800],
      tokensInUsd: [],
      tokens: {},
    };

    it("should correctly analyze protocol data", () => {
      const analysis = ProtocolAnalyzer.analyzeProtocolData(mockProtocolData);

      // Test protocol info
      expect(analysis.info.name).toBe("Test Protocol");
      expect(analysis.info.address).toBe("0x123");
      expect(analysis.info.twitter).toBe("https://x.com/testprotocol");

      // Test TVL analysis
      expect(analysis.tvlAnalysis.overall.startTVL).toBe(1000000);
      expect(analysis.tvlAnalysis.overall.currentTVL).toBe(900000);
      expect(analysis.tvlAnalysis.overall.totalChangePercent).toBe(-10);
    });

    it("should handle missing or invalid data", () => {
      const incompleteData = {
        ...mockProtocolData,
        address: null,
        twitter: null,
        tvl: [],
        chainTvls: { ethereum: { tvl: [] } },
      } as ProtocolTVLResponse;

      expect(() => {
        ProtocolAnalyzer.analyzeProtocolData(incompleteData);
      }).toThrow("No valid TVL data found for protocol Test Protocol");
    });
  });

  describe("analyzeChainTVLData", () => {
    const mockChainData: ChainTVLDataPoint[] = [
      { date: 1600000000, tvl: 1000000 },
      { date: 1600086400, tvl: 1100000 },
      { date: 1600172800, tvl: 900000 },
    ];

    it("should correctly analyze chain TVL data", () => {
      const analysis = ProtocolAnalyzer.analyzeChainTVLData(mockChainData);

      expect(analysis.overall.startTVL).toBe(1000000);
      expect(analysis.overall.currentTVL).toBe(900000);
      expect(analysis.overall.totalChangePercent).toBe(-10);
    });

    it("should handle empty data", () => {
      expect(() => {
        ProtocolAnalyzer.analyzeChainTVLData([]);
      }).toThrow("No valid TVL data found for chain");
    });

    it("should handle invalid data points", () => {
      const invalidData = [
        { date: "invalid", tvl: 1000 },
        { date: 1600000000, tvl: "invalid" },
      ] as unknown as ChainTVLDataPoint[];

      expect(() => {
        ProtocolAnalyzer.analyzeChainTVLData(invalidData);
      }).toThrow("No valid TVL data found for chain");
    });

    it("should calculate correct statistics", () => {
      const data = [
        { date: 1600000000, tvl: 1000 },
        { date: 1600086400, tvl: 2000 },
        { date: 1600172800, tvl: 3000 },
      ];

      const analysis = ProtocolAnalyzer.analyzeChainTVLData(data);
      expect(analysis.overall.avgTVL).toBe(2000);
      expect(analysis.overall.volatility).toBeGreaterThan(0);
    });
  });

  describe("formatProtocolAnalysis", () => {
    const mockProtocolData = {
      id: "test-protocol",
      name: "Test Protocol",
      address: "chain:0x123",
      symbol: "TEST",
      url: "https://test.com",
      description: "Test Description",
      chain: "ethereum",
      chains: ["ethereum", "bsc"],
      logo: "https://test.com/logo.png",
      audits: "2",
      audit_note: "Audited by XYZ",
      category: "DEX",
      oracles: ["chainlink"],
      forkedFrom: ["uniswap"],
      twitter: "testprotocol",
      audit_links: ["https://audit.com"],
      listedAt: 1600000000,
      github: ["org/repo"],
      currentChainTvls: { ethereum: 1000000 },
      tvl: [
        { date: 1600000000, totalLiquidityUSD: 1000000 },
        { date: 1600086400, totalLiquidityUSD: 1100000 },
        { date: 1600172800, totalLiquidityUSD: 900000 },
      ],
      chainTvls: {
        ethereum: {
          tvl: [
            { date: 1600000000, totalLiquidityUSD: 1000000 },
            { date: 1600086400, totalLiquidityUSD: 1100000 },
            { date: 1600172800, totalLiquidityUSD: 900000 },
          ],
        },
      },
      timestamp: [1600000000, 1600086400, 1600172800],
      tokensInUsd: [],
      tokens: {},
    };

    it("should correctly format protocol analysis", () => {
      const formatted = ProtocolAnalyzer.formatProtocolAnalysis(mockProtocolData);

      expect(formatted.protocolInfo.name).toBe("Test Protocol");
      expect(formatted.tvlAnalysis.overall.currentTVL).toBe("$900.00K");
      expect(formatted.tvlAnalysis.overall.totalChange).toBe("-10.00%");
    });
  });

  describe("formatChainTVLAnalysis", () => {
    const mockChainData: ChainTVLDataPoint[] = [
      { date: 1600000000, tvl: 1000000 },
      { date: 1600086400, tvl: 1100000 },
      { date: 1600172800, tvl: 900000 },
    ];

    it("should correctly format chain TVL analysis", () => {
      const formatted = ProtocolAnalyzer.formatChainTVLAnalysis(mockChainData);

      expect(formatted.chainAnalysis.overall.currentTVL).toBe("$900.00K");
      expect(formatted.chainAnalysis.overall.totalChange).toBe("-10.00%");
    });
  });
});
