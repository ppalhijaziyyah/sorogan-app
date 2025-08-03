
/**
 * @file ui.js
 * @description Mengelola semua fungsi yang berkaitan dengan rendering dan pembaruan antarmuka pengguna (UI).
 * Ini termasuk merender halaman, menampilkan/menyembunyikan elemen, dan mengelola tampilan visual.
 */

import { DOM } from './dom.js';
import { state, levelDetails, levelsInOrder, scrollState } from './state.js';
import { fetchLessonData } from './api.js';
import { setupLearningPageEventListeners, setupQuizEventListeners } from './events.js';

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
 * Menampilkan slider dari bawah layar.
 * @param {string} title - Judul yang akan ditampilkan di header slider.
 * @param {string} contentHTML - Konten HTML yang akan dimasukkan ke dalam slider.
 * @param {string} [type='default'] - Tipe konten ('irab' atau 'default') untuk styling.
 */
export function showSlider(title, contentHTML, type = 'default') {
    const direction = type === 'irab' ? 'rtl' : 'ltr';
    const contentClass = type === 'irab' ? 'irab-content' : '';

    // Reset inline styles untuk memastikan perhitungan baru akurat
    DOM.slider.panel.style.height = '';
    DOM.slider.panel.style.maxHeight = '';

    DOM.slider.title.textContent = title;
    DOM.slider.content.innerHTML = `<div class="prose dark:prose-invert max-w-none ${contentClass}">${contentHTML}</div>`;
    DOM.slider.content.dir = direction;

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
    }, 300);
}

export function updateButtonAppearance(button, isActive, isDisabled = false) {
    if (!button) return;

    const onIcon = button.querySelector('[id$="-on"]');
    const offIcon = button.querySelector('[id$="-off"]');

    // Logika umum untuk warna latar
    if (isActive) {
        button.classList.add('bg-teal-500', 'text-white');
        button.classList.remove('bg-gray-200', 'text-gray-800', 'dark:bg-gray-700', 'dark:text-gray-300');
    } else {
        button.classList.add('bg-gray-200', 'text-gray-800', 'dark:bg-gray-700', 'dark:text-gray-300');
        button.classList.remove('bg-teal-500', 'text-white');
    }

    // Logika untuk status nonaktif (disabled)
    if (isDisabled) {
        button.disabled = true;
        button.classList.add('opacity-50', 'cursor-not-allowed');
    } else {
        button.disabled = false;
        button.classList.remove('opacity-50', 'cursor-not-allowed');
    }

    // Logika khusus untuk tombol dengan ikon on/off
    if (onIcon && offIcon) {
        if (isActive) {
            onIcon.classList.remove('hidden');
            offIcon.classList.add('hidden');
        } else {
            onIcon.classList.add('hidden');
            offIcon.classList.remove('hidden');
        }
    }
}

/**
 * Menampilkan modal konfirmasi.
 * @param {string} message - Pesan yang akan ditampilkan di modal.
 * @param {function} onConfirm - Fungsi callback yang akan dijalankan saat tombol konfirmasi diklik.
 */
export function showConfirmationModal(message, onConfirm) {
    DOM.modal.message.textContent = message;

    // Hapus event listener lama dan tambahkan yang baru untuk menghindari penumpukan
    const newConfirmBtn = DOM.modal.confirmBtn.cloneNode(true);
    DOM.modal.confirmBtn.parentNode.replaceChild(newConfirmBtn, DOM.modal.confirmBtn);
    DOM.modal.confirmBtn = newConfirmBtn;

    DOM.modal.confirmBtn.onclick = () => {
        onConfirm();
        hideConfirmationModal();
    };

    DOM.modal.container.classList.remove('hidden');
}

/** Menyembunyikan modal konfirmasi. */
export function hideConfirmationModal() {
    DOM.modal.container.classList.add('hidden');
}


// --- Fungsi Rendering Halaman ---

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

/** Merender tombol filter level di halaman utama. */
export function renderFilterButtons() {
    const buttons = [
        { level: 'All', text: 'Semua' },
        ...levelsInOrder.map(l => ({ level: l, text: l }))
    ];

    DOM.filterContainer.innerHTML = buttons.map(btn =>
        `<button data-level="${btn.level}" class="filter-btn text-white py-2 px-5 rounded-full shadow-md">${btn.text}</button>`
    ).join('');

    updateActiveFilterButton();
}

