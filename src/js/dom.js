
/**
 * @file dom.js
 * @description Referensi terpusat untuk semua elemen DOM yang digunakan dalam aplikasi.
 * Ini memudahkan pengelolaan dan akses ke elemen UI tanpa harus meng-query DOM di banyak tempat.
 */

export const DOM = {
    // Elemen dasar
    html: document.documentElement,
    body: document.body,

    // Overlay dan Notifikasi
    loader: document.getElementById('loader-overlay'),
    errorContainer: document.getElementById('error-container'),
    errorMessage: document.getElementById('error-message'),

    // Kontainer Halaman Utama
    homePage: document.getElementById('home-page'),
    learningPage: document.getElementById('learning-page'),
    lessonGroupsContainer: document.getElementById('lesson-groups-container'),
    filterContainer: document.getElementById('filter-container'),

    // Slider Bawah (untuk I'rab, Terjemahan, dll.)
    slider: {
        backdrop: document.getElementById('bottom-slider-backdrop'),
        panel: document.getElementById('bottom-slider'),
        title: document.getElementById('slider-title'),
        content: document.getElementById('slider-content'),
        closeBtn: document.getElementById('close-slider-btn')
    },

    // Modal Konfirmasi
    modal: {
        container: document.getElementById('confirmation-modal'),
        message: document.getElementById('modal-message'),
        cancelBtn: document.getElementById('modal-cancel-btn'),
        confirmBtn: document.getElementById('modal-confirm-btn')
    },

    // Tombol dan Ikon Tema
    theme: {
        toggleBtn: document.getElementById('theme-toggle-btn'),
        lightIcon: document.getElementById('theme-icon-light'),
        darkIcon: document.getElementById('theme-icon-dark')
    },

    // Tombol Lainnya
    resetProgressBtn: document.getElementById('reset-progress-btn'),

    scrollToTopBtn: document.getElementById('scroll-to-top-btn'),
};
