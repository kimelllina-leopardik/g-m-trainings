import React from 'react';
import { useApp } from '../context/AppContext';
import { BrandBadge, BrandMonogram } from './BrandBadge';
import {
  Award,
  Calendar,
  Store,
  Printer,
  Sparkles,
  CheckCircle2,
  Lock,
  ArrowRight,
} from 'lucide-react';

interface MyCertificatesViewProps {
  onOpenCertificate: (certId: string) => void;
  onGoToCourse: (courseId: string) => void;
}

export const MyCertificatesView: React.FC<MyCertificatesViewProps> = ({
  onOpenCertificate,
  onGoToCourse,
}) => {
  const { currentUser, courses, certificates, getCourseProgress } = useApp();
  const userCerts = certificates.filter((c) => c.userId === currentUser.id);

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-zinc-200 dark:border-zinc-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800 mb-2">
            <Award className="w-3.5 h-3.5" />
            <span>Официальные квалификационные сертификаты</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
            Мои Сертификаты и Достижения
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Сотрудник: <strong className="text-zinc-800 dark:text-zinc-200">{currentUser.fullName}</strong> •{' '}
            {currentUser.storeLocation}
          </p>
        </div>

        <div className="bg-zinc-50 dark:bg-zinc-800/80 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-700 text-center shrink-0">
          <div className="text-2xl font-black text-zinc-900 dark:text-white">
            {userCerts.length}{' '}
            <span className="text-sm font-normal text-zinc-400">/ {courses.length}</span>
          </div>
          <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
            Пройдено программ
          </div>
        </div>
      </div>

      {/* Earned Certificates Grid */}
      {userCerts.length > 0 ? (
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
            Выданные электронные сертификаты:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userCerts.map((cert) => (
              <div
                key={cert.certificateId}
                className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-700 p-5 shadow-xs transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <BrandBadge brand={cert.courseBrand} size="sm" />
                    <span className="text-[11px] font-mono text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded">
                      {cert.certificateId}
                    </span>
                  </div>

                  <h4 className="font-bold text-base text-zinc-900 dark:text-zinc-100 leading-snug mb-2">
                    {cert.courseTitle}
                  </h4>

                  <div className="space-y-1 text-xs text-zinc-500 dark:text-zinc-400 mb-4">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                      <span>Дата сдачи: {cert.issuedAt}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Store className="w-3.5 h-3.5 text-zinc-400" />
                      <span>{cert.storeLocation}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Тест сдан на {cert.scorePercent}%</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onOpenCertificate(cert.certificateId)}
                    className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white rounded-xl transition-colors cursor-pointer"
                  >
                    <Award className="w-3.5 h-3.5 text-amber-400 dark:text-amber-600" />
                    <span>Показать и скачать сертификат</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-8 text-center text-zinc-500">
          <Award className="w-12 h-12 text-zinc-300 dark:text-zinc-600 mx-auto mb-3" />
          <h3 className="font-bold text-base text-zinc-800 dark:text-zinc-200">
            У вас пока нет выданных сертификатов
          </h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto mt-1 mb-4">
            Пройдите любой из курсов программы и сдайте финальный пост-тест на 85% и выше, чтобы
            получить официальный сертификат G&M Group.
          </p>
        </div>
      )}

      {/* In-Progress / Locked Courses */}
      <div className="mt-8 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
          Курсы, требующие прохождения:
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {courses
            .filter((c) => !userCerts.some((cert) => cert.courseId === c.id))
            .map((course) => {
              const p = getCourseProgress(course.id);
              const isStarted = (p?.completedSlideIds?.length || 0) > 0;

              return (
                <div
                  key={course.id}
                  onClick={() => onGoToCourse(course.id)}
                  className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-400 dark:hover:border-zinc-600 transition-all cursor-pointer flex items-center justify-between gap-3 shadow-2xs"
                >
                  <div className="flex items-center gap-3">
                    <BrandMonogram brand={course.brand} className="w-9 h-9 shrink-0" />
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 line-clamp-1">
                        {course.title}
                      </h4>
                      <p className="text-[11px] text-zinc-400 mt-0.5">
                        {isStarted ? 'В процессе изучения' : 'Еще не начат'} • ~{course.durationMinutes} мин
                      </p>
                    </div>
                  </div>
                  <div className="text-zinc-400 group-hover:text-zinc-900">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};
