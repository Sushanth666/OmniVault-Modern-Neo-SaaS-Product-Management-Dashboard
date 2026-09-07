import React from 'react';
import { X, Printer, QrCode, Tag, Check } from 'lucide-react';
import { formatCurrency, formatCategoryName } from '../../utils/formatters';

export function PrintShelfTagModal({ product, isOpen, onClose }) {
  if (!isOpen || !product) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
      />

      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 z-10 space-y-5 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Printer className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-heading text-base font-bold text-slate-900 dark:text-white">
                Retail Shelf Label Tag
              </h3>
              <p className="text-xs text-slate-400">
                2×3" barcode shelf tag preview
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Printable Shelf Tag Preview Card */}
        <div
          id="printable-shelf-tag"
          className="p-5 rounded-2xl bg-white border-2 border-dashed border-slate-300 text-slate-900 space-y-4 shadow-sm"
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                {formatCategoryName(product.category)}
              </span>
              <h4 className="font-heading font-extrabold text-base text-slate-900 mt-1 line-clamp-1">
                {product.title}
              </h4>
              <span className="text-[11px] text-slate-500 font-mono">
                SKU: {product.sku || `#${product.id}`}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Retail</span>
              <span className="font-heading font-extrabold text-2xl text-slate-900 font-mono">
                {formatCurrency(product.price)}
              </span>
            </div>
          </div>

          {/* Simulated Barcode */}
          <div className="py-2 px-3 rounded-lg bg-slate-50 border border-slate-200 text-center space-y-1">
            <div className="font-mono tracking-[0.25em] text-lg font-bold text-slate-800">
              ||| | |||| | || ||| || |||
            </div>
            <div className="text-[10px] font-mono text-slate-500">
              {product.meta?.barcode || '5784719087687'}
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-500 border-t border-slate-100 pt-2 font-mono">
            <span>AURA StoreOps • Shelf Tag</span>
            <span>MOQ: {product.minimumOrderQuantity || 1}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-colors"
          >
            <Printer className="w-4 h-4" />
            Print Shelf Tag
          </button>
        </div>
      </div>
    </div>
  );
}
