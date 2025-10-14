import React, { useState, useContext } from 'react';
import { AppContext } from '../contexts/AppContext';
import ConfirmationModal from './ui/ConfirmationModal';

const AboutUsContent = () => (
    <div className="space-y-4 text-left">
        <p><strong>Sorogan App</strong> adalah platform modern untuk memfasilitasi pembelajaran membaca teks Arab klasik (kitab kuning) secara interaktif.</p>
        <p>Aplikasi ini dibuat untuk membantu para santri dan pelajar di seluruh dunia agar dapat belajar dengan lebih mudah, di mana saja dan kapan saja.</p>
        <p>Proyek ini adalah eksperimen open-source yang dikembangkan dengan bantuan model bahasa Gemini dari Google.</p>
    </div>
);

const SupportUsContent = () => (
    <div className="space-y-4 text-left">
        <p>Aplikasi ini gratis dan akan selalu gratis. Jika Anda merasa aplikasi ini bermanfaat, Anda bisa mendukung kami dengan memberikan donasi atau berkontribusi pada proyek.</p>
        <div className="text-center mt-4">
            <a href="https://github.com/ppalhijaziyyah/sorogan-app" target="_blank" rel="noopener noreferrer" className="inline-block bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-6 rounded-lg transition-colors">Lihat di GitHub</a>
        </div>
    </div>
);

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

  const openSlider = (title, content) => {
      setSliderState({ isOpen: true, title, content });
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
                        <button onClick={() => openSlider('Tentang Kami', <AboutUsContent />)} className="hover:text-teal-500 dark:hover:text-teal-400">Tentang Kami</button>
                        <button onClick={() => openSlider('Dukung Kami', <SupportUsContent />)} className="hover:text-teal-500 dark:hover:text-teal-400">Dukung Kami</button>
                        <button onClick={handleResetClick} className="hover:text-red-500 dark:hover:text-red-400">Reset Progres</button>
                    </div>
                </div>
            </div>
            <div className="border-t border-gray-300 dark:border-gray-700 mt-8 pt-6 text-center text-gray-500 dark:text-gray-400 text-sm">
                &copy; 2025 Sorogan App. Dibuat dengan Gemini.
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
