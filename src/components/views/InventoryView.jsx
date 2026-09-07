import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Package,
  Plus,
  RefreshCw,
  Search,
  ArrowUpRight,
  TrendingDown,
  Warehouse,
} from 'lucide-react';
import { formatCurrency, formatCategoryName, getStockStatus } from '../../utils/formatters';

export function InventoryView({ products = [], onSelectProduct, onRestockProduct }) {
  const [filter, setFilter] = useState('all'); // 'all', 'low', 'out'
  const [search, setSearch] = useState('');

  // Compute inventory metrics
  const totalUnits = products.reduce((sum, p) => sum + (p.stock || 0), 0);
  const lowStockItems = products.filter(p => (p.stock || 0) > 0 && (p.stock || 0) < 10);
  const outOfStockItems = products.filter(p => (p.stock || 0) === 0);
  const healthyStockItems = products.filter(p => (p.stock || 0) >= 10);

  // Filtered items
  const filteredProducts = products.filter(p => {
    const matchesFilter =
      filter === 'all' ? true :
      filter === 'low' ? (p.stock || 0) > 0 && (p.stock || 0) < 10 :
      (p.stock || 0) === 0;

    const query = search.toLowerCase().trim();
    const matchesSearch = query
      ? (p.title || '').toLowerCase().includes(query) ||
        (p.brand || '').toLowerCase().includes(query) ||
        (p.category || '').toLowerCase().includes(query)
      : true;

    return matchesFilter && matchesSearch;
  });

  // Calculate stock by category
  const categoryStock = {};
  products.forEach(p => {
    const cat = p.category || 'other';
    categoryStock[cat] = (categoryStock[cat] || 0) + (p.stock || 0);
  });
  const topCategories = Object.entries(categoryStock)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  return (
    <div className="space-y-6">
      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <div className="surface-card rounded-2xl p-5 shadow-xs hover-lift hover:shadow-card-hover group cursor-default transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Units</span>
            <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
              <Warehouse className="w-5 h-5" />
            </div>
          </div>
          <div className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-2 font-mono group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-200">
            {totalUnits.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">In stock across all warehouses</span>
        </div>

        <div className="surface-card rounded-2xl p-5 shadow-xs hover-lift hover:shadow-card-hover group cursor-default transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Healthy Stock</span>
            <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-emerald-600 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-2 font-mono group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-200">
            {healthyStockItems.length} SKUs
          </div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1 block">
            {((healthyStockItems.length / (products.length || 1)) * 100).toFixed(0)}% of total catalog
          </span>
        </div>

        <div className="surface-card rounded-2xl p-5 shadow-xs hover-lift hover:shadow-card-hover group cursor-default transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Low Stock Alert</span>
            <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-amber-500 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-2 font-mono group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors duration-200">
            {lowStockItems.length} SKUs
          </div>
          <span className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold mt-1 block">
            Needs purchase reorder
          </span>
        </div>

        <div className="surface-card rounded-2xl p-5 shadow-xs hover-lift hover:shadow-card-hover group cursor-default transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Out of Stock</span>
            <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-rose-500 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
              <TrendingDown className="w-5 h-5" />
            </div>
          </div>
          <div className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-2 font-mono group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors duration-200">
            {outOfStockItems.length} SKUs
          </div>
          <span className="text-[11px] text-rose-600 dark:text-rose-400 font-semibold mt-1 block">
            Immediate attention required
          </span>
        </div>
      </div>

      {/* Main Grid: Inventory Table (left 8 cols) & Category Distribution (right 4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Inventory Stock Table */}
        <div className="lg:col-span-8 surface-card rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="font-heading text-lg font-bold text-slate-900 dark:text-white">
                Inventory Stock & Replenishment
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Track stock thresholds and trigger instant replenishment orders.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              <button
                onClick={() => setFilter('all')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors ${
                  filter === 'all'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                All ({products.length})
              </button>
              <button
                onClick={() => setFilter('low')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors ${
                  filter === 'low'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Low Stock ({lowStockItems.length})
              </button>
              <button
                onClick={() => setFilter('out')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors ${
                  filter === 'out'
                    ? 'bg-rose-500 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Out of Stock ({outOfStockItems.length})
              </button>
            </div>
          </div>

          {/* Search bar inside inventory table */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Filter inventory table..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Items Table */}
          <div className="overflow-x-auto max-h-[480px]">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="sticky top-0 bg-slate-50 dark:bg-slate-850 text-slate-400 uppercase text-[10px] font-bold">
                <tr>
                  <th className="py-2.5 px-3">Product</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Stock Units</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredProducts.slice(0, 20).map(p => {
                  const status = getStockStatus(p.stock);
                  return (
                    <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={p.thumbnail}
                            alt=""
                            className="w-8 h-8 rounded-lg object-contain bg-slate-100 dark:bg-slate-800 p-0.5"
                          />
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white truncate max-w-[180px]">
                              {p.title}
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono">
                              SKU: {p.sku || `#${p.id}`}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400">
                          {formatCategoryName(p.category)}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-slate-900 dark:text-white">
                        {p.stock} units
                      </td>
                      <td className="py-3 px-3">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${status.badgeClass}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${status.dotClass}`} />
                          {status.label}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => {
                            if (onRestockProduct) {
                              onRestockProduct(p.id, 50);
                            } else {
                              alert(`Order placed: +50 units for ${p.title}`);
                            }
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white dark:bg-emerald-950/50 dark:text-emerald-300 dark:hover:bg-emerald-600 dark:hover:text-white font-bold text-[10px] transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                          Restock +50
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Category Breakdown Column */}
        <div className="lg:col-span-4 surface-card rounded-2xl p-5 shadow-xs space-y-4">
          <div>
            <h3 className="font-heading text-lg font-bold text-slate-900 dark:text-white">
              Inventory by Category
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Volume distribution across major product groups.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            {topCategories.map(([cat, units]) => {
              const pct = Math.round((units / (totalUnits || 1)) * 100);
              return (
                <div key={cat} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {formatCategoryName(cat)}
                    </span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      {units.toLocaleString()} units ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(5, pct)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Warehouse health banner */}
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/40 text-xs text-emerald-800 dark:text-emerald-300 space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Automated Reorder Thresholds Active
            </div>
            <p className="text-[11px] text-emerald-700/80 dark:text-emerald-400/80 leading-relaxed">
              When a SKU falls under 10 units, warning alerts are flagged to your procurement queue automatically.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
