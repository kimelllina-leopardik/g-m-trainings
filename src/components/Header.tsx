import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BrandMonogram } from './BrandBadge';
import {
  Sun,
  Moon,
  ShieldCheck,
  Award,
  Users,
  Search,
  LogOut,
  ChevronDown,
  Sparkles,
  Store,
  GraduationCap,
} from 'lucide-react';

interface HeaderProps {
  onOpenVerifyModal: () => void;
  onOpenAuthModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenVerifyModal,
  onOpenAuthModal,
}) => {
  const {
    currentUser,
    allUsers,
    switchUser,
    theme,
    toggleTheme,
    activeTab,
    setActiveTab,
    getUserCertificates,
  } = useApp();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const myCertsCount = getUserCertificates().length;

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Logo & Platform Name */}
          <div
            className="flex items-center gap-3 cursor-pointer select-none"
            onClick={() => setActiveTab('courses')}
          >
            <BrandMonogram brand={currentUser.brand} className="w-10 h-10 shadow-sm" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-zinc-900 dark:text-zinc-100 tracking-tight text-base sm:text-lg">
                  G&M Group
                </span>
                <span className="hidden xs:inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold tracking-wide uppercase bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
                  LMS Academy
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 dark:text-zinc-400 truncate max-w-[180px] sm:max-w-xs">
                <Store className="w-3 h-3 shrink-0" />
                <span className="truncate">{currentUser.storeLocation}</span>
              </div>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Quick verify button */}
            <button
              onClick={onOpenVerifyModal}
              title="Проверить подлинность сертификата по номеру или QR"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-700 dark:text-zinc-300 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-lg transition-colors border border-zinc-200 dark:border-zinc-700 cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Проверка сертификата</span>
            </button>

            {/* Dark / Light Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Сменить тему оформления"
              className="p-2 rounded-lg text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              {theme === 'light' ? (
                <Moon className="w-4 h-4 text-zinc-700" />
              ) : (
                <Sun className="w-4 h-4 text-amber-400" />
              )}
            </button>

            {/* User Profile / Quick Switcher */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800/80 transition-colors text-left cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-zinc-700 to-zinc-900 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                  {currentUser.fullName
                    .split(' ')
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join('')}
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                    <span className="truncate max-w-[120px]">{currentUser.fullName}</span>
                    {currentUser.role === 'super_admin' && (
                      <span className="text-[9px] px-1.5 py-0.2 bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 font-bold rounded">
                        Админ
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5 text-amber-500" />
                    <span>{currentUser.points} баллов</span>
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
              </button>

              {/* User Dropdown Menu */}
              {isUserMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-72 bg-white dark:bg-zinc-900 rounded-xl shadow-xl border border-zinc-200 dark:border-zinc-800 py-2 z-50 animate-in fade-in zoom-in-95 duration-100"
                  onClick={() => setIsUserMenuOpen(false)}
                >
                  <div className="px-4 py-2.5 border-b border-zinc-100 dark:border-zinc-800">
                    <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                      {currentUser.fullName}
                    </p>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
                      {currentUser.email}
                    </p>
                    <div className="mt-1.5 flex items-center justify-between text-[11px]">
                      <span className="text-zinc-500">Бренд:</span>
                      <span className="font-medium text-zinc-800 dark:text-zinc-200">
                        {currentUser.brand}
                      </span>
                    </div>
                    <div className="mt-0.5 flex items-center justify-between text-[11px]">
                      <span className="text-zinc-500">Сертификатов:</span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                        {myCertsCount}
                      </span>
                    </div>
                  </div>

                  <div className="py-1">
                    <div className="px-3 py-1 text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                      Быстрое переключение профиля:
                    </div>
                    {allUsers.slice(0, 4).map((u) => (
                      <button
                        key={u.id}
                        onClick={() => switchUser(u.id)}
                        className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors ${
                          u.id === currentUser.id
                            ? 'font-bold text-zinc-900 dark:text-white bg-zinc-50 dark:bg-zinc-800/50'
                            : 'text-zinc-600 dark:text-zinc-300'
                        }`}
                      >
                        <div className="truncate pr-2">
                          <div>{u.fullName}</div>
                          <div className="text-[10px] text-zinc-400 font-normal truncate">
                            {u.brand} • {u.storeLocation.split('—')[1] || u.storeLocation}
                          </div>
                        </div>
                        {u.role === 'super_admin' ? (
                          <span className="shrink-0 text-[9px] px-1 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200 font-semibold">
                            Админ
                          </span>
                        ) : (
                          <span className="shrink-0 text-[9px] text-zinc-400">
                            {u.points} б.
                          </span>
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="border-t border-zinc-100 dark:border-zinc-800 pt-1 mt-1">
                    <button
                      onClick={onOpenAuthModal}
                      className="w-full text-left px-3 py-1.5 text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-2 cursor-pointer"
                    >
                      <Users className="w-3.5 h-3.5 text-zinc-400" />
                      <span>Регистрация / Сменить логин</span>
                    </button>
                    <button
                      onClick={onOpenVerifyModal}
                      className="sm:hidden w-full text-left px-3 py-1.5 text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-2 cursor-pointer"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Проверить сертификат</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Top Navigation Tabs */}
        <nav className="flex items-center gap-1 -mb-px overflow-x-auto no-scrollbar pt-1">
          <button
            onClick={() => setActiveTab('courses')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-semibold border-b-2 transition-all shrink-0 cursor-pointer ${
              activeTab === 'courses'
                ? 'border-zinc-900 text-zinc-900 dark:border-white dark:text-white'
                : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Курсы & Тренинги</span>
          </button>

          <button
            onClick={() => setActiveTab('certificates')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-semibold border-b-2 transition-all shrink-0 cursor-pointer ${
              activeTab === 'certificates'
                ? 'border-zinc-900 text-zinc-900 dark:border-white dark:text-white'
                : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Мои сертификаты</span>
            {myCertsCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold">
                {myCertsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-semibold border-b-2 transition-all shrink-0 cursor-pointer ${
              activeTab === 'leaderboard'
                ? 'border-zinc-900 text-zinc-900 dark:border-white dark:text-white'
                : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Рейтинг магазинов</span>
          </button>

          {/* Admin panel tab (highlighted if super_admin) */}
          <button
            onClick={() => setActiveTab('admin')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-semibold border-b-2 transition-all shrink-0 ml-auto cursor-pointer ${
              activeTab === 'admin'
                ? 'border-amber-600 text-amber-700 dark:border-amber-400 dark:text-amber-300'
                : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>Кабинет Супер-Админа</span>
            {currentUser.role === 'super_admin' && (
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            )}
          </button>
        </nav>
      </div>
    </header>
  );
};
