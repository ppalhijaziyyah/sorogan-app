import React, { useState, useContext, Suspense } from 'react';
import { AppContext } from './contexts/AppContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import LearningPage from './components/LearningPage';

function App() {
  const { theme } = useContext(AppContext);
  const [currentPage, setCurrentPage] = useState('home'); // 'home' or 'learning'
  const [selectedLesson, setSelectedLesson] = useState(null); // e.g., 'ibtidai-01'

  const navigateToLearningPage = (lessonId) => {
    setSelectedLesson(lessonId);
    setCurrentPage('learning');
  };

  const navigateToHome = () => {
    setSelectedLesson(null);
    setCurrentPage('home');
  };

  return (
    <div className={`font-sans`}>
      <div className="min-h-screen bg-light-bg text-light-text dark:bg-dark-bg dark:text-dark-text transition-colors duration-300">
        <Header />
        <main className="px-4 py-8">
          <Suspense fallback={<div className="text-center">Memuat...</div>}>
            {currentPage === 'home' && <HomePage onSelectLesson={navigateToLearningPage} />}
            {currentPage === 'learning' && <LearningPage lessonId={selectedLesson} onBack={navigateToHome} />}
          </Suspense>
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default App;
