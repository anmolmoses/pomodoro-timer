import { useEffect, useRef } from 'react';

interface FaviconProps {
  /** Remaining seconds to display */
  remainingSeconds: number;
  /** Whether timer is active */
  isActive: boolean;
  /** Accent color for the badge */
  color?: string;
}

/**
 * Dynamic favicon that shows remaining time as a tiny badge.
 * Uses canvas to render a favicon with the time overlay.
 */
export default function Favicon({ remainingSeconds, isActive, color = '#6C5CE7' }: FaviconProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const linkRef = useRef<HTMLLinkElement | null>(null);

  useEffect(() => {
    if (!isActive) {
      // Reset to default favicon
      const link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
      if (link) link.href = '/icon.svg';
      return;
    }

    if (!canvasRef.current) {
      canvasRef.current = document.createElement('canvas');
      canvasRef.current.width = 32;
      canvasRef.current.height = 32;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const minutes = Math.floor(remainingSeconds / 60);
    const displayText = minutes > 0 ? `${minutes}` : `${remainingSeconds}`;

    // Clear
    ctx.clearRect(0, 0, 32, 32);

    // Background circle
    ctx.beginPath();
    ctx.arc(16, 16, 15, 0, Math.PI * 2);
    ctx.fillStyle = '#0F0F1A';
    ctx.fill();

    // Progress ring
    ctx.beginPath();
    ctx.arc(16, 16, 13, 0, Math.PI * 2);
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.stroke();

    // Time text
    ctx.fillStyle = '#E8E8F0';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(displayText, 16, 17);

    // Update favicon
    if (!linkRef.current) {
      linkRef.current = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
      if (!linkRef.current) {
        linkRef.current = document.createElement('link');
        linkRef.current.rel = 'icon';
        document.head.appendChild(linkRef.current);
      }
    }
    linkRef.current.href = canvas.toDataURL('image/png');
  }, [remainingSeconds, isActive, color]);

  return null;
}
