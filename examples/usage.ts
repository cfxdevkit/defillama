import { DeFiLlama } from "../src";
import util from "util";
import { formatUtils } from "../src/formatters";

const inspect = <T>(obj: T): string =>
  util.inspect(obj, {
    depth: null,
    colors: true,
    maxArrayLength: null,
  });

interface ProtocolInfo {
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

interface TVLAnalysis {
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

interface TVLDataPoint {
  date: Date;
  tvl: number;
}

interface MonthlyAccumulator {
  [key: string]: {
    tvls: number[];
    startTVL: number;
    endTVL: number;
  };
}

interface YearlyAccumulator {
  [key: number]: {
    tvls: number[];
    startTVL: number;
    endTVL: number;
  };
}

function analyzeProtocolData(data: any): { info: ProtocolInfo; tvlAnalysis: TVLAnalysis } {
  // Extract Protocol Info with safe defaults
  const info: ProtocolInfo = {
    name: data.name || 'Unknown',
    address: data.address ? data.address.split(':')[1] : '',
    symbol: data.symbol || '',
    url: data.url || '',
    description: data.description || '',
    chains: Array.isArray(data.chains) ? data.chains : [],
    logo: data.logo || '',
    audits: typeof data.audits === 'string' ? parseInt(data.audits) : 0,
    audit_note: data.audit_note || null,
    category: data.category || 'Unknown',
    oracles: Array.isArray(data.oracles) ? data.oracles : [],
    forkedFrom: Array.isArray(data.forkedFrom) ? data.forkedFrom : [],
    twitter: data.twitter ? `https://x.com/${data.twitter}` : '',
    audit_links: Array.isArray(data.audit_links) ? data.audit_links : [],
    listedAt: data.listedAt ? new Date(data.listedAt * 1000) : new Date(),
    github: Array.isArray(data.github) ? data.github.map((repo: string) => `https://github.com/${repo}`) : [],
    currentChainTvls: typeof data.currentChainTvls === 'object' ? data.currentChainTvls : {}
  };

  // Get TVL data with safety checks
  const rawTvlData = data.chainTvls?.[data.chain]?.tvl || data.tvl || [];
  if (!Array.isArray(rawTvlData)) {
    throw new Error(`Invalid TVL data structure for protocol ${data.name}`);
  }

  // Analyze TVL Data with safe value extraction
  const tvlData: TVLDataPoint[] = rawTvlData
    .filter((entry: any) => entry && typeof entry.date === 'number')
    .map((entry: any) => ({
      date: new Date(entry.date * 1000),
      tvl: entry.totalLiquidityUSD || 
           (entry.tokens ? Object.values(entry.tokens)[0] : 0)
    }))
    .filter((entry: TVLDataPoint) => 
      entry.tvl !== undefined && 
      entry.tvl !== null && 
      !isNaN(entry.tvl)
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
      )
    };
  };

  // Group by month with safety checks
  const monthlyData = tvlData.reduce<MonthlyAccumulator>((acc, {date, tvl}) => {
    if (!date || typeof tvl !== 'number') return acc;
    
    const monthKey = date.toISOString().slice(0, 7);
    if (!acc[monthKey]) {
      acc[monthKey] = {
        tvls: [],
        startTVL: tvl,
        endTVL: tvl
      };
    }
    acc[monthKey].tvls.push(tvl);
    acc[monthKey].endTVL = tvl;
    return acc;
  }, {});
  // Group by year with safety checks
  const yearlyData = tvlData.reduce<YearlyAccumulator>((acc, {date, tvl}) => {
    if (!date || typeof tvl !== 'number') return acc;
    
    const year = date.getFullYear();
    if (!acc[year]) {
      acc[year] = {
        tvls: [],
        startTVL: tvl,
        endTVL: tvl
      };
    }
    acc[year].tvls.push(tvl);
    acc[year].endTVL = tvl;
    return acc;
  }, {});
  const byMonth = Object.entries(monthlyData).map(([month, data]: [string, any]) => {
    const stats = calculateStats(data.tvls);
    return {
      month,
      avgTVL: stats.avg,
      minTVL: stats.min,
      maxTVL: stats.max,
      startTVL: data.startTVL,
      endTVL: data.endTVL,
      changePercent: ((data.endTVL - data.startTVL) / data.startTVL) * 100
    };
  });
  const byYear = Object.entries(yearlyData).map(([year, data]: [string, any]) => {
    const stats = calculateStats(data.tvls);
    return {
      year: parseInt(year),
      avgTVL: stats.avg,
      minTVL: stats.min,
      maxTVL: stats.max,
      startTVL: data.startTVL,
      endTVL: data.endTVL,
      changePercent: ((data.endTVL - data.startTVL) / data.startTVL) * 100
    };
  });
  const overallStats = calculateStats(tvlData.map((d: TVLDataPoint) => d.tvl));
  const tvlAnalysis: TVLAnalysis = {
    byMonth,
    byYear,
    overall: {
      avgTVL: overallStats.avg,
      minTVL: overallStats.min,
      maxTVL: overallStats.max,
      startTVL: tvlData[0].tvl,
      currentTVL: tvlData[tvlData.length - 1].tvl,
      totalChangePercent: ((tvlData[tvlData.length - 1].tvl - tvlData[0].tvl) / tvlData[0].tvl) * 100,
      volatility: overallStats.volatility
    }
  };
  return { info, tvlAnalysis };
}

async function demonstrateDeFiLlamaUsage(): Promise<void> {
  const defiLlama = new DeFiLlama();

  try {
    console.log("=== Protocol Methods ===");
    
    // Get formatted analysis directly from the API
    const formattedAnalysis = await defiLlama.getProtocolTVL("nucleon", true);
    
    // Output the formatted analysis as JSON
    console.log(JSON.stringify(formattedAnalysis, null, 2));

  } catch (error) {
    console.error(
      "Error during demonstration:",
      error instanceof Error ? error.message : String(error)
    );
  }
}

// Run the demonstrations
if (require.main === module) {
  console.log("Starting DeFi Llama API demonstrations...");
  demonstrateDeFiLlamaUsage()
    .catch((error) =>
      console.error(
        "Error running demonstrations:",
        error instanceof Error ? error.message : String(error)
      )
    );
}
