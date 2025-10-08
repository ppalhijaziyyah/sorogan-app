
/**
 * @file HomePage.js
 * @description Komponen untuk merender dan mengelola halaman utama (daftar pelajaran).
 */

import { DOM } from '../dom.js';
import { state, levelsInOrder, levelDetails } from '../state.js';
import { fetchLessonData } from '../api.js';

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
function updateActiveFilterButton() {
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

/** Menangani klik pada tombol filter level. */
function handleFilterClick(e) {
    const btn = e.target.closest('.filter-btn');
    if (btn) {
        state.activeFilter = btn.dataset.level;
        updateActiveFilterButton();
        renderHomePage();
    }
}

/** Inisialisasi event listener untuk halaman utama. */
export function initHomePageEventListeners() {
    DOM.filterContainer.addEventListener('click', handleFilterClick);
}
