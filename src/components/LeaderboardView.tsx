import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BADGES_LIST, STORES_LIST } from '../data/coursesData';
import { BrandBadge } from './BrandBadge';
import {
  Trophy,
  Medal,
  Store,
  Users,
  Award,
  Sparkles,
  Flame,
  CheckCircle,
} from 'lucide-react';

export const LeaderboardView: React.FC = () => {
  const { allUsers, certificates, currentUser } = useApp();
  const [viewMode, setViewMode] = useState<'employees' | 'stores'>('employees');

  // Compute store rankings
  const storeStats = STORES_LIST.map((store) => {
    const storeEmployees = allUsers.filter((u) => u.storeLocation === store && u.role === 'employee');
    const totalPoints = storeEmployees.reduce((sum, u) => sum + u.points, 0);
    const storeCerts = certificates.filter((c) => c.storeLocation === store);

    return {
      storeName: store,
      employeesCount: storeEmployees.length,
      totalPoints,
      certsCount: storeCerts.length,
    };
  }).sort((a, b) => b.totalPoints - a.totalPoints || b.certsCount - a.certsCount);

  // Compute employee rankings
  const sortedEmployees = [...allUsers]
    .filter((u) => u.role === 'employee')
    .sort((a, b) => b.points - a.points || b.badges.length - a.badges.length);

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-zinc-200 dark:border-zinc-800 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-3 py-1 rounded-full border border-amber-200 dark:border-amber-800 mb-2">
              <Trophy className="w-3.5 h-3.5" />
              <span>Геймификация и командный дух G&M Group</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
              Рейтинг и Достижения
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Баллы начисляются за каждый успешно сданный пост-тест (+100–120 б.) и изучение карточек.
            </p>
          </div>

          {/* Toggle View */}
          <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl border border-zinc-200 dark:border-zinc-700 shrink-0">
            <button
              onClick={() => setViewMode('employees')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                viewMode === 'employees'
                  ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-2xs'
                  : 'text-zinc-600 dark:text-zinc-400'
              }`}
            >
              Консультанты
            </button>
            <button
              onClick={() => setViewMode('stores')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                viewMode === 'stores'
                  ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-2xs'
                  : 'text-zinc-600 dark:text-zinc-400'
              }`}
            >
              Магазины и бутики
            </button>
          </div>
        </div>
      </div>

      {/* VIEW: EMPLOYEES LEADERBOARD */}
      {viewMode === 'employees' && (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            <span>Место & Консультант</span>
            <span>Сертификаты / Баллы</span>
          </div>

          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {sortedEmployees.map((emp, index) => {
              const userCerts = certificates.filter((c) => c.userId === emp.id);
              const isCurrentUser = emp.id === currentUser.id;

              return (
                <div
                  key={emp.id}
                  className={`p-4 sm:px-6 flex items-center justify-between gap-4 transition-colors ${
                    isCurrentUser
                      ? 'bg-amber-50/50 dark:bg-amber-950/20'
                      : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/40'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    {/* Rank medal */}
                    <div className="w-8 flex items-center justify-center font-bold text-sm shrink-0">
                      {index === 0 ? (
                        <div className="w-7 h-7 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 flex items-center justify-center shadow-xs">
                          🥇
                        </div>
                      ) : index === 1 ? (
                        <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center">
                          🥈
                        </div>
                      ) : index === 2 ? (
                        <div className="w-7 h-7 rounded-full bg-amber-900/20 text-amber-800 dark:text-amber-400 flex items-center justify-center">
                          🥉
                        </div>
                      ) : (
                        <span className="text-zinc-400 font-medium">#{index + 1}</span>
                      )}
                    </div>

                    {/* Info */}
                    <div>
                      <div className="font-bold text-sm text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                        <span>{emp.fullName}</span>
                        {isCurrentUser && (
                          <span className="text-[10px] bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 px-1.5 py-0.2 rounded font-semibold">
                            Вы
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-zinc-500 dark:text-zinc-400 flex items-center gap-2 mt-0.5">
                        <BrandBadge brand={emp.brand} size="sm" />
                        <span className="truncate max-w-[160px] sm:max-w-xs">
                          {emp.storeLocation}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Points & Certs */}
                  <div className="text-right">
                    <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center justify-end gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>{emp.points}</span>
                    </div>
                    <div className="text-[11px] text-zinc-400">
                      {userCerts.length} сертиф.
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW: STORES LEADERBOARD */}
      {viewMode === 'stores' && (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            <span>Место & Торговая точка</span>
            <span>Сумма баллов / Сертификаты</span>
          </div>

          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {storeStats.map((store, index) => (
              <div
                key={store.storeName}
                className="p-4 sm:px-6 flex items-center justify-between gap-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-7 text-center font-bold text-sm text-zinc-400">
                    {index === 0 ? '🏆' : `#${index + 1}`}
                  </div>
                  <div>
                    <div className="font-bold text-sm text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                      <Store className="w-4 h-4 text-zinc-400 shrink-0" />
                      <span>{store.storeName}</span>
                    </div>
                    <div className="text-[11px] text-zinc-400 mt-0.5">
                      {store.employeesCount} активных консультантов на платформе
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                    {store.totalPoints} б.
                  </div>
                  <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                    {store.certsCount} сертификатов
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Badges Collection Showcase */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-xs">
        <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100 mb-1 flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-500" />
          <span>Коллекция квалификационных бейджей G&M Group</span>
        </h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">
          Открываются при успешной сдаче профильного пост-теста курса на 85% и выше.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {BADGES_LIST.map((badge) => {
            const hasBadge = currentUser.badges.includes(badge.id);

            return (
              <div
                key={badge.id}
                className={`p-3.5 rounded-xl border transition-all flex items-start gap-3 ${
                  hasBadge
                    ? 'bg-amber-50/60 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/80 shadow-2xs'
                    : 'bg-zinc-50/50 dark:bg-zinc-800/30 border-zinc-200 dark:border-zinc-800 opacity-60'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    hasBadge
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-400'
                  }`}
                >
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs text-zinc-900 dark:text-zinc-100">
                      {badge.title}
                    </span>
                    {hasBadge && (
                      <span className="text-[9px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold px-1.5 py-0.2 rounded">
                        Получен
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-snug mt-0.5">
                    {badge.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
