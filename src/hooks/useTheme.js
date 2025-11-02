import { useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

export function useTheme() {
    const [theme, setTheme] = useLocalStorage('kanban_theme', 'light');

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    return { theme, toggleTheme };
}