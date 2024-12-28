<script lang="ts">
  import "../app.pcss";
  import type { Snippet } from "svelte";
  import { Toaster } from "svelte-hot-french-toast";

  let { children }: { children: Snippet } = $props();
</script>

<Toaster />

<div class="flex min-h-screen flex-col">
  <div class="p-8">
    <h1 class="mb-6 text-2xl font-bold">
      <a href="/">Tests</a>
    </h1>

    {@render children()}
  </div>
</div>
