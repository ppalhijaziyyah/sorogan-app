import React, { useState, useContext } from 'react';
import { useLesson } from '../hooks/useLesson';
import { AppContext } from '../contexts/AppContext';
import Word from './Word';
import BottomSlider from './ui/BottomSlider';
import Quiz from './Quiz';
import DisplaySettings from './ui/DisplaySettings';

const LearningPage = ({ lessonId, onBack }) => {
  const { lessonData, loading, error } = useLesson(lessonId);
  const { completedLessons, toggleLessonComplete, settings, updateSettings, resetSettings } = useContext(AppContext);

  const [wordStates, setWordStates] = useState({});
  const [sliderState, setSliderState] = useState({ isOpen: false });
  const [isQuizMode, setQuizMode] = useState(false);
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [currentFocusParagraph, setCurrentFocusParagraph] = useState(0);

  const handleWordClick = (pIndex, wIndex) => {
    const wordId = `${pIndex}-${wIndex}`;
    setCurrentFocusParagraph(pIndex);
    setWordStates(prev => {
      const s = prev[wordId] || {};
      return { ...prev, [wordId]: { showHarakat: settings.isHarakatMode ? !s.showHarakat : s.showHarakat, showTranslation: settings.isTranslationMode ? !s.showTranslation : s.showTranslation } };
    });
  };

  const handleWordDoubleClick = (wordData) => {
    if (wordData.irab) {
      setSliderState({ isOpen: true, title: wordData.berharakat, content: <p>{wordData.irab}</p>, type: 'irab' });
    }
  };

  const showFullTranslation = () => {
    setSliderState({ isOpen: true, title: 'Terjemahan Lengkap', content: <p>{lessonData.fullTranslation}</p>, type: 'translation' });
  };

  if (loading) return <div className="text-center p-8">Memuat pelajaran...</div>;
  if (error) return <div className="text-center p-8 text-red-500"><strong>Error:</strong> {error}</div>;
  if (!lessonData) return null;

  const isCompleted = completedLessons.includes(lessonId);

  if (isQuizMode) {
    return <Quiz lessonData={lessonData} onFinishQuiz={() => setQuizMode(false)} lessonId={lessonId} />;
  }

  return (
    <div>
      <header className="flex justify-between items-center mb-8">
        <button onClick={onBack} title="Kembali" className="p-2 rounded-lg shadow-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600">&larr;</button>
        <h1 className="text-2xl md:text-3xl font-bold text-teal-accent font-arabic text-right truncate" style={{fontSize: 'var(--arabic-font-size)'}}>{lessonData.titleArabic || lessonData.title}</h1>
        <div className="relative">
            <button onClick={() => setSettingsOpen(o => !o)} title="Pengaturan Tampilan" className="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16"><path fillRule="evenodd" d="M10.5 1a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V4H1.5a.5.5 0 0 1 0-1H10V1.5a.5.5 0 0 1 .5-.5M12 3.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5m-6.5 2A.5.5 0 0 1 6 6v1.5h8.5a.5.5 0 0 1 0 1H6V10a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5M1 8a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2A.5.5 0 0 1 1 8m9.5 2a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V13H1.5a.5.5 0 0 1 0-1H10v-1.5a.5.5 0 0 1 .5-.5m1.5 2.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5"/></svg>
            </button>
            <DisplaySettings isOpen={isSettingsOpen} settings={settings} updateSettings={updateSettings} onReset={resetSettings} />
        </div>
      </header>

      <main>
        {/* Toolbar, etc. */}
        <div id="text-container" className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-inner text-right leading-loose font-arabic select-none" dir="rtl" style={{fontSize: 'var(--arabic-font-size)', lineHeight: 'var(--arabic-line-height)'}}>
          {lessonData.textData.map((paragraph, pIndex) => (
            <p key={pIndex} className={`mb-6 transition-opacity duration-300 ${settings.isFocusMode && pIndex !== currentFocusParagraph ? 'paragraph-unfocused' : ''}`}>
              {paragraph.map((wordData, wIndex) => (
                <Word key={wIndex} displayText={(settings.showAllHarakat || (wordStates[`${pIndex}-${wIndex}`] && wordStates[`${pIndex}-${wIndex}`].showHarakat)) ? wordData.berharakat : wordData.gundul} tooltipText={(settings.isTranslationMode && wordStates[`${pIndex}-${wIndex}`] && wordStates[`${pIndex}-${wIndex}`].showTranslation) ? wordData.terjemahan : null} onClick={() => handleWordClick(pIndex, wIndex)} onDoubleClick={() => handleWordDoubleClick(wordData)} />
              ))}
            </p>
          ))}
        </div>
        
        {lessonData.reference && (
            <div className="mt-6"><p className="text-sm italic text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-md border-l-4 border-teal-500"><strong>Sumber:</strong> {lessonData.reference}</p></div>
        )}

        <div className="text-center mt-8 pt-6 border-t border-gray-300 dark:border-gray-700 flex flex-col sm:flex-row justify-center items-center gap-4">
            {lessonData.fullTranslation && <button onClick={showFullTranslation} className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded-lg shadow-md">Lihat Terjemahan Lengkap</button>}
            {lessonData.quizData && lessonData.quizData.length > 0 && <button onClick={() => setQuizMode(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg shadow-md">Mulai Kuis</button>}
            <button onClick={() => toggleLessonComplete(lessonId)} className={`font-semibold py-2 px-5 rounded-lg shadow-md transition-all ${isCompleted ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500'}`}>{isCompleted ? '✓ Selesai Dipelajari' : 'Tandai sebagai Selesai'}</button>
        </div>
      </main>

      <BottomSlider sliderState={sliderState} onClose={() => setSliderState({ isOpen: false })} />
    </div>
  );
};

export default LearningPage;