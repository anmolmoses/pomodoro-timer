// Timer Web Worker — uses timestamp-diff correction for accuracy in background tabs

let intervalId: ReturnType<typeof setInterval> | null = null;
let remaining = 0;
let lastTickTime = 0;

function clearTimer() {
  if (intervalId !== null) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

function startCountdown() {
  clearTimer();
  lastTickTime = Date.now();

  intervalId = setInterval(() => {
    const now = Date.now();
    const elapsed = Math.round((now - lastTickTime) / 1000);
    lastTickTime = now;

    remaining = Math.max(0, remaining - elapsed);

    if (remaining <= 0) {
      remaining = 0;
      clearTimer();
      self.postMessage({ type: 'COMPLETE' });
    } else {
      self.postMessage({ type: 'TICK', remaining });
    }
  }, 1000);
}

self.onmessage = (e: MessageEvent) => {
  const { type, duration } = e.data;

  switch (type) {
    case 'START': {
      remaining = duration ?? 0;
      self.postMessage({ type: 'TICK', remaining });
      startCountdown();
      break;
    }

    case 'PAUSE': {
      clearTimer();
      break;
    }

    case 'RESUME': {
      if (remaining > 0) {
        startCountdown();
      }
      break;
    }

    case 'RESET': {
      clearTimer();
      remaining = 0;
      break;
    }

    default:
      break;
  }
};
