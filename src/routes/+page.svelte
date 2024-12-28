<script lang="ts"></script>

{#snippet pageTest(pagePath: string, pageDescription: string)}
  <li><a class="text-blue-500 hover:underline" href={pagePath}>{pageDescription}</a></li>
{/snippet}

<ul class="list-disc space-y-2 pl-5">
  {@render pageTest("/quick/counter", "Read Counter")}
  {@render pageTest("/connect/counter", "Read/Write Counter")}
  {@render pageTest("/quick/notification", "Notifications")}
  {@render pageTest("/connect/deployments", "Deployments")}
</ul>
