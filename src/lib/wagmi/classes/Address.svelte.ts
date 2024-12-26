import { type Address as AddressType, checksumAddress } from "viem";
import { deepEqual, getBalance as getBalanceWagmi, type GetBalanceReturnType } from "@wagmi/core";

import { isAddress, isEns } from "@wagmi-svelte5";
import type { Nullable } from "@wagmi-svelte5";
import { wagmi, wagmiConfig, Watcher } from "@wagmi-svelte5";
import { getEnsAddress, getEnsAvatar, getEnsName } from "@wagmi/core";
import { mainnet } from "viem/chains";
import { untrack } from "svelte";

class Address {
  watcher: Nullable<Watcher>;
  #address = $state<Nullable<AddressType>>();
  #balance = $state<Nullable<GetBalanceReturnType>>();
  #ensName = $state<string | undefined>();
  #ensAvatar = $state<string | undefined>();

  #watchBalance = false;
  #ens = false;

  #reset = () => {
    this.watcher?.stop();
    this.#address = null;
    this.#balance = null;
    this.#ensName = undefined;
    this.#ensAvatar = undefined;
  };

  #getAndWatchBalance = () => {
    this.getBalance();
    if (this.#watchBalance) {
      this.watcher ??= new Watcher();
      this.watcher.restart(this.getBalance);
    }
  };
  getBalance = async () => {
    if (!(this.address && isAddress(this.address))) return;

    const balance = await getBalanceWagmi(wagmiConfig, { address: this.address });
    if (!deepEqual($state.snapshot(this.#balance), balance)) this.#balance = balance;
  };

  #setAddressPlus = async (address: AddressType) => {
    this.#address = address;
    if (this.#ens) {
      const ensName = address
        ? ((await getEnsName(wagmiConfig, { chainId: mainnet.id, address })) as string)
        : undefined;
      this.#ensName = ensName;
      this.#ensAvatar = ensName
        ? ((await getEnsAvatar(wagmiConfig, { chainId: mainnet.id, name: ensName })) as string)
        : undefined;
    } else {
      this.#ensName = undefined;
      this.#ensAvatar = undefined;
    }
  };
  #setEnsNamePlus = async (ensName: string) => {
    this.#ensName = ensName;
    if (this.#ens) {
      this.#ensAvatar = (await getEnsAvatar(wagmiConfig, {
        chainId: mainnet.id,
        name: ensName
      })) as string;
      this.#address = await getEnsAddress(wagmiConfig, { chainId: mainnet.id, name: ensName });
    }
  };

  setAddressOrName = (addressOrName: Nullable<AddressType | string>) => {
    if (isAddress(addressOrName)) {
      this.address = addressOrName;
    } else if (isEns(addressOrName)) {
      this.ensName = addressOrName as string;
    } else {
      this.#reset();
    }
  };
  set address(addr: Nullable<AddressType>) {
    const checkSumAddr = isAddress(addr) ? checksumAddress(addr as AddressType) : addr;

    if (!isAddress(checkSumAddr)) this.#reset();

    this.getBalance();
    this.#setAddressPlus(checkSumAddr!);
  }
  set ensName(ensName: string) {
    if (this.#ensName === ensName) return;
    if (!isEns(ensName)) this.#reset();

    this.#setEnsNamePlus(ensName!);
  }

  get address(): Nullable<AddressType> {
    return this.#address;
  }
  get ensName(): string | undefined {
    return this.#ensName;
  }
  get ensAvatar(): string | undefined {
    return this.#ensAvatar;
  }
  get balance() {
    return this.#balance?.value;
  }
  get decimals() {
    return this.#balance?.decimals;
  }
  get symbol() {
    return this.#balance?.symbol;
  }

  constructor(
    addressOrName: Nullable<AddressType | string>,
    { watchBalance = false, ens = false } = {}
  ) {
    // console.log("<Address constructor", addressOrName);

    this.#watchBalance = watchBalance;
    this.#ens = ens;

    this.setAddressOrName(addressOrName);

    // restart on network or address change
    $effect(() => {
      if (!this.address) return;
      wagmi.chainId;

      untrack(() => this.#getAndWatchBalance());
    });

    // $inspect("<Address", this.address, this.ensName);
  }
}

export { Address };
