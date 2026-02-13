import { useState, useCallback, useEffect } from 'react';
import { soundManager } from '../services/soundManager';

export default function SoundControls() {
  const [muted, setMuted] = useState(soundManager.isMuted());
  const [volume, setVolume] = useState(soundManager.getVolume() * 100);
  const [showSlider, setShowSlider] = useState(false);

  const handleToggleMute = useCallback(() => {
    soundManager.init();
    soundManager.toggleMute();
    setMuted(soundManager.isMuted());
  }, []);

  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setVolume(val);
    soundManager.setVolume(val / 100);
    if (val === 0) {
      soundManager.mute();
      setMuted(true);
    } else if (soundManager.isMuted()) {
      soundManager.unmute();
      setMuted(false);
    }
  }, []);

  // Init AudioContext on first interaction
  useEffect(() => {
    const handler = () => soundManager.init();
    window.addEventListener('click', handler, { once: true });
    window.addEventListener('keydown', handler, { once: true });
    return () => {
      window.removeEventListener('click', handler);
      window.removeEventListener('keydown', handler);
    };
  }, []);

  return (
    <div
      className="sound-controls"
      onMouseEnter={() => setShowSlider(true)}
      onMouseLeave={() => setShowSlider(false)}
    >
      <button
        className="sound-toggle"
        onClick={handleToggleMute}
        aria-label={muted ? 'Unmute sounds' : 'Mute sounds'}
        title={muted ? 'Unmute' : 'Mute'}
      >
        {muted || volume === 0 ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
          </svg>
        ) : volume < 50 ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          </svg>
        )}
      </button>

      {showSlider && (
        <div className="sound-slider-container">
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={handleVolumeChange}
            className="sound-slider"
            aria-label="Volume"
          />
        </div>
      )}

      <style>{`
        .sound-controls {
          position: relative;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .sound-toggle {
          background: none;
          border: none;
          color: #6B6B80;
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.2s, background 0.2s;
          min-width: 44px;
          min-height: 44px;
        }
        .sound-toggle:hover {
          color: #E8E8F0;
          background: rgba(108, 92, 231, 0.1);
        }
        .sound-toggle:active {
          transform: scale(0.95);
        }
        .sound-slider-container {
          position: absolute;
          top: 100%;
          right: 0;
          background: #252540;
          border-radius: 12px;
          padding: 12px 16px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.4);
          z-index: 100;
          min-width: 140px;
        }
        .sound-slider {
          width: 100%;
          height: 4px;
          -webkit-appearance: none;
          appearance: none;
          background: #2A2A45;
          border-radius: 2px;
          outline: none;
          cursor: pointer;
          min-height: 44px;
        }
        .sound-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #6C5CE7;
          cursor: pointer;
          border: none;
        }
        .sound-slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #6C5CE7;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  );
}