/** Memperbarui tampilan visual tombol filter yang aktif. */
export function updateActiveFilterButton() {
    DOM.filterContainer.querySelectorAll('.filter-btn').forEach(btn => {
        const isActive = (btn.dataset.level === state.activeFilter) || (state.activeFilter === 'All');

        // Hapus semua class state terlebih dahulu
        btn.classList.remove('active', 'bg-gray-400', 'dark:bg-gray-600',
            'text-gray-800', 'dark:text-gray-300', 'text-white');

        if (isActive) {
            // Untuk tombol aktif
            btn.classList.add('active', 'text-white');
            // Gunakan setTimeout untuk memberikan delay transisi yang smooth
            setTimeout(() => {
                btn.style.backgroundImage = 'var(--accent-gradient)';
            }, 50);
        } else {
            // Untuk tombol non-aktif
            btn.style.backgroundImage = 'none';
            setTimeout(() => {
                btn.classList.add('bg-gray-400', 'dark:bg-gray-600',
                    'text-gray-800', 'dark:text-gray-300');
            }, 50);
        }
    });
}


/** Merender seluruh konten halaman utama, termasuk grup pelajaran. */
export function renderHomePage() {
    DOM.lessonGroupsContainer.innerHTML = ''; // Kosongkan kontainer
    const levelsToRender = state.activeFilter === 'All' ? levelsInOrder : [state.activeFilter];
    let lessonsFound = false;

    levelsToRender.forEach(level => {
        const lessonsForLevel = state.masterIndex.filter(lesson => lesson.level === level);
        if (lessonsForLevel.length === 0) return; // Lewati jika tidak ada pelajaran untuk level ini

        lessonsFound = true;
        const section = document.createElement('div');
        section.innerHTML = `<h2 class="text-2xl font-bold mb-4 pb-2 border-b-2 text-teal-600 dark:text-teal-400 border-teal-500/50">${levelDetails[level].title}</h2>`;

        const gridContainer = document.createElement('div');
        gridContainer.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';

        lessonsForLevel.forEach(lessonInfo => {
            const isCompleted = state.completedLessons.includes(lessonInfo.id);
            const card = document.createElement('div');
            card.className = `card-glass p-6 rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-1 cursor-pointer transition-all relative overflow-hidden flex flex-col ${isCompleted ? 'opacity-70' : ''}`;
            card.onclick = () => fetchLessonData(lessonInfo);

            card.innerHTML = `
                ${isCompleted ? `<div class="absolute top-2 left-2 bg-emerald-500 text-white rounded-full w-7 h-7 flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg></div>` : ''}
                <div class="flex-grow">
                    <h3 class="text-xl font-bold arabic-font text-right">${lessonInfo.titleArabic || ''}</h3>
                    <p class="text-md font-semibold mt-1">${lessonInfo.title}</p>
                    <p class="text-sm italic text-gray-500 dark:text-gray-400 mt-3">"${lessonInfo.preview || ''}"</p>
                </div>
            `;
            gridContainer.appendChild(card);
        });

        section.appendChild(gridContainer);
        DOM.lessonGroupsContainer.appendChild(section);
    });

    // Tampilkan pesan jika tidak ada pelajaran yang ditemukan untuk filter yang dipilih
    if (!lessonsFound && state.activeFilter !== 'All') {
        DOM.lessonGroupsContainer.innerHTML = `<p class="text-center col-span-full">Tidak ada pelajaran untuk tingkatan ini.</p>`;
    }
}

/** Merender halaman belajar untuk pelajaran yang aktif. */
export function renderLearningPage() {
    if (state.quiz.isActive) {
        renderQuizPage();
        return;
    }

    const lesson = state.currentLesson;
    const isCompleted = state.completedLessons.includes(lesson.id);

    DOM.learningPage.innerHTML = `
<header class="flex justify-between items-center mb-8">
            <button id="back-to-home-btn" title="Kembali ke Beranda"
                class="p-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-house-fill" viewBox="0 0 16 16">
  <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L8 2.207l6.646 6.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293z"/>
  <path d="m8 3.293 6 6V13.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5V9.293z"/>
</svg>
                </button>
            <h1 class="text-2xl md:text-3xl font-bold bg-clip-text text-transparent arabic-font text-right truncate"
                style="background-image: var(--accent-gradient)">${lesson.titleArabic || lesson.title}</h1>

                <!-- Konten Popover Pengaturan Tampilan -->
                    <div class="relative">
                        <button id="display-settings-btn" title="Pengaturan Tampilan Teks"
                            class="p-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg shadow-md">
                           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-sliders2" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M10.5 1a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V4H1.5a.5.5 0 0 1 0-1H10V1.5a.5.5 0 0 1 .5-.5M12 3.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5m-6.5 2A.5.5 0 0 1 6 6v1.5h8.5a.5.5 0 0 1 0 1H6V10a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5M1 8a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2A.5.5 0 0 1 1 8m9.5 2a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V13H1.5a.5.5 0 0 1 0-1H10v-1.5a.5.5 0 0 1 .5-.5m1.5 2.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5"/>
</svg>
                        </button>
                        <div id="display-settings-popover"
                            class="hidden fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11/12 max-w-sm p-4 card-glass rounded-lg shadow-xl z-20 md:absolute md:top-full md:right-0 md:left-auto md:w-64 md:transform-none md:mt-2">
                            <div class="space-y-4">
                                <div><label for="arabic-font-slider" class="block text-sm font-medium">Ukuran Teks
                                        Arab</label><input id="arabic-font-slider" type="range" min="1.25" max="3"
                                        value="1.875" step="0.125"
                                        class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-600">
                                </div>
                                <div><label for="tooltip-font-slider" class="block text-sm font-medium">Ukuran Teks
                                        Terjemahan</label><input id="tooltip-font-slider" type="range" min="0.6"
                                        max="1.25" value="0.875" step="0.0625"
                                        class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-600">
                                </div>
                                <div><label for="line-height-slider" class="block text-sm font-medium">Jarak Antar
                                        Baris</label><input id="line-height-slider" type="range" min="1.5" max="4.5"
                                        value="2.5" step="0.05"
                                        class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-600">
                                </div>
                                <!-- **FITUR BARU: Slider untuk ukuran font I'rab** -->
                                <div><label for="irab-font-slider" class="block text-sm font-medium">Ukuran Teks
                                        I'rab</label><input id="irab-font-slider" type="range" min="0.75" max="3"
                                        value="1.5" step="0.0625"
                                        class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-600">
                                </div>
                                <div class="border-t border-gray-300 dark:border-gray-600 pt-4">
                                    <div class="flex items-center"><label for="focus-mode-toggle"
                                            class="text-sm font-medium">Mode Fokus</label><label
                                            class="relative inline-flex items-center cursor-pointer ml-auto"><input
                                                type="checkbox" id="focus-mode-toggle" class="sr-only peer">
                                            <div
                                                class="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-teal-600">
                                            </div>
                                        </label></div>
                                </div>
                                <div class="mt-4 pt-4 border-t border-gray-300 dark:border-gray-600"><button
                                        id="reset-display-settings-btn"
                                        class="w-full text-sm bg-gray-500 hover:bg-gray-600 text-white py-1 px-3 rounded">Reset
                                        ke Default</button></div>
                            </div>
                        </div>
                    </div>
        </header>
        <main>
            <div class="flex justify-center items-center flex-wrap gap-4 md:gap-6 mb-6">
                <!-- Grup Tombol Ikon Baru -->
                <div class="flex justify-center items-center flex-wrap gap-4 md:gap-6 mb-6">
                    <!-- Grup Tombol Ikon Baru -->
                    <div
                        class="flex items-center justify-center p-2 bg-white/50 dark:bg-gray-800/50 rounded-xl shadow-inner">
                        <div class="flex items-center gap-4">
                            <!-- Grup Tombol Mode -->
                            <div class="flex items-center gap-3">
                                <!-- Tombol Mode Harakat -->
                                <button id="harakat-toggle-btn" type="button" title="Mode Harakat (Klik per kata)"
                                    class="toggle-btn p-3 rounded-lg shadow-md transition-all duration-200 ease-in-out">
                                    <svg id="icon-harakat-on" width="24" height="24" viewBox="0 0 24 24"
                                        class="pointer-events-none">
                                        <text x="50%" y="17" text-anchor="middle" class="arabic-icon" font-size="1.5rem"
                                            fill="currentColor">حَ</text>
                                    </svg>
                                    <svg id="icon-harakat-off" width="24" height="24" viewBox="0 0 24 24"
                                        class="pointer-events-none hidden">
                                        <text x="50%" y="17" text-anchor="middle" class="arabic-icon" font-size="1.5rem"
                                            fill="currentColor">ح</text>
                                    </svg>
                                </button>
                                <!-- Tombol Mode Terjemahan -->
                                <button id="translation-toggle-btn" type="button"
                                    title="Mode Terjemahan (Klik per kata)"
                                    class="toggle-btn p-3 rounded-lg shadow-md transition-all duration-200 ease-in-out">
                                    <svg id="icon-translation-on" width="24" height="24" viewBox="0 0 24 24"
                                        class="pointer-events-none"><text x="50%" y="55%" dominant-baseline="middle"
                                            text-anchor="middle" font-weight="bold" font-size="16"
                                            fill="currentColor">T</text></svg>
                                    <svg id="icon-translation-off" width="24" height="24" viewBox="0 0 24 24"
                                        class="pointer-events-none hidden"><text x="50%" y="55%"
                                            dominant-baseline="middle" text-anchor="middle" font-weight="bold"
                                            font-size="16" fill="currentColor">T</text>
                                        <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="1.5"
                                            stroke-linecap="round" />
                                    </svg>
                                </button>
                            
                            <!-- Pemisah Visual -->
                         <!--   <div class="h-8 border-l border-gray-300 dark:border-gray-600"></div> -->
                            <!-- Tombol Aksi Global -->
                            <div class="flex">
                                <button id="toggle-all-harakat-btn" type="button"
                                    title="Tampilkan/Sembunyikan Semua Harakat"
                                    class="toggle-btn p-3 rounded-lg shadow-md transition-all duration-200 ease-in-out">
                                    <svg id="icon-all-harakat-on" width="24" height="24" viewBox="-2 -4 28 28"
                                        xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-width="2"
                                        stroke-linecap="round" stroke-linejoin="round" fill="none"
                                        class="pointer-events-none">
                                        <path
                                            d="M15 14c.2-1 .7-1.7 1.5-2.5C17.7 10.2 18 9 18 8a6 6 0 0 0-12 0c0 1 .3 2.2 1.5 3.5.7.7 1.2 1.5 1.5 2.5M9 18h6m-5 4h4" />
                                        <path
                                            d="M 12 -1 V -3 M 21 8 H 23 M 1 8 H 3 M 19 2 L 21 0 M 3 16 L 5 14 M 19 14 L 21 16 M 3 0 L 5 2" />
                                    </svg>
                                    <svg id="icon-all-harakat-off" width="24" height="24" viewBox="-2 -4 28 28"
                                        xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-width="2"
                                        stroke-linecap="round" stroke-linejoin="round" fill="none"
                                        class="pointer-events-none hidden">
                                        <path
                                            d="M15 14c.2-1 .7-1.7 1.5-2.5C17.7 10.2 18 9 18 8a6 6 0 0 0-12 0c0 1 .3 2.2 1.5 3.5.7.7 1.2 1.5 1.5 2.5M9 18h6m-5 4h4" />
                                        <path
                                            d="M12 0V-2M20 8H22M2 8H4M18.5 2.5L19.91 1.09M4.09 19.91L5.5 18.5M18.5 18.5L19.91 19.91M4.09 1.09L5.5 2.5"
                                            stroke-opacity="0" />
                                    </svg>
                                </button>
                            </div>
                            </div>
                        </div>
                    </div>
                    

                </div>
            </div>
    </div>
    <div id="text-container" class="relative arabic-text card-glass p-6 rounded-xl shadow-lg text-right leading-loose"
        dir="rtl"></div>
    ${lesson.reference ? `<div class="mt-6">
        <p
            class="text-sm italic text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-md border-l-4 border-teal-500">
            <strong>Sumber:</strong> ${lesson.reference}</p>
    </div>` : ''}
    <div class="text-center mt-6 text-gray-600 dark:text-gray-400">
        <p><span class="font-semibold">Klik sekali</span> untuk harakat/terjemahan. <span class="font-semibold">Klik dua
                kali</span> untuk i'rab.</p>
    </div>
    <div class="text-center mt-4 space-x-4">
        ${lesson.fullTranslation ? `<button id="show-full-translation-btn"
            class="bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 mb-4 rounded-lg shadow-md">Lihat Terjemahan
            Lengkap</button>` : ''}
        ${(lesson.quizData && lesson.quizData.length > 0) ? `<button id="start-quiz-btn"
            class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg shadow-md">Mulai
            Kuis</button>` : ''}
    </div>
    <div class="text-center mt-8 pt-6 border-t border-gray-300 dark:border-gray-700"><button id="mark-complete-btn"
            class="font-semibold py-2 px-5 rounded-lg shadow-md transition-all ${isCompleted ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500'}">${isCompleted
            ? '✓ Selesai Dipelajari' : 'Tandai sebagai Selesai'}</button></div>
    </main>
    `;

    renderTextWithParagraphs(lesson.textData);
    populateDisplaySettings(); // Panggil fungsi untuk mengisi popover

    renderTextWithParagraphs(lesson.textData);

    // GANTI BLOK LAMA DENGAN YANG INI
    updateButtonAppearance(document.getElementById('harakat-toggle-btn'), state.isHarakatShown);
    updateButtonAppearance(document.getElementById('translation-toggle-btn'), state.isTranslationShown);

    // Status tombol aksi global (lampu) tergantung pada tombol harakat
    const isToggleAllDisabled = !state.isHarakatShown;
    updateButtonAppearance(document.getElementById('toggle-all-harakat-btn'), false, isToggleAllDisabled);

    setupLearningPageEventListeners();
    updateButtonAppearance();
}

/** Mengisi konten popover pengaturan tampilan. */
function populateDisplaySettings() {
    const popover = document.getElementById('display-settings-popover');
    if (!popover) return;

    // Ambil nilai saat ini dari CSS custom properties
    const currentArabicSize = getComputedStyle(document.documentElement).getPropertyValue('--arabic-font-size').replace('rem', '');
    const currentTooltipSize = getComputedStyle(document.documentElement).getPropertyValue('--tooltip-font-size').replace('rem', '');
    const currentLineHeight = getComputedStyle(document.documentElement).getPropertyValue('--arabic-line-height');
    const currentIrabSize = getComputedStyle(document.documentElement).getPropertyValue('--irab-font-size').replace('rem', '');

    popover.innerHTML = `
        <div class="space-y-4">
            <div>
                <label for="arabic-font-slider" class="block text-sm font-medium">Ukuran Teks Arab</label>
                <input id="arabic-font-slider" type="range" min="1.25" max="3" value="${currentArabicSize}" step="0.125" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-600">
            </div>
            <div>
                <label for="tooltip-font-slider" class="block text-sm font-medium">Ukuran Teks Terjemahan</label>
                <input id="tooltip-font-slider" type="range" min="0.6" max="1.25" value="${currentTooltipSize}" step="0.0625" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-600">
            </div>
            <div>
                <label for="line-height-slider" class="block text-sm font-medium">Jarak Antar Baris</label>
                <input id="line-height-slider" type="range" min="1.5" max="4.5" value="${currentLineHeight}" step="0.05" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-600">
            </div>
            <div>
                <label for="irab-font-slider" class="block text-sm font-medium">Ukuran Teks I'rab</label>
                <input id="irab-font-slider" type="range" min="0.75" max="3" value="${currentIrabSize}" step="0.0625" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-600">
            </div>
            <div class="border-t border-gray-300 dark:border-gray-600 pt-4">
                <div class="flex items-center">
                    <label for="focus-mode-toggle" class="text-sm font-medium">Mode Fokus</label>
                    <label class="relative inline-flex items-center cursor-pointer ml-auto">
                        <input type="checkbox" id="focus-mode-toggle" class="sr-only peer" ${state.isFocusMode ? 'checked' : ''}>
                        <div class="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-teal-600"></div>
                    </label>
                </div>
            </div>
            <div class="mt-4 pt-4 border-t border-gray-300 dark:border-gray-600">
                <button id="reset-display-settings-btn" class="w-full text-sm bg-gray-500 hover:bg-gray-600 text-white py-1 px-3 rounded">Reset ke Default</button>
            </div>
        </div>
    `;
}


/**
 * Merender teks pelajaran paragraf per paragraf ke dalam kontainer.
 * @param {Array<Array<object>>} textData - Data teks yang akan dirender.
 */
export function renderTextWithParagraphs(textData) {
    const textContainer = document.getElementById('text-container');
    if (!textContainer) return;
    textContainer.innerHTML = '';

    textData.forEach((paragraph, pIndex) => {
        const p = document.createElement('p');
        p.className = 'paragraph-container';
        p.dataset.pIndex = pIndex;

        paragraph.forEach((wordData, wIndex) => {
            // Cek apakah kata tersebut adalah tanda baca
            const isPunctuation = /[.،؟:!()"«»]/.test(wordData.berharakat) && wordData.berharakat.length === 1;

            const wordWrapper = document.createElement('span');
            wordWrapper.className = 'relative inline-block';

            const wordSpan = document.createElement('span');
            wordSpan.id = `word-${pIndex}-${wIndex}`;
            wordSpan.textContent = wordData.gundul; // Teks awal selalu gundul
            wordSpan.className = isPunctuation
                ? 'arabic-text' // Tanda baca tidak interaktif
                : 'arabic-text cursor-pointer hover:bg-teal-500/10 dark:hover:bg-teal-400/10 p-1 rounded transition-all';

            // Simpan semua data pada elemen span menggunakan dataset
            wordSpan.dataset.gundul = wordData.gundul;
            wordSpan.dataset.berharakat = wordData.berharakat;
            wordSpan.dataset.irab = wordData.irab || '';
            wordSpan.dataset.terjemahan = wordData.terjemahan || '';

            wordWrapper.appendChild(wordSpan);
            p.appendChild(wordWrapper);

            // Tambahkan spasi antar kata, kecuali untuk tanda baca
            if (!isPunctuation && wIndex < paragraph.length - 1) {
                p.appendChild(document.createTextNode(' '));
            }
        });
        textContainer.appendChild(p);
    });
    updateFocusMode(); // Terapkan mode fokus setelah render
}

/** Merender halaman kuis. */
function renderQuizPage() {
    const q = state.quiz;
    let content;

    if (q.isFinished) {
        // Tampilan setelah kuis selesai
        content = `
            <div class="text-center">
                <h2 class="text-3xl font-bold mb-4">Kuis Selesai!</h2>
                <p class="text-xl mb-6">Skor Anda: <span class="font-bold text-teal-500">${q.score}</span> dari ${q.shuffledQuestions.length}</p>
                <button id="back-to-text-btn" class="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg">Kembali ke Teks</button>
            </div>`;
    } else {
        // Tampilan pertanyaan kuis
        const currentQuestion = q.shuffledQuestions[q.currentIndex];
        content = `
            <div class="card-glass p-6 rounded-xl shadow-lg">
                <p class="text-center font-semibold mb-4 text-lg">Pertanyaan ${q.currentIndex + 1} dari ${q.shuffledQuestions.length}</p>
                <h2 class="text-2xl font-bold mb-4 text-center">${currentQuestion.question}</h2>
                ${currentQuestion.context ? `<p class="arabic-text text-3xl text-center mb-6" dir="rtl">${currentQuestion.context}</p>` : ''}
                <div id="quiz-options" class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    ${currentQuestion.options.map(option => `<button class="quiz-option w-full p-3 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all text-left">${option}</button>`).join('')}
                </div>
                <div id="quiz-feedback" class="mt-6 text-center font-bold h-6"></div>
            </div>`;
    }

    DOM.learningPage.innerHTML = `
        <header class="flex justify-between items-center mb-8">
            <h1 class="text-2xl md:text-3xl font-bold bg-clip-text text-transparent" style="background-image: var(--accent-gradient)">Kuis: ${state.currentLesson.title}</h1>
            
            <button id="exit-quiz-btn" class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-all text-sm">&times; Keluar</button>
        </header>
${content}`;

    setupQuizEventListeners();
}

/** Memperbarui status (aktif/nonaktif) tombol "Toggle Harakat". */
// export function updateHarakatButtonState() {
//     const harakatBtn = document.getElementById('toggle-all-harakat-btn');
//     if (!harakatBtn) return;

//     harakatBtn.disabled = !state.isHarakatShown;
//     if (state.isHarakatShown) {
//         harakatBtn.classList.remove('bg-gray-400', 'dark:bg-gray-600', 'cursor-not-allowed');
//         harakatBtn.style.backgroundImage = 'var(--accent-gradient)';
//     } else {
//         harakatBtn.classList.add('bg-gray-400', 'dark:bg-gray-600', 'cursor-not-allowed');
//         harakatBtn.style.backgroundImage = 'none';
//     }
// }

/** Menerapkan atau menghapus mode fokus pada paragraf. */
export function updateFocusMode() {
    if (!state.isFocusMode) {
        document.querySelectorAll('.paragraph-container').forEach(p => p.classList.remove('paragraph-unfocused'));
        return;
    }
    document.querySelectorAll('.paragraph-container').forEach((p, index) => {
        p.classList.toggle('paragraph-unfocused', index !== state.currentFocusParagraph);
    });
}

/** Mengatur posisi popover pengaturan agar tetap terlihat di layar mobile. */
export function managePopoverPosition() {
    const popover = document.getElementById('display-settings-popover');
    if (!popover) return;

    // Anggap lebar di bawah 768px sebagai mobile
    if (window.innerWidth < 768) {
        popover.classList.add('popover-mobile-center');
    } else {
        popover.classList.remove('popover-mobile-center');
    }
}
