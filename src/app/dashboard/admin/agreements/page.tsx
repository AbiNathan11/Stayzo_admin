"use client";

import React, { useState, useEffect } from 'react';
import {
  FileText,
  Clock,
  Search,
  CheckCircle2,
  FileCheck,
  FileX,
  ShieldAlert,
  ExternalLink,
  Calendar,
  DollarSign
} from 'lucide-react';

interface LeaseAgreement {
  id: string;
  tenantName: string;
  tenantEmail: string;
  landlordName: string;
  landlordEmail: string;
  monthlyRent: number;
  securityDeposit: number;
  termLength: string;
  startDate: string;
  endDate: string;
  status: string;
  listingName: string;
  contractText: string;
  landlordSig?: string;
  tenantSig?: string;
  createdAt: string;
}

export default function AgreementsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'All' | 'Active' | 'Pending Signatures' | 'Expired'>('All');
  const [agreements, setAgreements] = useState<LeaseAgreement[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAgreement, setSelectedAgreement] = useState<LeaseAgreement | null>(null);

  const fetchAgreements = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/agreements', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setAgreements(data);
      }
    } catch (error) {
      console.error('Failed to fetch agreements:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgreements();
  }, []);

  // Filter Logic
  const filteredAgreements = agreements.filter(c => {
    const matchesSearch =
      c.tenantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.landlordName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.listingName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTab = activeTab === 'All' || c.status === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300 relative">

      {/* QUICK STATUS METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">

        {/* Active Agreements - 2 Sides Signed */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition duration-300 flex items-start justify-between">
          <div className="space-y-3">
            <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest block">Active Agreements (2-Sided)</span>
            <h3 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              {agreements.filter(c => c.status === 'Active').length}
            </h3>
            <div className="flex items-center text-emerald-600 text-xs font-bold space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Fully Signed &amp; Legally Binding</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600 shrink-0">
            <FileCheck className="w-5 h-5" />
          </div>
        </div>

        {/* Pending Agreements - 1 Side Signed */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition duration-300 flex items-start justify-between">
          <div className="space-y-3">
            <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest block">Pending Signatures (1-Sided)</span>
            <h3 className="text-3xl font-extrabold text-amber-500 tracking-tight">
              {agreements.filter(c => c.status === 'Pending Signatures').length}
            </h3>
            <div className="flex items-center text-amber-600 text-xs font-bold space-x-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Awaiting Counterparty Signature</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500 shrink-0">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        {/* Expired Agreements */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition duration-300 flex items-start justify-between">
          <div className="space-y-3">
            <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest block">Expired Contracts</span>
            <h3 className="text-3xl font-extrabold text-red-500 tracking-tight">
              {agreements.filter(c => c.status === 'Expired').length}
            </h3>
            <div className="flex items-center text-red-500 text-xs font-bold space-x-1">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Lease Durations Reached End Date</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center text-red-500 shrink-0">
            <FileX className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* CORE AGREEMENTS PANEL */}
      <div className="bg-white border border-gray-100 rounded-[32px] p-6 shadow-sm space-y-6">

        {/* Toolbar & Filter Tabs */}
        <div className="flex flex-col xl:flex-row justify-between xl:items-center gap-6 border-b border-gray-50 pb-5">
          <div>
            <h4 className="font-extrabold text-base text-gray-900">Lease Contracts Manager</h4>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Monitor cryptographically signed digital rental agreements</p>
          </div>

          {/* Filtering and Query Toolbar */}
          <div className="flex flex-wrap items-center gap-3">

            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search contracts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-[#F8FAFB] text-xs font-bold text-gray-700 pl-9 pr-4 py-2.5 w-48 rounded-xl outline-none focus:ring-1 focus:ring-[#1A1A1A] border-none"
              />
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3.5 top-3" />
            </div>

            {/* Agreement Status Tabs */}
            <div className="bg-[#F8FAFB] p-1 rounded-xl flex items-center space-x-1 text-[9px] font-extrabold uppercase select-none border border-gray-100">
              {[
                { key: 'All', label: 'All Leases' },
                { key: 'Active', label: 'Active (2 Signed)' },
                { key: 'Pending Signatures', label: 'Pending (1 Signed)' },
                { key: 'Expired', label: 'Expired' }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`px-3 py-2 rounded-lg transition cursor-pointer ${activeTab === tab.key ? 'bg-white text-gray-900 shadow-sm border border-gray-100' : 'text-gray-400 hover:text-gray-700'}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

          </div>
        </div>

        {/* AGREEMENTS DATA TABLE */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-12 text-gray-400 font-bold uppercase tracking-widest animate-pulse">
              Loading agreements from database...
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-xs font-bold">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 uppercase tracking-widest text-[9px]">
                  <th className="py-4 px-4">Lease ID</th>
                  <th className="py-4 px-4">Property Target</th>
                  <th className="py-4 px-4">Tenant details</th>
                  <th className="py-4 px-4">Landlord details</th>
                  <th className="py-4 px-4">Financial Terms</th>
                  <th className="py-4 px-4">Signature Status</th>
                  <th className="py-4 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredAgreements.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-gray-400 font-semibold">
                      No matching lease agreements located.
                    </td>
                  </tr>
                ) : (
                  filteredAgreements.map((con) => (
                    <tr key={con.id} className="hover:bg-[#F8FAFB]/40 transition">
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <FileText className="w-4 h-4 text-gray-400 shrink-0" />
                          <span className="text-gray-950 font-extrabold max-w-[80px] truncate">{con.id}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-gray-800 font-bold max-w-[180px] truncate">{con.listingName}</p>
                        <p className="text-gray-400 text-[9px] mt-0.5">Start: {con.startDate}</p>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-gray-850 font-bold">{con.tenantName}</p>
                        <p className="text-gray-400 font-semibold text-[9px] mt-0.5">{con.tenantEmail}</p>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-gray-850 font-bold">{con.landlordName}</p>
                        <p className="text-gray-400 font-semibold text-[9px] mt-0.5">{con.landlordEmail}</p>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-gray-950 font-extrabold">Rs {con.monthlyRent.toLocaleString()}/mo</p>
                        <p className="text-gray-400 text-[9px] mt-0.5">Deposit: Rs {con.securityDeposit.toLocaleString()}</p>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2.5 py-1 rounded-lg text-[9px] font-extrabold uppercase border ${
                          con.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                          con.status === 'Pending Signatures' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                          'bg-red-50 text-red-600 border-red-100'
                        }`}>
                          {con.status === 'Active' ? 'Active (2 signed)' : 
                           con.status === 'Pending Signatures' ? 'Pending (1 signed)' : 'Expired'}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <button
                          className="bg-gray-50 text-gray-500 hover:bg-[#1A1A1A] hover:text-white px-3 py-1.5 rounded-lg text-[10px] font-extrabold transition uppercase flex items-center space-x-1 mx-auto cursor-pointer"
                          onClick={() => setSelectedAgreement(con)}
                        >
                          <span>Inspect</span>
                          <ExternalLink className="w-3 h-3 ml-0.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

      </div>

      {/* Contract Inspection Modal */}
      {selectedAgreement && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white border border-gray-200 rounded-[32px] w-full max-w-4xl p-6 md:p-8 shadow-2xl relative overflow-hidden my-8 animate-in zoom-in-95 duration-200">
            
            <div className="flex justify-between items-start mb-6 border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-xl font-extrabold text-[#1A1A1A]">Lease Contract Inspection</h3>
                <p className="text-xs text-gray-500 font-semibold mt-1">
                  Verifying signature authenticity and tenancy clauses for {selectedAgreement.listingName}.
                </p>
              </div>
              <button 
                onClick={() => setSelectedAgreement(null)}
                className="text-gray-400 hover:text-gray-600 font-extrabold text-sm"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Left Column: Contract text */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 h-[420px] overflow-y-auto font-mono text-[11px] leading-relaxed whitespace-pre-wrap text-slate-800 shadow-inner">
                {selectedAgreement.contractText}
              </div>

              {/* Right Column: Signatures & metadata details */}
              <div className="flex flex-col justify-between space-y-6">
                
                {/* Financial Summary */}
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 space-y-3">
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-slate-200 pb-2">Tenancy Details</h4>
                  
                  <div className="grid grid-cols-2 gap-4 text-xs font-bold text-gray-800">
                    <div>
                      <span className="text-[9px] text-gray-400 block uppercase">Monthly Rent</span>
                      <span className="text-sm font-extrabold">Rs {selectedAgreement.monthlyRent?.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-gray-400 block uppercase">Security Deposit</span>
                      <span className="text-sm font-extrabold">Rs {selectedAgreement.securityDeposit?.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-gray-400 block uppercase">Lease Term</span>
                      <span>{selectedAgreement.termLength}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-gray-400 block uppercase">Commencement</span>
                      <span>{selectedAgreement.startDate}</span>
                    </div>
                  </div>
                </div>

                {/* Signatures Status */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-slate-100 pb-2">Cryptographic Signatures</h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Landlord */}
                    <div className="border border-slate-200 rounded-2xl bg-white p-4 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] font-bold text-gray-400 uppercase">Landlord</span>
                        <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${selectedAgreement.landlordSig ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                          {selectedAgreement.landlordSig ? 'Signed' : 'Unsigned'}
                        </span>
                      </div>
                      <p className="text-[11px] font-extrabold text-gray-900 truncate">{selectedAgreement.landlordName}</p>
                      <p className="text-[9px] text-gray-400 font-semibold truncate mt-0.5">{selectedAgreement.landlordEmail}</p>
                      <div className="bg-slate-50 border border-slate-100 rounded-xl p-2 h-16 flex items-center justify-center">
                        {selectedAgreement.landlordSig ? (
                          <img src={selectedAgreement.landlordSig} alt="Landlord signature" className="max-h-full max-w-full object-contain" />
                        ) : (
                          <span className="text-[9px] font-bold text-slate-300">AWAITING SIGNATURE</span>
                        )}
                      </div>
                    </div>

                    {/* Tenant */}
                    <div className="border border-slate-200 rounded-2xl bg-white p-4 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] font-bold text-gray-400 uppercase">Tenant</span>
                        <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${selectedAgreement.tenantSig ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                          {selectedAgreement.tenantSig ? 'Signed' : 'Unsigned'}
                        </span>
                      </div>
                      <p className="text-[11px] font-extrabold text-gray-900 truncate">{selectedAgreement.tenantName}</p>
                      <p className="text-[9px] text-gray-400 font-semibold truncate mt-0.5">{selectedAgreement.tenantEmail}</p>
                      <div className="bg-slate-50 border border-slate-100 rounded-xl p-2 h-16 flex items-center justify-center">
                        {selectedAgreement.tenantSig ? (
                          <img src={selectedAgreement.tenantSig} alt="Tenant signature" className="max-h-full max-w-full object-contain" />
                        ) : (
                          <span className="text-[9px] font-bold text-slate-300">AWAITING SIGNATURE</span>
                        )}
                      </div>
                    </div>
                  </div>

                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => window.print()}
                    className="flex-1 border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-2xl py-3 text-xs font-bold transition flex items-center justify-center gap-1.5"
                  >
                    Download PDF
                  </button>
                  <button
                    onClick={() => setSelectedAgreement(null)}
                    className="flex-1 bg-[#1A1A1A] hover:bg-black text-white rounded-2xl py-3 text-xs font-bold transition shadow-sm"
                  >
                    Close Inspection
                  </button>
                </div>

              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}

