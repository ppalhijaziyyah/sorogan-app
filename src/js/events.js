
/**
 * @file events.js
 * @description Modul untuk mengelola semua event listener aplikasi.
 * Ini memisahkan logika penanganan event dari rendering UI dan manajemen state.
 */

import { DOM } from './dom.js';
import { state, scrollState } from './state.js';
import { fetchMasterIndex } from './api.js';
import {
    switchView,
    renderHomePage,
    updateActiveFilterButton,
    showSlider,
    hideSlider,
    showConfirmationModal,
    hideConfirmationModal,
    renderLearningPage,
    updateButtonAppearance,
    updateFocusMode,
    managePopoverPosition
} from './ui.js';
import { loadTheme, toggleTheme, loadCompletedLessons, saveCompletedLessons, resetProgress } from './utils.js';

/** Inisialisasi semua event listener utama yang berjalan sepanjang aplikasi. */
export function initEventListeners() {
    // Listener untuk filter di halaman utama
    DOM.filterContainer.addEventListener('click', handleFilterClick);

    // Listener untuk slider (menutup saat tombol close atau backdrop diklik)
    DOM.slider.closeBtn.addEventListener('click', hideSlider);
    DOM.slider.backdrop.addEventListener('click', hideSlider);

    // Listener untuk tombol ganti tema
    DOM.theme.toggleBtn.addEventListener('click', toggleTheme);

    // Listener untuk tombol reset progres
    DOM.resetProgressBtn.addEventListener('click', () => {
        showConfirmationModal(
            'Anda yakin ingin mereset semua progres belajar Anda? Tindakan ini tidak dapat dibatalkan.',
            () => {
                resetProgress();
                renderHomePage(); // Render ulang halaman utama setelah progres direset
            }
        );
    });

    // Listener untuk tombol batal di modal konfirmasi
    DOM.modal.cancelBtn.addEventListener('click', hideConfirmationModal);

    // Listener untuk menyesuaikan posisi popover saat ukuran window berubah
    window.addEventListener('resize', managePopoverPosition);

    // DOM untuk tombol UP
    // ✅ PASTIKAN tombol dimulai dalam keadaan tersembunyi
    DOM.scrollToTopBtn.classList.add('opacity-0', 'translate-y-12', 'pointer-events-none');

    // Event listener scroll
    window.addEventListener('scroll', handleScroll);

    // Event listener klik tombol
    DOM.scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Sembunyikan tombol setelah diklik
        DOM.scrollToTopBtn.classList.add('opacity-0', 'translate-y-12');
        DOM.scrollToTopBtn.classList.remove('opacity-100', 'translate-y-0');

        // Clear timeout jika ada
        if (scrollState.timeout) {
            clearTimeout(scrollState.timeout);
            scrollState.timeout = null;
        }
    });
}

