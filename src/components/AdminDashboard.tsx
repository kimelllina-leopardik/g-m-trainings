import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User, BrandType, StoreLocation } from '../types';
import { STORES_LIST } from '../data/coursesData';
import { BrandBadge, BrandMonogram } from './BrandBadge';
import {
  Users,
  Award,
  TrendingUp,
  CheckCircle2,
  Filter,
  Search,
  ChevronRight,
  X,
  Clock,
  RotateCcw,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Store,
} from 'lucide-react';

interface AdminDashboardProps {
  onOpenCertificate: (certId: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onOpenCertificate }) => {
  const {
    allUsers,
    courses,
    progress,
    certificates,
    resetCourseCooldown,
  } = useApp();

  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [selectedStore, setSelectedStore] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [inspectedUser, setInspectedUser] = useState<User | null>(null);

  // Compute overall KPI metrics
  const totalEmployees = allUsers.filter((u) => u.role === 'employee').length;
  const totalCertsIssued = certificates.length;

  const allScores = Object.values(progress)
    .filter((p) => p.passed)
    .map((p) => p.lastScorePercent);
  const avgScore =
    allScores.length > 0
      ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length)
      : 92;

  // Filtered employees
  const filteredUsers = allUsers.filter((u) => {
    // Only show employees, or super admin if no employees match
    if (selectedBrand !== 'all' && u.brand !== selectedBrand) return false;
    if (selectedStore !== 'all' && u.storeLocation !== selectedStore) return false;
    if (
      searchQuery.trim() &&
      !u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !u.email.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Role Badge */}
      <div className="bg-gradient-to-r from-zinc-900 to-zinc-800 text-white rounded-3xl p-6 sm:p-8 shadow-sm border border-zinc-700">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Панель управления Супер-Администратора</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Сводная аналитика обучения G&M Group
            </h1>
            <p className="text-xs sm:text-sm text-zinc-300 mt-1 max-w-xl">
              Мониторинг прохождения обязательных курсов, сдачи пост-тестов и выдачи сертификатов по
              всем магазинам Душанбе и Худжанда.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-zinc-800/80 border border-zinc-700 p-3 rounded-2xl shrink-0">
            <div className="text-right">
              <span className="text-[11px] text-zinc-400 block">Группа брендов:</span>
              <span className="font-bold text-xs text-zinc-100">La Cité • GEOX • Yves Rocher</span>
            </div>
          </div>
        </div>

        {/* 4 Quick KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-zinc-700/60">
          <div className="bg-zinc-800/50 rounded-xl p-3.5 border border-zinc-700/50">
            <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
              <span>Сотрудников:</span>
              <Users className="w-3.5 h-3.5" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-white">{totalEmployees}</div>
            <div className="text-[10px] text-zinc-400 mt-0.5">В активных магазинах</div>
          </div>

          <div className="bg-zinc-800/50 rounded-xl p-3.5 border border-zinc-700/50">
            <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
              <span>Сертификатов:</span>
              <Award className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-amber-300">{totalCertsIssued}</div>
            <div className="text-[10px] text-zinc-400 mt-0.5">Успешных сдач (&ge;85%)</div>
          </div>

          <div className="bg-zinc-800/50 rounded-xl p-3.5 border border-zinc-700/50">
            <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
              <span>Средний балл:</span>
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-emerald-400">{avgScore}%</div>
            <div className="text-[10px] text-zinc-400 mt-0.5">По всем пост-тестам</div>
          </div>

          <div className="bg-zinc-800/50 rounded-xl p-3.5 border border-zinc-700/50">
            <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
              <span>Активных курсов:</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-blue-300">{courses.length}</div>
            <div className="text-[10px] text-zinc-400 mt-0.5">В каталоге академии</div>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4 shadow-xs">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск по ФИО или email сотрудника..."
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900"
            />
          </div>

          {/* Filter by Brand */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-medium shrink-0">
              <Filter className="w-3.5 h-3.5" />
              <span>Бренд:</span>
            </div>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="px-3 py-2 text-xs font-semibold rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 cursor-pointer"
            >
              <option value="all">Все бренды</option>
              <option value="La Cité">La Cité</option>
              <option value="GEOX">GEOX</option>
              <option value="Yves Rocher">Yves Rocher</option>
            </select>

            {/* Filter by Store */}
            <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-medium shrink-0 ml-1">
              <Store className="w-3.5 h-3.5" />
              <span>Магазин:</span>
            </div>
            <select
              value={selectedStore}
              onChange={(e) => setSelectedStore(e.target.value)}
              className="px-3 py-2 text-xs font-semibold rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 max-w-[200px] truncate cursor-pointer"
            >
              <option value="all">Все магазины</option>
              {STORES_LIST.map((store) => (
                <option key={store} value={store}>
                  {store}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Employees Table */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-xs">
        <div className="px-5 py-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
          <div className="font-bold text-sm text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <span>Список сотрудников</span>
            <span className="px-2 py-0.5 text-xs rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-medium">
              {filteredUsers.length}
            </span>
          </div>
          <span className="text-[11px] text-zinc-400">
            Нажмите на строку для подробного отчета
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-700 dark:text-zinc-300">
            <thead className="bg-zinc-50 dark:bg-zinc-800/60 text-zinc-400 text-[11px] uppercase tracking-wider border-b border-zinc-100 dark:border-zinc-800">
              <tr>
                <th className="py-3 px-4 font-semibold">Сотрудник</th>
                <th className="py-3 px-4 font-semibold">Бренд & Бутик</th>
                <th className="py-3 px-4 font-semibold">Сертификаты</th>
                <th className="py-3 px-4 font-semibold">Баллы</th>
                <th className="py-3 px-4 font-semibold text-right">Действие</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {filteredUsers.map((user) => {
                const userCerts = certificates.filter((c) => c.userId === user.id);
                const completedCount = courses.filter((course) => {
                  const key = `${user.id}_${course.id}`;
                  return progress[key]?.passed;
                }).length;

                return (
                  <tr
                    key={user.id}
                    onClick={() => setInspectedUser(user)}
                    className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer"
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-zinc-800 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                          {user.fullName
                            .split(' ')
                            .map((n) => n[0])
                            .slice(0, 2)
                            .join('')}
                        </div>
                        <div>
                          <div className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                            <span>{user.fullName}</span>
                            {user.role === 'super_admin' && (
                              <span className="text-[9px] bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 px-1 py-0.2 rounded font-semibold">
                                Админ
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-zinc-400">{user.email}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex flex-col gap-1">
                        <BrandBadge brand={user.brand} size="sm" />
                        <span className="text-[10px] text-zinc-400 truncate max-w-[180px]">
                          {user.storeLocation}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-semibold px-2 py-0.5 rounded text-[11px] ${
                            userCerts.length > 0
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                              : 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400'
                          }`}
                        >
                          {userCerts.length} из {courses.length}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-500" />
                        {user.points}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setInspectedUser(user);
                        }}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white px-2.5 py-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
                      >
                        <span>Личное дело</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Individual Employee Modal / Inspector */}
      {inspectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setInspectedUser(null)}
              className="absolute top-5 right-5 p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Profile Header */}
            <div className="flex items-start gap-3.5 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-zinc-800 to-zinc-950 text-white font-bold text-base flex items-center justify-center shadow-sm">
                {inspectedUser.fullName
                  .split(' ')
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join('')}
              </div>
              <div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                  {inspectedUser.fullName}
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {inspectedUser.email} • {inspectedUser.phone || 'Телефон не указан'}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <BrandBadge brand={inspectedUser.brand} size="sm" />
                  <span className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">
                    {inspectedUser.storeLocation}
                  </span>
                </div>
              </div>
            </div>

            {/* Curriculum Progress List */}
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
              Прогресс по всем обязательным курсам программы:
            </h4>

            <div className="space-y-3">
              {courses.map((course) => {
                const key = `${inspectedUser.id}_${course.id}`;
                const p = progress[key];
                const userCert = certificates.find(
                  (c) => c.userId === inspectedUser.id && c.courseId === course.id
                );

                const isPassed = p?.passed;
                const isCooldown =
                  !isPassed &&
                  p?.nextAttemptAvailableAt &&
                  new Date(p.nextAttemptAvailableAt).getTime() > Date.now();

                return (
                  <div
                    key={course.id}
                    className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <BrandMonogram brand={course.brand} className="w-5 h-5" />
                        <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                          {course.title}
                        </span>
                      </div>
                      <div className="text-[11px] text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
                        <span>
                          Теория: {p?.completedSlideIds?.length || 0}/{course.slides.length} уроков
                        </span>
                        <span>•</span>
                        <span>
                          Карточки: {p?.masteredFlashcardIds?.length || 0}/{course.flashcards.length}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {isPassed ? (
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-[11px] rounded-lg">
                            Сдан ({p.lastScorePercent}%)
                          </span>
                          {userCert && (
                            <button
                              onClick={() => {
                                setInspectedUser(null);
                                onOpenCertificate(userCert.certificateId);
                              }}
                              className="px-2.5 py-1 text-[11px] font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 rounded-lg border border-amber-200 dark:border-amber-800 flex items-center gap-1 hover:bg-amber-100 cursor-pointer"
                            >
                              <Award className="w-3 h-3" />
                              <span>Сертификат</span>
                            </button>
                          )}
                        </div>
                      ) : isCooldown ? (
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-amber-700 dark:text-amber-300 font-medium">
                            Кулдаун 24ч ({p?.lastScorePercent}%)
                          </span>
                          <button
                            onClick={() => resetCourseCooldown(inspectedUser.id, course.id)}
                            className="text-[11px] px-2 py-1 bg-zinc-800 text-white rounded hover:bg-black font-semibold cursor-pointer"
                            title="Снять блокировку сотруднику досрочно"
                          >
                            Сбросить таймер
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-zinc-400 font-medium">
                          {p?.status === 'in_progress' ? 'В процессе изучения' : 'Не приступал'}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
