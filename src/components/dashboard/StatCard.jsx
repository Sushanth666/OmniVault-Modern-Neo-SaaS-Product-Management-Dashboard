import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendPositive = true,
  colorScheme = 'indigo',
}) {
  const colorThemes = {
    indigo: {
      glow: 'bg-indigo-500/5 dark:bg-indigo-500/10 group-hover:bg-indigo-500/15',
      iconBox: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400',
      valueHover: 'group-hover:text-indigo-600 dark:group-hover:text-indigo-400',
    },
    emerald: {
      glow: 'bg-emerald-500/5 dark:bg-emerald-500/10 group-hover:bg-emerald-500/15',
      iconBox: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400',
      valueHover: 'group-hover:text-emerald-600 dark:group-hover:text-emerald-400',
    },
    amber: {
      glow: 'bg-amber-500/5 dark:bg-amber-500/10 group-hover:bg-amber-500/15',
      iconBox: 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400',
      valueHover: 'group-hover:text-amber-600 dark:group-hover:text-amber-400',
    },
    rose: {
      glow: 'bg-rose-500/5 dark:bg-rose-500/10 group-hover:bg-rose-500/15',
      iconBox: 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400',
      valueHover: 'group-hover:text-rose-600 dark:group-hover:text-rose-400',
    },
  };

  const currentTheme = colorThemes[colorScheme] || colorThemes.indigo;

  return (
    <div className="bg-white/95 dark:bg-[#111827]/75 backdrop-blur-xl rounded-2xl border border-slate-200/80 dark:border-white/5 p-5 shadow-subtle hover-card-lift group cursor-default relative overflow-hidden flex flex-col justify-between h-full min-h-[144px]">
      {/* Subtle ambient glow on hover */}
      <div className={`absolute -top-10 -right-10 w-28 h-28 ${currentTheme.glow} rounded-full blur-2xl transition-all duration-500 pointer-events-none group-hover:scale-125`} />

      {/* Top Row: Title + Icon */}
      <div>
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 truncate">
            {title}
          </p>
          <div className={`p-2 rounded-xl ${currentTheme.iconBox} group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shrink-0 shadow-2xs`}>
            <Icon className="w-4 h-4" />
          </div>
        </div>

        {/* Middle Row: Primary Value (Uniform size across all cards) */}
        <div className="mt-2 mb-1">
          <div className={`font-heading text-2xl xl:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight font-mono ${currentTheme.valueHover} transition-colors duration-200`}>
            {value}
          </div>
        </div>
      </div>

      {/* Bottom Row: Subtitle + Aligned Trend Badge */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between gap-2 text-xs">
        <span
          className="text-slate-500 dark:text-slate-400 text-xs font-medium truncate flex-1 min-w-0"
          title={subtitle}
        >
          {subtitle}
        </span>
        {trend && (
          <span
            className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md font-mono shrink-0 whitespace-nowrap leading-none ${
              trendPositive
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60'
                : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-200/60 dark:border-rose-800/60'
            }`}
          >
            {trendPositive ? (
              <TrendingUp className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
            ) : (
              <TrendingDown className="w-3 h-3 text-rose-600 dark:text-rose-400 shrink-0" />
            )}
            <span className="leading-none">{trend}</span>
          </span>
        )}
      </div>
    </div>
  );
}
