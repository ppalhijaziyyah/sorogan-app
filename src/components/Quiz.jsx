import React, { useState, useEffect, useMemo, useContext } from 'react';
import { AppContext } from '../contexts/AppContext';
import ConfirmationModal from './ui/ConfirmationModal'; // Import modal

// Helper function to shuffle an array
const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);

const Quiz = ({ lessonData, onFinishQuiz, lessonId }) => {
  const { toggleLessonComplete } = useContext(AppContext);
  
  // --- State Management ---
  const [mode, setMode] = useState('in_progress'); // in_progress, finished, review
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null); // The option string the user selected
  const [score, setScore] = useState(0);
  const [isExitModalOpen, setIsExitModalOpen] = useState(false); // State for exit confirmation

  // ... (rest of the component logic remains the same)

  // --- Initialization ---
  useEffect(() => {
    if (lessonData.quizData) {
      setShuffledQuestions(shuffleArray(lessonData.quizData));
    }
  }, [lessonData]);

  const currentQuestion = useMemo(() => {
    if (!shuffledQuestions || shuffledQuestions.length === 0) return null;
    const question = shuffledQuestions[currentIndex];
    return {
      ...question,
      shuffledOptions: shuffleArray(question.options)
    };
  }, [currentIndex, shuffledQuestions]);

  // --- Event Handlers ---
  const handleAnswer = (option) => {
    if (selectedAnswer) return; 

    setSelectedAnswer(option);
    const correctAnswer = currentQuestion.options[currentQuestion.correctAnswer];
    const isCorrect = option === correctAnswer;

    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    setUserAnswers(prev => [...prev, { ...currentQuestion, selectedAnswer: option, correctAnswer, isCorrect }]);

    setTimeout(() => {
      if (currentIndex < shuffledQuestions.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setSelectedAnswer(null);
      } else {
        setMode('finished');
        toggleLessonComplete(lessonId);
      }
    }, 2000);
  };

  // --- Render Logic ---

  if (mode === 'finished') {
    return (
      <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-xl">
        <h2 className="text-2xl font-bold mb-4">Kuis Selesai!</h2>
        <p className="text-xl mb-6">Skor Anda: <span className="font-bold text-teal-500">{score}</span> dari {shuffledQuestions.length}</p>
        <div className="flex justify-center gap-4">
          <button onClick={() => { setMode('review'); setCurrentIndex(0); }} className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700">Tinjau Kuis</button>
          <button onClick={onFinishQuiz} className="px-6 py-2 bg-gray-600 text-white font-bold rounded-lg hover:bg-gray-700">Kembali</button>
        </div>
      </div>
    );
  }

  if (mode === 'review') {
    const reviewItem = userAnswers[currentIndex];
    const kahootStyles = [ { color: 'bg-red-600', shape: '▲' }, { color: 'bg-blue-600', shape: '◆' }, { color: 'bg-yellow-500', shape: '●' }, { color: 'bg-green-600', shape: '■' } ];

    return (
      <div className="p-4 md:p-6 bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-3xl mx-auto">
        <p className="text-center font-semibold mb-4 text-lg">Meninjau Pertanyaan {currentIndex + 1}</p>
        <h2 className="text-xl md:text-2xl font-bold mb-4 text-center min-h-[6rem] flex items-center justify-center">{reviewItem.question}</h2>
        {reviewItem.context && <p className="font-arabic text-3xl text-center mb-6" dir="rtl">{reviewItem.context}</p>}
        <div className="grid grid-cols-2 gap-3 md:gap-4">
          {reviewItem.options.map((option, index) => {
            let buttonClass = 'opacity-30 grayscale';
            if (option === reviewItem.correctAnswer) buttonClass = 'opacity-100 border-4 border-white';
            if (option === reviewItem.selectedAnswer && !reviewItem.isCorrect) buttonClass = 'opacity-70 grayscale';
            return (
              <button key={index} disabled className={`w-full p-4 rounded-lg text-white font-bold flex items-center justify-start text-left min-h-[5rem] transition-all ${kahootStyles[index % 4].color} ${buttonClass}`}>
                <span className="flex-grow text-base md:text-lg">{option}</span>
                <span className="text-3xl">{option === reviewItem.correctAnswer ? '✓' : (option === reviewItem.selectedAnswer ? '✗' : kahootStyles[index % 4].shape)}</span>
              </button>
            );
          })}
        </div>
        {reviewItem.explanation && (
          <div className="mt-6 p-4 bg-yellow-100 dark:bg-yellow-800/30 border-l-4 border-yellow-500 rounded-r-lg">
            <h4 className="font-bold text-lg mb-2 text-yellow-800 dark:text-yellow-300">Penjelasan</h4>
            <p className="text-yellow-900 dark:text-yellow-200">{reviewItem.explanation}</p>
          </div>
        )}
        <div className="flex justify-between mt-6">
          <button onClick={() => setCurrentIndex(i => i - 1)} disabled={currentIndex === 0} className="px-4 py-2 bg-gray-500 text-white font-bold rounded-lg disabled:opacity-50">Sebelumnya</button>
          <button onClick={() => setMode('finished')} className="px-4 py-2 bg-teal-600 text-white font-bold rounded-lg">Kembali ke Skor</button>
          <button onClick={() => setCurrentIndex(i => i + 1)} disabled={currentIndex === userAnswers.length - 1} className="px-4 py-2 bg-gray-500 text-white font-bold rounded-lg disabled:opacity-50">Berikutnya</button>
        </div>
      </div>
    );
  }

  if (!currentQuestion) return <div className="text-center">Memuat kuis...</div>;

  const correctAnswerText = currentQuestion.options[currentQuestion.correctAnswer];
  const kahootStyles = [ { color: 'bg-red-600', shape: '▲' }, { color: 'bg-blue-600', shape: '◆' }, { color: 'bg-yellow-500', shape: '●' }, { color: 'bg-green-600', shape: '■' } ];

  return (
    <>
      <ConfirmationModal 
        isOpen={isExitModalOpen}
        message="Apakah Anda yakin ingin keluar dari kuis? Progres akan hilang."
        onConfirm={onFinishQuiz} // Go back to lesson page
        onCancel={() => setIsExitModalOpen(false)}
      />
      <div className="p-4 md:p-6 bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <p className="font-semibold text-lg">Pertanyaan {currentIndex + 1} dari {shuffledQuestions.length}</p>
          <button onClick={() => setIsExitModalOpen(true)} className="text-2xl text-gray-500 hover:text-red-500 transition-colors">&times;</button>
        </div>
        <h2 className="text-xl md:text-2xl font-bold mb-4 text-center min-h-[6rem] flex items-center justify-center">{currentQuestion.question}</h2>
        {currentQuestion.context && <p className="font-arabic text-3xl text-center mb-6" dir="rtl">{currentQuestion.context}</p>}
        <div className="grid grid-cols-2 gap-3 md:gap-4">
          {currentQuestion.shuffledOptions.map((option, index) => (
            <button 
              key={index}
              onClick={() => handleAnswer(option)}
              disabled={!!selectedAnswer}
              className={`w-full p-4 rounded-lg text-white font-bold flex items-center justify-start text-left min-h-[5rem] transition-all duration-300 ${kahootStyles[index].color} ${selectedAnswer ? (option === correctAnswerText ? 'scale-105 border-4 border-white' : 'opacity-30 grayscale') : 'hover:scale-105'}`}>
              <span className="flex-grow text-base md:text-lg">{option}</span>
              <span className="text-3xl opacity-70">{kahootStyles[index].shape}</span>
            </button>
          ))}
        </div>
        <div className="mt-6 text-center font-bold h-8 text-2xl transition-all duration-300">
          {selectedAnswer && (
            <span className={selectedAnswer === correctAnswerText ? 'text-green-500' : 'text-red-500'}>
              {selectedAnswer === correctAnswerText ? 'Jawaban Benar!' : 'Jawaban Kurang Tepat'}
            </span>
          )}
        </div>
      </div>
    </>
  );
};

export default Quiz;
