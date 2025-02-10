# @cfxdevkit/defillama

A TypeScript library for interacting with the DeFi Llama API, providing easy access to DeFi protocol and chain TVL (Total Value Locked) data with optional analysis features.

[![npm version](https://img.shields.io/npm/v/@cfxdevkit/defillama)](https://www.npmjs.com/package/@cfxdevkit/defillama)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

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

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [DeFi Llama](https://defillama.com/) for providing the API
