/**
 * @file LearningPage.js
 * @description Komponen untuk merender dan mengelola halaman belajar interaktif dan kuis.
 */

import { DOM } from '../dom.js';
import { state } from '../state.js';
import { showSlider } from './Slider.js';
import { saveCompletedLessons } from '../utils.js';
import { switchView } from '../ui.js';
import { showConfirmationModal } from './Modal.js';

// --- Bagian Render Utama ---

/** Merender halaman belajar atau halaman kuis berdasarkan state. */
export function renderLearningPage() {
    if (state.quiz.isActive) {
        renderQuizPage();
    } else {
        renderLessonTextPage();
    }
}

/** Merender halaman teks pelajaran yang interaktif. */
function renderLessonTextPage() {
    const lesson = state.currentLesson;
    const isCompleted = state.completedLessons.includes(lesson.id);

    DOM.learningPage.innerHTML = `
        <header class="flex justify-between items-center mb-8">
            <button id="back-to-home-btn" title="Kembali ke Beranda" class="p-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg shadow-md">
                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-house-fill" viewBox="0 0 16 16">
  <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L8 2.207l6.646 6.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293z"/>
  <path d="m8 3.293 6 6V13.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5V9.293z"/>
</svg>
            </button>
            <h1 class="text-2xl md:text-3xl font-bold bg-clip-text text-transparent arabic-font text-right truncate" style="background-image: var(--accent-gradient)">${lesson.titleArabic || lesson.title}</h1>
            <div class="relative">
                <button id="display-settings-btn" title="Pengaturan Tampilan Teks" class="p-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg shadow-md">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-sliders2" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M10.5 1a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V4H1.5a.5.5 0 0 1 0-1H10V1.5a.5.5 0 0 1 .5-.5M12 3.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5m-6.5 2A.5.5 0 0 1 6 6v1.5h8.5a.5.5 0 0 1 0 1H6V10a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5M1 8a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2A.5.5 0 0 1 1 8m9.5 2a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V13H1.5a.5.5 0 0 1 0-1H10v-1.5a.5.5 0 0 1 .5-.5m1.5 2.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5"/>
</svg>
                </button>
                <div id="display-settings-popover" class="hidden fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11/12 max-w-sm p-4 card-glass rounded-lg shadow-xl z-20 md:absolute md:top-full md:right-0 md:left-auto md:w-64 md:transform-none md:mt-2"></div>
            </div>
        </header>
        <main>
            <div class="flex justify-center items-center flex-wrap gap-4 md:gap-6 mb-6">
                <div class="flex items-center justify-center p-2 bg-white/50 dark:bg-gray-800/50 rounded-xl shadow-inner">
                    <div class="flex items-center gap-4">
                        <div class="flex items-center gap-3">
                            <button id="harakat-toggle-btn" type="button" title="Mode Harakat (Klik per kata)" class="toggle-btn p-3 rounded-lg shadow-md transition-all duration-200 ease-in-out">
                                <svg id="icon-harakat-on" width="24" height="24" viewBox="0 0 24 24" class="pointer-events-none"><text x="50%" y="17" text-anchor="middle" class="arabic-icon" font-size="1.5rem" fill="currentColor">حَ</text></svg>
                                <svg id="icon-harakat-off" width="24" height="24" viewBox="0 0 24 24" class="pointer-events-none hidden"><text x="50%" y="17" text-anchor="middle" class="arabic-icon" font-size="1.5rem" fill="currentColor">ح</text></svg>
                            </button>
                            <button id="translation-toggle-btn" type="button" title="Mode Terjemahan (Klik per kata)" class="toggle-btn p-3 rounded-lg shadow-md transition-all duration-200 ease-in-out">
                                <svg id="icon-translation-on" width="24" height="24" viewBox="0 0 24 24" class="pointer-events-none"><text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" font-weight="bold" font-size="16" fill="currentColor">T</text></svg>
                                <svg id="icon-translation-off" width="24" height="24" viewBox="0 0 24 24" class="pointer-events-none hidden"><text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" font-weight="bold" font-size="16" fill="currentColor">T</text><line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" /></svg>
                            </button>
                            <div class="flex">
                                <button id="toggle-all-harakat-btn" type="button" title="Tampilkan/Sembunyikan Semua Harakat" class="toggle-btn p-3 rounded-lg shadow-md transition-all duration-200 ease-in-out">
                                    <svg id="icon-all-harakat-on" width="24" height="24" viewBox="-2 -4 28 28" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" class="pointer-events-none"><path d="M15 14c.2-1 .7-1.7 1.5-2.5C17.7 10.2 18 9 18 8a6 6 0 0 0-12 0c0 1 .3 2.2 1.5 3.5.7.7 1.2 1.5 1.5 2.5M9 18h6m-5 4h4" /><path d="M 12 -1 V -3 M 21 8 H 23 M 1 8 H 3 M 19 2 L 21 0 M 3 16 L 5 14 M 19 14 L 21 16 M 3 0 L 5 2" /></svg>
                                    <svg id="icon-all-harakat-off" width="24" height="24" viewBox="-2 -4 28 28" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" class="pointer-events-none hidden"><path d="M15 14c.2-1 .7-1.7 1.5-2.5C17.7 10.2 18 9 18 8a6 6 0 0 0-12 0c0 1 .3 2.2 1.5 3.5.7.7 1.2 1.5 1.5 2.5M9 18h6m-5 4h4" /><path d="M12 0V-2M20 8H22M2 8H4M18.5 2.5L19.91 1.09M4.09 19.91L5.5 18.5M18.5 18.5L19.91 19.91M4.09 1.09L5.5 2.5" stroke-opacity="0" /></svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div id="text-container" class="relative arabic-text card-glass p-6 rounded-xl shadow-lg text-right leading-loose" dir="rtl"></div>
            ${lesson.reference ? `<div class="mt-6"><p class="text-sm italic text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-md border-l-4 border-teal-500"><strong>Sumber:</strong> ${lesson.reference}</p></div>` : ''}
            <div class="text-center mt-6 text-gray-600 dark:text-gray-400"><p><span class="font-semibold">Klik sekali</span> untuk harakat/terjemahan. <span class="font-semibold">Klik dua kali</span> untuk i'rab.</p></div>
            <div class="text-center mt-4 space-x-4">
                ${lesson.fullTranslation ? `<button id="show-full-translation-btn" class="bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 mb-4 rounded-lg shadow-md">Lihat Terjemahan Lengkap</button>` : ''}
                ${(lesson.quizData && lesson.quizData.length > 0) ? `<button id="start-quiz-btn" class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg shadow-md">Mulai Kuis</button>` : ''}
            </div>
            <div class="text-center mt-8 pt-6 border-t border-gray-300 dark:border-gray-700"><button id="mark-complete-btn" class="font-semibold py-2 px-5 rounded-lg shadow-md transition-all ${isCompleted ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500'}">${isCompleted ? '✓ Selesai Dipelajari' : 'Tandai sebagai Selesai'}</button></div>
        </main>
    `;

    renderTextWithParagraphs(lesson.textData);
    populateDisplaySettings();
    setupLearningPageEventListeners();
    updateButtonStates();
}

/** Merender halaman kuis, baik mode aktif, review, atau selesai. */
function renderQuizPage() {
    const q = state.quiz;
    let headerContent = `<h1 class="text-2xl md:text-3xl font-bold bg-clip-text text-transparent" style="background-image: var(--accent-gradient)">Kuis: ${state.currentLesson.title}</h1>`;
    let mainContent;

    if (q.isReviewing) {
        const reviewItem = q.userAnswers[q.currentIndex];
        headerContent += `<button id="back-to-score-btn" class="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg">Kembali ke Skor</button>`;
        mainContent = `
            <div class="card-glass p-6 rounded-xl shadow-lg">
                <p class="text-center font-semibold mb-4 text-lg">Meninjau Pertanyaan ${q.currentIndex + 1} dari ${q.shuffledQuestions.length}</p>
                <h2 class="text-2xl font-bold mb-4 text-center">${reviewItem.question}</h2>
                ${reviewItem.context ? `<p class="arabic-text text-3xl text-center mb-6" dir="rtl">${reviewItem.context}</p>` : ''}
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    ${reviewItem.options.map(option => {
                        let buttonClass = 'p-3 rounded-lg text-left';
                        if (option === reviewItem.correctAnswer) {
                            buttonClass += ' bg-green-500 text-white'; // Jawaban benar
                        } else if (option === reviewItem.selectedAnswer) {
                            buttonClass += ' bg-red-500 text-white'; // Jawaban pengguna yang salah
                        } else {
                            buttonClass += ' bg-gray-200 dark:bg-gray-700 opacity-70'; // Opsi lain
                        }
                        return `<button class="${buttonClass}" disabled>${option}</button>`;
                    }).join('')}
                </div>
                ${reviewItem.explanation ? `
                <div class="mt-6 p-4 bg-yellow-100 dark:bg-yellow-800/30 border-l-4 border-yellow-500 rounded-r-lg">
                    <h4 class="font-bold text-lg mb-2 text-yellow-800 dark:text-yellow-300">Penjelasan</h4>
                    <p class="text-yellow-900 dark:text-yellow-200">${reviewItem.explanation}</p>
                </div>` : ''}
                <div class="flex justify-between mt-6">
                    <button id="review-prev-btn" class="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg" ${q.currentIndex === 0 ? 'disabled' : ''}>Sebelumnya</button>
                    <button id="review-next-btn" class="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg" ${q.currentIndex === q.userAnswers.length - 1 ? 'disabled' : ''}>Berikutnya</button>
                </div>
            </div>`;
    } else if (q.isFinished) {
        headerContent += `<button id="back-to-text-btn" class="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg">Kembali ke Teks</button>`;
        mainContent = `
            <div class="text-center">
                <h2 class="text-3xl font-bold mb-4">Kuis Selesai!</h2>
                <p class="text-xl mb-6">Skor Anda: <span class="font-bold text-teal-500">${q.score}</span> dari ${q.shuffledQuestions.length}</p>
                <button id="review-quiz-btn" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">Tinjau Kuis</button>
            </div>`;
    } else {
        headerContent += `<button id="exit-quiz-btn" class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-all text-sm">&times; Keluar</button>`;
        const currentQuestion = q.shuffledQuestions[q.currentIndex];
        mainContent = `
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
        <header class="flex justify-between items-center mb-8">${headerContent}</header>
        <main>${mainContent}</main>`;

    setupQuizEventListeners();
}


