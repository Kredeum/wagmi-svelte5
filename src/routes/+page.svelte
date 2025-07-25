<script lang="ts">
  import "../app.pcss";
  import { Account, Connect, Disconnect, newWagmi } from "$lib/wagmi";

  newWagmi();

  const account = new Account();
</script>

<main class="main">
  {#if account.address}
    {account.address} ({account.chainId})

    <Disconnect />
  {:else}
    <Connect chainId={account.chainId} bind:address={account.address} />
  {/if}
</main>

<style lang="pcss">
  .main {
    padding: 2rem;
  }
</style>
