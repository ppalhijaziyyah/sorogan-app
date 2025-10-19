import React from 'react';
import { Link } from 'react-router-dom';

const AboutUsPage = () => {
  return (
    <div className="container mx-auto max-w-5xl py-8 px-4">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100">Tentang Kami</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">Misi dan Latar Belakang Proyek Sorogan</p>
      </header>
      <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-white/20 rounded-lg shadow-md p-8 space-y-6">
        <p className="text-lg leading-relaxed"><strong>Sorogan App</strong> adalah platform modern untuk memfasilitasi pembelajaran membaca teks Arab klasik (kitab kuning) secara interaktif.</p>
        <p className="text-lg leading-relaxed">Aplikasi ini dibuat untuk membantu para santri dan pelajar di seluruh dunia agar dapat belajar dengan lebih mudah, di mana saja dan kapan saja.</p>
        <p className="text-lg leading-relaxed">Proyek ini adalah eksperimen open-source yang dikembangkan dengan bantuan model bahasa Gemini dari Google. Kami percaya pada kekuatan teknologi untuk melestarikan dan menyebarkan ilmu pengetahuan tradisional.</p>
        <div className="text-center pt-4">
            <Link to="/" className="text-teal-600 dark:text-teal-400 hover:underline">Kembali ke Halaman Utama</Link>
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;
