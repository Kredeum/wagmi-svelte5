import { type Address, isAddress as isAddressViem } from "viem";

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

export { isEns, isAddress };
