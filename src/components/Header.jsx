import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import ThemeToggle from './ui/ThemeToggle';

const navLinks = [
  { path: '/', label: 'Pelajaran' },
  { path: '/tentang-kami', label: 'Tentang Kami' },
  { path: '/dukung-kami', label: 'Dukung Kami' },
];

const Header = () => {
  const [indicatorStyle, setIndicatorStyle] = useState({ opacity: 0 });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navLinkRefs = useRef([]);
  const location = useLocation();

  // Efek untuk menggerakkan indikator di desktop
  useEffect(() => {
    const activeIndex = navLinks.findIndex(link => link.path === location.pathname);
    if (activeIndex !== -1 && navLinkRefs.current[activeIndex]) {
      const activeLinkEl = navLinkRefs.current[activeIndex];
      const { offsetLeft, offsetWidth } = activeLinkEl;
      setIndicatorStyle({ left: offsetLeft, width: offsetWidth, opacity: 1 });
    }
  }, [location.pathname]);

  // Efek untuk menutup menu mobile saat navigasi
  useEffect(() => {
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  }, [location.pathname]);

  const navLinkClasses = ({ isActive }) =>
    `relative z-10 px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${
      isActive ? 'text-white' : 'text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white'
    }`;

  const mobileNavLinkClasses = ({ isActive }) => 
    `block py-4 text-center text-xl transition-colors ${
      isActive ? 'text-teal-300 font-bold' : 'text-white hover:text-teal-300'
    }`;

  return (
    <>
      <header className="bg-white/30 dark:bg-slate-900/30 backdrop-blur-lg sticky top-0 z-40 border-b border-white/20 dark:border-slate-700/50">
        <nav className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-sky-500">
              Sorogan
            </Link>

            {/* Navigasi Desktop */}
            <div className="hidden md:flex items-center relative p-1">
              <div
                className="absolute h-full rounded-full bg-gradient-to-r from-teal-400 to-sky-500 shadow-lg transition-all duration-350 ease-in-out"
                style={indicatorStyle}
              />
              {navLinks.map((link, index) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={navLinkClasses}
                  ref={el => (navLinkRefs.current[index] = el)}
                >
                  {link.label}
                </NavLink>
              ))}
            </div>

            {/* Kontrol Sisi Kanan */}
            <div className="flex items-center">
              <ThemeToggle />
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
          </div>
        </nav>
      </header>

      {/* Overlay Menu Mobile */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-lg animate-fade-in"
          onClick={() => setIsMobileMenuOpen(false)} // Tutup saat klik di luar area menu
        >
          <div 
            className="absolute top-0 right-0 bottom-0 w-64 bg-slate-800/90 shadow-xl p-6"
            onClick={e => e.stopPropagation()} // Cegah penutupan saat klik di dalam menu
          >
            <div className="flex justify-end mb-8">
              <button onClick={() => setIsMobileMenuOpen(false)} aria-label="Tutup menu">
                <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav className="flex flex-col space-y-4">
              {navLinks.map(link => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={mobileNavLinkClasses}
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
