"use client";

import React, { useState, useEffect } from 'react';
import {
  Star,
  Home,
  Search,
  ThumbsUp,
  Eye,
  EyeOff
} from 'lucide-react';

interface ReviewItem {
  id: string;
  authorName: string;
  authorEmail: string;
  rating: number;
  sentiment: 'Positive' | 'Neutral' | 'Negative';
  comment: string;
  targetName: string; // Property Name
  date: string;
  likes: number;
  status: 'Approved' | 'Flagged' | 'Pending';
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchReviews = () => {
    setLoading(true);
    fetch('http://localhost:3001/api/reviews', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        const mapped = data.map((item: any) => ({
          id: item.id,
          authorName: item.authorName,
          authorEmail: item.authorEmail,
          rating: item.rating,
          sentiment: item.sentiment,
          comment: item.comment,
          targetName: item.targetName,
          date: new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          likes: item.likes,
          status: item.status
        }));
        setReviews(mapped);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // Rating Distribution statistics
  const totalReviewsCount = reviews.length;
  const ratingDistribution = {
    5: reviews.filter(r => r.rating === 5).length,
    4: reviews.filter(r => r.rating === 4).length,
    3: reviews.filter(r => r.rating === 3).length,
    2: reviews.filter(r => r.rating === 2).length,
    1: reviews.filter(r => r.rating === 1).length
  };

  const handleApprove = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:3001/api/reviews/${id}/approve`, {
        method: 'POST'
      });
      if (res.ok) {
        fetchReviews();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleFlag = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:3001/api/reviews/${id}/flag`, {
        method: 'POST'
      });
      if (res.ok) {
        fetchReviews();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Filter logic
  const filteredReviews = reviews.filter(r => {
    const matchesSearch =
      r.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.targetName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(2)
    : "0.00";
  const avgStars = Math.round(Number(averageRating));

  return (
    <div className="space-y-8 animate-in fade-in duration-300">

      {/* RATING OVERVIEW CARDS & BAR GRAPH */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Left Card: Overall Platform Rating */}
        <div className="bg-white border border-gray-100 rounded-[32px] p-6 sm:p-8 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest block">Average Property Score</span>
            <div className="flex items-baseline space-x-2">
              <h3 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">{averageRating}</h3>
              <span className="text-gray-400 font-extrabold text-lg">/ 5</span>
            </div>
            <div className="flex items-center space-x-1 text-amber-400">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className={`w-5 h-5 ${s <= avgStars ? 'fill-amber-400 stroke-amber-400' : 'text-gray-200'}`} />
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-gray-50 flex items-center justify-between text-xs font-bold select-none">
            <div className="space-y-1">
              <p className="text-[10px] text-gray-400 uppercase">Total Submissions</p>
              <p className="text-gray-900 font-extrabold text-sm sm:text-base">{totalReviewsCount} verified reviews</p>
            </div>
            <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 text-[9px] font-extrabold uppercase px-2.5 py-1 rounded-lg">
              Active
            </span>
          </div>
        </div>

        {/* Right Card: Star distribution analytics */}
        <div className="bg-white border border-gray-100 rounded-[32px] p-6 sm:p-8 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-1">
            <h4 className="font-extrabold text-sm text-gray-900">Property Rating Distribution</h4>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Breakdown of customer satisfaction levels</p>
          </div>

          <div className="space-y-2 select-none text-[10px] font-extrabold text-gray-500">
            {[5, 4, 3, 2, 1].map((stars) => {
              const count = ratingDistribution[stars as keyof typeof ratingDistribution] || 0;
              const percentage = totalReviewsCount > 0 ? (count / totalReviewsCount) * 100 : 0;
              return (
                <div key={stars} className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1 w-12 shrink-0">
                    <span>{stars}</span>
                    <Star className="w-3 h-3 fill-amber-400 stroke-amber-400" />
                  </div>
                  <div className="flex-1 bg-gray-50 h-2.5 rounded-full overflow-hidden border border-gray-100/50">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${stars === 5 ? 'bg-emerald-400' :
                        stars === 4 ? 'bg-emerald-300' :
                          stars === 3 ? 'bg-amber-300' :
                            stars === 2 ? 'bg-amber-400' :
                              'bg-red-400'
                        }`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="w-8 text-right font-extrabold text-gray-900">{Math.round(percentage)}%</span>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* DETAILED MODERATION GRID */}
      <div className="bg-white border border-gray-100 rounded-[32px] p-6 shadow-sm space-y-6">

        {/* Toolbar Header */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-gray-50 pb-5">
          <div>
            <h4 className="font-extrabold text-base text-gray-900">Moderation Portal</h4>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Audit, flag, and remove property reviews</p>
          </div>

          {/* Search bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search reviews..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#F8FAFB] text-xs font-bold text-gray-700 pl-9 pr-4 py-2 w-full sm:w-48 rounded-xl outline-none focus:ring-1 focus:ring-[#1A1A1A] border-none"
            />
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3.5 top-2.5" />
          </div>
        </div>

        {/* REVIEWS TABLE LAYOUT */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-bold">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 uppercase tracking-widest text-[9px]">
                <th className="py-4 px-4">Author Details</th>
                <th className="py-4 px-4">Property</th>
                <th className="py-4 px-4">Rating</th>
                <th className="py-4 px-4">Comment</th>
                <th className="py-4 px-4">Sentiment</th>
                <th className="py-4 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredReviews.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400 font-semibold">
                    No property reviews found matching your search.
                  </td>
                </tr>
              ) : (
                filteredReviews.map((item) => (
                  <tr
                    key={item.id}
                    className={`hover:bg-[#F8FAFB]/70 transition group ${
                      item.status === 'Flagged' ? 'bg-red-50/10' : ''
                    }`}
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-xl bg-[#1A1A1A] text-white flex items-center justify-center font-extrabold text-xs select-none">
                          {item.authorName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-gray-950 font-extrabold">{item.authorName}</p>
                          <p className="text-gray-400 font-semibold text-[9px] mt-0.5">{item.authorEmail}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <Home className="w-3.5 h-3.5 text-indigo-500" />
                        <div>
                          <p className="text-gray-800 font-bold max-w-[150px] truncate">{item.targetName}</p>
                          <p className="text-gray-400 font-semibold text-[9px] mt-0.5">{item.date}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-3.5 h-3.5 ${s <= item.rating ? 'fill-amber-400 stroke-amber-400' : 'text-gray-200'}`}
                          />
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-4 max-w-xs">
                      <p className="text-gray-700 font-semibold text-[11px] italic truncate">"{item.comment}"</p>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded-lg text-[9px] font-extrabold uppercase tracking-wide border ${
                        item.sentiment === 'Positive' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                        item.sentiment === 'Neutral' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                        'bg-rose-50 text-rose-600 border-rose-100'
                      }`}>
                        {item.sentiment}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => handleApprove(item.id)}
                          title="Set Visible"
                          className={`p-1.5 rounded-lg font-extrabold transition cursor-pointer flex items-center justify-center border ${
                            item.status === 'Approved'
                              ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                              : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleFlag(item.id)}
                          title="Set Hidden"
                          className={`p-1.5 rounded-lg font-extrabold transition cursor-pointer flex items-center justify-center border ${
                            item.status === 'Flagged'
                              ? 'bg-red-500 text-white border-red-500 hover:bg-red-600'
                              : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50 hover:text-red-500'
                          }`}
                        >
                          <EyeOff className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
}
