// Web Worker — handles countdown with timestamp-diff correction
// so ticks stay accurate even when the browser throttles background tabs.

let intervalId: ReturnType<typeof setInterval> | null = null;
let remaining = 0;   // seconds left
let targetEnd = 0;   // epoch ms when timer should hit 0
let paused = false;

function clearTick() {
  if (intervalId !== null) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

function startTick() {
  clearTick();
  targetEnd = Date.now() + remaining * 1000;

  intervalId = setInterval(() => {
    const now = Date.now();
    remaining = Math.max(0, Math.round((targetEnd - now) / 1000));

    if (remaining <= 0) {
      clearTick();
      self.postMessage({ type: 'COMPLETE' });
    } else {
      self.postMessage({ type: 'TICK', remaining });
    }
  }, 1000);
}

self.onmessage = (e: MessageEvent) => {
  const msg = e.data;

  switch (msg.type) {
    case 'START':
      remaining = msg.duration;
      paused = false;
      self.postMessage({ type: 'TICK', remaining });
      startTick();
      break;

    case 'PAUSE':
      if (!paused) {
        paused = true;
        clearTick();
        // remaining already holds the correct value from last tick calc
      }
      break;

    case 'RESUME':
      if (paused) {
        paused = false;
        startTick();
      }
      break;

    case 'RESET':
      paused = false;
      remaining = 0;
      clearTick();
      self.postMessage({ type: 'RESET_ACK' });
      break;
  }
};
