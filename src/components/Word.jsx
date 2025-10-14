import React from 'react';

const Word = ({ wordData, isHarakatVisible, isTranslationVisible, onClick, onDoubleClick }) => {
  // Determine if the word is just punctuation to disable interactions
  const isPunctuation = /[.،؟:!()"«»]/.test(wordData.gundul) && wordData.gundul.length < 3;

  // Determine the text to display based on visibility flags
  const displayText = isHarakatVisible ? wordData.berharakat : wordData.gundul;
  
  // Determine if the tooltip with the translation should be shown
  const showTooltip = isTranslationVisible && wordData.terjemahan;

  return (
    <span 
      onClick={() => !isPunctuation && onClick()}
      onDoubleClick={() => !isPunctuation && onDoubleClick()}
      className={`relative inline-block transition-colors duration-150 px-1 ${isPunctuation ? '' : 'cursor-pointer hover:bg-teal-500/10 dark:hover:bg-teal-400/10 rounded'}`}
      style={{ marginLeft: 'var(--word-spacing)' }}
    >
      {displayText}
      {showTooltip && (
        <div 
          className="translation-tooltip" 
          style={{ fontSize: 'var(--tooltip-font-size)' }}
        >
          {wordData.terjemahan}
        </div>
      )}
    </span>
  );
};

export default Word;