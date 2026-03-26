import React, { useState, useContext, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../contexts/AppContext";
import masterIndex from "../data/master-index.json";
import sponsorsAndContributors from "../data/sponsors-contributors.json";
import UserBadge from "../components/ui/UserBadge";
import { generateSlug } from "../lib/utils";
import { parseExcelToLesson } from '../utils/excelParser';
import { appConfig } from '../config/app-config';

const levelDetails = {
  "Ibtida’i": { title: "Tingkat Ibtida’i (Pemula)", color: "green" },
  Mutawassit: { title: "Tingkat Mutawassit (Menengah)", color: "blue" },
  Mutaqaddim: { title: "Tingkat Mutaqaddim (Mahir)", color: "purple" },
};

const levelsInOrder = ["Ibtida’i", "Mutawassit", "Mutaqaddim"];

const FilterButtons = ({ selectedLevel, setSelectedLevel }) => {
  const getButtonClass = (level) => {
    const isActive = selectedLevel === level;
    return `px-5 py-2 rounded-full text-sm font-medium transition-all transform ${isActive
      ? "text-white shadow-lg bg-gradient-to-r from-teal-400 to-sky-500 -translate-y-0.5"
      : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
      }`;
  };

  return (
    <div className="flex flex-wrap justify-center gap-3 mb-8">
      <button
        onClick={() => setSelectedLevel("Semua")}
        className={getButtonClass("Semua")}
      >
        Semua
      </button>
      {levelsInOrder.map((level) => (
        <button
          key={level}
          onClick={() => setSelectedLevel(level)}
          className={getButtonClass(level)}
        >
          {level}
        </button>
      ))}
    </div>
  );
};

const LessonCard = ({ lesson, isCompleted, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(lesson.level, lesson.slug)} // Use lesson.slug and level for navigation
      className={`bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-white/20 rounded-lg shadow-md p-6 hover:shadow-xl hover:-translate-y-1 cursor-pointer transition-all relative overflow-hidden flex flex-col ${isCompleted ? "opacity-70" : ""
        }`}
    >
      {isCompleted && (
        <div
          className="absolute top-2 left-2 bg-emerald-500 text-white rounded-full w-7 h-7 flex items-center justify-center"
          title="Selesai"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )}
      <div className="flex-grow">
        <h3 className="text-xl font-bold font-arabic text-right text-gray-800 dark:text-gray-100">
          {lesson.titleArabic || ""}
        </h3>
        <p className="text-md font-semibold mt-1 text-teal-600 dark:text-teal-400">
          {lesson.title}
        </p>
        <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400 mt-3 font-arabic text-right line-clamp-2" dir="rtl">
          {lesson.preview || ""}
        </p>
      </div>
    </div>
  );
};

