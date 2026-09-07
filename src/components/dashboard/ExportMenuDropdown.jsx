import React, { useState, useRef, useEffect } from 'react';
import { Download, ChevronDown, FileText, Code2, FileSpreadsheet } from 'lucide-react';

export function ExportMenuDropdown({ onExportCSV, onExportJSON, onExportPDF, buttonLabel = 'Export' }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        id="btn-export-dropdown-toggle"
        onClick={() => setIsOpen(prev => !prev)}
        className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-semibold transition-colors shadow-2xs"
        title="Export data as CSV, JSON, or PDF"
      >
        <Download className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
        <span>{buttonLabel}</span>
        <ChevronDown className="w-3 h-3 text-slate-400 ml-0.5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800">
            Export Format
          </div>

          {/* CSV Option */}
          <button
            id="btn-export-csv"
            onClick={() => {
              setIsOpen(false);
              onExportCSV && onExportCSV();
            }}
            className="w-full text-left px-3 py-2 text-xs flex items-center gap-2.5 text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
          >
            <div className="w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <FileSpreadsheet className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="font-bold">Export as CSV (.csv)</div>
              <div className="text-[10px] text-slate-400">Excel & Google Sheets</div>
            </div>
          </button>

          {/* JSON Option */}
          <button
            id="btn-export-json"
            onClick={() => {
              setIsOpen(false);
              onExportJSON && onExportJSON();
            }}
            className="w-full text-left px-3 py-2 text-xs flex items-center gap-2.5 text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
          >
            <div className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Code2 className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="font-bold">Export as JSON (.json)</div>
              <div className="text-[10px] text-slate-400">Raw REST catalog schema</div>
            </div>
          </button>

          {/* PDF Option */}
          <button
            id="btn-export-pdf"
            onClick={() => {
              setIsOpen(false);
              onExportPDF && onExportPDF();
            }}
            className="w-full text-left px-3 py-2 text-xs flex items-center gap-2.5 text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
          >
            <div className="w-6 h-6 rounded-lg bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <FileText className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="font-bold">Export as PDF (.pdf)</div>
              <div className="text-[10px] text-slate-400">Printable Executive Report</div>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
