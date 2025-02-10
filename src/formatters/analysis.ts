// New file for analysis-related formatting
import { formatUtils } from "./index";
import { ChainTVLDataPoint, ProtocolTVLResponse, RawProtocolTVLEntry } from "../types/responses";
import type {
  ProtocolInfo,
  TVLAnalysis,
  TVLDataPoint,
  MonthlyAccumulator,
  YearlyAccumulator,
  FormattedProtocolAnalysis,
  ChainTVLAnalysis,
  FormattedChainTVLAnalysis,
} from "../types/analysis";

export class ProtocolAnalyzer {
  static analyzeProtocolData(data: ProtocolTVLResponse): {
    info: ProtocolInfo;
    tvlAnalysis: TVLAnalysis;
  } {
    // Extract Protocol Info with safe defaults
    const info: ProtocolInfo = {
      name: data.name || "Unknown",
      address: data.address ? data.address.split(":")[1] : "",
      symbol: data.symbol || "",
      url: data.url || "",
      description: data.description || "",
      chains: Array.isArray(data.chains) ? data.chains : [],
      logo: data.logo || "",
      audits: typeof data.audits === "string" ? parseInt(data.audits) : 0,
      audit_note: data.audit_note || null,
      category: data.category || "Unknown",
      oracles: Array.isArray(data.oracles) ? data.oracles : [],
      forkedFrom: Array.isArray(data.forkedFrom) ? data.forkedFrom : [],
      twitter: data.twitter ? `https://x.com/${data.twitter}` : "",
      audit_links: Array.isArray(data.audit_links) ? data.audit_links : [],
      listedAt: data.listedAt ? new Date(data.listedAt * 1000) : new Date(),
      github: Array.isArray(data.github)
        ? data.github.map((repo: string) => `https://github.com/${repo}`)
        : [],
      currentChainTvls: typeof data.currentChainTvls === "object" ? data.currentChainTvls : {},
    };

    // Get TVL data with safety checks
    const rawTvlData: RawProtocolTVLEntry[] = data.chainTvls?.[data.chain]?.tvl || data.tvl || [];
    if (!Array.isArray(rawTvlData)) {
      throw new Error(`Invalid TVL data structure for protocol ${data.name}`);
    }

    // Analyze TVL Data with safe value extraction
    const tvlData: TVLDataPoint[] = rawTvlData
      .filter((entry: RawProtocolTVLEntry) => entry && typeof entry.date === "number")
      .map((entry: RawProtocolTVLEntry) => ({
        date: new Date(entry.date * 1000),
        tvl: entry.totalLiquidityUSD || (entry.tokens ? Object.values(entry.tokens)[0] : 0),
      }))
      .filter(
        (entry: TVLDataPoint) => entry.tvl !== undefined && entry.tvl !== null && !isNaN(entry.tvl)
      );

    // Add safety check
    if (tvlData.length === 0) {
      throw new Error(`No valid TVL data found for protocol ${data.name}`);
    }

    // Helper function to calculate statistics
    const calculateStats = (tvlValues: number[]) => {
      if (tvlValues.length === 0) return { avg: 0, min: 0, max: 0, volatility: 0 };

      const avg = tvlValues.reduce((a, b) => a + b, 0) / tvlValues.length;
      return {
        avg,
        min: Math.min(...tvlValues),
        max: Math.max(...tvlValues),
        volatility: Math.sqrt(
          tvlValues.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / tvlValues.length
        ),
      };
    };

    // Group by month with safety checks
    const monthlyData = tvlData.reduce<MonthlyAccumulator>((acc, { date, tvl }) => {
      if (!date || typeof tvl !== "number") return acc;

      const monthKey = date.toISOString().slice(0, 7);
      if (!acc[monthKey]) {
        acc[monthKey] = {
          tvls: [],
          startTVL: tvl,
          endTVL: tvl,
        };
      }
      acc[monthKey].tvls.push(tvl);
      acc[monthKey].endTVL = tvl;
      return acc;
    }, {});

    // Group by year with safety checks
    const yearlyData = tvlData.reduce<YearlyAccumulator>((acc, { date, tvl }) => {
      if (!date || typeof tvl !== "number") return acc;

      const year = date.getFullYear();
      if (!acc[year]) {
        acc[year] = {
          tvls: [],
          startTVL: tvl,
          endTVL: tvl,
        };
      }
      acc[year].tvls.push(tvl);
      acc[year].endTVL = tvl;
      return acc;
    }, {});

    const byMonth = Object.entries(monthlyData).map(([month, data]) => {
      const stats = calculateStats(data.tvls);
      return {
        month,
        avgTVL: stats.avg,
        minTVL: stats.min,
        maxTVL: stats.max,
        startTVL: data.startTVL,
        endTVL: data.endTVL,
        changePercent: ((data.endTVL - data.startTVL) / data.startTVL) * 100,
      };
    });

    const byYear = Object.entries(yearlyData).map(([year, data]) => {
      const stats = calculateStats(data.tvls);
      return {
        year: parseInt(year),
        avgTVL: stats.avg,
        minTVL: stats.min,
        maxTVL: stats.max,
        startTVL: data.startTVL,
        endTVL: data.endTVL,
        changePercent: ((data.endTVL - data.startTVL) / data.startTVL) * 100,
      };
    });

    const overallStats = calculateStats(tvlData.map((d) => d.tvl));
    const tvlAnalysis: TVLAnalysis = {
      byMonth,
      byYear,
      overall: {
        avgTVL: overallStats.avg,
        minTVL: overallStats.min,
        maxTVL: overallStats.max,
        startTVL: tvlData[0].tvl,
        currentTVL: tvlData[tvlData.length - 1].tvl,
        totalChangePercent:
          ((tvlData[tvlData.length - 1].tvl - tvlData[0].tvl) / tvlData[0].tvl) * 100,
        volatility: overallStats.volatility,
      },
    };

    return { info, tvlAnalysis };
  }

