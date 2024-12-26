import { createClient } from "viem";
import * as allChains from "viem/chains";
import { type Chain, mainnet } from "viem/chains";
import {
  createConfig,
  getChainId,
  reconnect,
  watchChainId,
  type CreateConnectorFn
} from "@wagmi/core";
import { coinbaseWallet, injected, metaMask, walletConnect } from "@wagmi/connectors";

import { Network, createBurnerConnector, alchemyTransport, ALCHEMY_API_KEY, POLLING_INTERVAL, CHAINS, WALLET_CONNECT_PROJECT_ID } from "..";

const getChains = () => {
  const selectedChains: Chain[] = [];
  CHAINS.forEach(
    (chainName) =>
      chainName in allChains && selectedChains.push(allChains[chainName as keyof typeof allChains])
  );
  selectedChains.push(mainnet);
  console.log("selectedChains:", selectedChains);
  return selectedChains;
};

const chains = getChains() as [Chain, ...Chain[]];

const connectors = [
  injected(),
  metaMask(),
  walletConnect({
    projectId: WALLET_CONNECT_PROJECT_ID,
    showQrModal: true
  }),
  coinbaseWallet({
    appName: "Wagmi-Svelte-5",
    preference: "all"
  }),
  createBurnerConnector()
];

const wagmiConfig = createConfig({
  chains,
  connectors: connectors as CreateConnectorFn[],
  syncConnectedChain: true,
  client({ chain }) {
    const client = createClient({
      chain,
      transport: alchemyTransport(chain.id, ALCHEMY_API_KEY, "wss")
    });
    // console.log("WAGMI client created:", chain.id, client);

    if (chain.id === Network.chainIdLocal) client.pollingInterval = POLLING_INTERVAL;
    return client;
  }
});

class Wagmi extends Network {
  get chains() {
    return chains.slice(0, -1);
  }

  #chainId = $state<number>(getChainId(wagmiConfig));
  get chainId() {
    return this.#chainId;
  }
  watch = () =>
    watchChainId(wagmiConfig, {
      onChange: (chainId: number) => {
        console.log("watchChainId Change:", chainId);
        this.#chainId = chainId;
      }
    });

  recentConnectorId = $state();

  reconnect = async () => {
    this.recentConnectorId = await wagmiConfig.storage?.getItem("recentConnectorId");
    if (this.recentConnectorId) reconnect(wagmiConfig);
  };

  constructor() {
    super(getChainId(wagmiConfig));
    this.reconnect();
    this.watch();

    $inspect("WAGMI", this.#chainId);
  }
}

let wagmi: Wagmi;
const newWagmi = () => {
  wagmi ||= new Wagmi();
};

export { Wagmi, newWagmi, wagmi, wagmiConfig };
