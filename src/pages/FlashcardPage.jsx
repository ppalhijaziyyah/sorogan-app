import React, { useState, useContext, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../contexts/AppContext';
import { updateCardMetrics, RATING } from '../lib/srs';
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

    // Filter cards due today
    const dueCards = useMemo(() => {
        const now = new Date();
        return flashcards.filter(card => new Date(card.nextReviewDate) <= now)
            .sort((a, b) => new Date(a.nextReviewDate) - new Date(b.nextReviewDate));
    }, [flashcards]);

    const currentCard = dueCards.length > 0 ? dueCards[0] : null;

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
        const fileReader = new FileReader();
        fileReader.readAsText(event.target.files[0], "UTF-8");
        fileReader.onload = e => {
            try {
                const parsed = JSON.parse(e.target.result);
                if (Array.isArray(parsed)) {
                    setFlashcards(parsed);
                    alert("Berhasil mengimpor flashcard!");
                } else {
                    alert("Format file tidak sesuai.");
                }
            } catch (error) {
                alert("Gagal membaca file JSON.");
            }
        };
    };

    const confirmClearAll = () => {
        setFlashcards([]);
        setIsClearModalOpen(false);
    };

    const 	renderStudyMode = () => {
        if (!currentCard) {
            return (
                <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 text-center animate-fade-in">
                    <div className="text-6xl mb-4">🎉</div>
                    <h2 className="text-2xl font-bold mb-2">Semua Kartu Tuntas!</h2>
                    <p className="text-gray-500 dark:text-gray-400 max-w-md">
                        Anda telah meninjau semua kata yang dijadwalkan untuk saat ini. Silakan kembali lagi nanti atau cari kata baru di materi.
                    </p>
                    <button onClick={() => navigate('/')} className="mt-8 px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg">
                        Cari Kata Baru
                    </button>
                </div>
            );
        }

        const renderFrontSide = (card) => (
            <div className={`p-8 md:p-12 flex flex-col items-center justify-center min-h-[300px] h-full bg-white dark:bg-slate-800 rounded-2xl shadow-md border-b-4 border-teal-500`}>
                <div className="absolute top-4 right-4 bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 text-xs font-bold px-3 py-1 rounded-full">
                    Sisa: {dueCards.length} kartu
                </div>
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
                    {card.berharakat}
                </div>
                <div className="text-center text-xl md:text-2xl font-bold text-teal-600 dark:text-teal-400 mb-6 border-b border-gray-100 dark:border-slate-700 pb-6">
                    {card.terjemahan}
                </div>
            </div>
        );

        return (
            <div className="max-w-2xl mx-auto w-full animate-fade-in relative">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold font-arabic">Ujian Memori</h2>
                    <label className="flex items-center cursor-pointer">
                        <div className="relative">
                            <input type="checkbox" className="sr-only" checked={showHarakatOnFront} onChange={(e) => setShowHarakatOnFront(e.target.checked)} />
                            <div className={`block w-10 h-6 rounded-full transition-colors ${showHarakatOnFront ? 'bg-teal-500' : 'bg-gray-300 dark:bg-slate-600'}`}></div>
                            <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${showHarakatOnFront ? 'transform translate-x-4' : ''}`}></div>
                        </div>
                        <div className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                            Tampilkan Harakat 
                        </div>
                    </label>
                </div>

                <style>{`
                    @keyframes slideInRightAnim {
                        0% { transform: translateX(50px); opacity: 0; }
                        100% { transform: translateX(0); opacity: 1; }
                    }
                    @keyframes slideOutLeftAnim {
                        0% { transform: translateX(0); opacity: 1; }
                        100% { transform: translateX(-50px); opacity: 0; }
                    }
                `}</style>
                <div className="mb-8 relative min-h-[300px]">
                    {ghostCard && (
                        <div 
                            key={`ghost-${ghostCard.animId}`} 
                            className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none" 
                            style={{ animation: 'slideOutLeftAnim 0.3s forwards cubic-bezier(0.4, 0, 0.2, 1)' }}
                        >
                            {/* The ghost card represents the previous state which is always the BACK side since user just voted */}
                            {renderBackSide(ghostCard.card)}
                        </div>
                    )}
                    
                    <div 
                        key={`main-${currentCard.id}`} 
                        className="w-full relative z-10" 
                        style={{ 
                            animation: 'slideInRightAnim 0.3s forwards cubic-bezier(0.4, 0, 0.2, 1)',
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
                        <button onClick={() => handleRating(RATING.AGAIN)} className="py-3 px-2 flex flex-col items-center justify-center bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-700 dark:text-red-400 rounded-xl font-bold transition-colors border border-red-200 dark:border-red-800/50">
                            <span className="text-xl mb-1">😩</span>
                            <span className="text-xs uppercase tracking-wider">Lagi (1m)</span>
                        </button>
                        <button onClick={() => handleRating(RATING.HARD)} className="py-3 px-2 flex flex-col items-center justify-center bg-orange-100 dark:bg-orange-900/30 hover:bg-orange-200 dark:hover:bg-orange-900/50 text-orange-700 dark:text-orange-400 rounded-xl font-bold transition-colors border border-orange-200 dark:border-orange-800/50">
                            <span className="text-xl mb-1">🤔</span>
                            <span className="text-xs uppercase tracking-wider">Sulit (1h)</span>
                        </button>
                        <button onClick={() => handleRating(RATING.GOOD)} className="py-3 px-2 flex flex-col items-center justify-center bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-900/50 text-green-700 dark:text-green-400 rounded-xl font-bold transition-colors border border-green-200 dark:border-green-800/50">
                            <span className="text-xl mb-1">😊</span>
                            <span className="text-xs uppercase tracking-wider">Baik (~1h)</span>
                        </button>
                        <button onClick={() => handleRating(RATING.EASY)} className="py-3 px-2 flex flex-col items-center justify-center bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-400 rounded-xl font-bold transition-colors border border-blue-200 dark:border-blue-800/50">
                            <span className="text-xl mb-1">😎</span>
                            <span className="text-xs uppercase tracking-wider">Mudah (~4h)</span>
                        </button>
                    </div>
                )}
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

                {flashcards.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-xl">
                        <div className="text-4xl mb-3 opacity-50">📭</div>
                        <p className="text-gray-500 font-medium">Belum ada flashcard yang disimpan.</p>
                        <p className="text-sm text-gray-400 mt-2">Buka pelajaran mana pun lalu klik kata yang ingin Anda hafal ke depan!</p>
                        <Link to="/" className="inline-block mt-4 px-4 py-2 bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 rounded-lg text-sm font-bold">Mulai Membaca</Link>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b-2 border-gray-200 dark:border-slate-700">
                                    <th className="p-3 font-semibold text-gray-600 dark:text-gray-300 text-sm">Kata</th>
                                    <th className="p-3 font-semibold text-gray-600 dark:text-gray-300 text-sm">Terjemahan</th>
                                    <th className="p-3 font-semibold text-gray-600 dark:text-gray-300 text-sm hidden md:table-cell">Dari Pelajaran</th>
                                    <th className="p-3 font-semibold text-gray-600 dark:text-gray-300 text-sm text-center">Jadwal Tinjau</th>
                                    <th className="p-3 text-center"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {flashcards.map(card => {
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
                                                <button onClick={() => removeFlashcard(card.id)} className="text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 p-2 rounded-full transition-colors" title="Hapus">
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
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
                            className={`px-6 py-2.5 text-sm font-bold rounded-lg transition-all ${activeTab === 'study' ? 'bg-white dark:bg-slate-700 shadow text-teal-600 dark:text-teal-400' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                        >
                            <span className="flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                                Latihan Muroja'ah
                                {dueCards.length > 0 && (
                                    <span className="ml-1 bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full pointer-events-none absolute -top-2 -right-2 ring-2 ring-white">
                                        {dueCards.length > 99 ? '99+' : dueCards.length}
                                    </span>
                                )}
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
