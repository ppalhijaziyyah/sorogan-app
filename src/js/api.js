/**
 * @file api.js
 * @description Modul untuk menangani semua interaksi dengan API atau file data (JSON).
 * Termasuk mengambil indeks pelajaran dan data pelajaran individual.
 */

import { state } from './state.js';
import { renderHomePage } from './components/HomePage.js';
import { renderLearningPage } from './components/LearningPage.js';
import { switchView, showError, showLoader, hideLoader } from './ui.js';

/**
 * Mengambil file indeks utama (master-index.json) yang berisi daftar semua pelajaran.
 * Setelah berhasil, fungsi ini akan memicu rendering halaman utama.
 */
export async function fetchMasterIndex() {
    showLoader(); // Tampilkan indikator loading
    try {
        const response = await fetch(`${import.meta.env.BASE_URL}master-index.json`);
        if (!response.ok) {
            // Jika respons tidak berhasil (misal: 404 Not Found), lempar error
            throw new Error(`Gagal memuat indeks: ${response.statusText}`);
        }
        state.masterIndex = await response.json(); // Simpan data indeks ke state
        renderHomePage(); // Render ulang halaman utama dengan data yang baru
    } catch (error) {
        // Tangani error jika fetch gagal
        console.error("Error fetching master index:", error);
        showError(error.message); // Tampilkan pesan error ke pengguna
    } finally {
        hideLoader(); // Sembunyikan indikator loading, baik berhasil maupun gagal
    }
}

/**
 * Mengambil data untuk satu pelajaran spesifik berdasarkan informasi yang diberikan.
 * @param {object} lessonInfo - Objek yang berisi metadata pelajaran, termasuk path ke file JSON-nya.
 */
export async function fetchLessonData(lessonInfo) {
    showLoader(); // Tampilkan indikator loading
    try {
        const response = await fetch(`${import.meta.env.BASE_URL}${lessonInfo.path}`);
        if (!response.ok) {
            throw new Error(`Gagal memuat materi: ${lessonInfo.path}`);
        }
        state.currentLesson = await response.json(); // Simpan data pelajaran ke state

        // Standarisasi format textData menjadi array dari array (untuk paragraf)
        // Ini untuk menjaga konsistensi jika ada data lama yang formatnya flat array.
        if (state.currentLesson.textData.length > 0 && !Array.isArray(state.currentLesson.textData[0])) {
            state.currentLesson.textData = [state.currentLesson.textData];
        }

        state.currentLesson.id = lessonInfo.id; // Tambahkan ID pelajaran ke data pelajaran

        renderLearningPage(); // Render halaman belajar dengan data pelajaran
        switchView('learning'); // Pindah tampilan ke halaman belajar
        window.scrollTo(0, 0); // layar ke posisi top
    } catch (error) {
        console.error("Error fetching lesson data:", error);
        showError(error.message);
    } finally {
        hideLoader(); // Sembunyikan indikator loading
    }
}