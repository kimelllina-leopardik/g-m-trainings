/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { CourseCard } from './components/CourseCard';
import { CourseViewer } from './components/CourseViewer';
import { CertificateModal } from './components/CertificateModal';
import { CertificateVerifyModal } from './components/CertificateVerifyModal';
import { AdminDashboard } from './components/AdminDashboard';
import { LeaderboardView } from './components/LeaderboardView';
import { MyCertificatesView } from './components/MyCertificatesView';
import { AuthModal } from './components/AuthModal';
import { BrandBadge } from './components/BrandBadge';
import { BrandType } from './types';
import {
  GraduationCap,
  Sparkles,
  Award,
  CheckCircle2,
  BookOpen,
  Filter,
  Layers,
} from 'lucide-react';

const LMSMainContent: React.FC = () => {
  const {
    currentUser,
    courses,
    activeTab,
    setActiveTab,
    selectedCourseId,
    setSelectedCourseId,
    findCertificate,
    certificates,
    getUserCertificates,
  } = useApp();

  const [brandFilter, setBrandFilter] = useState<string>('all');
  const [selectedCertId, setSelectedCertId] = useState<string | null>(null);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const selectedCourse = courses.find((c) => c.id === selectedCourseId);
  const activeCertificate = selectedCertId ? findCertificate(selectedCertId) : null;
  const userCerts = getUserCertificates();

  // Filtered courses
  const filteredCourses = courses.filter((c) => {
    if (brandFilter === 'all') return true;
    if (brandFilter === 'service') return c.brand === 'G&M Общий';
    return c.brand === brandFilter;
  });

  return (
    <div className="min-h-screen bg-[#FBFBFC] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors flex flex-col font-sans antialiased">
      {/* Top Navbar */}
      <Header
        onOpenVerifyModal={() => setIsVerifyModalOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />

      {/* Main App Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* If a course is actively opened, show full CourseViewer */}
        {selectedCourse ? (
          <CourseViewer
            course={selectedCourse}
            onBack={() => setSelectedCourseId(null)}
            onOpenCertificate={(id) => setSelectedCertId(id)}
          />
        ) : (
          <>
            {/* TAB: COURSES CATALOG */}
            {activeTab === 'courses' && (
              <div className="space-y-6">
                {/* Hero Greeting Card */}
                <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-zinc-200 dark:border-zinc-800 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <BrandBadge brand={currentUser.brand} size="md" />
                        <span className="text-xs text-zinc-400">• {currentUser.storeLocation}</span>
                      </div>
                      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                        Добро пожаловать, {currentUser.fullName}!
                      </h1>
                      <p className="mt-1.5 text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 max-w-2xl leading-relaxed">
                        Платформа самостоятельного обучения и закрепления стандартов сервиса для консультантов{' '}
                        <strong>La Cité</strong>, <strong>GEOX</strong> и <strong>Yves Rocher</strong>.
                        Изучайте уроки, тренируйтесь на флеш-карточках и сдавайте пост-тест для получения
                        сертификата.
                      </p>
                    </div>

                    {/* Stats pill */}
                    <div className="flex items-center gap-3 bg-zinc-50 dark:bg-zinc-800/80 p-3 sm:p-4 rounded-2xl border border-zinc-200 dark:border-zinc-700 shrink-0">
                      <div className="text-right">
                        <span className="text-[11px] text-zinc-500 dark:text-zinc-400 block">
                          Ваш прогресс:
                        </span>
                        <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5 justify-end">
                          <Sparkles className="w-4 h-4 text-amber-500" />
                          <span>{currentUser.points} б.</span>
                          <span className="text-zinc-300 dark:text-zinc-600">|</span>
                          <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          <span>{userCerts.length} / {courses.length}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Filter Chips Bar */}
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                  <span className="text-xs font-semibold text-zinc-400 flex items-center gap-1 shrink-0 mr-1">
                    <Filter className="w-3.5 h-3.5" />
                    <span>Фильтр:</span>
                  </span>

                  <button
                    onClick={() => setBrandFilter('all')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-colors cursor-pointer ${
                      brandFilter === 'all'
                        ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-2xs'
                        : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800'
                    }`}
                  >
                    Все направления ({courses.length})
                  </button>

                  <button
                    onClick={() => setBrandFilter('service')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-colors cursor-pointer ${
                      brandFilter === 'service'
                        ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-2xs'
                        : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800'
                    }`}
                  >
                    Стандарты сервиса G&M
                  </button>

                  <button
                    onClick={() => setBrandFilter('La Cité')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-colors cursor-pointer ${
                      brandFilter === 'La Cité'
                        ? 'bg-amber-900 text-amber-100 dark:bg-amber-800 dark:text-amber-50 shadow-2xs'
                        : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-amber-50/50 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800'
                    }`}
                  >
                    La Cité (lacite.tj)
                  </button>

                  <button
                    onClick={() => setBrandFilter('GEOX')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-colors cursor-pointer ${
                      brandFilter === 'GEOX'
                        ? 'bg-blue-950 text-sky-200 dark:bg-blue-900 dark:text-sky-100 shadow-2xs'
                        : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-sky-50/50 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800'
                    }`}
                  >
                    GEOX Respira
                  </button>

                  <button
                    onClick={() => setBrandFilter('Yves Rocher')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-colors cursor-pointer ${
                      brandFilter === 'Yves Rocher'
                        ? 'bg-emerald-900 text-emerald-100 dark:bg-emerald-800 dark:text-emerald-50 shadow-2xs'
                        : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-emerald-50/50 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800'
                    }`}
                  >
                    Yves Rocher
                  </button>
                </div>

                {/* Courses Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredCourses.map((course) => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      onSelect={(id) => setSelectedCourseId(id)}
                      onViewCertificate={(certId) => setSelectedCertId(certId)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* TAB: MY CERTIFICATES */}
            {activeTab === 'certificates' && (
              <MyCertificatesView
                onOpenCertificate={(id) => setSelectedCertId(id)}
                onGoToCourse={(courseId) => {
                  setSelectedCourseId(courseId);
                  setActiveTab('courses');
                }}
              />
            )}

            {/* TAB: LEADERBOARD */}
            {activeTab === 'leaderboard' && <LeaderboardView />}

            {/* TAB: ADMIN DASHBOARD */}
            {activeTab === 'admin' && (
              <AdminDashboard onOpenCertificate={(id) => setSelectedCertId(id)} />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-zinc-200 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/50 backdrop-blur-xs py-6 text-xs text-zinc-500 dark:text-zinc-400">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-zinc-800 dark:text-zinc-200">G&M Group Academy</span>
            <span>•</span>
            <span>La Cité (lacite.tj)</span>
            <span>•</span>
            <span>GEOX</span>
            <span>•</span>
            <span>Yves Rocher</span>
          </div>
          <div className="flex items-center gap-3 text-[11px]">
            <button
              onClick={() => setIsVerifyModalOpen(true)}
              className="hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              Проверка подлинности
            </button>
            <span>•</span>
            <span>Mobile-First LMS</span>
            <span>•</span>
            <span>Душанбе & Худжанд</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <CertificateModal
        certificate={activeCertificate || null}
        onClose={() => setSelectedCertId(null)}
      />

      <CertificateVerifyModal
        isOpen={isVerifyModalOpen}
        onClose={() => setIsVerifyModalOpen(false)}
        onOpenCertificate={(id) => setSelectedCertId(id)}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <LMSMainContent />
    </AppProvider>
  );
}
