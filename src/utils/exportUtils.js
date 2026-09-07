import { formatCurrency, formatCategoryName } from './formatters';

/**
 * Export products as CSV file
 */
export function exportProductsToCSV(products = [], filename = 'aura_products_catalog.csv') {
  if (!products || !products.length) {
    alert('No products available to export.');
    return;
  }

  const headers = [
    'ID',
    'SKU',
    'Title',
    'Brand',
    'Category',
    'Price ($)',
    'Discount (%)',
    'Stock Units',
    'Inventory Value ($)',
    'Rating (out of 5)',
    'Warranty',
    'Shipping',
    'Barcode',
  ];

  const rows = products.map(p => {
    const invValue = ((p.price || 0) * (p.stock || 0)).toFixed(2);
    return [
      p.id,
      `"${(p.sku || '').replace(/"/g, '""')}"`,
      `"${(p.title || '').replace(/"/g, '""')}"`,
      `"${(p.brand || '').replace(/"/g, '""')}"`,
      `"${(p.category || '').replace(/"/g, '""')}"`,
      (p.price || 0).toFixed(2),
      p.discountPercentage || 0,
      p.stock || 0,
      invValue,
      p.rating || 0,
      `"${(p.warrantyInformation || '').replace(/"/g, '""')}"`,
      `"${(p.shippingInformation || '').replace(/"/g, '""')}"`,
      `"${(p.meta?.barcode || '').replace(/"/g, '""')}"`,
    ];
  });

  const csvContent = [
    headers.join(','),
    ...rows.map(r => r.join(',')),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  downloadBlob(blob, filename);
}

/**
 * Export products as JSON file
 */
export function exportProductsToJSON(products = [], filename = 'aura_products_catalog.json') {
  if (!products || !products.length) {
    alert('No products available to export.');
    return;
  }

  const exportPayload = {
    generatedAt: new Date().toISOString(),
    totalCount: products.length,
    catalog: products,
  };

  const jsonContent = JSON.stringify(exportPayload, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
  downloadBlob(blob, filename);
}

/**
 * Export products as printable PDF Report
 */
export function exportProductsToPDF(products = [], title = 'AURA StoreOps — Products Catalog Report') {
  if (!products || !products.length) {
    alert('No products available to export.');
    return;
  }

  const totalValuation = products.reduce((acc, p) => acc + (p.price || 0) * (p.stock || 0), 0);
  const totalUnits = products.reduce((acc, p) => acc + (p.stock || 0), 0);
  const avgRating = (products.reduce((acc, p) => acc + (p.rating || 0), 0) / products.length).toFixed(2);
  const dateStr = new Date().toLocaleString();

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups for this site to generate the PDF report.');
    return;
  }

  const tableRows = products.map((p, idx) => `
    <tr style="border-bottom: 1px solid #e2e8f0; font-size: 11px;">
      <td style="padding: 6px 8px; font-family: monospace; color: #64748b;">#${idx + 1}</td>
      <td style="padding: 6px 8px; font-weight: 600; color: #0f172a;">${escapeHtml(p.title)}</td>
      <td style="padding: 6px 8px; color: #475569;">${escapeHtml(formatCategoryName(p.category))}</td>
      <td style="padding: 6px 8px; font-family: monospace; font-weight: bold; color: #0f172a;">${formatCurrency(p.price)}</td>
      <td style="padding: 6px 8px; font-family: monospace; color: ${p.stock < 10 ? '#b45309' : '#047857'}; font-weight: 600;">${p.stock} units</td>
      <td style="padding: 6px 8px; font-weight: 600; color: #d97706;">★ ${p.rating}</td>
      <td style="padding: 6px 8px; font-family: monospace; font-weight: bold; color: #0f172a;">${formatCurrency((p.price || 0) * (p.stock || 0))}</td>
    </tr>
  `).join('');

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${escapeHtml(title)}</title>
        <style>
          @page { size: A4 portrait; margin: 15mm; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            color: #0f172a;
            margin: 0;
            padding: 20px;
            background: #ffffff;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            border-bottom: 2px solid #10b981;
            padding-bottom: 14px;
            margin-bottom: 18px;
          }
          .brand {
            font-size: 22px;
            font-weight: 800;
            color: #0f172a;
            letter-spacing: -0.5px;
          }
          .badge {
            display: inline-block;
            background: #ecfdf5;
            color: #065f46;
            font-size: 10px;
            font-weight: 700;
            padding: 2px 6px;
            border-radius: 4px;
            margin-left: 6px;
          }
          .meta {
            text-align: right;
            font-size: 11px;
            color: #64748b;
          }
          .kpi-row {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 12px;
            margin-bottom: 20px;
          }
          .kpi-card {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 10px 12px;
          }
          .kpi-title {
            font-size: 10px;
            text-transform: uppercase;
            font-weight: 700;
            color: #64748b;
          }
          .kpi-val {
            font-size: 16px;
            font-weight: 800;
            color: #0f172a;
            font-family: monospace;
            margin-top: 2px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            text-align: left;
          }
          th {
            background: #f1f5f9;
            color: #475569;
            font-size: 10px;
            font-weight: 700;
            text-transform: uppercase;
            padding: 8px;
            border-bottom: 2px solid #cbd5e1;
          }
          tr:nth-child(even) { background-color: #f8fafc; }
          .footer {
            margin-top: 24px;
            border-top: 1px solid #e2e8f0;
            padding-top: 10px;
            display: flex;
            justify-content: space-between;
            font-size: 10px;
            color: #94a3b8;
          }
          .no-print-bar {
            margin-bottom: 16px;
            padding: 10px 14px;
            background: #ecfdf5;
            border: 1px solid #a7f3d0;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: space-between;
          }
          @media print {
            .no-print-bar { display: none; }
            body { padding: 0; }
          }
        </style>
      </head>
      <body>
        <div class="no-print-bar">
          <span style="font-size: 12px; font-weight: 600; color: #065f46;">
            📄 Report ready. Select "Save as PDF" in the destination dropdown.
          </span>
          <button onclick="window.print()" style="background: #10b981; color: white; border: none; padding: 6px 14px; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 12px;">
            Print / Save as PDF
          </button>
        </div>

        <div class="header">
          <div>
            <div class="brand">AURA <span class="badge">StoreOps Audit Report</span></div>
            <div style="font-size: 12px; color: #475569; margin-top: 3px;">
              Connected: DummyJSON REST API Catalog
            </div>
          </div>
          <div class="meta">
            <div><strong>Generated:</strong> ${dateStr}</div>
            <div><strong>Status:</strong> Verified Live Catalog</div>
          </div>
        </div>

        <div class="kpi-row">
          <div class="kpi-card">
            <div class="kpi-title">Total Products</div>
            <div class="kpi-val">${products.length} Items</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-title">Warehouse Units</div>
            <div class="kpi-val">${totalUnits.toLocaleString()}</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-title">Total Valuation</div>
            <div class="kpi-val">${formatCurrency(totalValuation)}</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-title">Average Rating</div>
            <div class="kpi-val">★ ${avgRating} / 5.0</div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Product Title</th>
              <th>Category</th>
              <th>Unit Price</th>
              <th>Stock</th>
              <th>Rating</th>
              <th>Inventory Value</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>

        <div class="footer">
          <span>AURA StoreOps • Generated via REST API Integration</span>
          <span>Page 1 of 1</span>
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 350);
          };
        </script>
      </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
