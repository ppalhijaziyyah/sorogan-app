
/**
 * @file utils.js
 * @description Berisi fungsi-fungsi bantuan umum (utilitas) yang digunakan di seluruh aplikasi,
 * seperti manajemen tema (dark/light mode) dan penyimpanan progres belajar.
 */

import { DOM } from './dom.js';
import { state } from './state.js';

// --- Manajemen Progres Belajar ---

/** Memuat status tutorial dari localStorage. */
export function loadHasSeenTutorial() {
    state.hasSeenTutorial = localStorage.getItem('hasSeenTutorial') === 'true';
}

/** Menandai bahwa tutorial telah dilihat dan menyimpannya ke localStorage. */
export function markTutorialAsSeen() {
    state.hasSeenTutorial = true;
    localStorage.setItem('hasSeenTutorial', 'true');
}


/** Memuat daftar pelajaran yang telah selesai dari localStorage. */
export function loadCompletedLessons() {
    state.completedLessons = JSON.parse(localStorage.getItem('completedLessons')) || [];
}

/** Menyimpan daftar pelajaran yang telah selesai ke localStorage. */
export function saveCompletedLessons() {
    localStorage.setItem('completedLessons', JSON.stringify(state.completedLessons));
}

/** Mereset semua data aplikasi. */
export function resetProgress() {
    // Hapus semua data yang disimpan oleh aplikasi ini
    localStorage.removeItem('completedLessons');
    localStorage.removeItem('hasSeenTutorial');
    localStorage.removeItem('theme');
    // Muat ulang halaman untuk menerapkan reset secara penuh
    window.location.reload();
}


// --- Manajemen Tema (Dark/Light Mode) ---

/** Memuat tema yang tersimpan atau menggunakan preferensi sistem. */
export function loadTheme() {
    // Cek apakah tema 'dark' tersimpan, atau jika tidak ada tema tersimpan TAPI sistem user preferensi dark mode
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        DOM.html.classList.add('dark');
        DOM.theme.lightIcon.classList.add('hidden');
        DOM.theme.darkIcon.classList.remove('hidden');
    } else {
        DOM.html.classList.remove('dark');
        DOM.theme.lightIcon.classList.remove('hidden');
        DOM.theme.darkIcon.classList.add('hidden');
    }
}

/** Mengganti antara tema terang dan gelap. */
export function toggleTheme() {
    // Toggle kelas 'dark' pada elemen <html>
    DOM.html.classList.toggle('dark');

    // Simpan preferensi tema baru ke localStorage
    localStorage.theme = DOM.html.classList.contains('dark') ? 'dark' : 'light';

    // Perbarui ikon tema yang ditampilkan
    loadTheme();
}

/**
 * Mengacak urutan elemen dalam sebuah array.
 * @param {Array} array - Array yang akan diacak.
 * @returns {Array} Array baru dengan urutan acak.
 */
export function shuffleArray(array) {
    return [...array].sort(() => Math.random() - 0.5);
}
