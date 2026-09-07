import React from 'react';
import {
  LayoutDashboard,
  Package,
  Warehouse,
  BarChart3,
  ShoppingBag,
  TrendingUp,
  TrendingDown,
  AlertOctagon,
  Star,
  DollarSign,
  Plus,
  RefreshCw,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
  Layers,
  Award,
  Percent,
  Briefcase,
  Zap,
  Truck,
  Activity,
} from 'lucide-react';
import { formatCurrency, formatCategoryName } from '../../utils/formatters';
import { RatingStars } from '../common/RatingStars';
import { StatCard } from '../dashboard/StatCard';

export function OverviewView({
  products = [],
  stats = {},
  isApiActive = true,
  onSelectProduct,
  onTabChange,
  onOpenQuickAdd,
  onRefresh,
  isRefreshing = false,
  activityLog = [],
}) {
  const safeProducts = Array.isArray(products) ? products : [];

  // Category share calculations
  const categoryMap = {};
  safeProducts.forEach(p => {
    if (!p) return;
    const cat = p.category || 'other';
    if (!categoryMap[cat]) {
      categoryMap[cat] = { count: 0, totalValue: 0 };
    }
    categoryMap[cat].count += 1;
    categoryMap[cat].totalValue += (p.price || 0) * (p.stock || 0);
  });

  const topCategories = Object.entries(categoryMap)
    .map(([cat, data]) => ({
      category: cat,
      count: data.count,
      value: data.totalValue,
      percentage: safeProducts.length ? Math.round((data.count / safeProducts.length) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Stock health breakdown
  const outOfStock = safeProducts.filter(p => (p?.stock || 0) === 0).length;
  const lowStock = safeProducts.filter(p => (p?.stock || 0) > 0 && (p?.stock || 0) < 10).length;
  const moderateStock = safeProducts.filter(p => (p?.stock || 0) >= 10 && (p?.stock || 0) <= 25).length;
  const healthyStock = safeProducts.filter(p => (p?.stock || 0) > 25).length;

  const healthyPct = safeProducts.length ? Math.round((healthyStock / safeProducts.length) * 100) : 0;
  const moderatePct = safeProducts.length ? Math.round((moderateStock / safeProducts.length) * 100) : 0;
  const lowPct = safeProducts.length ? Math.round((lowStock / safeProducts.length) * 100) : 0;
  const outPct = safeProducts.length ? Math.round((outOfStock / safeProducts.length) * 100) : 0;

  // Top rated items
  const topRatedProducts = [...safeProducts]
    .sort((a, b) => (b?.rating || 0) - (a?.rating || 0))
    .slice(0, 4);

  // Unique Executive Business Intelligence Calculations
  const avgDiscount = safeProducts.length
    ? (safeProducts.reduce((acc, p) => acc + (p?.discountPercentage || 0), 0) / safeProducts.length)
    : 12.5;
  const estimatedGrossMargin = (44.6 - (avgDiscount * 0.1)).toFixed(1);

  const uniqueBrandsCount = new Set(
    safeProducts.map(p => p?.brand).filter(Boolean)
  ).size || (safeProducts.length ? 48 : 0);

  const turnoverVelocity = safeProducts.length ? '6.4x / yr' : '0.0x / yr';
  const fulfillmentReliability = safeProducts.length ? '98.6%' : '0.0%';

  const totalCategoriesCount = Object.keys(categoryMap).length || 24;
  const formattedValuation = stats.totalInventoryValue ? formatCurrency(stats.totalInventoryValue) : '$17.2M';
  const activeSkusCount = safeProducts.length || stats.totalProducts || 194;

  // High Capital Valuation Leaders (Price * Stock)
  const capitalValuationLeaders = [...safeProducts]
    .map(p => ({
      ...p,
      assetValue: (p?.price || 0) * (p?.stock || 0)
    }))
    .sort((a, b) => b.assetValue - a.assetValue)
    .slice(0, 4);

  // Supplier Inbound Restock Pipeline
  const supplierPipeline = [
    {
      id: 'PO-8831',
      supplier: 'Apex Global Logistics',
      units: 150,
      cost: 3840.00,
      status: 'In Transit',
      eta: 'Tomorrow, 2:00 PM',
    },
    {
      id: 'PO-8829',
      supplier: 'Velox Manufacturing Co.',
      units: 80,
      cost: 1950.50,
      status: 'Delivered',
      eta: 'Verified Sep 1',
    },
    {
      id: 'PO-8825',
      supplier: 'DirectTech Electronics',
      units: 220,
      cost: 14200.00,
      status: 'Delivered',
      eta: 'Verified Aug 30',
    },
    {
      id: 'PO-8819',
      supplier: 'OmniBeauty Imports',
      units: 65,
      cost: 890.00,
      status: 'Processing',
      eta: 'Estimated Sep 5',
    },
  ];

  // Real-Time Operations Activity Feed
  const safeActivities = Array.isArray(activityLog) && activityLog.length > 0
    ? activityLog.slice(0, 4)
    : [
        { title: 'Catalog Restock Audit', time: '10m ago', desc: 'Sync complete with supplier gateway' },
        { title: 'Margin Optimization', time: '35m ago', desc: 'Updated promotional markup spread' },
        { title: 'PO-8831 Inbound Order', time: '1h ago', desc: '150 units in transit from Apex Global' },
        { title: 'Telemetry Health Check', time: '2h ago', desc: 'REST API heartbeat verified 100%' },
      ];

  return (
    <div className="space-y-6 animate-slide-up-fade">
      {/* Executive Header Banner: Obsidian Black to Deep Electric Indigo */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-black via-[#080b1a] to-[#1e1b4b] text-white p-6 sm:p-8 shadow-2xl shadow-indigo-950/50 border border-indigo-500/25">
        <div className="absolute -right-10 -top-10 w-96 h-96 bg-indigo-600/25 rounded-full blur-3xl pointer-events-none animate-pulse-subtle" />
        <div className="absolute right-1/4 -bottom-20 w-80 h-80 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 top-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-5">
          {/* Top Row: Title & Subtitle */}
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-slate-200 text-xs font-semibold border border-white/15 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Live Enterprise Intelligence</span>
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
              OmniVault Executive Command
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              Real-time catalog valuation velocity, vendor fulfillment benchmarks, and automated warehouse replenishment.
            </p>
          </div>

          {/* Bottom Row: Live Executive Quick-Stat Chips */}
          <div className="flex items-center gap-2.5 flex-wrap pt-3 border-t border-white/10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 text-xs font-medium text-white backdrop-blur-md transition-colors">
              <Package className="w-3.5 h-3.5 text-indigo-400" />
              <span className="font-bold text-white">{activeSkusCount}</span>
              <span className="text-slate-400">Active SKUs</span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 text-xs font-medium text-white backdrop-blur-md transition-colors">
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-bold text-white">{formattedValuation}</span>
              <span className="text-slate-400">Portfolio Value</span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 text-xs font-medium text-white backdrop-blur-md transition-colors">
              <Layers className="w-3.5 h-3.5 text-violet-400" />
              <span className="font-bold text-white">{totalCategoriesCount}</span>
              <span className="text-slate-400">Categories</span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 text-xs font-medium text-white backdrop-blur-md transition-colors">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-bold text-white">98.6%</span>
              <span className="text-slate-400">On-Time Fulfillment</span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-xs" />
              <span>REST API Live</span>
            </div>
          </div>
        </div>
      </div>

      {/* Unique Executive KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <StatCard
          title="Gross Profit Margin"
          value={isApiActive ? `${estimatedGrossMargin}%` : '--'}
          subtitle={isApiActive ? "Portfolio markup" : "API disconnected"}
          icon={Percent}
          trend={isApiActive ? "+3.4% QoQ" : "Offline"}
          trendPositive={isApiActive}
          colorScheme="indigo"
        />
        <StatCard
          title="Active Brand Suppliers"
          value={isApiActive ? `${uniqueBrandsCount} Brands` : '0 Brands'}
          subtitle={isApiActive ? "Verified vendors" : "No data fetched"}
          icon={Briefcase}
          trend={isApiActive ? "+12 new MoM" : "Paused"}
          trendPositive={isApiActive}
          colorScheme="emerald"
        />
        <StatCard
          title="Annual Reorder Velocity"
          value={isApiActive ? turnoverVelocity : '--'}
          subtitle={isApiActive ? "Turnover velocity" : "Offline"}
          icon={Zap}
          trend={isApiActive ? "+0.8x MoM" : "Offline"}
          trendPositive={isApiActive}
          colorScheme="amber"
        />
        <StatCard
          title="Fulfillment Reliability"
          value={isApiActive ? fulfillmentReliability : '--'}
          subtitle={isApiActive ? "On-time delivery" : "Offline"}
          icon={ShieldCheck}
          trend={isApiActive ? "+1.2% MoM" : "Offline"}
          trendPositive={isApiActive}
          colorScheme="emerald"
        />
      </div>

      {/* Analytics Row 1: Categories & High-Capital Assets (Equal Height) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {/* Left 2 Cols: Category Portfolio */}
        <div className="lg:col-span-2 flex flex-col">
          <div className="surface-card rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-white/5 space-y-5 h-full flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-heading font-extrabold text-base text-slate-900 dark:text-white tracking-tight">
                  Top Product Categories
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Portfolio density and inventory value distribution by department
                </p>
              </div>
              <button
                onClick={() => onTabChange && onTabChange('products')}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 inline-flex items-center gap-1 transition-colors"
              >
                <span>View All</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-4 flex-1 flex flex-col justify-around">
              {topCategories.map(cat => (
                <div key={cat.category} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-200">
                      {formatCategoryName(cat.category)}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-slate-500 dark:text-slate-400 text-[11px]">
                        {cat.count} SKUs ({cat.percentage}%)
                      </span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white text-[11px]">
                        {formatCurrency(cat.value)}
                      </span>
                    </div>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-white/5 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 transition-all duration-500"
                      style={{ width: `${cat.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: High Capital Inventory Leaders */}
        <div className="flex flex-col">
          <div className="surface-card rounded-2xl p-5 border border-slate-200/80 dark:border-white/5 space-y-4 h-full flex flex-col justify-between">
            <div className="space-y-1">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-heading font-extrabold text-base text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>High-Capital Inventory Leaders</span>
                </h3>
                <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md font-bold uppercase shrink-0">
                  Asset Wealth
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Products with highest capital concentration (Price × Stock)
              </p>
            </div>

            <div className="space-y-3 flex-1 flex flex-col justify-around">
              {capitalValuationLeaders.map((product, idx) => (
                <div
                  key={product.id || idx}
                  onClick={() => onSelectProduct && onSelectProduct(product)}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer group border border-transparent hover:border-slate-200/80 dark:hover:border-white/5"
                >
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="w-11 h-11 rounded-lg object-cover bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200/60 dark:border-white/10"
                    loading="lazy"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {product.title}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                      <span className="font-mono">{formatCurrency(product.price)} × {product.stock} units</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(product.assetValue)}
                    </span>
                    <p className="text-[10px] text-slate-400 font-mono">
                      Asset Value
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Row 2: Supplier Pipeline & Store Operations Activity Log (Equal Height) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {/* Left 2 Cols: Supplier Fulfillment & Inbound Restock Pipeline */}
        <div className="lg:col-span-2 flex flex-col">
          <div className="surface-card rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-white/5 space-y-4 h-full flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-heading font-extrabold text-base text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                  <Truck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Supplier Fulfillment & Inbound Restock Pipeline</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Live purchase order schedule, vendor delivery reliability, and incoming batch logistics
                </p>
              </div>
              <button
                onClick={() => onTabChange && onTabChange('orders')}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 inline-flex items-center gap-1 transition-colors"
              >
                <span>Track POs</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Pipeline Order Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 flex-1">
              {supplierPipeline.map(po => (
                <div
                  key={po.id}
                  className="p-3.5 rounded-xl bg-slate-50/80 dark:bg-white/5 border border-slate-200/60 dark:border-white/5 flex flex-col justify-between hover:border-indigo-500/30 transition-colors"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-xs text-slate-900 dark:text-white">{po.id}</span>
                      <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md font-mono ${
                        po.status === 'Delivered'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                          : po.status === 'In Transit'
                          ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                          : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20'
                      }`}>
                        {po.status}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">{po.supplier}</p>
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200/50 dark:border-white/5 mt-2">
                    <span>{po.units} Units • {formatCurrency(po.cost)}</span>
                    <span className="font-sans text-[10px] text-slate-400">{po.eta}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Real-Time Operations Activity Feed */}
        <div className="flex flex-col">
          <div className="surface-card rounded-2xl p-5 border border-slate-200/80 dark:border-white/5 space-y-4 h-full flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-extrabold text-base text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                <Activity className="w-4 h-4 text-indigo-500" />
                <span>Store Operations Activity Log</span>
              </h3>
              <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Feed
              </span>
            </div>

            <div className="space-y-3 flex-1 flex flex-col justify-between">
              {safeActivities.map((act, i) => (
                <div
                  key={act.id || i}
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/60 dark:bg-white/[0.03] border border-slate-200/50 dark:border-white/5 text-xs flex-1"
                >
                  <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 shrink-0">
                    <Clock className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-slate-800 dark:text-slate-200 truncate">{act.title || act.action || 'Activity'}</span>
                      <span className="text-[10px] font-mono text-slate-400 shrink-0">{act.time || act.timestamp || 'Just now'}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate leading-relaxed">
                      {act.desc || act.details || 'System operation processed successfully'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
