
/**
 * @file Modal.js
 * @description Komponen untuk mengelola modal konfirmasi.
 */

import { DOM } from '../dom.js';

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

/** Inisialisasi event listener untuk modal. */
export function initModalEventListeners() {
    DOM.modal.cancelBtn.addEventListener('click', hideConfirmationModal);
}
