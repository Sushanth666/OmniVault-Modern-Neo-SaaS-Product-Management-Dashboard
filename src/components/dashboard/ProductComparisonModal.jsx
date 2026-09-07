import React from 'react';
import { X, Scale, Star, Truck, Shield, RotateCcw, Box, Check } from 'lucide-react';
import { formatCurrency, formatCategoryName } from '../../utils/formatters';
import { RatingStars } from '../common/RatingStars';

export function ProductComparisonModal({
  isOpen,
  onClose,
  comparedProducts = [],
  onRemoveProduct,
}) {
  if (!isOpen || !comparedProducts.length) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
      />

      <div className="relative w-full max-w-5xl bg-white dark:bg-[#0f172a] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden z-10 my-auto flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-heading text-base font-bold text-slate-900 dark:text-white">
                Side-by-Side Product Comparison
              </h3>
              <p className="text-xs text-slate-400">
                Comparing {comparedProducts.length} items side-by-side
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Table Area */}
        <div className="overflow-x-auto p-6">
          <table className="w-full text-left border-collapse min-w-[600px] text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800">
                <th className="py-3 px-3 text-slate-400 uppercase text-[10px] font-bold w-36">Metric / Field</th>
                {comparedProducts.map(p => (
                  <th key={p.id} className="py-3 px-3 text-left w-64">
                    <div className="flex items-center justify-between pb-2">
                      <span className="font-mono text-[10px] text-slate-400">SKU: {p.sku || `#${p.id}`}</span>
                      <button
                        onClick={() => onRemoveProduct && onRemoveProduct(p.id)}
                        className="text-slate-400 hover:text-rose-500 text-[11px] p-0.5"
                        title="Remove from comparison"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="aspect-square w-full rounded-2xl bg-slate-50 dark:bg-slate-800 p-3 mb-2 flex items-center justify-center border border-slate-100 dark:border-slate-800">
                      <img src={p.thumbnail} alt="" className="w-full h-full object-contain" />
                    </div>
                    <div className="font-heading font-bold text-sm text-slate-900 dark:text-white line-clamp-1">{p.title}</div>
                    <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">{formatCategoryName(p.category)}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              <tr>
                <td className="py-3 px-3 font-bold text-slate-400">Retail Price</td>
                {comparedProducts.map(p => (
                  <td key={p.id} className="py-3 px-3 font-heading font-extrabold text-base text-slate-900 dark:text-white font-mono">
                    {formatCurrency(p.price)}
                    {p.discountPercentage > 0 && (
                      <span className="ml-1.5 text-[11px] text-rose-500 font-bold">(-{Math.round(p.discountPercentage)}%)</span>
                    )}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="py-3 px-3 font-bold text-slate-400">Customer Rating</td>
                {comparedProducts.map(p => (
                  <td key={p.id} className="py-3 px-3">
                    <RatingStars rating={p.rating} reviewCount={p.reviews?.length} />
                  </td>
                ))}
              </tr>

              <tr>
                <td className="py-3 px-3 font-bold text-slate-400">Warehouse Stock</td>
                {comparedProducts.map(p => (
                  <td key={p.id} className="py-3 px-3 font-mono font-bold text-slate-800 dark:text-slate-200">
                    <span className={p.stock < 10 ? 'text-amber-500' : 'text-emerald-600 dark:text-emerald-400'}>
                      {p.stock} units
                    </span>
                  </td>
                ))}
              </tr>

              <tr>
                <td className="py-3 px-3 font-bold text-slate-400">Brand / Maker</td>
                {comparedProducts.map(p => (
                  <td key={p.id} className="py-3 px-3 font-medium text-slate-700 dark:text-slate-300">
                    {p.brand || 'Unbranded'}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="py-3 px-3 font-bold text-slate-400">Warranty</td>
                {comparedProducts.map(p => (
                  <td key={p.id} className="py-3 px-3 text-slate-600 dark:text-slate-300">
                    {p.warrantyInformation || 'Standard manufacturer warranty'}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="py-3 px-3 font-bold text-slate-400">Shipping Info</td>
                {comparedProducts.map(p => (
                  <td key={p.id} className="py-3 px-3 text-slate-600 dark:text-slate-300">
                    {p.shippingInformation || 'Standard 3-5 days'}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="py-3 px-3 font-bold text-slate-400">Return Policy</td>
                {comparedProducts.map(p => (
                  <td key={p.id} className="py-3 px-3 text-slate-600 dark:text-slate-300">
                    {p.returnPolicy || '30 days standard'}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="py-3 px-3 font-bold text-slate-400">Dimensions (W×H×D)</td>
                {comparedProducts.map(p => (
                  <td key={p.id} className="py-3 px-3 font-mono text-slate-600 dark:text-slate-300">
                    {p.dimensions ? `${p.dimensions.width} × ${p.dimensions.height} × ${p.dimensions.depth}` : 'N/A'}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800"
          >
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  );
}
