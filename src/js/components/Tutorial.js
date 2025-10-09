
/**
 * @file Tutorial.js
 * @description Komponen untuk menampilkan panduan tutorial bagi pengguna baru.
 */

import { showSlider } from './Slider.js';
import { markTutorialAsSeen } from '../utils.js';

/**
 * Menampilkan slider tutorial untuk halaman belajar.
 * Tutorial ini hanya akan muncul sekali untuk setiap pengguna.
 */
export function showLearningPageTutorial() {
    const title = 'Selamat Datang di Halaman Belajar!';
    const contentHTML = `
        <div class="space-y-4 text-left text-base">
            <p>Ini adalah area belajar interaktif Anda. Berikut beberapa tips untuk memulai:</p>
            <ul class="list-disc list-inside space-y-3">
                <li>
                    <strong class="text-teal-400">Klik sekali</strong> pada sebuah kata untuk menampilkan/menyembunyikan <strong class="font-semibold">harakat</strong> atau <strong class="font-semibold">terjemahannya</strong>.
                    <br>
                    <small>(Gunakan tombol di atas untuk beralih antara mode harakat dan terjemahan).</small>
                </li>
                <li>
                    <strong class="text-teal-400">Klik dua kali</strong> pada sebuah kata untuk melihat <strong class="font-semibold">I'rab</strong> (analisis gramatikal) lengkapnya.
                </li>
                <li>
                    Gunakan tombol <strong class="font-semibold">Pengaturan Tampilan</strong> (ikon slider) di kanan atas untuk menyesuaikan ukuran teks dan mengaktifkan <strong class="font-semibold">Mode Fokus</strong>.
                </li>
                <li>
                    Setelah selesai, jangan lupa menekan tombol <strong class="font-semibold">"Tandai sebagai Selesai"</strong> di bagian bawah untuk menyimpan progres Anda.
                </li>
            </ul>
            <p class="text-center pt-4">Selamat belajar!</p>
        </div>
    `;

    // Tampilkan slider dengan konten tutorial.
    // Saat slider ditutup, panggil `markTutorialAsSeen` agar tidak muncul lagi.
    showSlider(title, contentHTML, 'default', markTutorialAsSeen);
}
