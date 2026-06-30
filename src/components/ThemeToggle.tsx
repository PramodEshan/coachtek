import { IconMoon, IconSun } from '@/components/icons';
import { useTheme } from '@/context/ThemeContext';

type ThemeToggleProps = {
  /** Full control with "Appearance" label — settings menu */
  variant?: 'default' | 'compact' | 'toolbar';
};

export function ThemeToggle({ variant = 'default' }: ThemeToggleProps) {
  const { theme, setTheme, toggleTheme } = useTheme();

  if (variant === 'toolbar') {
    return (
      <div className="ct-theme-toggle-toolbar" role="group" aria-label="Color theme">
        <button
          type="button"
          className={`ct-press ct-theme-toggle-icon${theme === 'light' ? ' is-active' : ''}`}
          onClick={() => setTheme('light')}
          aria-pressed={theme === 'light'}
          aria-label="Light mode"
          title="Light mode"
        >
          <IconSun size={18} />
        </button>
        <button
          type="button"
          className={`ct-press ct-theme-toggle-icon${theme === 'dark' ? ' is-active' : ''}`}
          onClick={() => setTheme('dark')}
          aria-pressed={theme === 'dark'}
          aria-label="Dark mode"
          title="Dark mode"
        >
          <IconMoon size={18} />
        </button>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <button
        type="button"
        className="ct-press ct-theme-toggle-compact"
        onClick={toggleTheme}
        aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
        title={theme === 'light' ? 'Dark mode' : 'Light mode'}
      >
        {theme === 'light' ? <IconMoon size={18} /> : <IconSun size={18} />}
      </button>
    );
  }

  return (
    <div className="ct-theme-toggle" role="group" aria-label="Color theme">
      <div style={{ fontSize: 11.5, fontWeight: 700, padding: '2px 4px 6px' }}>Appearance</div>
      <div className="ct-theme-toggle-track">
        <button
          type="button"
          className={`ct-press ct-theme-toggle-btn${theme === 'light' ? ' is-active' : ''}`}
          onClick={() => setTheme('light')}
          aria-pressed={theme === 'light'}
        >
          <IconSun size={14} />
          Light
        </button>
        <button
          type="button"
          className={`ct-press ct-theme-toggle-btn${theme === 'dark' ? ' is-active' : ''}`}
          onClick={() => setTheme('dark')}
          aria-pressed={theme === 'dark'}
        >
          <IconMoon size={14} />
          Dark
        </button>
      </div>
    </div>
  );
}
