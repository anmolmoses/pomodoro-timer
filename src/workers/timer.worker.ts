// Timer Web Worker — uses timestamp-diff correction for accuracy
// even when the browser tab is in the background.

let intervalId: ReturnType<typeof setInterval> | null = null;
let remaining = 0;
let lastTimestamp = 0;

function stop() {
  if (intervalId !== null) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

function tick() {
  const now = Date.now();
  const elapsed = Math.round((now - lastTimestamp) / 1000);
  lastTimestamp = now;

  remaining = Math.max(0, remaining - elapsed);

  if (remaining <= 0) {
    stop();
    self.postMessage({ type: 'COMPLETE' });
  } else {
    self.postMessage({ type: 'TICK', remaining });
  }
}

self.onmessage = (e: MessageEvent) => {
  const msg = e.data;

  switch (msg.type) {
    case 'START':
      stop();
      remaining = msg.duration; // seconds
      lastTimestamp = Date.now();
      self.postMessage({ type: 'TICK', remaining });
      intervalId = setInterval(tick, 1000);
      break;

    case 'PAUSE':
      stop();
      break;

    case 'RESUME':
      if (remaining > 0) {
        lastTimestamp = Date.now();
        intervalId = setInterval(tick, 1000);
      }
      break;

    case 'RESET':
      stop();
      remaining = 0;
      break;
  }
};
