import * as env from '$env/static/public';
import * as chains from 'viem/chains';

export type ScaffoldConfig = {
	targetNetworks: readonly chains.Chain[];
	pollingInterval: number;
	alchemyApiKey: string;
	walletConnectProjectId: string;
	onlyLocalBurnerWallet: boolean;
	burnetWalletKey: string;
};

const { PUBLIC_ALCHEMY_API_KEY, PUBLIC_WALLET_CONNECT_PROJECT_ID, PUBLIC_BURNER_WALLET_KEY } =
	env as {
		PUBLIC_ALCHEMY_API_KEY?: string;
		PUBLIC_WALLET_CONNECT_PROJECT_ID?: string;
		PUBLIC_BURNER_WALLET_KEY?: string;
	};

const scaffoldConfig = {
	// The networks on which your DApp is live
	targetNetworks: [chains.base, chains.baseSepolia, chains.optimismSepolia, chains.anvil],

	// The interval at which your front-end polls the RPC servers for new data
	// it has no effect if you only target the local network (default is 4000)
	pollingInterval: 4000,

	// This is ours Alchemy's default API key.
	// You can get your own at https://dashboard.alchemyapi.io
	// It's recommended to store it in an env variable:
	// .env.local for local testing, and in the Vercel/system env config for live apps.
	alchemyApiKey: PUBLIC_ALCHEMY_API_KEY || '',

	// This is ours WalletConnect's default project ID.
	// You can get your own at https://cloud.walletconnect.com
	// It's recommended to store it in an env variable:
	// .env.local for local testing, and in the Vercel/system env config for live apps.
	walletConnectProjectId: PUBLIC_WALLET_CONNECT_PROJECT_ID || '',

	// Only show the Burner Wallet when running on local network
	onlyLocalBurnerWallet: false,

	burnetWalletKey: PUBLIC_BURNER_WALLET_KEY || ''
} as const satisfies ScaffoldConfig;

export default scaffoldConfig;
