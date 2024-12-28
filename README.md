# @kredeum/wagmi-svelte5

A Svelte 5 Web3 library based on Wagmi, providing seamless integration of Web3 functionality into your Svelte applications.

## ✨ Features

- 🔌 Built for Svelte 5 with full TypeScript support
- 🌐 Web3 Integration using Wagmi core functionality
- 🔒 Secure Wallet Connection Management
- ⛓️ Multi-chain Support with Auto-detection
- 🎣 Reactive Web3 Hooks for Real-time Updates
- 🔄 Auto-refresh on Network Changes
- 📦 Simple and Intuitive API
- 🛠️ Type-safe Contract Interactions

## 📁 Repository Structure

This repository contains two main parts:

- 📦 The Svelte5 package code in `src/lib/wagmi`
- 🎮 A SvelteKit demo app with usage examples in `src/routes`

## 📦 Svelte5 Package

### 💻 Installation

Add this package to your Svelte5 project:

```bash
npm install @kredeum/wagmi-svelte5
# or
pnpm install @kredeum/wagmi-svelte5
# or
yarn add @kredeum/wagmi-svelte5
```

### 🚀 Quick Start

#### Simple Example

```svelte
<script lang="ts">
  import { newWagmi } from "@wagmi-svelte5";
  import { Counter } from "$lib/examples/Counter.svelte";

  newWagmi();
  const counter = new Counter();
</script>

{counter.number}² = {counter.square(counter.number)}
```

#### Using this Counter class Helper

```typescript
import { SmartContract } from "$lib/wagmi";

export class Counter extends SmartContract {
  get number() {
    return this.call("number") as bigint;
  }
  square(num: number | bigint) {
    return this.call("square", [num]) as bigint;
  }
  constructor() {
    super("Counter");
  }
}
```

#### Same example without Helper

```svelte
<script lang="ts">
  import { newWagmi, SmartContract } from "@wagmi-svelte5";

  newWagmi();
  const contract = new SmartContract("Counter");
  const num = $derived(contract.call("number"));
  const square = $derived(contract.call("square", [num]));
</script>

{num}² = {square}
```

#### 📄 Smart Contract Source

```solidity
// Counter.sol
contract Counter is ICounter {
    uint256 public number;

    function square(uint256 num) public pure override(ICounter) returns (uint256) {
        return num ** 2;
    }
    ...
}
```

Full Counter.sol code deployed on Base Sepolia testnet can be Viewed here:
🔍 [on BaseScan](https://sepolia.basescan.org/address/0xb1eC295A306436560C7A27616f51B5d76D6aDCa8#code)

## 🎮 SvelteKit Demo and Examples

The demo app in `src/routes` showcases various package features and usage patterns.

### 🛠️ Requirements

Your local machine needs:

- 📦 [Node.js](https://nodejs.org/) 20+
- 📦 [Pnpm](https://pnpm.io/) 9+

Optional but recommended:

- 🚀 [Turborepo](https://turbo.build/repo) 1.8+

### ⚡ Quick Setup

Get started with the examples:

```bash
# Clone the repository
git clone https://github.com/kredeum/wagmi-svelte5.git
cd wagmi-svelte5

# Install dependencies
pnpm install

# Run the demo app
turbo start
# or without Turborepo
pnpx turbo start
```

🌐 Your browser will open to http://localhost:5173 showing the `Tests` page

## 🤝 Contributing

We welcome contributions! Feel free to:

- 🐛 Report issues
- 💡 Suggest features
- 🔧 Submit pull requests

## 📄 License

MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

zapaz.eth <zapaz@kredeum.com> (http://labs.kredeum.com/)
