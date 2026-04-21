import React, { useState, useContext, useMemo, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../contexts/AppContext';
import { updateCardMetrics, previewNextInterval, RATING } from '../lib/srs';
import masterIndex from '../data/master-index.json';
import { generateSlug } from '../lib/utils';
import ConfirmationModal from '../components/ui/ConfirmationModal';

const FlashcardPage = () => {
    const { flashcards, setFlashcards, removeFlashcard, updateFlashcard, settings } = useContext(AppContext);
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('study'); // 'study' or 'manage'
    const [showHarakatOnFront, setShowHarakatOnFront] = useState(false);
    const [isFlipped, setIsFlipped] = useState(false);
    const [ghostCard, setGhostCard] = useState(null);
    const [isClearModalOpen, setIsClearModalOpen] = useState(false);
    const [importModalState, setImportModalState] = useState({ isOpen: false, data: null, newCount: 0, duplicateCount: 0 });
    const [sessionCompleted, setSessionCompleted] = useState(0);
    const [deleteConfirmId, setDeleteConfirmId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('nextReviewDate');
    const [sortAsc, setSortAsc] = useState(true);
    const [shuffleEnabled, setShuffleEnabled] = useState(false); // #11
    const [lessonFilter, setLessonFilter] = useState(''); // #13
    const [showConfetti, setShowConfetti] = useState(false); // #12
    const cardRef = useRef(null);
    const touchStartX = useRef(0);
    const touchStartY = useRef(0);

    // Filter cards due today
    const dueCards = useMemo(() => {
        const now = new Date();
        let cards = flashcards.filter(card => new Date(card.nextReviewDate) <= now)
            .sort((a, b) => new Date(a.nextReviewDate) - new Date(b.nextReviewDate));
        // #11: Shuffle if enabled
        if (shuffleEnabled) {
            for (let i = cards.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [cards[i], cards[j]] = [cards[j], cards[i]];
            }
        }
        return cards;
    }, [flashcards, shuffleEnabled]);

    const currentCard = dueCards.length > 0 ? dueCards[0] : null;

    // #6: Stats
    const totalDueToday = useMemo(() => {
        const now = new Date();
        return flashcards.filter(card => new Date(card.nextReviewDate) <= now).length + sessionCompleted;
    }, [flashcards, sessionCompleted]);

    // #7: Keyboard shortcuts
    const handleKeyDown = useCallback((e) => {
        if (activeTab !== 'study' || !currentCard || importModalState.isOpen || isClearModalOpen) return;
        if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            if (!isFlipped) handleShowAnswer();
        } else if (isFlipped) {
            if (e.key === '1') handleRating(RATING.AGAIN);
            else if (e.key === '2') handleRating(RATING.HARD);
            else if (e.key === '3') handleRating(RATING.GOOD);
            else if (e.key === '4') handleRating(RATING.EASY);
        }
    }, [activeTab, currentCard, isFlipped, importModalState.isOpen, isClearModalOpen]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    const handleRating = (rating) => {
        if (!currentCard) return;

        setGhostCard({ card: currentCard, flipped: true, animId: Date.now() });
        
        const newMetrics = updateCardMetrics({
            repetitions: currentCard.repetitions,
            interval: currentCard.interval,
            easeFactor: currentCard.easeFactor
        }, rating);

        updateFlashcard(currentCard.id, newMetrics);
        setIsFlipped(false);
        setSessionCompleted(prev => prev + 1);
        
        setTimeout(() => setGhostCard(null), 300);
    };

    const handleShowAnswer = () => {
        setIsFlipped(true);
    };

    const handleJumpToContext = (card) => {
        const lesson = masterIndex.find(l => l.id === card.lessonId);
        if (!lesson) {
            alert("Maaf, materi asal dari kata ini sudah tidak tersedia di aplikasi.");
            return;
        }

        const levelMap = { 'Ibtida’i': '1', 'Mutawassit': '2', 'Mutaqaddim': '3' };
        const levelId = levelMap[lesson.level] || '1';
        const slug = generateSlug(lesson.title);
        navigate(`/belajar/${levelId}/${slug}?focusWord=${card.id}`);
    };

    const handleExport = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(flashcards, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href",     dataStr);
        downloadAnchorNode.setAttribute("download", "sorogan_flashcards.json");
        document.body.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    const handleImport = (event) => {
        const file = event.target.files[0];
        if (!file) return;
        const fileReader = new FileReader();
        fileReader.readAsText(file, "UTF-8");
        fileReader.onload = e => {
            try {
                const parsed = JSON.parse(e.target.result);
                if (!Array.isArray(parsed)) {
                    alert("Format file tidak sesuai.");
                    return;
                }
                if (flashcards.length === 0) {
                    // Tidak ada data lama, langsung impor
                    setFlashcards(parsed);
                    alert(`Berhasil mengimpor ${parsed.length} kartu!`);
                } else {
                    // Ada data lama, hitung duplikat vs baru
                    const existingIds = new Set(flashcards.map(c => c.id));
                    const newCards = parsed.filter(c => !existingIds.has(c.id));
                    const duplicateCount = parsed.length - newCards.length;
                    setImportModalState({
                        isOpen: true,
                        data: parsed,
                        newCount: newCards.length,
                        duplicateCount
                    });
                }
            } catch (error) {
                alert("Gagal membaca file JSON.");
            }
        };
        // Reset input agar file yang sama bisa dipilih ulang
        event.target.value = '';
    };

    const handleImportMerge = () => {
        const existingIds = new Set(flashcards.map(c => c.id));
        const newCards = importModalState.data.filter(c => !existingIds.has(c.id));
        setFlashcards([...flashcards, ...newCards]);
        setImportModalState({ isOpen: false, data: null, newCount: 0, duplicateCount: 0 });
        alert(`Berhasil menggabungkan! ${newCards.length} kartu baru ditambahkan.`);
    };

    const handleImportOverwrite = () => {
        setFlashcards(importModalState.data);
        setImportModalState({ isOpen: false, data: null, newCount: 0, duplicateCount: 0 });
        alert(`Data diganti! Total ${importModalState.data.length} kartu dimuat.`);
    };

    const confirmClearAll = () => {
        setFlashcards([]);
        setIsClearModalOpen(false);
    };

    // #9: Individual card delete confirmation
    const handleDeleteCard = (cardId) => {
        setDeleteConfirmId(cardId);
    };

    const confirmDeleteCard = () => {
        if (deleteConfirmId) {
            removeFlashcard(deleteConfirmId);
            setDeleteConfirmId(null);
        }
    };

    // #10: Touch swipe handlers
    const handleTouchStart = (e) => {
        touchStartX.current = e.touches[0].clientX;
        touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e) => {
        if (!currentCard) return;
        const deltaX = e.changedTouches[0].clientX - touchStartX.current;
        const deltaY = e.changedTouches[0].clientY - touchStartY.current;
        // Hanya trigger swipe jika gerakan horizontal dominan
        if (Math.abs(deltaX) > 60 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
            if (!isFlipped) {
                // Swipe kiri = buka jawaban
                if (deltaX < 0) handleShowAnswer();
            } else {
                // Setelah terbalik: swipe kiri = AGAIN, swipe kanan = GOOD
                if (deltaX < 0) handleRating(RATING.AGAIN);
                else handleRating(RATING.GOOD);
            }
        }
    };

    // #8 + #13: Filtered and sorted cards for manage tab
    const filteredCards = useMemo(() => {
        let cards = [...flashcards];
        // #13: Filter by lesson
        if (lessonFilter) {
            cards = cards.filter(c => c.lessonTitle === lessonFilter);
        }
        if (searchQuery.trim()) {
            const q = searchQuery.trim().toLowerCase();
            cards = cards.filter(c =>
                c.berharakat.includes(q) ||
                c.gundul.includes(q) ||
                c.terjemahan.toLowerCase().includes(q) ||
                (c.lessonTitle && c.lessonTitle.toLowerCase().includes(q))
            );
        }
        cards.sort((a, b) => {
            let valA, valB;
            if (sortBy === 'nextReviewDate') {
                valA = new Date(a.nextReviewDate);
                valB = new Date(b.nextReviewDate);
            } else {
                valA = (a[sortBy] || '').toLowerCase();
                valB = (b[sortBy] || '').toLowerCase();
            }
            if (valA < valB) return sortAsc ? -1 : 1;
            if (valA > valB) return sortAsc ? 1 : -1;
            return 0;
        });
        return cards;
    }, [flashcards, searchQuery, lessonFilter, sortBy, sortAsc]);

    const handleSort = (column) => {
        if (sortBy === column) {
            setSortAsc(prev => !prev);
        } else {
            setSortBy(column);
            setSortAsc(true);
        }
    };

    const sortIcon = (column) => {
        if (sortBy !== column) return '';
        return sortAsc ? ' ↑' : ' ↓';
    };

    const 	renderStudyMode = () => {
        if (!currentCard) {
            // #12: Trigger confetti on first completion
            if (sessionCompleted > 0 && !showConfetti) {
                setShowConfetti(true);
                setTimeout(() => setShowConfetti(false), 4000);
            }
            return (
                <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 text-center animate-fade-in relative overflow-hidden">
                    {/* #12: Confetti particles */}
                    {showConfetti && (
                        <div className="absolute inset-0 pointer-events-none overflow-hidden">
                            {Array.from({ length: 30 }).map((_, i) => (
                                <span
                                    key={i}
                                    className="absolute rounded-sm"
                                    style={{
                                        width: `${Math.random() * 8 + 4}px`,
                                        height: `${Math.random() * 8 + 4}px`,
                                        backgroundColor: ['#14b8a6', '#0ea5e9', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'][i % 6],
                                        left: `${Math.random() * 100}%`,
                                        top: `-10%`,
                                        animation: `confettiFall ${1.5 + Math.random() * 2}s ease-in ${Math.random() * 0.8}s forwards`,
                                        transform: `rotate(${Math.random() * 360}deg)`,
                                    }}
                                />
                            ))}
                            <style>{`
                                @keyframes confettiFall {
                                    0% { transform: translateY(0) rotate(0deg); opacity: 1; }
                                    100% { transform: translateY(500px) rotate(${360 + Math.random() * 360}deg); opacity: 0; }
                                }
                            `}</style>
                        </div>
                    )}
                    <div className="text-6xl mb-4">🎉</div>
                    <h2 className="text-2xl font-bold mb-2">Semua Kartu Tuntas!</h2>
                    <p className="text-gray-500 dark:text-gray-400 max-w-md">
                        {sessionCompleted > 0 ? (
                            <>Anda baru saja menyelesaikan <strong className="text-teal-600 dark:text-teal-400">{sessionCompleted} kartu</strong> dalam sesi ini. Luar biasa!</>
                        ) : (
                            'Belum ada kartu yang dijadwalkan. Silakan cari kata baru di materi.'
                        )}
                    </p>
                    <button onClick={() => navigate('/')} className="mt-8 px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg">
                        Cari Kata Baru
                    </button>
                </div>
            );
        }

        const renderFrontSide = (card) => (
            <div className={`p-8 md:p-12 flex flex-col items-center justify-center min-h-[300px] h-full bg-white dark:bg-slate-800 rounded-2xl shadow-md border-b-4 border-teal-500 relative`}>
                <div className="absolute top-4 right-4 bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 text-xs font-bold px-3 py-1 rounded-full">
                    Sisa: {dueCards.length} kartu
                </div>
                {/* #14: Context hint on front side */}
                <button
                    onClick={(e) => { e.stopPropagation(); handleJumpToContext(card); }}
                    className="absolute top-4 left-4 text-gray-300 dark:text-slate-600 hover:text-sky-500 dark:hover:text-sky-400 transition-colors"
                    title="Lihat konteks kata ini di materi"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </button>
                <div className="text-5xl md:text-6xl font-bold font-arabic text-slate-800 dark:text-slate-100 mt-auto mb-auto" dir="rtl">
                    {showHarakatOnFront ? card.berharakat : card.gundul}
                </div>
            </div>
        );

        const renderBackSide = (card) => (
            <div className="p-8 md:p-12 flex flex-col min-h-[300px] h-full bg-white dark:bg-slate-800 rounded-2xl shadow-md border-b-4 border-sky-500 relative">
                <button 
                    onClick={() => handleJumpToContext(card)}
                    className="absolute top-4 left-4 flex items-center gap-2 text-xs md:text-sm font-semibold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-900/30 hover:bg-sky-100 dark:hover:bg-sky-900/50 px-3 py-1.5 rounded-lg transition-colors border border-sky-200 dark:border-sky-800 pointer-events-auto"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                    Lihat Konteks
                </button>
                <div className="text-center font-arabic text-4xl md:text-5xl text-slate-800 dark:text-slate-100 mb-6 mt-8" dir="rtl">
                    {showHarakatOnFront ? card.berharakat : card.gundul}
                </div>
                <div className="text-center text-xl md:text-2xl font-bold text-teal-600 dark:text-teal-400 mb-6 border-b border-gray-100 dark:border-slate-700 pb-6">
                    {card.terjemahan}
                </div>
            </div>
        );

        return (
            <div className="max-w-2xl mx-auto w-full animate-fade-in relative">
                {/* #5: Progress bar */}
                {totalDueToday > 0 && (
                    <div className="mb-4">
                        <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 mb-1">
                            <span>Progres sesi</span>
                            <span className="font-bold text-teal-600 dark:text-teal-400">{sessionCompleted}/{totalDueToday}</span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-teal-400 to-sky-500 rounded-full transition-all duration-500 ease-out" style={{ width: `${totalDueToday > 0 ? (sessionCompleted / totalDueToday) * 100 : 0}%` }} />
                        </div>
                    </div>
                )}

                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold font-arabic">Ujian Memori</h2>
                    <div className="inline-flex rounded-full shadow-sm border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 backdrop-blur-sm overflow-hidden" role="group">
                        {/* #11: Shuffle toggle */}
                        <button
                            onClick={() => { setShuffleEnabled(prev => !prev); setIsFlipped(false); }}
                            className={`px-4 py-2 text-sm font-medium transition-colors ${shuffleEnabled ? 'bg-teal-500 text-white hover:bg-teal-600' : 'hover:bg-gray-50 dark:hover:bg-slate-700'}`}
                            title={shuffleEnabled ? 'Urutan Acak (Aktif)' : 'Urutan Acak (Nonaktif)'}
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4h7l5 5v11H4V4zM14 4h6v6M20 4L10 14" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 20h4v-6" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 15l-5-5" /></svg>
                        </button>
                        {/* Harakat icon toggle (Arabic letter style like LearningToolbar) */}
                        <button
                            onClick={() => setShowHarakatOnFront(prev => !prev)}
                            className={`px-4 py-2 text-sm font-medium transition-colors border-l border-gray-200 dark:border-slate-700 ${showHarakatOnFront ? 'bg-teal-500 text-white hover:bg-teal-600' : 'hover:bg-gray-50 dark:hover:bg-slate-700'}`}
                            title={showHarakatOnFront ? 'Harakat Tampil (Aktif)' : 'Harakat Tersembunyi'}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" className="pointer-events-none">
                                <text x="50%" y="17" textAnchor="middle" className="font-arabic" fontSize="1.5rem" fill="currentColor">{showHarakatOnFront ? 'حَ' : 'ح'}</text>
                            </svg>
                        </button>
                    </div>
                </div>

                {/* #10: Touch swipe area */}
                <div 
                    className="mb-8 relative min-h-[300px]"
                    ref={cardRef}
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                >
                    {ghostCard && (
                        <div 
                            key={`ghost-${ghostCard.animId}`} 
                            className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none animate-slide-out-left"
                        >
                            {/* The ghost card represents the previous state which is always the BACK side since user just voted */}
                            {renderBackSide(ghostCard.card)}
                        </div>
                    )}
                    
                    <div 
                        key={`main-${currentCard.id}`} 
                        className="w-full relative z-10 animate-slide-in-right"
                        style={{ 
                            perspective: settings.enable3DFlashcard ? '1000px' : 'none'
                        }}
                    >
                        <div 
                            className="transition-all duration-500 ease-in-out w-full"
                            style={{ 
                                transformStyle: settings.enable3DFlashcard ? 'preserve-3d' : 'flat',
                                transform: isFlipped && settings.enable3DFlashcard ? 'rotateY(180deg)' : 'none'
                            }}
                        >
                            {/* Front */}
                            <div 
                                className="w-full"
                                style={{ 
                                    backfaceVisibility: settings.enable3DFlashcard ? 'hidden' : 'visible',
                                    display: (!settings.enable3DFlashcard && isFlipped) ? 'none' : 'block'
                                }}
                            >
                                {renderFrontSide(currentCard)}
                            </div>
                            
                            {/* Back */}
                            <div 
                                className={`w-full ${settings.enable3DFlashcard ? 'absolute top-0 left-0' : ''}`}
                                style={{ 
                                    backfaceVisibility: settings.enable3DFlashcard ? 'hidden' : 'visible',
                                    transform: settings.enable3DFlashcard ? 'rotateY(180deg)' : 'none',
                                    display: settings.enable3DFlashcard ? 'block' : (isFlipped ? 'block' : 'none')
                                }}
                            >
                                {renderBackSide(currentCard)}
                            </div>
                        </div>
                    </div>
                </div>

                {!isFlipped ? (
                    <button 
                        onClick={handleShowAnswer}
                        className="w-full py-4 text-lg font-bold text-white bg-slate-800 hover:bg-slate-900 dark:bg-teal-600 dark:hover:bg-teal-700 rounded-xl shadow-lg transition-all active:scale-[0.98]"
                    >
                        Tampilkan Jawaban
                    </button>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 animate-fade-in">
                        {[
                            { rating: RATING.AGAIN, emoji: '😩', label: 'Lagi', btnClass: 'bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800/50' },
                            { rating: RATING.HARD, emoji: '🤔', label: 'Sulit', btnClass: 'bg-orange-100 dark:bg-orange-900/30 hover:bg-orange-200 dark:hover:bg-orange-900/50 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800/50' },
                            { rating: RATING.GOOD, emoji: '😊', label: 'Baik', btnClass: 'bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-900/50 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800/50' },
                            { rating: RATING.EASY, emoji: '😎', label: 'Mudah', btnClass: 'bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800/50' },
                        ].map(({ rating, emoji, label, btnClass }) => {
                            const intervalLabel = currentCard ? previewNextInterval({
                                repetitions: currentCard.repetitions,
                                interval: currentCard.interval,
                                easeFactor: currentCard.easeFactor
                            }, rating) : '';
                            return (
                                <button key={rating} onClick={() => handleRating(rating)} className={`py-3 px-2 flex flex-col items-center justify-center rounded-xl font-bold transition-colors border ${btnClass}`}>
                                    <span className="text-xl mb-1">{emoji}</span>
                                    <span className="text-xs uppercase tracking-wider">{label} ({intervalLabel})</span>
                                </button>
                            );
                        })}
                    </div>
                )}

                {/* #7: Keyboard shortcut hint */}
                <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-4 hidden md:block">
                    ⌨️ Tekan <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-slate-700 rounded text-[10px] font-mono">Spasi</kbd> untuk membuka jawaban, lalu <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-slate-700 rounded text-[10px] font-mono">1</kbd>-<kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-slate-700 rounded text-[10px] font-mono">4</kbd> untuk menilai
                </p>
                {/* #10: Swipe hint mobile */}
                <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-3 md:hidden">
                    👆 Geser kartu ke kiri/kanan untuk navigasi cepat
                </p>
            </div>
        );
    };

    const renderManageMode = () => {
        return (
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-6 animate-fade-in">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <div>
                        <h2 className="text-xl font-bold">Koleksi Flashcard ({flashcards.length})</h2>
                        <p className="text-sm text-gray-500 mt-1">Kata-kata yang telah Anda tandai saat membaca pelajaran.</p>
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                        <label className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 font-semibold rounded-lg cursor-pointer transition-colors text-sm">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                            Impor
                            <input type="file" accept=".json" onChange={handleImport} className="hidden" />
                        </label>
                        <button onClick={handleExport} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 font-semibold rounded-lg transition-colors text-sm">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                            Ekspor
                        </button>
                        {flashcards.length > 0 && (
                            <button onClick={() => setIsClearModalOpen(true)} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 font-semibold rounded-lg transition-colors text-sm">
                                Hapus Semua
                            </button>
                        )}
                    </div>
                </div>

                {/* #6: Quick Stats */}
                {flashcards.length > 0 && (
                    <div className="grid grid-cols-3 gap-3 mb-6">
                        <div className="bg-teal-50 dark:bg-teal-900/20 rounded-xl p-3 text-center">
                            <div className="text-2xl font-bold text-teal-600 dark:text-teal-400">{flashcards.length}</div>
                            <div className="text-xs text-gray-500">Total Kartu</div>
                        </div>
                        <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-3 text-center">
                            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{dueCards.length}</div>
                            <div className="text-xs text-gray-500">Jatuh Tempo</div>
                        </div>
                        <div className="bg-sky-50 dark:bg-sky-900/20 rounded-xl p-3 text-center">
                            <div className="text-2xl font-bold text-sky-600 dark:text-sky-400">{flashcards.length > 0 ? (flashcards.reduce((sum, c) => sum + (c.easeFactor || 2.5), 0) / flashcards.length).toFixed(1) : '—'}</div>
                            <div className="text-xs text-gray-500">Rata-rata EF</div>
                        </div>
                    </div>
                )}

                {flashcards.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-xl">
                        <div className="text-4xl mb-3 opacity-50">📭</div>
                        <p className="text-gray-500 font-medium">Belum ada flashcard yang disimpan.</p>
                        <p className="text-sm text-gray-400 mt-2">Buka pelajaran mana pun lalu klik kata yang ingin Anda hafal ke depan!</p>
                        <Link to="/" className="inline-block mt-4 px-4 py-2 bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 rounded-lg text-sm font-bold">Mulai Membaca</Link>
                    </div>
                ) : (
                    <>
                        {/* #13: Lesson filter + #8: Search bar */}
                        <div className="flex flex-col md:flex-row gap-3 mb-4">
                            <div className="relative flex-1">
                                <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                <input
                                    type="text"
                                    placeholder="Cari kata, terjemahan..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-colors"
                                />
                                {searchQuery && (
                                    <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                    </button>
                                )}
                            </div>
                            {/* #13: Lesson filter dropdown */}
                            <div className="relative md:w-56">
                                <select
                                    value={lessonFilter}
                                    onChange={(e) => setLessonFilter(e.target.value)}
                                    className="w-full appearance-none bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg text-sm px-3 py-2.5 pr-8 focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-colors"
                                >
                                    <option value="">Semua Pelajaran</option>
                                    {[...new Set(flashcards.map(c => c.lessonTitle).filter(Boolean))].sort().map(title => (
                                        <option key={title} value={title}>{title}</option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none text-gray-400">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b-2 border-gray-200 dark:border-slate-700">
                                        <th className="p-3 font-semibold text-gray-600 dark:text-gray-300 text-sm cursor-pointer hover:text-teal-600 select-none" onClick={() => handleSort('berharakat')}>Kata{sortIcon('berharakat')}</th>
                                        <th className="p-3 font-semibold text-gray-600 dark:text-gray-300 text-sm">Terjemahan</th>
                                        <th className="p-3 font-semibold text-gray-600 dark:text-gray-300 text-sm hidden md:table-cell cursor-pointer hover:text-teal-600 select-none" onClick={() => handleSort('lessonTitle')}>Dari Pelajaran{sortIcon('lessonTitle')}</th>
                                        <th className="p-3 font-semibold text-gray-600 dark:text-gray-300 text-sm text-center cursor-pointer hover:text-teal-600 select-none" onClick={() => handleSort('nextReviewDate')}>Jadwal Tinjau{sortIcon('nextReviewDate')}</th>
                                        <th className="p-3 text-center"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredCards.map(card => {
                                        const reviewDate = new Date(card.nextReviewDate);
                                        const isDue = reviewDate <= new Date();
                                        return (
                                            <tr key={card.id} className="border-b border-gray-100 dark:border-slate-700/50 hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors">
                                                <td className="p-3 font-arabic text-xl" dir="rtl">{card.berharakat}</td>
                                                <td className="p-3 font-medium">{card.terjemahan}</td>
                                                <td className="p-3 text-sm text-gray-500 hidden md:table-cell">{card.lessonTitle}</td>
                                                <td className="p-3 text-sm text-center">
                                                    {isDue ? (
                                                        <span className="px-2 py-1 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 rounded-full text-xs font-bold">Sekarang</span>
                                                    ) : (
                                                        <span className="text-gray-500">{reviewDate.toLocaleDateString()}</span>
                                                    )}
                                                </td>
                                                <td className="p-3 text-center">
                                                    <button onClick={() => handleDeleteCard(card.id)} className="text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 p-2 rounded-full transition-colors" title="Hapus">
                                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    {filteredCards.length === 0 && searchQuery && (
                                        <tr>
                                            <td colSpan="5" className="p-8 text-center text-gray-400 text-sm">
                                                Tidak ditemukan kata yang cocok dengan "{searchQuery}"
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>
        );
    };

    return (
        <div className="container mx-auto max-w-4xl pt-8 pb-16">
            <ConfirmationModal
                isOpen={isClearModalOpen}
                title="Hapus Semua Flashcard?"
                message="Tindakan ini tidak dapat dibatalkan. Anda yakin ingin menghapus semua kata yang telah disimpan?"
                onConfirm={confirmClearAll}
                onCancel={() => setIsClearModalOpen(false)}
            />

            {/* Import Merge/Overwrite Modal */}
            {importModalState.isOpen && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in" onClick={() => setImportModalState({ isOpen: false, data: null, newCount: 0, duplicateCount: 0 })}>
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-sm md:max-w-md w-full p-6 text-center border border-gray-100 dark:border-gray-700" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-center w-12 h-12 mx-auto rounded-full mb-4 bg-blue-100 dark:bg-blue-900/30">
                            <span className="text-2xl">📥</span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Impor Flashcard</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-2 text-sm">
                            File berisi <strong>{importModalState.data?.length}</strong> kartu.
                        </p>
                        <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
                            <span className="text-green-600 dark:text-green-400 font-semibold">{importModalState.newCount} baru</span>
                            {importModalState.duplicateCount > 0 && (
                                <> &middot; <span className="text-amber-600 dark:text-amber-400 font-semibold">{importModalState.duplicateCount} sudah ada</span></>
                            )}
                        </p>
                        <div className="flex flex-col gap-2">
                            <button
                                onClick={handleImportMerge}
                                className="w-full py-2.5 text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors shadow-md"
                            >
                                Gabungkan ({importModalState.newCount} kartu baru)
                            </button>
                            <button
                                onClick={handleImportOverwrite}
                                className="w-full py-2.5 text-sm font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-lg transition-colors border border-red-200 dark:border-red-800/50"
                            >
                                Timpa Semua Data
                            </button>
                            <button
                                onClick={() => setImportModalState({ isOpen: false, data: null, newCount: 0, duplicateCount: 0 })}
                                className="w-full py-2.5 text-sm font-bold text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                            >
                                Batal
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* #9: Individual card delete confirmation */}
            <ConfirmationModal
                isOpen={deleteConfirmId !== null}
                title="Hapus Kata Ini?"
                message="Kata ini akan dihapus dari koleksi flashcard Anda."
                onConfirm={confirmDeleteCard}
                onCancel={() => setDeleteConfirmId(null)}
                confirmText="Hapus"
            />

            <header className="mb-8 border-b-2 border-gray-100 dark:border-slate-700 pb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-sky-500 mb-2">Pusat Menghafal</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Gunakan metode Spaced Repetition untuk tidak pernah lupa kosa kata baru.</p>
                </div>
                
                {/* Custom Toggle Switch for Tabs */}
                {flashcards.length > 0 && (
                    <div className="p-1 bg-gray-100 dark:bg-slate-800 rounded-xl flex shadow-inner border border-gray-200 dark:border-slate-700 shrink-0">
                        <button
                            onClick={() => { setActiveTab('study'); setIsFlipped(false); }}
                            className={`relative px-6 py-2.5 text-sm font-bold rounded-lg transition-all ${activeTab === 'study' ? 'bg-white dark:bg-slate-700 shadow text-teal-600 dark:text-teal-400' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                        >
                            {dueCards.length > 0 && (
                                <span className="bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full pointer-events-none absolute -top-2 -right-2 ring-2 ring-white dark:ring-slate-800">
                                    {dueCards.length > 99 ? '99+' : dueCards.length}
                                </span>
                            )}
                            <span className="flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                                Latihan Muroja'ah
                            </span>
                        </button>
                        <button
                            onClick={() => setActiveTab('manage')}
                            className={`px-6 py-2.5 text-sm font-bold rounded-lg transition-all relative ${activeTab === 'manage' ? 'bg-white dark:bg-slate-700 shadow text-teal-600 dark:text-teal-400' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                        >
                            <span className="flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
                                Koleksi Kata
                            </span>
                        </button>
                    </div>
                )}
            </header>

            <main>
                {flashcards.length === 0 ? renderManageMode() : (
                    activeTab === 'study' ? renderStudyMode() : renderManageMode()
                )}
            </main>
        </div>
    );
};

export default FlashcardPage;