/** Menyiapkan event listener khusus untuk halaman belajar. */
export function setupLearningPageEventListeners() {
    // Tombol kembali ke halaman utama
    document.getElementById('back-to-home-btn')?.addEventListener('click', () => switchView('home'));

    // Tombol untuk menampilkan/menyembunyikan semua harakat sekaligus
    document.getElementById('toggle-all-harakat-btn')?.addEventListener('click', handleToggleAllHarakat);

    // Saklar (toggle) untuk mode harakat
    // document.getElementById('harakat-toggle')?.addEventListener('change', handleHarakatToggle);

    // Saklar (toggle) untuk mode terjemahan
    // document.getElementById('translation-toggle')?.addEventListener('change', handleTranslationToggle);

    document.getElementById('harakat-toggle-btn')?.addEventListener('click', handleHarakatToggle);
    document.getElementById('translation-toggle-btn')?.addEventListener('click', handleTranslationToggle);
    document.getElementById('toggle-all-harakat-btn')?.addEventListener('click', handleToggleAllHarakat);

    // Event listener untuk klik pada kata (single click)
    document.getElementById('text-container')?.addEventListener('click', handleWordClick);

    // Event listener untuk klik ganda pada kata (untuk menampilkan i'rab)
    document.getElementById('text-container')?.addEventListener('dblclick', handleWordDoubleClick);

    // Tombol untuk menandai pelajaran sebagai selesai
    document.getElementById('mark-complete-btn')?.addEventListener('click', handleMarkComplete);

    // Tombol untuk membuka popover pengaturan tampilan
    document.getElementById('display-settings-btn')?.addEventListener('click', (e) => {
        e.stopPropagation(); // Mencegah event sampai ke document
        managePopoverPosition(); // Atur posisi sebelum menampilkan
        document.getElementById('display-settings-popover').classList.toggle('hidden');
    });

    // Slider untuk mengubah ukuran font Arab
    document.getElementById('arabic-font-slider')?.addEventListener('input', (e) => {
        DOM.html.style.setProperty('--arabic-font-size', `${e.target.value}rem`);
    });

    // Slider untuk mengubah ukuran font tooltip terjemahan
    document.getElementById('tooltip-font-slider')?.addEventListener('input', (e) => {
        DOM.html.style.setProperty('--tooltip-font-size', `${e.target.value}rem`);
    });

    // Slider untuk mengubah jarak antar baris
    document.getElementById('line-height-slider')?.addEventListener('input', (e) => {
        DOM.html.style.setProperty('--arabic-line-height', e.target.value);
    });

    // Slider untuk mengubah ukuran font I'rab
    document.getElementById('irab-font-slider')?.addEventListener('input', (e) => {
        DOM.html.style.setProperty('--irab-font-size', `${e.target.value}rem`);
    });

    // Saklar untuk mode fokus
    document.getElementById('focus-mode-toggle')?.addEventListener('change', handleFocusModeToggle);

    // Tombol untuk menampilkan terjemahan lengkap
    document.getElementById('show-full-translation-btn')?.addEventListener('click', () => {
        showSlider('Terjemahan Lengkap', `<p>${state.currentLesson.fullTranslation}</p>`, 'translation');
    });

    // Tombol untuk memulai kuis
    document.getElementById('start-quiz-btn')?.addEventListener('click', handleStartQuiz);

    // Tombol untuk mereset pengaturan tampilan ke default
    document.getElementById('reset-display-settings-btn')?.addEventListener('click', handleResetDisplaySettings);

    // Menutup popover jika klik di luar area popover
    document.addEventListener('click', (e) => {
        const popover = document.getElementById('display-settings-popover');
        const btn = document.getElementById('display-settings-btn');
        if (popover && !popover.classList.contains('hidden') && !popover.contains(e.target) && !btn.contains(e.target)) {
            popover.classList.add('hidden');
        }
    });
}

/** Menyiapkan event listener khusus untuk halaman kuis. */
export function setupQuizEventListeners() {
    // Event listener untuk kembali ke teks SETELAH kuis selesai
    document.getElementById('back-to-text-btn')?.addEventListener('click', () => {
        state.quiz.isActive = false;
        renderLearningPage();
    });

    // Event listener untuk opsi jawaban kuis
    document.querySelectorAll('.quiz-option').forEach(btn => btn.addEventListener('click', handleAnswerClick));

    // Event listener untuk keluar dari kuis KAPAN SAJA
    document.getElementById('exit-quiz-btn')?.addEventListener('click', () => {
        // Tampilkan modal konfirmasi sebelum keluar
        showConfirmationModal('Apakah Anda yakin ingin keluar dari kuis? Progres kuis ini akan hilang.', () => {
            state.quiz.isActive = false;
            state.quiz.isFinished = false; // Reset status selesai
            renderLearningPage(); // Kembali ke halaman teks pelajaran
        });
    });
}


// --- Fungsi Handler Event ---

/** Menangani klik pada tombol filter level. */
function handleFilterClick(e) {
    const btn = e.target.closest('.filter-btn');
    if (btn) {
        state.activeFilter = btn.dataset.level;
        updateActiveFilterButton();
        renderHomePage();
    }
}

