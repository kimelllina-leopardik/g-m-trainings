import React, { useRef } from 'react';
import { Certificate } from '../types';
import { BrandMonogram } from './BrandBadge';
import {
  X,
  Printer,
  ShieldCheck,
  Award,
  CheckCircle,
  Sparkles,
  Share2,
} from 'lucide-react';

interface CertificateModalProps {
  certificate: Certificate | null;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  certificate,
  onClose,
}) => {
  const printRef = useRef<HTMLDivElement>(null);

  if (!certificate) return null;

  const handlePrint = () => {
    window.print();
  };

  const getBrandAccent = () => {
    switch (certificate.courseBrand) {
      case 'La Cité':
        return {
          border: 'border-amber-700/40 dark:border-amber-500/40',
          gradient: 'from-amber-900/10 via-amber-700/5 to-transparent',
          sealColor: 'text-amber-700 dark:text-amber-400',
          label: 'La Cité • Parfumerie & Beauté',
        };
      case 'GEOX':
        return {
          border: 'border-blue-700/40 dark:border-blue-500/40',
          gradient: 'from-blue-900/10 via-blue-700/5 to-transparent',
          sealColor: 'text-blue-700 dark:text-blue-400',
          label: 'GEOX Respira • Italian Technology',
        };
      case 'Yves Rocher':
        return {
          border: 'border-emerald-700/40 dark:border-emerald-500/40',
          gradient: 'from-emerald-900/10 via-emerald-700/5 to-transparent',
          sealColor: 'text-emerald-700 dark:text-emerald-400',
          label: 'Yves Rocher • Cosmétique Végétale',
        };
      default:
        return {
          border: 'border-zinc-700/40 dark:border-zinc-500/40',
          gradient: 'from-zinc-900/10 via-zinc-700/5 to-transparent',
          sealColor: 'text-zinc-700 dark:text-zinc-300',
          label: 'G&M Group Corporate Academy',
        };
    }
  };

  const accent = getBrandAccent();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden my-auto">
        {/* Top bar controls (hidden in print) */}
        <div className="print:hidden flex items-center justify-between px-6 py-3.5 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
          <div className="flex items-center gap-2 text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Официальный электронный сертификат</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-zinc-800 dark:text-zinc-200 bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-lg border border-zinc-300 dark:border-zinc-700 transition-colors shadow-2xs cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Печать / Сохранить в PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Certificate Area */}
        <div ref={printRef} className="p-6 sm:p-10 bg-[#FAF9F5] dark:bg-zinc-950 print:bg-white text-zinc-900 dark:text-zinc-100">
          <div
            className={`relative p-6 sm:p-10 rounded-2xl border-4 ${accent.border} bg-white dark:bg-zinc-900 shadow-inner flex flex-col items-center text-center`}
          >
            {/* Corner Decorative Ornaments */}
            <div className="absolute top-3 left-3 text-xs opacity-40 font-serif">✦</div>
            <div className="absolute top-3 right-3 text-xs opacity-40 font-serif">✦</div>
            <div className="absolute bottom-3 left-3 text-xs opacity-40 font-serif">✦</div>
            <div className="absolute bottom-3 right-3 text-xs opacity-40 font-serif">✦</div>

            {/* Header / Brand */}
            <div className="flex items-center gap-3 mb-2">
              <BrandMonogram brand={certificate.courseBrand} className="w-12 h-12 shadow-sm" />
              <div className="text-left">
                <span className="font-serif font-black text-lg tracking-widest text-zinc-900 dark:text-zinc-100 uppercase">
                  G&M GROUP
                </span>
                <p className="text-[10px] tracking-widest text-zinc-500 uppercase">
                  Академия корпоративного обучения
                </p>
              </div>
            </div>

            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-zinc-400 to-transparent my-3" />

            {/* Certificate Title */}
            <span className="text-[11px] font-bold tracking-[0.25em] text-zinc-400 dark:text-zinc-500 uppercase">
              СЕРТИФИКАТ ОБ УСПЕШНОМ ОБУЧЕНИИ
            </span>
            <h1 className="mt-2 text-2xl sm:text-3xl font-serif font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
              CERTIFICATE OF COMPLETION
            </h1>

            <p className="mt-4 text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 max-w-md">
              Настоящим подтверждается, что сотрудник успешно освоил теоретическую программу,
              закрепил стандарты сервиса и сдал финальный квалификационный тест:
            </p>

            {/* Employee Full Name */}
            <div className="my-5 py-2 px-6 border-b-2 border-zinc-800 dark:border-zinc-200">
              <h2 className="text-xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                {certificate.userName}
              </h2>
            </div>

            {/* Course Title */}
            <div className="max-w-xl">
              <p className="text-xs text-zinc-400 uppercase tracking-wider">по программе курса:</p>
              <h3 className="mt-1 text-base sm:text-xl font-bold text-zinc-800 dark:text-zinc-200 leading-snug">
                «{certificate.courseTitle}»
              </h3>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                Направление: {certificate.courseBrand} • Локация: {certificate.storeLocation}
              </p>
            </div>

            {/* Score & Badge */}
            <div className="mt-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Результат пост-теста: {certificate.scorePercent}%</span>
              <span className="text-emerald-600 font-bold">• Статус: Аттестован</span>
            </div>

            {/* Signatures & Seal Section */}
            <div className="mt-8 w-full grid grid-cols-3 items-end pt-4 border-t border-zinc-200/80 dark:border-zinc-800 text-xs">
              {/* Date */}
              <div className="text-left">
                <span className="text-zinc-400 block text-[10px] uppercase">Дата выдачи:</span>
                <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                  {certificate.issuedAt}
                </span>
              </div>

              {/* Official Seal */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-16 h-16 rounded-full border-2 border-dashed ${accent.border} flex flex-col items-center justify-center select-none shadow-xs p-1`}
                >
                  <Award className={`w-6 h-6 ${accent.sealColor}`} />
                  <span className="text-[7px] font-bold tracking-tighter uppercase mt-0.5">
                    G&M VERIFIED
                  </span>
                </div>
              </div>

              {/* Signature & ID */}
              <div className="text-right">
                <span className="text-zinc-400 block text-[10px] uppercase">Руководитель обучения:</span>
                <span className="font-serif italic font-bold text-zinc-700 dark:text-zinc-300 text-sm">
                  G&M Academy / HR
                </span>
                <div className="mt-1 font-mono text-[10px] text-zinc-500 tracking-wider">
                  ID: {certificate.certificateId}
                </div>
              </div>
            </div>

            {/* Security Verification Bar */}
            <div className="mt-5 pt-3 border-t border-zinc-100 dark:border-zinc-800/80 w-full flex items-center justify-between text-[10px] text-zinc-400">
              <span className="font-mono">VERIFICATION HASH: {certificate.certificateId}</span>
              <span className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-emerald-500" />
                <span>Электронная подлинность подтверждена</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
