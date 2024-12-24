<script lang="ts">
  import { Link } from "$lib/wagmi/components";
  import { shorten0xString } from "$lib/wagmi/ts";
  import { Network, wagmi } from "../classes";

  const {
    hash,
    description = shorten0xString(hash),
    message
  }: { hash: `0x${string}`; description?: string; message?: string } = $props();

  const explorer = $derived(Network.getExplorer(wagmi.chainId));
  const href = $derived(hash && explorer ? `${explorer}/tx/${hash}` : "");
</script>

{#if message}
  <div class="flex flex-col">
    <div>{message}</div>
    <div class="pl-1">
      <Link {href} {description} />
    </div>
  </div>
{:else}
  <Link {href} {description} />
{/if}
