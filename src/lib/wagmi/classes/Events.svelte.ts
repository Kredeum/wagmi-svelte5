import {
  type Address as AddressType,
  type ContractEventArgs,
  type ContractEventName,
  type GetContractEventsParameters,
  type Log
} from "viem";

import { type DeploymentContractName } from "@onchain-ai/common";

import { SmartContract, wagmiConfig } from "$lib/wagmi/classes";
import { getContractEvents, type LogWithArgs } from "$lib/wagmi/ts";
import { watchContractEvent, getBlockNumber } from "@wagmi/core";

type EventsFilter = { eventName?: ContractEventName; args?: Record<string, unknown> };
type EventsSortOrder = "DESC" | "ASC" | undefined;

class Events extends SmartContract {
  limit: number = 0;
  sort: EventsSortOrder = undefined;
  filter: EventsFilter;
  watching: boolean;
  raw: boolean;

  #listAll = $state<LogWithArgs[]>([]);
  list = $state<LogWithArgs[] | unknown[]>([]);

  setList = () => {
    const list = (this.sort === "DESC" ? this.#listAll.reverse() : this.#listAll).slice(0, this.limit);
    this.list = this.raw ? list : list.map((event) => event.args);
  };

  get last() {
    console.log("get last");
    return this.list[0];
  }
  get count() {
    console.log("get count");
    return this.list.length;
  }
  get max() {
    console.log("get max");
    return this.#listAll.length;
  }

  refresher = 0;
  refresh = () => this.refresher++;

  watch = async () => {
    if (!(this.address && this.abi)) return;

    const params = { address: this.address, abi: this.abi, ...this.filter };
    console.log("watchLogs", params);

    try {
      watchContractEvent(wagmiConfig, {
        ...params,
        onLogs: (logs: Log[]) => {
          console.log(`watchLogs: ${logs.length} new log`);
          this.#listAll.push(...(logs as unknown as LogWithArgs[]));
          this.setList();
        }
      });
    } catch (error) {
      console.error("Failed to watch logs:", error);
    }
  };

  fetch = async () => {
    if (!(this.address && this.abi)) return;

    try {
      const toBlock = await getBlockNumber(wagmiConfig);
      const maxBlock = 100_000n;
      const fromBlock = toBlock > maxBlock ? toBlock - maxBlock : 0n;

      const params = { fromBlock, toBlock, address: this.address, abi: this.abi, ...this.filter };

      this.#listAll = ((await getContractEvents(wagmiConfig, params)) as LogWithArgs[]).sort((a, b) => {
        const blockDelta = (Number(a.blockNumber) || 0) - (Number(b.blockNumber) || 0);
        const indexDelta = (Number(a.transactionIndex) || 0) - (b.transactionIndex || 0);
        return blockDelta > 0 ? 1 : blockDelta < 0 ? -1 : indexDelta;
      });
      console.log("Events fetch", this.#listAll.length, params, $state.snapshot(this.#listAll));
    } catch (error) {
      console.error("Failed to fetch logs:", error);
    }
    this.setList();

    if (this.watching) this.watch();
  };

  constructor(
    nameOrAddress: DeploymentContractName | AddressType,
    {
      filter = {},
      limit = 3,
      sort = "DESC",
      watch = true,
      raw = true
    }: { filter?: EventsFilter; limit?: number; sort?: EventsSortOrder; watch?: boolean; raw?: boolean } = {}
  ) {
    super(nameOrAddress);

    this.filter = filter;
    this.limit = limit;
    this.sort = sort;
    this.watching = watch;
    this.raw = raw;

    this.fetch();

    // $inspect("list", list);
  }
}

export { Events };
export type { EventsFilter, EventsSortOrder };
