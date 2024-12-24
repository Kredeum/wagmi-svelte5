<script lang="ts">
	import type { Snippet } from 'svelte';
	import { Connect } from '$lib/wagmi/components';
	import { Account, newWagmi, wagmi } from '$lib/wagmi/classes';
	import '../app.pcss';
	import { anvil, baseSepolia } from 'viem/chains';

	let { children }: { children: Snippet } = $props();

	const chains = [anvil];

	newWagmi();

	const account = new Account();

	const disconnect = () => {
		console.log('disconnect');
	};
	const switchChain = (chainId: number) => {
		console.log('switch', chainId);
	};
</script>

<div class="flex min-h-screen flex-col">
	<div class="p-8">
		<h1 class="mb-6 text-2xl font-bold">
			<a href="/">Tests</a>
		</h1>

		<div class="pb-8">
			{#if account.address}
				{account.address} ({account.chainId})

				<button class="btn btn-primary btn-sm" onclick={() => disconnect()}>Disconnect</button>

				{#each chains as chain (chain.id)}
					<span class="px-1">
						<button class="btn btn-default btn-sm" onclick={() => switchChain(chain.id)}>
							{chain.name}
						</button>
					</span>
				{/each}
				<div class="p-2"></div>
			{:else}
				<Connect chainId={account.chainId} bind:address={account.address} />
			{/if}
		</div>

		<main class="relative flex flex-1 flex-col">{@render children()}</main>
	</div>
</div>
