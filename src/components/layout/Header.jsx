import React, { useState, useEffect } from 'react';
import {
  Search,
  Moon,
  Sun,
  RefreshCw,
  Menu,
  Plus,
  Command,
  Clock,
} from 'lucide-react';
import { NotificationCenter } from './NotificationCenter';

export function Header({
  search,
  setSearch,
  onRefresh,
  isRefreshing,
  theme,
  toggleTheme,
  onToggleSidebar,
  totalResults,
  onOpenQuickAdd,
  activeTab = 'products',
  onTabChange,
  onOpenApiInspector,
  isApiActive = true,
  onToggleApi,
  onOpenCommandPalette,
  onOpenActivityLog,
  lowStockProducts = [],
  onRestockProduct,
  onSelectProduct,
}) {
  const [shortcutKey, setShortcutKey] = useState('Ctrl K');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isMac = /(Mac|iPhone|iPod|iPad)/i.test(navigator.userAgent || navigator.platform || '');
      setShortcutKey(isMac ? '⌘K' : 'Ctrl K');
    }
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white/85 dark:bg-[#0c121e]/85 backdrop-blur-xl border-b border-slate-200/80 dark:border-white/5 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3 sm:gap-4">
        {/* Left: Sidebar Toggle & View Title */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Mobile drawer toggle (Hidden on desktop because sidebar has its own < / > toggle) */}
          <button
            id="btn-sidebar-toggle"
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer focus:outline-none outline-none"
            aria-label="Toggle Navigation Menu"
            title="Open navigation drawer"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Current Page View Breadcrumb */}
          <div className="flex items-center gap-1.5 text-xs">
            {activeTab === 'overview' ? (
              <span className="font-heading font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200">
                Dashboard
              </span>
            ) : (
              <>
                <button
                  id="link-breadcrumb-dashboard"
                  onClick={() => {
                    if (onTabChange) onTabChange('overview');
                    if (typeof window !== 'undefined') {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                  className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors cursor-pointer focus:outline-none outline-none inline-flex items-center gap-1 hover:underline underline-offset-2"
                  title="Open Executive Dashboard Overview"
                >
                  Dashboard
                </button>
                <span className="text-slate-300 dark:text-slate-600 font-medium">/</span>
                <span className="font-heading font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200">
                  {activeTab === 'products' ? 'Products & Catalog' :
                   activeTab === 'inventory' ? 'Inventory Health' :
                   activeTab === 'analytics' ? 'Analytics & Insights' :
                   activeTab === 'orders' ? 'Purchase Orders' : 'Overview'}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Center: Search Box with EQUAL space on both sides */}
        <div className="flex-1 hidden sm:flex justify-center px-4 sm:px-6">
          <div
            id="btn-search-command-trigger"
            onClick={onOpenCommandPalette}
            className="relative group cursor-pointer w-full max-w-xl lg:max-w-2xl"
            title={`Click to search catalog or run commands (${shortcutKey})`}
          >
            <Search className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors pointer-events-none" />
            <input
              id="input-global-search"
              type="text"
              readOnly
              onClick={onOpenCommandPalette}
              placeholder="Search catalog or run commands..."
              className="w-full pl-9 pr-16 py-2 text-xs font-medium bg-slate-100/70 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800/90 hover:border-indigo-500/50 text-slate-900 dark:text-slate-100 rounded-xl border border-slate-200/60 dark:border-white/5 cursor-pointer transition-all placeholder:text-slate-400 select-none focus:outline-none"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none">
              <kbd className="inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-md shadow-2xs">
                {shortcutKey}
              </kbd>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">

          {/* Audit Trail & Activity Log */}
          {onOpenActivityLog && (
            <button
              id="btn-header-activity-log"
              onClick={onOpenActivityLog}
              title="Store Operations Audit Log"
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-all active:scale-95"
            >
              <Clock className="w-4 h-4" />
            </button>
          )}

          {/* Stock Notification Center */}
          <NotificationCenter
            lowStockProducts={lowStockProducts}
            onRestockProduct={onRestockProduct}
            onSelectProduct={onSelectProduct}
          />

          {/* Refresh button */}
          <button
            id="btn-header-refresh-api"
            onClick={onRefresh}
            disabled={isRefreshing}
            title="Refresh Data from API"
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-white/5 transition-all disabled:opacity-50 active:scale-95"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-indigo-600 dark:text-indigo-400' : ''}`} />
          </button>

          {/* Theme Switcher */}
          <button
            id="btn-header-theme-toggle"
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-all active:scale-95"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600 hover:-rotate-12 transition-transform" />
            )}
          </button>

          {/* Add Product Button with Neo-SaaS Gradient */}
          <button
            id="btn-header-add-product"
            onClick={onOpenQuickAdd}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-600 hover:from-indigo-500 hover:to-violet-500 active:scale-[0.98] text-white font-bold text-xs shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Product</span>
          </button>
        </div>
      </div>
    </header>
  );
}
