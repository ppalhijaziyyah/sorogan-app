import React, { useContext } from 'react';
import { AppContext } from '../contexts/AppContext';

const Header = () => {
  const { theme, toggleTheme } = useContext(AppContext);

  return (
    <header className="p-4 shadow-md bg-white dark:bg-gray-800">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold text-teal-accent">Sorogan</h1>
        <button onClick={toggleTheme} className="p-2 rounded-full bg-gray-200 dark:bg-gray-700">
          {theme === 'light' ? (
            // Moon Icon
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          ) : (
            // Sun Icon
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M12 5a7 7 0 100 14 7 7 0 000-14z" />
            </svg>
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;