const PreviewLessonCard = ({ level }) => {
  const { previewLessons, setPreviewLesson, clearPreviewLesson } = useContext(AppContext);
  const fileInputRef = React.useRef(null);
  const navigate = useNavigate();

  const previewLesson = previewLessons[level];

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const parsedData = await parseExcelToLesson(file);
      // Ensure the generated lesson belongs to this level block for contextual display
      parsedData.level = level;
      setPreviewLesson(level, parsedData);
      event.target.value = ''; // reset input
    } catch (err) {
      console.error(err);
      alert(err.message || 'Gagal memproses file Excel. Pastikan format sesuai dengan template.');
    }
  };

  const handleStartPreview = () => {
    const levelIdMap = { "Ibtida’i": '1', "Mutawassit": '2', "Mutaqaddim": '3' };
    const currLevelId = levelIdMap[level] || '1';
    navigate(`/belajar/${currLevelId}/preview-lesson`);
  };

  const showLoadedState = !!previewLesson;

  return (
    <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-2 border-dashed border-teal-400/50 hover:border-teal-500 rounded-lg shadow-sm p-6 flex flex-col items-center justify-center text-center transition-all min-h-[200px]">
      <input
        type="file"
        accept=".xlsx, .xls"
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="hidden"
      />

      {showLoadedState ? (
        <div className="w-full flex-grow flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold font-arabic text-gray-800 dark:text-gray-100">{previewLesson.titleArabic}</h3>
            <p className="text-md font-semibold mt-1 text-teal-600 dark:text-teal-400">{previewLesson.title}</p>
            <p className="text-xs text-gray-400 mt-2">Mode Pratinjau Sementara</p>
          </div>
          <div className="mt-4 flex flex-col gap-2">
            <button onClick={handleStartPreview} className="bg-teal-500 hover:bg-teal-600 text-white rounded py-2 px-4 shadow font-bold text-sm transition">👉 Mulai Preview</button>
            <div className="flex gap-2">
              <button onClick={() => fileInputRef.current.click()} className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded py-1 px-2 text-xs font-bold transition">🔄 Ganti Materi</button>
              <button onClick={() => clearPreviewLesson(level)} className="flex-1 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 rounded py-1 px-2 text-xs font-bold transition">🗑️ Hapus</button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center space-y-3 h-full">
          <button
            onClick={() => fileInputRef.current.click()}
            className="w-12 h-12 bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 rounded-full flex items-center justify-center text-2xl hover:bg-teal-200 dark:hover:bg-teal-900/50 hover:scale-110 transition-transform shadow-sm"
            title="Upload Excel Materi"
          >
            +
          </button>
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-2 px-2">
            <p className="font-semibold text-gray-700 dark:text-gray-300">Tes Materimu Sendiri!</p>
            <p className="text-xs mt-1 leading-relaxed">
              Unggah draf <span className="font-mono bg-gray-100 dark:bg-gray-700 px-1 rounded">.xlsx</span> Anda untuk dicoba di sini. Ingin rilis permanen ke publik? <Link to="/dukung-kami#contribute" className="text-teal-500 hover:text-teal-600 hover:underline font-bold transition-colors">Mulai Berkontribusi</Link>.
            </p>
            <a href="/1-sorogan-app-rukun-islam.xlsx" download className="inline-flex items-center gap-1 text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/30 px-3 py-1.5 rounded-full text-xs font-medium mt-2 border border-teal-100 dark:border-teal-800/50 transition-all">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              Unduh Template Excel
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

const HomePage = () => {
  const { completedLessons } = useContext(AppContext);
  const [selectedLevel, setSelectedLevel] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const isPreviewEnabled = (level) => {
    switch (level) {
      case "Ibtida’i": return appConfig.previewFeatures?.enableIbtidaiPreview ?? true;
      case "Mutawassit": return appConfig.previewFeatures?.enableMutawassitPreview ?? true;
      case "Mutaqaddim": return appConfig.previewFeatures?.enableMutaqaddimPreview ?? true;
      default: return false;
    }
  };

  const handleSelectLesson = (level, lessonSlug) => {
    const levelMap = { 'Ibtida’i': 1, 'Mutawassit': 2, 'Mutaqaddim': 3 };
    const levelId = levelMap[level] || 1;
    navigate(`/belajar/${levelId}/${lessonSlug}`);
  };

  const lessonsWithSlugs = useMemo(() => {
    return masterIndex.map((lesson) => ({
      ...lesson,
      slug: generateSlug(lesson.title), // Generate slug from title
    }));
  }, []);

  const lessonsByLevel = useMemo(() => {
    let filteredLessons = lessonsWithSlugs;

    // 1. Terapkan filter pencarian jika ada query
    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      filteredLessons = lessonsWithSlugs.filter(
        (lesson) =>
          lesson.title.toLowerCase().includes(lowercasedQuery) ||
          (lesson.titleArabic &&
            lesson.titleArabic.toLowerCase().includes(lowercasedQuery))
      );
    }

    // 2. Terapkan filter level pada hasil pencarian
    if (selectedLevel !== "Semua") {
      filteredLessons = filteredLessons.filter(
        (item) => item.level === selectedLevel
      );
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

  const renderedLevels = levelsInOrder.filter(
    (level) => lessonsByLevel[level] && lessonsByLevel[level].length > 0
  );

  return (
    <div className="container mx-auto max-w-5xl">
      <header className="text-center mb-8">
        <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-sky-500 mb-6 mt-3 max-w-4xl mx-auto">Belajar Membaca dan Memahami Teks Arab Gundul</h1>
        <hr id="lessons-anchor" className="border-gray-300 dark:border-gray-700 max-w-md mx-auto" />
        <p className="text-sm mt-4 text-gray-500 dark:text-gray-400">
          Pilih Teks untuk Mulai Belajar
        </p>
      </header>

      <div className="mb-8 max-w-lg mx-auto relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
          <svg
            className="h-5 w-5 text-gray-500 dark:text-gray-300"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            />
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

      <FilterButtons
        selectedLevel={selectedLevel}
        setSelectedLevel={setSelectedLevel}
      />

      <div className="space-y-12">
        {renderedLevels.length > 0 ? (
          renderedLevels.map((level) => (
            <div key={level}>
              <h2 className="text-2xl font-bold mb-4 pb-2 border-b-2 text-teal-600 dark:text-teal-400 border-teal-500/50">
                {levelDetails[level]?.title || level}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {lessonsByLevel[level].map((lesson) => (
                  <LessonCard
                    key={lesson.id}
                    lesson={lesson}
                    isCompleted={completedLessons.includes(lesson.id)}
                    onSelect={handleSelectLesson}
                  />
                ))}
                {isPreviewEnabled(level) && <PreviewLessonCard level={level} />}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400 mt-8">
            Tidak ada pelajaran yang ditemukan untuk filter yang dipilih.
          </p>
        )}
      </div>

      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-4 pb-2 border-b-2 text-teal-600 dark:text-teal-400 border-teal-500/50">
          Sponsor & Kontributor
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4 text-center md:text-left">
              Sponsor
            </h3>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              {sponsorsAndContributors
                .filter((u) => u.type === "sponsor")
                .slice(0, 2)
                .map((user) => (
                  <UserBadge key={user.id} user={user} />
                ))}
            </div>
            <Link
              to="/dukung-kami#sponsors"
              className="block text-center mt-4 text-teal-500 dark:text-teal-400 hover:underline"
            >
              Lihat semua sponsor
            </Link>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4 text-center md:text-left">
              Kontributor
            </h3>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              {sponsorsAndContributors
                .filter((u) => u.type === "contributor")
                .slice(0, 2)
                .map((user) => (
                  <UserBadge key={user.id} user={user} />
                ))}
            </div>
            <Link
              to="/dukung-kami#contributors"
              className="block text-center mt-4 text-teal-500 dark:text-teal-400 hover:underline"
            >
              Lihat semua kontributor
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
