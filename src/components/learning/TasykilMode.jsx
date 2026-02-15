
import React, { useState, useEffect, useContext, useMemo } from 'react';
import { AppContext } from '../../contexts/AppContext';
import useSoundEffect from '../../hooks/useSoundEffect';

const TasykilMode = ({ lessonData }) => {
    const { settings } = useContext(AppContext);
    const { playCorrect, playWrong } = useSoundEffect();
    const [activeIndex, setActiveIndex] = useState(0);
    const [results, setResults] = useState({});
    const [showPopup, setShowPopup] = useState(false);
    const [popupWord, setPopupWord] = useState(null); // Explicit state for the word shown in popup

    // Flatten words to find interactive ones
    const interactiveWords = useMemo(() => {
        let words = [];
        lessonData.textData.forEach((paragraph, pIndex) => {
            paragraph.forEach((wordData, wIndex) => {
                if (wordData.tasykil_options && wordData.tasykil_options.length > 0) {
                    words.push({ ...wordData, pIndex, wIndex, id: `${pIndex}-${wIndex}` });
                }
            });
        });
        return words;
    }, [lessonData]);

    // Current active word for PROGRESSION (highlighting)
    const activeWord = interactiveWords[activeIndex];
    const totalInteractive = interactiveWords.length;
    const progress = Math.round((Object.keys(results).length / totalInteractive) * 100);

    // Helper to shuffle options
    const getShuffledOptions = (word) => {
        if (!word) return [];
        const allOptions = [word.berharakat, ...word.tasykil_options];
        // Simple shuffle
        return allOptions.sort(() => Math.random() - 0.5);
    };

    const [currentOptions, setCurrentOptions] = useState([]);

    // Update options when popup target changes
    useEffect(() => {
        if (popupWord) {
            setCurrentOptions(getShuffledOptions(popupWord));
        }
    }, [popupWord]);

    const handleWordClick = (pIndex, wIndex) => {
        const clickedId = `${pIndex}-${wIndex}`;
        const clickedWord = interactiveWords.find(w => w.id === clickedId);

        const isCurrentActive = activeWord && clickedId === activeWord.id;
        const isWrongAnswered = results[clickedId] && results[clickedId].status === 'wrong';

        if (clickedWord && (isCurrentActive || isWrongAnswered)) {
            setPopupWord(clickedWord); // Set specific word for popup
            setShowPopup(true);
        }
    };

    const handleOptionSelect = (option) => {
        if (!popupWord) return;

        const isCorrect = option === popupWord.berharakat;
        const newResults = {
            ...results,
            [popupWord.id]: {
                status: isCorrect ? 'correct' : 'wrong',
                selectedOption: option
            }
        };
        setResults(newResults);

        if (isCorrect) {
            playCorrect();
            setShowPopup(false);
            setPopupWord(null); // Clear popup word on correct answer
            if (activeIndex < interactiveWords.length - 1) {
                setActiveIndex(prev => prev + 1);
            }
        } else {
            playWrong();
            // If wrong, keep popup open (it will re-render as Review Mode)
        }
    };

    const handleClosePopup = () => {
        // If we are closing the popup for the CURRENT active word (which refers to the one we just got wrong),
        // we should advance to the next word to allow "continued mode".
        const isActiveIndexWord = activeWord && popupWord && activeWord.id === popupWord.id;
        // Only advance if it was answered (wrong). If just closed without answering (e.g. clicked outside before picking), don't advance.
        const isAnswered = results[popupWord?.id];

        setShowPopup(false);
        setPopupWord(null);

        if (isActiveIndexWord && isAnswered) {
            if (activeIndex < interactiveWords.length - 1) {
                setActiveIndex(prev => prev + 1);
            }
        }
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div className="bg-teal-600 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                <p className="text-xs text-right mt-1 text-gray-500">{Object.keys(results).length} / {totalInteractive} Kata Selesai</p>
            </div>

            {/* Main Text Container */}
            <div id="text-container" className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-white/20 p-6 rounded-xl shadow-lg text-right leading-loose font-arabic select-none relative" dir="rtl" style={{ fontSize: 'var(--arabic-font-size)', lineHeight: 'var(--arabic-line-height)' }}>

                {lessonData.textData.map((paragraph, pIndex) => (
                    <p key={pIndex} className="mb-6">
                        {paragraph.map((wordData, wIndex) => {
                            const wordId = `${pIndex}-${wIndex}`;
                            const isInteractive = wordData.tasykil_options && wordData.tasykil_options.length > 0;
                            const result = results[wordId];
                            const isActive = activeWord && activeWord.id === wordId;

                            let displayText = wordData.berharakat;
                            if (isInteractive) {
                                if (!result) {
                                    displayText = wordData.gundul;
                                } else if (result.status === 'wrong') {
                                    displayText = result.selectedOption;
                                }
                            }

                            const canClick = isInteractive && (isActive || (result && result.status === 'wrong'));

                            let boxClass = "inline-flex justify-center px-1 rounded transition-all duration-300 relative ";
                            let style = { marginLeft: 'var(--word-spacing)' };

                            if (isInteractive) {
                                if (!result) {
                                    // Unanswered state
                                    boxClass += "border-2 border-dashed ";
                                    if (isActive) {
                                        boxClass += "border-teal-500 bg-teal-50 dark:bg-teal-900/30 cursor-pointer animate-pulse ";
                                    } else {
                                        boxClass += "border-gray-300 text-gray-400 ";
                                    }
                                } else if (result.status === 'correct') {
                                    boxClass += "text-green-600 font-bold ";
                                } else if (result.status === 'wrong') {
                                    boxClass += "text-red-500 decoration-wavy decoration-red-500 cursor-pointer ";
                                }
                            }

                            return (
                                <span
                                    key={wIndex}
                                    className={boxClass}
                                    style={style}
                                    onClick={() => canClick && handleWordClick(pIndex, wIndex)}
                                >
                                    {displayText}
                                </span>
                            );
                        })}
                    </p>
                ))}

                {/* Tasykil Popup System */}
                {showPopup && popupWord && (() => {
                    const wordResult = results[popupWord.id];
                    const isReviewMode = wordResult && wordResult.status === 'wrong';

                    return (
                        <div
                            className="absolute inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-[1px] rounded-xl"
                            onClick={(e) => {
                                // Close if clicked on backdrop
                                if (e.target === e.currentTarget) handleClosePopup();
                            }}
                        >
                            <div className={`p-6 rounded-2xl shadow-2xl border-2 transform transition-all scale-100 max-w-sm w-full mx-4 ${isReviewMode ? 'bg-red-50 dark:bg-slate-800 border-red-200 dark:border-red-900' : 'bg-[#f0f4e8] dark:bg-slate-700 border-yellow-600/30'}`}>
                                <div className="text-center mb-4">
                                    <span className={`text-sm font-bold ${isReviewMode ? 'text-red-500' : 'text-gray-500'}`}>
                                        {isReviewMode ? 'Jawaban Salah' : 'Pilih Harakat yang Benar:'}
                                    </span>
                                    <div className="text-3xl mt-2 font-bold font-arabic text-gray-800 dark:text-white border-b-2 border-dashed border-gray-300 pb-2 inline-block px-4">
                                        {popupWord.gundul}
                                    </div>
                                </div>
                                <div className="flex flex-col gap-3">
                                    {currentOptions.map((option, idx) => {
                                        let btnClass = "w-full py-3 px-4 border rounded-xl transition-all font-arabic text-2xl text-center shadow-sm ";

                                        if (isReviewMode) {
                                            btnClass += "cursor-default ";
                                            if (option === popupWord.berharakat) {
                                                // Correct Answer
                                                btnClass += "bg-green-100 border-green-500 text-green-700 dark:bg-green-900/50 dark:text-green-300 dark:border-green-500 font-bold ";
                                            } else if (option === wordResult.selectedOption) {
                                                // Selected Wrong Answer
                                                btnClass += "bg-red-100 border-red-500 text-red-700 dark:bg-red-900/50 dark:text-red-300 dark:border-red-500 ";
                                            } else {
                                                // Other Options
                                                btnClass += "bg-gray-50 text-gray-400 border-gray-200 dark:bg-slate-800/50 dark:text-gray-600 dark:border-slate-700 opacity-50 ";
                                            }
                                        } else {
                                            // Normal Mode
                                            btnClass += "bg-white/50 hover:bg-white dark:bg-slate-600 dark:hover:bg-slate-500 border-gray-200 dark:border-slate-500 hover:shadow-md active:scale-95 cursor-pointer ";
                                        }

                                        return (
                                            <button
                                                key={idx}
                                                onClick={() => !isReviewMode && handleOptionSelect(option)}
                                                className={btnClass}
                                                disabled={isReviewMode}
                                            >
                                                {option}
                                            </button>
                                        );
                                    })}
                                </div>
                                <button
                                    onClick={handleClosePopup}
                                    className="mt-6 text-xs text-gray-500 hover:text-gray-700 w-full text-center hover:underline"
                                >
                                    {isReviewMode ? 'Tutup' : 'Batal'}
                                </button>
                            </div>
                        </div>
                    );
                })()}

            </div>
        </div>
    );
};

export default TasykilMode;
