const BASE_URL = 'https://dummyjson.com';

/**
 * Fetch products with optional pagination, search query, category, and sorting.
 * @param {Object} options
 * @param {number} [options.limit=24]
 * @param {number} [options.skip=0]
 * @param {string} [options.search='']
 * @param {string} [options.category='']
 * @param {string} [options.sortBy='']
 * @param {'asc'|'desc'} [options.order='asc']
 */
export async function fetchProducts({
  limit = 24,
  skip = 0,
  search = '',
  category = '',
  sortBy = '',
  order = 'asc',
} = {}) {
  let url;
  const params = new URLSearchParams();

  if (limit) params.set('limit', String(limit));
  if (skip) params.set('skip', String(skip));

  if (sortBy) {
    params.set('sortBy', sortBy);
    params.set('order', order);
  }

  if (search && search.trim()) {
    url = `${BASE_URL}/products/search?q=${encodeURIComponent(search.trim())}&${params.toString()}`;
  } else if (category && category !== 'all') {
    url = `${BASE_URL}/products/category/${encodeURIComponent(category)}?${params.toString()}`;
  } else {
    url = `${BASE_URL}/products?${params.toString()}`;
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

/**
 * Fetch all products in one request (for global dashboard KPIs & analytics)
 */
export async function fetchAllProductsForStats() {
  const url = `${BASE_URL}/products?limit=0`; // DummyJSON limit=0 returns all items
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch all products: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

/**
 * Fetch product category list
 * Returns array of category objects: [{ slug, name, url }, ...]
 */
export async function fetchCategories() {
  const response = await fetch(`${BASE_URL}/products/categories`);
  if (!response.ok) {
    throw new Error(`Failed to fetch categories: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

/**
 * Fetch single product details by ID
 * @param {string|number} id
 */
export async function fetchProductById(id) {
  const response = await fetch(`${BASE_URL}/products/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch product details: ${response.status} ${response.statusText}`);
  }
  return response.json();
}
