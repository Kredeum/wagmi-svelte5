<script lang="ts"></script>

{#snippet pageTest(pageName: string)}
  <li><a class="text-blue-500 hover:underline" href="/{pageName}">{pageName}</a></li>
{/snippet}

<ul class="list-disc pl-5 space-y-2">
  {@render pageTest("counter")}
</ul>
