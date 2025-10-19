import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import ThemeToggle from './ui/ThemeToggle';

// Definisikan link navigasi di luar komponen agar mudah dikelola
const navLinks = [
  { path: '/', label: 'Pelajaran' },
  { path: '/tentang-kami', label: 'Tentang Kami' },
  { path: '/dukung-kami', label: 'Dukung Kami' },
];

const Header = () => {
  // State untuk menyimpan style (posisi & ukuran) dari indikator
  const [indicatorStyle, setIndicatorStyle] = useState({ opacity: 0 });
  // Ref untuk menyimpan referensi ke setiap elemen NavLink
  const navLinkRefs = useRef([]);
  const location = useLocation();

  // Efek ini berjalan setiap kali lokasi (URL) berubah
  useEffect(() => {
    const activeIndex = navLinks.findIndex(link => link.path === location.pathname);
    
    if (activeIndex !== -1 && navLinkRefs.current[activeIndex]) {
      const activeLinkEl = navLinkRefs.current[activeIndex];
      const { offsetLeft, offsetWidth } = activeLinkEl;

      // Perbarui style indikator agar sesuai dengan link yang aktif
      setIndicatorStyle({
        left: offsetLeft,
        width: offsetWidth,
        opacity: 1,
      });
    }
  }, [location.pathname]);

  // Style untuk link, sekarang lebih sederhana
  const navLinkClasses = ({ isActive }) =>
    `relative z-10 px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${
      isActive ? 'text-white' : 'text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white'
    }`;

  return (
    <header className="bg-white/30 dark:bg-slate-900/30 backdrop-blur-lg sticky top-0 z-50 border-b border-white/20 dark:border-slate-700/50">
      <nav className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo / Brand */}
          <Link to="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-sky-500">
            Sorogan
          </Link>

          {/* Kontainer Navigasi */}
          <div className="hidden md:flex items-center relative p-1">
            {/* Indikator Geser (Sliding Indicator) */}
            <div
              className="absolute h-full rounded-full bg-gradient-to-r from-teal-400 to-sky-500 shadow-lg transition-all duration-350 ease-in-out"
              style={indicatorStyle}
            />
            {/* Render Link Navigasi */}
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
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;