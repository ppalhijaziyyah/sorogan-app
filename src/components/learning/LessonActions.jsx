import React, { useContext } from 'react';
import { AppContext } from '../../contexts/AppContext';

const LessonActions = ({ lessonData, lessonId, setSliderState, setQuizMode }) => {
  const { completedLessons, toggleLessonComplete } = useContext(AppContext);
  const isCompleted = completedLessons.includes(lessonId);

  return (
    <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row justify-center items-center gap-4 w-full">
      {lessonData.quizData && lessonData.quizData.length > 0 && (
        <button 
          onClick={() => setQuizMode(true)} 
          className="flex items-center gap-2 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-bold text-lg py-3 px-8 rounded-full shadow-lg hover:shadow-cyan-500/30 hover:-translate-y-0.5 transition-all w-full sm:w-auto justify-center"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Mulai Kuis
        </button>
      )}
      
      <button 
        onClick={() => toggleLessonComplete(lessonId)} 
        className={`flex items-center gap-2 font-semibold text-base py-3 px-6 rounded-full transition-all w-full sm:w-auto justify-center border-2 ${
          isCompleted 
            ? 'bg-emerald-500 border-emerald-500 text-white shadow-md hover:bg-emerald-600 hover:border-emerald-600 hover:-translate-y-0.5' 
            : 'bg-transparent border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-teal-500 hover:text-teal-600 dark:hover:text-teal-400 hover:-translate-y-0.5'
        }`}
      >
        {isCompleted ? (
          <>
            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
            </svg>
            Selesai Dipelajari
          </>
        ) : (
          <>
            <div className="w-4 h-4 flex-shrink-0 rounded border-2 border-current opacity-70"></div>
            Tandai Selesai
          </>
        )}
      </button>
    </div>
  );
};

export default LessonActions;