import React, { useState, useEffect } from 'react';
import {
  X,
  Truck,
  Shield,
  RotateCcw,
  Box,
  Scale,
  QrCode,
  Tag,
  PackageCheck,
  Printer,
  Calculator,
  TrendingUp,
  DollarSign,
} from 'lucide-react';
import { RatingStars } from '../common/RatingStars';
import { formatCurrency, calculateOriginalPrice, getStockStatus, formatDate, formatCategoryName } from '../../utils/formatters';

export function ProductDetailModal(props) {
  if (!props.product) return null;
  return <ProductDetailModalContent {...props} />;
}

function ProductDetailModalContent({
  product,
  onClose,
  onOpenPrintShelfTag,
  onToggleCompare,
  isCompared = false,
}) {
  const {
    id,
    title,
    description,
    price,
    discountPercentage = 0,
    rating = 0,
    stock = 0,
    brand,
    category,
    sku,
    weight,
    dimensions,
    warrantyInformation,
    shippingInformation,
    availabilityStatus,
    reviews = [],
    returnPolicy,
    minimumOrderQuantity,
    meta,
    tags = [],
    images = [],
    thumbnail,
  } = product;

  const allImages = images.length > 0 ? images : [thumbnail || 'https://via.placeholder.com/400'];
  const [selectedImage, setSelectedImage] = useState(
    thumbnail || (images && images[0]) || ''
  );

  // Unit Economics & Profit Simulator State
  const [wholesaleCost, setWholesaleCost] = useState(
    Math.round((price || 20) * 0.45 * 100) / 100
  );
  const [shippingCost, setShippingCost] = useState(4.5);
  const [customDiscount, setCustomDiscount] = useState(Math.round(discountPercentage || 0));

  const effectivePrice = Math.max(0, (price || 0) * (1 - customDiscount / 100));
  const unitProfit = Math.max(0, effectivePrice - wholesaleCost - shippingCost);
  const grossMargin = effectivePrice > 0 ? (unitProfit / effectivePrice) * 100 : 0;
  const totalStockProfit = unitProfit * (stock || 0);

  const [activeImage, setActiveImage] = useState(allImages[0]);

  useEffect(() => {
    setActiveImage(allImages[0]);
  }, [product]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const originalPrice = calculateOriginalPrice(price, discountPercentage);
  const stockInfo = getStockStatus(stock);
  const savings = originalPrice > price ? originalPrice - price : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-4xl bg-white/95 dark:bg-[#0c121e]/95 backdrop-blur-2xl rounded-3xl border border-slate-200/80 dark:border-white/10 shadow-2xl overflow-hidden z-10 my-auto max-h-[92vh] flex flex-col transition-all animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-white/5 bg-slate-50/70 dark:bg-[#0c121e]/50">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60">
              {formatCategoryName(category)}
            </span>
            {brand && (
              <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                • {brand}
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
            title="Close modal (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Gallery Column */}
            <div className="md:col-span-5 space-y-3">
              <div className="relative aspect-square w-full rounded-2xl bg-slate-50 dark:bg-[#090d16]/60 border border-slate-100 dark:border-white/5 overflow-hidden flex items-center justify-center p-4">
                <img
                  src={activeImage}
                  alt={title}
                  className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
                />

                {discountPercentage > 0 && (
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-gradient-to-r from-rose-600 to-red-600 text-white font-black text-xs shadow-xs">
                    -{Math.round(discountPercentage)}% OFF
                  </span>
                )}
              </div>

              {/* Thumbnails */}
              {allImages.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {allImages.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(imgUrl)}
                      className={`relative w-16 h-16 rounded-xl bg-slate-50 dark:bg-[#090d16]/60 border overflow-hidden p-1 flex-shrink-0 transition-all ${
                        activeImage === imgUrl
                          ? 'border-indigo-600 ring-2 ring-indigo-500/20 shadow-xs'
                          : 'border-slate-200 dark:border-white/10 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={imgUrl} alt="" className="w-full h-full object-contain" />
                    </button>
                  ))}
                </div>
              )}

              {/* Barcode details */}
              {meta && (
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#090d16]/60 border border-slate-200/80 dark:border-white/5 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <QrCode className="w-4 h-4 text-slate-400" />
                    <span>Barcode: <strong className="text-slate-800 dark:text-slate-200 font-mono">{meta.barcode || 'N/A'}</strong></span>
                  </div>
                  {meta.qrCode && (
                    <a
                      href={meta.qrCode}
                      target="_blank"
                      rel="noreferrer"
                      className="text-indigo-600 dark:text-indigo-400 hover:underline text-[11px] font-semibold"
                    >
                      QR Code
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Specifications Column */}
            <div className="md:col-span-7 space-y-5">
              <div>
                <h2 className="font-heading text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white leading-tight">
                  {title}
                </h2>
                <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-400">
                  <span>SKU: <strong className="text-slate-700 dark:text-slate-300 font-mono">{sku || `#${id}`}</strong></span>
                  <span>•</span>
                  <span>Product ID: #{id}</span>
                </div>
              </div>

              {/* Rating & Stock */}
              <div className="flex flex-wrap items-center gap-3 py-2 border-y border-slate-100 dark:border-white/5">
                <RatingStars rating={rating} size="md" reviewCount={reviews.length} />

                <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />

                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${stockInfo.badgeClass}`}
                >
                  <span className={`w-2 h-2 rounded-full ${stockInfo.dotClass}`} />
                  {stockInfo.label}
                </span>

                {availabilityStatus && (
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Status: <strong className="text-slate-800 dark:text-slate-200">{availabilityStatus}</strong>
                  </span>
                )}
              </div>

              {/* Unit Price Display */}
              <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200/70 dark:border-indigo-900/40 flex items-center justify-between">
                <div>
                  <span className="text-xs text-indigo-700 dark:text-indigo-400 font-bold uppercase tracking-wider block mb-0.5">
                    Retail Unit Price
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="font-heading text-3xl font-extrabold text-slate-900 dark:text-white font-mono tracking-tight">
                      {formatCurrency(price)}
                    </span>
                    {discountPercentage > 0 && (
                      <span className="text-sm text-slate-400 line-through font-mono">
                        {formatCurrency(originalPrice)}
                      </span>
                    )}
                  </div>
                </div>

                {savings > 0 && (
                  <div className="text-right">
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold block">
                      Save {formatCurrency(savings)}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      MOQ: {minimumOrderQuantity || 1} units
                    </span>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                  Product Overview
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {description}
                </p>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {weight && (
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#090d16]/60 border border-slate-100 dark:border-white/5">
                    <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
                      <Scale className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                      <span>Weight</span>
                    </div>
                    <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
                      {weight} oz
                    </div>
                  </div>
                )}

                {dimensions && (
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#090d16]/60 border border-slate-100 dark:border-white/5">
                    <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
                      <Box className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                      <span>Dimensions</span>
                    </div>
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200 font-mono">
                      {dimensions.width} × {dimensions.height} × {dimensions.depth}
                    </div>
                  </div>
                )}

                {warrantyInformation && (
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#090d16]/60 border border-slate-100 dark:border-white/5">
                    <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
                      <Shield className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                      <span>Warranty</span>
                    </div>
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                      {warrantyInformation}
                    </div>
                  </div>
                )}

                {shippingInformation && (
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#090d16]/60 border border-slate-100 dark:border-white/5">
                    <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
                      <Truck className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                      <span>Shipping</span>
                    </div>
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                      {shippingInformation}
                    </div>
                  </div>
                )}

                {returnPolicy && (
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#090d16]/60 border border-slate-100 dark:border-white/5 col-span-2 sm:col-span-1">
                    <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
                      <RotateCcw className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                      <span>Returns</span>
                    </div>
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                      {returnPolicy}
                    </div>
                  </div>
                )}
              </div>

              {/* Tags */}
              {tags.length > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  <Tag className="w-3.5 h-3.5 text-slate-400" />
                  {tags.map(t => (
                    <span
                      key={t}
                      className="text-xs px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 font-medium"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* UNIT ECONOMICS & PROFIT MARGIN SIMULATOR */}
          <div className="p-5 rounded-2xl bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-200/80 dark:border-indigo-900/40 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                  <Calculator className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                    Unit Economics & Profit Margin Simulator
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Simulate real-time wholesale margins, packaging costs, and inventory net profits.
                  </p>
                </div>
              </div>

              <span className={`px-2.5 py-1 rounded-full text-xs font-bold font-mono border ${
                grossMargin >= 40
                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-300'
                  : grossMargin >= 20
                  ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border-amber-300'
                  : 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border-rose-300'
              }`}>
                {grossMargin.toFixed(1)}% Gross Margin
              </span>
            </div>

            {/* Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="space-y-1">
                <div className="flex justify-between font-semibold text-slate-600 dark:text-slate-400">
                  <span>Wholesale Cost</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">${wholesaleCost}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={Math.max(50, Math.round(price * 1.2))}
                  step="0.5"
                  value={wholesaleCost}
                  onChange={e => setWholesaleCost(parseFloat(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between font-semibold text-slate-600 dark:text-slate-400">
                  <span>Shipping & Pack</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">${shippingCost}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="25"
                  step="0.5"
                  value={shippingCost}
                  onChange={e => setShippingCost(parseFloat(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between font-semibold text-slate-600 dark:text-slate-400">
                  <span>Discount Off</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">{customDiscount}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="70"
                  step="1"
                  value={customDiscount}
                  onChange={e => setCustomDiscount(parseInt(e.target.value, 10))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>
            </div>

            {/* Output KPI Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 border-t border-indigo-200/60 dark:border-indigo-900/40">
              <div className="p-2.5 rounded-xl bg-white dark:bg-[#0c121e] border border-slate-200/80 dark:border-white/5">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Effective Price</span>
                <span className="font-heading font-extrabold text-sm text-slate-900 dark:text-white font-mono">
                  {formatCurrency(effectivePrice)}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-white dark:bg-[#0c121e] border border-slate-200/80 dark:border-white/5">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Net Profit / Unit</span>
                <span className="font-heading font-extrabold text-sm text-emerald-600 dark:text-emerald-400 font-mono">
                  +{formatCurrency(unitProfit)}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-white dark:bg-[#0c121e] border border-slate-200/80 dark:border-white/5">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Stocked Inventory Profit</span>
                <span className="font-heading font-extrabold text-sm text-slate-900 dark:text-white font-mono">
                  {formatCurrency(totalStockProfit)}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-white dark:bg-[#0c121e] border border-slate-200/80 dark:border-white/5">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Markup Multiple</span>
                <span className="font-heading font-extrabold text-sm text-indigo-600 dark:text-indigo-400 font-mono">
                  {(effectivePrice / (wholesaleCost || 1)).toFixed(2)}x Cost
                </span>
              </div>
            </div>
          </div>

          {/* Customer Reviews */}
          {reviews.length > 0 && (
            <div className="pt-6 border-t border-slate-100 dark:border-white/5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  Verified Buyer Reviews ({reviews.length})
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {reviews.map((rev, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-xl bg-slate-50 dark:bg-[#090d16]/60 border border-slate-100 dark:border-white/5 space-y-2 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <RatingStars rating={rev.rating} size="xs" showNumber={false} />
                        <span className="text-[10px] text-slate-400">
                          {formatDate(rev.date)}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 italic">
                        "{rev.comment}"
                      </p>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-slate-200/60 dark:border-white/5">
                      <div className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 flex items-center justify-center text-[10px] font-bold">
                        {rev.reviewerName?.charAt(0) || 'U'}
                      </div>
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">
                        {rev.reviewerName}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 dark:border-white/5 bg-slate-50/80 dark:bg-[#0c121e]/80">
          <div className="text-xs text-slate-400">
            Press <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono text-[10px]">Esc</kbd> to dismiss
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            >
              Close
            </button>
            {onOpenPrintShelfTag && (
              <button
                onClick={() => onOpenPrintShelfTag(product)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                title="Print retail barcode shelf tag"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Shelf Tag</span>
              </button>
            )}

            {onToggleCompare && (
              <button
                onClick={() => onToggleCompare(id)}
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                  isCompared
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <Scale className="w-3.5 h-3.5" />
                <span>{isCompared ? 'Compared' : 'Compare'}</span>
              </button>
            )}

            <button
              onClick={() => {
                alert(`Stock purchase order placed for ${title}!`);
              }}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 active:scale-95 text-white text-xs font-bold shadow-md shadow-indigo-500/20 transition-all"
            >
              Order Inventory Restock
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
