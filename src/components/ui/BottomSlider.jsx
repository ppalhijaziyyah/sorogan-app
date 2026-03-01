import React, { useState, useEffect } from 'react';

const BottomSlider = ({ sliderState, onClose }) => {
  const { isOpen, title, content, type } = sliderState || {};
  const [isShowing, setIsShowing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // When the slider is told to open, we mount it and then trigger the animation
      const timer = setTimeout(() => setIsShowing(true), 10);
      return () => clearTimeout(timer);
    }
    // No need for an else, closing is handled by handleClose
  }, [isOpen]);

  const handleClose = () => {
    // Trigger the exit animation
    setIsShowing(false);
    // Wait for the animation to finish before calling the parent's onClose
    setTimeout(() => {
      onClose();
    }, 300); // This duration must match the transition duration in the className
  };

  if (!isOpen) {
    return null;
  }

  const direction = type === 'irab' ? 'rtl' : 'ltr';
  const fontClass = type === 'irab' ? 'font-arabic' : 'font-sans';
  const sizeStyle = type === 'irab' ? { fontSize: 'var(--irab-font-size)' } : {};

  return (
    <div
      onClick={handleClose}
      className={`fixed inset-0 bg-black z-[150] flex justify-center items-end transition-opacity duration-300 ease-in-out ${isShowing ? 'bg-opacity-50' : 'bg-opacity-0'}`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-4xl bg-white dark:bg-gray-800 rounded-t-2xl shadow-2xl p-6 transform transition-transform duration-300 ease-in-out ${isShowing ? 'translate-y-0' : 'translate-y-full'}`}
      >
        <div className="flex justify-between items-center mb-4">
          {type === 'irab' ? (
            <>
              <button onClick={handleClose} className="text-2xl text-gray-500 hover:text-gray-800 dark:hover:text-gray-200">&times;</button>
              <h2 dir={direction} className={`text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-sky-500 ${fontClass} ${type === 'irab' ? 'text-right' : ''} flex-grow`} style={type === 'irab' ? { ...sizeStyle, textAlign: 'right' } : {}}>{title}</h2>
            </>
          ) : (
            <>
              <h2 dir={direction} className={`text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-sky-500 ${fontClass}`}>{title}</h2>
              <button onClick={handleClose} className="text-2xl text-gray-500 hover:text-gray-800 dark:hover:text-gray-200">&times;</button>
            </>
          )}
        </div>
        <div className={`prose dark:prose-invert max-w-none ${fontClass}`} style={sizeStyle}>
          {content}
          {type === 'irab' && sliderState.link && (
            <div className="mt-6 font-sans">
              <details className="group bg-teal-50 dark:bg-slate-700/50 rounded-xl overflow-hidden shadow-sm border border-teal-100 dark:border-slate-700 transition-all duration-300">
                <summary
                  className="flex items-center justify-between cursor-pointer px-4 py-3 font-semibold text-teal-800 dark:text-teal-300 bg-white/50 dark:bg-slate-800/50 hover:bg-teal-100/50 dark:hover:bg-slate-700/80 transition-colors"
                  style={{ fontSize: 'var(--accordion-title-size, 18px)' }}
                >
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Penjelasan Tambahan
                  </span>
                  <svg className="w-4 h-4 text-teal-600 dark:text-teal-400 transform transition-transform group-open:-rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div
                  className="px-4 py-3 text-gray-700 dark:text-gray-300 border-t border-teal-100 dark:border-slate-700 leading-relaxed"
                  style={{ fontSize: 'var(--accordion-content-size, 14px)' }}
                  dangerouslySetInnerHTML={{ __html: sliderState.link }}
                />
              </details>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BottomSlider;