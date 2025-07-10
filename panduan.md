# Panduan Pengguna Aplikasi Pembelajaran I'rab

### Pendahuluan

Dokumen ini menyajikan panduan operasional lengkap untuk Aplikasi Pembelajaran I'rab. Aplikasi ini dirancang sebagai sebuah platform interaktif untuk membantu para pembelajar bahasa Arab dalam meningkatkan kemahiran membaca teks tanpa harakat (gundul) serta memahami analisis gramatikal (i'rab) dari setiap kata dalam konteks kalimat. Panduan ini ditujukan bagi pengguna akhir, yaitu siswa atau siapa pun yang ingin memanfaatkan aplikasi ini sebagai media belajar mandiri.

### Memulai Aplikasi: Persiapan Server Lokal

Untuk dapat menjalankan aplikasi dengan benar, diperlukan sebuah server web lokal. Kebijakan keamanan pada peramban modern tidak mengizinkan pemuatan berkas eksternal (seperti berkas materi pelajaran `.json`) jika laman HTML dibuka secara langsung dari sistem berkas komputer. Menjalankan server lokal mengatasi kendala ini.

Prosedur untuk mengaktifkan server lokal adalah sebagai berikut:

1.  **Buka Antarmuka Baris Perintah**: Akses aplikasi Terminal pada macOS atau Linux, atau Command Prompt/PowerShell pada sistem operasi Windows.
2.  **Navigasi ke Direktori Proyek**: Gunakan perintah `cd` untuk berpindah ke direktori utama tempat Anda menyimpan semua berkas aplikasi. Contohnya: `cd Lokasi/Folder/PROYEK_PEMBELAJARAN`.
3.  **Jalankan Perintah Server**: Ketikkan perintah di bawah ini pada terminal, lalu tekan Enter.
    ```bash
    python -m http.server
    ```
4.  **Akses Aplikasi**: Buka peramban web (misalnya Chrome atau Firefox) dan kunjungi alamat `http://localhost:8000`. Anda akan melihat daftar berkas proyek. Klik pada `index.html` untuk memulai Aplikasi Pembelajaran.

### Halaman Utama: Memilih Pelajaran

Setelah aplikasi berhasil dimuat, Anda akan disambut oleh halaman utama yang berfungsi sebagai pusat navigasi materi.

* **Tata Letak Berdasarkan Tingkatan**
    Pelajaran disajikan dalam beberapa kelompok yang diurutkan secara vertikal berdasarkan tingkat kesulitan, yaitu `Tingkat Ibtida’i (Pemula)`, `Tingkat Mutawassit (Menengah)`, dan `Tingkat Mutaqaddim (Mahir)`. Pengelompokan ini bertujuan untuk memfasilitasi proses belajar yang bertahap.

* **Kartu Pelajaran**
    Setiap pelajaran direpresentasikan oleh sebuah kartu visual yang memuat informasi ringkas:
    1.  **Judul Pelajaran (Arab & Latin)**: Nama pelajaran dalam dua format tulisan.
    2.  **Pratinjau Teks**: Beberapa kata pertama dari wacana untuk memberikan gambaran awal mengenai materi.
    3.  **Label Tingkatan**: Sebuah penanda berwarna yang menunjukkan tingkat kesulitan pelajaran.

* **Fitur Filter**
    Di bagian atas halaman, terdapat serangkaian tombol filter. Anda dapat mengklik tombol tingkatan tertentu (misalnya, "Ibtida’i") untuk menampilkan hanya pelajaran pada tingkat tersebut. Tombol-tombol level lain akan berubah warna menjadi abu-abu untuk menandakan status tidak aktif. Untuk mengembalikan tampilan ke semula, klik tombol "Semua".

### Halaman Belajar: Interaksi dengan Teks

Dengan mengklik salah satu kartu pelajaran, Anda akan diarahkan ke halaman belajar.

* **Antarmuka yang Ramah Gawai (Mobile-Friendly)**
    Tata letak pada halaman ini telah disesuaikan untuk kenyamanan pengguna perangkat seluler. Tombol "Kembali" dan judul pelajaran ditata berdampingan agar tidak saling menghalangi.

* **Interaksi Kata per Kata**
    Ini adalah fitur inti dari aplikasi.
    1.  **Klik Tunggal (Harakat & Terjemahan)**: Melakukan satu kali klik pada sebuah kata akan menampilkan atau menyembunyikan harakatnya (tasydid tetap dipertahankan). Jika mode terjemahan diaktifkan melalui tombol *toggle*, klik tunggal juga akan menampilkan terjemahan kata tersebut dalam sebuah *tooltip*.
    2.  **Klik Ganda (Analisis I'rab)**: Melakukan dua kali klik pada sebuah kata akan memunculkan sebuah panel *slider* dari bawah layar. Panel ini berisi analisis i'rab lengkap dari kata tersebut. Keunggulan antarmuka ini adalah teks pelajaran utama tetap terlihat di bagian atas, memungkinkan Anda untuk memahami analisis gramatikal tanpa kehilangan konteks kalimat.

* **Fitur Tambahan (Opsional)**
    1.  **Referensi Teks**: Apabila pelajaran memiliki sumber referensi, informasi tersebut akan ditampilkan secara otomatis di bawah kotak teks utama dengan gaya kutipan yang jelas.
    2.  **Terjemahan Keseluruhan**: Apabila sebuah pelajaran memiliki data terjemahan lengkap, sebuah tombol **"Lihat Terjemahan Lengkap"** akan muncul. Mengklik tombol ini akan membuka panel *slider* yang menampilkan terjemahan utuh dari wacana.
    3.  **Tampilkan Semua Harakat**: Tombol ini berfungsi sebagai saklar global untuk menampilkan atau menyembunyikan harakat pada seluruh kata dalam wacana secara serentak.

### Fitur Kuis: Menguji Pemahaman

Setiap pelajaran dilengkapi dengan sesi kuis untuk mengevaluasi pemahaman Anda.

* **Memulai Kuis**: Tombol **"Mulai Kuis"** hanya akan muncul jika pelajaran tersebut memiliki data kuis.
* **Sesi Kuis Dinamis**: Untuk memberikan tantangan yang bervariasi, urutan pertanyaan serta posisi pilihan jawaban akan diacak setiap kali Anda memulai kuis.
* **Indikator Progres**: Di bagian atas halaman kuis, terdapat penanda yang menunjukkan kemajuan Anda, misalnya "Pertanyaan 1 dari 5".
* **Umpan Balik Instan**: Setelah Anda memilih sebuah jawaban, aplikasi akan segera memberikan umpan balik visual, menandai jawaban yang benar dengan warna hijau dan jawaban yang salah dengan warna merah. Aplikasi kemudian akan secara otomatis beralih ke pertanyaan berikutnya.

Dengan memahami semua fungsionalitas ini, Anda dapat memanfaatkan aplikasi secara maksimal untuk mendukung proses pembelajaran bahasa Arab Anda.
