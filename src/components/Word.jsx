import React, { useRef, useLayoutEffect, useState } from 'react';

const Word = ({ displayText, tooltipText, onClick, onDoubleClick }) => {
  const isPunctuation = /[.،؟:!()"«»]/.test(displayText) && displayText.length < 3;
  const wordRef = useRef(null);
  const [tooltipStyle, setTooltipStyle] = useState({});

  useLayoutEffect(() => {
    if (tooltipText && wordRef.current) {
      const wordSpan = wordRef.current;
      
      // --- Logika Posisi & Lebar Tooltip dari sorogan-app ---
      const computedStyle = getComputedStyle(wordSpan);
      const lineHeight = parseFloat(computedStyle.lineHeight);
      const fontSize = parseFloat(computedStyle.fontSize);
      const spaceAbove = (lineHeight - fontSize) / 2;
      const textBottomPosition = spaceAbove + fontSize;

      const top = textBottomPosition + 8; // Posisi di bawah teks + sedikit jarak

      // Kalkulasi lebar
      const arabicTextWidth = wordSpan.offsetWidth;
      const tempMeasurer = document.createElement('div');
      tempMeasurer.className = 'translation-tooltip';
      tempMeasurer.style.position = 'absolute';
      tempMeasurer.style.visibility = 'hidden';
      tempMeasurer.style.top = '-9999px';
      tempMeasurer.style.whiteSpace = 'nowrap';
      document.body.appendChild(tempMeasurer);
      
      let longestWordWidth = 0;
      tooltipText.split(' ').forEach(word => {
        tempMeasurer.textContent = word;
        if (tempMeasurer.offsetWidth > longestWordWidth) {
          longestWordWidth = tempMeasurer.offsetWidth;
        }
      });
      document.body.removeChild(tempMeasurer);

      const width = Math.max(arabicTextWidth, longestWordWidth) + 16;

      setTooltipStyle({ top: `${top}px`, width: `${width}px` });
    } else {
      setTooltipStyle({});
    }
  }, [tooltipText]);

  return (
    <div 
      className="relative inline-block"
      style={{ marginLeft: 'var(--word-spacing)' }}
    >
      <span 
        ref={wordRef}
        onClick={() => !isPunctuation && onClick && onClick()}
        onDoubleClick={() => !isPunctuation && onDoubleClick && onDoubleClick()}
        className={`inline-block transition-colors duration-150 px-1 ${isPunctuation ? '' : 'cursor-pointer hover:bg-teal-500/10 rounded'}`}
      >
        {displayText}
      </span>
      {tooltipText && (
        <div className="translation-tooltip" style={{ ...tooltipStyle, fontSize: 'var(--tooltip-font-size)' }}>
          {tooltipText}
        </div>
      )}
    </div>
  );
};

export default Word;