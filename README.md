# Sorogan App

Aplikasi web sederhana untuk membaca dan mempelajari kitab kuning dengan metode sorogan.

## Tentang Aplikasi

**Sorogan App** adalah platform pembelajaran interaktif yang dirancang untuk membantu para santri dan peminat bahasa Arab untuk belajar membaca dan memahami teks Arab gundul (tanpa harakat). Aplikasi ini mensimulasikan metode pembelajaran "sorogan", di mana pengguna dapat melihat teks asli, terjemahan per kata, analisis gramatikal (i'rab), dan menguji pemahaman mereka melalui kuis interaktif.

## Fitur Utama

*   **Teks Interaktif:** Tampilkan teks dengan atau tanpa harakat, lengkap dengan terjemahan dan penjelasan i'rab per kata.
*   **Mode Latihan:** Uji pemahaman Anda dengan menyembunyikan harakat atau terjemahan.
*   **Kuis Pemahaman:** Setiap pelajaran dilengkapi dengan kuis untuk mengukur sejauh mana pemahaman Anda terhadap materi.
*   **Beragam Tingkatan:** Materi pelajaran dikelompokkan ke dalam beberapa tingkatan, mulai dari Ibtida'i (pemula) hingga Mutaqaddim (lanjutan).
*   **Pelacakan Progres:** Aplikasi secara otomatis menyimpan pelajaran yang telah Anda selesaikan.
*   **Desain Responsif & Mode Gelap:** Belajar dengan nyaman di berbagai perangkat (desktop maupun mobile) dan kondisi pencahayaan.

## Kontribusi

Aplikasi ini bersifat sumber terbuka (open source) dan kami sangat mengapresiasi segala bentuk kontribusi dari komunitas, baik dalam bentuk materi pelajaran maupun pengembangan kode.

### Kontribusi Materi Pelajaran

Jika Anda ingin menyumbangkan materi pelajaran baru, Anda dapat mengikuti langkah-langkah berikut:

1.  **Fork** repositori ini.
2.  Buat file JSON baru di dalam direktori `public/data/` sesuai dengan tingkatan yang sesuai (misalnya, `public/data/1-ibtidai/nama-kitab.json`).
3.  Isi file JSON tersebut dengan struktur berikut:

    ```json
    {
      "title": "Judul Pelajaran",
      "titleArabic": "عنوان الدرس",
      "level": "Ibtida’i", // atau "Mutawassit", "Mutaqaddim"
      "textData": [
        [
          {
            "berharakat": "الْكَلِمَةُ",
            "gundul": "الكلمة",
            "terjemahan": "Kata",
            "irab": "Penjelasan i'rab"
          }
        ]
      ],
      "quizData": [
        {
          "question": "Apa i'rab dari kata 'الْكَلِمَةُ'?",
          "context": "...",
          "options": ["A. Pilihan A", "B. Pilihan B"],
          "correctAnswer": 0, // Indeks jawaban yang benar
          "explanation": "Penjelasan mengapa jawaban tersebut benar."
        }
      ],
      "fullTranslation": "Terjemahan lengkap dari teks.",
      "reference": "Nama Kitab/Sumber"
    }
    ```

4.  Perbarui file `public/master-index.json` untuk menambahkan entri baru untuk materi Anda.
5.  Buat **Pull Request** agar kami dapat meninjau kontribusi Anda.

### Kontribusi Kode

Kami juga menyambut kontribusi untuk meningkatkan fungsionalitas dan memperbaiki bug pada aplikasi. Jika Anda tertarik, silakan:

1.  **Fork** repositori ini.
2.  Buat *branch* baru untuk fitur atau perbaikan yang Anda kerjakan.
3.  Lakukan perubahan pada kode.
4.  Pastikan kode Anda berjalan dengan baik secara lokal.
5.  Buat **Pull Request** dengan penjelasan yang jelas tentang perubahan yang Anda buat.

## Panduan untuk Developer

### Prasyarat

*   [Node.js](https://nodejs.org/) (versi 18 atau lebih tinggi)
*   [npm](https://www.npmjs.com/)

### Instalasi

1.  Clone repositori ini:
    ```bash
    git clone https://github.com/ppalhijaziyyah/sorogan-app.git
    ```
2.  Masuk ke direktori proyek:
    ```bash
    cd sorogan-app
    ```
3.  Instal dependensi:
    ```bash
    npm install
    ```

### Pengembangan

Untuk menjalankan aplikasi dalam mode pengembangan dengan *hot-reloading*:

```bash
npm run dev
```

### Build untuk Produksi

Untuk membuat versi produksi dari aplikasi:

```bash
npm run build
```

Perintah ini akan menghasilkan direktori `dist` yang berisi file-file aplikasi yang sudah dioptimalkan.

## Lisensi

Proyek ini dilisensikan di bawah [MIT License](LICENSE).