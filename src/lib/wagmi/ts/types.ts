import type { Address, ContractEventName, Log } from "viem";
import type { getAccount } from "@wagmi/core";

type Nullable<T> = T | null | undefined;

type LogWithArgs = Log & { args: []; index: number };

type LogsParamsType = {
  address: Address;
  abi: unknown;
  eventName?: string;
  args?: unknown[];
};

type AccountType = ReturnType<typeof getAccount>;

type EventsFilter = { 
  eventName?: ContractEventName; 
  args?: Record<string, unknown> 
};

type EventsSortOrder = "DESC" | "ASC" | undefined;

export type { 
  Nullable, 
  LogWithArgs, 
  LogsParamsType,
  AccountType,
  EventsFilter,
  EventsSortOrder 
};