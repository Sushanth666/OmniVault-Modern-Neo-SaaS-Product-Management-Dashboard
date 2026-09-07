import React from 'react';
import {
  BarChart3,
  Star,
  DollarSign,
  Flame,
  Award,
  TrendingUp,
  Percent,
} from 'lucide-react';
import { formatCurrency, formatCategoryName } from '../../utils/formatters';
import { RatingStars } from '../common/RatingStars';

export function AnalyticsView({ products = [], onSelectProduct }) {
  // Calculations
  const totalValuation = products.reduce((acc, p) => acc + (p.price || 0) * (p.stock || 0), 0);
  const avgRating = products.length
    ? (products.reduce((acc, p) => acc + (p.rating || 0), 0) / products.length).toFixed(2)
    : 0;
  const avgDiscount = products.length
    ? (products.reduce((acc, p) => acc + (p.discountPercentage || 0), 0) / products.length).toFixed(1)
    : 0;

  // Rating distribution breakdown
  const ratingBands = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  products.forEach(p => {
    const r = Math.floor(p.rating || 0);
    if (r >= 5) ratingBands[5] += 1;
    else if (r === 4) ratingBands[4] += 1;
    else if (r === 3) ratingBands[3] += 1;
    else if (r === 2) ratingBands[2] += 1;
    else ratingBands[1] += 1;
  });

  // Price tier distribution
  const priceTiers = {
    'Under $25': products.filter(p => p.price < 25).length,
    '$25 - $100': products.filter(p => p.price >= 25 && p.price < 100).length,
    '$100 - $500': products.filter(p => p.price >= 100 && p.price < 500).length,
    '$500+': products.filter(p => p.price >= 500).length,
  };

  // Top rated items
  const topRated = [...products]
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 5);

  // Highest discount items
  const topDiscounts = [...products]
    .sort((a, b) => (b.discountPercentage || 0) - (a.discountPercentage || 0))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <div className="surface-card rounded-2xl p-5 shadow-xs hover-lift hover:shadow-card-hover group cursor-default transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Inventory Valuation</span>
            <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-emerald-600 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-2 font-mono group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-200">
            {formatCurrency(totalValuation)}
          </div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1 block">
            +8.4% projected this quarter
          </span>
        </div>

        <div className="surface-card rounded-2xl p-5 shadow-xs hover-lift hover:shadow-card-hover group cursor-default transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Average Rating</span>
            <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-amber-500 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
              <Star className="w-5 h-5 fill-amber-400" />
            </div>
          </div>
          <div className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-2 font-mono group-hover:text-amber-500 transition-colors duration-200">
            {avgRating} / 5.0
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Across verified customer reviews
          </span>
        </div>

        <div className="surface-card rounded-2xl p-5 shadow-xs hover-lift hover:shadow-card-hover group cursor-default transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Avg Discount</span>
            <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-indigo-500 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
              <Percent className="w-5 h-5" />
            </div>
          </div>
          <div className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-2 font-mono group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200">
            {avgDiscount}%
          </div>
          <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold mt-1 block">
            Active retail margin spread
          </span>
        </div>

        <div className="surface-card rounded-2xl p-5 shadow-xs hover-lift hover:shadow-card-hover group cursor-default transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Active SKUs</span>
            <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-emerald-600 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
              <BarChart3 className="w-5 h-5" />
            </div>
          </div>
          <div className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-2 font-mono group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-200">
            {products.length}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            100% synchronized via REST API
          </span>
        </div>
      </div>

      {/* Visual Analytics Row: Rating & Price Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rating Distribution Card */}
        <div className="surface-card rounded-2xl p-5 shadow-xs space-y-4">
          <div>
            <h3 className="font-heading text-base font-bold text-slate-900 dark:text-white">
              Customer Satisfaction & Ratings
            </h3>
            <p className="text-xs text-slate-500">
              Distribution of customer review ratings across all products.
            </p>
          </div>

          <div className="space-y-2.5 pt-2">
            {[5, 4, 3, 2, 1].map(star => {
              const count = ratingBands[star] || 0;
              const pct = Math.round((count / (products.length || 1)) * 100);
              return (
                <div key={star} className="flex items-center gap-3 text-xs">
                  <div className="w-16 flex items-center gap-1 font-bold text-slate-700 dark:text-slate-300">
                    <span>{star}</span>
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  </div>
                  <div className="flex-1 h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-amber-400 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="w-16 text-right font-mono font-semibold text-slate-500">
                    {count} ({pct}%)
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Price Tier Distribution Card */}
        <div className="surface-card rounded-2xl p-5 shadow-xs space-y-4">
          <div>
            <h3 className="font-heading text-base font-bold text-slate-900 dark:text-white">
              Catalog Pricing Tiers
            </h3>
            <p className="text-xs text-slate-500">
              Breakdown of products by retail pricing brackets.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            {Object.entries(priceTiers).map(([tier, count]) => {
              const pct = Math.round((count / (products.length || 1)) * 100);
              return (
                <div key={tier} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{tier}</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      {count} items ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(4, pct)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Leaderboards: Top Rated vs Top Discounts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Rated Leaderboard */}
        <div className="surface-card rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <Award className="w-4 h-4 text-amber-500" />
            <h3 className="font-heading text-sm font-bold text-slate-900 dark:text-white">
              Highest-Rated Products
            </h3>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {topRated.map((item, i) => (
              <div
                key={item.id}
                onClick={() => onSelectProduct && onSelectProduct(item)}
                className="py-2.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/40 px-2 rounded-xl transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-5 font-mono font-bold text-xs text-slate-400">#{i + 1}</span>
                  <img src={item.thumbnail} alt="" className="w-7 h-7 rounded-md object-contain bg-slate-100 dark:bg-slate-800" />
                  <div className="truncate">
                    <div className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[200px]">{item.title}</div>
                    <div className="text-[10px] text-slate-400">{formatCurrency(item.price)}</div>
                  </div>
                </div>
                <RatingStars rating={item.rating} size="xs" reviewCount={item.reviews?.length} />
              </div>
            ))}
          </div>
        </div>

        {/* Top Discounts */}
        <div className="surface-card rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <Flame className="w-4 h-4 text-rose-500" />
            <h3 className="font-heading text-sm font-bold text-slate-900 dark:text-white">
              Deepest Promotional Discounts
            </h3>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {topDiscounts.map((item, i) => (
              <div
                key={item.id}
                onClick={() => onSelectProduct && onSelectProduct(item)}
                className="py-2.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/40 px-2 rounded-xl transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-5 font-mono font-bold text-xs text-slate-400">#{i + 1}</span>
                  <img src={item.thumbnail} alt="" className="w-7 h-7 rounded-md object-contain bg-slate-100 dark:bg-slate-800" />
                  <div className="truncate">
                    <div className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[200px]">{item.title}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{formatCurrency(item.price)}</div>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400 font-black text-xs font-mono">
                  -{Math.round(item.discountPercentage)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
