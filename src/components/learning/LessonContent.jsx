import React, { useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import Word from './Word';
import { AppContext } from '../../contexts/AppContext';

const LessonContent = ({ lessonData, setSliderState }) => {
  const { settings, lastReset } = useContext(AppContext);
  const { isNgaLogatMode, showAllNgaLogat } = settings; // Destructure new settings

  const [harakatStates, setHarakatStates] = useState({});
  const [translationStates, setTranslationStates] = useState({});
  const [ngaLogatStates, setNgaLogatStates] = useState({}); 
  const [currentFocusParagraph, setCurrentFocusParagraph] = useState(0);
  const [activeBookmarkWordId, setActiveBookmarkWordId] = useState(null);

  // Auto-close bookmark popup when clicking outside any word
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!e.target.closest('.word-container')) {
        setActiveBookmarkWordId(null);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  // Reset states when lessonData changes or when settings are reset (lastReset change)
  useEffect(() => {
    setHarakatStates({});
    setTranslationStates({});
    setNgaLogatStates({}); // Add this
    setCurrentFocusParagraph(0);
  }, [lessonData, lastReset]);

  // Reset individual states when their corresponding mode is toggled.
  useEffect(() => {
    setHarakatStates({});
  }, [settings.isHarakatMode]);

  useEffect(() => {
    setTranslationStates({});
  }, [settings.isTranslationMode]);

  useEffect(() => {
    setNgaLogatStates({}); 
  }, [isNgaLogatMode]);

  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const focusWordId = params.get('focusWord');
    if (focusWordId) {
      // focusWordId format: lessonId-pIndex-wIndex
      const parts = focusWordId.split('-');
      if (parts.length >= 3) {
        const pIndex = parseInt(parts[parts.length - 2]);
        const wIndex = parseInt(parts[parts.length - 1]);
        const wordId = `${pIndex}-${wIndex}`;
        
        setCurrentFocusParagraph(pIndex);
        setTranslationStates(prev => ({ ...prev, [wordId]: true })); // Buka terjemahannya (ini juga men-trigger popup bookmark bintang)
        setActiveBookmarkWordId(wordId);

        const timer = setTimeout(() => {
          const el = document.getElementById(`word-${focusWordId}`);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            // Efek berkedip atau menyorot tambahan untuk kata tersebut
            el.style.backgroundColor = 'rgba(251, 191, 36, 0.4)'; // amber-400 warna kuning transparan
            el.style.borderRadius = '0.25rem';
            el.style.transition = 'background-color 2s ease-in-out';
            setTimeout(() => {
              el.style.backgroundColor = 'transparent';
            }, 5000);
          }
        }, 300); // Waktu jeda biarkan React memuat DOM

        return () => clearTimeout(timer);
      }
    }
  }, [location.search, lessonData]);

  const handleWordClick = (pIndex, wIndex) => {
    const wordId = `${pIndex}-${wIndex}`;
    setCurrentFocusParagraph(pIndex);
    setActiveBookmarkWordId(wordId);

    if (settings.isHarakatMode) {
      setHarakatStates(prev => ({ ...prev, [wordId]: !prev[wordId] }));
    }
    if (settings.isTranslationMode) {
      setTranslationStates(prev => ({ ...prev, [wordId]: !prev[wordId] }));
    }
    if (isNgaLogatMode) { // Conditionally toggle nga-logat visibility
      setNgaLogatStates(prev => ({ ...prev, [wordId]: !prev[wordId] }));
    }
  };

  const handleWordDoubleClick = (wordData) => {
    if (wordData.irab) {
      setSliderState({ isOpen: true, title: wordData.berharakat, content: <p className="text-right" dir="rtl">{wordData.irab}</p>, type: 'irab', link: wordData.link });
    }
  };

  return (
    <div id="text-container" className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-white/20 p-6 pt-12 md:p-8 md:pt-16 rounded-xl shadow-lg text-right leading-loose font-arabic select-none" dir="rtl" style={{ fontSize: 'var(--arabic-font-size)', lineHeight: 'var(--arabic-line-height)' }}>
      {lessonData.textData.map((paragraph, pIndex) => (
        <div key={pIndex} className={`mb-6 transition-opacity duration-300 ${settings.isFocusMode && pIndex !== currentFocusParagraph ? 'paragraph-unfocused' : ''}`}>
          {paragraph.map((wordData, wIndex) => {
            const wordId = `${pIndex}-${wIndex}`;

            const isHarakatVisible = settings.showAllHarakat || (settings.isHarakatMode && harakatStates[wordId]);
            const isTranslationVisible = settings.showAllTranslations || (settings.isTranslationMode && translationStates[wordId]);
            const isNgaLogatVisible = showAllNgaLogat || (isNgaLogatMode && ngaLogatStates[wordId]);
            const contextSentence = paragraph.map(w => w.berharakat || w.gundul).join(' ');

            return (
              <React.Fragment key={wIndex}>
                {wordData.isNewLine && <div className="w-full h-0" aria-hidden="true" />}
                <Word
                  id={pIndex === 0 && wIndex === 0 ? "tour-first-word" : undefined}
                  wordData={wordData}
                  wordId={`${lessonData.id}-${pIndex}-${wIndex}`}
                  lessonId={lessonData.id}
                  lessonTitle={lessonData.title}
                  contextSentence={contextSentence}
                  isHarakatVisible={isHarakatVisible}
                  isTranslationVisible={isTranslationVisible}
                  isNgaLogatVisible={isNgaLogatVisible}
                  onClick={() => handleWordClick(pIndex, wIndex)}
                  onDoubleClick={() => handleWordDoubleClick(wordData)}
                  isFocused={harakatStates[wordId] || translationStates[wordId] || ngaLogatStates[wordId]}
                  showBookmarkPopup={activeBookmarkWordId === wordId}
                />
              </React.Fragment>
            );
          })}
        </div>
      ))}
    </div>
  );
};
export default LessonContent;