import * as envir from "$env/static/public";
import { http, webSocket } from "viem";

const env = envir as Record<string, string>;

// redefine constants here or take them from environment
const CHAINS = (env.PUBLIC_CHAINS || "anvil,baseSepolia").split(",");
const POLLING_INTERVAL = Number(env.PUBLIC_POLLING_INTERVAL || 5000);
const ALCHEMY_API_KEY = String(env.PUBLIC_ALCHEMY_API_KEY || "");
const WALLET_CONNECT_PROJECT_ID = String(env.PUBLIC_WALLET_CONNECT_PROJECT_ID || "");
const BURNER_WALLET_ONLY_LOCAL = String(env.PUBLIC_BURNER_WALLET_ONLY_LOCAL || "");
const BURNER_WALLET_KEY = String(env.PUBLIC_BURNER_WALLET_KEY || "");

const RPC_ALCHEMY_NAMES: Record<number, string> = {
  1: "eth-mainnet",
  11155111: "eth-sepolia",
  17000: "eth-holesky",
  10: "opt-mainnet",
  11155420: "opt-sepolia",
  42161: "arb-mainnet",
  421614: "arb-sepolia",
  8453: "base-mainnet",
  84532: "base-sepolia",
  137: "polygon-mainnet",
  80002: "polygon-amoy"
};

const ALCHEMY_URL = (chainId: number, protocol: "https" | "wss" = "https") => {
  return RPC_ALCHEMY_NAMES[chainId]
    ? `${protocol}://${RPC_ALCHEMY_NAMES[chainId]}.g.alchemy.com/v2/${ALCHEMY_API_KEY}`
    : undefined;
};

const ALCHEMY_TRANSPORT = (chainId: number, protocol: "https" | "wss" = "https") => {
  const fnProtocol = protocol === "https" ? http : webSocket;
  return fnProtocol(ALCHEMY_URL(chainId, protocol));
};

export {
  CHAINS,
  POLLING_INTERVAL,
  ALCHEMY_API_KEY,
  WALLET_CONNECT_PROJECT_ID,
  BURNER_WALLET_ONLY_LOCAL,
  BURNER_WALLET_KEY,
  ALCHEMY_URL,
  ALCHEMY_TRANSPORT
};
