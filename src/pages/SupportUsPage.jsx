import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import UserBadge from '../components/ui/UserBadge';
import data from '../data/sponsors-contributors.json';

const SectionTitle = ({ children, id }) => (
  <h2 id={id} className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-cyan-500 mb-6 mt-12 first:mt-0">
    {children}
  </h2>
);

const SupportUsPage = () => {
  const [isQrisOpen, setIsQrisOpen] = useState(false);
  const sponsors = data.filter(user => user.type === 'sponsor').sort((a, b) => b.amount - a.amount);
  const developers = data.filter(user => user.type === 'developer');
  const contributors = data.filter(user => user.type === 'contributor').sort((a, b) => (b.contributionCount || 0) - (a.contributionCount || 0));

  return (
    <div className="container mx-auto max-w-4xl py-6 px-4 md:py-12">
      <header className="mb-10 text-center md:text-left">
        <h1 className="text-3xl md:text-4xl font-black text-gray-800 dark:text-gray-100 mb-3 tracking-tight">
          Dukung Kami
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed max-w-2xl">
          Kontribusi Anda membantu kami menjaga aplikasi ini tetap gratis dan terus berkembang untuk semua orang.
        </p>
      </header>

      <div className="space-y-12">
        {/* Bagian Ajakan */}
        <section>
          <div className="bg-gradient-to-br from-teal-500 to-cyan-600 p-8 rounded-3xl text-white shadow-xl shadow-teal-500/20">
            <h2 className="text-2xl font-bold mb-4">Dukungan Anda Sangat Berarti</h2>
            <p className="text-lg opacity-90 leading-relaxed mb-6">
              Aplikasi Sorogan App 100% gratis dan didedikasikan sepenuhnya untuk pendidikan. Kami percaya setiap pencari ilmu berhak mendapatkan kemudahan akses tanpa halangan biaya. 
              <br /><br />
              Namun, operasional dan pengembangan aplikasi ini setiap bulannya membutuhkan dukungan (seperti biaya server, <i>hosting</i>, dan inovasi fitur). Jika Anda merasakan manfaat dari aplikasi ini dan memiliki kelapangan rezeki, kami dengan senang hati menerima donasi sukarela Anda. 
            </p>
            <div className="flex flex-wrap gap-4 mt-8">
              <button
                onClick={() => setIsQrisOpen(true)}
                className="bg-white text-teal-600 font-black px-6 py-3 rounded-xl hover:bg-teal-50 transition-colors shadow-lg flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Donasi via QRIS
              </button>
            </div>
          </div>
        </section>

        <hr className="border-gray-100 dark:border-gray-800" />

        {/* Bagian Sponsor */}
        <section>
          <SectionTitle id="sponsors">Para Sponsor</SectionTitle>
          <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
            Terima kasih kepada individu dan lembaga yang telah memberikan dukungan finansial untuk operasional dan pengembangan Sorogan.
          </p>

          {sponsors.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {sponsors.map(user => (
                <UserBadge key={user.id} user={user} />
              ))}
            </div>
          ) : (
            <div className="text-center p-8 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
              <p className="text-gray-500 dark:text-gray-400 italic">Belum ada sponsor. Jadilah yang pertama mendukung proyek ini!</p>
            </div>
          )}
        </section>

        <hr className="border-gray-100 dark:border-gray-800" />

        {/* Bagian Pengembang */}
        <section>
          <SectionTitle id="developers">Tim Pengembang</SectionTitle>
          <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
            Sorogan App dirancang, dibangun, dan dikelola oleh dedikasi tim kecil yang berkomitmen memajukan pelestarian literatur pesantren melalui teknologi digital.
          </p>

          {developers.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {developers.map(user => (
                <UserBadge key={user.id} user={user} />
              ))}
            </div>
          ) : (
            <div className="text-center p-8 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
              <p className="text-gray-500 dark:text-gray-400 italic">Belum ada profil pengembang.</p>
            </div>
          )}
        </section>

        <hr className="border-gray-100 dark:border-gray-800" />

        {/* Bagian Kontributor */}
        <section>
          <SectionTitle id="contributors">Para Kontributor</SectionTitle>
          <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
            Aplikasi ini dibangun dari keringat dan ide-ide cemerlang para pengembang dan penyusun konten.
          </p>

          {contributors.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {contributors.map(user => (
                <UserBadge key={user.id} user={user} />
              ))}
            </div>
          ) : (
            <div className="text-center p-8 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
              <p className="text-gray-500 dark:text-gray-400 italic">Belum ada kontributor kode.</p>
            </div>
          )}
        </section>

        <div className="flex justify-center md:justify-start pt-8">
          <Link
            to="/"
            className="inline-flex items-center text-teal-600 dark:text-teal-400 font-bold hover:scale-105 transition-transform"
          >
            <span>&larr; Kembali ke Beranda</span>
          </Link>
        </div>
      </div>

      {/* QRIS Modal */}
      {isQrisOpen && (
        <div 
          className="fixed inset-0 z-[150] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setIsQrisOpen(false)}
        >
          <div 
            className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden max-w-sm w-full relative transform transition-all animate-in zoom-in-95 duration-200"
            onClick={e => e.stopPropagation()}
          >
            <button 
              onClick={() => setIsQrisOpen(false)}
              className="absolute top-4 right-4 bg-black/10 hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20 rounded-full w-8 h-8 flex items-center justify-center text-gray-800 dark:text-gray-200 transition-colors z-10"
              aria-label="Tutup"
            >
              &times;
            </button>
            <div className="p-6 pb-2 text-center bg-gray-50 dark:bg-gray-800/50">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Pindai QRIS</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Terima kasih banyak atas dukungan tulus Anda untuk proyek pendidikan ini.</p>
            </div>
            <div className="p-6 flex justify-center bg-white dark:bg-gray-900">
              <img 
                src="/QRIS-Hijaz-Dev.png" 
                alt="QRIS Hijaz Developer" 
                className="w-full max-w-[280px] h-auto object-contain rounded-xl shadow-sm border border-gray-100 dark:border-gray-800"
              />
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 text-center border-t border-gray-100 dark:border-gray-800">
              <button 
                onClick={() => setIsQrisOpen(false)}
                className="text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupportUsPage;