import { createClient } from "viem";
import * as chains from "viem/chains";
import { type Chain, mainnet } from "viem/chains";
import { createConfig, getChainId, reconnect, watchChainId, type Config } from "@wagmi/core";
import { coinbaseWallet, injected, metaMask, walletConnect } from "@wagmi/connectors";
import { createBurnerConnector } from "@wagmi-svelte5/ts";
import { Network } from "@wagmi-svelte5/classes";
import {
  ALCHEMY_TRANSPORT,
  POLLING_INTERVAL,
  CHAINS,
  WALLET_CONNECT_PROJECT_ID
} from "@wagmi-svelte5/config";

class Wagmi {
  #connectors = [
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

  #getChains = () => {
    const selectedChains: Chain[] = [];
    CHAINS.forEach(
      (chainName) =>
        chainName in chains && selectedChains.push(chains[chainName as keyof typeof chains])
    );
    selectedChains.push(mainnet);
    return selectedChains;
  };

  #chains = this.#getChains() as [Chain, ...Chain[]];

  config = $state(
    createConfig({
      chains: this.#chains,
      connectors: this.#connectors,
      syncConnectedChain: true,
      client({ chain }) {
        const client = createClient({ chain, transport: ALCHEMY_TRANSPORT(chain.id, "wss") });
        // console.log("WAGMI client created:", chain.id, client);

        if (chain.id === Network.chainIdLocal) client.pollingInterval = POLLING_INTERVAL;
        return client;
      }
    })
  );

  #chainId = $state<number>(getChainId(this.config));
  get chainId() {
    return this.#chainId;
  }
  watch = () =>
    watchChainId(this.config, {
      onChange: (chainId: number) => {
        console.log("watchChainId Change:", chainId);
        this.#chainId = chainId;
      }
    });

  recentConnectorId = $state();

  reconnect = async () => {
    this.recentConnectorId = await this.config.storage?.getItem("recentConnectorId");
    if (this.recentConnectorId) reconnect(this.config);
  };

  constructor() {
    this.reconnect();
    this.watch();

    $inspect("WAGMI", this.#chainId);
  }
}

let wagmi: Wagmi;
let wagmiConfig: Config;
const newWagmi = () => {
  wagmi ||= new Wagmi();
  wagmiConfig = wagmi.config;
};

export { Wagmi, newWagmi, wagmi, wagmiConfig };
