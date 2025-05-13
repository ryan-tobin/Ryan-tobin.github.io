document.addEventListener('DOMContentLoaded', () => {
    const THEME_KEY = 'portfolio-theme';
    const THEME_TOGGLE = document.getElementById('theme-toggle');
    if (!THEME_TOGGLE) return;
    const THEME_ICON = THEME_TOGGLE.querySelector('i');

    const ICONS = {
        light: 'fa-sun',
        dark: 'fa-moon'
    };

    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem(THEME_KEY, theme);
        if (THEME_ICON) {
            THEME_ICON.classList.remove(ICONS.light, ICONS.dark);
            THEME_ICON.classList.add(ICONS[theme]);
        }
    }

    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
    }

    function initTheme() {
        const savedTheme = localStorage.getItem(THEME_KEY) || 'light';
        setTheme(savedTheme);
    }

    THEME_TOGGLE.addEventListener('click', toggleTheme);
    initTheme();
});