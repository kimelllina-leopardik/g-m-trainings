import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Certificate } from '../types';
import { BrandBadge } from './BrandBadge';
import {
  ShieldCheck,
  Search,
  CheckCircle2,
  XCircle,
  X,
  Calendar,
  User,
  Store,
  Award,
} from 'lucide-react';

interface CertificateVerifyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCertificate: (certId: string) => void;
}

export const CertificateVerifyModal: React.FC<CertificateVerifyModalProps> = ({
  isOpen,
  onClose,
  onOpenCertificate,
}) => {
  const { findCertificate, certificates } = useApp();
  const [query, setQuery] = useState('');
  const [searched, setSearched] = useState(false);
  const [foundCert, setFoundCert] = useState<Certificate | null>(null);

  if (!isOpen) return null;

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;
    const cert = findCertificate(query);
    setFoundCert(cert || null);
    setSearched(true);
  };

  const handleSelectSample = (id: string) => {
    setQuery(id);
    const cert = findCertificate(id);
    setFoundCert(cert || null);
    setSearched(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-100">
      <div className="relative w-full max-w-lg bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 p-6 overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100">
            Верификация сертификата
          </h3>
        </div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">
          Проверка подлинности выданного сертификата сотрудника G&M Group в едином реестре.
        </p>

        {/* Search form */}
        <form onSubmit={handleSearch} className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSearched(false);
              }}
              placeholder="Введите номер, например GM-LC-2026-8941"
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Проверить
          </button>
        </form>

        {/* Quick Sample IDs */}
        {certificates.length > 0 && !searched && (
          <div className="mb-4">
            <span className="text-[11px] font-semibold text-zinc-400 block mb-1.5">
              Или выберите пример из реестра:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {certificates.slice(0, 3).map((c) => (
                <button
                  key={c.certificateId}
                  type="button"
                  onClick={() => handleSelectSample(c.certificateId)}
                  className="text-[11px] font-mono px-2 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-200 cursor-pointer"
                >
                  {c.certificateId}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search Results */}
        {searched && (
          <div>
            {foundCert ? (
              <div className="bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/80 rounded-xl p-4 text-xs">
                <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold mb-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span className="text-sm">Сертификат действителен и подтвержден</span>
                </div>

                <div className="space-y-2 text-zinc-700 dark:text-zinc-300">
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-zinc-400" />
                    <span className="text-zinc-500">Сотрудник:</span>
                    <strong className="text-zinc-900 dark:text-zinc-100">{foundCert.userName}</strong>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-3.5 h-3.5 text-zinc-400" />
                    <span className="text-zinc-500">Курс:</span>
                    <strong className="text-zinc-900 dark:text-zinc-100">{foundCert.courseTitle}</strong>
                  </div>
                  <div className="flex items-center gap-2">
                    <Store className="w-3.5 h-3.5 text-zinc-400" />
                    <span className="text-zinc-500">Бутик:</span>
                    <span>{foundCert.storeLocation}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                    <span className="text-zinc-500">Дата выдачи:</span>
                    <span>{foundCert.issuedAt}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between">
                  <BrandBadge brand={foundCert.courseBrand} size="sm" />
                  <button
                    onClick={() => {
                      onClose();
                      onOpenCertificate(foundCert.certificateId);
                    }}
                    className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 hover:underline cursor-pointer"
                  >
                    Открыть оригинал →
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/80 rounded-xl p-4 text-xs text-rose-900 dark:text-rose-200 flex items-start gap-3">
                <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm">Сертификат не найден</h4>
                  <p className="mt-1 text-zinc-600 dark:text-zinc-300 text-xs">
                    Сертификат с номером «{query}» не зарегистрирован в базе данных G&M Group LMS.
                    Проверьте правильность написания символов.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
