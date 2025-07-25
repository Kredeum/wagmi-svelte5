import type { getAccount } from "@wagmi/core";

type Nullable<T> = T | null | undefined;

type AccountType = ReturnType<typeof getAccount>;

export type { Nullable, AccountType };