// tombol UP
function handleScroll() {
    // Hentikan fungsi jika tidak di halaman belajar
    if (DOM.learningPage.classList.contains('hidden')) {
        return;
    }

    const currentScrollY = window.scrollY;

    // ✅ PERBAIKAN: Deteksi scroll ke atas dan posisi minimal
    if (currentScrollY < scrollState.lastScrollY && currentScrollY > 300) {
        // Pengguna scroll ke atas dan posisi > 300px

        // Hapus timer yang ada
        if (scrollState.timeout) {
            clearTimeout(scrollState.timeout);
            scrollState.timeout = null;
        }

        // Tampilkan tombol
        DOM.scrollToTopBtn.classList.remove('opacity-0', 'translate-y-12', 'pointer-events-none');
        DOM.scrollToTopBtn.classList.add('opacity-100', 'translate-y-0');

        // Set timer untuk sembunyikan setelah 2 detik
        scrollState.timeout = setTimeout(() => {
            DOM.scrollToTopBtn.classList.add('opacity-0', 'translate-y-12');
            DOM.scrollToTopBtn.classList.remove('opacity-100', 'translate-y-0');
            // Tambahkan pointer-events-none saat tersembunyi
            setTimeout(() => {
                if (DOM.scrollToTopBtn.classList.contains('opacity-0')) {
                    DOM.scrollToTopBtn.classList.add('pointer-events-none');
                }
            }, 300); // Tunggu transisi selesai
        }, 2000);

    } else if (currentScrollY > scrollState.lastScrollY || currentScrollY <= 300) {
        // Pengguna scroll ke bawah ATAU posisi terlalu atas

        // Hapus timer
        if (scrollState.timeout) {
            clearTimeout(scrollState.timeout);
            scrollState.timeout = null;
        }

        // Sembunyikan tombol
        DOM.scrollToTopBtn.classList.add('opacity-0', 'translate-y-12');
        DOM.scrollToTopBtn.classList.remove('opacity-100', 'translate-y-0');

        // Tambahkan pointer-events-none setelah transisi
        setTimeout(() => {
            if (DOM.scrollToTopBtn.classList.contains('opacity-0')) {
                DOM.scrollToTopBtn.classList.add('pointer-events-none');
            }
        }, 300);
    }

    // ✅ PERBAIKAN KUNCI: Update lastScrollY
    scrollState.lastScrollY = currentScrollY;
}


/** Menangani klik pada tombol "Toggle Semua Harakat". */
function handleToggleAllHarakat(e) {
    // Tombol ini hanya berfungsi jika mode harakat aktif
    if (!state.isHarakatShown) return;

    const shouldShow = !e.currentTarget.classList.contains('bg-teal-500');
    updateButtonAppearance(e.currentTarget, shouldShow);

    document.querySelectorAll('#text-container span[data-gundul]').forEach(span => {
        span.textContent = shouldShow ? span.dataset.berharakat : span.dataset.gundul;
    });
}

/** Menangani perubahan pada saklar mode harakat. */
function handleHarakatToggle(e) {
    state.isHarakatShown = !state.isHarakatShown;
    updateButtonAppearance(e.currentTarget, state.isHarakatShown);

    const toggleAllBtn = document.getElementById('toggle-all-harakat-btn');

    if (!state.isHarakatShown) {
        // Jika mode harakat dimatikan, nonaktifkan tombol aksi global
        updateButtonAppearance(toggleAllBtn, false, true); // (button, isActive, isDisabled)

        // **LOGIKA BARU**: Sembunyikan semua harakat yang sedang tampil
        document.querySelectorAll('#text-container span[data-gundul]').forEach(span => {
            span.textContent = span.dataset.gundul;
        });

    } else {
        // Jika mode harakat diaktifkan, aktifkan kembali tombol aksi global
        const isAllHarakatActive = toggleAllBtn.classList.contains('bg-teal-500');
        updateButtonAppearance(toggleAllBtn, isAllHarakatActive, false);
    }
}

/** Menangani perubahan pada saklar mode terjemahan. */
function handleTranslationToggle(e) {
    state.isTranslationShown = !state.isTranslationShown;
    updateButtonAppearance(e.currentTarget, state.isTranslationShown);

    if (!state.isTranslationShown) {
        document.querySelectorAll('.translation-tooltip').forEach(tip => tip.remove());
    }
}

