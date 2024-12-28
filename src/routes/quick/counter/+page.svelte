<script lang="ts">
  import { newWagmi, SmartContract } from "@wagmi-svelte5";
  import { Counter } from "$lib/examples/Counter.svelte";

  newWagmi();

  // Using Counter class Helper
  const counter = new Counter();

  // Using SmartContract class
  const contract = new SmartContract("Counter");
  const num = $derived(contract.call("number"));
  const square = $derived(contract.call("square", [num || 0n]));
</script>

<div class="py-4">
  Using Counter class Helper
  <div class="my-4 w-44 rounded bg-blue-100 p-2 text-center shadow">
    {counter.number}² = {counter.square(counter.number)}
  </div>
</div>

<div class="py-4">
  Using SmartContract class
  <div class="my-4 w-44 rounded bg-blue-100 p-2 text-center shadow">
    {num}² = {square}
  </div>
</div>
