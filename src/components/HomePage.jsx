import React, { useState, useEffect, useContext, useMemo } from 'react';
import { AppContext } from '../contexts/AppContext';
import masterIndex from '../data/master-index.json';

const levelDetails = {
    'Ibtida’i': { title: 'Tingkat Ibtida’i (Pemula)', color: 'green' },
    'Mutawassit': { title: 'Tingkat Mutawassit (Menengah)', color: 'blue' },
    'Mutaqaddim': { title: 'Tingkat Mutaqaddim (Mahir)', color: 'purple' }
};

const levelsInOrder = ['Ibtida’i', 'Mutawassit', 'Mutaqaddim'];

const FilterButtons = ({ selectedLevel, setSelectedLevel }) => {
  return (
    <div className="flex flex-wrap justify-center gap-2 mb-8">
      <button 
        onClick={() => setSelectedLevel('Semua')} 
        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedLevel === 'Semua' ? 'bg-teal-accent text-white shadow-lg' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'}`}>
          Semua
      </button>
      {levelsInOrder.map(level => (
        <button 
          key={level}
          onClick={() => setSelectedLevel(level)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedLevel === level ? 'bg-teal-accent text-white shadow-lg' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'}`}>
          {level}
        </button>
      ))}
    </div>
  );
};

const LessonCard = ({ lesson, isCompleted, onSelect }) => {
  return (
    <div 
      onClick={() => onSelect(lesson.id)}
      className={`bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-white/20 rounded-lg shadow-md p-6 hover:shadow-xl hover:-translate-y-1 cursor-pointer transition-all relative overflow-hidden flex flex-col ${isCompleted ? 'opacity-70' : ''}`}>
      {isCompleted && (
        <div className="absolute top-3 right-3 bg-emerald-500 text-white rounded-full w-7 h-7 flex items-center justify-center" title="Selesai">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
        </div>
      )}
      <div className="flex-grow">
          <h3 className="text-xl font-bold font-arabic text-right text-gray-800 dark:text-gray-100">{lesson.titleArabic || ''}</h3>
          <p className="text-md font-semibold mt-1 text-teal-600 dark:text-teal-400">{lesson.title}</p>
          <p className="text-sm italic text-gray-500 dark:text-gray-400 mt-3">"{lesson.preview || ''}"</p>
      </div>
    </div>
  );
};


const HomePage = ({ onSelectLesson }) => {
  const { completedLessons } = useContext(AppContext);
  const [selectedLevel, setSelectedLevel] = useState('Semua');

  const lessonsByLevel = useMemo(() => {
    const filtered = selectedLevel === 'Semua' 
      ? masterIndex 
      : masterIndex.filter(item => item.level === selectedLevel);

    // Group by level
    return filtered.reduce((acc, lesson) => {
        const level = lesson.level;
        if (!acc[level]) {
          acc[level] = [];
        }
        acc[level].push(lesson);
        return acc;
      }, {});
  }, [selectedLevel]);

  const renderedLevels = levelsInOrder.filter(level => lessonsByLevel[level] && lessonsByLevel[level].length > 0);

  return (
    <div className="container mx-auto">
      <header className="text-center mb-10">
        <h1 className="text-5xl md:text-6xl font-bold text-teal-accent mb-2">Sorogan</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">Belajar Membaca dan Memahami Teks Arab Gundul</p>
      </header>

      <FilterButtons selectedLevel={selectedLevel} setSelectedLevel={setSelectedLevel} />
      
      <div className="space-y-12">
        {renderedLevels.length > 0 ? renderedLevels.map(level => (
          <div key={level}>
            <h2 className="text-2xl font-bold mb-4 pb-2 border-b-2 text-teal-600 dark:text-teal-400 border-teal-500/50">
              {levelDetails[level]?.title || level}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lessonsByLevel[level].map(lesson => (
                <LessonCard 
                  key={lesson.id} 
                  lesson={lesson} 
                  isCompleted={completedLessons.includes(lesson.id)}
                  onSelect={onSelectLesson}
                />
              ))}
            </div>
          </div>
        )) : (
          <p className="text-center text-gray-500 dark:text-gray-400 mt-8">Tidak ada pelajaran yang ditemukan untuk filter yang dipilih.</p>
        )}
      </div>
    </div>
  );
};

export default HomePage;
