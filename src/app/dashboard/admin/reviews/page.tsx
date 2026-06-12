"use client";

import React, { useState } from 'react';
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
  const [reviews, setReviews] = useState<ReviewItem[]>([
    {
      id: "REV-901",
      authorName: "Sarah Connor",
      authorEmail: "sarah@connor.com",
      rating: 5,
      sentiment: "Positive",
      comment: "Absolutely breathtaking property. The Villa Tropical Cana has everything one could ask for. Spotless, quiet, and extremely modern. Highly recommended!",
      targetName: "Villa Tropical Cana",
      date: "May 23, 2026",
      likes: 24,
      status: "Approved"
    },
    {
      id: "REV-902",
      authorName: "John Connor",
      authorEmail: "john.c@cyberdyne.com",
      rating: 2,
      sentiment: "Negative",
      comment: "The place at 3940 N 16th St was highly unresponsive. We had to wait three hours in the rain for check-in. The water pressure in the shower was non-existent. Terrible experience.",
      targetName: "3940 N 16th St",
      date: "May 22, 2026",
      likes: 8,
      status: "Flagged"
    },
    {
      id: "REV-903",
      authorName: "Elena Rostova",
      authorEmail: "elena@rostov.io",
      rating: 4,
      sentiment: "Positive",
      comment: "Lovely stay at Colombo Heights Suite. Great view from the terrace and very convenient location. The apartment was clean and polite layout, though checkout was slightly rushed.",
      targetName: "Colombo Heights Suite",
      date: "May 20, 2026",
      likes: 15,
      status: "Approved"
    },
    {
      id: "REV-904",
      authorName: "Arthur Dent",
      authorEmail: "arthur@guide.galaxy",
      rating: 3,
      sentiment: "Neutral",
      comment: "The place at 46 Haunting St is mostly fine, but the instructions in the manual for the electrical panel were impossible to understand. Satisfactory but could use major clarity.",
      targetName: "46 Haunting St, Somerville",
      date: "May 18, 2026",
      likes: 3,
      status: "Pending"
    },
    {
      id: "REV-905",
      authorName: "Nimal Siri",
      authorEmail: "nimal@colombo.com",
      rating: 5,
      sentiment: "Positive",
      comment: "Absolutely stunning villa at Kandy Lakeview Mansion. Clean, peaceful, and surrounded by beautiful trees. Will definitely book again!",
      targetName: "Kandy Lakeview Mansion",
      date: "May 15, 2026",
      likes: 19,
      status: "Approved"
    },
    {
      id: "REV-906",
      authorName: "Lana Del",
      authorEmail: "lana@coast.com",
      rating: 2,
      sentiment: "Negative",
      comment: "Beautiful villa but the listing claimed it has a heated pool. It was freezing cold and the heating unit was broken. Felt highly deceptive.",
      targetName: "Ahlers & Ogletree Villa",
      date: "May 12, 2026",
      likes: 11,
      status: "Flagged"
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');

  // Rating Distribution statistics
  const totalReviewsCount = reviews.length;
  const ratingDistribution = {
    5: reviews.filter(r => r.rating === 5).length,
    4: reviews.filter(r => r.rating === 4).length,
    3: reviews.filter(r => r.rating === 3).length,
    2: reviews.filter(r => r.rating === 2).length,
    1: reviews.filter(r => r.rating === 1).length
  };

  const handleApprove = (id: string) => {
    setReviews(reviews.map(r => r.id === id ? { ...r, status: 'Approved' } : r));
  };

  const handleFlag = (id: string) => {
    setReviews(reviews.map(r => r.id === id ? { ...r, status: 'Flagged' } : r));
  };

  // Filter logic
  const filteredReviews = reviews.filter(r => {
    const matchesSearch =
      r.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.targetName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">

      {/* RATING OVERVIEW CARDS & BAR GRAPH */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Left Card: Overall Platform Rating */}
        <div className="bg-white border border-gray-100 rounded-[32px] p-6 sm:p-8 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest block">Average Property Score</span>
            <div className="flex items-baseline space-x-2">
              <h3 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">4.72</h3>
              <span className="text-gray-400 font-extrabold text-lg">/ 5</span>
            </div>
            <div className="flex items-center space-x-1 text-amber-400">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-5 h-5 fill-amber-400 stroke-amber-400" />
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

        {/* REVIEWS GRID LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredReviews.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-400 font-semibold">
              No property reviews found matching your search.
            </div>
          ) : (
            filteredReviews.map((item) => (
              <div
                key={item.id}
                className={`border rounded-3xl p-6 transition-all duration-300 flex flex-col justify-between space-y-5 hover:shadow-md ${
                  item.status === 'Flagged'
                    ? 'bg-red-50/5 border-red-100'
                    : 'bg-white border-gray-100 hover:border-gray-200'
                }`}
              >
                {/* Upper Section */}
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-3.5">
                      <div className="w-10 h-10 rounded-2xl bg-[#1A1A1A] text-white flex items-center justify-center font-extrabold text-sm select-none">
                        {item.authorName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-sm text-gray-900 leading-tight">{item.authorName}</h4>
                        <p className="text-[10px] text-gray-400 font-semibold mt-0.5">{item.authorEmail}</p>
                      </div>
                    </div>
                    
                    <span className={`px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-wide border ${
                      item.sentiment === 'Positive' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                      item.sentiment === 'Neutral' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                      'bg-rose-50 text-rose-600 border-rose-100'
                    }`}>
                      {item.sentiment}
                    </span>
                  </div>

                  {/* Target Property Card */}
                  <div className="bg-[#F8FAFC] rounded-2xl p-4 border border-gray-50 flex items-center justify-between">
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
                        <Home className="w-4.5 h-4.5 text-purple-600" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[8px] text-gray-400 font-extrabold uppercase tracking-widest block">Reviewed Property</span>
                        <span className="font-extrabold text-xs text-gray-900 truncate block">{item.targetName}</span>
                      </div>
                    </div>
                    <span className="text-gray-400 text-[9px] font-extrabold shrink-0 ml-2">{item.date}</span>
                  </div>

                  {/* Rating stars & comment text */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-1 select-none">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-4 h-4 ${s <= item.rating ? 'fill-amber-400 stroke-amber-400' : 'text-gray-200'}`}
                        />
                      ))}
                    </div>
                    <p className="text-xs font-semibold text-gray-700 leading-relaxed italic select-text">
                      "{item.comment}"
                    </p>
                  </div>
                </div>

                {/* Bottom Controls */}
                <div className="pt-4 border-t border-gray-50 flex items-center justify-between gap-4 text-xs select-none">
                  <div className="flex items-center text-[10px] text-gray-400 font-extrabold space-x-1">
                    <ThumbsUp className="w-3.5 h-3.5 text-gray-300" />
                    <span>{item.likes} helpful marks</span>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      onClick={() => handleApprove(item.id)}
                      className={`px-3 py-1.5 rounded-xl font-extrabold transition cursor-pointer flex items-center space-x-1.5 border text-[10px] uppercase tracking-wider ${
                        item.status === 'Approved'
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                          : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Visible</span>
                    </button>
                    <button
                      onClick={() => handleFlag(item.id)}
                      className={`px-3 py-1.5 rounded-xl font-extrabold transition cursor-pointer flex items-center space-x-1.5 border text-[10px] uppercase tracking-wider ${
                        item.status === 'Flagged'
                          ? 'bg-red-500 text-white border-red-500 hover:bg-red-600'
                          : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50 hover:text-red-500'
                      }`}
                    >
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>Hidden</span>
                    </button>
                  </div>
                </div>

              </div>
            ))
          )}
        </div>

      </div>

    </div>
  );
}
