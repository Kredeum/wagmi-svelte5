import { DEV } from "esm-env";
import type { Hex } from "viem";
import { generatePrivateKey } from "viem/accounts";

import { BURNER_WALLET_KEY } from "..";

const burnerLocalStorageKey = "wagmiSvelte5.burnerWallet.sk";
let currentSk: Hex = "0x";

/**
 * Checks if the private key is valid
 */
const isValidSk = (pk: Hex | string | undefined | null): boolean => {
  return pk?.length === 64 || pk?.length === 66;
};

/**
 * If no burner is found in localstorage or environment, generate a random private key
 */
const generatedPrivateKey = generatePrivateKey();

/**
 * Save the current burner private key to local storage
 */
export const saveBurnerSK = (privateKey: Hex): void => {
  if (typeof window != "undefined" && window != null) {
    window?.localStorage?.setItem(burnerLocalStorageKey, privateKey);
  }
};

/**
 * Gets the current burner private key from local storage
 */
export const loadBurnerSK = (): Hex => {
  if (isValidSk(currentSk)) return currentSk;

  // search for Key in local storage
  const localStorageKey = (window?.localStorage
    ?.getItem?.(burnerLocalStorageKey)
    ?.replaceAll('"', "") ?? "0x") as Hex;

  // search for Key in environnement (dev mode only)
  const envStorageKey = ((DEV && BURNER_WALLET_KEY) || "0x") as Hex;

  // set the current key to the first valid key found
  currentSk = isValidSk(localStorageKey)
    ? localStorageKey
    : isValidSk(envStorageKey)
      ? envStorageKey
      : generatedPrivateKey;

  // save the current key to local storage and return it
  if (DEV) saveBurnerSK(currentSk);
  return currentSk;
};