/** Menangani klik pada sebuah kata dalam teks pelajaran. */
function handleWordClick(e) {
    const span = e.target.closest('span[data-gundul]');
    if (!span) return;

    const spanWrapper = span.parentElement;
    const hasTranslationData = span.dataset.terjemahan && span.dataset.terjemahan.trim() !== '';
    const isBerharakat = span.textContent === span.dataset.berharakat;
    const currentTooltip = spanWrapper.querySelector('.translation-tooltip');

    // Fungsi bantuan untuk menampilkan tooltip
    const showTooltip = () => {
        if (currentTooltip || !hasTranslationData) return;
        const tooltip = document.createElement('div');
        tooltip.className = 'translation-tooltip bg-gray-800 text-white rounded py-1 px-3 z-10';
        tooltip.textContent = span.dataset.terjemahan;

        // --- BLOK LOGIKA PENGUKURAN BARU ---

        // 1. Ukur lebar teks Arab (span)
        const arabicTextWidth = span.offsetWidth;

        // 2. Ukur lebar kata terpanjang dalam terjemahan
        const translationWords = span.dataset.terjemahan.split(' ');
        let longestWordWidth = 0;

        // Buat elemen sementara untuk mengukur lebar kata dengan style yang sama dengan tooltip
        const tempMeasurer = document.createElement('div');
        tempMeasurer.className = 'translation-tooltip bg-gray-800 text-white rounded py-1 px-3 z-10';
        tempMeasurer.style.position = 'absolute';
        tempMeasurer.style.visibility = 'hidden';
        tempMeasurer.style.top = '-9999px'; // Pastikan tidak terlihat
        tempMeasurer.style.whiteSpace = 'nowrap'; // Pastikan tidak ada line break
        document.body.appendChild(tempMeasurer);

        // Ukur lebar kata terpanjang
        translationWords.forEach(word => {
            tempMeasurer.textContent = word;
            const wordWidth = tempMeasurer.offsetWidth;
            if (wordWidth > longestWordWidth) {
                longestWordWidth = wordWidth;
            }
        });

        // Hapus elemen sementara dari DOM
        document.body.removeChild(tempMeasurer);

        // 3. Tentukan lebar tooltip yang diperlukan (required width)
        // Prioritas: gunakan lebar teks Arab, tapi jika ada kata yang lebih panjang, gunakan kata tersebut
        // Tambahkan buffer untuk mencegah pemotongan
        const requiredWidth = Math.max(arabicTextWidth, longestWordWidth) + 8; // Buffer 8px

        // 4. TERAPKAN SEBAGAI 'width', BUKAN 'maxWidth'
        tooltip.style.width = `${requiredWidth}px`;
        tooltip.style.whiteSpace = 'normal'; // Izinkan text wrapping dalam tooltip
        tooltip.style.wordBreak = 'normal'; // Jangan pecah kata di tengah
        tooltip.style.overflowWrap = 'break-word'; // Hanya pecah kata jika benar-benar diperlukan
        tooltip.style.lineHeight = '1.4'; // Atur line height untuk readability

        // --- AKHIR BLOK LOGIKA PENGUKURAN ---

        // Sisa kode untuk memposisikan tooltip (tidak berubah)
        const computedStyle = getComputedStyle(span);
        const lineHeight = parseFloat(computedStyle.lineHeight);
        const fontSize = parseFloat(computedStyle.fontSize);
        const spaceAbove = (lineHeight - fontSize) / 2;
        const textBottomPosition = spaceAbove + fontSize;
        tooltip.style.top = `${textBottomPosition + 8}px`;
        tooltip.style.left = '50%';

        spanWrapper.appendChild(tooltip);
    };

    // Fungsi bantuan untuk menghapus tooltip
    const removeTooltip = () => {
        if (currentTooltip) currentTooltip.remove();
    };

    // Logika utama berdasarkan kombinasi status saklar
    if (state.isHarakatShown && state.isTranslationShown) {
        span.textContent = isBerharakat ? span.dataset.gundul : span.dataset.berharakat;
        currentTooltip ? removeTooltip() : showTooltip();
    } else if (state.isHarakatShown) {
        span.textContent = isBerharakat ? span.dataset.gundul : span.dataset.berharakat;
        removeTooltip();
    } else if (state.isTranslationShown) {
        span.textContent = span.dataset.gundul; // Pastikan teks selalu gundul
        currentTooltip ? removeTooltip() : showTooltip();
    } else {
        span.textContent = span.dataset.gundul;
        removeTooltip();
    }

    // Update mode fokus jika aktif
    const paragraph = e.target.closest('.paragraph-container');
    if (paragraph) {
        state.currentFocusParagraph = parseInt(paragraph.dataset.pIndex);
        updateFocusMode();
    }
}

/** Menangani klik ganda pada sebuah kata untuk menampilkan I'rab. */
function handleWordDoubleClick(e) {
    const span = e.target.closest('span[data-gundul]');
    if (span && span.dataset.irab) {
        showSlider(span.dataset.berharakat, span.dataset.irab, 'irab');
    }
}

