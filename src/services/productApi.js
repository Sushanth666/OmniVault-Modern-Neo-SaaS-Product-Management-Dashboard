const BASE_URL = 'https://dummyjson.com';

/**
 * Resilient fetch wrapper with automatic retry for HTTP 429 (rate limiting)
 * and temporary network hiccups, with configurable timeout.
 */
async function fetchWithRetry(url, options = {}, maxRetries = 3, initialDelayMs = 1200) {
  let attempt = 0;
  let delay = initialDelayMs;

  while (attempt < maxRetries) {
    attempt++;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), options.timeout || 12000);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      // If rate-limited (HTTP 429), respect Retry-After header or backoff
      if (response.status === 429) {
        if (attempt >= maxRetries) {
          throw new Error('API request limit exceeded (HTTP 429). Please wait a moment.');
        }
        const retryAfterHeader = response.headers.get('retry-after');
        const retryWaitMs = retryAfterHeader ? (parseInt(retryAfterHeader, 10) * 1000 || delay) : delay;
        console.warn(`[OmniVault API] 429 Rate limited on attempt ${attempt}. Retrying in ${retryWaitMs}ms...`);
        await new Promise(res => setTimeout(res, retryWaitMs));
        delay *= 2; // exponential backoff
        continue;
      }

      if (!response.ok) {
        // If 5xx server error, retry once
        if (response.status >= 500 && attempt < maxRetries) {
          console.warn(`[OmniVault API] Server error ${response.status} on attempt ${attempt}. Retrying in ${delay}ms...`);
          await new Promise(res => setTimeout(res, delay));
          delay *= 1.5;
          continue;
        }
        throw new Error(`Failed to fetch from ${url}: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (err) {
      clearTimeout(timeoutId);
      if (attempt >= maxRetries) {
        throw err;
      }
      console.warn(`[OmniVault API] Fetch failed on attempt ${attempt} (${err.message}). Retrying in ${delay}ms...`);
      await new Promise(res => setTimeout(res, delay));
      delay *= 2;
    }
  }
}

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

  return fetchWithRetry(url);
}

/**
 * Fetch all products in one request (for global dashboard KPIs & analytics)
 * Automatically falls back to limit=100 if limit=0 is throttled.
 */
export async function fetchAllProductsForStats() {
  try {
    const url = `${BASE_URL}/products?limit=0`; // DummyJSON limit=0 returns all items
    return await fetchWithRetry(url, {}, 3, 1000);
  } catch (err) {
    console.warn('[OmniVault API] limit=0 failed, trying fallback limit=100:', err.message);
    const fallbackUrl = `${BASE_URL}/products?limit=100`;
    return await fetchWithRetry(fallbackUrl, {}, 2, 1000);
  }
}

/**
 * Fetch product category list
 * Returns array of category objects: [{ slug, name, url }, ...]
 */
export async function fetchCategories() {
  const url = `${BASE_URL}/products/categories`;
  return fetchWithRetry(url, {}, 3, 800);
}

/**
 * Fetch single product details by ID
 * @param {string|number} id
 */
export async function fetchProductById(id) {
  const url = `${BASE_URL}/products/${id}`;
  return fetchWithRetry(url);
}
