import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../contexts/AppContext';
import ConfirmationModal from './ui/ConfirmationModal';



const ThemeToggle = () => {
    const { theme, toggleTheme } = useContext(AppContext);
    return (
        <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 mt-2 md:mt-0" title={`Ganti ke mode ${theme === 'light' ? 'gelap' : 'terang'}`}>
            {theme === 'light' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            )}
        </button>
    );
};

const Footer = ({ setSliderState }) => {
  const { resetProgress } = useContext(AppContext);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleResetClick = () => {
    setIsModalOpen(true);
  };

  const handleConfirmReset = () => {
    resetProgress();
    setIsModalOpen(false);
  };


  return (
    <>
      <footer className="bg-white/50 dark:bg-gray-900/50 mt-12 shadow-inner backdrop-blur-sm">
        <div className="container mx-auto py-8 px-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
                <div>
                    <h3 className="text-4xl bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-sky-500 font-bold">Sorogan</h3>
                    <p className="mt-2 text-gray-600 dark:text-gray-300 text-sm">Platform interaktif untuk belajar membaca dan memahami teks Arab gundul.</p>
                </div>
                <div className="flex flex-col items-center gap-4">
                    <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-sm text-gray-600 dark:text-gray-300">
                        <Link to="/tentang-kami" className="hover:text-teal-500 dark:hover:text-teal-400">Tentang Kami</Link>
                        <Link to="/dukung-kami" className="hover:text-teal-500 dark:hover:text-teal-400">Dukung Kami</Link>
                        <button onClick={handleResetClick} className="hover:text-red-500 dark:hover:text-red-400">Reset Progres</button>
                    </div>
                    <ThemeToggle />
                </div>
            </div>
            <div className="border-t border-gray-300 dark:border-gray-700 mt-8 pt-6 text-center text-gray-500 dark:text-gray-400 text-sm">
                &copy; 2025 Sorogan App. Dibuat dengan Gemini.
                <p className="mt-2">Seluruh konten materi pelajaran di aplikasi ini dilindungi hak cipta. Dilarang menyalin atau menyebarkan ulang tanpa izin dari pengembang.</p>
            </div>
        </div>
      </footer>
      <ConfirmationModal
        isOpen={isModalOpen}
        message="Apakah Anda yakin ingin mereset semua progres belajar Anda? Aksi ini tidak dapat dibatalkan dan akan memuat ulang aplikasi."
        onConfirm={handleConfirmReset}
        onCancel={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default Footer;
