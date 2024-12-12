<script lang="ts">
	import { onMount } from 'svelte';
	import { type Address } from 'viem';
	import { connect, getConnectors, switchChain, type GetConnectorsReturnType } from '@wagmi/core';

	import wagmiConfig5 from '$lib/wagmi/config';
	import { wagmiConfig } from '$lib/wagmi/classes';
	import { targetNetwork, type TargetNetworkId } from '$lib/scaffold-eth/classes';
	import { anvil } from 'viem/chains';

	type ConnectorType = GetConnectorsReturnType[number];

	let { chainId = $bindable(), address = $bindable() }: { chainId?: number; address?: Address } =
		$props();

	let injected: string | undefined = $state();

	const connectors: GetConnectorsReturnType = $derived(getConnectors(wagmiConfig));
	const findConnector = (type: string) => {
		const connector = connectors.find((c) => c.type === type);

		const typeInjected = type === 'injected';
		const slug = typeInjected ? injected : connector?.type;
		if (!slug) return {};

		let name = `${slug.charAt(0).toUpperCase()}${slug.slice(1)}${typeInjected ? 'Wallet' : ''}`;
		name = name.replace('Wallet', ' Wallet').trim();

		return { connector, slug, name };
	};

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
		console.info('<Connect injected wallet:', injected);
	});

	const connectWallet = async (connector: ConnectorType) => {
		if (!wagmiConfig) return;
		modalDisplay = false;

		address = undefined;

		const parameters: { connector: ConnectorType; chainId?: TargetNetworkId } = { connector };
		// if burner wallet, and onlyLocalBurnerWallet, switch to anvil
		if (connector.type === 'burnerWallet') {
			parameters.chainId = wagmiConfig5.onlyLocalBurnerWallet
				? targetNetwork.idLocal
				: targetNetwork.id || targetNetwork.idDefault;
		}
		const wallet = await connect(wagmiConfig, parameters);

		address = wallet.accounts[0];

		if (!wagmiConfig5.targetNetworks.find((nw) => nw.id === wallet.chainId)) {
			console.log('<Connect connectWallet ~ switch to default Chain:', targetNetwork.idDefault);
			switchChain(wagmiConfig, { chainId: targetNetwork.idDefault });
			chainId = targetNetwork.idDefault;
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
	<div class="fixed inset-0 z-50 flex items-start justify-center bg-black bg-opacity-60">
		<div class="bg-secondary relative mt-20 flex flex-col items-center rounded-3xl px-8 pb-8 pt-4">
			<h3 class="mb-6 text-xl font-bold">Connect Wallet</h3>
			<button
				class="btn btn-circle btn-ghost btn-sm absolute right-3 top-3 text-xl"
				onclick={() => (modalDisplay = false)}
			>
				&times;
			</button>
			<ul class="space-y-6 text-center">
				{#if injected}
					{@render connectSnippet('injected')}
					{@render connectSnippet('metaMask')}
				{/if}
				{@render connectSnippet('coinbaseWallet')}
				{@render connectSnippet('walletConnect')}
				{#if !wagmiConfig5.onlyLocalBurnerWallet || targetNetwork.id === anvil.id}
					{@render connectSnippet('burnerWallet')}
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
				class="btn btn-default btn-sm w-40"
				onclick={() => connectWallet(connector)}
			>
				{name}
			</button>
		</li>
	{/if}
{/snippet}
