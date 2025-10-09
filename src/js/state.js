/**
 * @file state.js
 * @description Mengelola semua data dan status aplikasi secara terpusat.
 * Ini termasuk data pelajaran, status UI, dan progres pengguna.
 */

// Ekspor state agar bisa diimpor dan dimodifikasi oleh modul lain
export const state = {
    hasSeenTutorial: false,   // Status apakah pengguna sudah melihat tutorial
    masterIndex: [],          // Menyimpan daftar semua pelajaran dari master-index.json
    currentLesson: null,      // Menyimpan data pelajaran yang sedang aktif
    completedLessons: [],     // Menyimpan ID pelajaran yang telah diselesaikan oleh pengguna
    activeFilter: 'All',      // Filter level yang sedang aktif di halaman utama ('All', 'Ibtida’i', dll.)
    isHarakatShown: true,     // Status global apakah harakat harus ditampilkan atau tidak (mode saklar)
    isTranslationShown: false,// Status global apakah terjemahan per kata harus ditampilkan atau tidak
    isFocusMode: false,         // Status apakah mode fokus aktif atau tidak
    currentFocusParagraph: 0, // Indeks paragraf yang sedang menjadi fokus
    quiz: {
        isActive: false,          // Apakah kuis sedang berjalan
        isFinished: false,        // Apakah kuis telah selesai
        isReviewing: false,       // Apakah pengguna sedang dalam mode meninjau kuis
        shuffledQuestions: [],  // Daftar pertanyaan kuis yang sudah diacak
        userAnswers: [],        // Menyimpan jawaban yang diberikan pengguna
        currentIndex: 0,        // Indeks pertanyaan yang sedang ditampilkan
        score: 0,               // Skor kuis pengguna
    }, // Menyimpan state yang berhubungan dengan kuis
};
// tombol UP
export const scrollState = {
    timeout: null,
    lastScrollY: 0
};

// Detail untuk setiap level pelajaran (judul dan warna)
export const levelDetails = {
    'Ibtida’i': { title: 'Tingkat Ibtida’i (Pemula)', color: 'green' },
    'Mutawassit': { title: 'Tingkat Mutawassit (Menengah)', color: 'blue' },
    'Mutaqaddim': { title: 'Tingkat Mutaqaddim (Mahir)', color: 'purple' }
};

// Urutan level untuk ditampilkan di halaman utama
export const levelsInOrder = ['Ibtida’i', 'Mutawassit', 'Mutaqaddim'];