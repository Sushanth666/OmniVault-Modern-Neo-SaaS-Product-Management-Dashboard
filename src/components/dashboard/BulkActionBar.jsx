import React, { useState, useRef, useEffect } from 'react';
import {
  CheckSquare,
  PackagePlus,
  Percent,
  Download,
  Trash2,
  X,
  Scale,
  FileSpreadsheet,
  Code2,
  FileText,
  ChevronUp,
} from 'lucide-react';
import {
  exportProductsToCSV,
  exportProductsToJSON,
  exportProductsToPDF,
} from '../../utils/exportUtils';

export function BulkActionBar({
  selectedIds = new Set(),
  allProducts = [],
  onClearSelection,
  onBulkRestock,
  onBulkDiscount,
  onBulkDelete,
  onOpenCompare,
}) {
  const [showExportMenu, setShowExportMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowExportMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!selectedIds.size) return null;

  const count = selectedIds.size;
  const selectedList = allProducts.filter(p => selectedIds.has(p.id));

  return (
    <div className="fixed bottom-6 inset-x-4 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 z-40 animate-in fade-in slide-in-from-bottom-5 duration-200">
      <div className="bg-white/95 dark:bg-slate-900/95 text-slate-900 dark:text-white rounded-2xl p-2.5 sm:p-3 shadow-2xl border border-slate-200 dark:border-slate-800 backdrop-blur-md flex items-center gap-2 sm:gap-3 flex-wrap sm:flex-nowrap relative">
        {/* Count Indicator */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/60 text-xs font-bold font-mono">
          <CheckSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>{count} selected</span>
        </div>

        <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block" />

        {/* Action: Bulk Restock */}
        <button
          onClick={() => {
            onBulkRestock([...selectedIds], 25);
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs shadow-xs transition-all"
        >
          <PackagePlus className="w-3.5 h-3.5" />
          <span>+25 Units</span>
        </button>

        {/* Action: Flash Discount */}
        <button
          onClick={() => {
            onBulkDiscount([...selectedIds], 15);
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-bold text-xs transition-colors"
        >
          <Percent className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
          <span>Set 15% Off</span>
        </button>

        {/* Action: Export Dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowExportMenu(prev => !prev)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-bold text-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Export ({count})</span>
            <ChevronUp className="w-3 h-3 text-slate-400" />
          </button>

          {showExportMenu && (
            <div className="absolute bottom-full mb-2 left-0 w-52 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 shadow-2xl py-1.5 text-xs z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800 mb-1">
                Export Selected ({count})
              </div>
              <button
                onClick={() => {
                  setShowExportMenu(false);
                  exportProductsToCSV(selectedList, `selected_${count}_products.csv`);
                }}
                className="w-full text-left px-3 py-2 flex items-center gap-2 hover:bg-emerald-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Export as CSV</span>
              </button>
              <button
                onClick={() => {
                  setShowExportMenu(false);
                  exportProductsToJSON(selectedList, `selected_${count}_products.json`);
                }}
                className="w-full text-left px-3 py-2 flex items-center gap-2 hover:bg-blue-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors"
              >
                <Code2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>Export as JSON</span>
              </button>
              <button
                onClick={() => {
                  setShowExportMenu(false);
                  exportProductsToPDF(selectedList, `Selected Products Report (${count} Items)`);
                }}
                className="w-full text-left px-3 py-2 flex items-center gap-2 hover:bg-rose-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors"
              >
                <FileText className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                <span>Export as PDF Report</span>
              </button>
            </div>
          )}
        </div>

        {/* Action: Compare Selected (if 2 to 4 selected) */}
        {count >= 2 && count <= 4 && onOpenCompare && (
          <button
            onClick={() => onOpenCompare([...selectedIds])}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs shadow-xs transition-all"
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Compare ({count})</span>
          </button>
        )}

        {/* Action: Bulk Delete */}
        <button
          onClick={() => {
            if (window.confirm(`Are you sure you want to remove ${count} products?`)) {
              onBulkDelete([...selectedIds]);
            }
          }}
          className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 dark:hover:text-rose-400 transition-colors"
          title="Delete selected items"
        >
          <Trash2 className="w-4 h-4" />
        </button>

        {/* Clear selection */}
        <button
          onClick={onClearSelection}
          className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ml-auto sm:ml-0"
          title="Deselect all"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
