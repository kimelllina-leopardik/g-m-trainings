import React from 'react';
import { BrandType } from '../types';

interface BrandBadgeProps {
  brand: BrandType;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const BrandBadge: React.FC<BrandBadgeProps> = ({
  brand,
  size = 'md',
  showLabel = true,
}) => {
  const getBadgeStyle = () => {
    switch (brand) {
      case 'La Cité':
        return {
          container: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200',
          dot: 'bg-amber-600',
          logoBg: 'bg-gradient-to-br from-amber-700 to-amber-900 text-amber-100',
          label: 'La Cité',
          sub: 'Parfumerie & Beauté',
        };
      case 'GEOX':
        return {
          container: 'bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800/60 text-sky-900 dark:text-sky-200',
          dot: 'bg-sky-600',
          logoBg: 'bg-gradient-to-br from-blue-700 to-slate-900 text-white',
          label: 'GEOX',
          sub: 'Respira',
        };
      case 'Yves Rocher':
        return {
          container: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-200',
          dot: 'bg-emerald-600',
          logoBg: 'bg-gradient-to-br from-emerald-600 to-teal-900 text-emerald-100',
          label: 'Yves Rocher',
          sub: 'Cosmétique Végétale',
        };
      default:
        return {
          container: 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200',
          dot: 'bg-slate-600',
          logoBg: 'bg-gradient-to-br from-slate-700 to-zinc-900 text-white',
          label: 'G&M Group',
          sub: 'Corporate Academy',
        };
    }
  };

  const style = getBadgeStyle();

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1.5',
    md: 'text-xs px-2.5 py-1 gap-2',
    lg: 'text-sm px-3 py-1.5 gap-2.5',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border shadow-2xs transition-colors ${style.container} ${sizeClasses[size]}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${style.dot}`} />
      <span className="font-semibold tracking-wide">{style.label}</span>
      {size === 'lg' && <span className="opacity-65 text-[11px]">| {style.sub}</span>}
    </span>
  );
};

export const BrandMonogram: React.FC<{ brand: BrandType; className?: string }> = ({
  brand,
  className = 'w-9 h-9',
}) => {
  switch (brand) {
    case 'La Cité':
      return (
        <div
          className={`${className} rounded-lg bg-gradient-to-br from-[#7D1D3F] via-[#5C132D] to-[#2E0815] text-[#F3E5AB] flex flex-col items-center justify-center font-serif shadow-xs border border-[#A23B5E]/30 select-none`}
          title="La Cité"
        >
          <span className="text-[11px] tracking-widest font-bold leading-none">LC</span>
          <span className="text-[7px] tracking-tighter opacity-80 mt-0.5 font-sans">PARIS</span>
        </div>
      );
    case 'GEOX':
      return (
        <div
          className={`${className} rounded-lg bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white flex flex-col items-center justify-center font-sans shadow-xs border border-sky-500/20 select-none`}
          title="GEOX Respira"
        >
          <span className="text-[10px] font-black tracking-wider leading-none">GEOX</span>
          <span className="text-[6px] tracking-widest text-sky-400 font-semibold mt-0.5">RESPIRA</span>
        </div>
      );
    case 'Yves Rocher':
      return (
        <div
          className={`${className} rounded-lg bg-gradient-to-br from-emerald-800 via-emerald-900 to-[#0c3121] text-emerald-100 flex flex-col items-center justify-center font-sans shadow-xs border border-emerald-500/30 select-none`}
          title="Yves Rocher"
        >
          <span className="text-[11px] font-extrabold tracking-tight leading-none text-emerald-200">YR</span>
          <span className="text-[6px] tracking-widest text-emerald-300 font-medium mt-0.5">BRETAGNE</span>
        </div>
      );
    default:
      return (
        <div
          className={`${className} rounded-lg bg-gradient-to-br from-zinc-800 via-zinc-900 to-black text-amber-300 flex flex-col items-center justify-center font-sans shadow-xs border border-zinc-700 select-none`}
          title="G&M Group"
        >
          <span className="text-[11px] font-black tracking-widest leading-none">G&M</span>
          <span className="text-[6px] tracking-widest text-zinc-400 uppercase mt-0.5">GROUP</span>
        </div>
      );
  }
};
