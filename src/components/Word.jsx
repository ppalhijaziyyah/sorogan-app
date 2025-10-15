import React, { useState, useLayoutEffect, useRef } from 'react';

const Word = ({ wordData, isHarakatVisible, isTranslationVisible, onClick, onDoubleClick }) => {
  const isPunctuation = /[.،؟:!()"«»]/.test(wordData.gundul) && wordData.gundul.length < 3;
  const displayText = isHarakatVisible ? wordData.berharakat : wordData.gundul;
  
  const wordRef = useRef(null);
  const [tooltipStyle, setTooltipStyle] = useState({});

  useLayoutEffect(() => {
    // Calculate style only when the tooltip is meant to be visible
    if (isTranslationVisible && wordData.terjemahan && wordRef.current) {
      const wordSpan = wordRef.current;

      // --- Logic from vanilla app ---
      const computedStyle = getComputedStyle(wordSpan);
      const lineHeight = parseFloat(computedStyle.lineHeight);
      const fontSize = parseFloat(computedStyle.fontSize);
      const spaceAbove = (lineHeight - fontSize) / 2;
      const textBottomPosition = spaceAbove + fontSize;
      const top = textBottomPosition + 8;

      const arabicTextWidth = wordSpan.offsetWidth;
      
      // Use a temporary element to measure the longest word in the translation
      const tempMeasurer = document.createElement('div');
      tempMeasurer.className = 'translation-tooltip'; // Use same class for accurate font styling
      tempMeasurer.style.position = 'absolute';
      tempMeasurer.style.visibility = 'hidden';
      tempMeasurer.style.whiteSpace = 'nowrap';
      document.body.appendChild(tempMeasurer);
      
      let longestWordWidth = 0;
      wordData.terjemahan.split(' ').forEach(word => {
        tempMeasurer.textContent = word;
        if (tempMeasurer.offsetWidth > longestWordWidth) {
          longestWordWidth = tempMeasurer.offsetWidth;
        }
      });
      document.body.removeChild(tempMeasurer);

      const width = Math.max(arabicTextWidth, longestWordWidth) + 16; // Add some padding

      setTooltipStyle({ top: `${top}px`, width: `${width}px` });
    }
  }, [isTranslationVisible, wordData.terjemahan]);

  return (
    <span 
      onClick={() => !isPunctuation && onClick()}
      onDoubleClick={() => !isPunctuation && onDoubleClick()}
      className={`relative inline-block transition-colors duration-150 px-1 ${isPunctuation ? '' : 'cursor-pointer hover:bg-teal-500/10 dark:hover:bg-teal-400/10 rounded'}`}
      style={{ marginLeft: 'var(--word-spacing)' }}
    >
      <span ref={wordRef}>{displayText}</span>
      {isTranslationVisible && wordData.terjemahan && (
        <div 
          className="translation-tooltip" 
          style={{ ...tooltipStyle, fontSize: 'var(--tooltip-font-size)' }}
        >
          {wordData.terjemahan}
        </div>
      )}
    </span>
  );
};

export default Word;