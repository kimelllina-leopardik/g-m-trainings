import React, { useState, useEffect } from 'react';
import { Course } from '../types';
import { useApp } from '../context/AppContext';
import { BrandBadge, BrandMonogram } from './BrandBadge';
import {
  ArrowLeft,
  BookOpen,
  Layers,
  HelpCircle,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  RotateCw,
  Award,
  AlertTriangle,
  Lightbulb,
  Clock,
  Sparkles,
  RefreshCcw,
} from 'lucide-react';

interface CourseViewerProps {
  course: Course;
  onBack: () => void;
  onOpenCertificate: (certId: string) => void;
}

export const CourseViewer: React.FC<CourseViewerProps> = ({
  course,
  onBack,
  onOpenCertificate,
}) => {
  const {
    getCourseProgress,
    markSlideCompleted,
    toggleFlashcardMastered,
    submitQuiz,
    resetCourseCooldown,
    currentUser,
  } = useApp();

  const progress = getCourseProgress(course.id);

  // Tab state: 'theory' | 'flashcards' | 'quiz'
  const [activeTab, setActiveTab] = useState<'theory' | 'flashcards' | 'quiz'>(() => {
    // If user has completed all theory, default to flashcards or quiz
    const allSlidesDone =
      course.slides.every((s) => progress?.completedSlideIds?.includes(s.id));
    if (progress?.passed) return 'theory';
    if (allSlidesDone && (progress?.masteredFlashcardIds?.length || 0) >= course.flashcards.length) {
      return 'quiz';
    }
    if (allSlidesDone) return 'flashcards';
    return 'theory';
  });

  // Theory Slide Navigation
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Flashcards state
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Quiz state
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string[]>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizResult, setQuizResult] = useState<{
    scorePercent: number;
    passed: boolean;
    certificateId?: string;
    nextAttemptAvailableAt?: string;
  } | null>(null);

  const currentSlide = course.slides[currentSlideIndex];
  const currentCard = course.flashcards[currentCardIndex];

  // Mark current slide as completed automatically or on button click
  useEffect(() => {
    if (currentSlide) {
      markSlideCompleted(course.id, currentSlide.id);
    }
  }, [currentSlideIndex, course.id, currentSlide, markSlideCompleted]);

  // Flashcard flip reset when index changes
  useEffect(() => {
    setIsFlipped(false);
  }, [currentCardIndex]);

  // Cooldown status check
  const isCooldown = Boolean(
    !progress?.passed &&
    progress?.nextAttemptAvailableAt &&
    new Date(progress.nextAttemptAvailableAt).getTime() > Date.now()
  );

  const cooldownHours = () => {
    if (!progress?.nextAttemptAvailableAt) return 0;
    const diff = new Date(progress.nextAttemptAvailableAt).getTime() - Date.now();
    return Math.max(1, Math.ceil(diff / (1000 * 60 * 60)));
  };

  const handleOptionToggle = (questionId: string, optionId: string, isMultiple?: boolean) => {
    if (quizSubmitted) return;
    setSelectedAnswers((prev) => {
      const current = prev[questionId] || [];
      if (isMultiple) {
        if (current.includes(optionId)) {
          return { ...prev, [questionId]: current.filter((id) => id !== optionId) };
        } else {
          return { ...prev, [questionId]: [...current, optionId] };
        }
      } else {
        return { ...prev, [questionId]: [optionId] };
      }
    });
  };

  const handleQuizSubmit = () => {
    const res = submitQuiz(course.id, selectedAnswers);
    setQuizSubmitted(true);
    setQuizResult({
      scorePercent: res.scorePercent,
      passed: res.passed,
      certificateId: res.certificate?.certificateId,
      nextAttemptAvailableAt: res.nextAttemptAvailableAt,
    });
  };

  const handleRetakeQuiz = () => {
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setQuizResult(null);
  };

  return (
    <div className="max-w-4xl mx-auto pb-16">
      {/* Top Breadcrumb & Controls */}
      <div className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 -mx-4 px-4 sm:px-6 py-3 sticky top-16 z-20 backdrop-blur-md">
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer py-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">К каталогу курсов</span>
            <span className="sm:hidden">Назад</span>
          </button>

          <div className="flex items-center gap-2 truncate">
            <BrandMonogram brand={course.brand} className="w-6 h-6 shrink-0" />
            <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 truncate max-w-[200px] sm:max-w-md">
              {course.title}
            </span>
          </div>

          <BrandBadge brand={course.brand} size="sm" />
        </div>

        {/* 3 Step Navigation */}
        <div className="mt-3 grid grid-cols-3 gap-2 border-t border-zinc-100 dark:border-zinc-800 pt-2.5">
          <button
            onClick={() => setActiveTab('theory')}
            className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'theory'
                ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-xs'
                : 'bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 shrink-0" />
            <span>1. Теория</span>
          </button>

          <button
            onClick={() => setActiveTab('flashcards')}
            className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'flashcards'
                ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-xs'
                : 'bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
            }`}
          >
            <Layers className="w-3.5 h-3.5 shrink-0" />
            <span>2. Карточки</span>
            <span className="text-[10px] opacity-75">({course.flashcards.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('quiz')}
            className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'quiz'
                ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-xs'
                : 'bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5 shrink-0 text-amber-500" />
            <span>3. Тест</span>
            {progress?.passed && (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            )}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="mt-5">
        {/* TAB 1: THEORY */}
        {activeTab === 'theory' && (
          <div className="space-y-4">
            {/* Progress indicator across slides */}
            <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-xs">
              <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                Шаг {currentSlideIndex + 1} из {course.slides.length}: {currentSlide.badge}
              </span>
              <div className="flex gap-1.5">
                {course.slides.map((s, idx) => {
                  const isDone = progress?.completedSlideIds?.includes(s.id);
                  return (
                    <div
                      key={s.id}
                      onClick={() => setCurrentSlideIndex(idx)}
                      className={`h-2 rounded-full cursor-pointer transition-all ${
                        idx === currentSlideIndex
                          ? 'w-6 bg-zinc-900 dark:bg-white'
                          : isDone
                          ? 'w-2.5 bg-emerald-500'
                          : 'w-2.5 bg-zinc-200 dark:bg-zinc-700'
                      }`}
                      title={s.title}
                    />
                  );
                })}
              </div>
            </div>

            {/* Slide Card */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 shadow-xs">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200">
                  {currentSlide.badge}
                </span>
                <span className="text-xs text-zinc-400">
                  Урок {currentSlideIndex + 1}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight leading-snug mb-4">
                {currentSlide.title}
              </h2>

              <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-300 leading-relaxed mb-6">
                {currentSlide.contentMarkdown}
              </p>

              {/* Key Takeaways */}
              <div className="bg-zinc-50 dark:bg-zinc-800/60 rounded-xl p-4 sm:p-5 border border-zinc-200/80 dark:border-zinc-700/60 mb-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-3 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Ключевые стандарты и правила:</span>
                </h4>
                <ul className="space-y-2.5 text-xs sm:text-sm text-zinc-700 dark:text-zinc-200">
                  {currentSlide.keyPoints.map((pt, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-500 mt-2 shrink-0" />
                      <span className="leading-relaxed">{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Practical Case Study */}
              {currentSlide.practicalCase && (
                <div className="bg-amber-50/70 dark:bg-amber-950/30 rounded-xl p-4 sm:p-5 border border-amber-200 dark:border-amber-800/60">
                  <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200 font-bold text-xs uppercase tracking-wider mb-2">
                    <Lightbulb className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <span>Практический кейс в торговом зале</span>
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 font-medium mb-3">
                    «{currentSlide.practicalCase.scenario}»
                  </p>
                  <div className="text-xs sm:text-sm text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 p-3 rounded-lg border border-emerald-200 dark:border-emerald-900/50 mb-2">
                    <strong className="font-semibold block mb-1">Рекомендуемый ответ / действие:</strong>
                    {currentSlide.practicalCase.recommendedAction}
                  </div>
                  {currentSlide.practicalCase.wrongAction && (
                    <div className="text-xs text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/30 p-2.5 rounded-lg border border-rose-200 dark:border-rose-900/40">
                      <strong className="font-medium">Как делать НЕ надо: </strong>
                      {currentSlide.practicalCase.wrongAction}
                    </div>
                  )}
                </div>
              )}

              {/* Slide Navigation Buttons */}
              <div className="mt-8 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-3">
                <button
                  onClick={() => setCurrentSlideIndex(Math.max(0, currentSlideIndex - 1))}
                  disabled={currentSlideIndex === 0}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Предыдущий урок</span>
                </button>

                {currentSlideIndex < course.slides.length - 1 ? (
                  <button
                    onClick={() => setCurrentSlideIndex(currentSlideIndex + 1)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold text-white bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white transition-colors shadow-xs cursor-pointer"
                  >
                    <span>Следующий урок</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => setActiveTab('flashcards')}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-xs cursor-pointer"
                  >
                    <span>Закрепить карточками</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: FLASHCARDS */}
        {activeTab === 'flashcards' && (
          <div className="space-y-4">
            <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-zinc-900 dark:text-zinc-100">
                  Карточка {currentCardIndex + 1} из {course.flashcards.length}
                </span>
                <span className="text-zinc-400 ml-2">
                  (Изучено: {progress?.masteredFlashcardIds?.length || 0})
                </span>
              </div>
              <span className="text-zinc-500 dark:text-zinc-400">
                Нажмите на карточку для переворота
              </span>
            </div>

            {/* 3D Flip Card Container */}
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className="cursor-pointer select-none perspective-[1000px] w-full min-h-[300px] sm:min-h-[340px]"
            >
              <div
                className={`relative w-full h-full min-h-[300px] sm:min-h-[340px] rounded-2xl p-6 sm:p-8 transition-transform duration-500 preserve-3d border shadow-sm flex flex-col justify-between ${
                  isFlipped
                    ? 'bg-zinc-900 text-white border-zinc-700 dark:bg-zinc-950'
                    : 'bg-white text-zinc-900 border-zinc-200 dark:bg-zinc-900 dark:text-zinc-100 dark:border-zinc-800'
                }`}
              >
                {/* Header info */}
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                      isFlipped
                        ? 'bg-zinc-800 text-zinc-300'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300'
                    }`}
                  >
                    {currentCard.category}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 text-xs ${
                      isFlipped ? 'text-zinc-400' : 'text-zinc-400'
                    }`}
                  >
                    <RotateCw className="w-3.5 h-3.5 animate-spin-reverse" />
                    <span>{isFlipped ? 'Оборотная сторона' : 'Лицевая сторона'}</span>
                  </span>
                </div>

                {/* Card Main Body */}
                <div className="my-auto py-6">
                  {!isFlipped ? (
                    <div>
                      <span className="text-xs text-zinc-400 uppercase tracking-wider block mb-2 font-medium">
                        Термин / Ситуация:
                      </span>
                      <h3 className="text-xl sm:text-2xl font-bold tracking-tight leading-snug">
                        {currentCard.front}
                      </h3>
                      <p className="mt-4 text-xs text-zinc-400 font-medium">
                        Нажмите, чтобы увидеть правильный ответ и объяснение →
                      </p>
                    </div>
                  ) : (
                    <div>
                      <span className="text-xs text-emerald-400 uppercase tracking-wider block mb-2 font-medium">
                        Объяснение стандарта:
                      </span>
                      <p className="text-base sm:text-lg leading-relaxed font-normal text-zinc-100">
                        {currentCard.back}
                      </p>
                      {currentCard.proTip && (
                        <div className="mt-4 p-3 rounded-lg bg-zinc-800/80 border border-zinc-700 text-xs text-amber-300">
                          <strong>Совет консультанту: </strong>
                          {currentCard.proTip}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Footer hint */}
                <div className="text-center text-[11px] text-zinc-400 border-t border-zinc-200/40 dark:border-zinc-800 pt-3">
                  Тапните в любое место, чтобы перевернуть обратно
                </div>
              </div>
            </div>

            {/* Bottom Card Controls */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                onClick={() => {
                  setCurrentCardIndex(Math.max(0, currentCardIndex - 1));
                }}
                disabled={currentCardIndex === 0}
                className="inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg disabled:opacity-40 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Назад</span>
              </button>

              {/* Mastered toggle button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFlashcardMastered(course.id, currentCard.id);
                }}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  progress?.masteredFlashcardIds?.includes(currentCard.id)
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {progress?.masteredFlashcardIds?.includes(currentCard.id)
                    ? 'Усвоено'
                    : 'Отметить как усвоенное'}
                </span>
              </button>

              {currentCardIndex < course.flashcards.length - 1 ? (
                <button
                  onClick={() => {
                    setCurrentCardIndex(currentCardIndex + 1);
                  }}
                  className="inline-flex items-center gap-1 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white rounded-lg cursor-pointer"
                >
                  <span>Далее</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => setActiveTab('quiz')}
                  className="inline-flex items-center gap-1 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg cursor-pointer"
                >
                  <span>К тесту</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: QUIZ & POST-TEST */}
        {activeTab === 'quiz' && (
          <div className="space-y-6">
            {/* Cooldown Warning if user failed previously */}
            {isCooldown && !quizSubmitted && (
              <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-2xl p-5 text-amber-900 dark:text-amber-200">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-sm">
                      Тест временно заблокирован на 1 день (24 часа)
                    </h3>
                    <p className="mt-1 text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                      По правилам платформы G&M Group, при результате ниже {course.passThresholdPercent}%
                      дается 24 часа на повторение теоретического материала и закрепление карточек.
                      Следующая попытка будет доступна через ~{cooldownHours()} ч.
                    </p>
                    <div className="mt-3 flex items-center gap-2">
                      <button
                        onClick={() => setActiveTab('theory')}
                        className="px-3 py-1.5 text-xs font-semibold bg-amber-600 text-white rounded-lg hover:bg-amber-700 cursor-pointer"
                      >
                        Повторить теорию
                      </button>
                      {currentUser.role === 'super_admin' && (
                        <button
                          onClick={() => resetCourseCooldown(currentUser.id, course.id)}
                          className="px-3 py-1.5 text-xs font-semibold bg-zinc-800 text-zinc-200 rounded-lg hover:bg-black cursor-pointer"
                          title="Административный сброс блокировки для тестирования"
                        >
                          Сбросить таймер (Супер-Админ)
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Quiz Header Rules */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-lg">
                    Пост-тест по курсу
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                    Всего вопросов: {course.quiz.length} • Проходной балл: {course.passThresholdPercent}%
                  </p>
                </div>
                {progress?.passed && (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-700 dark:text-emerald-300 text-xs font-bold">
                    <Award className="w-4 h-4" />
                    <span>Сдано успешно ({progress.lastScorePercent}%)</span>
                  </div>
                )}
              </div>
            </div>

            {/* Quiz Result Banner if just submitted */}
            {quizSubmitted && quizResult && (
              <div
                className={`rounded-2xl p-6 border ${
                  quizResult.passed
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-100'
                    : 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-950 dark:text-rose-100'
                }`}
              >
                <div className="flex items-start gap-4">
                  {quizResult.passed ? (
                    <Award className="w-10 h-10 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-10 h-10 text-rose-600 dark:text-rose-400 shrink-0" />
                  )}
                  <div className="flex-1">
                    <h3 className="text-lg font-extrabold">
                      {quizResult.passed
                        ? 'Поздравляем! Вы успешно прошли аттестацию!'
                        : 'Тест не сдан. Требуется повторение материала.'}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed">
                      Ваш результат:{' '}
                      <strong className="text-base">{quizResult.scorePercent}%</strong> (проходной балл:{' '}
                      {course.passThresholdPercent}%).
                    </p>

                    {quizResult.passed ? (
                      <div className="mt-4 flex flex-wrap items-center gap-3">
                        {quizResult.certificateId && (
                          <button
                            onClick={() => onOpenCertificate(quizResult.certificateId!)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-sm transition-colors cursor-pointer"
                          >
                            <Award className="w-4 h-4" />
                            <span>Открыть именной сертификат</span>
                          </button>
                        )}
                        <span className="text-xs text-emerald-700 dark:text-emerald-300 font-medium">
                          +{course.pointsReward} баллов начислено в рейтинг!
                        </span>
                      </div>
                    ) : (
                      <div className="mt-3 text-xs text-rose-800 dark:text-rose-200">
                        Повторная попытка будет доступна через 24 часа. Ознакомьтесь с разбором правильных
                        ответов ниже.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Questions List */}
            <div className="space-y-5">
              {course.quiz.map((q, qIndex) => {
                const userChoices = selectedAnswers[q.id] || [];
                const isAnswered = userChoices.length > 0;

                return (
                  <div
                    key={q.id}
                    className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 sm:p-6"
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <span className="text-xs font-bold text-zinc-400">
                        Вопрос {qIndex + 1} из {course.quiz.length}
                      </span>
                      {q.isMultipleChoice ? (
                        <span className="text-[10px] font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded border border-indigo-200 dark:border-indigo-800">
                          Несколько вариантов
                        </span>
                      ) : (
                        <span className="text-[10px] text-zinc-400">
                          Один вариант
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100 leading-snug mb-4">
                      {q.question}
                    </h4>

                    {/* Options */}
                    <div className="space-y-2.5">
                      {q.options.map((opt) => {
                        const isSelected = userChoices.includes(opt.id);
                        const isCorrect = q.correctOptionIds.includes(opt.id);

                        let optionStyle =
                          'border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 bg-zinc-50/50 dark:bg-zinc-800/40 text-zinc-800 dark:text-zinc-200';

                        if (isSelected && !quizSubmitted) {
                          optionStyle =
                            'border-zinc-900 dark:border-white bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white font-semibold';
                        }

                        if (quizSubmitted) {
                          if (isCorrect) {
                            optionStyle =
                              'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-200 font-semibold';
                          } else if (isSelected && !isCorrect) {
                            optionStyle =
                              'border-rose-400 bg-rose-50 dark:bg-rose-950/50 text-rose-900 dark:text-rose-200';
                          }
                        }

                        return (
                          <div
                            key={opt.id}
                            onClick={() =>
                              handleOptionToggle(q.id, opt.id, q.isMultipleChoice)
                            }
                            className={`p-3.5 rounded-xl border transition-all flex items-start gap-3 cursor-pointer text-xs sm:text-sm ${optionStyle}`}
                          >
                            <div
                              className={`w-4 h-4 rounded mt-0.5 shrink-0 flex items-center justify-center border transition-colors ${
                                isSelected
                                  ? 'bg-zinc-900 dark:bg-white border-zinc-900 dark:border-white text-white dark:text-zinc-900'
                                  : 'border-zinc-400 dark:border-zinc-600'
                              }`}
                            >
                              {isSelected && <CheckCircle2 className="w-3 h-3" />}
                            </div>
                            <span className="leading-relaxed">{opt.text}</span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Question explanation if submitted */}
                    {quizSubmitted && (
                      <div className="mt-4 p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-700 dark:text-zinc-300">
                        <strong className="block font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
                          Разбор ответа:
                        </strong>
                        {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Quiz Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
              {!quizSubmitted ? (
                <button
                  onClick={handleQuizSubmit}
                  disabled={isCooldown && !progress?.passed}
                  className="w-full sm:w-auto px-6 py-3 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white text-white font-bold text-sm rounded-xl shadow-md transition-colors disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                >
                  Завершить тест и узнать результат
                </button>
              ) : (
                <div className="flex items-center gap-3 w-full justify-between">
                  <button
                    onClick={handleRetakeQuiz}
                    disabled={isCooldown && !quizResult?.passed}
                    className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg transition-colors cursor-pointer"
                  >
                    <RefreshCcw className="w-3.5 h-3.5" />
                    <span>Сбросить ответы и пройти заново</span>
                  </button>

                  {quizResult?.passed && quizResult.certificateId && (
                    <button
                      onClick={() => onOpenCertificate(quizResult.certificateId!)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-600 text-white text-xs font-bold rounded-lg hover:bg-amber-700 cursor-pointer"
                    >
                      <Award className="w-4 h-4" />
                      <span>Показать сертификат</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
