<script lang="ts">
  import { wagmi } from "..";
</script>

<button class="disconnect-btn" onclick={wagmi.disconnect}>
  <svg class="disconnect-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
    ></path>
  </svg>
  Disconnect
</button>

<style>
  .disconnect-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background-color: #3b82f6;
    color: white;
    font-size: 0.875rem;
    font-weight: 500;
    border-radius: 0.5rem;
    box-shadow:
      0 4px 6px -1px rgba(0, 0, 0, 0.1),
      0 2px 4px -1px rgba(0, 0, 0, 0.06);
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;
    transform: scale(1);
  }

  .disconnect-btn:hover {
    background-color: #2563eb;
    box-shadow:
      0 10px 15px -3px rgba(0, 0, 0, 0.1),
      0 4px 6px -2px rgba(0, 0, 0, 0.05);
    transform: scale(1.05);
  }

  .disconnect-btn:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.5);
  }

  .disconnect-icon {
    width: 1rem;
    height: 1rem;
  }
</style>
