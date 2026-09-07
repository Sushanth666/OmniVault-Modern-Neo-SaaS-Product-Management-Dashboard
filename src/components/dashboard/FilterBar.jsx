import React, { useState } from 'react';
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  LayoutGrid,
  Table as TableIcon,
  RotateCcw,
  ChevronDown,
  DollarSign,
  X,
  Flame,
  Gem,
  Tag,
  Sparkles,
  Layers,
  Filter,
} from 'lucide-react';
import { formatCategoryName } from '../../utils/formatters';
import { ExportMenuDropdown } from './ExportMenuDropdown';

export function FilterBar({
  search,
  setSearch,
  category,
  setCategory,
  categories = [],
  segment = 'all',
  setSegment,
  priceRange,
  setPriceRange,
  maxPrice = 2000,
  sortBy,
  setSortBy,
  viewMode,
  setViewMode,
  hasActiveFilters,
  onResetFilters,
  totalFilteredCount,
  totalCatalogCount,
  onExportCSV,
  onExportJSON,
  onExportPDF,
}) {
  const [showPriceSlider, setShowPriceSlider] = useState(false);

  const pricePresets = [
    { label: 'All', range: [0, maxPrice] },
    { label: '< $25', range: [0, 25] },
    { label: '$25 - $100', range: [25, 100] },
    { label: '$100 - $500', range: [100, 500] },
    { label: '$500+', range: [500, maxPrice] },
  ];

  const isPresetActive = (presetRange) => {
    return priceRange[0] === presetRange[0] && priceRange[1] === presetRange[1];
  };

  const pillCategories = [
    { slug: 'all', name: 'All Categories' },
    ...categories.slice(0, 12).map(c => ({
      slug: typeof c === 'string' ? c : c.slug,
      name: typeof c === 'string' ? formatCategoryName(c) : c.name,
    })),
  ];

  const segments = [
    { id: 'all', label: 'All Products', icon: Sparkles, badge: '✨' },
    { id: 'understocked', label: 'Understocked Best-Sellers', icon: Flame, badge: '🔥' },
    { id: 'high-margin', label: 'High-Margin Items', icon: Gem, badge: '💎' },
    { id: 'clearance', label: 'Clearance Deals', icon: Tag, badge: '🏷️' },
  ];

  return (
    <div className="bg-white/90 dark:bg-[#111827]/75 backdrop-blur-xl rounded-3xl border border-slate-200/80 dark:border-white/5 shadow-subtle p-4 sm:p-5 space-y-4 hover:border-indigo-500/20 transition-all duration-200">
      {/* ROW 1: Sleek Unified Command & Control Bar */}
      <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1 group">
          <Search className="w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-200" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by title, brand, description, or SKU..."
            className="w-full pl-10 pr-9 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-[#0c121e]/80 hover:bg-slate-100/70 dark:hover:bg-[#0c121e] focus:bg-white dark:focus:bg-[#090d16] text-slate-900 dark:text-slate-100 rounded-2xl border border-slate-200/80 dark:border-white/10 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all duration-200 placeholder:text-slate-400"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Action Controls Group */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          {/* Category Dropdown */}
          <div className="relative min-w-[155px] flex-1 sm:flex-none">
            <Layers className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full appearance-none pl-8 pr-7 py-2.5 text-xs font-bold bg-slate-50 dark:bg-[#0c121e]/80 hover:bg-slate-100 dark:hover:bg-[#0c121e] text-slate-800 dark:text-slate-200 rounded-2xl border border-slate-200/80 dark:border-white/10 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all cursor-pointer truncate"
            >
              <option value="all">All Categories ({totalCatalogCount})</option>
              {categories.map(cat => {
                const slug = typeof cat === 'string' ? cat : cat.slug;
                const name = typeof cat === 'string' ? formatCategoryName(cat) : cat.name;
                return (
                  <option key={slug} value={slug}>
                    {name}
                  </option>
                );
              })}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Sort Dropdown */}
          <div className="relative min-w-[145px] flex-1 sm:flex-none">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="w-full appearance-none pl-8 pr-7 py-2.5 text-xs font-bold bg-slate-50 dark:bg-[#0c121e]/80 hover:bg-slate-100 dark:hover:bg-[#0c121e] text-slate-800 dark:text-slate-200 rounded-2xl border border-slate-200/80 dark:border-white/10 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all cursor-pointer truncate"
            >
              <option value="featured">Sort: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating-desc">Rating: High to Low</option>
              <option value="rating-asc">Rating: Low to High</option>
              <option value="discount-desc">Highest Discount</option>
              <option value="title-asc">Title: A to Z</option>
              <option value="stock-low">Stock: Low to High</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Price Range Button */}
          <button
            onClick={() => setShowPriceSlider(prev => !prev)}
            className={`inline-flex items-center gap-1.5 px-3 py-2.5 rounded-2xl border text-xs font-bold transition-all active:scale-95 ${
              showPriceSlider || priceRange[0] > 0 || priceRange[1] < maxPrice
                ? 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-300 dark:border-indigo-800 text-indigo-700 dark:text-indigo-400 shadow-2xs'
                : 'bg-slate-50 dark:bg-[#0c121e]/80 border-slate-200/80 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
            }`}
            title="Filter by price range"
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Price</span>
            {(priceRange[0] > 0 || priceRange[1] < maxPrice) && (
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
            )}
          </button>

          {/* Export Dropdown with CSV, JSON, and PDF */}
          <ExportMenuDropdown
            onExportCSV={onExportCSV}
            onExportJSON={onExportJSON}
            onExportPDF={onExportPDF}
          />

          {/* View Toggle: Grid vs Table */}
          <div className="flex items-center p-1 bg-slate-100 dark:bg-[#0c121e] rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-2xs">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-xl transition-all active:scale-95 ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-[#1f293d] text-indigo-600 dark:text-indigo-400 shadow-xs font-bold'
                  : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
              title="Showroom Card View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-xl transition-all active:scale-95 ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-[#1f293d] text-indigo-600 dark:text-indigo-400 shadow-xs font-bold'
                  : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
              title="High-Speed Table View"
            >
              <TableIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ROW 2: Curated Smart Merchandising Segment Rail */}
      <div className="p-1 rounded-2xl bg-slate-100/80 dark:bg-[#0c121e]/80 border border-slate-200/60 dark:border-white/5 flex items-center gap-1 overflow-x-auto no-scrollbar">
        <div className="px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 whitespace-nowrap flex items-center gap-1 hidden sm:flex">
          <Filter className="w-3 h-3" />
          <span>Segments:</span>
        </div>
        {segments.map(seg => {
          const isSelected = segment === seg.id;
          return (
            <button
              key={seg.id}
              onClick={() => setSegment && setSegment(seg.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl whitespace-nowrap text-xs font-bold transition-all active:scale-95 ${
                isSelected
                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-sm shadow-indigo-500/25'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/5'
              }`}
            >
              <span>{seg.badge}</span>
              <span>{seg.label}</span>
            </button>
          );
        })}
      </div>

      {/* ROW 3: Horizontal Category Quick-Selector */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar text-xs border-t border-slate-100 dark:border-white/5">
        {pillCategories.map(pCat => {
          const isSelected = category === pCat.slug;
          return (
            <button
              key={pCat.slug}
              onClick={() => setCategory(pCat.slug)}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap font-bold text-xs transition-all active:scale-95 ${
                isSelected
                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-sm shadow-indigo-500/25'
                  : 'bg-slate-50 dark:bg-[#0c121e] text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 border border-slate-200/80 dark:border-white/10'
              }`}
            >
              {pCat.name}
            </button>
          );
        })}
      </div>

      {/* Price Range Slider Drawer (Collapsible) */}
      {showPriceSlider && (
        <div className="pt-3 border-t border-slate-100 dark:border-white/5 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              Target Price:
              <span className="text-slate-900 dark:text-white font-extrabold ml-1 font-mono">
                ${priceRange[0]} — ${priceRange[1]}
              </span>
            </span>

            <div className="flex flex-wrap gap-1.5">
              {pricePresets.map(preset => (
                <button
                  key={preset.label}
                  onClick={() => setPriceRange(preset.range)}
                  className={`text-xs px-2.5 py-1 rounded-xl border font-bold transition-all active:scale-95 ${
                    isPresetActive(preset.range)
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                      : 'bg-slate-50 dark:bg-[#0c121e] border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-400 w-8">Min:</span>
              <input
                type="range"
                min="0"
                max={priceRange[1]}
                value={priceRange[0]}
                onChange={e => setPriceRange([Number(e.target.value), priceRange[1]])}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 w-12 text-right">
                ${priceRange[0]}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-400 w-8">Max:</span>
              <input
                type="range"
                min={priceRange[0]}
                max={maxPrice}
                value={priceRange[1]}
                onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 w-12 text-right">
                ${priceRange[1]}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ROW 4: Live Results Count & Reset Filters Bar */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-white/5">
        <div className="flex items-center gap-2 flex-wrap">
          <span>
            Showing <span className="font-bold text-slate-900 dark:text-white font-mono">{totalFilteredCount}</span> of{' '}
            <span className="font-bold text-slate-900 dark:text-white font-mono">{totalCatalogCount}</span> products
          </span>

          {category !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 font-bold text-[11px] border border-indigo-200/60 dark:border-indigo-800/60">
              <Layers className="w-3.5 h-3.5" />
              <span>{formatCategoryName(category)}</span>
            </span>
          )}

          {segment !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 font-bold text-[11px] border border-amber-200/60 dark:border-amber-800/60">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Segment: {segment}</span>
            </span>
          )}
        </div>

        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 font-bold transition-all active:scale-95"
            title="Reset all filters"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        )}
      </div>
    </div>
  );
}
