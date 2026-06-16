"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
// Added Building2 icon for the Listing Interactions item
import { LayoutDashboard, Users, Activity, FileText, MessageSquare, LogOut, Building2, Mail, X, Menu } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [adminUser, setAdminUser] = useState<{ firstName: string; lastName: string; email: string; profileImage?: string | null } | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Profile modal states
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ firstName: '', lastName: '', email: '', profileImage: '' });

  const fetchProfile = () => {
    const token = sessionStorage.getItem('stayzo_token');
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
    const token = sessionStorage.getItem('stayzo_token');
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

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm.firstName) {
      toast.error("First name is required.");
      return;
    }
    const token = sessionStorage.getItem('stayzo_token');
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
        firstName: data.user.firstName,
        lastName: data.user.lastName,
        email: data.user.email,
        profileImage: data.user.profileImage
      });
      setIsEditing(false);
      toast.success("Profile details updated successfully.");
    } catch (err: any) {
      toast.error(err.message || 'An error occurred.');
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
    sessionStorage.removeItem('stayzo_token');
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
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-6 relative animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="font-extrabold text-lg text-gray-900">Admin Profile Details</h3>
              <button 
                onClick={() => { setIsProfileOpen(false); setIsEditing(false); }}
                className="text-gray-400 hover:text-gray-700 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {!isEditing ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-4 bg-gray-50 p-4 rounded-2xl">
                  <div className="w-12 h-12 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center font-extrabold text-lg overflow-hidden shrink-0">
                    {adminUser.profileImage ? (
                      <img src={adminUser.profileImage} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      adminUser.firstName.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-base text-gray-900">{adminUser.firstName} {adminUser.lastName}</h4>
                    <p className="text-xs text-gray-400 font-semibold">{adminUser.email}</p>
                  </div>
                </div>

                <div className="space-y-3 pt-2 text-xs font-bold text-gray-700">
                  <div className="grid grid-cols-3 border-b border-gray-100 pb-2">
                    <span className="text-gray-400 font-extrabold">First Name</span>
                    <span className="col-span-2 text-gray-900">{adminUser.firstName}</span>
                  </div>
                  <div className="grid grid-cols-3 border-b border-gray-100 pb-2">
                    <span className="text-gray-400 font-extrabold">Last Name</span>
                    <span className="col-span-2 text-gray-900">{adminUser.lastName || '-'}</span>
                  </div>
                  <div className="grid grid-cols-3">
                    <span className="text-gray-400 font-extrabold">Email Address</span>
                    <span className="col-span-2 text-gray-900">{adminUser.email}</span>
                  </div>
                </div>

                <div className="pt-4 flex space-x-3">
                  <button
                    onClick={() => {
                      setEditForm({
                        firstName: adminUser.firstName,
                        lastName: adminUser.lastName,
                        email: adminUser.email,
                        profileImage: adminUser.profileImage || ''
                      });
                      setIsEditing(true);
                    }}
                    className="flex-1 bg-[#1A1A1A] hover:bg-black text-white py-2.5 rounded-xl text-xs font-extrabold transition cursor-pointer text-center"
                  >
                    Edit Profile
                  </button>
                  <button
                    onClick={() => setIsProfileOpen(false)}
                    className="flex-1 border border-gray-200 hover:bg-gray-50 text-gray-700 py-2.5 rounded-xl text-xs font-extrabold transition cursor-pointer text-center"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="flex flex-col items-center space-y-2 pb-2">
                  <div className="w-20 h-20 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center font-extrabold text-2xl overflow-hidden border border-gray-100">
                    {editForm.profileImage ? (
                      <img src={editForm.profileImage} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      editForm.firstName.charAt(0).toUpperCase()
                    )}
                  </div>
                  <label className="text-xs text-blue-600 hover:text-blue-800 cursor-pointer font-bold bg-blue-50 px-3 py-1 rounded-lg border border-blue-100">
                    Upload Profile Picture
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                  </label>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">First Name</label>
                  <input
                    type="text"
                    required
                    value={editForm.firstName}
                    onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                    className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-xs font-bold text-gray-800 outline-none focus:ring-1 focus:ring-gray-300"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">Last Name</label>
                  <input
                    type="text"
                    value={editForm.lastName}
                    onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                    className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-xs font-bold text-gray-800 outline-none focus:ring-1 focus:ring-gray-300"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">Email Address (Read-only)</label>
                  <input
                    type="email"
                    required
                    disabled
                    value={editForm.email}
                    className="w-full bg-gray-100 border-none rounded-xl px-4 py-2.5 text-xs font-bold text-gray-400 cursor-not-allowed outline-none"
                  />
                </div>

                <div className="pt-4 flex space-x-3">
                  <button
                    type="submit"
                    className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-2.5 rounded-xl text-xs font-extrabold transition cursor-pointer text-center"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="flex-1 border border-gray-200 hover:bg-gray-50 text-gray-700 py-2.5 rounded-xl text-xs font-extrabold transition cursor-pointer text-center"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}