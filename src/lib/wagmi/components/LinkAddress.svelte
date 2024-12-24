<script lang="ts">
  import { Link } from "$lib/wagmi/components";
  import { getChainId } from "@wagmi/core";
  import { Network, wagmi } from "../classes";

  const { address, description = "address" }: { address?: `0x${string}`; description?: string } = $props();

  const explorer = $derived(Network.getExplorer(wagmi.chainId));
  const href = $derived(address && explorer ? `${explorer}/address/${address}` : "");
</script>

<Link {href} {description} />
