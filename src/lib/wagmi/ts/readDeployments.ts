import { type Abi, type Address } from "viem";
import { isAddress, type Nullable } from "@wagmi-svelte5";

type DeploymentContract = { address: Address; abi: Abi; name?: string };
type DeploymentsChain = {
  [contractName: string]: DeploymentContract;
};
type DeploymentsChains = {
  [chainId: `${number}`]: DeploymentsChain;
};

declare const __DEPLOYMENTS_JSON__: DeploymentsChains;
const deployments = __DEPLOYMENTS_JSON__;

const isDeploymentsChainId = (chainId: Nullable<string | number>): boolean =>
  Boolean(chainId) && String(chainId) in deployments;

const isDeploymentChainId = (chainId: number, contractName: string): boolean =>
  isDeploymentsChainId(chainId) && contractName in readDeploymentsChain(chainId);

const readDeploymentsChain = (chainId: number): DeploymentsChain => {
  if (!isDeploymentsChainId(chainId)) throw new Error(`No Deployments for chainId ${chainId}!`);

  return deployments[String(chainId) as keyof DeploymentsChains];
};

const readDeploymentContractsName = (chainId: number): string[] => {
  const chainDeployment = readDeploymentsChain(chainId);

  return Object.keys(chainDeployment) as string[];
};

const readDeploymentByAddress = (
  chainId: number,
  address: string
): DeploymentContract | undefined => {
  const deployments = readDeploymentsChain(chainId);

  const [name, dep] =
    Object.entries(deployments).find(
      ([, dep]) => (dep as DeploymentContract).address === address
    ) || [];
  if (!(name && dep)) return;

  const deployment = dep as DeploymentContract;
  deployment.name = name;
  return deployment;
};

const readDeploymentByName = (
  chainId: number,
  contractName: string
): DeploymentContract | undefined => {
  const chainDeployment = readDeploymentsChain(chainId);

  if (!(contractName in chainDeployment)) return;

  const deployment = chainDeployment[contractName] as DeploymentContract;
  deployment.name = contractName;
  return deployment;
};

const readDeployment = (
  chainId: number,
  param: string | Address
): DeploymentContract | undefined => {
  if (!(chainId && param)) return;

  return isAddress(param)
    ? readDeploymentByAddress(chainId, param as Address)
    : readDeploymentByName(chainId, param as string);
};

export {
  deployments,
  isDeploymentChainId,
  isDeploymentsChainId,
  readDeploymentContractsName,
  readDeploymentsChain,
  readDeploymentByAddress,
  readDeploymentByName,
  readDeployment
};
export type { DeploymentsChains, DeploymentsChain, DeploymentContract };
