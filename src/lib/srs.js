// Spaced Repetition System (SRS) logic, heavily inspired by SuperMemo-2 (SM-2)

/**
 * Ratings:
 * 1: Again / Ulangi (Lupa sama sekali)
 * 2: Hard / Sulit (Ingat tapi butuh waktu lama)
 * 3: Good / Baik (Ingat dengan usaha sedang)
 * 4: Easy / Mudah (Ingat dengan cepat)
 */

export const RATING = {
    AGAIN: 1,
    HARD: 2,
    GOOD: 3,
    EASY: 4
};

/**
 * Inisialisasi properti dasar kartu baru
 */
export const getInitialCardMetrics = () => {
    return {
        repetitions: 0,
        interval: 0,
        easeFactor: 2.5,
        nextReviewDate: new Date().toISOString()
    };
};

/**
 * Kalkulasi waktu tinjauan kartu berikutnya berdasarkan rating yang diberikan
 * @param {Object} metrics - Data matriks kartu saat ini { repetitions, interval, easeFactor }
 * @param {number} rating - Nilai dari enum RATING
 * @returns {Object} - Nilai matriks kartu yang baru
 */
export const updateCardMetrics = (metrics, rating) => {
    let { repetitions = 0, interval = 0, easeFactor = 2.5 } = metrics;

    if (rating === RATING.AGAIN) {
        repetitions = 0;
        interval = 0; // Berarti ditinjau ulang di hari yang sama (sekarang)
    } else {
        if (repetitions === 0) {
            interval = 1;
        } else if (repetitions === 1) {
            interval = 6;
        } else {
            interval = Math.round(interval * easeFactor);
        }
        repetitions += 1;
    }

    // Koreksi Ease Factor berdasarkan formula Anki (SM-2)
    easeFactor = easeFactor + (0.1 - (5 - rating) * (0.08 + (5 - rating) * 0.02));
    if (easeFactor < 1.3) {
        easeFactor = 1.3;
    }

    // Kalkulasi tanggal review selanjutnya
    const nextReviewDate = new Date();
    
    if (rating === RATING.AGAIN) {
        // Jika lupa, tambahkan 5 menit dari sekarang sebagai hukuman
        nextReviewDate.setMinutes(nextReviewDate.getMinutes() + 5);
    } else if (rating === RATING.HARD && interval === 1) {
        // Jika sulit pada percobaan pertama, uji lagi 15 menit atau besok
        nextReviewDate.setDate(nextReviewDate.getDate() + 1);
    } else {
        // Tambahkan interval hari
        nextReviewDate.setDate(nextReviewDate.getDate() + interval);
    }

    // Reset ke tengah malam agar bisa di-review kapanpun di hari itu
    if (interval > 0) {
        nextReviewDate.setHours(0, 0, 0, 0); 
    }

    return {
        repetitions,
        interval,
        easeFactor,
        nextReviewDate: nextReviewDate.toISOString()
    };
};
