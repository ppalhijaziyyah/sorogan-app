import React, { useState, useContext, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../contexts/AppContext';
import masterIndex from '../data/master-index.json';
import sponsorsAndContributors from '../data/sponsors-contributors.json';
import UserBadge from './ui/UserBadge';
import { generateSlug } from '../lib/utils';

const levelDetails = {
    'Ibtida’i': { title: 'Tingkat Ibtida’i (Pemula)', color: 'green' },
    'Mutawassit': { title: 'Tingkat Mutawassit (Menengah)', color: 'blue' },
    'Mutaqaddim': { title: 'Tingkat Mutaqaddim (Mahir)', color: 'purple' }
};

const levelsInOrder = ['Ibtida’i', 'Mutawassit', 'Mutaqaddim'];

const FilterButtons = ({ selectedLevel, setSelectedLevel }) => {
  const getButtonClass = (level) => {
    const isActive = selectedLevel === level;
    return `px-5 py-2 rounded-full text-sm font-medium transition-all transform ${
      isActive 
        ? 'text-white shadow-lg bg-gradient-to-r from-teal-400 to-sky-500 -translate-y-0.5' 
        : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
    }`;
  };

  return (
    <div className="flex flex-wrap justify-center gap-3 mb-8">
      <button 
        onClick={() => setSelectedLevel('Semua')} 
        className={getButtonClass('Semua')}>
          Semua
      </button>
      {levelsInOrder.map(level => (
        <button 
          key={level}
          onClick={() => setSelectedLevel(level)}
          className={getButtonClass(level)}>
          {level}
        </button>
      ))}
    </div>
  );
};

const LessonCard = ({ lesson, isCompleted, onSelect }) => {
  return (
    <div 
      onClick={() => onSelect(lesson.slug)} // Use lesson.slug for navigation
      className={`bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-white/20 rounded-lg shadow-md p-6 hover:shadow-xl hover:-translate-y-1 cursor-pointer transition-all relative overflow-hidden flex flex-col ${isCompleted ? 'opacity-70' : ''}`}>
      {isCompleted && (
        <div className="absolute top-2 left-2 bg-emerald-500 text-white rounded-full w-7 h-7 flex items-center justify-center" title="Selesai">
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


const HomePage = () => {
  const { completedLessons } = useContext(AppContext);
  const [selectedLevel, setSelectedLevel] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSelectLesson = (lessonSlug) => {
    navigate(`/belajar/${lessonSlug}`);
  };

  const lessonsWithSlugs = useMemo(() => {
    return masterIndex.map(lesson => ({
      ...lesson,
      slug: generateSlug(lesson.title) // Generate slug from title
    }));
  }, []);

  const lessonsByLevel = useMemo(() => {
    let filteredLessons = lessonsWithSlugs;

    // 1. Terapkan filter pencarian jika ada query
    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      filteredLessons = lessonsWithSlugs.filter(lesson => 
        lesson.title.toLowerCase().includes(lowercasedQuery) ||
        (lesson.titleArabic && lesson.titleArabic.toLowerCase().includes(lowercasedQuery))
      );
    }

    // 2. Terapkan filter level pada hasil pencarian
    if (selectedLevel !== 'Semua') {
      filteredLessons = filteredLessons.filter(item => item.level === selectedLevel);
    }

    // 3. Kelompokkan hasil akhir berdasarkan level
    return filteredLessons.reduce((acc, lesson) => {
        const level = lesson.level;
        if (!acc[level]) {
          acc[level] = [];
        }
        acc[level].push(lesson);
        return acc;
      }, {});
  }, [selectedLevel, lessonsWithSlugs, searchQuery]);

  const renderedLevels = levelsInOrder.filter(level => lessonsByLevel[level] && lessonsByLevel[level].length > 0);

  return (
    <div className="container mx-auto max-w-5xl">
      <header className="text-center mb-8">
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">Belajar Membaca dan Memahami Teks Arab Gundul</p>
        <hr className="border-gray-300 dark:border-gray-700 max-w-md mx-auto" />
        <p className="text-sm mt-4 text-gray-500 dark:text-gray-400">Pilih Teks untuk Mulai Belajar</p>
      </header>

      <div className="mb-8 max-w-lg mx-auto relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
          <svg className="h-5 w-5 text-gray-500 dark:text-gray-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
        </div>
        <input 
          type="text"
          placeholder="Cari pelajaran (cth: Rukun Islam)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-5 py-3 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 shadow-md focus:ring-2 focus:ring-teal-400 focus:outline-none transition-all"
        />
      </div>

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
                  onSelect={handleSelectLesson}
                />
              ))}
            </div>
          </div>
        )) : (
          <p className="text-center text-gray-500 dark:text-gray-400 mt-8">Tidak ada pelajaran yang ditemukan untuk filter yang dipilih.</p>
        )}
      </div>

      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-4 pb-2 border-b-2 text-teal-600 dark:text-teal-400 border-teal-500/50">Sponsor & Kontributor</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4 text-center md:text-left">Sponsor</h3>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              {sponsorsAndContributors.filter(u => u.type === 'sponsor').slice(0, 2).map(user => (
                <UserBadge key={user.id} user={user} />
              ))}
            </div>
            <Link to="/dukung-kami#sponsors" className="block text-center mt-4 text-teal-500 dark:text-teal-400 hover:underline">Lihat semua sponsor</Link>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4 text-center md:text-left">Kontributor</h3>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              {sponsorsAndContributors.filter(u => u.type === 'contributor').slice(0, 2).map(user => (
                <UserBadge key={user.id} user={user} />
              ))}
            </div>
            <Link to="/dukung-kami#contributors" className="block text-center mt-4 text-teal-500 dark:text-teal-400 hover:underline">Lihat semua kontributor</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
