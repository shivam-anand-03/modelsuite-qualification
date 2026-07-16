import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext(null);

const getInitialTheme = () => {
  const stored = localStorage.getItem('theme');
  return stored === 'light' || stored === 'dark' ? stored : 'dark';
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    // Briefly enable global transitions so the switch cross-fades smoothly
    const root = document.documentElement;
    root.classList.add('theme-anim');
    window.setTimeout(() => root.classList.remove('theme-anim'), 450);
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Exporting this hook alongside the provider is intentional (standard context pattern)
// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => useContext(ThemeContext);
