import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  ArrowRight,
  Package,
  Warehouse,
  BarChart3,
  ShoppingBag,
  Plus,
  Download,
  Power,
  Sun,
  Moon,
  Clock,
  ExternalLink,
  Command,
  X,
} from 'lucide-react';
import { formatCurrency, formatCategoryName } from '../../utils/formatters';

export function CommandPalette({
  isOpen,
  onClose,
  onNavigateTab,
  onOpenQuickAdd,
  onToggleApi,
  isApiActive,
  onToggleTheme,
  theme,
  onOpenActivityLog,
  onExportPDF,
  products = [],
  onSelectProduct,
}) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Global keydown handler for Cmd+K / Ctrl+K and Esc
  useEffect(() => {
    function handleKeyDown(e) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open handled by parent or trigger
        }
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Base Commands
  const navigationItems = [
    {
      id: 'nav-products',
      group: 'Navigation',
      label: 'Go to Products Catalog',
      icon: Package,
      action: () => {
        onNavigateTab('products');
        onClose();
      },
    },
    {
      id: 'nav-inventory',
      group: 'Navigation',
      label: 'Go to Inventory & Stock Health',
      icon: Warehouse,
      action: () => {
        onNavigateTab('inventory');
        onClose();
      },
    },
    {
      id: 'nav-analytics',
      group: 'Navigation',
      label: 'Go to Catalog Analytics',
      icon: BarChart3,
      action: () => {
        onNavigateTab('analytics');
        onClose();
      },
    },
    {
      id: 'nav-orders',
      group: 'Navigation',
      label: 'Go to Purchase Orders',
      icon: ShoppingBag,
      action: () => {
        onNavigateTab('orders');
        onClose();
      },
    },
  ];

  const actionItems = [
    {
      id: 'act-add-product',
      group: 'Actions',
      label: 'Add New Product to Inventory',
      icon: Plus,
      shortcut: 'N',
      action: () => {
        onClose();
        onOpenQuickAdd();
      },
    },
    {
      id: 'act-export-pdf',
      group: 'Actions',
      label: 'Generate & Export PDF Audit Report',
      icon: Download,
      action: () => {
        onClose();
        onExportPDF();
      },
    },
    {
      id: 'act-toggle-api',
      group: 'Actions',
      label: isApiActive ? 'Turn API Gateway OFF' : 'Turn API Gateway ON',
      icon: Power,
      action: () => {
        onToggleApi();
        onClose();
      },
    },
    {
      id: 'act-activity-log',
      group: 'Actions',
      label: 'View Store Operations Audit Log',
      icon: Clock,
      action: () => {
        onClose();
        onOpenActivityLog();
      },
    },
    {
      id: 'act-toggle-theme',
      group: 'Actions',
      label: theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme',
      icon: theme === 'dark' ? Sun : Moon,
      action: () => {
        onToggleTheme();
        onClose();
      },
    },
  ];

  // Matching Products
  const matchingProducts = query.trim()
    ? products
        .filter(p =>
          (p.title || '').toLowerCase().includes(query.toLowerCase()) ||
          (p.brand || '').toLowerCase().includes(query.toLowerCase()) ||
          (p.category || '').toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 5)
        .map(p => ({
          id: `prod-${p.id}`,
          group: 'Products',
          label: p.title,
          sublabel: `${formatCategoryName(p.category)} • ${formatCurrency(p.price)}`,
          thumbnail: p.thumbnail,
          action: () => {
            onClose();
            onSelectProduct(p);
          },
        }))
    : [];

  const filteredNav = navigationItems.filter(item =>
    item.label.toLowerCase().includes(query.toLowerCase())
  );
  const filteredActions = actionItems.filter(item =>
    item.label.toLowerCase().includes(query.toLowerCase())
  );

  const allFilteredItems = [
    ...matchingProducts,
    ...filteredNav,
    ...filteredActions,
  ];

  // Arrow key navigation
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % (allFilteredItems.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + (allFilteredItems.length || 1)) % (allFilteredItems.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (allFilteredItems[selectedIndex]) {
        allFilteredItems[selectedIndex].action();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
      />

      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
        {/* Command Search Bar */}
        <div className="flex items-center px-4 border-b border-slate-200 dark:border-slate-800">
          <Search className="w-5 h-5 text-slate-400 mr-3 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type a command, product name, or jump to page..."
            className="w-full py-4 text-sm bg-transparent text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded">
              ESC
            </kbd>
          )}
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
          {allFilteredItems.length === 0 ? (
            <div className="py-8 text-center text-slate-400">
              No matching commands or products found for "{query}".
            </div>
          ) : (
            <>
              {/* Matching Products */}
              {matchingProducts.length > 0 && (
                <div className="py-1">
                  <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Products ({matchingProducts.length})
                  </div>
                  {matchingProducts.map((item, idx) => {
                    const isSelected = selectedIndex === idx;
                    return (
                      <div
                        key={item.id}
                        onClick={item.action}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={`px-3 py-2 rounded-xl flex items-center justify-between cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-200'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img
                            src={item.thumbnail}
                            alt=""
                            className="w-7 h-7 rounded-lg object-contain bg-slate-100 dark:bg-slate-800 p-0.5"
                          />
                          <div className="truncate">
                            <span className="font-bold block truncate">{item.label}</span>
                            <span className="text-[10px] text-slate-400">{item.sublabel}</span>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Navigation */}
              {filteredNav.length > 0 && (
                <div className="py-1">
                  <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Navigation
                  </div>
                  {filteredNav.map((item, idx) => {
                    const realIndex = matchingProducts.length + idx;
                    const isSelected = selectedIndex === realIndex;
                    const Icon = item.icon;
                    return (
                      <div
                        key={item.id}
                        onClick={item.action}
                        onMouseEnter={() => setSelectedIndex(realIndex)}
                        className={`px-3 py-2 rounded-xl flex items-center justify-between cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-200'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          <span className="font-semibold">{item.label}</span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400">Jump</span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Actions */}
              {filteredActions.length > 0 && (
                <div className="py-1">
                  <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Actions & Settings
                  </div>
                  {filteredActions.map((item, idx) => {
                    const realIndex = matchingProducts.length + filteredNav.length + idx;
                    const isSelected = selectedIndex === realIndex;
                    const Icon = item.icon;
                    return (
                      <div
                        key={item.id}
                        onClick={item.action}
                        onMouseEnter={() => setSelectedIndex(realIndex)}
                        className={`px-3 py-2 rounded-xl flex items-center justify-between cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-200'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                          <span className="font-semibold">{item.label}</span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400">Run</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-850/80 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span>Use <kbd className="font-mono bg-white dark:bg-slate-800 px-1 py-0.5 rounded border border-slate-200 dark:border-slate-700">↑</kbd> <kbd className="font-mono bg-white dark:bg-slate-800 px-1 py-0.5 rounded border border-slate-200 dark:border-slate-700">↓</kbd> to navigate</span>
            <span><kbd className="font-mono bg-white dark:bg-slate-800 px-1 py-0.5 rounded border border-slate-200 dark:border-slate-700">↵</kbd> to select</span>
          </div>
          <span>AURA Spotlight</span>
        </div>
      </div>
    </div>
  );
}
