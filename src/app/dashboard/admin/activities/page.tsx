"use client";

import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  ArrowDownLeft,
  Search,
  X,
  TrendingUp,
  Percent,
  Sparkles
} from 'lucide-react';

interface FinancialTransaction {
  id: string;
  type: 'Listing Fee' | 'Ad Boosting';
  amount: number;
  user: string;
  email: string;
  targetListing: string;
  status: 'Cleared' | 'Pending' | 'Failed';
  date: string;
  time: string;
  reference: string;
  paymentMethod: string;
  ipAddress: string;
}

export default function ActivitiesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('All');
  const [selectedFinancial, setSelectedFinancial] = useState<FinancialTransaction | null>(null);
  const [transactions, setTransactions] = useState<FinancialTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3001/api/transactions', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        const mapped = data.map((item: any) => ({
          id: item.id,
          type: item.type,
          amount: item.amount,
          user: item.user,
          email: item.email,
          targetListing: item.targetListing,
          status: item.status,
          date: new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          time: new Date(item.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          reference: item.reference,
          paymentMethod: item.paymentMethod,
          ipAddress: item.ipAddress
        }));
        setTransactions(mapped);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Filtering Logic
  const filteredTransactions = transactions.filter(t => {
    const matchesSearch =
      t.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.targetListing.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.reference.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = filterType === 'All' || t.type === filterType;
    return matchesSearch && matchesType;
  });

  // Calculation of totals and percentages
  const totalAmount = transactions
    .filter(t => t.status === 'Cleared')
    .reduce((sum, t) => sum + t.amount, 0);

  const listingTotal = transactions
    .filter(t => t.type === 'Listing Fee' && t.status === 'Cleared')
    .reduce((sum, t) => sum + t.amount, 0);

  const boostingTotal = transactions
    .filter(t => t.type === 'Ad Boosting' && t.status === 'Cleared')
    .reduce((sum, t) => sum + t.amount, 0);

  const listingPercent = totalAmount > 0 ? Math.round((listingTotal / totalAmount) * 100) : 0;
  const boostingPercent = totalAmount > 0 ? Math.round((boostingTotal / totalAmount) * 100) : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-300 relative">

      {/* METRIC CARD WIDGETS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Total Incoming Payments */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition duration-300 flex items-start justify-between">
          <div className="space-y-3">
            <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest block">Total Incoming Payments</span>
            <h3 className="text-3xl font-extrabold text-gray-900 tracking-tight">Rs {totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h3>
            <div className="flex items-center text-emerald-600 text-xs font-bold space-x-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+14.2%</span>
              <span className="text-gray-400 font-semibold text-[10px] ml-1">increase this week</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        {/* Listing Fees Percentage */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition duration-300 flex items-start justify-between">
          <div className="space-y-3">
            <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest block">Listing Fee Payments</span>
            <h3 className="text-3xl font-extrabold text-blue-600 tracking-tight">{listingPercent}%</h3>
            <p className="text-xs font-bold text-gray-500">
              Rs {listingTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })} total
            </p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
            <Percent className="w-5 h-5" />
          </div>
        </div>

        {/* Ad Boosting Percentage */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition duration-300 flex items-start justify-between">
          <div className="space-y-3">
            <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest block">Ad Boosting Payments</span>
            <h3 className="text-3xl font-extrabold text-purple-600 tracking-tight">{boostingPercent}%</h3>
            <p className="text-xs font-bold text-gray-500">
              Rs {boostingTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })} total
            </p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* Share Breakdown Visual Progress Bar */}
      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-3">
        <div className="flex justify-between items-center text-xs font-bold">
          <span className="text-gray-900">Incoming Payment Breakdown</span>
          <span className="text-gray-400">Listing Fees vs Ad Boosting</span>
        </div>
        <div className="w-full bg-gray-50 h-5 rounded-full overflow-hidden flex border border-gray-100">
          <div 
            style={{ width: `${listingPercent}%` }} 
            className="h-full bg-blue-500 flex items-center justify-center text-[9px] font-black text-white transition-all duration-500"
            title={`Listing Fees: ${listingPercent}%`}
          >
            {listingPercent}% Listing Fees
          </div>
          <div 
            style={{ width: `${boostingPercent}%` }} 
            className="h-full bg-purple-500 flex items-center justify-center text-[9px] font-black text-white transition-all duration-500"
            title={`Ad Boosting: ${boostingPercent}%`}
          >
            {boostingPercent}% Ad Boosting
          </div>
        </div>
      </div>

      {/* CORE MONITOR SECTION */}
      <div className="bg-white border border-gray-100 rounded-[32px] p-6 shadow-sm space-y-6">

        {/* Header Controls */}
        <div className="flex flex-col xl:flex-row justify-between xl:items-center gap-6 border-b border-gray-50 pb-5">
          <div>
            <h4 className="font-extrabold text-base text-gray-900">Financial Payments Log</h4>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Audit incoming deposits and boosting revenues</p>
          </div>

          {/* Filtering and Query Toolbar */}
          <div className="flex flex-wrap items-center gap-3">

            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-[#F8FAFC] text-xs font-bold text-gray-700 pl-9 pr-4 py-2.5 w-52 rounded-xl outline-none focus:ring-1 focus:ring-[#1A1A1A] border-none"
              />
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3.5 top-3" />
            </div>

            {/* Category selection Tabs */}
            <div className="bg-[#F8FAFC] p-1 rounded-xl flex items-center space-x-1 text-[9px] font-extrabold uppercase select-none border border-gray-100">
              {['All', 'Listing Fee', 'Ad Boosting'].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-3 py-2 rounded-lg transition cursor-pointer ${filterType === type ? 'bg-white text-gray-900 shadow-sm border border-gray-100' : 'text-gray-400 hover:text-gray-700'}`}
                >
                  {type === 'All' ? 'All Payments' : type}
                </button>
              ))}
            </div>

          </div>
        </div>

        {/* LOG CONTENTS TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-bold">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 uppercase tracking-widest text-[9px]">
                <th className="py-4 px-4">Transaction ID</th>
                <th className="py-4 px-4">Target Listing</th>
                <th className="py-4 px-4">Payer details</th>
                <th className="py-4 px-4">Timestamp</th>
                <th className="py-4 px-4">Amount</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-4 text-center">Diagnostics</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-400 font-semibold">
                    No financial logs found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => (
                  <tr
                    key={tx.id}
                    onClick={() => setSelectedFinancial(tx)}
                    className="hover:bg-[#F8FAFB]/70 transition group cursor-pointer"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <span className={`w-8 h-8 rounded-xl flex items-center justify-center border ${
                          tx.type === 'Listing Fee' ? 'bg-blue-50 border-blue-100 text-blue-600' : 'bg-purple-50 border-purple-100 text-purple-600'
                        }`}>
                          <ArrowDownLeft className="w-3.5 h-3.5" />
                        </span>
                        <div>
                          <p className="text-gray-950 font-extrabold">{tx.id}</p>
                          <p className="text-gray-400 text-[8px] font-bold uppercase tracking-widest">{tx.type}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-gray-800 font-bold max-w-[180px] truncate">{tx.targetListing}</p>
                      <p className="text-gray-400 font-semibold text-[9px]">Ref: {tx.reference.substring(0, 12)}...</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-gray-800 font-bold">{tx.user}</p>
                      <p className="text-gray-400 font-semibold text-[10px] mt-0.5">{tx.email}</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-gray-700 font-bold">{tx.date}</p>
                      <p className="text-gray-400 font-semibold text-[9px] mt-0.5">{tx.time}</p>
                    </td>
                    <td className="py-4 px-4 text-sm font-extrabold text-gray-950">
                      Rs {tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2.5 py-1 rounded-lg text-[9px] font-extrabold uppercase border ${
                        tx.status === 'Cleared' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                        tx.status === 'Pending' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                        'bg-red-50 text-red-600 border-red-100'
                      }`}>
                        {tx.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center text-xs">
                      <button
                        onClick={(e) => { e.stopPropagation(); setSelectedFinancial(tx); }}
                        className="bg-gray-50 text-gray-500 hover:bg-[#1A1A1A] hover:text-white px-3 py-1.5 rounded-lg text-[10px] font-extrabold transition uppercase cursor-pointer"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* DETAILED DIAGNOSTICS DRAWER */}
      {selectedFinancial && (
        <div className="fixed inset-0 bg-black/25 backdrop-blur-xs flex justify-end z-50 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-[500px] h-full shadow-2xl p-8 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300">
            <div className="space-y-8">

              {/* Header */}
              <div className="flex justify-between items-start border-b border-gray-50 pb-5">
                <div>
                  <span className="bg-[#1A1A1A] text-white text-[8px] font-extrabold uppercase px-2 py-0.5 rounded-full tracking-wider">Stayzo Ledger Audit</span>
                  <h3 className="font-extrabold text-xl text-gray-900 mt-2">Audit: {selectedFinancial.id}</h3>
                </div>
                <button
                  onClick={() => setSelectedFinancial(null)}
                  className="bg-gray-50 hover:bg-gray-100 p-2 rounded-full text-gray-400 hover:text-gray-900 transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Balance Highlight */}
              <div className="bg-gray-50 rounded-3xl p-6 flex justify-between items-center border border-gray-100">
                <div>
                  <p className="text-[9px] font-extrabold text-gray-400 uppercase tracking-widest">Transaction Sum</p>
                  <h4 className="text-2xl font-extrabold text-gray-950 mt-1">Rs {selectedFinancial.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h4>
                </div>
                <span className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold uppercase border ${
                  selectedFinancial.status === 'Cleared' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                  selectedFinancial.status === 'Pending' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                  'bg-red-50 text-red-600 border-red-100'
                }`}>
                  {selectedFinancial.status}
                </span>
              </div>

              {/* Parameters */}
              <div className="space-y-4">
                <h5 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Metadata Parameters</h5>
                <div className="grid grid-cols-2 gap-4 text-xs font-bold">
                  <div className="border border-gray-50 rounded-2xl p-3 bg-white">
                    <p className="text-[9px] text-gray-400 uppercase">Payment Category</p>
                    <p className="text-gray-800 font-extrabold mt-1">{selectedFinancial.type}</p>
                  </div>
                  <div className="border border-gray-50 rounded-2xl p-3 bg-white">
                    <p className="text-[9px] text-gray-400 uppercase">Payment Channel</p>
                    <p className="text-gray-800 font-extrabold mt-1 truncate">{selectedFinancial.paymentMethod}</p>
                  </div>
                  <div className="border border-gray-50 rounded-2xl p-3 bg-white">
                    <p className="text-[9px] text-gray-400 uppercase">Platform Reference</p>
                    <p className="text-gray-800 font-extrabold mt-1 truncate select-all">{selectedFinancial.reference}</p>
                  </div>
                  <div className="border border-gray-50 rounded-2xl p-3 bg-white">
                    <p className="text-[9px] text-gray-400 uppercase">Source IP Host</p>
                    <p className="text-gray-800 font-extrabold mt-1">{selectedFinancial.ipAddress}</p>
                  </div>
                </div>
              </div>

              {/* User Identity Info */}
              <div className="space-y-4">
                <h5 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Origin Payer Entity</h5>
                <div className="border border-gray-100 rounded-3xl p-5 flex items-center space-x-4 bg-white">
                  <div className="w-12 h-12 bg-gray-950 text-white rounded-2xl flex items-center justify-center font-extrabold text-base select-none shrink-0">
                    {selectedFinancial.user.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-extrabold text-gray-900">{selectedFinancial.user}</p>
                    <p className="text-xs font-semibold text-gray-400">{selectedFinancial.email}</p>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mt-1">Authorized for: {selectedFinancial.targetListing}</p>
                  </div>
                </div>
              </div>

            </div>

            <div className="pt-6 border-t border-gray-50 flex items-center gap-3">
              <button
                onClick={() => setSelectedFinancial(null)}
                className="w-full bg-[#1A1A1A] hover:bg-black text-white py-3 rounded-2xl text-xs font-extrabold uppercase transition cursor-pointer"
              >
                Close Audit Record
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}