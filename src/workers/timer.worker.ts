/// <reference lib="webworker" />

import type { WorkerInMessage, WorkerOutMessage } from '../types/timer';

let intervalId: ReturnType<typeof setInterval> | null = null;
let remaining = 0;
let lastTimestamp = 0;

function post(msg: WorkerOutMessage) {
  self.postMessage(msg);
}

function stopInterval() {
  if (intervalId !== null) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

function startCounting() {
  lastTimestamp = Date.now();

  // Post an immediate tick so the UI updates right away
  post({ type: 'TICK', remaining });

  intervalId = setInterval(() => {
    const now = Date.now();
    // Timestamp-diff correction: accounts for background tab throttling
    const elapsed = Math.round((now - lastTimestamp) / 1000);
    lastTimestamp = now;

    remaining = Math.max(0, remaining - elapsed);

    if (remaining <= 0) {
      stopInterval();
      post({ type: 'TICK', remaining: 0 });
      post({ type: 'COMPLETE' });
    } else {
      post({ type: 'TICK', remaining });
    }
  }, 1000);
}

self.onmessage = (e: MessageEvent<WorkerInMessage>) => {
  const msg = e.data;

  switch (msg.type) {
    case 'START':
      stopInterval();
      remaining = msg.duration;
      startCounting();
      break;

    case 'PAUSE':
      stopInterval();
      break;

    case 'RESUME':
      // Resume uses startCounting which posts an immediate TICK
      startCounting();
      break;

    case 'RESET':
      stopInterval();
      remaining = 0;
      post({ type: 'TICK', remaining: 0 });
      break;
  }
};
