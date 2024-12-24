import type {
  Abi,
  Address,
  BlockNumber,
  BlockTag,
  ContractEventName,
  GetContractEventsReturnType,
  GetContractEventsParameters as GetContractEventsParametersViem,
  ContractEventArgs
} from "viem";
import { getContractEvents as getContractEventsViem } from "viem/actions";

import type { Config } from "@wagmi/core";

type GetContractEventsParameters = {
  abi: Abi;
  address?: Address | Address[];
  eventName?: ContractEventName;
  args?: ContractEventArgs;
  fromBlock?: BlockNumber | BlockTag;
  toBlock?: BlockNumber | BlockTag;
};

// missing function in Wagmi ?!
const getContractEvents = async (
  config: Config,
  parameters: GetContractEventsParameters
): Promise<GetContractEventsReturnType> =>
  getContractEventsViem(config.getClient(), parameters as GetContractEventsParametersViem);

export { getContractEvents };
