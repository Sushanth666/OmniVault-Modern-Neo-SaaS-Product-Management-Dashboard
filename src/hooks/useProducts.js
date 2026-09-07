import { useState, useEffect, useMemo, useCallback } from 'react';
import { fetchCategories, fetchAllProductsForStats } from '../services/productApi';
import { useDebounce } from './useDebounce';

export function useProducts() {
  // Raw data from API
  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Filters and controls state
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const [category, setCategory] = useState('all');
  const [segment, setSegment] = useState('all'); // 'all', 'understocked', 'high-margin', 'clearance'
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  // Multi-selection state
  const [selectedProductIds, setSelectedProductIds] = useState(new Set());

  // Comparison state (IDs of compared products)
  const [comparedProductIds, setComparedProductIds] = useState([]);

  // Pagination state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(24);

  // Selected product for details modal
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Fetch initial data & categories
  const loadData = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const [productsData, categoriesData] = await Promise.all([
        fetchAllProductsForStats(),
        fetchCategories(),
      ]);

      setAllProducts(productsData.products || []);
      setCategories(categoriesData || []);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message || 'An unexpected error occurred while fetching products.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Overall catalog KPI statistics
  const stats = useMemo(() => {
    if (!allProducts.length) {
      return {
        totalProducts: 0,
        totalInventoryValue: 0,
        totalStockUnits: 0,
        averageRating: 0,
        lowStockCount: 0,
        categoriesCount: categories.length,
      };
    }

    let totalVal = 0;
    let totalStock = 0;
    let ratingSum = 0;
    let lowStock = 0;

    allProducts.forEach(p => {
      const stock = p.stock || 0;
      const price = p.price || 0;
      totalVal += stock * price;
      totalStock += stock;
      ratingSum += p.rating || 0;
      if (stock < 10) lowStock += 1;
    });

    return {
      totalProducts: allProducts.length,
      totalInventoryValue: totalVal,
      totalStockUnits: totalStock,
      averageRating: Number((ratingSum / allProducts.length).toFixed(2)),
      lowStockCount: lowStock,
      categoriesCount: categories.length || new Set(allProducts.map(p => p.category)).size,
    };
  }, [allProducts, categories]);

  // Max price found across catalog
  const maxPriceInCatalog = useMemo(() => {
    if (!allProducts.length) return 2000;
    const max = Math.max(...allProducts.map(p => p.price || 0));
    return Math.ceil(max / 100) * 100 || 2000;
  }, [allProducts]);

  useEffect(() => {
    if (maxPriceInCatalog > 0 && priceRange[1] === 2000 && maxPriceInCatalog !== 2000) {
      setPriceRange([0, maxPriceInCatalog]);
    }
  }, [maxPriceInCatalog]);

  // Reset page to 1 whenever filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, category, segment, priceRange, sortBy, limit]);

  // Filter and Sort logic
  const filteredAndSortedProducts = useMemo(() => {
    let result = [...allProducts];

    // 1. Category Filter
    if (category && category !== 'all') {
      result = result.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }

    // 2. Smart Merchandising Segment
    if (segment === 'understocked') {
      result = result.filter(p => (p.rating || 0) >= 4.0 && (p.stock || 0) < 15);
    } else if (segment === 'high-margin') {
      result = result.filter(p => (p.price || 0) >= 100 && (p.discountPercentage || 0) < 10);
    } else if (segment === 'clearance') {
      result = result.filter(p => (p.discountPercentage || 0) >= 15 && (p.stock || 0) >= 30);
    }

    // 3. Search Query
    if (debouncedSearch && debouncedSearch.trim()) {
      const q = debouncedSearch.toLowerCase().trim();
      result = result.filter(p => {
        const title = (p.title || '').toLowerCase();
        const brand = (p.brand || '').toLowerCase();
        const desc = (p.description || '').toLowerCase();
        const tags = (p.tags || []).map(t => t.toLowerCase()).join(' ');
        const cat = (p.category || '').toLowerCase();
        const sku = (p.sku || '').toLowerCase();
        return title.includes(q) || brand.includes(q) || desc.includes(q) || tags.includes(q) || cat.includes(q) || sku.includes(q);
      });
    }

    // 4. Price Range Filter
    const [minP, maxP] = priceRange;
    result = result.filter(p => {
      const price = p.price || 0;
      return price >= minP && price <= maxP;
    });

    // 5. Sorting
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating-desc':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'rating-asc':
        result.sort((a, b) => a.rating - b.rating);
        break;
      case 'discount-desc':
        result.sort((a, b) => (b.discountPercentage || 0) - (a.discountPercentage || 0));
        break;
      case 'title-asc':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'title-desc':
        result.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'stock-low':
        result.sort((a, b) => a.stock - b.stock);
        break;
      case 'featured':
      default:
        result.sort((a, b) => a.id - b.id);
        break;
    }

    return result;
  }, [allProducts, category, segment, debouncedSearch, priceRange, sortBy]);

  // Pagination calculations
  const totalFilteredProducts = filteredAndSortedProducts.length;
  const totalPages = Math.ceil(totalFilteredProducts / limit) || 1;
  const currentPage = Math.min(Math.max(1, page), totalPages);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * limit;
    return filteredAndSortedProducts.slice(start, start + limit);
  }, [filteredAndSortedProducts, currentPage, limit]);

  // Reset filters
  const resetFilters = useCallback(() => {
    setSearch('');
    setCategory('all');
    setSegment('all');
    setPriceRange([0, maxPriceInCatalog]);
    setSortBy('featured');
    setPage(1);
  }, [maxPriceInCatalog]);

  const hasActiveFilters = Boolean(
    search.trim() ||
    category !== 'all' ||
    segment !== 'all' ||
    priceRange[0] > 0 ||
    priceRange[1] < maxPriceInCatalog ||
    sortBy !== 'featured'
  );

  // In-place inline edit
  const updateProduct = useCallback((id, partialData) => {
    setAllProducts(prev =>
      prev.map(p => (p.id === id ? { ...p, ...partialData } : p))
    );
  }, []);

  // Bulk actions
  const toggleSelectProduct = useCallback((id) => {
    setSelectedProductIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const selectAllOnPage = useCallback((pageProductIds = []) => {
    setSelectedProductIds(prev => {
      const allSelected = pageProductIds.every(id => prev.has(id));
      const next = new Set(prev);
      if (allSelected) {
        pageProductIds.forEach(id => next.delete(id));
      } else {
        pageProductIds.forEach(id => next.add(id));
      }
      return next;
    });
  }, []);

  const clearSelection = useCallback(() => setSelectedProductIds(new Set()), []);

  const bulkRestock = useCallback((ids, amount = 25) => {
    const idSet = new Set(ids);
    setAllProducts(prev =>
      prev.map(p => (idSet.has(p.id) ? { ...p, stock: (p.stock || 0) + amount } : p))
    );
  }, []);

  const bulkApplyDiscount = useCallback((ids, discountPct = 10) => {
    const idSet = new Set(ids);
    setAllProducts(prev =>
      prev.map(p => (idSet.has(p.id) ? { ...p, discountPercentage: discountPct } : p))
    );
  }, []);

  const bulkDelete = useCallback((ids) => {
    const idSet = new Set(ids);
    setAllProducts(prev => prev.filter(p => !idSet.has(p.id)));
    clearSelection();
  }, [clearSelection]);

  // Product comparison
  const toggleCompare = useCallback((id) => {
    setComparedProductIds(prev => {
      if (prev.includes(id)) return prev.filter(item => item !== id);
      if (prev.length >= 4) {
        alert('You can compare up to 4 products at a time.');
        return prev;
      }
      return [...prev, id];
    });
  }, []);

  const clearCompare = useCallback(() => setComparedProductIds([]), []);

  const comparedProducts = useMemo(() => {
    return allProducts.filter(p => comparedProductIds.includes(p.id));
  }, [allProducts, comparedProductIds]);

  return {
    // Products Data
    products: paginatedProducts,
    allFilteredProducts: filteredAndSortedProducts,
    allCatalogProducts: allProducts,
    allFilteredCount: totalFilteredProducts,
    totalProductsInCatalog: allProducts.length,
    categories,
    stats,
    maxPriceInCatalog,

    // Loading & error
    loading,
    refreshing,
    error,
    refreshData: () => loadData(true),

    // Filter controls
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

    // Single item updates
    addProduct: (newProduct) => setAllProducts(prev => [newProduct, ...prev]),
    updateProduct,
    restockProduct: (id, amount = 50) => updateProduct(id, { stock: ((allProducts.find(p => p.id === id)?.stock) || 0) + amount }),

    // Multi-selection & Bulk
    selectedProductIds,
    toggleSelectProduct,
    selectAllOnPage,
    clearSelection,
    bulkRestock,
    bulkApplyDiscount,
    bulkDelete,

    // Comparison
    comparedProductIds,
    comparedProducts,
    toggleCompare,
    clearCompare,

    // Pagination
    page: currentPage,
    setPage,
    limit,
    setLimit,
    totalPages,

    // Details modal
    selectedProduct,
    setSelectedProduct,
  };
}
