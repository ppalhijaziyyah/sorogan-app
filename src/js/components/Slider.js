
/**
 * @file Slider.js
 * @description Komponen untuk mengelola slider bawah.
 */

import { DOM } from '../dom.js';

/**
 * Menampilkan slider dari bawah layar.
 * @param {string} title - Judul yang akan ditampilkan di header slider.
 * @param {string} contentHTML - Konten HTML yang akan dimasukkan ke dalam slider.
 * @param {string} [type='default'] - Tipe konten ('irab' atau 'default') untuk styling.
 */
export function showSlider(title, contentHTML, type = 'default', onClose = null) {
    const direction = type === 'irab' ? 'rtl' : 'ltr';
    const contentClass = type === 'irab' ? 'irab-content' : '';

    // Reset inline styles untuk memastikan perhitungan baru akurat
    DOM.slider.panel.style.height = '';
    DOM.slider.panel.style.maxHeight = '';

    DOM.slider.title.textContent = title;
    DOM.slider.content.innerHTML = `<div class="prose dark:prose-invert max-w-none ${contentClass}">${contentHTML}</div>`;
    DOM.slider.content.dir = direction;

    // Simpan callback untuk dieksekusi saat ditutup
    DOM.slider.panel.onCloseCallback = onClose;

    // Tampilkan backdrop terlebih dahulu
    DOM.slider.backdrop.classList.remove('hidden');

    // Gunakan timeout singkat agar browser dapat merender konten baru
    // dan menghitung dimensinya sebelum kita ukur.
    setTimeout(() => {
        const titleWrapper = DOM.slider.title.closest('.flex-shrink-0');

        // Perhitungan akurat dari ruang yang digunakan oleh elemen non-konten
        const titleWrapperHeight = titleWrapper.offsetHeight;
        const titleWrapperMarginBottom = parseFloat(getComputedStyle(titleWrapper).marginBottom);

        // Panel memiliki padding p-6 (1.5rem), yaitu 24px atas & 24px bawah.
        const panelVerticalPadding = 48;

        // Total tinggi yang dibutuhkan untuk semua elemen *kecuali* konten yang dapat digulir
        const chromeHeight = titleWrapperHeight + titleWrapperMarginBottom + panelVerticalPadding;

        // Tinggi aktual dari konten teks itu sendiri
        const contentHeight = DOM.slider.content.scrollHeight;

        // Tinggi total ideal untuk seluruh panel slider
        const idealPanelHeight = contentHeight + chromeHeight;

        const maxAllowedHeight = window.innerHeight * 0.9; // 90% dari tinggi layar

        if (idealPanelHeight < maxAllowedHeight) {
            // Jika tinggi ideal muat di layar, gunakan tinggi tersebut.
            // Ini membuat slider pas dengan konten, sehingga tidak ada bilah gulir.
            DOM.slider.panel.style.height = `${idealPanelHeight}px`;
            DOM.slider.content.classList.remove('overflow-y-auto');
        } else {
            // Jika konten terlalu panjang, batasi tinggi dan biarkan kontennya dapat digulir.
            DOM.slider.panel.style.height = `${maxAllowedHeight}px`;
            DOM.slider.content.classList.add('overflow-y-auto');
        }

        // Animasikan slider agar muncul ke layar
        DOM.slider.backdrop.classList.remove('opacity-0');
        DOM.slider.panel.classList.remove('translate-y-full');
    }, 10);
}

/** Menyembunyikan slider bawah. */
export function hideSlider() {
    DOM.slider.backdrop.classList.add('opacity-0');
    DOM.slider.panel.classList.add('translate-y-full');

    setTimeout(() => {
        DOM.slider.backdrop.classList.add('hidden');
        // Reset inline styles
        DOM.slider.panel.style.height = '';
        DOM.slider.panel.style.maxHeight = '';
        // Kembalikan kelas overflow untuk penggunaan berikutnya
        DOM.slider.content.classList.add('overflow-y-auto');

        // Jalankan callback jika ada, lalu bersihkan
        if (DOM.slider.panel.onCloseCallback) {
            DOM.slider.panel.onCloseCallback();
            DOM.slider.panel.onCloseCallback = null;
        }
    }, 300);
}

/** Inisialisasi event listener untuk slider. */
export function initSliderEventListeners() {
    DOM.slider.closeBtn.addEventListener('click', hideSlider);
    DOM.slider.backdrop.addEventListener('click', hideSlider);
}
