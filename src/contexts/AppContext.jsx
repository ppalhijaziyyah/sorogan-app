import React, { createContext, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

export const AppContext = createContext();

const defaultSettings = {
  isHarakatMode: true,
  isTranslationMode: false,
  showAllHarakat: false,
  isFocusMode: false,
  arabicSize: 1.875,
  lineHeight: 2.5,
  wordSpacing: 0.25,
  tooltipSize: 0.875,
  irabSize: 1.5, // New setting
};

// Function to apply settings to the DOM
const applySettingsToDOM = (settings) => {
  document.documentElement.style.setProperty('--arabic-font-size', `${settings.arabicSize}rem`);
  document.documentElement.style.setProperty('--tooltip-font-size', `${settings.tooltipSize}rem`);
  document.documentElement.style.setProperty('--arabic-line-height', settings.lineHeight);
  document.documentElement.style.setProperty('--word-spacing', `${settings.wordSpacing}rem`);
  document.documentElement.style.setProperty('--irab-font-size', `${settings.irabSize}rem`); // New setting applied
};

export const AppProvider = ({ children }) => {
  const [theme, setTheme] = useLocalStorage('theme', 'light');
  const [completedLessons, setCompletedLessons] = useLocalStorage('completedLessons', []);
  const [settings, setSettings] = useLocalStorage('soroganAppSettings', defaultSettings);

  // Apply theme on initial load and when it changes
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(theme === 'light' ? 'dark' : 'light');
    root.classList.add(theme);
  }, [theme]);

  // Apply display settings on initial load and when they change
  useEffect(() => {
    applySettingsToDOM(settings);
  }, [settings]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const toggleLessonComplete = (lessonId) => {
    setCompletedLessons(prev => 
      prev.includes(lessonId) ? prev.filter(id => id !== lessonId) : [...prev, lessonId]
    );
  };

  const resetProgress = () => {
    setCompletedLessons([]);
  };

  const updateSettings = (newSettings) => {
    setSettings(prev => ({...prev, ...newSettings}));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  }

  const value = {
    theme,
    toggleTheme,
    completedLessons,
    toggleLessonComplete,
    resetProgress,
    settings,
    updateSettings,
    resetSettings,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
