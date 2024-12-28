import { SmartContract } from "$lib/wagmi";

class Counter extends SmartContract {
  get number() {
    return this.call("number") as bigint;
  }
  increment = async () => {
    await this.sendAndWait("increment");
    await this.callAsync("number");
  };
  square(num: number | bigint) {
    return this.call("square", [num || 0n]) as bigint;
  }

  constructor() {
    super("Counter");
  }
}

export { Counter };
