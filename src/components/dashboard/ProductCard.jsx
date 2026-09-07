import React from 'react';
import { RatingStars } from '../common/RatingStars';
import { formatCurrency, calculateOriginalPrice, getStockStatus, formatCategoryName } from '../../utils/formatters';
import { Eye, ArrowUpRight, Scale } from 'lucide-react';

export function ProductCard({
  product,
  onSelect,
  isSelected = false,
  onToggleSelect,
  isCompared = false,
  onToggleCompare,
}) {
  const {
    id,
    title,
    description,
    price,
    discountPercentage,
    rating,
    stock,
    brand,
    category,
    thumbnail,
    images,
  } = product;

  const originalPrice = calculateOriginalPrice(price, discountPercentage);
  const stockInfo = getStockStatus(stock);
  const displayImage = thumbnail || (images && images[0]) || 'https://via.placeholder.com/300';

  return (
    <div
      onClick={() => onSelect(product)}
      className={`group relative flex flex-col bg-white/95 dark:bg-[#111827]/75 backdrop-blur-xl rounded-2xl border border-slate-200/80 dark:border-white/5 overflow-hidden shadow-subtle hover:shadow-card-hover hover:-translate-y-1.5 transition-all duration-300 ease-out cursor-pointer ${
        isSelected
          ? 'ring-2 ring-indigo-500 border-indigo-500/50'
          : 'hover:border-indigo-500/40 dark:hover:border-indigo-500/30'
      }`}
    >
      {/* Product Image Stage */}
      <div className="relative aspect-[4/3] w-full bg-slate-50 dark:bg-[#0c121e]/80 overflow-hidden flex items-center justify-center p-3 border-b border-slate-100 dark:border-white/5">
        <img
          src={displayImage}
          alt={title}
          loading="lazy"
          className="w-full h-full object-contain transition-transform duration-500 ease-out group-hover:scale-108"
        />

        {/* Top Controls: Checkbox & Discount Badge */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-10">
          {onToggleSelect && (
            <div
              onClick={e => {
                e.stopPropagation();
                onToggleSelect(id);
              }}
              className="p-1 rounded-lg bg-white/90 dark:bg-[#090d16]/90 shadow-2xs cursor-pointer flex items-center justify-center"
              title="Select product"
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => {}}
                className="rounded border-slate-300 dark:border-slate-700 text-indigo-600 focus:ring-indigo-500 cursor-pointer w-3.5 h-3.5"
              />
            </div>
          )}

          {discountPercentage > 0 && (
            <div className="px-2 py-0.5 rounded-md bg-gradient-to-r from-rose-600 to-red-600 text-white font-black text-[10px] tracking-tight shadow-xs">
              -{Math.round(discountPercentage)}%
            </div>
          )}
        </div>

        {/* Stock Status Chip */}
        <div className="absolute top-2.5 right-2.5">
          <span
            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold border backdrop-blur-xs ${stockInfo.badgeClass}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${stockInfo.dotClass}`} />
            {stockInfo.label}
          </span>
        </div>

        {/* Hover Inspect Overlay */}
        <div className="absolute inset-0 bg-slate-900/15 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold text-xs shadow-md transform translate-y-1 group-hover:translate-y-0 transition-transform">
            <Eye className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            Quick Inspect
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Category & Brand */}
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              {formatCategoryName(category)}
            </span>
            {brand && (
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium truncate max-w-[110px]">
                {brand}
              </span>
            )}
          </div>

          {/* Product Title */}
          <h3
            className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors"
            title={title}
          >
            {title}
          </h3>

          {/* Description snippet */}
          <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Ratings & SKU */}
        <div className="pt-2 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
          <RatingStars rating={rating} reviewCount={product.reviews?.length} />
          <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
            {product.sku ? product.sku.slice(-6) : `#${id}`}
          </span>
        </div>

        {/* Pricing & Actions */}
        <div className="pt-2 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-heading text-lg font-extrabold text-slate-900 dark:text-white font-mono tracking-tight">
                {formatCurrency(price)}
              </span>
              {discountPercentage > 0 && (
                <span className="text-[11px] text-slate-400 line-through font-mono">
                  {formatCurrency(originalPrice)}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
            {onToggleCompare && (
              <button
                onClick={() => onToggleCompare(id)}
                className={`p-2 rounded-xl transition-colors ${
                  isCompared
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-white/5 hover:text-indigo-600 text-slate-500'
                }`}
                title={isCompared ? 'Remove from Compare' : 'Add to Compare'}
              >
                <Scale className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              onClick={() => onSelect(product)}
              className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-indigo-600 dark:hover:bg-indigo-600 text-slate-600 dark:text-slate-300 hover:text-white dark:hover:text-white transition-all duration-200 active:scale-95 group/btn"
              title="Inspect Details"
            >
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
