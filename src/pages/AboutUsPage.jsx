import React from 'react';
import { Link } from 'react-router-dom';
import UserBadge from '../components/ui/UserBadge';
import data from '../data/sponsors-contributors.json';

const AboutUsPage = () => {
  const developers = data.filter(user => user.type === 'developer');

  return (
    <div className="container mx-auto max-w-4xl py-6 px-4 md:py-12">
      <header className="mb-10 text-center md:text-left">
        <h1 className="text-3xl md:text-4xl font-black text-gray-800 dark:text-gray-100 mb-3 tracking-tight">
          Tentang Kami
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed max-w-2xl">
          Mengenal lebih dekat visi dan misi di balik pengembangan aplikasi Sorogan.
        </p>
      </header>

      <div className="space-y-10">
        <section className="prose prose-teal dark:prose-invert max-w-none">
          <div className="space-y-6 text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
            <p>
              <strong className="text-teal-600 dark:text-teal-400">Sorogan App</strong> adalah platform modern yang dirancang khusus untuk memfasilitasi pembelajaran membaca teks Arab klasik atau yang akrab dikenal sebagai <span className="italic">kitab kuning</span> secara interaktif.
            </p>

            <p>
              Aplikasi ini lahir dari kebutuhan untuk menjembatani metode pembelajaran tradisional dengan teknologi digital masa kini. Kami ingin membantu para santri, mahasiswa, dan peminat ilmu keislaman di seluruh dunia agar dapat belajar dengan lebih mudah, efisien, serta dapat diakses di mana saja dan kapan saja.
            </p>

            <div className="bg-teal-50 dark:bg-teal-900/10 p-6 rounded-2xl border border-teal-100 dark:border-teal-800/30 my-8 space-y-4">
              <p className="m-0 italic text-center font-medium">
                "Kami mendedikasikan aplikasi ini sepenuhnya untuk tujuan pendidikan. Sorogan App disediakan secara gratis (non-komersial) agar akses terhadap ilmu pengetahuan agama semakin terbuka lebar bagi siapa saja yang ingin mempelajarinya."
              </p>
            </div>

            <p>
              Kami percaya bahwa akses terhadap pendidikan berkualitas haruslah terbuka untuk siapa saja. Oleh karena itu, Sorogan akan terus dikembangkan sebagai proyek sumber terbuka yang transparan dan kolaboratif.
            </p>
          </div>
        </section>

        <hr className="border-gray-100 dark:border-gray-800" />

        {/* Bagian Pengembang */}
        <section className="pt-4">
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-cyan-500 mb-6">Tim Pengembang</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed text-lg">
            Sorogan App dirancang, dibangun, dan dikelola oleh dedikasi tim kecil yang berkomitmen memajukan pelestarian literatur pesantren melalui teknologi digital.
          </p>

          {developers.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
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

        <hr className="border-gray-100 dark:border-gray-800 mt-12 mb-8" />

        <div className="flex justify-center md:justify-start">
          <Link
            to="/"
            className="inline-flex items-center text-teal-600 dark:text-teal-400 font-bold hover:scale-105 transition-transform"
          >
            <span>&larr; Kembali ke Beranda</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;
