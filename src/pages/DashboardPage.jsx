import React, { useState, useEffect } from 'react';
import {
  Package,
  DollarSign,
  Star,
  AlertOctagon,
  Sparkles,
  TrendingUp,
  Scale,
  WifiOff,
  Radio,
} from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import { useTheme } from '../hooks/useTheme';
import { Header } from '../components/layout/Header';
import { Sidebar } from '../components/layout/Sidebar';
import { StatCard } from '../components/dashboard/StatCard';
import { FilterBar } from '../components/dashboard/FilterBar';
import { ProductCard } from '../components/dashboard/ProductCard';
import { ProductTable } from '../components/dashboard/ProductTable';
import { Pagination } from '../components/dashboard/Pagination';
import { ProductDetailModal } from '../components/dashboard/ProductDetailModal';
import { QuickAddProductModal } from '../components/dashboard/QuickAddProductModal';
import { BulkActionBar } from '../components/dashboard/BulkActionBar';
import { ProductComparisonModal } from '../components/dashboard/ProductComparisonModal';
import { PrintShelfTagModal } from '../components/dashboard/PrintShelfTagModal';
import { ApiInspectorModal } from '../components/common/ApiInspectorModal';
import { CommandPalette } from '../components/common/CommandPalette';
import { ActivityLogDrawer } from '../components/dashboard/ActivityLogDrawer';
import { InventoryView } from '../components/views/InventoryView';
import { AnalyticsView } from '../components/views/AnalyticsView';
import { OrdersView } from '../components/views/OrdersView';
import { OverviewView } from '../components/views/OverviewView';
import { SkeletonLoader } from '../components/common/SkeletonLoader';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorState } from '../components/common/ErrorState';
import { formatCurrency } from '../utils/formatters';
import {
  exportProductsToCSV,
  exportProductsToJSON,
  exportProductsToPDF,
} from '../utils/exportUtils';

