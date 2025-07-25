<script lang="ts">
  import { onMount } from "svelte";
  import { type Address } from "viem";
  import {
    connect,
    getConnections,
    getConnectors,
    type GetConnectorsReturnType
  } from "@wagmi/core";

  import { type Nullable, Network, wagmiConfig } from "..";

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
      parameters.chainId = network.chainId || network.chainIdDefault;
    }
    const wallet = await connect(wagmiConfig, parameters);

    address = wallet.accounts[0];

    chainId ||= wallet.chainId || network.chainIdDefault;

    if (chainId && chainId !== wallet.chainId) {
      // console.log("<Connect connectWallet ~ switch from", wallet.chainId, "to", chainId);

      network.switch(chainId);
    }
  };

  let modalDisplay = $state(false);

  // $inspect("<Connect", chainId, address);
</script>

<button id="connect-wallet" class="connect-btn" onclick={() => (modalDisplay = true)}>
  <svg class="connect-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
    ></path>
  </svg>
  Connect Wallet
</button>

{#if modalDisplay}
  <div id="connect-wallet-modal" class="modal-overlay">
    <div class="modal-content">
      <h3 class="modal-title">Connect Wallet</h3>
      <button class="close-btn" onclick={() => (modalDisplay = false)}>
        <svg class="close-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          ></path>
        </svg>
      </button>
      <ul class="wallet-list">
        {#if injected}
          {@render connectSnippet("injected")}
          {@render connectSnippet("metaMask")}
        {/if}
        {@render connectSnippet("coinbaseWallet")}
        {@render connectSnippet("walletConnect")}
      </ul>
    </div>
  </div>
{/if}

{#snippet connectSnippet(type: string)}
  {@const { connector, slug, name } = findConnector(type)}
  {#if connector}
    <li class="wallet-item">
      <img src="/{slug}.svg" alt={name} class="wallet-icon" />
      <button
        id="connect-{slug.toLowerCase()}"
        class="btn-default btn btn-sm wallet-button w-40"
        onclick={() => connectWallet(connector)}
      >
        {name}
      </button>
    </li>
  {/if}
{/snippet}

<style>
  .connect-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background-color: #3b82f6;
    color: white;
    font-size: 0.875rem;
    font-weight: 500;
    border-radius: 0.5rem;
    box-shadow:
      0 4px 6px -1px rgba(0, 0, 0, 0.1),
      0 2px 4px -1px rgba(0, 0, 0, 0.06);
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .connect-btn:hover {
    background-color: #2563eb;
    box-shadow:
      0 10px 15px -3px rgba(0, 0, 0, 0.1),
      0 4px 6px -2px rgba(0, 0, 0, 0.05);
    transform: scale(1.05);
  }

  .connect-btn:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.5);
  }

  .connect-icon {
    width: 1rem;
    height: 1rem;
  }

  .modal-overlay {
    position: fixed;
    inset: 0;
    z-index: 50;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.6);
  }

  .modal-content {
    background-color: white;
    position: relative;
    margin-top: 5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 1.5rem;
    padding: 1rem 2rem 2rem 2rem;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    border: 1px solid #374151;
  }

  .modal-title {
    margin-bottom: 1.5rem;
    font-size: 1.25rem;
    font-weight: bold;
    color: black;
  }

  .close-btn {
    position: absolute;
    right: 0.75rem;
    top: 0.75rem;
    width: 2rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: none;
    border: none;
    color: black;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .close-btn:hover {
    background-color: #374151;
    color: white;
  }

  .close-icon {
    width: 1.25rem;
    height: 1.25rem;
  }

  .wallet-list {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    text-align: center;
  }

  .wallet-item {
    display: flex;
    align-items: center;
  }

  .wallet-button {
    background-color: lightgrey;
    border-radius: 0.5rem;
    padding: 0.2rem 0.2rem;
    font-size: 0.875rem;
    font-weight: 600;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .wallet-icon {
    margin-right: 0.5rem;
    height: 2rem;
    width: 2rem;
  }
</style>
