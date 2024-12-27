import type { Address } from "viem";
import { SmartContract, isAddress } from "$lib/wagmi";

class Counter extends SmartContract {
  get number() {
    return this.call("number") as bigint;
  }
  increment = async () => {
    await this.sendAndWait("increment");
    await this.callAsync("number");
  };
  setNumber = async (num: number | bigint = 1n) => {
    await this.sendAndWait("setNumber", [num]);
    await this.callAsync("number");
  };
  square(num: number | bigint = 1n) {
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
