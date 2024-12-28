<script lang="ts">
  import { notification } from "@wagmi-svelte5";
</script>

<div>
  <h2 class="mb-4 text-xl font-semibold text-gray-800">Notifications</h2>
  <button class="btn btn-primary" onclick={() => notification.info("Info Notification!")}
    >Info</button
  >
  <button class="btn btn-primary" onclick={() => notification.success("Success Notification!")}
    >Success</button
  >
  <button class="btn btn-primary" onclick={() => notification.error("Error Notification!")}
    >Error</button
  >
  <button class="btn btn-primary" onclick={() => notification.warning("Warning Notification!")}
    >Warning</button
  >
  <button class="btn btn-primary" onclick={() => notification.loading("Loading Notification!")}
    >Loading</button
  >
  <button class="btn btn-primary" onclick={() => notification.remove()}>X</button>
</div>
