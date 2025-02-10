# @cfxdevkit/defillama

A TypeScript library for interacting with the DeFi Llama API, providing easy access to DeFi protocol and chain TVL (Total Value Locked) data with optional analysis features.

[![npm version](https://img.shields.io/npm/v/@cfxdevkit/defillama)](https://www.npmjs.com/package/@cfxdevkit/defillama)
[![Build Status](https://img.shields.io/github/actions/workflow/status/cfxdevkit/defillama/ci.yml)](https://github.com/cfxdevkit/defillama/actions)
[![Coverage Status](https://codecov.io/gh/cfxdevkit/defillama/branch/main/graph/badge.svg)](https://codecov.io/gh/cfxdevkit/defillama)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/@cfxdevkit/defillama)](https://bundlephobia.com/package/@cfxdevkit/defillama)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Node Version](https://img.shields.io/node/v/@cfxdevkit/defillama)](https://www.npmjs.com/package/@cfxdevkit/defillama)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/cfxdevkit/defillama/pulls)

## Features

- 🚀 Full TypeScript support with comprehensive type definitions
- 📊 Access to DeFi Llama's protocol and chain TVL data
- 📈 Optional data analysis and formatting capabilities
- 🔍 Detailed error handling and logging
- 📝 Well-documented API methods
- ⚡ Modern ES6+ syntax

## Installation

```bash
npm install @cfxdevkit/defillama
```

## Quick Start

```typescript
import { DeFiLlama } from '@cfxdevkit/defillama';

const defiLlama = new DeFiLlama();

// Get TVL data for a specific protocol
const protocolTVL = await defiLlama.getProtocolTVL('uniswap');

// Get historical TVL data for a chain with analysis
const chainTVL = await defiLlama.getHistoricalChainTVL('ethereum', true);
```

## Examples

### Error Handling

The library includes comprehensive error handling for invalid inputs:

```typescript
const defiLlama = new DeFiLlama();

try {
  // This will throw an error for non-existent protocol
  await defiLlama.getProtocolTVL('non-existent-protocol');
} catch (error) {
  console.error('Error:', error.message);
  // Output: Error: HTTP error! status: 400
}

try {
  // This will throw an error for invalid chain
  await defiLlama.getHistoricalChainTVL('invalid-chain');
} catch (error) {
  console.error('Error:', error.message);
  // Output: Error: HTTP error! status: 400
}
```

### Protocol Methods

#### Get All Protocols
```typescript
const protocols = await defiLlama.getProtocols();
// Returns array of protocols with details like:
// [
//   {
//     id: '2269',
//     name: 'Binance CEX',
//     url: 'https://www.binance.com',
//     description: 'Binance is a cryptocurrency exchange...',
//     chain: 'Multi-Chain',
//     tvl: 144318054315.48734,
//     chainTvls: {
//       Ethereum: 40481829144.37302,
//       Bitcoin: 55798161484.458565,
//       // ... other chains
//     }
//   },
//   // ... other protocols
// ]
```

#### Get Protocol TVL with Analysis
```typescript
// Get formatted TVL data with analysis
const swappiTVL = await defiLlama.getProtocolTVL('swappi', true);
// Returns detailed analysis:
// {
//   protocolInfo: {
//     name: 'Swappi',
//     currentChainTvls: { Conflux: '$9.71M' }
//     // ... other protocol info
//   },
//   tvlAnalysis: {
//     overall: {
//       currentTVL: '$9.71M',
//       averageTVL: '$14.39M',
//       totalChange: '-76.15%'
//     },
//     yearlyAnalysis: [
//       {
//         year: 2023,
//         average: '$15.94M',
//         percentageChange: '+348.77%'
//       }
//       // ... other years
//     ]
//   }
// }
```

#### Get Current Protocol TVL
```typescript
const currentTVL = await defiLlama.getCurrentProtocolTVL('abc-pool');
// Returns: 9611050.44
```

### Chain Methods

#### Get All Chains
```typescript
const chains = await defiLlama.getChains();
// Returns array of chains with details like:
// [
//   {
//     name: 'Harmony',
//     chainId: 1666600000,
//     tvl: 1790390.10,
//     tokenSymbol: 'ONE'
//   }
//   // ... other chains
// ]
```

#### Get Historical Chain TVL with Analysis
```typescript
const ethereumTVL = await defiLlama.getHistoricalChainTVL('ethereum', true);
// Returns detailed analysis:
// {
//   chainAnalysis: {
//     overall: {
//       currentTVL: '$56.24B',
//       averageTVL: '$29.97B',
//       totalChange: '+13918890.65%'
//     },
//     yearlyAnalysis: [
//       {
//         year: 2023,
//         average: '$20.70B',
//         percentageChange: '+429.86%'
//       }
//       // ... other years
//     ]
//   }
// }
```

## API Reference

### Protocols

#### Get All Protocols
```typescript
const protocols = await defiLlama.getProtocols();
```

#### Get Protocol TVL
```typescript
// Get raw TVL data
const rawTVL = await defiLlama.getProtocolTVL('protocol-name');

// Get formatted TVL data with analysis
const formattedTVL = await defiLlama.getProtocolTVL('protocol-name', true);
```

#### Get Current Protocol TVL
```typescript
const currentTVL = await defiLlama.getCurrentProtocolTVL('protocol-name');
```

### Chains

#### Get All Chains
```typescript
const chains = await defiLlama.getChains();
```

#### Get Historical Chain TVL
```typescript
// Get raw historical TVL data
const rawChainTVL = await defiLlama.getHistoricalChainTVL('chain-name');

// Get formatted historical TVL data with analysis
const formattedChainTVL = await defiLlama.getHistoricalChainTVL('chain-name', true);
```

## Development

### Prerequisites

- Node.js >= 16.0.0
- npm

### Setup

1. Clone the repository:
```bash
git clone https://github.com/cfxdevkit/defillama.git
cd defillama
```

2. Install dependencies:
```bash
npm install
```

### Available Scripts

- `npm run build` - Build the library
- `npm run test` - Run tests
- `npm run lint` - Lint the code
- `npm run format` - Format the code
- `npm run docs` - Generate documentation
- `npm run example` - Run example usage script

### Running Examples

The library includes example usage in the `examples` directory. To run the examples:

```bash
npm run example
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Links

- [GitHub Repository](https://github.com/cfxdevkit/defillama)
- [Issue Tracker](https://github.com/cfxdevkit/defillama/issues)
- [Documentation](https://cfxdevkit.github.io/defillama)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [DeFi Llama](https://defillama.com/) for providing the API
