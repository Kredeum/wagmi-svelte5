<script lang="ts">
  import { Counter } from "./Counter.svelte";

  const contract = new Counter();
</script>

<div class="p-4">
  <button class="btn btn-primary" onclick={() => contract.increment()}>
    {contract.isFetching ? "??" : contract.number}
  </button>
  <button class="btn btn-primary" onclick={() => contract.setNumber(42)}> Set to 42 </button>
</div>

<div class="p-4">
  <button class="btn btn-primary">
    3² = {contract.square(3)}
  </button>
</div>
