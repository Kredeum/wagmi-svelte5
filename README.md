# @kredeum/wagmi-svelte5

A Svelte 5 Web3 library based on Wagmi, providing seamless integration of Web3 functionality into your Svelte applications.

## Features

- 🔌 Built for Svelte 5
- 🌐 Web3 Integration
- 🔒 Wallet Connection Management
- ⛓️ Multi-chain Support
- 🎣 Reactive Web3 Hooks
- 🔄 Auto-refresh on Network Changes

## Installation

```bash
npm install @kredeum/wagmi-svelte5
# or
pnpm add @kredeum/wagmi-svelte5
# or
yarn add @kredeum/wagmi-svelte5
```

## Quick Start

```typescript
import { createConfig } from "@kredeum/wagmi-svelte5";

// Configure your Web3 settings
const config = createConfig({
  // Your configuration options here
});
```

## Usage

### Connect Wallet

```svelte
<script>
  import { connect } from "@kredeum/wagmi-svelte5";
</script>

<button on:click={connect}>Connect Wallet</button>
```

## Requirements

- Svelte 5.x
- Node.js 16+

## Development

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build package
pnpm build

# Run tests
pnpm test
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see the [LICENSE](LICENSE) file for details.

## Author

zapaz.eth <zapaz@kredeum.com> (http://labs.kredeum.com/)
