<script lang="ts">
  import { notification } from "@wagmi-svelte5";
</script>

<div class="p-4">
  <button class="btn btn-primary" onclick={() => notification.info("Notification!")}>
    Notif
  </button>
</div>
