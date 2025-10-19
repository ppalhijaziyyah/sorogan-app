import React, { useState, useContext, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLesson } from '../hooks/useLesson';
import { AppContext } from '../contexts/AppContext';
import Quiz from './Quiz';
import LearningToolbar from './LearningToolbar';
import Tutorial from './ui/Tutorial';
import masterIndex from '../data/master-index.json';
import { generateSlug } from '../lib/utils';
import LessonHeader from './learning/LessonHeader';
import LessonContent from './learning/LessonContent';
import LessonActions from './learning/LessonActions'; // Import the new LessonActions
import LessonSkeleton from './skeletons/LessonSkeleton';

const LearningPage = ({ setSliderState }) => {
  const { lessonSlug } = useParams();
  const navigate = useNavigate();

  const lessonId = useMemo(() => {
    const foundLesson = masterIndex.find(lesson => generateSlug(lesson.title) === lessonSlug);
    return foundLesson ? foundLesson.id : null;
  }, [lessonSlug]);

  const { lessonData, loading, error } = useLesson(lessonId);
  const { settings, updateSettings, resetSettings } = useContext(AppContext);

  const [isQuizMode, setQuizMode] = useState(false);
  const [isSettingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [lessonSlug]);

  if (!lessonId) return <div className="text-center p-8 text-red-500">Pelajaran tidak ditemukan.</div>;
  if (loading) return <LessonSkeleton />;
  if (error) return <div className="text-center p-8 text-red-500"><strong>Error:</strong> {error}</div>;
  if (!lessonData) return null;

  if (isQuizMode) {
    return <Quiz lessonData={lessonData} onFinishQuiz={() => setQuizMode(false)} lessonId={lessonId} />;
  }

  return (
    <div className="max-w-5xl mx-auto">
      <LessonHeader 
        titleArabic={lessonData.titleArabic}
        title={lessonData.title}
        setSettingsOpen={setSettingsOpen}
        isSettingsOpen={isSettingsOpen}
        settings={settings}
        updateSettings={updateSettings}
        onReset={resetSettings}
      />

      <main>
        <LearningToolbar />
        <LessonContent lessonData={lessonData} setSliderState={setSliderState} />
        
        {lessonData.reference && (
            <div className="mt-6"><p className="text-sm italic text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-md border-l-4 border-teal-500"><strong>Sumber:</strong> {lessonData.reference}</p></div>
        )}
        
        <div className="text-center mt-4 text-gray-600 dark:text-gray-400"><p><span className="font-semibold">Klik sekali</span> untuk mode aktif. <span className="font-semibold">Klik dua kali</span> untuk i'rab.</p></div>

        <LessonActions 
          lessonData={lessonData}
          lessonId={lessonId}
          setSliderState={setSliderState}
          setQuizMode={setQuizMode}
        />
      </main>
      <Tutorial setSliderState={setSliderState} />
    </div>
  );
};

export default LearningPage;