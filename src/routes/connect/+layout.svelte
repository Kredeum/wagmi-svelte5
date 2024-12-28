<script lang="ts">
  import type { Snippet } from "svelte";
  import { Account, Connect, Disconnect, wagmi, newWagmi } from "$lib/wagmi";

  let { children }: { children: Snippet } = $props();

  newWagmi();

  const chains = wagmi.chains;
  const account = new Account();

  const switchChain = (chainId: number) => {
    wagmi.switch(chainId);
  };
</script>

<div>
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

{@render children()}
