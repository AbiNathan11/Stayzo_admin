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
import PropertyReviews from '@/components/PropertyReviews';

export default function ListingInteractionsPage() {
    const [listings, setListings] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedProperty, setSelectedProperty] = useState<any | null>(null);
    const [nearbyAmenities, setNearbyAmenities] = useState<any[]>([]);
    const [loadingAmenities, setLoadingAmenities] = useState(false);
    const [showAllAmenities, setShowAllAmenities] = useState(false);

    const fetchListings = () => {
        fetch('http://localhost:3001/api/properties', { cache: 'no-store' })
            .then(res => res.json())
            .then(data => {
                const mapped = data.map((item: any) => ({
                    id: item.id,
                    title: item.title,
                    description: item.description,
                    category: item.category,
                    hall: item.hall,
                    bedrooms: item.bedrooms,
                    bathrooms: item.bathrooms,
                    amenities: item.amenities || [],
                    owner: item.owner ? `${item.owner.firstName || ''} ${item.owner.lastName || ''}`.trim() || 'Admin/Owner' : 'Unknown Owner',
                    ownerEmail: item.owner?.email || 'N/A',
                    location: `${item.city || 'Anytown'}, ${item.state || 'ST'}`,
                    price: `Rs ${item.price}/mo`,
                    fraudScore: Math.floor(Math.random() * 80) + 20, // Mock noise level for fallback
                    status: item.status === 'Disabled' ? 'Disabled' : 'Active',
                    image: item.images?.[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=400&q=80',
                    images: item.images || [],
                    latitude: item.latitude,
                    longitude: item.longitude,
                    noisePrediction: item.noisePrediction || null
                }));
                setListings(mapped);
            })
            .catch(console.error);
    };

    React.useEffect(() => {
        if (!selectedProperty) {
            setNearbyAmenities([]);
            setShowAllAmenities(false);
            return;
        }
        setLoadingAmenities(true);
        const query = selectedProperty.latitude && selectedProperty.longitude
            ? `lat=${selectedProperty.latitude}&lng=${selectedProperty.longitude}`
            : `address=${encodeURIComponent(selectedProperty.location)}`;
        fetch(`http://localhost:3001/api/properties/amenities?${query}&radius=3000`)
            .then(res => res.json())
            .then(data => {
                setNearbyAmenities(data.amenities || []);
            })
            .catch(err => {
                console.error('Error fetching amenities:', err);
                setNearbyAmenities([]);
            })
            .finally(() => setLoadingAmenities(false));
    }, [selectedProperty]);

    React.useEffect(() => {
        fetchListings();
    }, []);

    React.useEffect(() => {
        const mainEl = document.querySelector('main');
        if (selectedProperty) {
            if (mainEl) mainEl.style.overflowY = 'hidden';
        } else {
            if (mainEl) mainEl.style.overflowY = '';
        }
        return () => {
            if (mainEl) mainEl.style.overflowY = '';
        };
    }, [selectedProperty]);

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
            item.ownerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.price.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.id.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSearch;
    });

    return (
        <>
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
                            {listings.filter(l => l.noisePrediction?.label === 'High' || l.noisePrediction?.noiseLevelScore > 66).length}
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
                            placeholder="Search approved properties by title, owner..."
                            className="w-full bg-[#F8FAFC] pl-10 pr-4 py-2.5 rounded-xl text-xs font-semibold text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 transition"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
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
                                    <td colSpan={6} className="text-center py-12 text-gray-400 font-semibold">
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
                                            <div className="flex items-center justify-center space-x-2">
                                                <button
                                                    onClick={() => {
                                                        setSelectedProperty(listing);
                                                        fetch(`http://localhost:3001/api/properties/${listing.id}`)
                                                            .then(res => res.json())
                                                            .then(data => {
                                                                if (data.noisePrediction) {
                                                                    setSelectedProperty((prev: any) => prev && prev.id === listing.id ? { ...prev, noisePrediction: data.noisePrediction } : prev);
                                                                }
                                                            })
                                                            .catch(console.error);
                                                    }}
                                                    className="px-3 py-1.5 rounded-lg font-extrabold transition cursor-pointer border bg-white border-gray-200 text-gray-700 hover:bg-gray-50 text-[10px] uppercase tracking-wider"
                                                >
                                                    More Details
                                                </button>
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
            
        {/* Sliding Details Drawer for Property */}
            {selectedProperty && (
                <>
                    {/* Backdrop Overlay */}
                    <div 
                        className="fixed inset-0 bg-black/30 backdrop-blur-xs z-40 animate-in fade-in duration-200"
                        onClick={() => setSelectedProperty(null)}
                    />
                    
                    {/* Side Drawer Container */}
                    <div className="fixed top-0 right-0 h-full w-[480px] max-w-full bg-white shadow-[-8px_0_24px_rgba(0,0,0,0.08)] z-50 flex flex-col border-l border-gray-100 animate-in slide-in-from-right duration-300 rounded-l-[40px] overflow-hidden">
                        {/* Header */}
                        <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                            <div>
                                <h4 className="font-extrabold text-base text-gray-900">Property Details</h4>
                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">Specifications and status info</p>
                            </div>
                            <button
                                onClick={() => setSelectedProperty(null)}
                                className="text-gray-400 hover:text-gray-900 cursor-pointer p-1.5 rounded-lg hover:bg-gray-50 transition"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                            {/* Hero Image / Gallery */}
                            <div className="space-y-2">
                                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Property Gallery</span>
                                <div className="bg-gray-50 border border-gray-100 rounded-2xl overflow-hidden flex flex-col gap-2">
                                    {selectedProperty.images && selectedProperty.images.length > 0 ? (
                                        <div className="grid grid-cols-1 gap-2">
                                            <img
                                                src={selectedProperty.image}
                                                alt={selectedProperty.title}
                                                className="max-h-[240px] w-full object-cover"
                                            />
                                            {selectedProperty.images.length > 1 && (
                                                <div className="grid grid-cols-4 gap-2 px-2 pb-2">
                                                    {selectedProperty.images.slice(1, 5).map((imgUrl: string, i: number) => (
                                                        <img
                                                            key={i}
                                                            src={imgUrl}
                                                            alt="property sub-gallery"
                                                            className="h-14 w-full object-cover rounded-lg border border-gray-100"
                                                        />
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="text-gray-400 text-xs font-semibold py-8 text-center">No images uploaded</div>
                                    )}
                                </div>
                            </div>

                            {/* Info Box */}
                            <div className="space-y-4">
                                <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 pb-2">Specifications</h5>
                                <div className="grid grid-cols-2 gap-4 text-xs">
                                    <div className="space-y-1 bg-gray-50/20 p-3 rounded-xl border border-gray-50/50">
                                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Title</span>
                                        <span className="font-extrabold text-gray-900">{selectedProperty.title}</span>
                                    </div>
                                    <div className="space-y-1 bg-gray-50/20 p-3 rounded-xl border border-gray-50/50">
                                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Price</span>
                                        <span className="font-extrabold text-[#1A1A1A]">{selectedProperty.price}</span>
                                    </div>
                                    <div className="space-y-1 bg-gray-50/20 p-3 rounded-xl border border-gray-50/50">
                                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Location</span>
                                        <span className="font-extrabold text-gray-700">{selectedProperty.location}</span>
                                    </div>
                                    <div className="space-y-1 bg-gray-50/20 p-3 rounded-xl border border-gray-50/50">
                                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Halls</span>
                                        <span className="font-extrabold text-gray-700">{selectedProperty.hall || 0}</span>
                                    </div>
                                    <div className="space-y-1 bg-gray-50/20 p-3 rounded-xl border border-gray-50/50">
                                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Bedrooms</span>
                                        <span className="font-extrabold text-gray-700">{selectedProperty.bedrooms || 0}</span>
                                    </div>
                                    <div className="space-y-1 bg-gray-50/20 p-3 rounded-xl border border-gray-50/50">
                                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Bathrooms</span>
                                        <span className="font-extrabold text-gray-700">{selectedProperty.bathrooms || 0}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 pb-2">Description</h5>
                                <p className="text-xs font-bold text-gray-700 leading-relaxed bg-gray-50/30 p-4 border border-gray-100 rounded-2xl">
                                    {selectedProperty.description || 'No description provided.'}
                                </p>
                            </div>



                            {/* Noise Level Section */}
                            <div className="space-y-4">
                                <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 pb-2">Acoustic Noise Analysis</h5>
                                {selectedProperty.noisePrediction ? (
                                    <div className="bg-gray-50/50 border border-gray-100 rounded-3xl p-5 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Noise Level Score</span>
                                                <span className="text-2xl font-black text-gray-900">{selectedProperty.noisePrediction.noiseLevelScore} / 100</span>
                                            </div>
                                            <span className={`px-3 py-1 rounded-xl text-xs font-black uppercase border ${
                                                selectedProperty.noisePrediction.label === 'Low' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                selectedProperty.noisePrediction.label === 'Medium' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                                'bg-red-50 text-red-600 border-red-100'
                                            }`}>
                                                {selectedProperty.noisePrediction.label} Noise
                                            </span>
                                        </div>
                                        
                                        <p className="text-xs font-bold text-gray-600 leading-relaxed bg-white p-3 border border-gray-50 rounded-xl">
                                            {selectedProperty.noisePrediction.explanation}
                                        </p>


                                    </div>
                                ) : (
                                    <div className="text-gray-400 text-xs font-semibold py-4 text-center">No acoustic audit data available</div>
                                )}
                            </div>

                            {/* Nearby Amenities Section */}
                            <div className="space-y-4">
                                <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 pb-2">Nearby Amenities (3km radius)</h5>
                                {loadingAmenities ? (
                                    <div className="space-y-3">
                                        {[...Array(3)].map((_, i) => (
                                            <div key={i} className="animate-pulse flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-2xl p-3">
                                                <div className="w-8 h-8 bg-gray-200 rounded-lg shrink-0" />
                                                <div className="flex-1 space-y-1.5">
                                                    <div className="h-2.5 bg-gray-200 rounded w-2/3" />
                                                    <div className="h-2 bg-gray-100 rounded w-1/3" />
                                                </div>
                                                <div className="h-2.5 w-10 bg-gray-200 rounded" />
                                            </div>
                                        ))}
                                    </div>
                                ) : nearbyAmenities.length > 0 ? (
                                    <div className="space-y-3">
                                        <div className="grid grid-cols-1 gap-2.5">
                                            {(showAllAmenities ? nearbyAmenities : nearbyAmenities.slice(0, 5)).map((amenity: any) => {
                                                const getCategoryDetails = (cat: string) => {
                                                    switch(cat.toLowerCase()) {
                                                        case 'hospital': return { emoji: '🏥', bg: 'bg-red-50 text-red-600 border-red-100' };
                                                        case 'supermarket': return { emoji: '🛒', bg: 'bg-emerald-50 text-emerald-600 border-emerald-100' };
                                                        case 'bus_station': return { emoji: '🚌', bg: 'bg-blue-50 text-blue-600 border-blue-100' };
                                                        case 'school': return { emoji: '🏫', bg: 'bg-indigo-50 text-indigo-600 border-indigo-100' };
                                                        case 'university': return { emoji: '🎓', bg: 'bg-purple-50 text-purple-600 border-purple-100' };
                                                        case 'restaurant': return { emoji: '🍔', bg: 'bg-amber-50 text-amber-600 border-amber-100' };
                                                        case 'pharmacy': return { emoji: '💊', bg: 'bg-pink-50 text-pink-600 border-pink-100' };
                                                        default: return { emoji: '📍', bg: 'bg-gray-50 text-gray-600 border-gray-100' };
                                                    }
                                                };
                                                const details = getCategoryDetails(amenity.category);
                                                return (
                                                    <div key={amenity.id} className="flex items-center justify-between p-3.5 bg-white border border-gray-100 hover:border-gray-200 rounded-2xl transition">
                                                        <div className="flex items-center space-x-3 min-w-0">
                                                            <span className="text-xl shrink-0">{details.emoji}</span>
                                                            <div className="min-w-0">
                                                                <p className="text-xs font-extrabold text-gray-900 truncate">{amenity.name}</p>
                                                                <span className="text-[8px] font-bold text-gray-400 uppercase tracking-wider block mt-0.5">{amenity.category.replace('_', ' ')}</span>
                                                            </div>
                                                        </div>
                                                        <span className="text-[10px] font-extrabold text-gray-500 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-full shrink-0">
                                                            {amenity.distance >= 1000 ? `${(amenity.distance/1000).toFixed(1)} km` : `${amenity.distance} m`}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        {nearbyAmenities.length > 5 && (
                                            <button 
                                                onClick={() => setShowAllAmenities(!showAllAmenities)}
                                                className="w-full py-2 bg-gray-50 hover:bg-gray-100 border border-gray-100 rounded-xl text-[10px] font-bold text-gray-600 uppercase tracking-wider transition cursor-pointer"
                                            >
                                                {showAllAmenities ? 'See Less' : 'See More'}
                                            </button>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-gray-400 text-xs font-semibold py-4 text-center">No public venues or amenities found within 3km</div>
                                )}
                            </div>

                            {/* Owner Details */}
                            <div className="space-y-3">
                                <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 pb-2">Owner Metadata</h5>
                                <div className="bg-gray-50/50 border border-gray-100 rounded-2xl p-4 flex items-center space-x-3">
                                    <div className="w-10 h-10 rounded-xl bg-white text-[#1A1A1A] border border-gray-200/50 flex items-center justify-center font-extrabold text-sm select-none shadow-xs shrink-0">
                                        {selectedProperty.owner.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-xs font-extrabold text-gray-900">{selectedProperty.owner}</p>
                                        <p className="text-[9px] text-gray-400 font-semibold mt-0.5">{selectedProperty.ownerEmail}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions Panel Footer */}
                        <div className="p-6 border-t border-gray-50 bg-gray-50/30 flex items-center gap-3">
                            <button
                                onClick={() => {
                                    toggleStatus(selectedProperty.id);
                                    setSelectedProperty((prev: any) => prev ? { ...prev, status: prev.status === 'Active' ? 'Disabled' : 'Active' } : null);
                                }}
                                className={`flex-1 py-3 rounded-xl font-extrabold text-xs transition border flex items-center justify-center space-x-1.5 cursor-pointer ${
                                    selectedProperty.status === 'Active' 
                                        ? 'bg-red-50 border-red-100 text-red-500 hover:bg-red-100' 
                                        : 'bg-emerald-50 border-emerald-100 text-emerald-600 hover:bg-emerald-100'
                                }`}
                            >
                                <span>{selectedProperty.status === 'Active' ? 'Disable Property' : 'Enable Property'}</span>
                            </button>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}