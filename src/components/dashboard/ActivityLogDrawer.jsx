import React, { useState } from 'react';
import {
  X,
  Clock,
  PackagePlus,
  DollarSign,
  Plus,
  Power,
  Download,
  Trash2,
  Filter,
  CheckCircle2,
} from 'lucide-react';

export function ActivityLogDrawer({
  isOpen,
  onClose,
  activities = [],
  onClearActivities,
}) {
  const [filterType, setFilterType] = useState('all');

  if (!isOpen) return null;

  const filtered = filterType === 'all'
    ? activities
    : activities.filter(a => a.type === filterType);

  const getIcon = (type) => {
    switch (type) {
      case 'restock':
        return <PackagePlus className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />;
      case 'price_change':
        return <DollarSign className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />;
      case 'create':
        return <Plus className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />;
      case 'api_toggle':
        return <Power className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />;
      case 'export':
        return <Download className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />;
      default:
        return <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 transition-opacity"
      />

      <aside className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-white dark:bg-[#0f172a] border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-heading text-base font-bold text-slate-900 dark:text-white">
                Store Operations Audit Log
              </h3>
              <p className="text-xs text-slate-400">
                Track real-time inventory and pricing changes
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="px-6 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar text-xs">
            {['all', 'restock', 'price_change', 'create', 'export'].map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors capitalize ${
                  filterType === type
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-2xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                {type === 'price_change' ? 'Pricing' : type}
              </button>
            ))}
          </div>

          {activities.length > 0 && (
            <button
              onClick={onClearActivities}
              className="text-[11px] font-semibold text-rose-500 hover:underline whitespace-nowrap"
            >
              Clear Log
            </button>
          )}
        </div>

        {/* Activity Timeline List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <Clock className="w-8 h-8 mx-auto opacity-40" />
              <p>No activity logs found for this filter.</p>
            </div>
          ) : (
            <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
              {filtered.map(item => (
                <div key={item.id} className="relative space-y-1">
                  {/* Timeline Dot */}
                  <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-white dark:bg-slate-900 border-2 border-emerald-500 flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  </div>

                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      {getIcon(item.type)}
                      {item.title}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {item.time || 'Just now'}
                    </span>
                  </div>

                  <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-center text-[11px] text-slate-400">
          Audited under AURA StoreOps Security Protocol
        </div>
      </aside>
    </>
  );
}
