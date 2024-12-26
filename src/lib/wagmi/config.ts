import * as envir from "$env/static/public";

const env = envir as Record<string, string>;

// constants defined here or from environment
const CHAINS = (env.PUBLIC_CHAINS || "anvil,baseSepolia").split(",");
const POLLING_INTERVAL = Number(env.PUBLIC_POLLING_INTERVAL || 5000);
const ALCHEMY_API_KEY = String(env.PUBLIC_ALCHEMY_API_KEY || "");
const WALLET_CONNECT_PROJECT_ID = String(env.PUBLIC_WALLET_CONNECT_PROJECT_ID || "");
const BURNER_WALLET_ONLY_LOCAL = String(env.PUBLIC_BURNER_WALLET_ONLY_LOCAL || "");
const BURNER_WALLET_KEY = String(env.PUBLIC_BURNER_WALLET_KEY || "");

export {
  CHAINS,
  POLLING_INTERVAL,
  ALCHEMY_API_KEY,
  WALLET_CONNECT_PROJECT_ID,
  BURNER_WALLET_ONLY_LOCAL,
  BURNER_WALLET_KEY
};
