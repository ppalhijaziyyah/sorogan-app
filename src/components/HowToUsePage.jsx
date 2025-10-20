// Komponen Halaman Panduan Penggunaan Aplikasi
import React from 'react';

const FeatureCard = ({ icon, title, children }) => (
  <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-lg shadow-md p-6 border border-white/20">
    <div className="flex items-start gap-4">
      <div className="text-teal-500 dark:text-teal-400 text-2xl pt-1">{icon}</div>
      <div className="flex-1">
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">{title}</h3>
        <div className="text-base space-y-3 text-gray-600 dark:text-gray-300">{children}</div>
      </div>
    </div>
  </div>
);

const HowToUsePage = () => {
  return (
    <div className="container mx-auto max-w-4xl py-8 px-4">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-sky-500 mb-2">Panduan Penggunaan</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">Pelajari cara memaksimalkan pengalaman belajar Anda dengan aplikasi Sorogan.</p>
      </header>

      <div className="space-y-12">
        
        {/* Fitur Utama */}
        <div>
          <h2 className="text-2xl font-bold mb-6 pb-2 border-b-2 text-teal-600 dark:text-teal-400 border-teal-500/50">Fitur-Fitur Utama</h2>
          <div className="space-y-6">
            <FeatureCard icon="📖" title="Interaksi Teks Pelajaran">
              <p>Ini adalah fitur inti dari aplikasi. Setiap kata dalam teks Arab dapat diinteraksikan:</p>
              <ul className="list-disc list-inside pl-2 space-y-2">
                <li><strong>Klik Sekali:</strong> Untuk menampilkan harakat atau terjemahan per kata, tergantung mode yang aktif di toolbar.</li>
                <li><strong>Klik Dua Kali:</strong> Untuk menampilkan analisis gramatikal (I'rab) dari kata tersebut.</li>
              </ul>
            </FeatureCard>

            <FeatureCard icon="🛠️" title="Toolbar Belajar">
              <p>Gunakan toolbar untuk mengontrol bantuan visual saat Anda belajar:</p>
              <ul className="list-disc list-inside pl-2 space-y-2">
                <li><strong>Mode Harakat (ح):</strong> Aktifkan mode ini, lalu klik sekali pada kata untuk melihat harakatnya.</li>
                <li><strong>Mode Terjemah (T):</strong> Aktifkan mode ini, lalu klik sekali pada kata untuk melihat terjemahannya.</li>
                <li><strong>Tampilkan Semua Harakat:</strong> Menampilkan/menyembunyikan harakat untuk seluruh teks secara instan.</li>
                <li><strong>Tampilkan Terjemahan Lengkap:</strong> Menampilkan/menyembunyikan blok terjemahan lengkap untuk seluruh teks.</li>
                <li><strong>Pengaturan Tampilan:</strong> Menyesuaikan ukuran font, spasi, dan lainnya untuk kenyamanan membaca.</li>
              </ul>
            </FeatureCard>

            <FeatureCard icon="🏁" title="Aksi Pelajaran">
              <p>Di akhir setiap pelajaran, Anda dapat:</p>
              <ul className="list-disc list-inside pl-2 space-y-2">
                <li><strong>Mulai Kuis:</strong> Uji pemahaman Anda terhadap materi.</li>
                <li><strong>Tandai sebagai Selesai:</strong> Beri tanda centang pada pelajaran ini di halaman utama untuk melacak progres Anda.</li>
              </ul>
            </FeatureCard>
          </div>
        </div>

        {/* Alur Belajar Terbaik */}
        <div>
          <h2 className="text-2xl font-bold mb-6 pb-2 border-b-2 text-teal-600 dark:text-teal-400 border-teal-500/50">Saran Alur Belajar</h2>
          <div className="space-y-6">
            <FeatureCard icon="💡" title="Alur Belajar yang Direkomendasikan">
              <p>Untuk hasil maksimal, coba ikuti langkah-langkah berikut:</p>
              <ol className="list-decimal list-inside pl-2 space-y-3">
                <li><strong>Baca Teks Gundul:</strong> Awali dengan mencoba membaca seluruh teks tanpa bantuan sama sekali untuk mengukur kemampuan awal Anda.</li>
                <li><strong>Gunakan Bantuan per Kata:</strong> Aktifkan <strong>Mode Harakat</strong> dan <strong>Mode Terjemah</strong>. Klik sekali pada kata-kata yang sulit untuk memeriksa bacaan dan artinya.</li>
                <li><strong>Tampilkan Semua Harakat:</strong> Setelah familiar, aktifkan semua harakat untuk berlatih membaca dengan lancar.</li>
                <li><strong>Pahami Konteks:</strong> Tampilkan <strong>Terjemahan Lengkap</strong> untuk memahami makna keseluruhan teks.</li>
                <li><strong>Perdalam Analisis:</strong> Penasaran dengan struktur kalimat? <strong>Klik dua kali</strong> pada kata-kata kunci untuk melihat I'rab-nya.</li>
                <li><strong>Uji Diri Anda:</strong> Ikuti <strong>kuis</strong> untuk memastikan Anda telah memahami materi.</li>
                <li><strong>Lacak Progres:</strong> Jangan lupa <strong>Tandai sebagai Selesai</strong> untuk memotivasi diri Anda melanjutkan ke pelajaran berikutnya!</li>
              </ol>
            </FeatureCard>
          </div>
        </div>

      </div>
    </div>
  );
};

export default HowToUsePage;