  static formatProtocolAnalysis(data: ProtocolTVLResponse): FormattedProtocolAnalysis {
    const analysis = this.analyzeProtocolData(data);

    return {
      protocolInfo: {
        name: analysis.info.name,
        address: analysis.info.address,
        symbol: analysis.info.symbol,
        url: analysis.info.url,
        description: analysis.info.description,
        chains: analysis.info.chains,
        logo: analysis.info.logo,
        audits: analysis.info.audits,
        audit_note: analysis.info.audit_note,
        category: analysis.info.category,
        oracles: analysis.info.oracles,
        forkedFrom: analysis.info.forkedFrom,
        twitter: analysis.info.twitter,
        audit_links: analysis.info.audit_links,
        listedAt: formatUtils.monthYear(analysis.info.listedAt),
        github: analysis.info.github,
        currentChainTvls: Object.entries(analysis.info.currentChainTvls).reduce(
          (acc, [chain, value]) => ({
            ...acc,
            [chain]: formatUtils.compactCurrency(value),
          }),
          {}
        ),
      },
      tvlAnalysis: {
        overall: {
          currentTVL: formatUtils.compactCurrency(analysis.tvlAnalysis.overall.currentTVL),
          startingTVL: formatUtils.compactCurrency(analysis.tvlAnalysis.overall.startTVL),
          averageTVL: formatUtils.compactCurrency(analysis.tvlAnalysis.overall.avgTVL),
          minimumTVL: formatUtils.compactCurrency(analysis.tvlAnalysis.overall.minTVL),
          maximumTVL: formatUtils.compactCurrency(analysis.tvlAnalysis.overall.maxTVL),
          totalChange: formatUtils.changePercent(analysis.tvlAnalysis.overall.totalChangePercent),
          volatility: analysis.tvlAnalysis.overall.volatility,
        },
        yearlyAnalysis: analysis.tvlAnalysis.byYear.map((year) => ({
          year: year.year,
          average: formatUtils.compactCurrency(year.avgTVL),
          minimum: formatUtils.compactCurrency(year.minTVL),
          maximum: formatUtils.compactCurrency(year.maxTVL),
          startingTVL: formatUtils.compactCurrency(year.startTVL),
          endingTVL: formatUtils.compactCurrency(year.endTVL),
          percentageChange: formatUtils.changePercent(year.changePercent),
        })),
        monthlyAnalysis: analysis.tvlAnalysis.byMonth.map((month) => ({
          month: formatUtils.monthYear(new Date(month.month)),
          average: formatUtils.compactCurrency(month.avgTVL),
          minimum: formatUtils.compactCurrency(month.minTVL),
          maximum: formatUtils.compactCurrency(month.maxTVL),
          startingTVL: formatUtils.compactCurrency(month.startTVL),
          endingTVL: formatUtils.compactCurrency(month.endTVL),
          percentageChange: formatUtils.changePercent(month.changePercent),
        })),
      },
    };
  }

