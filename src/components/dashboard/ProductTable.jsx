import React, { useState } from 'react';
import { RatingStars } from '../common/RatingStars';
import { formatCurrency, calculateOriginalPrice, getStockStatus, formatCategoryName } from '../../utils/formatters';
import { Eye, Edit2, Check, X, Scale, Printer } from 'lucide-react';

export function ProductTable({
  products = [],
  onSelectProduct,
  selectedIds = new Set(),
  onToggleSelect,
  onSelectAll,
  onUpdateProduct,
  comparedIds = [],
  onToggleCompare,
  onOpenPrintShelfTag,
}) {
  // Inline editing state
  const [editingCell, setEditingCell] = useState(null); // { id, field: 'price' | 'stock' }
  const [editValue, setEditValue] = useState('');

  const handleStartEdit = (product, field, e) => {
    e.stopPropagation();
    setEditingCell({ id: product.id, field });
    setEditValue(product[field]);
  };

  const handleSaveEdit = (id, field) => {
    if (!editingCell) return;
    const num = parseFloat(editValue);
    if (!isNaN(num)) {
      if (field === 'price') {
        onUpdateProduct && onUpdateProduct(id, { price: Number(num.toFixed(2)) });
      } else if (field === 'stock') {
        onUpdateProduct && onUpdateProduct(id, { stock: Math.max(0, parseInt(num, 10)) });
      }
    }
    setEditingCell(null);
  };

  const allSelectedOnPage = products.length > 0 && products.every(p => selectedIds.has(p.id));

  return (
    <div className="bg-white/95 dark:bg-[#111827]/75 backdrop-blur-xl rounded-2xl border border-slate-200/80 dark:border-white/5 overflow-hidden shadow-subtle">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200/80 dark:border-white/5 bg-slate-50/70 dark:bg-[#0c121e]/60 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
              {/* Checkbox Header */}
              <th className="py-3 px-3 w-10 text-center">
                <input
                  type="checkbox"
                  checked={allSelectedOnPage}
                  onChange={() => onSelectAll && onSelectAll(products.map(p => p.id))}
                  className="rounded border-slate-300 dark:border-slate-700 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  title="Select all on this page"
                />
              </th>
              <th className="py-3 px-4">Item Details</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Unit Pricing (Click to edit)</th>
              <th className="py-3 px-4">Stock (Click to edit)</th>
              <th className="py-3 px-4">Rating</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-xs">
            {products.map(product => {
              const {
                id,
                title,
                price,
                discountPercentage,
                rating,
                stock,
                brand,
                category,
                thumbnail,
                sku,
              } = product;

              const isSelected = selectedIds.has(id);
              const isCompared = comparedIds.includes(id);
              const originalPrice = calculateOriginalPrice(price, discountPercentage);
              const stockInfo = getStockStatus(stock);
              const stockPercentage = Math.min(100, Math.max(5, (stock / 100) * 100));

              const isEditingPrice = editingCell?.id === id && editingCell?.field === 'price';
              const isEditingStock = editingCell?.id === id && editingCell?.field === 'stock';

              return (
                <tr
                  key={id}
                  onClick={() => onSelectProduct(product)}
                  className={`transition-colors cursor-pointer group ${
                    isSelected
                      ? 'bg-indigo-50/50 dark:bg-indigo-950/20'
                      : 'hover:bg-slate-50/80 dark:hover:bg-white/[0.03]'
                  }`}
                >
                  {/* Row Checkbox */}
                  <td
                    onClick={e => e.stopPropagation()}
                    className="py-3 px-3 text-center"
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleSelect && onToggleSelect(id)}
                      className="rounded border-slate-300 dark:border-slate-700 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                    />
                  </td>

                  {/* Product Info */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-slate-50 dark:bg-[#0c121e] flex-shrink-0 overflow-hidden p-1 border border-slate-200/70 dark:border-white/10">
                        <img
                          src={thumbnail || 'https://via.placeholder.com/80'}
                          alt={title}
                          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <div className="min-w-0 max-w-xs sm:max-w-sm">
                        <div className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                          {title}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                          {brand && <span>{brand}</span>}
                          {brand && <span>•</span>}
                          <span className="font-mono">SKU: {sku || `#${id}`}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-3 px-4">
                    <span className="inline-flex px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-indigo-50/80 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60">
                      {formatCategoryName(category)}
                    </span>
                  </td>

                  {/* Pricing with Inline Editing */}
                  <td
                    className="py-3 px-4 whitespace-nowrap"
                    onClick={e => {
                      if (!isEditingPrice) handleStartEdit(product, 'price', e);
                    }}
                  >
                    {isEditingPrice ? (
                      <div
                        onClick={e => e.stopPropagation()}
                        className="flex items-center gap-1"
                      >
                        <span className="text-slate-400 font-mono">$</span>
                        <input
                          type="number"
                          step="0.01"
                          autoFocus
                          value={editValue}
                          onChange={e => setEditValue(e.target.value)}
                          onKeyDown={e => {
                            if (e.key === 'Enter') handleSaveEdit(id, 'price');
                            if (e.key === 'Escape') setEditingCell(null);
                          }}
                          className="w-20 px-1.5 py-0.5 rounded border border-indigo-500 font-mono text-xs bg-white dark:bg-slate-900 focus:outline-none"
                        />
                        <button
                          onClick={() => handleSaveEdit(id, 'price')}
                          className="p-1 rounded bg-indigo-600 text-white hover:bg-indigo-700"
                        >
                          <Check className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => setEditingCell(null)}
                          className="p-1 rounded text-slate-400 hover:text-slate-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="group/edit inline-flex items-center gap-1.5 hover:text-indigo-600 cursor-pointer">
                        <div>
                          <div className="font-heading font-extrabold text-slate-900 dark:text-white font-mono">
                            {formatCurrency(price)}
                          </div>
                          {discountPercentage > 0 && (
                            <div className="flex items-center gap-1 text-[10px]">
                              <span className="text-slate-400 line-through font-mono">
                                {formatCurrency(originalPrice)}
                              </span>
                              <span className="font-bold text-rose-600 dark:text-rose-400">
                                -{Math.round(discountPercentage)}%
                              </span>
                            </div>
                          )}
                        </div>
                        <Edit2 className="w-3 h-3 text-slate-300 opacity-0 group-hover/edit:opacity-100 transition-opacity" />
                      </div>
                    )}
                  </td>

                  {/* Stock Level with Inline Editing */}
                  <td
                    className="py-3 px-4 min-w-[140px]"
                    onClick={e => {
                      if (!isEditingStock) handleStartEdit(product, 'stock', e);
                    }}
                  >
                    {isEditingStock ? (
                      <div
                        onClick={e => e.stopPropagation()}
                        className="flex items-center gap-1"
                      >
                        <input
                          type="number"
                          autoFocus
                          value={editValue}
                          onChange={e => setEditValue(e.target.value)}
                          onKeyDown={e => {
                            if (e.key === 'Enter') handleSaveEdit(id, 'stock');
                            if (e.key === 'Escape') setEditingCell(null);
                          }}
                          className="w-16 px-1.5 py-0.5 rounded border border-indigo-500 font-mono text-xs bg-white dark:bg-slate-900 focus:outline-none"
                        />
                        <button
                          onClick={() => handleSaveEdit(id, 'stock')}
                          className="p-1 rounded bg-indigo-600 text-white hover:bg-indigo-700"
                        >
                          <Check className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => setEditingCell(null)}
                          className="p-1 rounded text-slate-400 hover:text-slate-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="group/edit space-y-1.5 cursor-pointer">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className={`inline-flex items-center gap-1 font-bold ${
                            stock === 0 ? 'text-rose-600 dark:text-rose-400' :
                            stock < 10 ? 'text-amber-600 dark:text-amber-400' :
                            'text-slate-700 dark:text-slate-300'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${stockInfo.dotClass}`} />
                            {stock} units
                          </span>
                          <Edit2 className="w-2.5 h-2.5 text-slate-300 opacity-0 group-hover/edit:opacity-100 transition-opacity ml-1" />
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              stock === 0 ? 'bg-rose-500' :
                              stock < 10 ? 'bg-amber-500' :
                              'bg-gradient-to-r from-emerald-500 to-teal-400'
                            }`}
                            style={{ width: `${stockPercentage}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </td>

                  {/* Rating */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <RatingStars rating={rating} reviewCount={product.reviews?.length} />
                  </td>

                  {/* Actions Column */}
                  <td className="py-3 px-4 text-right whitespace-nowrap" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1">
                      {/* Compare toggle */}
                      {onToggleCompare && (
                        <button
                          onClick={() => onToggleCompare(id)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            isCompared
                              ? 'bg-indigo-600 text-white'
                              : 'text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                          title={isCompared ? 'Remove from Compare' : 'Add to Compare'}
                        >
                          <Scale className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {/* Shelf Tag */}
                      {onOpenPrintShelfTag && (
                        <button
                          onClick={() => onOpenPrintShelfTag(product)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Print retail barcode shelf tag"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {/* Inspect details */}
                      <button
                        onClick={() => onSelectProduct(product)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 text-slate-700 dark:text-slate-300 font-bold text-[11px] transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        View
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
