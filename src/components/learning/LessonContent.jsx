import React, { useState, useEffect, useContext } from 'react';
import Word from '../Word';
import { AppContext } from '../../contexts/AppContext';

const LessonContent = ({ lessonData, setSliderState }) => {
  const { settings } = useContext(AppContext);
  const [harakatStates, setHarakatStates] = useState({});
  const [translationStates, setTranslationStates] = useState({});
  const [currentFocusParagraph, setCurrentFocusParagraph] = useState(0);

  // Reset states when lessonData changes
  useEffect(() => {
    setHarakatStates({});
    setTranslationStates({});
    setCurrentFocusParagraph(0);
  }, [lessonData]);

  // Reset individual states when their corresponding mode is toggled.
  useEffect(() => {
    setHarakatStates({});
  }, [settings.isHarakatMode]);

  useEffect(() => {
    setTranslationStates({});
  }, [settings.isTranslationMode]);

  const handleWordClick = (pIndex, wIndex) => {
    const wordId = `${pIndex}-${wIndex}`;
    setCurrentFocusParagraph(pIndex);

    if (settings.isHarakatMode) {
      setHarakatStates(prev => ({ ...prev, [wordId]: !prev[wordId] }));
    }
    if (settings.isTranslationMode) {
      setTranslationStates(prev => ({ ...prev, [wordId]: !prev[wordId] }));
    }
  };

  const handleWordDoubleClick = (wordData) => {
    if (wordData.irab) {
      setSliderState({ isOpen: true, title: wordData.berharakat, content: <p className="text-right" dir="rtl">{wordData.irab}</p>, type: 'irab', link: wordData.link });
    }
  };

  return (
    <div id="text-container" className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-white/20 p-6 rounded-xl shadow-lg text-right leading-loose font-arabic select-none" dir="rtl" style={{fontSize: 'var(--arabic-font-size)', lineHeight: 'var(--arabic-line-height)'}}>
      {lessonData.textData.map((paragraph, pIndex) => (
        <p key={pIndex} className={`mb-6 transition-opacity duration-300 ${settings.isFocusMode && pIndex !== currentFocusParagraph ? 'paragraph-unfocused' : ''}`}>
          {paragraph.map((wordData, wIndex) => {
            const wordId = `${pIndex}-${wIndex}`;

            const isHarakatVisible = settings.showAllHarakat || (settings.isHarakatMode && harakatStates[wordId]);
            const isTranslationVisible = settings.isTranslationMode && translationStates[wordId];

            return (
              <Word 
                key={wIndex} 
                wordData={wordData}
                isHarakatVisible={isHarakatVisible}
                isTranslationVisible={isTranslationVisible}
                onClick={() => handleWordClick(pIndex, wIndex)} 
                onDoubleClick={() => handleWordDoubleClick(wordData)} 
              />
            );
          })}
        </p>
      ))}
    </div>
  );
};

export default LessonContent;