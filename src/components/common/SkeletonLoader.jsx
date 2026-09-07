import React from 'react';

export function SkeletonLoader({ viewMode = 'grid', count = 8 }) {
  if (viewMode === 'table') {
    return (
      <div className="w-full bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-subtle">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/40">
                <th className="py-3.5 px-4 text-xs font-semibold text-slate-400">PRODUCT</th>
                <th className="py-3.5 px-4 text-xs font-semibold text-slate-400">CATEGORY</th>
                <th className="py-3.5 px-4 text-xs font-semibold text-slate-400">PRICE</th>
                <th className="py-3.5 px-4 text-xs font-semibold text-slate-400">STOCK</th>
                <th className="py-3.5 px-4 text-xs font-semibold text-slate-400">RATING</th>
                <th className="py-3.5 px-4 text-xs font-semibold text-slate-400 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {[...Array(count)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-slate-200 dark:bg-slate-800 flex-shrink-0" />
                      <div className="space-y-1.5 flex-1">
                        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
                        <div className="h-3 bg-slate-100 dark:bg-slate-800/50 rounded w-1/3" />
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="h-6 w-20 bg-slate-200 dark:bg-slate-800 rounded-full" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="h-4 w-16 bg-slate-200 dark:bg-slate-800 rounded" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="h-5 w-24 bg-slate-200 dark:bg-slate-800 rounded-full" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="h-4 w-16 bg-slate-200 dark:bg-slate-800 rounded" />
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="h-8 w-20 bg-slate-200 dark:bg-slate-800 rounded-lg ml-auto" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // Grid view skeletons
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-subtle p-4 space-y-4 animate-pulse"
        >
          <div className="w-full aspect-[4/3] rounded-xl bg-slate-200 dark:bg-slate-800" />
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="h-3 w-20 bg-slate-100 dark:bg-slate-800/60 rounded" />
              <div className="h-5 w-16 bg-slate-200 dark:bg-slate-800 rounded-full" />
            </div>
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-5/6" />
            <div className="h-3 bg-slate-100 dark:bg-slate-800/50 rounded w-2/3" />
          </div>
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <div className="space-y-1">
              <div className="h-5 w-20 bg-slate-200 dark:bg-slate-800 rounded" />
              <div className="h-3 w-12 bg-slate-100 dark:bg-slate-800/40 rounded" />
            </div>
            <div className="h-8 w-24 bg-slate-200 dark:bg-slate-800 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}
