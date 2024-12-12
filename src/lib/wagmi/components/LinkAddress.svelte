<script lang="ts">
  import { Link } from "$lib/wagmi/components";
  import { targetNetwork } from "$lib/scaffold-eth/classes";

  const { address, description = "address" }: { address?: `0x${string}`; description?: string } = $props();

  const href = $derived(address && targetNetwork.explorer ? `${targetNetwork.explorer}/address/${address}` : "");
</script>

<Link {href} {description} />
