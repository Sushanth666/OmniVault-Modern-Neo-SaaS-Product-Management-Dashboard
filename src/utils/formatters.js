/**
 * Format a number as USD currency
 * @param {number} amount
 * @returns {string}
 */
export function formatCurrency(amount) {
  if (typeof amount !== 'number' || isNaN(amount)) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Calculate the original price before discount
 * @param {number} currentPrice
 * @param {number} discountPercentage
 * @returns {number}
 */
export function calculateOriginalPrice(currentPrice, discountPercentage) {
  if (!discountPercentage || discountPercentage <= 0) return currentPrice;
  return Number((currentPrice / (1 - discountPercentage / 100)).toFixed(2));
}

/**
 * Format date string into a user-friendly format (e.g. "Oct 12, 2024")
 * @param {string} dateString
 * @returns {string}
 */
export function formatDate(dateString) {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  } catch {
    return dateString;
  }
}

/**
 * Return stock status descriptor and style tokens
 * @param {number} stock
 */
export function getStockStatus(stock) {
  if (stock === 0) {
    return {
      status: 'out-of-stock',
      label: 'Out of Stock',
      badgeClass: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-900/50',
      dotClass: 'bg-rose-500',
    };
  }
  if (stock < 10) {
    return {
      status: 'low-stock',
      label: `Low Stock (${stock})`,
      badgeClass: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/50',
      dotClass: 'bg-amber-500 animate-pulse',
    };
  }
  return {
    status: 'in-stock',
    label: `In Stock (${stock})`,
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/50',
    dotClass: 'bg-emerald-500',
  };
}

/**
 * Capitalize and format category slug into human-readable label
 * @param {string} slug
 */
export function formatCategoryName(slug) {
  if (!slug) return '';
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
