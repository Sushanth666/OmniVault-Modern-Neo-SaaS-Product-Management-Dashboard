import React, { useState, useRef, useEffect } from 'react';
import {
  Bell,
  AlertTriangle,
  Package,
  Truck,
  Check,
  CheckCheck,
  Plus,
  Trash2,
  ExternalLink,
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export function NotificationCenter({
  lowStockProducts = [],
  onRestockProduct,
  onSelectProduct,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [readIds, setReadIds] = useState(new Set());
  const dropdownRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Generate notification items based on actual store conditions
  const lowStockAlerts = lowStockProducts.slice(0, 3).map(p => ({
    id: `alert-stock-${p.id}`,
    type: 'warning',
    title: `Critical Stock: ${p.title}`,
    message: `Only ${p.stock} units remaining in warehouse. Reorder recommended.`,
    time: 'Urgent',
    product: p,
    canRestock: true,
  }));

  const systemNotifications = [
    {
      id: 'notif-order-shipment',
      type: 'info',
      title: 'Shipment #PO-8831 In Transit',
      message: 'Apex Global Logistics shipment arriving tomorrow at 2:00 PM.',
      time: '2h ago',
    },
    {
      id: 'notif-catalog-sync',
      type: 'success',
      title: 'DummyJSON REST Sync Active',
      message: '194 products indexed and synchronized successfully.',
      time: '5h ago',
    },
  ];

  const allNotifications = [...lowStockAlerts, ...systemNotifications];
  const unreadCount = allNotifications.filter(n => !readIds.has(n.id)).length;

  const markAllAsRead = () => {
    setReadIds(new Set(allNotifications.map(n => n.id)));
  };

  const toggleRead = (id) => {
    setReadIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        id="btn-header-notifications"
        onClick={() => setIsOpen(prev => !prev)}
        className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all relative"
        title="Notifications & Inventory Alerts"
      >
        <Bell className="w-4 h-4 text-slate-600 dark:text-slate-300" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="font-heading font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                Notifications
              </span>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 font-mono font-bold text-[10px]">
                  {unreadCount} new
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark read</span>
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
            {allNotifications.map(item => {
              const isUnread = !readIds.has(item.id);
              return (
                <div
                  key={item.id}
                  className={`p-3.5 transition-colors space-y-1.5 ${
                    isUnread
                      ? 'bg-slate-50/60 dark:bg-slate-850/40'
                      : 'hover:bg-slate-50/40 dark:hover:bg-slate-800/30 opacity-75'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {item.type === 'warning' ? (
                        <div className="w-5 h-5 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center flex-shrink-0">
                          <AlertTriangle className="w-3 h-3" />
                        </div>
                      ) : item.type === 'info' ? (
                        <div className="w-5 h-5 rounded-md bg-blue-100 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center flex-shrink-0">
                          <Truck className="w-3 h-3" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center flex-shrink-0">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                      <span className="font-bold text-slate-800 dark:text-slate-200 text-xs line-clamp-1">
                        {item.title}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono whitespace-nowrap">
                      {item.time}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 pl-7 leading-relaxed">
                    {item.message}
                  </p>

                  {/* Inline Action for Low Stock items */}
                  {item.canRestock && item.product && (
                    <div className="pl-7 pt-1 flex items-center gap-2">
                      <button
                        onClick={() => {
                          onRestockProduct && onRestockProduct(item.product.id, 50);
                          toggleRead(item.id);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] shadow-2xs transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Reorder +50 Units</span>
                      </button>
                      <button
                        onClick={() => {
                          setIsOpen(false);
                          onSelectProduct && onSelectProduct(item.product);
                        }}
                        className="text-[10px] font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                      >
                        View SKU
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800 text-center text-[10px] text-slate-400">
            Real-time threshold alerts enabled
          </div>
        </div>
      )}
    </div>
  );
}
