import React from 'react';
import DisplaySettings from './ui/DisplaySettings';

const LearningToolbar = ({ 
  settings, 
  updateSettings, 
  onReset, 
  isSettingsOpen, 
  setSettingsOpen 
}) => {

  const handleHarakatModeToggle = () => {
    const newIsHarakatMode = !settings.isHarakatMode;
    updateSettings({ 
        isHarakatMode: newIsHarakatMode,
        showAllHarakat: newIsHarakatMode ? settings.showAllHarakat : false
    });
  };

  const handleTranslationModeToggle = () => {
    updateSettings({ isTranslationMode: !settings.isTranslationMode });
  };
  
  const handleToggleAllHarakat = () => {
    if (!settings.isHarakatMode) return;
    updateSettings({ showAllHarakat: !settings.showAllHarakat });
  };

  // Helper function for button classes
  const getButtonClass = (isActive, isDisabled = false) => {
    const base = 'px-4 py-2 text-sm font-medium transition-colors focus:z-10 focus:outline-none';
    if (isDisabled) {
      return `${base} bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed`;
    }
    if (isActive) {
      return `${base} bg-teal-500 text-white hover:bg-teal-600`;
    }
    return `${base} bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700`;
  };

  return (
    <div className="flex justify-center items-center mb-8">
      <div className="inline-flex rounded-full shadow-sm border border-gray-200 dark:border-slate-700" role="group">
        
        {/* Harakat Mode Toggle */}
        <button 
          onClick={handleHarakatModeToggle} 
          type="button" 
          title="Mode Harakat (Klik per kata)" 
          className={`${getButtonClass(settings.isHarakatMode)} rounded-l-full`}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" className="pointer-events-none">
            <text x="50%" y="17" textAnchor="middle" className="font-arabic" fontSize="1.5rem" fill="currentColor">{settings.isHarakatMode ? 'حَ' : 'ح'}</text>
          </svg>
        </button>

        {/* Translation Mode Toggle */}
        <button 
          onClick={handleTranslationModeToggle} 
          type="button" 
          title="Mode Terjemahan (Klik per kata)" 
          className={`${getButtonClass(settings.isTranslationMode)} border-l border-r border-gray-200 dark:border-slate-700`}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" className="pointer-events-none">
            <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fontWeight="bold" fontSize="16" fill="currentColor">T</text>
            {!settings.isTranslationMode && <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />}
          </svg>
        </button>

        {/* Toggle All Harakat */}
        <button 
          onClick={handleToggleAllHarakat} 
          type="button" 
          title="Tampilkan/Sembunyikan Semua Harakat" 
          className={`${getButtonClass(settings.showAllHarakat, !settings.isHarakatMode)} border-r border-gray-200 dark:border-slate-700`}
        >
           <svg width="24" height="24" viewBox="-2 -4 28 28" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" className="pointer-events-none">
              <path d="M15 14c.2-1 .7-1.7 1.5-2.5C17.7 10.2 18 9 18 8a6 6 0 0 0-12 0c0 1 .3 2.2 1.5 3.5.7.7 1.2 1.5 1.5 2.5M9 18h6m-5 4h4" />
              {settings.showAllHarakat && <path d="M 12 -1 V -3 M 21 8 H 23 M 1 8 H 3 M 19 2 L 21 0 M 3 16 L 5 14 M 19 14 L 21 16 M 3 0 L 5 2" />}
          </svg>
        </button>

        {/* Display Settings Toggle */}
        <div className="relative">
          <button 
            onClick={() => setSettingsOpen(o => !o)} 
            title="Pengaturan Tampilan" 
            className={`${getButtonClass(isSettingsOpen)} rounded-r-full`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16"><path fillRule="evenodd" d="M10.5 1a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V4H1.5a.5.5 0 0 1 0-1H10V1.5a.5.5 0 0 1 .5-.5M12 3.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5m-6.5 2A.5.5 0 0 1 6 6v1.5h8.5a.5.5 0 0 1 0 1H6V10a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5M1 8a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2A.5.5 0 0 1 1 8m9.5 2a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V13H1.5a.5.5 0 0 1 0-1H10v-1.5a.5.5 0 0 1 .5-.5m1.5 2.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5"/></svg>
          </button>
          <DisplaySettings isOpen={isSettingsOpen} settings={settings} updateSettings={updateSettings} onReset={onReset} />
        </div>

      </div>
    </div>
  );
};

export default LearningToolbar;