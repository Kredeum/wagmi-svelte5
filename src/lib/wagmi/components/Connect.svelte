<script lang="ts">
  import { onMount } from "svelte";
  import { type Address } from "viem";
  import {
    connect,
    getConnections,
    getConnectors,
    type GetConnectorsReturnType
  } from "@wagmi/core";

  import {
    type Nullable,
    Network,
    wagmiConfig,
    BURNER_WALLET_ONLY_LOCAL,
    isDeploymentsChainId
  } from "..";

  type ConnectorType = GetConnectorsReturnType[number];

  let {
    chainId,
    address = $bindable()
  }: { chainId?: Nullable<number>; address?: Nullable<Address> } = $props();

  const network = new Network();

  let injected: string | undefined = $state();

  const connectors: GetConnectorsReturnType = $derived(getConnectors(wagmiConfig));
  const findConnector = (type: string) => {
    const connector = connectors.find((cnx) => cnx.type === type);

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

    console.info("connectWallet", connector.type);
    if (isActiveConnection(connector.type)) return;

    const parameters: { connector: ConnectorType; chainId?: number } = { connector };
    // if burner wallet, and onlyLocalBurnerWallet, switch to anvil
    if (connector.type === "burnerWallet") {
      parameters.chainId = BURNER_WALLET_ONLY_LOCAL
        ? Network.chainIdLocal
        : network.chainId || network.chainIdDefault;
    }
    const wallet = await connect(wagmiConfig, parameters);

    address = wallet.accounts[0];

    chainId = isDeploymentsChainId(chainId)
      ? chainId
      : isDeploymentsChainId(wallet.chainId)
        ? wallet.chainId
        : network.chainIdDefault;

    if (chainId && chainId !== wallet.chainId) {
      // console.log("<Connect connectWallet ~ switch from", wallet.chainId, "to", chainId);

      network.switch(chainId);
    }
  };

  let modalDisplay = $state(false);

  // $inspect("<Connect", chainId, address);
</script>

<button id="connect-wallet" class="btn btn-primary btn-sm" onclick={() => (modalDisplay = true)}>
  Connect Wallet
</button>

{#if modalDisplay}
  <div
    id="connect-wallet-modal"
    class="fixed inset-0 z-50 flex items-start justify-center bg-black bg-opacity-60"
  >
    <div class="relative mt-20 flex flex-col items-center rounded-3xl bg-secondary px-8 pb-8 pt-4">
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
        {#if network.chainId === Network.chainIdLocal || !BURNER_WALLET_ONLY_LOCAL}
          {@render connectSnippet("burnerWallet")}
        {/if}
      </ul>
    </div>
  </div>
{/if}

{#snippet connectSnippet(type: string)}
  {@const { connector, slug, name } = findConnector(type)}
  {#if connector}
    <li class="align-center flex">
      <img src="/{slug}.svg" alt={name} class="mr-2 h-8 w-8" />
      <button
        id="connect-{slug.toLowerCase()}"
        class="btn-default btn btn-sm w-40"
        onclick={() => connectWallet(connector)}
      >
        {name}
      </button>
    </li>
  {/if}
{/snippet}
