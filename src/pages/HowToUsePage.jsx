import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const AccordionItem = ({ icon, title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden transition-all bg-white/70 dark:bg-slate-800/50">
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className="w-full flex items-center gap-3 px-5 py-4 text-left bg-gray-50/80 dark:bg-slate-800/80 hover:bg-gray-100/80 dark:hover:bg-slate-700/50 transition-colors"
      >
        <span className="text-xl shrink-0">{icon}</span>
        <span className="flex-1 text-lg font-bold text-gray-800 dark:text-gray-200">{title}</span>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        className="grid transition-all duration-300 ease-in-out"
        style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
      >
        <div className="overflow-hidden">
          <div className="px-5 pb-5 pt-1 text-base text-gray-600 dark:text-gray-400 leading-relaxed space-y-3">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

const SectionTitle = ({ children }) => (
  <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-cyan-500 mb-4 mt-8 first:mt-0">
    {children}
  </h2>
);

const HowToUsePage = () => {
  const navigate = useNavigate();

  const handleStartTutorial = () => {
    localStorage.setItem('hasSeenTutorial', 'false');
    navigate('/belajar/1/rukun-islam');
  };

  return (
    <div className="container mx-auto max-w-4xl py-6 px-4 md:py-12">
      <header className="mb-10 text-center md:text-left">
        <h1 className="text-3xl md:text-4xl font-black text-gray-800 dark:text-gray-100 mb-3 tracking-tight">
          Panduan Penggunaan
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed max-w-2xl">
          Pelajari cara memaksimalkan pengalaman belajar membaca kitab kuning dengan fitur-fitur interaktif Sorogan.
        </p>
        <button
          onClick={handleStartTutorial}
          className="mt-6 bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-transform hover:-translate-y-1 inline-flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          Buka Tutorial Interaktif
        </button>
      </header>

      <div className="space-y-10">
        {/* Bagian 1: Dasar Interaksi */}
        <section>
          <SectionTitle>Dasar Interaksi</SectionTitle>
          <div className="space-y-3">
            <AccordionItem icon="👆" title="Interaksi Teks" defaultOpen={true}>
              <p>Setiap kata dalam teks Arab bersifat interaktif:</p>
              <ul className="list-disc list-inside ml-1 text-gray-500 dark:text-gray-400">
                <li><strong>Klik Sekali:</strong> Menampilkan harakat atau terjemahan (sesuai mode toolbar).</li>
                <li><strong>Klik Dua Kali:</strong> Menampilkan analisis <em>I'rab</em> (tata bahasa).</li>
              </ul>
            </AccordionItem>
          </div>
        </section>

        <hr className="border-gray-100 dark:border-gray-800" />

        {/* Bagian 2: Toolbar & Tampilan */}
        <section>
          <SectionTitle>Pengaturan Tampilan</SectionTitle>
          <div className="space-y-3">
            <AccordionItem icon="👁️" title="Mode Baca">
              <p>Gunakan tombol di toolbar atas untuk bantuan visual:</p>
              <ul className="list-disc list-inside ml-1 text-gray-500 dark:text-gray-400">
                <li><strong>Mode Harakat (ح):</strong> Klik kata untuk melihat harakatnya.</li>
                <li><strong>Mode Terjemah (T):</strong> Klik kata untuk melihat artinya.</li>
                <li><strong>Mode Nga-logat (ن):</strong> Menampilkan rumus/simbol pesantren per kata.</li>
                <li><strong>Tampilkan Semua:</strong> Membuka semua fitur tersebut sekaligus di penjabaran lengkap.</li>
              </ul>
            </AccordionItem>

            <AccordionItem icon="⚙️" title="Kustomisasi">
              <p>Klik ikon <strong>Gear</strong> di pojok kanan atas toolbar belajar untuk:</p>
              <ul className="list-disc list-inside ml-1 text-gray-500 dark:text-gray-400">
                <li>Mengubah <strong>Ukuran Font</strong> (Arab & Latin).</li>
                <li>Mengganti <strong>Jenis Font Arab</strong> (LPMQ, Amiri, dll).</li>
                <li>Mengatur <strong>Spasi Antar Kata</strong>.</li>
                <li>Mengaktifkan/menonaktifkan <strong>Mode Fokus</strong>.</li>
              </ul>
            </AccordionItem>
          </div>
        </section>

        <hr className="border-gray-100 dark:border-gray-800" />

        {/* Bagian 3: Flashcard SRS */}
        <section>
          <SectionTitle>Flashcard (Menghafal Kosa Kata)</SectionTitle>
          <div className="space-y-3">
            <AccordionItem icon="⭐" title="Menandai Kata untuk Dihafal">
              <p>Saat membaca pelajaran, Anda bisa menandai kata-kata yang ingin dihafal:</p>
              <ul className="list-disc list-inside ml-1 text-gray-500 dark:text-gray-400">
                <li>Klik kata Arab di halaman belajar — tombol <strong>bintang ⭐</strong> akan muncul di atas kata.</li>
                <li>Klik tombol bintang untuk <strong>menyimpan kata</strong> ke koleksi flashcard.</li>
                <li>Kata yang telah disimpan akan ditandai dengan <strong>garis bawah putus-putus</strong>.</li>
              </ul>
              <p className="text-sm text-gray-400">💡 Tombol bintang bisa disembunyikan lewat Pengaturan Tampilan → "Tampilkan Tombol Bookmark".</p>
            </AccordionItem>

            <AccordionItem icon="🧠" title="Latihan Muroja'ah (Spaced Repetition)">
              <p>Buka halaman <Link to="/flashcard" className="text-teal-600 dark:text-teal-400 font-semibold hover:underline">Pusat Menghafal</Link> untuk memulai sesi latihan:</p>
              <ul className="list-disc list-inside ml-1 text-gray-500 dark:text-gray-400">
                <li>Kartu akan menampilkan kata <strong>tanpa harakat</strong> — coba ingat bacaan & artinya.</li>
                <li>Tekan <strong>"Tampilkan Jawaban"</strong> untuk melihat arti kata.</li>
                <li>Nilai penguasaan Anda: <strong>Lagi</strong>, <strong>Sulit</strong>, <strong>Baik</strong>, atau <strong>Mudah</strong>.</li>
                <li>Sistem <strong>Spaced Repetition (SM-2)</strong> akan menjadwalkan kapan kata perlu ditinjau ulang.</li>
              </ul>
              <p className="text-sm text-gray-400">⌨️ Di desktop: tekan <kbd className="px-1 py-0.5 bg-gray-200 dark:bg-slate-600 rounded text-xs font-mono">Spasi</kbd> untuk buka jawaban, lalu <kbd className="px-1 py-0.5 bg-gray-200 dark:bg-slate-600 rounded text-xs font-mono">1</kbd>-<kbd className="px-1 py-0.5 bg-gray-200 dark:bg-slate-600 rounded text-xs font-mono">4</kbd> untuk menilai.</p>
            </AccordionItem>

            <AccordionItem icon="📋" title="Kelola Koleksi Kata">
              <p>Di tab <strong>"Koleksi Kata"</strong>, Anda bisa:</p>
              <ul className="list-disc list-inside ml-1 text-gray-500 dark:text-gray-400">
                <li><strong>Cari</strong> kata berdasarkan teks Arab, terjemahan, atau nama pelajaran.</li>
                <li><strong>Filter</strong> berdasarkan pelajaran asal menggunakan dropdown.</li>
                <li><strong>Urutkan</strong> tabel dengan mengklik header kolom (Kata, Pelajaran, Jadwal).</li>
                <li><strong>Ekspor</strong> koleksi ke file JSON untuk cadangan.</li>
                <li><strong>Impor</strong> file JSON — pilih <em>Gabungkan</em> atau <em>Timpa</em> data yang ada.</li>
              </ul>
            </AccordionItem>
          </div>
        </section>

        <hr className="border-gray-100 dark:border-gray-800" />

        {/* Bagian 4: Efek Suara */}
        <section>
          <SectionTitle>Efek Suara</SectionTitle>
          <div className="space-y-3">
            <AccordionItem icon="🔊" title="Umpan Balik Audio">
              <p>
                Aplikasi dilengkapi efek suara halus untuk interaksi (klik, navigasi, sukses kuis).
                Anda dapat mematikan suara ini melalui tombol <strong>Speaker</strong> di menu pengaturan.
              </p>
            </AccordionItem>
          </div>
        </section>

        <hr className="border-gray-100 dark:border-gray-800" />

        {/* Bagian 5: Mode Tasykil */}
        <section>
          <SectionTitle>Mode Tasykil (Latihan)</SectionTitle>
          <div className="space-y-3">
            <AccordionItem icon="✍️" title="Uji Kemampuan Harakat">
              <p>
                Aktifkan sakelar <strong>"Mode Tasykil"</strong> di pengaturan.
                Dalam mode ini, teks akan gundul total. Saat Anda mengklik kata, akan muncul
                pilihan harakat. Pilih harakat yang benar untuk menguji penguasaan Nahwu/Shorof Anda.
              </p>
            </AccordionItem>
          </div>
        </section>

        <hr className="border-gray-100 dark:border-gray-800" />

        {/* Bagian 6: Tips Belajar */}
        <section>
          <SectionTitle>Tips Belajar Efektif</SectionTitle>
          <div className="bg-teal-50 dark:bg-teal-900/10 p-6 rounded-2xl border border-teal-100 dark:border-teal-800/30">
            <ol className="list-decimal list-inside space-y-4 text-gray-700 dark:text-gray-300">
              <li><strong>Baca Gundul:</strong> Coba baca teks tanpa bantuan apapun terlebih dahulu.</li>
              <li><strong>Cek Keraguan:</strong> Gunakan klik pada kata yang Anda ragu bacanya.</li>
              <li><strong>Tandai Kata Sulit:</strong> Simpan kata-kata baru ke flashcard dengan tombol ⭐.</li>
              <li><strong>Pahami Makna:</strong> Aktifkan "Terjemahan Lengkap" untuk konteks menyeluruh.</li>
              <li><strong>Analisis:</strong> Klik dua kali kata kunci untuk mendalami I'rab-nya.</li>
              <li><strong>Evaluasi:</strong> Kerjakan Kuis di akhir materi untuk mengukur pemahaman.</li>
              <li><strong>Muroja'ah:</strong> Buka halaman Flashcard secara rutin untuk mengulang kosa kata.</li>
            </ol>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HowToUsePage;