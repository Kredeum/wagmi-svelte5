<script lang="ts">
  import { deployments, readDeploymentByName, wagmi } from "$lib/wagmi";

  console.log("DEPLOYMENTS", deployments);
</script>

<div class="p-4">
  Deployment <strong>Counter</strong>, address on chain #{wagmi.chainId} =
  {readDeploymentByName(wagmi.chainId, "Counter")?.address}
</div>

<div class="p-4">
  <details>
    <summary>All Deployments</summary>
    <pre>
      {JSON.stringify(deployments, null, 2)}
    </pre>
  </details>
</div>
