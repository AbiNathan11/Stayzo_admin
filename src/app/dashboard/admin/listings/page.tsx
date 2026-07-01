'use client';

import React, { useState } from 'react';
import {
    CheckCircle2,
    X,
    AlertTriangle,
    Search,
    Building2,
    EyeOff,
    Check
} from 'lucide-react';

export default function ListingInteractionsPage() {
    const [listings, setListings] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchListings = () => {
        fetch('http://localhost:3001/api/properties', { cache: 'no-store' })
            .then(res => res.json())
            .then(data => {
                const mapped = data.map((item: any) => ({
                    id: item.id,
                    title: item.title,
                    owner: item.owner ? `${item.owner.firstName || ''} ${item.owner.lastName || ''}`.trim() || 'Admin/Owner' : 'Unknown Owner',
                    ownerEmail: item.owner?.email || 'N/A',
                    location: `${item.city || 'Anytown'}, ${item.state || 'ST'}`,
                    price: `$${item.price}/mo`,
                    fraudScore: Math.floor(Math.random() * 80) + 20, // Mock noise level for demo
                    status: item.status === 'Disabled' ? 'Disabled' : 'Active',
                    image: item.images?.[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=400&q=80'
                }));
                setListings(mapped);
            })
            .catch(console.error);
    };

    React.useEffect(() => {
        fetchListings();
    }, []);

    const toggleStatus = async (id: string) => {
        try {
            const res = await fetch(`http://localhost:3001/api/properties/${id}/toggle-status`, {
                method: 'POST'
            });
            if (res.ok) {
                fetchListings();
            }
        } catch (err) {
            console.error(err);
        }
    };

    const filteredListings = listings.filter((item) => {
        const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.id.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSearch;
    });

    return (
        <div className="space-y-6 max-w-[1600px] mx-auto animate-in fade-in duration-300">

            {/* Metric Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex justify-between items-start">
                    <div className="space-y-1">
                        <span className="text-xs font-extrabold text-gray-400 uppercase tracking-wider">Active Approved Properties</span>
                        <div className="text-3xl font-black text-gray-900">
                            {listings.filter(l => l.status === 'Active').length}
                        </div>
                        <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-md inline-block mt-2">Live on Marketplace</span>
                    </div>
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                        <Building2 className="w-5 h-5" />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex justify-between items-start">
                    <div className="space-y-1">
                        <span className="text-xs font-extrabold text-gray-400 uppercase tracking-wider">Disabled Properties</span>
                        <div className="text-3xl font-black text-red-600">
                            {listings.filter(l => l.status === 'Disabled').length}
                        </div>
                        <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-md inline-block mt-2">Hidden from Search</span>
                    </div>
                    <div className="p-3 bg-red-50 text-red-600 rounded-2xl">
                        <EyeOff className="w-5 h-5" />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex justify-between items-start">
                    <div className="space-y-1">
                        <span className="text-xs font-extrabold text-gray-400 uppercase tracking-wider">High Noise Level Flags</span>
                        <div className="text-3xl font-black text-gray-900">
                            {listings.filter(l => l.fraudScore > 75).length}
                        </div>
                        <span className="text-xs font-bold text-amber-500 bg-amber-50 px-2 py-0.5 rounded-md inline-block mt-2">Requires Auditing</span>
                    </div>
                    <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
                        <AlertTriangle className="w-5 h-5" />
                    </div>
                </div>
            </div>

            {/* Main Filter & Work Area Workspace */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    {/* Leftside Search Wrapper */}
                    <div className="relative w-full sm:w-80">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
                            <Search className="w-4 h-4" />
                        </span>
                        <input
                            type="text"
                            placeholder="Search approved properties by title, owner, ID..."
                            className="w-full bg-[#F8FAFC] pl-10 pr-4 py-2.5 rounded-xl text-xs font-semibold text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 transition"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div>
                        <span className="text-xs text-gray-400 font-extrabold uppercase tracking-wider">Moderation Level: Full</span>
                    </div>
                </div>

                {/* Listings Queue Display as Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs font-bold">
                        <thead>
                            <tr className="border-b border-gray-100 text-gray-400 uppercase tracking-widest text-[9px]">
                                <th className="py-4 px-4">Property</th>
                                <th className="py-4 px-4">Owner</th>
                                <th className="py-4 px-4">Location</th>
                                <th className="py-4 px-4">Price</th>
                                <th className="py-4 px-4">Status</th>
                                <th className="py-4 px-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredListings.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="text-center py-12 text-gray-400 font-semibold">
                                        No properties match your search queries.
                                    </td>
                                </tr>
                            ) : (
                                filteredListings.map((listing) => (
                                    <tr
                                        key={listing.id}
                                        className={`hover:bg-[#F8FAFB]/70 transition group ${
                                            listing.status === 'Disabled' ? 'bg-red-50/10' : ''
                                        }`}
                                    >
                                        <td className="py-4 px-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                                                    <img
                                                        src={listing.image}
                                                        alt={listing.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div>
                                                    <p className="text-gray-950 font-extrabold max-w-[150px] truncate">{listing.title}</p>
                                                    <p className="text-gray-400 font-semibold text-[9px] mt-0.5">ID: {listing.id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <p className="text-gray-800 font-bold max-w-[150px] truncate">{listing.owner}</p>
                                            <p className="text-gray-400 font-semibold text-[9px] mt-0.5 max-w-[150px] truncate">{listing.ownerEmail}</p>
                                        </td>
                                        <td className="py-4 px-4">
                                            <p className="text-gray-700 font-semibold max-w-[150px] truncate">{listing.location}</p>
                                        </td>
                                        <td className="py-4 px-4 text-gray-900 font-extrabold">
                                            {listing.price}
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className={`px-2 py-1 rounded-lg text-[9px] font-extrabold uppercase tracking-wide border ${
                                                listing.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'
                                            }`}>
                                                {listing.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex items-center justify-center">
                                                {listing.status === 'Active' ? (
                                                    <button 
                                                        onClick={() => toggleStatus(listing.id)}
                                                        title="Disable Property"
                                                        className="px-3 py-1.5 rounded-lg font-extrabold transition cursor-pointer flex items-center justify-center border bg-white text-red-500 border-gray-200 hover:bg-red-50 hover:border-red-100 text-[10px] uppercase tracking-wider"
                                                    >
                                                        Disable
                                                    </button>
                                                ) : (
                                                    <button 
                                                        onClick={() => toggleStatus(listing.id)}
                                                        title="Enable Property"
                                                        className="px-3 py-1.5 rounded-lg font-extrabold transition cursor-pointer flex items-center justify-center border bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100 text-[10px] uppercase tracking-wider"
                                                    >
                                                        Enable
                                                    </button>
                                                )}
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