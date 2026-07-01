"use client";

import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
// Added Building2 icon for the Listing Interactions item
import { LayoutDashboard, Users, Activity, FileText, MessageSquare, LogOut, Building2, Mail, X, Menu, Camera, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [adminUser, setAdminUser] = useState<{ firstName: string; lastName: string; email: string; profileImage?: string | null } | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Profile modal states
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ firstName: '', lastName: '', email: '', profileImage: '' as string | null });
  const [loading, setLoading] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const fetchProfile = () => {
    const token = Cookies.get('stayzo_token');
    if (!token) return;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const lowerEmail = (payload.email || '').toLowerCase();
      fetch(`http://localhost:3001/api/auth/profile/${lowerEmail}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setAdminUser({
            firstName: data.user.firstName || payload.firstName || 'Administrator',
            lastName: data.user.lastName || payload.lastName || '',
            email: data.user.email || payload.email || 'admin@stayzo.com',
            profileImage: data.user.profileImage
          });
        }
      })
      .catch(err => {
        console.error('Failed to fetch user profile', err);
        setAdminUser({
          firstName: payload.firstName || 'Administrator',
          lastName: payload.lastName || '',
          email: payload.email || 'admin@stayzo.com',
          profileImage: null
        });
      });
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const token = Cookies.get('stayzo_token');
    if (!token) {
      window.location.href = '/login';
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const lowerEmail = (payload.email || '').toLowerCase();
      const isAdminUser = !!payload.isAdmin || lowerEmail === 'stayzoavp@gmail.com' || lowerEmail.startsWith('admin@');
      
      if (!isAdminUser) {
        window.location.href = '/login';
        return;
      }

      fetchProfile();
    } catch (e) {
      console.error('Failed to parse admin token', e);
      window.location.href = '/login';
    }
  }, []);

  const handleSaveProfile = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!editForm.firstName.trim()) {
      toast.error("First name is required.");
      return;
    }
    setLoading(true);
    const token = Cookies.get('stayzo_token');
    try {
      const res = await fetch('http://localhost:3001/api/auth/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          email: editForm.email,
          firstName: editForm.firstName,
          lastName: editForm.lastName,
          profileImage: editForm.profileImage
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update profile');

      setAdminUser({
        firstName: data.user?.firstName || editForm.firstName,
        lastName: data.user?.lastName || editForm.lastName,
        email: data.user?.email || editForm.email,
        profileImage: data.user?.profileImage || editForm.profileImage
      });
      setIsEditing(false);
      toast.success("Profile details updated successfully.");
    } catch (err: any) {
      toast.error(err.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditForm(prev => ({ ...prev, profileImage: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = () => {
    Cookies.remove('stayzo_token');
    Cookies.remove('stayzo_refresh_token');
    localStorage.removeItem('stayzo_admin_profile');
    window.location.href = '/login';
  };

  const getPageTitle = () => {
    if (pathname === '/dashboard/admin') return 'Platform Overview';
    if (pathname?.startsWith('/dashboard/admin/users')) return 'Users Management';
    if (pathname?.startsWith('/dashboard/admin/listings')) return 'Listing Interactions';
    if (pathname?.startsWith('/dashboard/admin/activities')) return 'Activities Management';
    if (pathname?.startsWith('/dashboard/admin/messages')) return 'Contact Messages';
    if (pathname?.startsWith('/dashboard/admin/reviews')) return 'Reviews Management';
    if (pathname?.startsWith('/dashboard/admin/agreements')) return 'Agreements Management';
    return 'Dashboard';
  };

  const navSections = [
    {
      items: [
        { href: '/dashboard/admin', label: 'Overview Dashboard', icon: LayoutDashboard },
        { href: '/dashboard/admin/users', label: 'User Accounts', icon: Users },
      ],
    },
    {
      items: [
        // Placed here parallel with user and platform activity monitoring pipelines
        { href: '/dashboard/admin/listings', label: 'Listing Interactions', icon: Building2 },
        { href: '/dashboard/admin/activities', label: 'Activity Monitor', icon: Activity },
        { href: '/dashboard/admin/messages', label: 'Messages', icon: Mail },
        { href: '/dashboard/admin/reviews', label: 'Ratings & Reviews', icon: MessageSquare },
      ],
    },
    {
      items: [
        { href: '/dashboard/admin/agreements', label: 'Agreements & Disputes', icon: FileText },
      ],
    },
  ];

  return (
    <div className="h-screen overflow-hidden bg-[#F8FAFC] text-[#1A1A1A] font-sans selection:bg-[#1A1A1A] selection:text-white flex">

      {/* SIDEBAR OVERLAY FOR MOBILE */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 md:hidden animate-in fade-in duration-200"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-[280px] bg-white border-r border-gray-100 flex flex-col shrink-0 transition-transform duration-300 md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>

        {/* Brand Header */}
        <div className="p-8 border-b border-gray-50 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="flex items-end space-x-1 h-5">
              <div className="w-[3px] h-3 bg-[#1A1A1A] rounded-full group-hover:bg-[#1A1A1A] transition-colors"></div>
              <div className="w-[3px] h-5 bg-[#1A1A1A] rounded-full group-hover:bg-[#1A1A1A] transition-colors"></div>
              <div className="w-[3px] h-4 bg-[#1A1A1A] rounded-full group-hover:bg-[#1A1A1A] transition-colors"></div>
              <div className="w-[3px] h-2.5 bg-[#1A1A1A] rounded-full group-hover:bg-[#1A1A1A] transition-colors"></div>
            </div>
            <span className="text-xl font-bold tracking-tight text-[#1A1A1A]">Stayzo</span>
            <span className="bg-[#1A1A1A] text-white text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ml-1 tracking-wider">Admin</span>
          </Link>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden text-gray-400 hover:text-gray-900 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Menu Sections */}
        <div className="flex-1 px-4 py-8 overflow-y-auto space-y-3 select-none">
          {navSections.map((section, idx) => (
            <nav key={idx} className="space-y-3">
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsSidebarOpen(false)}
                    className={`w-full flex items-center space-x-3.5 px-4 py-3 rounded-2xl text-xs font-extrabold transition text-left cursor-pointer ${isActive
                      ? 'bg-[#1A1A1A] text-white shadow-sm'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          ))}
        </div>

        {/* Sidebar Footer with Logout */}
        <div className="p-6 border-t border-gray-50">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3.5 px-4 py-3 rounded-2xl text-xs font-extrabold text-red-500 hover:bg-red-50 transition text-left cursor-pointer select-none"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Logout Administrator</span>
          </button>
        </div>

      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* HEADER */}
        <header className="h-20 bg-white border-b border-gray-100 px-6 sm:px-8 flex justify-between items-center z-30 shrink-0 select-none">
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -ml-2 text-gray-500 hover:text-gray-900 md:hidden outline-none cursor-pointer"
            >
              <Menu className="w-5.5 h-5.5" />
            </button>
            <div>
              <h1 className="text-sm sm:text-xl font-extrabold tracking-tight text-gray-900 capitalize">
                {getPageTitle()}
              </h1>
              <p className="text-gray-400 text-[8px] sm:text-[10px] font-extrabold uppercase tracking-wider mt-0.5">
                Stayzo Control Terminal &bull; Live Status
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <button 
              onClick={() => {
                if (adminUser) {
                  setEditForm({
                    firstName: adminUser.firstName,
                    lastName: adminUser.lastName,
                    email: adminUser.email,
                    profileImage: adminUser.profileImage || ''
                  });
                }
                setIsEditing(false);
                setIsProfileOpen(true);
              }}
              className="flex items-center space-x-3 hover:opacity-80 transition text-left outline-none cursor-pointer"
            >
              <div className="text-right hidden sm:block">
                <p className="text-xs font-extrabold text-gray-900">{adminUser?.firstName} {adminUser?.lastName}</p>
                <p className="text-[10px] font-bold text-gray-400">{adminUser?.email}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#1A1A1A] text-white border border-gray-100 shadow-sm flex items-center justify-center font-extrabold text-sm select-none overflow-hidden shrink-0">
                {adminUser?.profileImage ? (
                  <img src={adminUser.profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  adminUser?.firstName?.charAt(0).toUpperCase() || 'A'
                )}
              </div>
            </button>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 max-w-7xl w-full mx-auto space-y-6 sm:space-y-8">
          {children}
        </main>

      </div>

      {/* PROFILE DIALOG MODAL */}
      {isProfileOpen && adminUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={!loading ? () => { setIsProfileOpen(false); setIsEditing(false); } : undefined} />
          
          <div className="relative w-full max-w-md bg-white rounded-[24px] shadow-2xl animate-in fade-in zoom-in-95 duration-200 overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-extrabold text-[#1A1A1A]">{isEditing ? 'Edit Profile' : 'Admin Profile Details'}</h2>
              <button 
                onClick={() => { setIsProfileOpen(false); setIsEditing(false); }}
                disabled={loading}
                className="p-2 hover:bg-gray-100 rounded-full transition disabled:opacity-50"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto">
              {!isEditing ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 bg-gray-50 p-4 rounded-2xl">
                    <div className="w-16 h-16 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center font-extrabold text-2xl overflow-hidden shrink-0 shadow-sm border border-gray-200">
                      {adminUser.profileImage ? (
                        <img src={adminUser.profileImage} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        adminUser.firstName.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-lg text-gray-900">{adminUser.firstName} {adminUser.lastName}</h4>
                      <p className="text-xs text-gray-500 font-semibold mt-0.5">{adminUser.email}</p>
                    </div>
                  </div>

                  <div className="space-y-4 pt-2">
                    <div className="grid grid-cols-3 border-b border-gray-100 pb-3">
                      <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">First Name</span>
                      <span className="col-span-2 text-sm text-gray-900 font-semibold">{adminUser.firstName}</span>
                    </div>
                    <div className="grid grid-cols-3 border-b border-gray-100 pb-3">
                      <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Last Name</span>
                      <span className="col-span-2 text-sm text-gray-900 font-semibold">{adminUser.lastName || '-'}</span>
                    </div>
                    <div className="grid grid-cols-3">
                      <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Email</span>
                      <span className="col-span-2 text-sm text-gray-900 font-semibold">{adminUser.email}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Avatar Section */}
                  <div className="flex flex-col items-center justify-center mb-2">
                    <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                      {editForm.profileImage ? (
                        <img 
                          src={editForm.profileImage} 
                          alt="Profile Preview" 
                          className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                        />
                      ) : (
                        <div className="w-24 h-24 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center text-3xl font-black shadow-lg border-4 border-white">
                          {editForm.firstName.charAt(0).toUpperCase() || 'A'}
                        </div>
                      )}
                      <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Camera className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <p className="mt-3 text-xs font-bold text-indigo-600 cursor-pointer hover:underline" onClick={() => fileInputRef.current?.click()}>
                      Change Picture
                    </p>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleFileChange} 
                      accept="image/*" 
                      className="hidden" 
                    />
                  </div>

                  {/* Form Fields */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">First Name</label>
                      <input 
                        type="text" 
                        value={editForm.firstName} 
                        onChange={e => setEditForm({ ...editForm, firstName: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                        placeholder="Enter your first name"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Last Name</label>
                      <input 
                        type="text" 
                        value={editForm.lastName} 
                        onChange={e => setEditForm({ ...editForm, lastName: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                        placeholder="Enter your last name"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Email Address</label>
                      <input 
                        type="email" 
                        value={editForm.email} 
                        disabled
                        className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-sm font-semibold text-gray-400 cursor-not-allowed"
                      />
                      <p className="mt-1 text-[11px] text-gray-400 font-medium">Email addresses cannot be changed.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-50 bg-gray-50 flex justify-end space-x-3">
              {!isEditing ? (
                <>
                  <button
                    onClick={() => setIsProfileOpen(false)}
                    className="px-5 py-2.5 rounded-full text-sm font-bold text-gray-600 hover:bg-gray-200 transition"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      setEditForm({
                        firstName: adminUser.firstName,
                        lastName: adminUser.lastName,
                        email: adminUser.email,
                        profileImage: adminUser.profileImage || null
                      });
                      setIsEditing(true);
                    }}
                    className="px-6 py-2.5 rounded-full text-sm font-bold bg-[#1A1A1A] text-white hover:bg-black transition shadow-md hover:shadow-lg"
                  >
                    Edit Profile
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={() => setIsEditing(false)}
                    disabled={loading}
                    className="px-5 py-2.5 rounded-full text-sm font-bold text-gray-600 hover:bg-gray-200 transition disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => handleSaveProfile()}
                    disabled={loading || !editForm.firstName.trim()}
                    className="px-6 py-2.5 rounded-full text-sm font-bold bg-[#1A1A1A] text-white hover:bg-black transition disabled:opacity-50 flex items-center space-x-2 shadow-md hover:shadow-lg"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <span>Save Changes</span>
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}