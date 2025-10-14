import React, { useState, useContext } from 'react';
import { AppContext } from '../contexts/AppContext';
import ConfirmationModal from './ui/ConfirmationModal';

const Footer = () => {
  const { resetProgress } = useContext(AppContext);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleResetClick = () => {
    setIsModalOpen(true);
  };

  const handleConfirmReset = () => {
    // The resetProgress function from the context already reloads the page
    resetProgress();
    setIsModalOpen(false);
  };

  return (
    <>
      <footer className="p-4 mt-8 text-center border-t border-gray-200 dark:border-gray-700">
        <button 
          onClick={handleResetClick}
          className="text-sm text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
        >
          Reset Progres
        </button>
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
