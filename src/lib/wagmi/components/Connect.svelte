<script lang="ts">
  import { onMount } from "svelte";
  import { type Address } from "viem";
  import { connect, getConnections, getConnectors, type GetConnectorsReturnType } from "@wagmi/core";

  import { Network, wagmiConfig } from "$lib/wagmi/classes";
  import { BURNER_WALLET_ONLY_LOCAL } from "$lib/wagmi/config";
  import { isDeploymentsChainId, type DeploymentsChainId, type Nullable } from "../ts";

  type ConnectorType = GetConnectorsReturnType[number];

  let { chainId, address = $bindable() }: { chainId?: Nullable<number>; address?: Nullable<Address> } = $props();

  const network = new Network();

  let injected: string | undefined = $state();

  const connectors: GetConnectorsReturnType = $derived(getConnectors(wagmiConfig));
  const findConnector = (type: string) => {
    const connector = connectors.find((c) => c.type === type);

    const typeInjected = type === "injected";
    network.chainId;
    const slug = typeInjected ? injected : connector?.type;
    if (!slug) return {};

    let name = `${slug.charAt(0).toUpperCase()}${slug.slice(1)}${typeInjected ? "Wallet" : ""}`;
    name = name.replace("Wallet", " Wallet").trim();

    return { connector, slug, name };
  };
  const isActiveConnection = (type: string): boolean =>
    getConnections(wagmiConfig).some((cnx) => cnx.connector.type === type);

  onMount(() => {
    const provider = window.ethereum;
    // console.log("onMount ~ provider:", provider);
    if (provider) {
      // prettier-ignore
      injected =
        provider.isRabby ?       "rabby"
      : provider.isBraveWallet ? "brave"
      : provider.isTally?        "taho"
      : provider.isTrust ?       "trust"
      : provider.isFrame ?       "frame"
      :                          "injected";
    }
    console.info("<Connect injected wallet:", injected);
  });

  const connectWallet = async (connector: ConnectorType) => {
    modalDisplay = false;
    if (!wagmiConfig) return;

    console.log("connectWallet", connector.type);
    if (isActiveConnection(connector.type)) return;

    const parameters: { connector: ConnectorType; chainId?: number } = { connector };
    // if burner wallet, and onlyLocalBurnerWallet, switch to anvil
    if (connector.type === "burnerWallet") {
      parameters.chainId = BURNER_WALLET_ONLY_LOCAL ? Network.chainIdLocal : network.chainId || network.chainIdDefault;
    }
    const wallet = await connect(wagmiConfig, parameters);

    address = wallet.accounts[0];

    if (!isDeploymentsChainId(wallet.chainId)) {
      console.log("<Connect connectWallet ~ switch to default Chain:", network.chainIdDefault);
      network.switch(network.chainIdDefault);
      chainId = network.chainIdDefault;
    } else {
      chainId = wallet.chainId;
    }
  };

  let modalDisplay = $state(false);

  // $inspect("<Connect", chainId, address);
</script>

<button id="connect-wallet" class="btn btn-primary btn-sm" onclick={() => (modalDisplay = true)}>
  Connect Wallet
</button>

{#if modalDisplay}
  <div class="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-start">
    <div class="flex flex-col items-center bg-secondary px-8 pt-4 pb-8 rounded-3xl relative mt-20">
      <h3 class="mb-6 text-xl font-bold">Connect Wallet</h3>
      <button
        class="btn btn-circle btn-ghost btn-sm absolute right-3 top-3 text-xl"
        onclick={() => (modalDisplay = false)}
      >
        &times;
      </button>
      <ul class="space-y-6 text-center">
        {#if injected}
          {@render connectSnippet("injected")}
          {@render connectSnippet("metaMask")}
        {/if}
        {@render connectSnippet("coinbaseWallet")}
        {@render connectSnippet("walletConnect")}
        {#if !BURNER_WALLET_ONLY_LOCAL || network.chainId === Network.chainIdLocal}
          {@render connectSnippet("burnerWallet")}
        {/if}
      </ul>
    </div>
  </div>
{/if}

{#snippet connectSnippet(type: string)}
  {@const { connector, slug, name } = findConnector(type)}
  {#if connector}
    <li class="flex align-center">
      <img src="/{slug}.svg" alt={name} class="w-8 h-8 mr-2" />
      <button
        id="connect-{slug.toLowerCase()}"
        class="btn btn-default btn-sm w-40"
        onclick={() => connectWallet(connector)}
      >
        {name}
      </button>
    </li>
  {/if}
{/snippet}
