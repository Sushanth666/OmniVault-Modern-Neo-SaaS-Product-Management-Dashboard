# ⚡ OmniVault — Modern Neo-SaaS Product & Inventory Management Dashboard

[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.2-646C9F?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-emerald?style=for-the-badge)](LICENSE)
[![DummyJSON API](https://img.shields.io/badge/API-DummyJSON_REST-orange?style=for-the-badge)](https://dummyjson.com/products)

**OmniVault** is an enterprise-grade, high-performance Product & Inventory Management Operating System built from the ground up with **React 19, Vite, and Tailwind CSS**. Integrating live data from the **DummyJSON REST API**, OmniVault provides e-commerce merchants, store operators, and warehouse managers with an all-in-one console for catalog management, stock replenishment, merchandising analysis, and order tracking.

Engineered with a **Modern Neo-SaaS Aesthetic (Shopify / Linear - Emerald & Slate)**, OmniVault features crisp borders, refined porcelain and slate surfaces, typography powered by **Outfit** (headings), **Plus Jakarta Sans** (UI), and **JetBrains Mono** (tabular figures), dual showroom layouts, keyboard-driven navigation, and instant real-time data manipulation.

---

## 📑 Table of Contents

- [Architectural Overview](#-architectural-overview)
- [Comprehensive Feature Breakdown](#-comprehensive-feature-breakdown)
  - [1. Multi-View Operating System](#1-multi-view-operating-system)
  - [2. Dual View Modes: Showroom Grid & Enterprise Table](#2-dual-view-modes-showroom-grid--enterprise-table)
  - [3. Live Search, Deep Filtering & Smart Segments](#3-live-search-deep-filtering--smart-segments)
  - [4. Inline Data Table Editing](#4-inline-data-table-editing)
  - [5. Floating Bulk Actions Dock](#5-floating-bulk-actions-dock)
  - [6. Multi-Format Export Engine (CSV, JSON & PDF)](#6-multi-format-export-engine-csv-json--pdf)
  - [7. Side-by-Side Product Comparison Matrix](#7-side-by-side-product-comparison-matrix)
  - [8. Retail Shelf Tag & Barcode Generator](#8-retail-shelf-tag--barcode-generator)
  - [9. Unit Economics & Profit Margin Simulator](#9-unit-economics--profit-margin-simulator)
  - [10. Quick Add Product & Media Dropzone](#10-quick-add-product--media-dropzone)
  - [11. Global Spotlight Command Palette (⌘K / Ctrl+K)](#11-global-spotlight-command-palette-k--ctrlk)
  - [12. Real-Time Stock Alerts & Notification Center](#12-real-time-stock-alerts--notification-center)
  - [13. Operations Audit Trail & Activity Log](#13-operations-audit-trail--activity-log)
  - [14. Live API Gateway Controller & REST Inspector](#14-live-api-gateway-controller--rest-inspector)
  - [15. Adaptive Dark & Light Themes](#15-adaptive-dark--light-themes)
- [Tech Stack & Dependencies](#-tech-stack--dependencies)
- [Project Directory Architecture](#-project-directory-architecture)
- [API Integration & Data Flow](#-api-integration--data-flow)
- [Keyboard Shortcuts Reference](#-keyboard-shortcuts-reference)
- [Installation & Setup](#-installation--setup)
- [Scripts & Production Build](#-scripts--production-build)
- [Contributing & License](#-contributing--license)

---

## 🏗️ Architectural Overview

OmniVault adopts a decoupled, component-driven architecture designed for high maintainability, zero unnecessary re-renders, and instant user responsiveness:

```
                          ┌──────────────────────────┐
                          │   DummyJSON REST API     │
                          │ (https://dummyjson.com)  │
                          └─────────────┬────────────┘
                                        │
                                        ▼
                          ┌──────────────────────────┐
                          │    productApi Service    │
                          │  (Query Param Builder)   │
                          └─────────────┬────────────┘
                                        │
                                        ▼
                          ┌──────────────────────────┐
                          │     useProducts Hook     │
                          │ (Caching, Local State,   │
                          │  Optimistic Updates)     │
                          └─────────────┬────────────┘
                                        │
            ┌───────────────────────────┼───────────────────────────┐
            ▼                           ▼                           ▼
┌───────────────────────┐   ┌───────────────────────┐   ┌───────────────────────┐
│   Overview / Catalog  │   │  Inventory & Storage  │   │ Analytics & Valuation │
│ - Showroom Grid       │   │ - Warehouse Stock     │   │ - Revenue Valuation   │
│ - Enterprise Table    │   │ - Low-Stock Alerts    │   │ - Star Rating Spread  │
│ - Bulk Floating Dock  │   │ - Rapid Replenish     │   │ - Margin Breakdown    │
└───────────────────────┘   └───────────────────────┘   └───────────────────────┘
```

- **Optimistic State Management**: Inline table edits, quick additions, and restock actions update the local in-memory state immediately so UI updates are instantaneous.
- **Debounced Network Requests**: Search queries pass through custom `useDebounce` hooks to avoid network flooding and rate-limiting while typing.
- **Non-Destructive Operations**: Merchandising filters, sorting rules, and custom views are applied dynamically on the active dataset without losing pagination state.

---

## 🌟 Comprehensive Feature Breakdown

### 1. Multi-View Operating System
Switch between four dedicated operational workspaces via the sidebar navigation:
- **📦 Products (Catalog Overview)**: Full browse showroom with sorting, live search, multi-select, quick-view modals, and catalog management.
- **🏬 Inventory Management**: Dedicated stock health dashboard featuring warehouse metrics, critically low items (<10 units), out-of-stock items, and one-click `+50 Units` restock triggers.
- **📊 Analytics & Valuation**: Global financial analytics dashboard showing total inventory valuation ($450k+), average item pricing, star rating distribution curves (5★ down to 1★), price tier distribution (Budget, Mid-Tier, Premium, Luxury), and top-rated leaderboards.
- **🚚 Orders & Procurement**: Purchase order tracking with supplier statuses (`In Transit`, `Delivered`, `Processing`), delivery ETAs, unit counts, and a modal to create new replenishment orders.

---

### 2. Dual View Modes: Showroom Grid & Enterprise Table
- **Showroom Grid View**:
  - High-resolution thumbnail previews with smooth hover zooms.
  - Category badges, dynamic stock level indicator chips (Green = In Stock, Amber = Low Stock, Red = Out of Stock).
  - Star ratings with exact review counts.
  - Interactive quick-action buttons: View Details, Edit, Print Tag, and Compare.
- **Enterprise Data Table View**:
  - Dense, spreadsheet-style data grid with fixed header columns.
  - Formatted columns for Product ID, SKU, Title, Category, Rating, Price, Discount, Stock, and Quick Actions.
  - Native multi-select checkboxes for batch operations.
  - In-place inline editing for rapid inventory and pricing adjustments.

---

### 3. Live Search, Deep Filtering & Smart Segments
- **Instant Search**: Real-time product search querying titles, descriptions, brands, and categories with a 300ms debounce.
- **Category Filter Pills**: Horizontally scrollable category selector dynamically loaded from the API (`Smartphones`, `Laptops`, `Fragrances`, `Skincare`, `Groceries`, `Home Decoration`, etc.).
- **Dual Sorting Engine**: Sort by `Price: Low to High`, `Price: High to Low`, `Rating: High to Low`, `Stock: Low to High`, `Discount: High to Low`, or `Alphabetical (A-Z)`.
- **Smart Merchandising Segments**:
  - `All Products`: Complete active catalog.
  - `🔥 Understocked Best-Sellers`: Filters for items with Rating ≥ 4.0 and Stock < 15 *(immediate reorder priority)*.
  - `💎 High-Margin Items`: Filters for items with Price ≥ $100 and Discount < 10%.
  - `🏷️ Clearance Deals`: Filters for items with Discount ≥ 15% and Stock ≥ 30 units.

---

### 4. Inline Data Table Editing
- Edit **Price** and **Stock** values directly inside the table without opening a full modal.
- Click or double-click any numeric cell to activate the inline input editor.
- **Keyboard Controls**:
  - Press `Enter` to commit changes immediately.
  - Press `Esc` to cancel and revert to previous value.
- Changes propagate instantly across overall catalog KPIs, valuation metrics, and the activity log.

---

### 5. Floating Bulk Actions Dock
When one or more products are selected using the grid or table checkboxes, a sleek, floating bottom dock smoothly animates into view:
- **Selection Counter**: Live tally of selected items.
- **⚡ +25 Units Restock**: Replenish stock across all selected products in a single click.
- **🏷️ 15% Flash Discount**: Apply a markdown across selected products for flash sales.
- **📥 Export Selected CSV**: Download an Excel-ready CSV containing only the selected items.
- **⚖️ Compare Selected**: Directly launch the side-by-side comparison modal for the chosen items.
- **🗑️ Bulk Delete**: Remove multiple products from the active catalog with audit logging.
- **Deselect All**: Single-click button to clear all active selections.

---

### 6. Multi-Format Export Engine (CSV, JSON & PDF)
Export your entire catalog or selected subsets with the one-click export dropdown:
- **📊 Export as CSV (.csv)**: Clean, RFC 4180-compliant CSV containing Product ID, SKU, Title, Brand, Category, Price, Discount %, Stock, Valuation, Rating, Warranty, and Shipping Information.
- **📦 Export as JSON (.json)**: Complete formatted JSON payload with ISO timestamp metadata and item counts, ideal for API migration or backups.
- **📑 Export as PDF Audit Report (.pdf)**: High-resolution, professional executive report featuring company branding, summary KPI cards, tabular product breakdown, and auto-print trigger for instant PDF saving.

---

### 7. Side-by-Side Product Comparison Matrix
- Select 2 to 4 products and launch the comparison modal.
- Compare critical metrics in a clean horizontal grid:
  - Product Photography & Badges
  - Retail Price & Promotional Discounts
  - Current Available Stock
  - Customer Rating & Review Counts
  - Brand & Category Classification
  - Warranty Information
  - Shipping & Fulfillment Terms
  - Return Policy
  - Physical Dimensions (Width, Height, Depth in cm)

---

### 8. Retail Shelf Tag & Barcode Generator
- Generate retail-ready 2×3" shelf tags directly from any product row or detail modal.
- Features:
  - Product Title & SKU
  - Primary Category
  - Retail Price with Discount Flag
  - Scannable visual barcode pattern with unique code text
- Includes a **"Print Shelf Tag"** button that invokes a targeted print stylesheet formatted specifically for standard label printers.

---

### 9. Unit Economics & Profit Margin Simulator
- Embedded directly within the **Product Detail Modal**.
- Adjust interactive range sliders to simulate real-world e-commerce economics:
  - **Wholesale / Supplier Cost ($)**
  - **Shipping & Packaging Overhead ($)**
  - **Promotional Discount (%)**
- Live calculations display:
  - **Net Profit per Unit ($)**
  - **Gross Margin (%)**
  - **Total Inventory Valuation ($)**
  - **Markup Multiplier (x)**

---

### 10. Quick Add Product & Media Dropzone
- Create and add custom products to the live dashboard.
- Form fields include: Title, Brand, Category, Price, Discount %, Stock, SKU, Warranty, Shipping details, and Description.
- **Drag-and-Drop Image Dropzone**: Drag any local image file or enter an external URL with an instant live image preview card.

---

### 11. Global Spotlight Command Palette (`⌘K` / `Ctrl+K`)
- Invoke anywhere in the app with `Ctrl+K` (Windows/Linux) or `⌘K` (Mac), or by clicking the search shortcut in the header.
- **Instant Actions**:
  - Quick navigate to any view (`Products`, `Inventory`, `Analytics`, `Orders`).
  - Open `Add New Product` modal.
  - Trigger `PDF Audit Report` export.
  - Toggle `API Gateway` online/offline.
  - Open `Store Activity Log`.
  - Toggle `Dark / Light Theme`.
- **Live Catalog Search**: Search product titles directly from the palette with thumbnail previews and arrow-key keyboard navigation.

---

### 12. Real-Time Stock Alerts & Notification Center
- Header notification bell with live unread badge.
- Automatically flags items with critical inventory levels (<5 units), incoming shipments, and API connectivity events.
- Each alert card includes a direct **"+50 Reorder Units"** button to replenish inventory immediately without leaving the notification pane.

---

### 13. Operations Audit Trail & Activity Log
- Slide-out drawer tracking every operational event in the store session.
- Records timestamped events for:
  - Stock restocks and replenishments
  - Inline price changes
  - New product creations
  - API Gateway state toggles
  - Data export jobs (CSV, JSON, PDF)
- Filterable by activity category: `All`, `Restock`, `Pricing`, `Create`, `Export`.

---

### 14. Live API Gateway Controller & REST Inspector
- **Gateway ON/OFF Beacon**: Real-time switch (`● API • DUMMYJSON (ON/OFF)`) in the header.
  - Turning the API OFF simulates a network blackout or paused sync with an offline screen and disabled operations.
  - Turning it ON resumes live polling and synchronization.
- **REST API Inspector Modal**: View exact endpoint URLs, HTTP methods, active query parameters, sample response payloads, and network latency.

---

### 15. Adaptive Dark & Light Themes
- Built-in theme engine with persistent state saved in `localStorage`.
- **Dark Mode**: Deep slate `#0B0F19` background with subtle borders, emerald accents, and glowing status beacons.
- **Light Mode**: Clean porcelain `#F8FAFC` surface with crisp slate borders and high-contrast typography.

---

## 🛠️ Tech Stack & Dependencies

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Runtime / Library** | [React 19.2](https://react.dev/) | Core UI library utilizing hooks and functional components |
| **Build Tooling** | [Vite 8.2](https://vitejs.dev/) | Lightning-fast HMR and optimized production bundling |
| **Styling** | [Tailwind CSS 3.4](https://tailwindcss.com/) | Utility-first styling with custom emerald/slate palette |
| **Typography** | [Google Fonts](https://fonts.google.com/) | Outfit (Headings), Plus Jakarta Sans (UI), JetBrains Mono (Data) |
| **Icons** | [Lucide React 1.39](https://lucide.dev/) | Lightweight, modern icon set |
| **Class Utilities** | `clsx` & `tailwind-merge` | Safe dynamic class composition and conflict resolution |
| **Linter** | [oxlint 1.79](https://oxc.rs/) | High-performance Rust-based JavaScript/React linter |
| **Data Source** | [DummyJSON REST API](https://dummyjson.com/products) | Production-grade mock REST API for products & categories |

---

## 📁 Project Directory Architecture

```
OmniVault-Modern-Neo-SaaS-Product-Management-Dashboard/
├── public/                     # Static public assets
├── src/
│   ├── components/
│   │   ├── common/             # Reusable UI primitives
│   │   │   ├── ApiInspectorModal.jsx   # REST API endpoint inspector
│   │   │   ├── CommandPalette.jsx      # Global Spotlight (⌘K / Ctrl+K)
│   │   │   ├── EmptyState.jsx          # Zero-results fallback state
│   │   │   ├── ErrorBoundary.jsx       # React error boundary wrapper
│   │   │   ├── ErrorState.jsx          # Network failure & retry view
│   │   │   ├── OmniVaultLogo.jsx       # Brand SVG logo mark
│   │   │   ├── RatingStars.jsx         # 5-star visual rating component
│   │   │   └── SkeletonLoader.jsx      # Animated loading skeleton screens
│   │   ├── dashboard/          # Feature-specific dashboard components
│   │   │   ├── ActivityLogDrawer.jsx   # Real-time audit log slide-out
│   │   │   ├── BulkActionBar.jsx       # Floating bottom multi-select dock
│   │   │   ├── ExportMenuDropdown.jsx  # CSV / JSON / PDF export menu
│   │   │   ├── FilterBar.jsx           # Search, categories, sort, segments
│   │   │   ├── Pagination.jsx          # Smart page navigation controls
│   │   │   ├── PrintShelfTagModal.jsx  # Retail shelf tag & barcode modal
│   │   │   ├── ProductCard.jsx         # Showroom grid product card
│   │   │   ├── ProductComparisonModal.jsx # 2-4 item side-by-side comparison
│   │   │   ├── ProductDetailModal.jsx  # Deep product details & economics
│   │   │   ├── ProductTable.jsx        # Enterprise table with inline editing
│   │   │   ├── QuickAddProductModal.jsx# New product creator with dropzone
│   │   │   └── StatCard.jsx            # KPI metric cards with trends
│   │   ├── layout/             # Application layout shells
│   │   │   ├── Header.jsx              # App header with search, notifications, API toggle
│   │   │   ├── NotificationCenter.jsx  # Slide-over alert notification panel
│   │   │   └── Sidebar.jsx             # Collapsible primary navigation sidebar
│   │   └── views/              # Main operational tabs
│   │       ├── AnalyticsView.jsx       # Financial & valuation analytics
│   │       ├── InventoryView.jsx       # Warehouse stock & replenishments
│   │       ├── OrdersView.jsx          # Supplier procurement orders
│   │       └── OverviewView.jsx        # Product catalog showroom & table
│   ├── hooks/                  # Custom React hooks
│   │   ├── useDebounce.js      # Value debounce hook for search inputs
│   │   ├── useProducts.js      # Catalog fetch, pagination, local mutations
│   │   └── useTheme.js         # Dark/light theme state & persistence
│   ├── pages/
│   │   └── DashboardPage.jsx   # Root orchestration page component
│   ├── services/
│   │   └── productApi.js       # HTTP service for DummyJSON endpoints
│   ├── utils/
│   │   ├── exportUtils.js      # CSV, JSON, and PDF export generators
│   │   └── formatters.js       # Currency, date, and unit formatters
│   ├── App.jsx                 # Main application component
│   ├── index.css               # Design system tokens, fonts, & animations
│   └── main.jsx                # DOM entry point
├── index.html                  # HTML5 shell with Google Fonts & metadata
├── package.json                # Project dependencies and npm scripts
├── tailwind.config.js          # Tailwind styling tokens & font families
├── vite.config.js              # Vite bundler configuration
└── README.md                   # Project documentation
```

---

## 📡 API Integration & Data Flow

OmniVault communicates directly with the **DummyJSON REST API** via `src/services/productApi.js`.

### Implemented Endpoints
- **`GET /products`**: Paginated catalog retrieval with `limit` and `skip` query parameters.
- **`GET /products/search?q={query}`**: Server-side search query across title, description, and tags.
- **`GET /products/category/{category}`**: Server-side category filtering.
- **`GET /products/categories`**: Category master list.
- **`GET /products?limit=0`**: Fetches total dataset in a single call to compute global inventory valuation, stock sums, and star distributions.

### Query Parameter Construction Example
```javascript
// Example service call in src/services/productApi.js
export async function fetchProducts({ limit = 24, skip = 0, search = '', category = '', sortBy = '', order = 'asc' }) {
  const params = new URLSearchParams({ limit, skip });
  if (sortBy) {
    params.set('sortBy', sortBy);
    params.set('order', order);
  }
  // Construct dynamic URL based on active search or category
  let url = `${BASE_URL}/products?${params.toString()}`;
  if (search.trim()) {
    url = `${BASE_URL}/products/search?q=${encodeURIComponent(search.trim())}&${params.toString()}`;
  } else if (category && category !== 'all') {
    url = `${BASE_URL}/products/category/${encodeURIComponent(category)}?${params.toString()}`;
  }
  const response = await fetch(url);
  return response.json();
}
```

---

## ⌨️ Keyboard Shortcuts Reference

| Shortcut | Scope | Action |
| :--- | :--- | :--- |
| <kbd>Ctrl</kbd> + <kbd>K</kbd> / <kbd>⌘</kbd> + <kbd>K</kbd> | Global | Open Global Spotlight Command Palette |
| <kbd>Esc</kbd> | Modal / Palette | Close active modal, drawer, or command palette |
| <kbd>Enter</kbd> | Table Inline Edit | Save inline price or stock adjustment |
| <kbd>Esc</kbd> | Table Inline Edit | Cancel inline edit and revert original value |
| <kbd>↑</kbd> / <kbd>↓</kbd> | Command Palette | Navigate through search results and actions |
| <kbd>Enter</kbd> | Command Palette | Execute currently highlighted action or navigation |

---

## 🚀 Installation & Setup

### Prerequisites
- **Node.js**: Version 18.0.0 or higher
- **npm**: Version 9.0.0 or higher (or `pnpm` / `yarn`)

### Step-by-Step Setup

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Sushanth666/OmniVault-Modern-Neo-SaaS-Product-Management-Dashboard.git
   cd OmniVault-Modern-Neo-SaaS-Product-Management-Dashboard
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Launch Local Development Server**:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:5173/`.

---

## 📦 Scripts & Production Build

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts Vite local development server with Hot Module Replacement (HMR) |
| `npm run build` | Compiles and bundles production-ready static assets into the `dist/` directory |
| `npm run preview` | Locally previews the compiled production build |
| `npm run lint` | Runs `oxlint` to perform fast static code analysis across JavaScript and JSX |

---

## 📄 Contributing & License

Contributions, issues, and feature requests are welcome!

Distributed under the **MIT License**. See `LICENSE` for more information.

---

<div align="center">
  <sub>Built with ❤️ using React 19, Vite, and Tailwind CSS.</sub>
</div>
