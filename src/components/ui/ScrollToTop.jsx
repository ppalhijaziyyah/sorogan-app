import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop({ children }) {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // Jika ada hash, coba scroll ke elemen tersebut
    if (hash) {
      // Timeout diperlukan untuk memastikan DOM sudah di-render sebelum mencari elemen
      const timer = setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        } else {
          // Fallback jika elemen tidak ditemukan, scroll ke atas
          window.scrollTo(0, 0);
        }
      }, 100);
      return () => clearTimeout(timer); // Cleanup timeout
    } else {
      // Jika tidak ada hash, scroll ke atas halaman
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]); // Jalankan efek jika pathname atau hash berubah

  return children || null;
}

export default ScrollToTop;