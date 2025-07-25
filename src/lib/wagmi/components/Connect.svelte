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
      <button class="close-btn" aria-label="Close modal" onclick={() => (modalDisplay = false)}>
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
        class="wallet-button"
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
    margin-top: 4rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 1.25rem;
    padding: 1rem 1rem 1rem 1rem;
    box-shadow:
      0 20px 25px -5px rgba(0, 0, 0, 0.1),
      0 10px 10px -5px rgba(0, 0, 0, 0.04);
    border: 1px solid #e5e7eb;
    max-width: 250px;
    width: 90vw;
  }

  .modal-title {
    font-size: 1.5rem;
    font-weight: 500;
    color: #111827;
    text-align: center;
    padding: 0.5rem 1rem ;
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }

  .close-btn {
    position: absolute;
    right: 0rem;
    top: 0rem;
    width: 3rem;
    height: 3rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: none;
    border: none;
    color: #6b7280;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .close-btn:hover {
    background-color: #f3f4f6;
    color: #374151;
  }

  .close-icon {
    width: 1.25rem;
    height: 1.25rem;
  }

  .wallet-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
  }

  .wallet-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    width: 220px;
  }

  .wallet-button {
    background-color: #f8fafc;
    color: #1e293b;
    border: 1px solid #e2e8f0;
    border-radius: 0.75rem;
    padding: 0.7rem 1rem;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    flex: 1;
    text-align: left;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  }

  .wallet-button:hover {
    background-color: #f1f5f9;
    border-color: #cbd5e1;
    transform: translateY(-1px);
    box-shadow:
      0 4px 6px -1px rgba(0, 0, 0, 0.1),
      0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }

  .wallet-button:active {
    transform: translateY(0);
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  }

  .wallet-icon {
    height: 2.5rem;
    width: 2.5rem;
    border-radius: 0.5rem;
    flex-shrink: 0;
  }
</style>
