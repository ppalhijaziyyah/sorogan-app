import React, { useMemo } from 'react';
import DisplaySettings from '../ui/DisplaySettings';
// import SettingToggle from './ui/SettingToggle'; // This import is not used here.

const LearningToolbar = ({
  settings,
  updateSettings,
  onReset,
  isSettingsOpen,
  setSettingsOpen,
  lessonData,
  showFullTranslation,
  setShowFullTranslation
}) => {

  const handleHarakatModeToggle = () => {
    const newIsHarakatMode = !settings.isHarakatMode;
    updateSettings({
      isHarakatMode: newIsHarakatMode,
      showAllHarakat: newIsHarakatMode ? settings.showAllHarakat : false
    });
  };

  const handleTranslationModeToggle = () => {
    const newIsTranslationMode = !settings.isTranslationMode;
    updateSettings({
      isTranslationMode: newIsTranslationMode,
      showAllTranslations: newIsTranslationMode ? settings.showAllTranslations : false
    });
  };

  // Helper function for button classes
  const getButtonClass = (isActive, isDisabled = false) => {
    const base = 'px-4 py-2 text-sm font-medium transition-colors focus:z-10 focus:outline-none';
    if (isDisabled) {
      return `${base} bg-white dark:bg-slate-800 text-gray-400 dark:text-gray-600 cursor-not-allowed`;
    }
    if (isActive) {
      return `${base} bg-teal-500 text-white hover:bg-teal-600`;
    }
    return `${base} bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700`;
  };

  const hasNgaLogatData = useMemo(() => {
    return lessonData.textData.some(paragraph =>
      paragraph.some(wordData => wordData.nga_logat && wordData.nga_logat.length > 0)
    );
  }, [lessonData]);

  const hasTasykilData = useMemo(() => {
    return lessonData.textData.some(paragraph =>
      paragraph.some(wordData => wordData.tasykil_options && wordData.tasykil_options.length > 0)
    );
  }, [lessonData]);

  if (hasTasykilData) {
    // Keep Tasykil check logic intact
  }

  return (
    <div className="relative z-50 flex justify-center items-center mb-8 animate-in fade-in slide-in-from-left-4 duration-300">
      <div className="inline-flex rounded-full shadow-sm border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 backdrop-blur-sm" role="group">

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

        {hasNgaLogatData && (
          <button
            onClick={() => updateSettings({ isNgaLogatMode: !settings.isNgaLogatMode, showAllNgaLogat: settings.isNgaLogatMode ? false : settings.showAllNgaLogat })}
            type="button"
            title="Mode Nga-logat (Klik per kata)"
            className={`${getButtonClass(settings.isNgaLogatMode)} border-r border-gray-200 dark:border-slate-700`}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" className="pointer-events-none">
              <text x="50%" y="17" textAnchor="middle" className="font-arabic" fontSize="1.5rem" fill="currentColor">{settings.isNgaLogatMode ? 'نَ' : 'ن'}</text>
            </svg>
          </button>
        )}

        {/* Tasykil Mode Toggle */}
        {hasTasykilData && (
          <button
            onClick={() => updateSettings({ isTasykilMode: !settings.isTasykilMode })}
            type="button"
            title="Mode Tasykil (Latihan Harakat)"
            className={`${getButtonClass(settings.isTasykilMode)} border-r border-gray-200 dark:border-slate-700`}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" className="pointer-events-none">
              <text x="50%" y="17" textAnchor="middle" className="font-arabic" fontSize="1.5rem" fill="currentColor">{settings.isTasykilMode ? 'شَ' : 'ش'}</text>
            </svg>
          </button>
        )}

        {/* Full Translation Toggle */}
        {lessonData.fullTranslation && (
          <button
            onClick={() => setShowFullTranslation(s => !s)}
            type="button"
            title="Tampilkan Terjemahan Lengkap"
            className={`${getButtonClass(showFullTranslation)} border-r border-gray-200 dark:border-slate-700`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
              <path d="M2.5 0A2.5 2.5 0 0 0 0 2.5v11A2.5 2.5 0 0 0 2.5 16h11a2.5 2.5 0 0 0 2.5-2.5v-11A2.5 2.5 0 0 0 13.5 0zM1 2.5A1.5 1.5 0 0 1 2.5 1h11A1.5 1.5 0 0 1 15 2.5v11a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 1 13.5z" />
              <path d="M2 12h12v1h-12zm2-3h8v1h-8zm-2-3h12v1h-12zm2-3h8v1h-8z" />
            </svg>
          </button>
        )}

        {/* Display Settings Toggle */}
        <div className="relative">
          <button
            onClick={() => setSettingsOpen(o => !o)}
            title="Pengaturan Tampilan"
            className={`${getButtonClass(isSettingsOpen)} rounded-r-full`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16"><path fillRule="evenodd" d="M10.5 1a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V4H1.5a.5.5 0 0 1 0-1H10V1.5a.5.5 0 0 1 .5-.5M12 3.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5m-6.5 2A.5.5 0 0 1 6 6v1.5h8.5a.5.5 0 0 1 0 1H6V10a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5M1 8a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2A.5.5 0 0 1 1 8m9.5 2a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V13H1.5a.5.5 0 0 1 0-1H10v-1.5a.5.5 0 0 1 .5-.5m1.5 2.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5" /></svg>
          </button>
          <DisplaySettings
            isOpen={isSettingsOpen}
            settings={settings}
            updateSettings={updateSettings}
            onReset={onReset}
            onClose={() => setSettingsOpen(false)}
          />
        </div>

      </div>
    </div>
  );
};

export default LearningToolbar;
