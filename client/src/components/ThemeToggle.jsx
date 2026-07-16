import { useId } from 'react';
import { useTheme } from '../context/ThemeContext';

/**
 * Animated sun ↔ moon theme switch.
 * The moon is drawn by masking a "bite" out of the sun's core; CSS in
 * index.css slides the bite in, grows the core and spins the rays away
 * when the app is in dark mode.
 */
const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const maskId = useId();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="theme-toggle"
      title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
      <svg className="sun-moon" width="17" height="17" viewBox="0 0 24 24" fill="none">
        <mask id={maskId}>
          <rect x="0" y="0" width="24" height="24" fill="white" />
          <circle className="moon-bite" cx="28" cy="2" r="7" fill="black" />
        </mask>
        <circle className="sun-core" cx="12" cy="12" r="5" fill="currentColor" mask={`url(#${maskId})`} />
        <g className="sun-rays" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
          <line x1="12" y1="1.5" x2="12" y2="3.8" />
          <line x1="12" y1="20.2" x2="12" y2="22.5" />
          <line x1="1.5" y1="12" x2="3.8" y2="12" />
          <line x1="20.2" y1="12" x2="22.5" y2="12" />
          <line x1="4.6" y1="4.6" x2="6.2" y2="6.2" />
          <line x1="17.8" y1="17.8" x2="19.4" y2="19.4" />
          <line x1="4.6" y1="19.4" x2="6.2" y2="17.8" />
          <line x1="17.8" y1="6.2" x2="19.4" y2="4.6" />
        </g>
      </svg>
    </button>
  );
};

export default ThemeToggle;
