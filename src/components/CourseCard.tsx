import React from 'react';
import { Course } from '../types';
import { useApp } from '../context/AppContext';
import { BrandBadge, BrandMonogram } from './BrandBadge';
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  PlayCircle,
  Award,
  Layers,
  Sparkles,
  HelpCircle,
} from 'lucide-react';

interface CourseCardProps {
  course: Course;
  onSelect: (courseId: string) => void;
  onViewCertificate?: (certId: string) => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  onSelect,
  onViewCertificate,
}) => {
  const { getCourseProgress, getUserCertificates } = useApp();
  const progress = getCourseProgress(course.id);
  const userCerts = getUserCertificates();
  const certificate = userCerts.find((c) => c.courseId === course.id);

  const completedSlidesCount = progress?.completedSlideIds?.length || 0;
  const totalSlides = course.slides.length;
  const slidePercent = Math.round((completedSlidesCount / totalSlides) * 100);

  const isPassed = progress?.passed === true;

  // Check cooldown if failed
  const isCooldown = Boolean(
    !isPassed &&
    progress?.nextAttemptAvailableAt &&
    new Date(progress.nextAttemptAvailableAt).getTime() > Date.now()
  );

  const getCooldownHoursLeft = () => {
    if (!progress?.nextAttemptAvailableAt) return 0;
    const diff = new Date(progress.nextAttemptAvailableAt).getTime() - Date.now();
    return Math.max(1, Math.ceil(diff / (1000 * 60 * 60)));
  };

  return (
    <div className="group bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-700 transition-all duration-200 shadow-xs hover:shadow-md flex flex-col justify-between overflow-hidden">
      {/* Top Brand Stripe & Meta */}
      <div className="p-5 pb-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <BrandMonogram brand={course.brand} className="w-8 h-8 shrink-0" />
            <div>
              <BrandBadge brand={course.brand} size="sm" />
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-800/80 px-2.5 py-1 rounded-md border border-zinc-100 dark:border-zinc-800">
            <Clock className="w-3.5 h-3.5" />
            <span>~{course.durationMinutes} мин</span>
          </div>
        </div>

        {/* Title & Subtitle */}
        <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-base sm:text-lg leading-snug group-hover:text-zinc-700 dark:group-hover:text-zinc-200 transition-colors">
          {course.title}
        </h3>
        <p className="mt-1.5 text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
          {course.subtitle}
        </p>

        {/* Content Structure Pills */}
        <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] text-zinc-500 dark:text-zinc-400">
          <span className="inline-flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-md">
            <Layers className="w-3 h-3 text-zinc-600 dark:text-zinc-300" />
            {course.slides.length} уроков
          </span>
          <span className="inline-flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-md">
            <Sparkles className="w-3 h-3 text-amber-500" />
            {course.flashcards.length} флеш-карт
          </span>
          <span className="inline-flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-md">
            <HelpCircle className="w-3 h-3 text-indigo-500" />
            Тест (порог {course.passThresholdPercent}%)
          </span>
        </div>
      </div>

      {/* Progress & Bottom Actions */}
      <div className="px-5 pb-5 pt-3 border-t border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/30">
        {/* Progress bar */}
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-zinc-500 dark:text-zinc-400 font-medium">
              {isPassed
                ? 'Курс успешно сдан'
                : completedSlidesCount > 0
                ? `Теория: ${completedSlidesCount} из ${totalSlides}`
                : 'Курс не начат'}
            </span>
            <span className="font-semibold text-zinc-800 dark:text-zinc-200">
              {isPassed ? '100%' : `${slidePercent}%`}
            </span>
          </div>
          <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                isPassed
                  ? 'bg-emerald-500'
                  : completedSlidesCount > 0
                  ? 'bg-zinc-800 dark:bg-zinc-300'
                  : 'bg-transparent'
              }`}
              style={{ width: `${isPassed ? 100 : slidePercent}%` }}
            />
          </div>
        </div>

        {/* Status indicator / Cooldown banner */}
        {isPassed ? (
          <div className="flex items-center justify-between gap-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-800/80">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>Сдан ({progress?.lastScorePercent}%)</span>
            </div>
            {certificate && onViewCertificate ? (
              <button
                onClick={() => onViewCertificate(certificate.certificateId)}
                className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 dark:text-amber-300 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/50 dark:hover:bg-amber-900/60 px-3 py-1.5 rounded-lg border border-amber-200 dark:border-amber-800 transition-colors cursor-pointer"
              >
                <Award className="w-3.5 h-3.5" />
                <span>Сертификат</span>
              </button>
            ) : (
              <button
                onClick={() => onSelect(course.id)}
                className="text-xs text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 font-medium py-1.5 cursor-pointer"
              >
                Повторить
              </button>
            )}
          </div>
        ) : isCooldown ? (
          <div className="flex items-center justify-between gap-2">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-medium text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-1.5 rounded-lg border border-amber-200 dark:border-amber-800/80">
              <AlertCircle className="w-3.5 h-3.5 shrink-0 text-amber-600" />
              <span>Пересдача через ~{getCooldownHoursLeft()} ч.</span>
            </div>
            <button
              onClick={() => onSelect(course.id)}
              className="text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white px-2 py-1 cursor-pointer"
            >
              Учить теорию
            </button>
          </div>
        ) : (
          <button
            onClick={() => onSelect(course.id)}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <PlayCircle className="w-4 h-4" />
            <span>
              {completedSlidesCount > 0 ? 'Продолжить обучение' : 'Начать обучение'}
            </span>
          </button>
        )}
      </div>
    </div>
  );
};
