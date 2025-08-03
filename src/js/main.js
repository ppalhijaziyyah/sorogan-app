
/**
 * @file main.js
 * @description Titik masuk utama (entry point) untuk aplikasi JavaScript.
 * File ini menginisialisasi semua komponen utama aplikasi setelah DOM siap.
 */

import '../style.css'; // Impor file CSS utama untuk dibundel oleh Vite
import { initEventListeners } from './events.js';
import { loadTheme, loadCompletedLessons } from './utils.js';
import { renderFilterButtons } from './ui.js';
import { fetchMasterIndex } from './api.js';

/**
 * Fungsi inisialisasi utama aplikasi.
 * Dijalankan ketika semua konten DOM telah dimuat.
 */
function initApp() {
    // Menyiapkan semua event listener global
    initEventListeners();

    // Memuat tema (dark/light) dari localStorage atau preferensi sistem
    loadTheme();

    // Memuat progres belajar pengguna (pelajaran yang sudah selesai)
    loadCompletedLessons();

    // Merender tombol-tombol filter di halaman utama
    renderFilterButtons();

    // Memulai proses dengan mengambil data indeks utama pelajaran
    fetchMasterIndex();
}

// Menjalankan fungsi inisialisasi setelah seluruh dokumen HTML dimuat dan di-parse.
// Ini memastikan semua elemen DOM yang direferensikan sudah ada.
document.addEventListener('DOMContentLoaded', initApp);
