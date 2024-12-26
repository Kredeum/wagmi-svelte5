import { POLLING_INTERVAL } from "@wagmi-svelte5";

class Watcher {
  id = $state(0);

  start = (fn: () => unknown, onStart = false) => {
    if (this.id) return;

    if (onStart) fn();

    this.id = setInterval(fn, POLLING_INTERVAL) as unknown as number;
    // console.info("WATCHER START", this.id);
  };
  stop = () => {
    if (!this.id) return;

    clearInterval(this.id);
    // console.info("WATCHER STOP", this.id);

    this.id = 0;
  };
  restart = (fn: () => unknown, onStart = false) => {
    this.stop();
    this.start(fn, onStart);
  };

  constructor(fn?: () => unknown) {
    if (fn) this.start(fn);

    // $inspect("WATCHER ", this.id);
  }
}

export { Watcher };
