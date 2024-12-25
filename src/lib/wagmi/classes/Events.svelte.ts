import { type Address as AddressType, type ContractEventName, type Log } from "viem";

import { type DeploymentContractName } from "@wagmi-svelte5/ts";

import { SmartContract, wagmi, wagmiConfig } from "@wagmi-svelte5/classes";
import { getContractEvents, type LogWithArgs } from "@wagmi-svelte5/ts";
import { watchContractEvent, getBlockNumber } from "@wagmi/core";

type EventsFilter = { eventName?: ContractEventName; args?: Record<string, unknown> };
type EventsSortOrder = "DESC" | "ASC" | undefined;

class Events extends SmartContract {
  limit: number = $state(0);
  sort: EventsSortOrder = $state("DESC");
  filter: EventsFilter = $state({});
  raw: boolean = $state(true);

  // listAll is sorted from the oldest event (oldest block and oldest index inside block) to newest
  listAll = $state(<LogWithArgs[]>[]);

  // list is sorted with this.sort order then sliced and optionnaly mapped to only return the args
  list = $derived.by(() => {
    const list = (this.sort === "DESC" ? this.listAll.toReversed() : this.listAll).slice(
      0,
      this.limit
    );
    return this.raw ? list : list.map((event) => event.args);
  });

  get last() {
    return this.list[0];
  }
  get count() {
    return this.list.length;
  }
  get max() {
    return this.listAll.length;
  }

  refresher = 0;
  refresh = () => this.refresher++;

  watch = async () => {
    if (!(this.address && this.abi)) return;

    const params = { address: this.address, abi: this.abi, ...this.filter };
    // console.log("EVENTS watchContractEvent", params);

    try {
      watchContractEvent(wagmiConfig, {
        ...params,
        onLogs: (logs: Log[]) => {
          // console.log(`EVENTS watchContractEvent: ${logs.length} new log`);
          this.listAll.push(...(logs as unknown as LogWithArgs[]));
        }
      });
    } catch (error) {
      console.error("EVENTS Failed to watch logs:", error);
    }
  };

  fetch = async (watch = false) => {
    if (!(this.address && this.abi)) return;

    try {
      const toBlock = await getBlockNumber(wagmiConfig);
      // const maxBlock = 100_000n;
      const fromBlock = 0n; //toBlock > maxBlock ? toBlock - maxBlock : 0n;

      const params = { fromBlock, toBlock, address: this.address, abi: this.abi, ...this.filter };

      this.listAll = ((await getContractEvents(wagmiConfig, params)) as LogWithArgs[]).toSorted(
        (a, b) => {
          const blockDelta = (Number(a.blockNumber) || 0) - (Number(b.blockNumber) || 0);
          const indexDelta = (Number(a.transactionIndex) || 0) - (b.transactionIndex || 0);
          return blockDelta > 0 ? 1 : blockDelta < 0 ? -1 : indexDelta;
        }
      );
      console.log("EVENTS  fetch", this.listAll.length, params, $state.snapshot(this.listAll));
    } catch (error) {
      console.error("EVENTS Failed to fetch logs:", error);
    }

    if (watch) this.watch();
  };

  constructor(
    nameOrAddress: DeploymentContractName | AddressType,
    {
      filter = {},
      limit = 3,
      sort = "DESC",
      watch = true,
      raw = true
    }: {
      filter?: EventsFilter;
      limit?: number;
      sort?: EventsSortOrder;
      watch?: boolean;
      raw?: boolean;
    } = {}
  ) {
    super(nameOrAddress);

    this.filter = filter;
    this.limit = limit;
    this.sort = sort;
    this.raw = raw;

    $effect(() => {
      wagmi.chainId;
      console.log("EVENTS $effect ~ chainId :", wagmi.chainId);
      this.fetch(watch);
    });

    // $inspect("list", list);
  }
}

export { Events };
export type { EventsFilter, EventsSortOrder };
