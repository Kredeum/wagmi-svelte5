import { type Address, isAddress as isAddressViem } from "viem";

const isEns = (ensName: string | null | undefined) => {
  if (!ensName) return false;

  // Treat .eth string as potential ENS name
  return /.+\.eth/.test(ensName);
};

const isAddress = (address: Address | string | null | undefined): address is Address => {
  if (!address) return false;

  return isAddressViem(address as string);
};

const shorten0xString = (addr: `0x${string}`) => addr?.slice(0, 8) + "..." + addr?.slice(-6);

// To be used in JSON.stringify when a field might be bigint
// https://wagmi.sh/react/faq#bigint-serialization
const replacer = (_key: string, value: unknown) =>
  typeof value === "bigint" ? value.toString() : value;

export { isEns, isAddress, shorten0xString, replacer };
