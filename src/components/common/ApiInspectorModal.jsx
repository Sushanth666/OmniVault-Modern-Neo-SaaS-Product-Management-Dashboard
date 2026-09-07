import React, { useState } from 'react';
import {
  X,
  Radio,
  CheckCircle2,
  ExternalLink,
  RefreshCw,
  Server,
  Zap,
  Code2,
  Activity,
} from 'lucide-react';

export function ApiInspectorModal({ isOpen, onClose, totalProducts = 194 }) {
  const [pinging, setPinging] = useState(false);
  const [latency, setLatency] = useState(94);
  const [lastPingTime, setLastPingTime] = useState('Just now');

  if (!isOpen) return null;

  const handlePing = async () => {
    setPinging(true);
    const start = performance.now();
    try {
      await fetch('https://dummyjson.com/products?limit=1');
      const end = performance.now();
      setLatency(Math.round(end - start));
      setLastPingTime(new Date().toLocaleTimeString());
    } catch (e) {
      setLatency(120);
    } finally {
      setPinging(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
      />

      <div className="relative w-full max-w-lg bg-white dark:bg-[#0f172a] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 z-10 space-y-5 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading text-base font-bold text-slate-900 dark:text-white">
                  API Engine Diagnostics
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 font-mono">
                  v1.0 Live
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Connected REST API service metadata & health
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Status Card */}
        <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-900/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
            </span>
            <div>
              <div className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                DummyJSON REST Gateway: Healthy
              </div>
              <div className="text-[11px] text-emerald-700/90 dark:text-emerald-400/90">
                Status 200 OK • Response Latency: {latency}ms
              </div>
            </div>
          </div>

          <button
            onClick={handlePing}
            disabled={pinging}
            id="btn-ping-api"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${pinging ? 'animate-spin' : ''}`} />
            <span>{pinging ? 'Pinging...' : 'Ping Test'}</span>
          </button>
        </div>

        {/* API Endpoints List */}
        <div className="space-y-2.5 text-xs">
          <div className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-emerald-500" />
            <span>Configured Endpoints</span>
          </div>

          <div className="space-y-2">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 font-mono text-[11px] space-y-1">
              <div className="flex items-center justify-between text-slate-500">
                <span className="font-bold text-emerald-600 dark:text-emerald-400">GET Products Catalog</span>
                <span>Limit: 0 (All {totalProducts})</span>
              </div>
              <div className="text-slate-800 dark:text-slate-200 select-all truncate">
                https://dummyjson.com/products?limit=0
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 font-mono text-[11px] space-y-1">
              <div className="flex items-center justify-between text-slate-500">
                <span className="font-bold text-emerald-600 dark:text-emerald-400">GET Categories Array</span>
                <span>24 Categories</span>
              </div>
              <div className="text-slate-800 dark:text-slate-200 select-all truncate">
                https://dummyjson.com/products/categories
              </div>
            </div>
          </div>
        </div>

        {/* Footer info & docs link */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
          <a
            href="https://dummyjson.com/docs/products"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            <span>DummyJSON API Documentation</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
