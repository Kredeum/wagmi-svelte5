import type { Address, Log } from "viem";

export type Nullable<T> = T | null | undefined;

export type LogWithArgs = Log & { args: []; index: number };

export type LogsParamsType = {
  address: Address;
  abi: unknown;
  eventName?: string;
  args?: unknown[];
};
