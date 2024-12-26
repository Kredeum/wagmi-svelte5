<script lang="ts">
  import { Link } from "@wagmi-svelte5";
  import { Network, wagmi } from "@wagmi-svelte5";

  const { address, description = "address" }: { address?: `0x${string}`; description?: string } =
    $props();

  const explorer = $derived(Network.getExplorer(wagmi.chainId));
  const href = $derived(address && explorer ? `${explorer}/address/${address}` : "");
</script>

<Link {href} {description} />