// --- Bagian Pengaturan Tampilan ---

function populateDisplaySettings() {
    const popover = document.getElementById('display-settings-popover');
    if (!popover) return;

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

function renderTextWithParagraphs(textData) {
    const textContainer = document.getElementById('text-container');
    if (!textContainer) return;
    textContainer.innerHTML = '';

    textData.forEach((paragraph, pIndex) => {
        const p = document.createElement('p');
        p.className = 'paragraph-container';
        p.dataset.pIndex = pIndex;

        paragraph.forEach((wordData, wIndex) => {
            const isPunctuation = /[.،؟:!()"«»]/.test(wordData.berharakat) && wordData.berharakat.length === 1;
            const wordWrapper = document.createElement('span');
            wordWrapper.className = 'relative inline-block';
            const wordSpan = document.createElement('span');
            wordSpan.id = `word-${pIndex}-${wIndex}`;
            wordSpan.textContent = wordData.gundul;
            wordSpan.className = isPunctuation ? 'arabic-text' : 'arabic-text cursor-pointer hover:bg-teal-500/10 dark:hover:bg-teal-400/10 p-1 rounded transition-all';
            wordSpan.dataset.gundul = wordData.gundul;
            wordSpan.dataset.berharakat = wordData.berharakat;
            wordSpan.dataset.irab = wordData.irab || '';
            wordSpan.dataset.terjemahan = wordData.terjemahan || '';
            wordWrapper.appendChild(wordSpan);
            p.appendChild(wordWrapper);
            if (!isPunctuation && wIndex < paragraph.length - 1) {
                p.appendChild(document.createTextNode(' '));
            }
        });
        textContainer.appendChild(p);
    });
    updateFocusMode();
}

function updateFocusMode() {
    if (!state.isFocusMode) {
        document.querySelectorAll('.paragraph-container').forEach(p => p.classList.remove('paragraph-unfocused'));
        return;
    }
    document.querySelectorAll('.paragraph-container').forEach((p, index) => {
        p.classList.toggle('paragraph-unfocused', index !== state.currentFocusParagraph);
    });
}

export function managePopoverPosition() {
    const popover = document.getElementById('display-settings-popover');
    if (!popover) return;
    if (window.innerWidth < 768) {
        popover.classList.add('popover-mobile-center');
    } else {
        popover.classList.remove('popover-mobile-center');
    }
}

function updateButtonAppearance(button, isActive, isDisabled = false) {
    if (!button) return;
    const onIcon = button.querySelector('[id$="-on"]');
    const offIcon = button.querySelector('[id$="-off"]');
    if (isActive) {
        button.classList.add('bg-teal-500', 'text-white');
        button.classList.remove('bg-gray-200', 'text-gray-800', 'dark:bg-gray-700', 'dark:text-gray-300');
    } else {
        button.classList.add('bg-gray-200', 'text-gray-800', 'dark:bg-gray-700', 'dark:text-gray-300');
        button.classList.remove('bg-teal-500', 'text-white');
    }
    if (isDisabled) {
        button.disabled = true;
        button.classList.add('opacity-50', 'cursor-not-allowed');
    } else {
        button.disabled = false;
        button.classList.remove('opacity-50', 'cursor-not-allowed');
    }
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

function updateButtonStates() {
    updateButtonAppearance(document.getElementById('harakat-toggle-btn'), state.isHarakatShown);
    updateButtonAppearance(document.getElementById('translation-toggle-btn'), state.isTranslationShown);
    const isToggleAllDisabled = !state.isHarakatShown;
    updateButtonAppearance(document.getElementById('toggle-all-harakat-btn'), false, isToggleAllDisabled);
}

// --- Bagian Event Listeners & Handlers ---

function setupLearningPageEventListeners() {
    document.getElementById('back-to-home-btn')?.addEventListener('click', () => switchView('home'));
    document.getElementById('toggle-all-harakat-btn')?.addEventListener('click', handleToggleAllHarakat);
    document.getElementById('harakat-toggle-btn')?.addEventListener('click', handleHarakatToggle);
    document.getElementById('translation-toggle-btn')?.addEventListener('click', handleTranslationToggle);
    document.getElementById('text-container')?.addEventListener('click', handleWordClick);
    document.getElementById('text-container')?.addEventListener('dblclick', handleWordDoubleClick);
    document.getElementById('mark-complete-btn')?.addEventListener('click', handleMarkComplete);
    document.getElementById('display-settings-btn')?.addEventListener('click', (e) => {
        e.stopPropagation();
        managePopoverPosition();
        document.getElementById('display-settings-popover').classList.toggle('hidden');
    });
    document.getElementById('arabic-font-slider')?.addEventListener('input', (e) => DOM.html.style.setProperty('--arabic-font-size', `${e.target.value}rem`));
    document.getElementById('tooltip-font-slider')?.addEventListener('input', (e) => DOM.html.style.setProperty('--tooltip-font-size', `${e.target.value}rem`));
    document.getElementById('line-height-slider')?.addEventListener('input', (e) => DOM.html.style.setProperty('--arabic-line-height', e.target.value));
    document.getElementById('irab-font-slider')?.addEventListener('input', (e) => DOM.html.style.setProperty('--irab-font-size', `${e.target.value}rem`));
    document.getElementById('focus-mode-toggle')?.addEventListener('change', handleFocusModeToggle);
    document.getElementById('show-full-translation-btn')?.addEventListener('click', () => showSlider('Terjemahan Lengkap', `<p>${state.currentLesson.fullTranslation}</p>`, 'translation'));
    document.getElementById('start-quiz-btn')?.addEventListener('click', handleStartQuiz);
    document.getElementById('reset-display-settings-btn')?.addEventListener('click', handleResetDisplaySettings);
    document.addEventListener('click', (e) => {
        const popover = document.getElementById('display-settings-popover');
        const btn = document.getElementById('display-settings-btn');
        if (popover && !popover.classList.contains('hidden') && !popover.contains(e.target) && !btn.contains(e.target)) {
            popover.classList.add('hidden');
        }
    });
}

function setupQuizEventListeners() {
    // Tombol di halaman skor
    document.getElementById('back-to-text-btn')?.addEventListener('click', () => {
        state.quiz.isActive = false;
        state.quiz.isFinished = false;
        renderLearningPage();
    });
    document.getElementById('review-quiz-btn')?.addEventListener('click', () => {
        state.quiz.isReviewing = true;
        state.quiz.currentIndex = 0;
        renderLearningPage();
    });

    // Tombol di mode kuis aktif
    document.querySelectorAll('.quiz-option').forEach(btn => btn.addEventListener('click', handleAnswerClick));
    document.getElementById('exit-quiz-btn')?.addEventListener('click', () => {
        showConfirmationModal('Apakah Anda yakin ingin keluar dari kuis? Progres kuis ini akan hilang.', () => {
            state.quiz.isActive = false;
            state.quiz.isFinished = false;
            renderLearningPage();
        });
    });

    // Tombol di mode review
    document.getElementById('back-to-score-btn')?.addEventListener('click', () => {
        state.quiz.isReviewing = false;
        renderLearningPage();
    });
    document.getElementById('review-next-btn')?.addEventListener('click', () => {
        if (state.quiz.currentIndex < state.quiz.userAnswers.length - 1) {
            state.quiz.currentIndex++;
            renderLearningPage();
        }
    });
    document.getElementById('review-prev-btn')?.addEventListener('click', () => {
        if (state.quiz.currentIndex > 0) {
            state.quiz.currentIndex--;
            renderLearningPage();
        }
    });
}

function handleToggleAllHarakat(e) {
    if (!state.isHarakatShown) return;
    const shouldShow = !e.currentTarget.classList.contains('bg-teal-500');
    updateButtonAppearance(e.currentTarget, shouldShow);
    document.querySelectorAll('#text-container span[data-gundul]').forEach(span => {
        span.textContent = shouldShow ? span.dataset.berharakat : span.dataset.gundul;
    });
}

function handleHarakatToggle(e) {
    state.isHarakatShown = !state.isHarakatShown;
    updateButtonAppearance(e.currentTarget, state.isHarakatShown);
    const toggleAllBtn = document.getElementById('toggle-all-harakat-btn');
    if (!state.isHarakatShown) {
        updateButtonAppearance(toggleAllBtn, false, true);
        document.querySelectorAll('#text-container span[data-gundul]').forEach(span => {
            span.textContent = span.dataset.gundul;
        });
    } else {
        const isAllHarakatActive = toggleAllBtn.classList.contains('bg-teal-500');
        updateButtonAppearance(toggleAllBtn, isAllHarakatActive, false);
    }
}

function handleTranslationToggle(e) {
    state.isTranslationShown = !state.isTranslationShown;
    updateButtonAppearance(e.currentTarget, state.isTranslationShown);
    if (!state.isTranslationShown) {
        document.querySelectorAll('.translation-tooltip').forEach(tip => tip.remove());
    }
}

function handleWordClick(e) {
    const span = e.target.closest('span[data-gundul]');
    if (!span) return;
    const spanWrapper = span.parentElement;
    const hasTranslationData = span.dataset.terjemahan && span.dataset.terjemahan.trim() !== '';
    const isBerharakat = span.textContent === span.dataset.berharakat;
    const currentTooltip = spanWrapper.querySelector('.translation-tooltip');
    
    const showTooltip = () => {
        if (currentTooltip || !hasTranslationData) return;
        const tooltip = document.createElement('div');
        tooltip.className = 'translation-tooltip bg-gray-800 text-white rounded py-1 px-3 z-10';
        tooltip.textContent = span.dataset.terjemahan;
        const arabicTextWidth = span.offsetWidth;
        const translationWords = span.dataset.terjemahan.split(' ');
        let longestWordWidth = 0;
        const tempMeasurer = document.createElement('div');
        tempMeasurer.className = 'translation-tooltip bg-gray-800 text-white rounded py-1 px-3 z-10';
        tempMeasurer.style.position = 'absolute';
        tempMeasurer.style.visibility = 'hidden';
        tempMeasurer.style.top = '-9999px';
        tempMeasurer.style.whiteSpace = 'nowrap';
        document.body.appendChild(tempMeasurer);
        translationWords.forEach(word => {
            tempMeasurer.textContent = word;
            const wordWidth = tempMeasurer.offsetWidth;
            if (wordWidth > longestWordWidth) {
                longestWordWidth = wordWidth;
            }
        });
        document.body.removeChild(tempMeasurer);
        const requiredWidth = Math.max(arabicTextWidth, longestWordWidth) + 8;
        tooltip.style.width = `${requiredWidth}px`;
        tooltip.style.whiteSpace = 'normal';
        tooltip.style.wordBreak = 'normal';
        tooltip.style.overflowWrap = 'break-word';
        tooltip.style.lineHeight = '1.4';
        const computedStyle = getComputedStyle(span);
        const lineHeight = parseFloat(computedStyle.lineHeight);
        const fontSize = parseFloat(computedStyle.fontSize);
        const spaceAbove = (lineHeight - fontSize) / 2;
        const textBottomPosition = spaceAbove + fontSize;
        tooltip.style.top = `${textBottomPosition + 8}px`;
        tooltip.style.left = '50%';
        spanWrapper.appendChild(tooltip);
    };

    const removeTooltip = () => { if (currentTooltip) currentTooltip.remove(); };

    if (state.isHarakatShown && state.isTranslationShown) {
        span.textContent = isBerharakat ? span.dataset.gundul : span.dataset.berharakat;
        currentTooltip ? removeTooltip() : showTooltip();
    } else if (state.isHarakatShown) {
        span.textContent = isBerharakat ? span.dataset.gundul : span.dataset.berharakat;
        removeTooltip();
    } else if (state.isTranslationShown) {
        span.textContent = span.dataset.gundul;
        currentTooltip ? removeTooltip() : showTooltip();
    } else {
        span.textContent = span.dataset.gundul;
        removeTooltip();
    }

    const paragraph = e.target.closest('.paragraph-container');
    if (paragraph) {
        state.currentFocusParagraph = parseInt(paragraph.dataset.pIndex);
        updateFocusMode();
    }
}

function handleWordDoubleClick(e) {
    const span = e.target.closest('span[data-gundul]');
    if (span && span.dataset.irab) {
        showSlider(span.dataset.berharakat, span.dataset.irab, 'irab');
    }
}

function handleMarkComplete(e) {
    const lessonId = state.currentLesson.id;
    const index = state.completedLessons.indexOf(lessonId);
    if (index > -1) {
        state.completedLessons.splice(index, 1);
    } else {
        state.completedLessons.push(lessonId);
    }
    saveCompletedLessons();
    const isCompleted = state.completedLessons.includes(lessonId);
    e.target.textContent = isCompleted ? '✓ Selesai Dipelajari' : 'Tandai sebagai Selesai';
    e.target.classList.toggle('bg-green-500', isCompleted);
    e.target.classList.toggle('text-white', isCompleted);
    e.target.classList.toggle('bg-gray-200', !isCompleted);
    e.target.classList.toggle('dark:bg-gray-600', !isCompleted);
}

function handleStartQuiz() {
    const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);
    state.quiz.isActive = true;
    state.quiz.isFinished = false;
    state.quiz.isReviewing = false;
    state.quiz.userAnswers = [];
    state.quiz.shuffledQuestions = shuffle(state.currentLesson.quizData);
    state.quiz.currentIndex = 0;
    state.quiz.score = 0;
    renderLearningPage();
    window.scrollTo(0, 0);
}

function handleResetDisplaySettings() {
    const defaults = { '--arabic-font-size': '1.875rem', '--tooltip-font-size': '0.875rem', '--arabic-line-height': '2.5', '--irab-font-size': '1.5rem' };
    const sliderDefaults = { 'arabic-font-slider': '1.875', 'tooltip-font-slider': '0.875', 'line-height-slider': '2.5', 'irab-font-slider': '1.5' };
    for (const [prop, value] of Object.entries(defaults)) {
        DOM.html.style.setProperty(prop, value);
    }
    for (const [id, value] of Object.entries(sliderDefaults)) {
        const slider = document.getElementById(id);
        if (slider) slider.value = value;
    }
}

function handleFocusModeToggle(e) {
    state.isFocusMode = e.target.checked;
    updateFocusMode();
}

function handleAnswerClick(e) {
    const selectedButton = e.target;
    const optionsContainer = selectedButton.parentElement;
    if (optionsContainer.dataset.answered) return;
    optionsContainer.dataset.answered = 'true';

    const selectedAnswer = selectedButton.textContent;
    const currentQuestion = state.quiz.shuffledQuestions[state.quiz.currentIndex];
    const correctAnswer = currentQuestion.options[currentQuestion.correctAnswer];
    const feedbackEl = document.getElementById('quiz-feedback');

    // Simpan jawaban pengguna
    state.quiz.userAnswers.push({
        ...currentQuestion,
        selectedAnswer: selectedAnswer,
        correctAnswer: correctAnswer
    });

    if (selectedAnswer === correctAnswer) {
        selectedButton.className = 'quiz-option w-full p-3 bg-green-500 text-white rounded-lg text-left';
        feedbackEl.textContent = 'Jawaban Benar!';
        feedbackEl.className = 'mt-6 text-center font-bold h-6 text-green-500';
        state.quiz.score++;
    } else {
        selectedButton.className = 'quiz-option w-full p-3 bg-red-500 text-white rounded-lg text-left';
        feedbackEl.textContent = 'Jawaban Kurang Tepat.';
        feedbackEl.className = 'mt-6 text-center font-bold h-6 text-red-500';
        Array.from(optionsContainer.children).forEach(button => {
            if (button.textContent === correctAnswer) {
                button.className = 'quiz-option w-full p-3 bg-green-500 text-white rounded-lg text-left';
            }
        });
    }

    setTimeout(() => {
        if (state.quiz.currentIndex < state.quiz.shuffledQuestions.length - 1) {
            state.quiz.currentIndex++;
            renderLearningPage();
        } else {
            state.quiz.isFinished = true;
            renderLearningPage();
        }
    }, 2000);
}