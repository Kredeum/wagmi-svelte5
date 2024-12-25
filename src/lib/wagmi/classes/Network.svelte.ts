import {
  type WatchBlockNumberReturnType,
  getBlockNumber as getBlockNumberWagmi,
  switchChain,
  watchBlockNumber as watchBlockNumberWagmi,
  disconnect as disconnectWagmi
} from "@wagmi/core";
import { Account, wagmi, wagmiConfig } from "@wagmi-svelte5/classes";
import * as chains from "viem/chains";
import type { Chain } from "viem/chains";
import { untrack } from "svelte";

let id = 0;

// Network Class, reactive on chainId
class Network {
  static findChain = (chainId: number | undefined): Chain | undefined =>
    chainId ? Object.values(chains).find((chain) => chain.id === chainId) : undefined;
  static getExplorer = (chainId: number) =>
    Network.findChain(chainId)?.blockExplorers?.default.url || "";

  static chainIdLocal = 31337 as const;

  #id = ++id;

  #chainId: number = $state(31337);
  chainIdDefault: number = Network.chainIdLocal;
  get chainId() {
    console.log("Network $effect getchainId ~ chainId:", this.#chainId);
    return this.#chainId;
  }
  get chain() {
    return (
      Network.findChain(this.chainId) || Network.findChain(this.chainIdDefault) || chains.mainnet
    );
  }
  set chain(chain: Chain) {
    this.#chainId = chain.id;
  }

  get explorer() {
    return Network.getExplorer(this.chainId);
  }
  get name() {
    return this.chain.name;
  }
  get nativeCurrency() {
    return this.chain.nativeCurrency;
  }

  blockNumber: number | undefined = $state();
  getBlockNumber = async () => {
    const blockNumber = Number(await getBlockNumberWagmi(wagmiConfig));

    if (this.blockNumber !== blockNumber) this.blockNumber = blockNumber;

    return blockNumber;
  };

  watchingBlockNumber = $state(false);
  unwatchBlockNumber: WatchBlockNumberReturnType | undefined;
  watchBlockNumber = () => {
    if (this.watchingBlockNumber) return;

    this.watchingBlockNumber = true;
    const stop = watchBlockNumberWagmi(wagmiConfig, {
      emitOnBegin: false,
      onBlockNumber: (blockNumber) => (this.blockNumber = Number(blockNumber))
    });

    this.unwatchBlockNumber = () => {
      this.watchingBlockNumber = false;
      stop?.();
    };
  };

  switch = async (chainId: number | undefined) => {
    if (!chainId) return;

    this.#chainId = chainId;

    if (chainId !== wagmi.chainId) await switchChain(wagmiConfig, { chainId });

    console.log("<Network switch", chainId, "=>", wagmi.chainId);
    this.getBlockNumber();
  };

  disconnect = async () => {
    await disconnectWagmi(wagmiConfig);
  };

  constructor(chainId?: number) {
    this.#chainId = chainId || this.chainIdDefault;

    const account = new Account();

    $effect(() => {
      if (!account.chainId) return;
      if (!Network.findChain(account.chainId)) return;

      untrack(() => {
        console.log(
          "Network $effect:",
          this.#id,
          this.chainId,
          "=>",
          account.chainId,
          wagmi.chainId
        );

        if (account.chainId == this.chainId) return;
        console.log("Network $effect switch:");
        this.switch(account.chainId);

        console.log(
          "Network $effect:",
          this.#id,
          this.chainId,
          "==",
          account.chainId,
          wagmi.chainId
        );
      });
    });

    // $inspect("BLOCKCHAIN", this.chainId, this.blockNumber);
  }
}

export { Network };
