import React, { useState } from 'react';
import {
  ShoppingBag,
  Truck,
  CheckCircle,
  Clock,
  Plus,
  ArrowUpRight,
  Filter,
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export function OrdersView() {
  const [orders, setOrders] = useState([
    {
      id: 'PO-8831',
      supplier: 'Apex Global Logistics',
      date: '2026-09-02',
      itemsCount: 150,
      totalCost: 3840.00,
      status: 'In Transit',
      eta: 'Tomorrow, 2:00 PM',
    },
    {
      id: 'PO-8829',
      supplier: 'Velox Manufacturing Co.',
      date: '2026-08-30',
      itemsCount: 80,
      totalCost: 1950.50,
      status: 'Delivered',
      eta: 'Delivered on Sep 1',
    },
    {
      id: 'PO-8825',
      supplier: 'DirectTech Electronics',
      date: '2026-08-28',
      itemsCount: 220,
      totalCost: 14200.00,
      status: 'Delivered',
      eta: 'Delivered on Aug 30',
    },
    {
      id: 'PO-8819',
      supplier: 'OmniBeauty Imports',
      date: '2026-08-25',
      itemsCount: 65,
      totalCost: 890.00,
      status: 'Processing',
      eta: 'Estimated Sep 5',
    },
    {
      id: 'PO-8812',
      supplier: 'Nordic Homecraft Ltd',
      date: '2026-08-20',
      itemsCount: 40,
      totalCost: 2600.00,
      status: 'Delivered',
      eta: 'Delivered on Aug 23',
    },
  ]);

  const [showNewOrderModal, setShowNewOrderModal] = useState(false);
  const [newOrder, setNewOrder] = useState({
    supplier: '',
    itemsCount: 50,
    totalCost: 1200,
  });

  const handleCreateOrder = (e) => {
    e.preventDefault();
    if (!newOrder.supplier) return;

    const created = {
      id: `PO-${Math.floor(8840 + Math.random() * 100)}`,
      supplier: newOrder.supplier,
      date: new Date().toISOString().split('T')[0],
      itemsCount: Number(newOrder.itemsCount),
      totalCost: Number(newOrder.totalCost),
      status: 'Processing',
      eta: 'Ships in 3-5 days',
    };

    setOrders([created, ...orders]);
    setShowNewOrderModal(false);
    setNewOrder({ supplier: '', itemsCount: 50, totalCost: 1200 });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60';
      case 'In Transit':
        return 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border-blue-200 dark:border-blue-800/60';
      case 'Processing':
      default:
        return 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200 dark:border-amber-800/60';
    }
  };

  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <div className="surface-card rounded-2xl p-5 shadow-xs hover-lift hover:shadow-card-hover group cursor-default transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Purchase Orders</span>
            <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-emerald-600 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-2 font-mono group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-200">
            {orders.length} Orders
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Active supplier logs</span>
        </div>

        <div className="surface-card rounded-2xl p-5 shadow-xs hover-lift hover:shadow-card-hover group cursor-default transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Shipments in Transit</span>
            <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-blue-500 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
              <Truck className="w-5 h-5" />
            </div>
          </div>
          <div className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-2 font-mono group-hover:text-blue-500 transition-colors duration-200">
            {orders.filter(o => o.status === 'In Transit').length}
          </div>
          <span className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold mt-1 block">
            Expected this week
          </span>
        </div>

        <div className="surface-card rounded-2xl p-5 shadow-xs hover-lift hover:shadow-card-hover group cursor-default transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Delivered</span>
            <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-emerald-500 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-2 font-mono group-hover:text-emerald-500 transition-colors duration-200">
            {orders.filter(o => o.status === 'Delivered').length}
          </div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1 block">
            Stock received in warehouse
          </span>
        </div>

        <div className="surface-card rounded-2xl p-5 shadow-xs hover-lift hover:shadow-card-hover group cursor-default transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Expenditure</span>
            <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-amber-500 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-2 font-mono group-hover:text-amber-500 transition-colors duration-200">
            {formatCurrency(orders.reduce((sum, o) => sum + o.totalCost, 0))}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Procurement total</span>
        </div>
      </div>

      {/* Orders Table Container */}
      <div className="surface-card rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="font-heading text-lg font-bold text-slate-900 dark:text-white">
              Stock Replenishment & Purchase Orders
            </h3>
            <p className="text-xs text-slate-500">
              Track vendor deliveries and place new restocking shipments.
            </p>
          </div>

          <button
            onClick={() => setShowNewOrderModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            New Purchase Order
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850/60 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <th className="py-3 px-4">PO Number</th>
                <th className="py-3 px-4">Supplier</th>
                <th className="py-3 px-4">Order Date</th>
                <th className="py-3 px-4">Units</th>
                <th className="py-3 px-4">Total Amount</th>
                <th className="py-3 px-4">Delivery Status</th>
                <th className="py-3 px-4">ETA / Timeline</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {orders.map(o => (
                <tr key={o.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-white">
                    {o.id}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-200">
                    {o.supplier}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">
                    {o.date}
                  </td>
                  <td className="py-3.5 px-4 font-mono">
                    {o.itemsCount} units
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-white">
                    {formatCurrency(o.totalCost)}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusBadge(o.status)}`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                    {o.eta}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Purchase Order Modal */}
      {showNewOrderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setShowNewOrderModal(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
          />

          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl z-10 space-y-4">
            <h3 className="font-heading text-lg font-bold text-slate-900 dark:text-white">
              Create Stock Purchase Order
            </h3>
            <form onSubmit={handleCreateOrder} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Supplier / Vendor Name *
                </label>
                <input
                  type="text"
                  required
                  value={newOrder.supplier}
                  onChange={e => setNewOrder({ ...newOrder, supplier: e.target.value })}
                  placeholder="e.g. Apex Logistics, Global Tech"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Units to Order *
                  </label>
                  <input
                    type="number"
                    required
                    value={newOrder.itemsCount}
                    onChange={e => setNewOrder({ ...newOrder, itemsCount: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Total Estimated Cost ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newOrder.totalCost}
                    onChange={e => setNewOrder({ ...newOrder, totalCost: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewOrderModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-500 font-bold hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                >
                  Confirm Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
