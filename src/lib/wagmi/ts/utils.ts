import { type Address, type Hex, isAddress as isAddressViem } from "viem";
import { generatePrivateKey } from "viem/accounts";
import { DEV } from "esm-env";

import { BURNER_WALLET_KEY } from "..";

// Address and ENS utilities
const isEns = (ensName: string | null | undefined) => {
  if (!ensName) return false;

  // Treat .eth string as potential ENS name
  return /.+\.eth/.test(ensName);
};

const isAddress = (address: Address | string | null | undefined): address is Address => {
  if (!address) return false;

  return isAddressViem(address as string);
};

const shorten0xString = (addr: `0x${string}`) => addr?.slice(0, 9) + "..." + addr?.slice(-5);

// JSON utilities
const replacer = (_key: string, value: unknown) =>
  typeof value === "bigint" ? value.toString() : value;

// Burner wallet utilities
const burnerLocalStorageKey = "wagmiSvelte5.burnerWallet.sk";
let currentSk: Hex = "0x";

const isValidSk = (pk: Hex | string | undefined | null): boolean => {
  return pk?.length === 64 || pk?.length === 66;
};

const generatedPrivateKey = generatePrivateKey();

const saveBurnerSK = (privateKey: Hex): void => {
  if (typeof window != "undefined" && window != null) {
    window?.localStorage?.setItem(burnerLocalStorageKey, privateKey);
  }
};

const loadBurnerSK = (): Hex => {
  if (isValidSk(currentSk)) return currentSk;

  const localStorageKey = (window?.localStorage
    ?.getItem?.(burnerLocalStorageKey)
    ?.replaceAll('"', "") ?? "0x") as Hex;

  const envStorageKey = ((DEV && BURNER_WALLET_KEY) || "0x") as Hex;

  currentSk = isValidSk(localStorageKey)
    ? localStorageKey
    : isValidSk(envStorageKey)
      ? envStorageKey
      : generatedPrivateKey;

  return currentSk;
};

export {
  // Address and ENS utilities
  isEns,
  isAddress,
  shorten0xString,
  // JSON utilities
  replacer,
  // Burner wallet utilities
  saveBurnerSK,
  loadBurnerSK
};
