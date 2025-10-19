import React from 'react';
import { Link } from 'react-router-dom';
import UserBadge from './ui/UserBadge';
import data from '../data/sponsors-contributors.json';

const SupportUsPage = () => {
  const sponsors = data.filter(user => user.type === 'sponsor').sort((a, b) => b.amount - a.amount);
  const contributors = data.filter(user => user.type === 'contributor').sort((a, b) => b.contributionCount - a.contributionCount);

  return (
    <div className="container mx-auto max-w-5xl py-8 px-4">
      <header className="text-center mb-12">
        <h1 className="text-5xl font-bold text-gray-800 dark:text-gray-100">Dukung Proyek Sorogan</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mt-3">Bantu kami untuk terus berkembang dan memberikan manfaat.</p>
      </header>

      {/* Bagian Ajakan Kontribusi */}
      <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-white/20 rounded-lg shadow-md p-8 mb-12 space-y-6">
        <p className="text-lg leading-relaxed">Aplikasi ini gratis dan akan selalu gratis. Kami percaya bahwa akses terhadap pendidikan harus terbuka untuk semua.</p>
        <p className="text-lg leading-relaxed">Jika Anda merasa aplikasi ini bermanfaat, Anda bisa mendukung kami dengan memberikan donasi atau berkontribusi pada kode proyek kami. Setiap kontribusi, besar atau kecil, sangat berarti bagi kami.</p>
        <div className="text-center pt-4">
            <a href="https://github.com/ppalhijaziyyah/sorogan-app" target="_blank" rel="noopener noreferrer" className="inline-block bg-gray-800 hover:bg-gray-900 text-white font-bold py-3 px-8 rounded-lg transition-colors text-lg">
                Lihat & Kontribusi di GitHub
            </a>
        </div>
      </div>

      {/* Bagian Sponsor */}
      <div className="mb-12">
        <h2 id="sponsors" className="text-3xl font-bold text-center mb-8 text-teal-600 dark:text-teal-400">Para Sponsor</h2>
        {sponsors.length > 0 ? (
          <div className="flex flex-wrap justify-center gap-6">
            {sponsors.map(user => (
              <UserBadge key={user.id} user={user} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400">Belum ada sponsor. Jadilah yang pertama!</p>
        )}
      </div>

      {/* Bagian Kontributor */}
      <div className="mb-12">
        <h2 id="contributors" className="text-3xl font-bold text-center mb-8 text-teal-600 dark:text-teal-400">Para Kontributor</h2>
        {contributors.length > 0 ? (
          <div className="flex flex-wrap justify-center gap-6">
            {contributors.map(user => (
              <UserBadge key={user.id} user={user} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400">Belum ada kontributor. Jadilah yang pertama!</p>
        )}
      </div>

      <div className="text-center pt-4">
          <Link to="/" className="text-teal-600 dark:text-teal-400 hover:underline">Kembali ke Halaman Utama</Link>
      </div>
    </div>
  );
};

export default SupportUsPage;