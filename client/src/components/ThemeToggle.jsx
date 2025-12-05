import React from 'react';

const ThemeToggle = ({ theme, onToggle, className = '' }) => (
    <button
        type="button"
        onClick={onToggle}
        className={`inline-flex items-center gap-2 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${className}`}
        aria-label="Cambiar tema"
    >
        <span className="material-symbols-outlined text-xl">
            {theme === 'dark' ? 'light_mode' : 'dark_mode'}
        </span>
        <span>{theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}</span>
    </button>
);

export default ThemeToggle;
