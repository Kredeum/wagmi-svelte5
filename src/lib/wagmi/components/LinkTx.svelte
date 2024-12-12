<script lang="ts">
  import { Link } from "$lib/wagmi/components";
  import { targetNetwork } from "$lib/scaffold-eth/classes";
  import { shorten0xString } from "$lib/scaffold-eth/ts";

  const {
    hash,
    description = shorten0xString(hash),
    message
  }: { hash: `0x${string}`; description?: string; message?: string } = $props();

  const href = $derived(hash && targetNetwork.explorer ? `${targetNetwork.explorer}/tx/${hash}` : "");
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
