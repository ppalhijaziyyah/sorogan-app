import React from 'react';

const BottomSlider = ({ sliderState, onClose }) => {
  const { isOpen, title, content, type } = sliderState || {};

  if (!isOpen) return null;

  const direction = type === 'irab' ? 'rtl' : 'ltr';
  const fontClass = type === 'irab' ? 'font-arabic' : 'font-sans';
  const sizeStyle = type === 'irab' ? { fontSize: 'var(--irab-font-size)' } : {};

  return (
    <div onClick={onClose} className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-end transition-opacity duration-300 ease-in-out">
      <div 
        onClick={(e) => e.stopPropagation()} 
        className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-t-2xl shadow-2xl p-6 transform transition-transform duration-300 ease-in-out translate-y-0"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 dir={direction} className={`text-2xl font-bold text-teal-accent ${fontClass}`}>{title}</h2>
          <button onClick={onClose} className="text-2xl text-gray-500 hover:text-gray-800 dark:hover:text-gray-200">&times;</button>
        </div>
        <div className={`prose dark:prose-invert max-w-none ${fontClass}`} style={sizeStyle}>
          {content}
        </div>
      </div>
    </div>
  );
};

export default BottomSlider;