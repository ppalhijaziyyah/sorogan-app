import React, { useContext } from 'react';
import { AppContext } from '../contexts/AppContext';

// A helper for button classes to manage active, inactive, and disabled states
const getButtonClass = (isActive, isDisabled = false) => {
  let classes = 'p-3 rounded-lg shadow-md transition-all duration-200 ease-in-out ';
  if (isDisabled) {
    classes += 'opacity-50 cursor-not-allowed bg-gray-300 dark:bg-gray-800 ';
  } else if (isActive) {
    classes += 'bg-teal-500 text-white ';
  } else {
    classes += 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 ';
  }
  return classes;
};

const LearningToolbar = () => {
  const { settings, updateSettings } = useContext(AppContext);

  // Toggle harakat display mode. It's mutually exclusive with translation mode.
  const handleHarakatModeToggle = () => {
    const newIsHarakatMode = !settings.isHarakatMode;
    updateSettings({ 
      isHarakatMode: newIsHarakatMode, 
      isTranslationMode: newIsHarakatMode ? false : settings.isTranslationMode 
    });
  };

  // Toggle translation display mode. It's mutually exclusive with harakat mode.
  const handleTranslationModeToggle = () => {
    const newIsTranslationMode = !settings.isTranslationMode;
    updateSettings({ 
      isTranslationMode: newIsTranslationMode, 
      isHarakatMode: newIsTranslationMode ? false : settings.isHarakatMode 
    });
  };
  
  // Toggle visibility of all harakats at once, only available in harakat mode.
  const handleToggleAllHarakat = () => {
    if (!settings.isHarakatMode) return;
    updateSettings({ showAllHarakat: !settings.showAllHarakat });
  };

  return (
    <div className="flex justify-center items-center flex-wrap gap-4 md:gap-6 mb-6">
      <div className="flex items-center justify-center p-2 bg-white/50 dark:bg-gray-800/50 rounded-xl shadow-inner">
        <div className="flex items-center gap-3">
          {/* Harakat Mode Toggle */}
          <button onClick={handleHarakatModeToggle} type="button" title="Mode Harakat (Klik per kata)" className={getButtonClass(settings.isHarakatMode)}>
            <svg width="24" height="24" viewBox="0 0 24 24" className="pointer-events-none">
              <text x="50%" y="17" textAnchor="middle" className="font-arabic" fontSize="1.5rem" fill="currentColor">{settings.isHarakatMode ? 'حَ' : 'ح'}</text>
            </svg>
          </button>

          {/* Translation Mode Toggle */}
          <button onClick={handleTranslationModeToggle} type="button" title="Mode Terjemahan (Klik per kata)" className={getButtonClass(settings.isTranslationMode)}>
            <svg width="24" height="24" viewBox="0 0 24 24" className="pointer-events-none">
              <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fontWeight="bold" fontSize="16" fill="currentColor">T</text>
              {!settings.isTranslationMode && <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />}
            </svg>
          </button>

          {/* Toggle All Harakat */}
          <button onClick={handleToggleAllHarakat} type="button" title="Tampilkan/Sembunyikan Semua Harakat" className={getButtonClass(settings.showAllHarakat, !settings.isHarakatMode)}>
             <svg width="24" height="24" viewBox="-2 -4 28 28" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" className="pointer-events-none">
                <path d="M15 14c.2-1 .7-1.7 1.5-2.5C17.7 10.2 18 9 18 8a6 6 0 0 0-12 0c0 1 .3 2.2 1.5 3.5.7.7 1.2 1.5 1.5 2.5M9 18h6m-5 4h4" />
                {settings.showAllHarakat && <path d="M 12 -1 V -3 M 21 8 H 23 M 1 8 H 3 M 19 2 L 21 0 M 3 16 L 5 14 M 19 14 L 21 16 M 3 0 L 5 2" />}
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LearningToolbar;
