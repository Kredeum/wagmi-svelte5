import { SmartContract } from "@wagmi-svelte5/classes";
import type { Address } from "viem";
import { isAddress } from "@wagmi-svelte5/ts";

class Counter extends SmartContract {
  get number() {
    return this.call("number") as bigint;
  }
  increment = async () => {
    await this.sendAndWait("increment");
    await this.callAsync("number");
  };
  setNumber = async (num: number) => {
    await this.sendAndWait("setNumber", [num]);
    await this.callAsync("number");
  };
  square(num: number) {
    return this.call("square", [num]) as bigint;
  }
  balanceOf(address: Address) {
    if (!isAddress(address)) return;

    const balance = this.call("balanceOf", [address]) as bigint;

    return balance;
  }

  constructor() {
    super("Counter");
  }
}

export { Counter };
