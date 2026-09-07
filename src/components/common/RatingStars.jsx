import React from 'react';
import { Star, StarHalf } from 'lucide-react';

export function RatingStars({ rating = 0, size = 'sm', showNumber = true, reviewCount = null }) {
  const numRating = Number(rating) || 0;
  const fullStars = Math.floor(numRating);
  const hasHalfStar = numRating - fullStars >= 0.4;
  const emptyStars = Math.max(0, 5 - fullStars - (hasHalfStar ? 1 : 0));

  const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const iconSize = sizeClasses[size] || sizeClasses.sm;

  return (
    <div className="inline-flex items-center gap-1">
      <div className="flex items-center text-amber-400">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className={`${iconSize} fill-amber-400 text-amber-400`} />
        ))}
        {hasHalfStar && (
          <StarHalf className={`${iconSize} fill-amber-400 text-amber-400`} />
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} className={`${iconSize} text-slate-300 dark:text-slate-600`} />
        ))}
      </div>
      {showNumber && (
        <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 ml-0.5">
          {numRating.toFixed(1)}
        </span>
      )}
      {reviewCount !== null && (
        <span className="text-xs text-slate-400 dark:text-slate-500">
          ({reviewCount})
        </span>
      )}
    </div>
  );
}
