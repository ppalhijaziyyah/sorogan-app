import React, { useState, useEffect } from 'react';
import { Joyride, STATUS } from 'react-joyride';

const Tutorial = () => {
  const [run, setRun] = useState(false);
  const [steps, setSteps] = useState([]); // state array untuk steps dinamis

  useEffect(() => {
    // Gunakan getItem string 'true' / 'false' secara native untuk memastikan konsistensi
    const hasSeen = localStorage.getItem('hasSeenTutorial') === 'true';

    if (!hasSeen) {
      const timer = setTimeout(() => {
        // Segera kunci status agar tidak muncul lagi jika user refresh halaman atau berpindah materi 
        // saat tutorial masih berlangsung.
        localStorage.setItem('hasSeenTutorial', 'true');

        const dynamicSteps = [
          {
            target: 'body',
            content: (
              <div className="text-left">
                <h3 className="font-bold text-lg text-teal-600 mb-2">Selamat Datang di Sorogan!</h3>
                <p className="text-sm text-gray-700">Mari ikuti panduan singkat ini untuk mengetahui cara menggunakan fitur-fitur belajar interaktif di aplikasi ini.</p>
              </div>
            ),
            placement: 'center',
            disableBeacon: true,
          },
          {
            target: '#tour-first-word',
            content: (
              <div className="text-left text-sm text-gray-700">
                <p className="mb-2"><strong className="text-teal-600">Klik 1x</strong> pada kata bahasa Arab untuk menampilkan atau menyembunyikan harakat/terjemahan.</p>
                <p><strong className="text-teal-600">Klik 2x</strong> untuk melihat analisis gramatikal (I'rab) dari kata tersebut secara lengkap.</p>
              </div>
            ),
            placement: 'bottom',
          },
          {
            target: '#tour-harakat',
            content: 'Aktifkan mode ini untuk memunculkan harakat saat Anda mengklik sebuah kata.',
            placement: 'bottom',
          },
          {
            target: '#tour-translation',
            content: 'Aktifkan mode ini untuk memunculkan terjemahan per kata saat diklik.',
            placement: 'bottom',
          }
        ];

        // Conditional rendering for steps based on element presence
        if (document.querySelector('#tour-ngalogat')) {
          dynamicSteps.push({
            target: '#tour-ngalogat',
            content: 'Aktifkan mode ini untuk menampilkan simbol rumus pesantren tradisional (nga-logat).',
            placement: 'bottom',
          });
        }
        
        if (document.querySelector('#tour-tasykil')) {
          dynamicSteps.push({
            target: '#tour-tasykil',
            content: 'Aktifkan Mode Tasykil untuk berlatih menebak harakat gundul yang benar secara interaktif.',
            placement: 'bottom',
          });
        }
        
        if (document.querySelector('#tour-show-all')) {
          dynamicSteps.push({
            target: '#tour-show-all',
            content: 'Gunakan tombol ini untuk langsung menampilkan keseluruhan teks terjemahan paragraf secara utuh.',
            placement: 'bottom',
          });
        }

        dynamicSteps.push({
          target: '#tour-settings',
          content: 'Buka pengaturan ini untuk menyesuaikan ukuran teks Arab, spasi antar kata, tinggi baris, dan mengaktifkan Mode Fokus yang nyaman.',
          placement: 'bottom-end',
        });

        setSteps(dynamicSteps);
        setRun(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleJoyrideCallback = (data) => {
    const { status, action, type } = data;
    const finishedStatuses = ['finished', 'skipped']; // Hardcoded string instead of STATUS object keys to ensure safety
    
    // Pastikan status disetel menjadi true setiap kali tour selesai, di-skip, atau ditutup secara paksa.
    if (finishedStatuses.includes(status) || action === 'close' || type === 'tour:end') {
      localStorage.setItem('hasSeenTutorial', 'true');
      setRun(false);
    }
  };

  return (
    <Joyride
      callback={handleJoyrideCallback}
      continuous={true}
      run={run}
      scrollToFirstStep={true}
      showProgress={true}
      showSkipButton={true}
      steps={steps}
      locale={{
        back: 'Kembali',
        close: 'Tutup',
        last: 'Selesai',
        next: 'Lanjut',
        skip: 'Lewati',
      }}
      styles={{
        options: {
          zIndex: 10000,
          primaryColor: '#0d9488', // teal-600
          textColor: '#374151', // gray-700
          backgroundColor: '#ffffff',
          arrowColor: '#ffffff',
        },
        tooltipContainer: {
          textAlign: 'left',
          fontSize: '14px',
          padding: '10px 0',
        },
        buttonNext: {
          backgroundColor: '#14b8a6', // teal-500
          borderRadius: '4px',
          color: '#fff',
        },
        buttonBack: {
          color: '#6b7280', // gray-500
          marginRight: '10px',
        },
        buttonSkip: {
          color: '#ef4444', // red-500
        }
      }}
    />
  );
};

export default Tutorial;
