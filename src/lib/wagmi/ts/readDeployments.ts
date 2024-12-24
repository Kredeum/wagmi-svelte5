import jsonDeployments from "$lib/deployments.json";
import { type Abi, type Address } from "viem";
import { isAddress } from "$lib/wagmi/ts";

type KeysOfUnion<ObjectType> = ObjectType extends unknown ? keyof ObjectType : never;

type DeploymentsChains = typeof jsonDeployments;
type DeploymentsChainIdString = keyof DeploymentsChains;
type DeploymentsChainIdStrict = DeploymentsChainIdString extends `${infer N extends number}` ? N : never;
type DeploymentsChainId = DeploymentsChainIdStrict | 1;
type DeploymentsChain = DeploymentsChains[DeploymentsChainIdStrict];
type DeploymentContractName = KeysOfUnion<DeploymentsChain>;
type DeploymentContractKey = keyof DeploymentsChain;

const isDeploymentsChainId = (chainId: string | number): boolean => String(chainId) in jsonDeployments;

const isDeploymentChainId = (chainId: DeploymentsChainId, contractName: DeploymentContractName): boolean =>
  isDeploymentsChainId(chainId) && contractName in readDeploymentsChain(chainId);

const readDeploymentsChain = (chainId: DeploymentsChainId): DeploymentsChain => {
  if (!isDeploymentsChainId(chainId)) throw new Error(`No Deployments for chainId ${chainId}!`);

  return jsonDeployments[String(chainId) as DeploymentsChainIdString];
};

type DeploymentType = { address: Address; abi: Abi; name?: string };

const readDeploymentContractsName = (chainId: DeploymentsChainId): DeploymentContractName[] => {
  const chainDeployment = readDeploymentsChain(chainId);

  return Object.keys(chainDeployment) as DeploymentContractName[];
};

const readDeploymentByAddress = (chainId: DeploymentsChainId, address: string): DeploymentType | undefined => {
  const deployments = readDeploymentsChain(chainId);

  const [name, dep] = Object.entries(deployments).find(([, dep]) => (dep as DeploymentType).address === address) || [];
  if (!(name && dep)) return;

  const deployment = dep as DeploymentType;
  deployment.name = name;
  return deployment;
};

const readDeploymentByName = (
  chainId: DeploymentsChainId,
  contractName: DeploymentContractName
): DeploymentType | undefined => {
  const chainDeployment = readDeploymentsChain(chainId);

  if (!(contractName in chainDeployment)) return;

  const deployment = chainDeployment[contractName as DeploymentContractKey] as DeploymentType;
  deployment.name = contractName;
  return deployment;
};

const readDeployment = (
  chainId: DeploymentsChainId,
  param: DeploymentContractName | Address
): DeploymentType | undefined => {
  if (!(chainId && param)) return;

  return isAddress(param)
    ? readDeploymentByAddress(chainId, param as Address)
    : readDeploymentByName(chainId, param as DeploymentContractName);
};

export {
  isDeploymentChainId,
  isDeploymentsChainId,
  readDeploymentContractsName,
  readDeploymentsChain,
  readDeploymentByAddress,
  readDeploymentByName,
  readDeployment
};
export type {
  DeploymentsChains,
  DeploymentsChainId,
  DeploymentsChain,
  DeploymentType,
  DeploymentContractName,
  DeploymentContractKey
};
