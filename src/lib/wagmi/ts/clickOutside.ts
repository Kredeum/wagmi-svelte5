// clickOutside.ts
export function clickOutside(node: HTMLElement, handler: () => void): { destroy: () => void } {
  const handleClick = (event: MouseEvent) => {
    if (node && !node.contains(event.target as Node)) {
      handler();
    }
  };

  document.addEventListener("mousedown", handleClick, true);

  return {
    destroy() {
      document.removeEventListener("mousedown", handleClick, true);
    }
  };
}
