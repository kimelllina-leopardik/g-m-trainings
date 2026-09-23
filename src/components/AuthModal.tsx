import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BrandType, StoreLocation } from '../types';
import { STORES_LIST } from '../data/coursesData';
import { BrandMonogram } from './BrandBadge';
import { X, UserPlus, LogIn, ShieldCheck, Check } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { allUsers, loginUser, registerUser, switchUser, currentUser } = useApp();

  const [mode, setMode] = useState<'register' | 'login'>('register');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [brand, setBrand] = useState<BrandType>('La Cité');
  const [storeLocation, setStoreLocation] = useState<StoreLocation>('Душанбе — Сиёма Молл');
  const [phone, setPhone] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) {
      setErrorMsg('Пожалуйста, заполните ФИО и рабочий Email');
      return;
    }

    registerUser({
      fullName: fullName.trim(),
      email: email.trim(),
      brand,
      storeLocation,
      phone: phone.trim(),
    });

    onClose();
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMsg('Введите ваш Email');
      return;
    }

    const success = loginUser(email.trim());
    if (success) {
      onClose();
    } else {
      setErrorMsg('Пользователь с таким email не найден. Зарегистрируйтесь в соседней вкладке.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-in fade-in duration-100 overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 overflow-hidden my-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <BrandMonogram brand={brand} className="w-10 h-10 shadow-xs" />
          <div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
              {mode === 'register' ? 'Регистрация консультанта' : 'Вход в систему'}
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Корпоративная академия тренингов G&M Group
            </p>
          </div>
        </div>

        {/* Tab switch */}
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl mb-5 text-xs font-semibold">
          <button
            onClick={() => {
              setMode('register');
              setErrorMsg('');
            }}
            className={`py-2 rounded-lg transition-colors cursor-pointer ${
              mode === 'register'
                ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-2xs'
                : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            Новый сотрудник
          </button>
          <button
            onClick={() => {
              setMode('login');
              setErrorMsg('');
            }}
            className={`py-2 rounded-lg transition-colors cursor-pointer ${
              mode === 'login'
                ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-2xs'
                : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            Вход по Email
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-800 dark:text-rose-200">
            {errorMsg}
          </div>
        )}

        {/* Registration Form */}
        {mode === 'register' && (
          <form onSubmit={handleRegister} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                ФИО сотрудника *
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="например, Амина Саидова"
                className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                Корпоративный или личный Email *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="amina@lacite.tj"
                className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                  Основной бренд *
                </label>
                <select
                  value={brand}
                  onChange={(e) => setBrand(e.target.value as BrandType)}
                  className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 cursor-pointer"
                >
                  <option value="La Cité">La Cité (lacite.tj)</option>
                  <option value="GEOX">GEOX</option>
                  <option value="Yves Rocher">Yves Rocher</option>
                  <option value="G&M Общий">G&M Group (Общий)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                  Магазин / Бутик *
                </label>
                <select
                  value={storeLocation}
                  onChange={(e) => setStoreLocation(e.target.value as StoreLocation)}
                  className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 cursor-pointer truncate"
                >
                  {STORES_LIST.map((store) => (
                    <option key={store} value={store}>
                      {store}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                Телефон (необязательно)
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+992 90 000 0000"
                className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900"
              />
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-2.5 px-4 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Зарегистрироваться и начать обучение
            </button>
          </form>
        )}

        {/* Login Form */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                Ваш Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="например, amina.s@lacite.tj"
                className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Войти в личный кабинет
            </button>
          </form>
        )}

        {/* Quick Demo Switchers */}
        <div className="mt-6 pt-5 border-t border-zinc-100 dark:border-zinc-800">
          <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-2">
            Быстрый вход для тестирования системы:
          </span>
          <div className="space-y-1.5">
            {allUsers.slice(0, 4).map((u) => (
              <button
                key={u.id}
                type="button"
                onClick={() => {
                  switchUser(u.id);
                  onClose();
                }}
                className={`w-full text-left p-2 rounded-xl text-xs flex items-center justify-between border transition-all cursor-pointer ${
                  u.id === currentUser.id
                    ? 'border-zinc-900 dark:border-zinc-100 bg-zinc-50 dark:bg-zinc-800'
                    : 'border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/60'
                }`}
              >
                <div>
                  <div className="font-semibold text-zinc-900 dark:text-zinc-100">
                    {u.fullName} {u.role === 'super_admin' && '👑 (Супер-Админ)'}
                  </div>
                  <div className="text-[10px] text-zinc-400">
                    {u.brand} • {u.storeLocation}
                  </div>
                </div>
                {u.id === currentUser.id ? (
                  <Check className="w-4 h-4 text-emerald-600" />
                ) : (
                  <span className="text-[11px] text-zinc-400">Войти →</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