/** Menangani klik pada tombol "Tandai sebagai Selesai". */
function handleMarkComplete(e) {
    const lessonId = state.currentLesson.id;
    const index = state.completedLessons.indexOf(lessonId);

    if (index > -1) {
        state.completedLessons.splice(index, 1); // Hapus jika sudah ada
    } else {
        state.completedLessons.push(lessonId); // Tambah jika belum ada
    }
    saveCompletedLessons(); // Simpan ke localStorage

    // Update tampilan tombol
    const isCompleted = state.completedLessons.includes(lessonId);
    e.target.textContent = isCompleted ? '✓ Selesai Dipelajari' : 'Tandai sebagai Selesai';
    e.target.classList.toggle('bg-green-500', isCompleted);
    e.target.classList.toggle('text-white', isCompleted);
    e.target.classList.toggle('bg-gray-200', !isCompleted);
    e.target.classList.toggle('dark:bg-gray-600', !isCompleted);
}

/** Menangani klik pada tombol "Mulai Kuis". */
function handleStartQuiz() {
    const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

    state.quiz.isActive = true;
    state.quiz.shuffledQuestions = shuffle(state.currentLesson.quizData);
    state.quiz.currentIndex = 0;
    state.quiz.score = 0;
    state.quiz.isFinished = false;

    renderLearningPage(); // Render ulang halaman belajar yang kini akan menampilkan kuis
    window.scrollTo(0, 0); // posisi layar ke top
}

/** Menangani klik pada pilihan jawaban kuis. */
function handleAnswerClick(e) {
    const selectedButton = e.target;
    const optionsContainer = selectedButton.parentElement;

    // Mencegah jawaban ganda
    if (optionsContainer.dataset.answered) return;
    optionsContainer.dataset.answered = 'true';

    const selectedAnswer = selectedButton.textContent;
    const currentQuestion = state.quiz.shuffledQuestions[state.quiz.currentIndex];
    const correctAnswer = currentQuestion.options[currentQuestion.correctAnswer];
    const feedbackEl = document.getElementById('quiz-feedback');

    if (selectedAnswer === correctAnswer) {
        selectedButton.className = 'quiz-option w-full p-3 bg-green-500 text-white rounded-lg text-left';
        feedbackEl.textContent = 'Jawaban Benar!';
        feedbackEl.className = 'mt-6 text-center font-bold h-6 text-green-500';
        state.quiz.score++;
    } else {
        selectedButton.className = 'quiz-option w-full p-3 bg-red-500 text-white rounded-lg text-left';
        feedbackEl.textContent = 'Jawaban Kurang Tepat.';
        feedbackEl.className = 'mt-6 text-center font-bold h-6 text-red-500';
        // Tampilkan jawaban yang benar
        Array.from(optionsContainer.children).forEach(button => {
            if (button.textContent === correctAnswer) {
                button.className = 'quiz-option w-full p-3 bg-green-500 text-white rounded-lg text-left';
            }
        });
    }

    // Lanjut ke pertanyaan berikutnya atau selesaikan kuis setelah 2 detik
    setTimeout(() => {
        if (state.quiz.currentIndex < state.quiz.shuffledQuestions.length - 1) {
            state.quiz.currentIndex++;
            renderLearningPage(); // Render pertanyaan berikutnya
        } else {
            state.quiz.isFinished = true;
            renderLearningPage(); // Render halaman hasil kuis
        }
    }, 2000);
}

/** Menangani perubahan pada saklar mode fokus. */
function handleFocusModeToggle(e) {
    state.isFocusMode = e.target.checked;
    updateFocusMode();
}

/** Mereset pengaturan tampilan ke nilai default. */
function handleResetDisplaySettings() {
    const defaults = {
        '--arabic-font-size': '1.875rem',
        '--tooltip-font-size': '0.875rem',
        '--arabic-line-height': '2.5',
        '--irab-font-size': '1.5rem'
    };
    const sliderDefaults = {
        'arabic-font-slider': '1.875',
        'tooltip-font-slider': '0.875',
        'line-height-slider': '2.5',
        'irab-font-slider': '1.5'
    };

    // Terapkan nilai default ke CSS custom properties
    for (const [prop, value] of Object.entries(defaults)) {
        DOM.html.style.setProperty(prop, value);
    }

    // Reset posisi slider ke nilai default
    for (const [id, value] of Object.entries(sliderDefaults)) {
        const slider = document.getElementById(id);
        if (slider) slider.value = value;
    }
}