  static analyzeChainTVLData(data: ChainTVLDataPoint[]): ChainTVLAnalysis {
    // Convert UNIX timestamps to Date objects and structure the data
    const tvlData: TVLDataPoint[] = data
      .filter((entry) => entry && typeof entry.date === "number" && !isNaN(entry.tvl))
      .map((entry) => ({
        date: new Date(entry.date * 1000),
        tvl: entry.tvl,
      }));

    if (tvlData.length === 0) {
      throw new Error("No valid TVL data found for chain");
    }

    // Helper function to calculate statistics
    const calculateStats = (tvlValues: number[]) => {
      if (tvlValues.length === 0) return { avg: 0, min: 0, max: 0, volatility: 0 };

      const avg = tvlValues.reduce((a, b) => a + b, 0) / tvlValues.length;
      return {
        avg,
        min: Math.min(...tvlValues),
        max: Math.max(...tvlValues),
        volatility: Math.sqrt(
          tvlValues.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / tvlValues.length
        ),
      };
    };

    // Group by month
    const monthlyData = tvlData.reduce<MonthlyAccumulator>((acc, { date, tvl }) => {
      const monthKey = date.toISOString().slice(0, 7);
      if (!acc[monthKey]) {
        acc[monthKey] = {
          tvls: [],
          startTVL: tvl,
          endTVL: tvl,
        };
      }
      acc[monthKey].tvls.push(tvl);
      acc[monthKey].endTVL = tvl;
      return acc;
    }, {});

    // Group by year
    const yearlyData = tvlData.reduce<YearlyAccumulator>((acc, { date, tvl }) => {
      const year = date.getFullYear();
      if (!acc[year]) {
        acc[year] = {
          tvls: [],
          startTVL: tvl,
          endTVL: tvl,
        };
      }
      acc[year].tvls.push(tvl);
      acc[year].endTVL = tvl;
      return acc;
    }, {});

    const byMonth = Object.entries(monthlyData).map(([month, data]) => {
      const stats = calculateStats(data.tvls);
      return {
        month,
        avgTVL: stats.avg,
        minTVL: stats.min,
        maxTVL: stats.max,
        startTVL: data.startTVL,
        endTVL: data.endTVL,
        changePercent: ((data.endTVL - data.startTVL) / data.startTVL) * 100,
      };
    });

    const byYear = Object.entries(yearlyData).map(([year, data]) => {
      const stats = calculateStats(data.tvls);
      return {
        year: parseInt(year),
        avgTVL: stats.avg,
        minTVL: stats.min,
        maxTVL: stats.max,
        startTVL: data.startTVL,
        endTVL: data.endTVL,
        changePercent: ((data.endTVL - data.startTVL) / data.startTVL) * 100,
      };
    });

    const overallStats = calculateStats(tvlData.map((d) => d.tvl));
    return {
      byMonth,
      byYear,
      overall: {
        avgTVL: overallStats.avg,
        minTVL: overallStats.min,
        maxTVL: overallStats.max,
        startTVL: tvlData[0].tvl,
        currentTVL: tvlData[tvlData.length - 1].tvl,
        totalChangePercent:
          ((tvlData[tvlData.length - 1].tvl - tvlData[0].tvl) / tvlData[0].tvl) * 100,
        volatility: overallStats.volatility,
      },
    };
  }

  static formatChainTVLAnalysis(data: ChainTVLDataPoint[]): FormattedChainTVLAnalysis {
    const analysis = this.analyzeChainTVLData(data);

    return {
      chainAnalysis: {
        overall: {
          currentTVL: formatUtils.compactCurrency(analysis.overall.currentTVL),
          startingTVL: formatUtils.compactCurrency(analysis.overall.startTVL),
          averageTVL: formatUtils.compactCurrency(analysis.overall.avgTVL),
          minimumTVL: formatUtils.compactCurrency(analysis.overall.minTVL),
          maximumTVL: formatUtils.compactCurrency(analysis.overall.maxTVL),
          totalChange: formatUtils.changePercent(analysis.overall.totalChangePercent),
          volatility: analysis.overall.volatility,
        },
        yearlyAnalysis: analysis.byYear.map((year) => ({
          year: year.year,
          average: formatUtils.compactCurrency(year.avgTVL),
          minimum: formatUtils.compactCurrency(year.minTVL),
          maximum: formatUtils.compactCurrency(year.maxTVL),
          startingTVL: formatUtils.compactCurrency(year.startTVL),
          endingTVL: formatUtils.compactCurrency(year.endTVL),
          percentageChange: formatUtils.changePercent(year.changePercent),
        })),
        monthlyAnalysis: analysis.byMonth.map((month) => ({
          month: formatUtils.monthYear(new Date(month.month)),
          average: formatUtils.compactCurrency(month.avgTVL),
          minimum: formatUtils.compactCurrency(month.minTVL),
          maximum: formatUtils.compactCurrency(month.maxTVL),
          startingTVL: formatUtils.compactCurrency(month.startTVL),
          endingTVL: formatUtils.compactCurrency(month.endTVL),
          percentageChange: formatUtils.changePercent(month.changePercent),
        })),
      },
    };
  }
}
