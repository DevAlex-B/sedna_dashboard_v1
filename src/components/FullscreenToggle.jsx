import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import msDark from '../assets/ms_dark.png';
import msLight from '../assets/ms_light.png';
import fsDark from '../assets/fs_dark.png';
import fsLight from '../assets/fs_light.png';

export default function FullscreenToggle() {
  const { theme } = useTheme();
  const [isFullscreen, setIsFullscreen] = useState(
    !!document.fullscreenElement
  );

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  const icon = theme === 'dark'
    ? (isFullscreen ? fsDark : msDark)
    : (isFullscreen ? fsLight : msLight);

  return (
    <button
      onClick={toggleFullscreen}
      className="p-2 rounded-full bg-border text-default hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-focus transition-colors"
      aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
    >
      <img
        src={icon}
        alt=""
        className="w-5 h-5 transition-transform duration-200"
      />
    </button>
  );
}
