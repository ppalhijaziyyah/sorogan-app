import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

import Footer from './components/Footer';
import HomePage from './components/HomePage';
import LearningPage from './components/LearningPage';
import SponsorsPage from './components/SponsorsPage';
import ContributorsPage from './components/ContributorsPage';
import BottomSlider from './components/ui/BottomSlider';
import ScrollToTopButton from './components/ui/ScrollToTopButton';

function App() {
  const [sliderState, setSliderState] = React.useState({ isOpen: false });

  return (
    <div className={`font-sans`}>
      <div className="min-h-screen bg-gradient-light dark:bg-gradient-dark text-light-text dark:text-dark-text transition-colors duration-500">
        
        <main className="px-4 py-8">
          <Suspense fallback={<div className="text-center">Memuat...</div>}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/belajar/:lessonSlug" element={<LearningPage setSliderState={setSliderState} />} />
              <Route path="/sponsors" element={<SponsorsPage />} />
              <Route path="/contributors" element={<ContributorsPage />} />
            </Routes>
          </Suspense>
        </main>
        <Footer setSliderState={setSliderState} />
        <BottomSlider 
          sliderState={sliderState} 
          onClose={() => {
            if (sliderState.onClose) {
              sliderState.onClose();
            }
            setSliderState({ isOpen: false });
          }} 
        />
        <ScrollToTopButton />
      </div>
    </div>
  );
}

export default App;
