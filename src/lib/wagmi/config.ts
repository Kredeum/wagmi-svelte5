import * as envir from "$env/static/public";

const env = envir as Record<string, string>;

// constants defined here or from environment
const CHAINS = (env.PUBLIC_CHAINS || "anvil,baseSepolia").split(",");
const ALCHEMY_API_KEY = String(env.PUBLIC_ALCHEMY_API_KEY || "");
const WALLET_CONNECT_PROJECT_ID = String(env.PUBLIC_WALLET_CONNECT_PROJECT_ID || "");

export { CHAINS, ALCHEMY_API_KEY, WALLET_CONNECT_PROJECT_ID };
