<script lang="ts">
  import { Events, replacer } from "..";

  const { contractName }: { contractName: string } = $props();

  const events = $derived(new Events(contractName));
</script>

<div class="flex w-full flex-col items-center p-4">
  <div class="flex max-w-6xl flex-col gap-3 p-4">
    <div class="mockup-code max-h-[900px] overflow-auto">
      {#each events.list as event, i (i)}
        <pre class="whitespace-pre-wrap break-words px-5">{JSON.stringify(event, replacer, 2)}</pre>
      {:else}
        <p class="p-14 text-2xl">No Events found on '{contractName}' !</p>
      {/each}
    </div>
  </div>
</div>
