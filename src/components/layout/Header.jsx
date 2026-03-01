import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import ThemeToggle from '../ui/ThemeToggle';

const navLinks = [
  { path: '/#lessons-anchor', label: 'Pelajaran' },
  { path: '/panduan-penggunaan', label: 'Panduan' },
  { path: '/tentang-kami', label: 'Tentang Kami' },
  { path: '/dukung-kami', label: 'Dukung Kami' },
];

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const isOnHomepage = location.pathname === '/';
  const isOnLearningPage = location.pathname.startsWith('/belajar');

  // Efek untuk deteksi scroll di homepage
  useEffect(() => {
    if (!isOnHomepage) {
      setIsScrolled(false);
      return;
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50); // Aktif setelah scroll 50px
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, [isOnHomepage]);

  // Efek untuk menutup menu mobile saat navigasi
  useEffect(() => {
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  }, [location.pathname, location.hash]);

  // Kelas untuk link navigasi (Desktop & Mobile)
  const getNavLinkClasses = (path, isActive, isMobile = false) => {
    const baseClasses = isMobile
      ? 'block py-4 text-center text-xl transition-colors'
      : 'px-4 py-2 text-sm font-medium transition-colors duration-300';

    const activeClasses = isMobile
      ? 'font-bold text-teal-500 dark:text-teal-300'
      : 'font-semibold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-sky-500';

    const inactiveClasses = isMobile
      ? 'text-gray-700 hover:text-teal-600 dark:text-white dark:hover:text-teal-300'
      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white';

    // Di halaman belajar, semua link dianggap tidak aktif
    if (isOnLearningPage) return `${baseClasses} ${inactiveClasses}`;

    // Logika khusus untuk link 'Pelajaran'
    if (path === '/#lessons-anchor') {
      const isPelajaranActive = isOnHomepage && isScrolled;
      return `${baseClasses} ${isPelajaranActive ? activeClasses : inactiveClasses}`;
    }

    return `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;
  };

  // Kelas untuk kontainer header
  const headerContainerClasses = `
    backdrop-blur-lg 
    ${!isOnLearningPage ? 'sticky top-0 z-40' : ''}
  `;

  return (
    <>
      <header className={headerContainerClasses}>
        <nav className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-sky-500">
              Sorogan
            </Link>

            {/* Kontrol Sisi Kanan (Desktop) */}
            <div className="hidden md:flex items-center gap-2">
              {/* Navigasi Desktop */}
              <div className="flex items-center">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    className={({ isActive }) => getNavLinkClasses(link.path, isActive)}
                  >
                    {link.label}
                  </NavLink>
                ))}
              </div>

              <ThemeToggle />
            </div>

            {/* Tombol Menu Mobile */}
            <button
              className="md:hidden ml-2 p-2"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Buka menu"
            >
              <svg className="h-6 w-6 text-gray-700 dark:text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>
        </nav>
      </header>

      {/* Overlay Menu Mobile */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-[100] bg-slate-900/70 backdrop-blur-lg animate-fade-in"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div
            className="absolute top-0 right-0 bottom-0 w-64 bg-white/95 dark:bg-slate-800/95 shadow-xl p-6 flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-end mb-8">
              <button onClick={() => setIsMobileMenuOpen(false)} aria-label="Tutup menu">
                <svg className="h-7 w-7 text-gray-800 dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav className="flex flex-col space-y-4 flex-grow">
              {navLinks.map(link => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) => getNavLinkClasses(link.path, isActive, true)}
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
            <div className="mt-8 flex justify-center">
              <ThemeToggle />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;