import { DeFiLlama } from "../src";
import util from "util";
import { ChainTVLDataPoint, ProtocolTVLResponse } from "../src/types/responses";
const inspect = <T>(obj: T): string =>
  util.inspect(obj, {
    depth: 3,
    colors: true,
    maxArrayLength: 3,
  });

// Example of error handling
async function demonstrateErrorHandling(): Promise<void> {
  console.log("\n=== Error Handling Demonstration ===");
  const defiLlama = new DeFiLlama();

  try {
    console.log("\nTesting invalid protocol handling...");
    await defiLlama.getProtocolTVL("non-existent-protocol");
  } catch (error) {
    console.error(
      "Expected error for invalid protocol:",
      error instanceof Error ? error.message : String(error)
    );
  }

  try {
    console.log("\nTesting invalid chain handling...");
    await defiLlama.getHistoricalChainTVL("invalid-chain");
  } catch (error) {
    console.error(
      "Expected error for invalid chain:",
      error instanceof Error ? error.message : String(error)
    );
  }

  console.log("\n=== End of Error Handling Demonstration ===\n");
  console.log("=".repeat(80), "\n");
}

async function demonstrateDeFiLlamaUsage(): Promise<void> {
  const defiLlama = new DeFiLlama();

  try {
    console.log("=== Protocol Methods ===");

    // Get all protocols
    const protocols = await defiLlama.getProtocols();
    console.log("---\ngetProtocols (showing first 3)\n", inspect(protocols.slice(0, 3)));

    // Get specific protocol TVL data
    const swappiTVLRaw = (await defiLlama.getProtocolTVL("swappi")) as ProtocolTVLResponse;
    console.log(
      "---\ngetProtocolTVL (raw data) (Swappi)\n",
      inspect({
        name: swappiTVLRaw.name,
        tvl: swappiTVLRaw.tvl,
        chainTvls: Object.fromEntries(
          Object.entries(swappiTVLRaw.chainTvls).map(([chain, data]) => [
            chain,
            { tvl: data.tvl.slice(-3) },
          ])
        ),
      })
    );
    const swappiTVL = await defiLlama.getProtocolTVL("swappi", true);
    console.log("---\ngetProtocolTVL (formatted data) (Swappi)\n", inspect(swappiTVL));

    // Get current TVL for a protocol
    const abcPoolCurrentTVL = await defiLlama.getCurrentProtocolTVL("abc-pool");
    console.log("---\ngetCurrentProtocolTVL (ABC Pool)\n", inspect(abcPoolCurrentTVL));

    console.log("\n=== Chain Methods ===");

    // Get all chains
    const chains = await defiLlama.getChains();
    console.log("---\ngetChains (showing first 3)\n", inspect(chains.slice(0, 3)));

    // Get historical TVL for specific chains with analysis
    const chains_to_check = ["conflux", "ethereum"];
    for (const chain of chains_to_check) {
      // Get raw data
      const chainTVLRaw = (await defiLlama.getHistoricalChainTVL(chain)) as ChainTVLDataPoint[];
      console.log(
        `---\ngetHistoricalChainTVL raw data (${chain}, showing last 3 points)\n`,
        inspect(chainTVLRaw.slice(-3))
      );

      const chainTVL = await defiLlama.getHistoricalChainTVL(chain, true);
      console.log(`---\ngetHistoricalChainTVL formatted data (${chain})\n`, inspect(chainTVL));
    }
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
  demonstrateErrorHandling()
    .then(() => demonstrateDeFiLlamaUsage())
    .catch((error) =>
      console.error(
        "Error running demonstrations:",
        error instanceof Error ? error.message : String(error)
      )
    );
}

export { demonstrateErrorHandling, demonstrateDeFiLlamaUsage };
