import React from 'react';
import {
  LayoutDashboard,
  Package,
  BarChart3,
  ShoppingBag,
  X,
  Warehouse,
  ChevronLeft,
  ChevronRight,
  Radio,
  Sparkles,
  Layers,
} from 'lucide-react';
import { OmniVaultLogo } from '../common/OmniVaultLogo';

export function Sidebar({
  isOpen = false,
  onClose,
  totalProductsCount = 0,
  activeTab = 'overview',
  onTabChange,
  isCollapsed = false,
  onToggleCollapse,
  isApiActive = true,
  onToggleApi,
}) {
  const navItems = [
    { label: 'Dashboard Overview', icon: LayoutDashboard, id: 'overview' },
    { label: 'Products & Catalog', icon: Package, id: 'products', count: totalProductsCount },
    { label: 'Inventory Health', icon: Warehouse, id: 'inventory' },
    { label: 'Analytics & Insights', icon: BarChart3, id: 'analytics' },
    { label: 'Purchase Orders', icon: ShoppingBag, id: 'orders' },
  ];

  const renderSidebarContent = (isMobile = false) => {
    const collapsed = !isMobile && isCollapsed;

    return (
      <div className="flex flex-col h-full">
        {/* Header Branding */}
        <div className={`flex items-center ${collapsed ? 'justify-between px-2.5' : 'justify-between px-4'} h-16 border-b border-slate-200/80 dark:border-white/5`}>
          {collapsed ? (
            /* Collapsed State: Logo fully visible with expand chevron */
            <div className="flex items-center justify-between w-full">
              <div
                onClick={() => onTabChange && onTabChange('products')}
                className="cursor-pointer transition-transform hover:scale-105 active:scale-95 shrink-0 flex items-center justify-center"
                title="OmniVault (Return to Catalog)"
              >
                <OmniVaultLogo size={36} />
              </div>

              {onToggleCollapse && (
                <button
                  onClick={onToggleCollapse}
                  className="p-1 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors focus:outline-none outline-none shrink-0"
                  title="Expand sidebar"
                >
                  <ChevronRight className="w-4 h-4 shrink-0" />
                </button>
              )}
            </div>
          ) : (
            /* Expanded State: Full Brand Title, API ON badge & Collapse Toggle */
            <>
              <div className="flex items-center gap-3 min-w-0">
                <div
                  onClick={() => onTabChange && onTabChange('products')}
                  className="cursor-pointer transition-transform hover:scale-105 active:scale-95 shrink-0 flex items-center justify-center"
                  title="OmniVault"
                >
                  <OmniVaultLogo size={36} />
                </div>

                <div className="min-w-0">
                  <span
                    onClick={() => onTabChange && onTabChange('products')}
                    className="font-heading font-extrabold text-base text-slate-900 dark:text-white tracking-tight cursor-pointer truncate block leading-none"
                  >
                    OmniVault
                  </span>

                  {/* API ON / API OFF button in place of Enterprise Catalog */}
                  <div className="mt-1">
                    <button
                      id="btn-sidebar-api-toggle"
                      onClick={onToggleApi}
                      title={isApiActive ? "REST API Connected (Click to simulate offline)" : "REST API Disconnected (Click to re-connect)"}
                      className={`inline-flex items-center gap-1 text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded-md font-mono transition-all border cursor-pointer active:scale-95 focus:outline-none outline-none ${
                        isApiActive
                          ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/25'
                          : 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border-rose-500/25'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${isApiActive ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                      <span>{isApiActive ? 'API ON' : 'API OFF'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Desktop collapse toggle or mobile close */}
              {isMobile ? (
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors focus:outline-none outline-none"
                  title="Close sidebar"
                >
                  <X className="w-5 h-5" />
                </button>
              ) : onToggleCollapse ? (
                <button
                  onClick={onToggleCollapse}
                  className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors focus:outline-none outline-none"
                  title="Collapse sidebar"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              ) : null}
            </>
          )}
        </div>

        {/* Scrollable Navigation Area */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {/* Main Navigation Menu */}
          <div>
            {!collapsed && (
              <div className="px-2 mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                Main Menu
              </div>
            )}
            <nav className="space-y-1">
              {navItems.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (onTabChange) onTabChange(item.id);
                      if (isMobile && onClose) onClose();
                    }}
                    title={collapsed ? item.label : undefined}
                    className={`w-full flex items-center ${collapsed ? 'justify-center' : 'justify-between'} px-3 py-2.5 rounded-xl text-xs font-semibold transition-all focus:outline-none outline-none ${
                      isActive
                        ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/20 font-bold'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <div className={`flex items-center ${collapsed ? '' : 'gap-2.5'}`}>
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-400'}`} />
                      {!collapsed && <span>{item.label}</span>}
                    </div>

                    {!collapsed && item.count !== undefined && (
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-md font-mono ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Bottom Status Card */}
        <div className="p-3 border-t border-slate-200/80 dark:border-white/5">
          {!collapsed ? (
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#090d16]/80 border border-slate-200/80 dark:border-white/5 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                  <span className={`w-2 h-2 rounded-full ${isApiActive ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                  <span className="text-[11px] font-mono">{isApiActive ? 'API Gateway Live' : 'API Offline'}</span>
                </div>
                {onToggleApi && (
                  <button
                    onClick={onToggleApi}
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md transition-colors ${
                      isApiActive
                        ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400 hover:bg-rose-100'
                        : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400 hover:bg-emerald-100'
                    }`}
                  >
                    {isApiActive ? 'Pause' : 'Connect'}
                  </button>
                )}
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                {isApiActive ? `${totalProductsCount} products synced via DummyJSON REST API.` : 'Sync is paused. Displaying local cache.'}
              </p>
            </div>
          ) : (
            <div className="flex justify-center" title={isApiActive ? 'REST API Connected' : 'REST API Offline'}>
              <span className={`w-2.5 h-2.5 rounded-full ${isApiActive ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* 1. Desktop Persistent Sidebar */}
      <aside
        id="desktop-sidebar"
        className={`hidden lg:flex flex-col sticky top-0 h-screen shrink-0 bg-white/95 dark:bg-[#0c121e]/95 backdrop-blur-xl border-r border-slate-200/80 dark:border-white/5 transition-all duration-300 z-40 ${
          isCollapsed ? 'w-[84px]' : 'w-64 xl:w-72'
        }`}
      >
        {renderSidebarContent(false)}
      </aside>

      {/* 2. Mobile / Tablet Off-Canvas Drawer */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 lg:hidden transition-opacity"
        />
      )}

      <aside
        id="mobile-sidebar"
        className={`fixed top-0 left-0 bottom-0 z-50 w-72 bg-white/95 dark:bg-[#0c121e]/95 backdrop-blur-xl border-r border-slate-200/80 dark:border-white/5 flex flex-col transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {renderSidebarContent(true)}
      </aside>
    </>
  );
}
