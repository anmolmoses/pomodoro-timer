// Sound Manager — Web Audio API synthesized sounds
// No audio files needed, all sounds generated programmatically

export type SoundType = 'sessionStart' | 'sessionComplete' | 'breakStart' | 'tick';

interface SoundPrefs {
  volume: number;
  muted: boolean;
}

const STORAGE_KEY = 'focusflow_sound';

class SoundManager {
  private ctx: AudioContext | null = null;
  private _volume: number = 0.7;
  private _muted: boolean = false;
  private initialized = false;

  constructor() {
    this.loadPrefs();
  }

  private loadPrefs(): void {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const prefs: SoundPrefs = JSON.parse(raw);
        this._volume = prefs.volume ?? 0.7;
        this._muted = prefs.muted ?? false;
      }
    } catch {
      // ignore
    }
  }

  private savePrefs(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        volume: this._volume,
        muted: this._muted,
      }));
    } catch {
      // ignore
    }
  }

  private ensureContext(): AudioContext {
    if (!this.ctx) {
      this.ctx = new AudioContext();
    }
    // Resume if suspended (autoplay policy)
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  /**
   * Initialize on first user interaction to comply with autoplay policy.
   * Call this from a click/keydown handler.
   */
  init(): void {
    if (this.initialized) return;
    this.ensureContext();
    this.initialized = true;
  }

  play(sound: SoundType): void {
    if (this._muted) return;
    const ctx = this.ensureContext();
    const now = ctx.currentTime;

    switch (sound) {
      case 'sessionStart':
        this.playSessionStart(ctx, now);
        break;
      case 'sessionComplete':
        this.playSessionComplete(ctx, now);
        break;
      case 'breakStart':
        this.playBreakStart(ctx, now);
        break;
      case 'tick':
        this.playTick(ctx, now);
        break;
    }
  }

  private createGain(ctx: AudioContext, volume: number): GainNode {
    const gain = ctx.createGain();
    gain.gain.value = volume * this._volume;
    gain.connect(ctx.destination);
    return gain;
  }

  // Soft chime — 800Hz sine, 200ms, fade out
  private playSessionStart(ctx: AudioContext, now: number): void {
    const osc = ctx.createOscillator();
    const gain = this.createGain(ctx, 0.3);
    osc.type = 'sine';
    osc.frequency.value = 800;
    osc.connect(gain);
    gain.gain.setValueAtTime(0.3 * this._volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
    osc.start(now);
    osc.stop(now + 0.2);
  }

  // Two-tone ascending chime — 600Hz→900Hz, 150ms each
  private playSessionComplete(ctx: AudioContext, now: number): void {
    const osc1 = ctx.createOscillator();
    const gain1 = this.createGain(ctx, 0.3);
    osc1.type = 'sine';
    osc1.frequency.value = 600;
    osc1.connect(gain1);
    gain1.gain.setValueAtTime(0.3 * this._volume, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    osc1.start(now);
    osc1.stop(now + 0.15);

    const osc2 = ctx.createOscillator();
    const gain2 = this.createGain(ctx, 0.35);
    osc2.type = 'sine';
    osc2.frequency.value = 900;
    osc2.connect(gain2);
    gain2.gain.setValueAtTime(0.35 * this._volume, now + 0.15);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    osc2.start(now + 0.15);
    osc2.stop(now + 0.3);
  }

  // Gentle low tone — 400Hz, 300ms
  private playBreakStart(ctx: AudioContext, now: number): void {
    const osc = ctx.createOscillator();
    const gain = this.createGain(ctx, 0.25);
    osc.type = 'sine';
    osc.frequency.value = 400;
    osc.connect(gain);
    gain.gain.setValueAtTime(0.25 * this._volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    osc.start(now);
    osc.stop(now + 0.3);
  }

  // Subtle click — white noise burst, 50ms, very low volume
  private playTick(ctx: AudioContext, now: number): void {
    const bufferSize = Math.floor(ctx.sampleRate * 0.05);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.3;
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    const gain = this.createGain(ctx, 0.08);
    source.connect(gain);
    gain.gain.setValueAtTime(0.08 * this._volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
    source.start(now);
    source.stop(now + 0.05);
  }

  setVolume(v: number): void {
    this._volume = Math.max(0, Math.min(1, v));
    this.savePrefs();
  }

  getVolume(): number {
    return this._volume;
  }

  mute(): void {
    this._muted = true;
    this.savePrefs();
  }

  unmute(): void {
    this._muted = false;
    this.savePrefs();
  }

  toggleMute(): void {
    this._muted = !this._muted;
    this.savePrefs();
  }

  isMuted(): boolean {
    return this._muted;
  }
}

// Singleton
export const soundManager = new SoundManager();
export default soundManager;
