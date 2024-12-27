import { vi } from 'vitest'
import { Window } from 'happy-dom'

// Setup global environment
Object.defineProperty(globalThis, 'window', { value: new Window() })

// Mock deployments JSON if not already defined
if (!('__DEPLOYMENTS_JSON__' in globalThis)) {
  Object.defineProperty(globalThis, '__DEPLOYMENTS_JSON__', {
    value: {
      '31337': {
        name: 'Anvil',
        chainId: '31337',
        contracts: {}
      },
      '84532': {
        name: 'Base Sepolia',
        chainId: '84532',
        contracts: {}
      }
    },
    configurable: true
  })
}

// Mock SvelteKit's $env/static/public module
vi.mock('$env/static/public', () => ({
  PUBLIC_CHAINS: 'anvil,baseSepolia',
  PUBLIC_POLLING_INTERVAL: '5000',
  PUBLIC_ALCHEMY_API_KEY: 'test-key',
  PUBLIC_WALLET_CONNECT_PROJECT_ID: 'test-project-id',
  PUBLIC_BURNER_WALLET_ONLY_LOCAL: 'true',
  PUBLIC_BURNER_WALLET_KEY: 'test-key'
}))
