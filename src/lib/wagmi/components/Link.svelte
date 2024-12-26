<script lang="ts">
  const { href, description }: { href: string; description: string } = $props();
</script>

{#if href}
  <a {href} target={href.startsWith("https://") ? "_blank" : "_self"} class="text-md link block"
    >{description}</a
  >
{:else}
  {description}
{/if}
