import { http, webSocket } from "viem";

const alchemyNames: Record<number, string> = {
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

const alchemyUrl = (chainId: number, alchemykey: string, protocol: "https" | "wss" = "https") => {
  return alchemyNames[chainId]
    ? `${protocol}://${alchemyNames[chainId]}.g.alchemy.com/v2/${alchemykey}`
    : undefined;
};

const alchemyTransport = (
  chainId: number,
  alchemykey: string,
  protocol: "https" | "wss" = "https"
) => {
  const fnProtocol = protocol === "https" ? http : webSocket;
  return fnProtocol(alchemyUrl(chainId, alchemykey, protocol));
};

export { alchemyNames, alchemyUrl, alchemyTransport };
