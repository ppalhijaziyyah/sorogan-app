import React from 'react';

const UserBadge = ({ user }) => {
  const { name, avatar, amount, contributionCount, role, type, profileUrl } = user;

  const isSponsor = type === 'sponsor';

  const formatCurrency = (value) => {
    if (typeof value === 'number' && value > 0) {
      return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value / 1000) + 'k';
    }
    if (typeof value === 'string' && value.trim() !== '') {
      return value;
    }
    return 'Donatur';
  };

  return (
    <a 
      href={profileUrl} 
      target="_blank" 
      rel="noopener noreferrer" 
      className="flex w-full items-center bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-white/20 rounded-full p-1 pr-3 hover:shadow-md hover:-translate-y-0.5 cursor-pointer transition-all duration-200 ease-in-out"
      title={`${name} - ${isSponsor ? `Donasi: ${formatCurrency(amount)}` : type === 'developer' ? `Peran: ${role}` : `Kontribusi: ${contributionCount} materi`}`}
    >
      {avatar.startsWith('http') || avatar.startsWith('/') || avatar.startsWith('data:') ? (
        <img src={avatar} alt={`Avatar of ${name}`} className="shrink-0 w-10 h-10 rounded-full object-cover shadow-sm" />
      ) : (
        <div className="shrink-0 w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-xl shadow-sm">
          {avatar}
        </div>
      )}
      <div className="ml-3 flex flex-col justify-center min-w-0">
        <p className="text-sm font-medium text-teal-600 dark:text-teal-400 truncate">{name}</p>
        <span className="text-[10px] sm:text-xs leading-tight font-semibold text-gray-500 dark:text-gray-400 truncate mt-0.5">
          {isSponsor ? formatCurrency(amount) : type === 'developer' ? role : `${contributionCount} materi`}
        </span>
      </div>
    </a>
  );
};

export default UserBadge;
