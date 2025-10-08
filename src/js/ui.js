/**
 * @file ui.js
 * @description Mengelola semua fungsi yang berkaitan dengan rendering dan pembaruan antarmuka pengguna (UI).
 * Ini termasuk merender halaman, menampilkan/menyembunyikan elemen, dan mengelola tampilan visual.
 */

import { DOM } from './dom.js';
import { state, scrollState } from './state.js';
import { renderHomePage } from './components/HomePage.js';

// --- Fungsi Utilitas UI ---

/** Menampilkan overlay loader. */
export function showLoader() { DOM.loader.classList.remove('hidden'); }

/** Menyembunyikan overlay loader. */
export function hideLoader() { DOM.loader.classList.add('hidden'); }

/**
 * Menampilkan pesan error di bagian atas layar.
 * @param {string} message - Pesan error yang akan ditampilkan.
 */
export function showError(message) {
    DOM.errorMessage.textContent = message;
    DOM.errorContainer.classList.remove('hidden');
    // Sembunyikan pesan setelah 5 detik
    setTimeout(() => DOM.errorContainer.classList.add('hidden'), 5000);
}

/**
 * Mengganti tampilan antara halaman utama dan halaman belajar.
 * @param {string} viewName - Nama tampilan yang akan diaktifkan ('home' atau 'learning').
 */
export function switchView(viewName) {
    DOM.homePage.classList.toggle('hidden', viewName !== 'home');
    DOM.learningPage.classList.toggle('hidden', viewName !== 'learning');

    if (viewName === 'home') {
        state.currentLesson = null;
        state.quiz.isActive = false;

        // ✅ PERBAIKAN: Reset scroll state dan sembunyikan tombol
        scrollState.lastScrollY = 0;
        if (scrollState.timeout) {
            clearTimeout(scrollState.timeout);
            scrollState.timeout = null;
        }

        DOM.scrollToTopBtn.classList.add('opacity-0', 'translate-y-12', 'pointer-events-none');
        DOM.scrollToTopBtn.classList.remove('opacity-100', 'translate-y-0');

        renderHomePage();
    } else if (viewName === 'learning') {
        // Reset scroll state saat masuk ke halaman learning
        scrollState.lastScrollY = window.scrollY;
    }
}