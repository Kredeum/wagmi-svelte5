<script lang="ts">
  import { replacer } from "$lib/wagmi/ts";
  import { Events } from "$lib/wagmi/classes";
  import type { DeploymentContractName } from "$lib/wagmi/ts";

  const { contractName }: { contractName: DeploymentContractName } = $props();

  const events = $derived(new Events(contractName));
</script>

<div class="flex flex-col w-full p-4 items-center">
  <div class="flex flex-col max-w-6xl gap-3 p-4">
    <div class="mockup-code max-h-[900px] overflow-auto">
      {#each events.list as event, i (i)}
        <pre class="whitespace-pre-wrap break-words px-5">{JSON.stringify(event, replacer, 2)}</pre>
      {:else}
        <p class="p-14 text-2xl">No Events found on '{contractName}' !</p>
      {/each}
    </div>
  </div>
</div>
