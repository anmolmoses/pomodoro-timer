/**
 * Timer Web Worker
 *
 * Runs countdown logic in a separate thread so it stays accurate
 * even when the main thread is busy or the tab is in the background.
 *
 * Uses timestamp-diff correction instead of naively trusting setInterval.
 */

let intervalId: ReturnType<typeof setInterval> | null = null;
let remaining = 0;
let targetEnd = 0; // epoch ms when timer should hit 0
let paused = false;
let pausedRemaining = 0;

function stopInterval() {
  if (intervalId !== null) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

function tick() {
  if (paused) return;

  const now = Date.now();
  remaining = Math.round((targetEnd - now) / 1000);

  if (remaining <= 0) {
    remaining = 0;
    stopInterval();
    const msg: { type: 'TICK'; remaining: number } = { type: 'TICK', remaining: 0 };
    self.postMessage(msg);
    const complete: { type: 'COMPLETE' } = { type: 'COMPLETE' };
    self.postMessage(complete);
    return;
  }

  const msg: { type: 'TICK'; remaining: number } = { type: 'TICK', remaining };
  self.postMessage(msg);
}

self.onmessage = (e: MessageEvent) => {
  const data = e.data;

  switch (data.type) {
    case 'START': {
      stopInterval();
      remaining = data.duration; // seconds
      targetEnd = Date.now() + remaining * 1000;
      paused = false;

      // Send initial tick immediately
      const msg: { type: 'TICK'; remaining: number } = { type: 'TICK', remaining };
      self.postMessage(msg);

      intervalId = setInterval(tick, 1000);
      break;
    }

    case 'PAUSE': {
      if (!paused && intervalId !== null) {
        paused = true;
        pausedRemaining = Math.max(0, Math.round((targetEnd - Date.now()) / 1000));
        stopInterval();
      }
      break;
    }

    case 'RESUME': {
      if (paused) {
        paused = false;
        remaining = pausedRemaining;
        targetEnd = Date.now() + remaining * 1000;
        intervalId = setInterval(tick, 1000);
      }
      break;
    }

    case 'RESET': {
      stopInterval();
      paused = false;
      remaining = 0;
      break;
    }
  }
};

// TypeScript: mark as module
export {};
