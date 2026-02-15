import React, { useState, useLayoutEffect, useRef, useContext } from 'react';
import { AppContext } from '../contexts/AppContext';

const getNgaLogatPositionStyle = (position) => {
  const baseOffset = '0.1em'; // Base offset from the word
  const transformX = 'translateX(-50%)'; // For centering horizontally

  switch (position) {
    case 'top': return { top: `-${baseOffset}`, left: '50%', transform: transformX };
    case 'bottom': return { bottom: `-${baseOffset}`, left: '50%', transform: transformX };
    case 'top-left': return { top: `-${baseOffset}`, left: '0' };
    case 'top-right': return { top: `-${baseOffset}`, right: '0' };
    case 'bottom-left': return { bottom: `-${baseOffset}`, left: '0' };
    case 'bottom-right': return { bottom: `-${baseOffset}`, right: '0' };
    default: return {};
  }
};

const Word = ({ wordData, isHarakatVisible, isTranslationVisible, isNgaLogatVisible, onClick, onDoubleClick }) => {
  const { settings, ngalogatSymbolColors } = useContext(AppContext);
  const { useNgaLogatColorCoding } = settings; // No showNgaLogat here anymore
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

  const defaultNgaLogatColor = 'var(--text-color-ngalogat-default)'; // Define a CSS variable for default color

  return (
    <span
      onClick={() => !isPunctuation && onClick()}
      onDoubleClick={() => !isPunctuation && onDoubleClick()}
      className={`relative inline-flex justify-center transition-[min-width] duration-300 ease-in-out px-1 ${isPunctuation ? '' : 'cursor-pointer hover:bg-teal-500/10 dark:hover:bg-teal-400/10 rounded'}`}
      style={{ marginLeft: 'var(--word-spacing)', verticalAlign: 'middle', minWidth: isTranslationVisible && tooltipStyle.width ? tooltipStyle.width : '0px' }}
    >
      <span ref={wordRef}>{displayText}</span>

      {isNgaLogatVisible && wordData.nga_logat && wordData.nga_logat.map((logat, index) => {
        const symbolColor = useNgaLogatColorCoding
          ? (ngalogatSymbolColors[logat.symbol] || defaultNgaLogatColor)
          : defaultNgaLogatColor;
        return (
          <span
            key={index}
            className={`absolute whitespace-nowrap leading-none z-10`}
            style={{
              fontSize: `var(--logat-font-size)`, // Use ngalogat font size
              color: symbolColor, // Apply conditional color
              ...getNgaLogatPositionStyle(logat.position), // Function to calculate position
            }}
          >
            {logat.symbol}
          </span>
        );
      })}
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