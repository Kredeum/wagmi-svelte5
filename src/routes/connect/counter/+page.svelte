<script lang="ts">
  import { Counter } from "$lib/examples/Counter.svelte";

  const contract = new Counter();

  $inspect(contract.isFetching);
</script>

<div>
  <div class="my-4 w-44 rounded bg-blue-100 p-2 text-center shadow">
    {contract.isFetching
      ? "fetching..."
      : contract.sending
        ? "sending..."
        : contract.waiting
          ? "...waiting..."
          : contract.number === undefined
            ? "??"
            : "ok!"}
  </div>

  <button class="btn btn-primary" onclick={() => contract.increment()}> Increment </button>

  <div class="my-4 w-44 rounded bg-blue-100 p-2 text-center shadow">
    {contract.number}² = {contract.square(contract.number)}
  </div>
</div>
