/**
 * @file events.js
 * @description Modul untuk mengelola semua event listener aplikasi.
 * Ini memisahkan logika penanganan event dari rendering UI dan manajemen state.
 */

import { DOM } from './dom.js';
import { scrollState } from './state.js';
import { showConfirmationModal, initModalEventListeners } from './components/Modal.js';
import { showSlider, initSliderEventListeners } from './components/Slider.js';
import { initHomePageEventListeners, renderHomePage } from './components/HomePage.js';
import { toggleTheme, resetProgress } from './utils.js';
import { managePopoverPosition } from './components/LearningPage.js';

/** Inisialisasi semua event listener utama yang berjalan sepanjang aplikasi. */
export function initEventListeners() {
    // Inisialisasi listener untuk komponen-komponen spesifik
    initHomePageEventListeners();
    initSliderEventListeners();
    initModalEventListeners();

    // Listener untuk tombol ganti tema
    DOM.theme.toggleBtn.addEventListener('click', toggleTheme);

    // Listener untuk tombol reset progres
    DOM.resetProgressBtn.addEventListener('click', () => {
        showConfirmationModal(
            'Anda yakin ingin mereset seluruh data aplikasi? Tindakan ini akan menghapus progres belajar, pengaturan tema, dan status tutorial. Aplikasi akan dimuat ulang.',
            resetProgress // Langsung panggil fungsi reset yang akan me-reload halaman
        );
    });

    // Listener untuk tombol "Tentang Kami"
    DOM.aboutUsBtn.addEventListener('click', () => {
        const title = 'Tentang Sorogan App';
        const content = `
            <div class="space-y-4 text-left">
                <p><strong>Sorogan App</strong> adalah platform modern untuk memfasilitasi pembelajaran membaca teks Arab klasik (kitab kuning) secara interaktif.</p>
                <p>Aplikasi ini dibuat untuk membantu para santri dan pelajar di seluruh dunia agar dapat belajar dengan lebih mudah, di mana saja dan kapan saja.</p>
                <p>Proyek ini adalah eksperimen open-source yang dikembangkan dengan bantuan model bahasa Gemini dari Google.</p>
            </div>
        `;
        showSlider(title, content);
    });

    // Listener untuk tombol "Dukung Kami"
    DOM.supportUsBtn.addEventListener('click', () => {
        const title = 'Dukung Pengembangan Aplikasi';
        const content = `
            <div class="space-y-4 text-left">
                <p>Aplikasi ini gratis dan akan selalu gratis. Jika Anda merasa aplikasi ini bermanfaat dan ingin mendukung pengembangan materi pelajaran dan fitur-fitur baru di masa depan, Anda bisa memberikan donasi melalui tautan di bawah:</p>
                <div class="text-center">
                    <a href="https://saweria.co/example" target="_blank" rel="noopener noreferrer" class="inline-block bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-6 rounded-lg transition-colors">Donasi via Saweria</a>
                </div>
                
                <hr class="border-gray-300 dark:border-gray-600">
                <p><strong>Kontribusi Materi Pelajaran:</strong> Kami menerima kontribusi dalam bentuk materi pelajaran (teks Arab, terjemahan, i'rab) yang relevan. Jika Anda berminat, silakan hubungi kami melalui email di <a href="mailto:ppalhijaziyyah@gmail.com" class="text-teal-500 hover:underline">ppalhijaziyyah@gmail.com</a>.</p>

                <hr class="border-gray-300 dark:border-gray-600">
                <p><strong>Kontribusi Kode:</strong> Kami sangat terbuka bagi para developer yang ingin berkontribusi. Anda bisa melihat repositori kami di GitHub untuk melihat isu yang ada atau mengajukan <em>pull request</em>.</p>
                <div class="text-center">
                     <a href="https://github.com/ppalhijaziyyah/sorogan-app" target="_blank" rel="noopener noreferrer" class="inline-block bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-6 rounded-lg transition-colors">Lihat di GitHub</a>
                </div>
            </div>
        `;
        showSlider(title, content);
    });

    // Listener untuk menyesuaikan posisi popover saat ukuran window berubah
    window.addEventListener('resize', managePopoverPosition);

    // DOM untuk tombol UP
    DOM.scrollToTopBtn.classList.add('opacity-0', 'translate-y-12', 'pointer-events-none');

    // Event listener scroll
    window.addEventListener('scroll', handleScroll);

    // Event listener klik tombol
    DOM.scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });

        DOM.scrollToTopBtn.classList.add('opacity-0', 'translate-y-12');
        DOM.scrollToTopBtn.classList.remove('opacity-100', 'translate-y-0');

        if (scrollState.timeout) {
            clearTimeout(scrollState.timeout);
            scrollState.timeout = null;
        }
    });
}

// tombol UP
function handleScroll() {
    if (DOM.learningPage.classList.contains('hidden')) {
        return;
    }

    const currentScrollY = window.scrollY;

    if (currentScrollY < scrollState.lastScrollY && currentScrollY > 300) {
        if (scrollState.timeout) {
            clearTimeout(scrollState.timeout);
            scrollState.timeout = null;
        }

        DOM.scrollToTopBtn.classList.remove('opacity-0', 'translate-y-12', 'pointer-events-none');
        DOM.scrollToTopBtn.classList.add('opacity-100', 'translate-y-0');

        scrollState.timeout = setTimeout(() => {
            DOM.scrollToTopBtn.classList.add('opacity-0', 'translate-y-12');
            DOM.scrollToTopBtn.classList.remove('opacity-100', 'translate-y-0');
            setTimeout(() => {
                if (DOM.scrollToTopBtn.classList.contains('opacity-0')) {
                    DOM.scrollToTopBtn.classList.add('pointer-events-none');
                }
            }, 300);
        }, 2000);

    } else if (currentScrollY > scrollState.lastScrollY || currentScrollY <= 300) {
        if (scrollState.timeout) {
            clearTimeout(scrollState.timeout);
            scrollState.timeout = null;
        }

        DOM.scrollToTopBtn.classList.add('opacity-0', 'translate-y-12');
        DOM.scrollToTopBtn.classList.remove('opacity-100', 'translate-y-0');

        setTimeout(() => {
            if (DOM.scrollToTopBtn.classList.contains('opacity-0')) {
                DOM.scrollToTopBtn.classList.add('pointer-events-none');
            }
        }, 300);
    }

    scrollState.lastScrollY = currentScrollY;
}