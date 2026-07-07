"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Star, Loader2 } from 'lucide-react';

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: {
    id: string;
    firstName: string | null;
    lastName: string | null;
  } | null;
}

interface PropertyReviewsProps {
  propertyId: string;
  onAverageRatingChange?: (avg: number, count: number) => void;
}

export default function PropertyReviews({ propertyId, onAverageRatingChange }: PropertyReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = useCallback(async () => {
    if (!propertyId) return;
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3001/api/reviews/property/${propertyId}`, {
        cache: 'no-store',
      });
      if (res.ok) {
        const data = await res.json();
        setReviews(data);
        
        // Calculate average rating
        if (data.length > 0) {
          const sum = data.reduce((acc: number, r: Review) => acc + r.rating, 0);
          const avg = sum / data.length;
          if (onAverageRatingChange) {
            onAverageRatingChange(avg, data.length);
          }
        } else {
          if (onAverageRatingChange) {
            onAverageRatingChange(0, 0);
          }
        }
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  }, [propertyId, onAverageRatingChange]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const count = reviews.length;
  const average = count > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / count)
    : 0;

  const renderStars = (val: number, size = "w-3 h-3") => {
    const rounded = Math.round(val);
    return (
      <div className="flex items-center gap-0.5 text-amber-400 select-none">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star
            key={s}
            className={`${size} ${s <= rounded ? 'fill-amber-400 stroke-amber-400' : 'text-gray-200'}`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="mt-3 border-t border-gray-100 pt-3 space-y-3">
      {/* Average Rating Summary */}
      <div className="flex items-center justify-between bg-gray-50/50 p-2.5 rounded-xl border border-gray-50 select-none">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Reviews ({count})</span>
          {count > 0 && (
            <div className="flex items-center gap-1">
              {renderStars(average)}
              <span className="text-[11px] font-black text-gray-800">{average.toFixed(1)}</span>
            </div>
          )}
        </div>
        {count === 0 && (
          <span className="text-[9px] font-extrabold text-gray-400 italic">No reviews yet</span>
        )}
      </div>

      {/* Reviews List */}
      {loading ? (
        <div className="flex items-center justify-center py-2 text-gray-400 text-[10px] font-bold gap-1">
          <Loader2 className="w-3.5 h-3.5 animate-spin text-gray-400" />
          <span>Loading...</span>
        </div>
      ) : (
        count > 0 && (
          <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
            {reviews.map((item) => {
              const dateStr = new Date(item.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              });
              const author = item.user 
                ? `${item.user.firstName || ''} ${item.user.lastName || ''}`.trim() || 'Anonymous'
                : 'Anonymous';
              return (
                <div key={item.id} className="bg-white border border-gray-50 rounded-xl p-2.5 space-y-1.5 shadow-3xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-extrabold text-gray-800 leading-none">{author}</span>
                      <span className="text-[8px] text-gray-400 font-semibold block mt-0.5">{dateStr}</span>
                    </div>
                    {renderStars(item.rating, "w-2.5 h-2.5")}
                  </div>
                  <p className="text-[10px] font-bold text-gray-500 italic leading-snug">
                    "{item.comment}"
                  </p>
                </div>
              );
            })}
          </div>
        )
      )}
    </div>
  );
}