export function DashboardPage() {
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

  // New feature modals state
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [shelfTagProduct, setShelfTagProduct] = useState(null);
  const [isApiModalOpen, setIsApiModalOpen] = useState(false);
  const [isApiActive, setIsApiActive] = useState(true);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isActivityLogOpen, setIsActivityLogOpen] = useState(false);

  // Store Operations Activity Log State
  const [activities, setActivities] = useState([
    {
      id: 'act-1',
      type: 'restock',
      title: 'Inventory Restocked',
      detail: 'Added +50 units to Essence Mascara Lash Princess',
      time: '5m ago',
    },
    {
      id: 'act-2',
      type: 'price_change',
      title: 'Price Adjusted',
      detail: 'Applied 15% discount promotional pricing to active catalog',
      time: '24m ago',
    },
    {
      id: 'act-3',
      type: 'export',
      title: 'Catalog Export Generated',
      detail: 'Exported active catalog to executive audit report',
      time: '1h ago',
    },
    {
      id: 'act-4',
      type: 'api_toggle',
      title: 'REST API Sync Initialized',
      detail: 'Connected to DummyJSON production gateway (Status 200 OK)',
      time: '2h ago',
    },
  ]);

  const logActivity = (type, title, detail) => {
    const item = {
      id: `act-${Date.now()}`,
      type,
      title,
      detail,
      time: 'Just now',
    };
    setActivities(prev => [item, ...prev]);
  };

  // Keyboard shortcut: Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleToggleApi = () => {
    setIsApiActive(prev => {
      const nextState = !prev;
      logActivity(
        'api_toggle',
        nextState ? 'API Gateway Connected' : 'API Gateway Disconnected',
        nextState ? 'Live DummyJSON sync re-enabled' : 'Operating in offline mode'
      );
      if (nextState) {
        refreshData();
      }
      return nextState;
    });
  };

  const {
    products,
    allFilteredProducts,
    allCatalogProducts,
    allFilteredCount,
    totalProductsInCatalog,
    categories,
    stats,
    maxPriceInCatalog,

    loading,
    refreshing,
    error,
    refreshData,
    updateProduct,
    restockProduct,

    search,
    setSearch,
    category,
    setCategory,
    segment,
    setSegment,
    priceRange,
    setPriceRange,
    sortBy,
    setSortBy,
    viewMode,
    setViewMode,
    hasActiveFilters,
    resetFilters,

    selectedProductIds,
    toggleSelectProduct,
    selectAllOnPage,
    clearSelection,
    bulkRestock,
    bulkApplyDiscount,
    bulkDelete,

    comparedProductIds,
    comparedProducts,
    toggleCompare,
    clearCompare,

    page,
    setPage,
    limit,
    setLimit,
    totalPages,

    selectedProduct,
    setSelectedProduct,
    addProduct,
  } = useProducts();

  const handleAddProduct = (newProduct) => {
    addProduct(newProduct);
    setSelectedProduct(newProduct);
    logActivity('create', 'Product Created', `Added ${newProduct.title} with uploaded photo`);
  };

  const handleExportCSV = () => {
    exportProductsToCSV(
      allFilteredProducts.length ? allFilteredProducts : allCatalogProducts,
      'aura_products_catalog.csv'
    );
    logActivity('export', 'Export CSV', `Exported ${allFilteredProducts.length || allCatalogProducts.length} items as CSV`);
  };

  const handleExportJSON = () => {
    exportProductsToJSON(
      allFilteredProducts.length ? allFilteredProducts : allCatalogProducts,
      'aura_products_catalog.json'
    );
    logActivity('export', 'Export JSON', `Exported ${allFilteredProducts.length || allCatalogProducts.length} items as JSON`);
  };

  const handleExportPDF = () => {
    exportProductsToPDF(
      allFilteredProducts.length ? allFilteredProducts : allCatalogProducts,
      'AURA StoreOps — Products Catalog Report'
    );
    logActivity('export', 'Export PDF', `Generated PDF Audit Report with ${allFilteredProducts.length || allCatalogProducts.length} items`);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#090d16] text-slate-900 dark:text-slate-100 flex transition-colors duration-200">
      {/* Sidebar: Persistent on Desktop (lg:flex), slide-over drawer on Mobile */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        totalProductsCount={totalProductsInCatalog}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(prev => !prev)}
        isApiActive={isApiActive}
        onToggleApi={handleToggleApi}
      />

      {/* Main Viewport Column */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Command Header */}
        <Header
          search={search}
          setSearch={setSearch}
          onRefresh={refreshData}
          isRefreshing={refreshing}
          theme={theme}
          toggleTheme={toggleTheme}
          onToggleSidebar={() => {
            if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
              setIsSidebarCollapsed(prev => !prev);
            } else {
              setIsSidebarOpen(prev => !prev);
            }
          }}
          totalResults={allFilteredCount}
          onOpenQuickAdd={() => setIsQuickAddOpen(true)}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onOpenApiInspector={() => setIsApiModalOpen(true)}
          isApiActive={isApiActive}
          onToggleApi={handleToggleApi}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          onOpenActivityLog={() => setIsActivityLogOpen(true)}
          lowStockProducts={allCatalogProducts.filter(p => (p.stock || 0) < 10)}
          onRestockProduct={(id, amt) => {
            restockProduct(id, amt);
            const p = allCatalogProducts.find(item => item.id === id);
            logActivity('restock', 'Quick Reorder Restock', `Replenished +${amt} units for ${p?.title || 'product'}`);
          }}
          onSelectProduct={setSelectedProduct}
        />

        {/* Main Content Area */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Offline Alert Banner if API is toggled OFF */}
        {!isApiActive && (
          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-rose-800 dark:text-rose-300 animate-in fade-in slide-in-from-top-2 duration-200 shadow-xs">
            <div className="flex items-center gap-2.5 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 flex-shrink-0" />
              <span>
                <strong>API Gateway is OFF:</strong> Live REST synchronization is currently paused. Operating in offline preview mode.
              </span>
            </div>
            <button
              onClick={handleToggleApi}
              className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-bold text-xs shadow-xs transition-all self-start sm:self-auto"
            >
              Turn API ON
            </button>
          </div>
        )}
        {/* TAB 0: EXECUTIVE DASHBOARD OVERVIEW */}
        {activeTab === 'overview' && (
          <OverviewView
            products={allCatalogProducts || products || []}
            stats={stats || {}}
            isApiActive={isApiActive}
            onSelectProduct={setSelectedProduct}
            onTabChange={setActiveTab}
            onOpenQuickAdd={() => setIsQuickAddOpen(true)}
            onRefresh={refreshData}
            isRefreshing={refreshing}
            activityLog={activities}
          />
        )}

        {/* TAB 1: PRODUCTS CATALOG */}
        {activeTab === 'products' && (
          <div className="space-y-6 animate-slide-up-fade">
            {/* Title & Status */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/80 dark:border-slate-800">
              <div>
                <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Products & Catalog Management
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Real-time stock audit, inline editing, bulk operations, and full catalog control.
                </p>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                {comparedProductIds.length >= 2 && (
                  <button
                    onClick={() => setIsCompareModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-colors"
                  >
                    <Scale className="w-3.5 h-3.5" />
                    <span>Compare ({comparedProductIds.length})</span>
                  </button>
                )}

                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-colors ${
                  isApiActive
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-400'
                    : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-400'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${isApiActive ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                  <span>{isApiActive ? 'Sync: Live' : 'Sync: Disconnected (API OFF)'}</span>
                </div>
              </div>
            </div>

            {/* KPI Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 animate-slide-up-fade">
              <StatCard
                title="Total Products"
                value={isApiActive ? stats.totalProducts.toLocaleString() : '0'}
                subtitle={isApiActive ? "Indexed in catalog" : "API disconnected"}
                icon={Package}
                trend={isApiActive ? "+12.4% MoM" : "Offline"}
                trendPositive={isApiActive}
                colorScheme={isApiActive ? "indigo" : "rose"}
              />
              <StatCard
                title="Inventory Valuation"
                value={isApiActive ? formatCurrency(stats.totalInventoryValue) : '$0.00'}
                subtitle={isApiActive ? `${stats.totalStockUnits.toLocaleString()} units total` : "No data fetched"}
                icon={DollarSign}
                trend={isApiActive ? "+6.8% MoM" : "Paused"}
                trendPositive={isApiActive}
                colorScheme={isApiActive ? "indigo" : "rose"}
              />
              <StatCard
                title="Average Rating"
                value={isApiActive ? `${stats.averageRating} / 5.0` : '--'}
                subtitle={isApiActive ? "Customer reviews" : "Offline"}
                icon={Star}
                trend={isApiActive ? "+4.2% MoM" : "Offline"}
                trendPositive={isApiActive}
                colorScheme={isApiActive ? "indigo" : "rose"}
              />
              <StatCard
                title="Low Stock Alert"
                value={isApiActive ? stats.lowStockCount.toLocaleString() : '0'}
                subtitle={isApiActive ? "Items under 10 units" : "Offline"}
                icon={AlertOctagon}
                trend={isApiActive ? (stats.lowStockCount > 0 ? "-12.5% MoM" : "+0.0% MoM") : "Offline"}
                trendPositive={isApiActive ? stats.lowStockCount === 0 : false}
                colorScheme={isApiActive ? (stats.lowStockCount > 0 ? "rose" : "indigo") : "rose"}
              />
            </div>

            {/* Filter Toolbar with Segments & CSV Export */}
            <FilterBar
              search={search}
              setSearch={setSearch}
              category={category}
              setCategory={setCategory}
              categories={categories}
              segment={segment}
              setSegment={setSegment}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              maxPrice={maxPriceInCatalog}
              sortBy={sortBy}
              setSortBy={setSortBy}
              viewMode={viewMode}
              setViewMode={setViewMode}
              hasActiveFilters={hasActiveFilters}
              onResetFilters={resetFilters}
              totalFilteredCount={allFilteredCount}
              totalCatalogCount={totalProductsInCatalog}
              onExportCSV={handleExportCSV}
              onExportJSON={handleExportJSON}
              onExportPDF={handleExportPDF}
            />

            {/* Product Listing Area */}
            <section className="space-y-5">
              {!isApiActive ? (
                /* API Offline State: PRODUCTS ARE HIDDEN */
                <div className="surface-card rounded-3xl p-10 sm:p-14 text-center border-2 border-dashed border-rose-200 dark:border-rose-900/50 max-w-xl mx-auto space-y-4 animate-in fade-in zoom-in-95 duration-200 shadow-xs">
                  <div className="w-16 h-16 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto shadow-sm">
                    <WifiOff className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="font-heading text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                      API Gateway is OFF
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1.5 max-w-md mx-auto leading-relaxed">
                      Products are hidden because the API is currently turned <strong>OFF</strong>. Turn the API back ON to fetch and view live products.
                    </p>
                  </div>
                  <button
                    onClick={handleToggleApi}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 active:scale-95 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
                  >
                    <Radio className="w-4 h-4 animate-pulse" />
                    <span>Turn API ON</span>
                  </button>
                </div>
              ) : loading ? (
                <SkeletonLoader viewMode={viewMode} count={limit} />
              ) : error ? (
                <ErrorState error={error} onRetry={refreshData} />
              ) : products.length === 0 ? (
                <EmptyState onReset={hasActiveFilters ? resetFilters : null} />
              ) : (
                <>
                  {viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 animate-slide-up-fade">
                      {products.map(product => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          onSelect={setSelectedProduct}
                          isSelected={selectedProductIds.has(product.id)}
                          onToggleSelect={toggleSelectProduct}
                          isCompared={comparedProductIds.includes(product.id)}
                          onToggleCompare={toggleCompare}
                        />
                      ))}
                    </div>
                  ) : (
                    <ProductTable
                      products={products}
                      onSelectProduct={setSelectedProduct}
                      selectedIds={selectedProductIds}
                      onToggleSelect={toggleSelectProduct}
                      onSelectAll={selectAllOnPage}
                      onUpdateProduct={updateProduct}
                      comparedIds={comparedProductIds}
                      onToggleCompare={toggleCompare}
                      onOpenPrintShelfTag={setShelfTagProduct}
                    />
                  )}

                  {/* Pagination Controls */}
                  <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                    itemsPerPage={limit}
                    onItemsPerPageChange={setLimit}
                    totalItems={allFilteredCount}
                  />
                </>
              )}
            </section>
          </div>
        )}

        {/* TAB 2: INVENTORY */}
        {activeTab === 'inventory' && (
          <div className="space-y-6 animate-slide-up-fade">
            <div className="pb-3 border-b border-slate-200/80 dark:border-slate-800">
              <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Inventory & Stock Health
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Real-time warehouse units, replenishment thresholds, and SKU volume distribution.
              </p>
            </div>
            <InventoryView
              products={allCatalogProducts || products}
              onSelectProduct={setSelectedProduct}
              onRestockProduct={restockProduct}
            />
          </div>
        )}

        {/* TAB 3: ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="space-y-6 animate-slide-up-fade">
            <div className="pb-3 border-b border-slate-200/80 dark:border-slate-800">
              <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Catalog Analytics & Insights
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Customer satisfaction breakdown, pricing tier distribution, and product leaderboards.
              </p>
            </div>
            <AnalyticsView
              products={allCatalogProducts || products}
              onSelectProduct={setSelectedProduct}
            />
          </div>
        )}

        {/* TAB 4: ORDERS */}
        {activeTab === 'orders' && (
          <div className="space-y-6 animate-slide-up-fade">
            <div className="pb-3 border-b border-slate-200/80 dark:border-slate-800">
              <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Stock Replenishment & Purchase Orders
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Monitor incoming supplier shipments, transit statuses, and generate restock purchase orders.
              </p>
            </div>
            <OrdersView />
          </div>
        )}
      </main>
      </div>

      {/* Floating Bulk Action Bar (only when API is ON) */}
      {isApiActive && (
        <BulkActionBar
          selectedIds={selectedProductIds}
          allProducts={allCatalogProducts}
          onClearSelection={clearSelection}
          onBulkRestock={bulkRestock}
          onBulkDiscount={bulkApplyDiscount}
          onBulkDelete={bulkDelete}
          onOpenCompare={(ids) => {
            ids.forEach(id => {
              if (!comparedProductIds.includes(id)) toggleCompare(id);
            });
            setIsCompareModalOpen(true);
          }}
        />
      )}

      {/* Product Comparison Modal */}
      <ProductComparisonModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        comparedProducts={comparedProducts}
        onRemoveProduct={toggleCompare}
      />

      {/* Retail Shelf Tag Modal */}
      <PrintShelfTagModal
        product={shelfTagProduct}
        isOpen={Boolean(shelfTagProduct)}
        onClose={() => setShelfTagProduct(null)}
      />

      {/* Product Details Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onOpenPrintShelfTag={setShelfTagProduct}
        onToggleCompare={toggleCompare}
        isCompared={comparedProductIds.includes(selectedProduct?.id)}
      />

      {/* API Diagnostics Modal */}
      <ApiInspectorModal
        isOpen={isApiModalOpen}
        onClose={() => setIsApiModalOpen(false)}
        totalProducts={totalProductsInCatalog}
      />

      {/* Quick Add Product Modal */}
      <QuickAddProductModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        onAddProduct={handleAddProduct}
        categories={categories}
      />

      {/* Global Spotlight Command Palette (⌘K / Ctrl+K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigateTab={setActiveTab}
        onOpenQuickAdd={() => setIsQuickAddOpen(true)}
        onToggleApi={handleToggleApi}
        isApiActive={isApiActive}
        onToggleTheme={toggleTheme}
        theme={theme}
        onOpenActivityLog={() => setIsActivityLogOpen(true)}
        onExportPDF={handleExportPDF}
        products={allCatalogProducts}
        onSelectProduct={setSelectedProduct}
      />

      {/* Store Operations Activity Log Drawer */}
      <ActivityLogDrawer
        isOpen={isActivityLogOpen}
        onClose={() => setIsActivityLogOpen(false)}
        activities={activities}
        onClearActivities={() => setActivities([])}
      />
    </div>
  );
}
