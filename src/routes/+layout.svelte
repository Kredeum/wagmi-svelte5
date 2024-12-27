<script lang="ts">
  import type { Snippet } from "svelte";
  import { Account, Connect, Disconnect, wagmi, newWagmi } from "$lib/wagmi";
  import "../app.pcss";

  let { children }: { children: Snippet } = $props();

  newWagmi();

  const chains = wagmi.chains;
  console.log("chains:", chains);
  const account = new Account();

  const switchChain = (chainId: number) => {
    wagmi.switch(chainId);
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

        <Disconnect />

        {#each chains as chain (chain.id)}
          {#if chain.id !== account.chainId}
            <span class="px-1">
              <button class="btn-default btn btn-sm" onclick={() => switchChain(chain.id)}>
                {chain.name}
              </button>
            </span>
          {/if}
        {/each}
        <div class="p-2"></div>
      {:else}
        <Connect chainId={account.chainId} bind:address={account.address} />
      {/if}
    </div>

    <main class="relative flex flex-1 flex-col">{@render children()}</main>
  </div>
</div>
