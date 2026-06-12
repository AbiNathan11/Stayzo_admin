"use client";

import React, { useState, useEffect } from 'react';
import { Search, ShieldCheck, CheckCircle2, Mail, Calendar } from 'lucide-react';

interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: 'Tenant' | 'Landlord';
  status: 'Active' | 'Suspended';
  verified: boolean;
  joinedDate: string;
}

export default function UsersPage() {
  const [userSearch, setUserSearch] = useState('');
  const [userFilter, setUserFilter] = useState<'All' | 'Tenant' | 'Landlord'>('All');
  const [users, setUsers] = useState<UserAccount[]>([]);

  const fetchUsers = () => {
    fetch('http://localhost:3001/api/auth/users', { cache: 'no-store' })
      .then(res => res.json())
      .then((data: any[]) => {
        const mapped = data.map((u: any) => ({
          id: u.id,
          name: `${u.firstName || ''} ${u.lastName || ''}`.trim() || 'Unknown User',
          email: u.email,
          role: (u.isOwner ? 'Landlord' : 'Tenant') as 'Landlord' | 'Tenant',
          status: (u.status === 'Suspended' ? 'Suspended' : 'Active') as 'Active' | 'Suspended',
          verified: !!u.verified,
          joinedDate: new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        }));
        setUsers(mapped);
      })
      .catch(console.error);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleVerifyUser = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:3001/api/auth/users/${id}/toggle-verify`, {
        method: 'POST'
      });
      if (res.ok) {
        fetchUsers();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleSuspendUser = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:3001/api/auth/users/${id}/toggle-suspend`, {
        method: 'POST'
      });
      if (res.ok) {
        fetchUsers();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch =
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase());
    const matchesRole = userFilter === 'All' || u.role === userFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="bg-white border border-gray-100 rounded-[32px] p-6 shadow-sm space-y-6 animate-in fade-in duration-300">

      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-gray-50 pb-5">
        <div>
          <h3 className="font-extrabold text-base text-gray-900">User Directory</h3>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Verify, suspend, and audit platform accounts</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search users..."
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              className="bg-[#F8FAFB] text-xs font-bold text-gray-700 pl-9 pr-4 py-2 w-48 rounded-xl outline-none focus:ring-1 focus:ring-[#1A1A1A] border-none"
            />
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3.5 top-2.5" />
          </div>
          <div className="bg-[#F8FAFB] p-1 rounded-xl flex items-center space-x-1 text-[10px] font-extrabold uppercase select-none">
            {(['All', 'Tenant', 'Landlord'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setUserFilter(f)}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${userFilter === f ? 'bg-[#1A1A1A] text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
              >
                {f === 'All' ? 'All Roles' : f === 'Tenant' ? 'Tenants' : 'Landlords'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-gray-100 rounded-[32px] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-bold">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 uppercase tracking-widest text-[9px]">
                <th className="py-4 px-6">User Details</th>
                <th className="py-4 px-6">Email Address</th>
                <th className="py-4 px-6">Account Role</th>
                <th className="py-4 px-6">Joined Date</th>
                <th className="py-4 px-6">Account Status</th>
                <th className="py-4 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400 font-semibold">
                    No user accounts found matching your search.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((account) => (
                  <tr 
                    key={account.id} 
                    className={`hover:bg-gray-50/30 transition ${account.status === 'Suspended' ? 'bg-red-50/10' : ''}`}
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-xl bg-gray-100 text-[#1A1A1A] border border-gray-200/50 flex items-center justify-center font-extrabold text-sm select-none shrink-0">
                          {account.name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center space-x-1.5">
                            <span className="font-extrabold text-gray-900 text-sm leading-none">{account.name}</span>
                            {account.verified && (
                              <span title="Verified User">
                                <ShieldCheck className="w-4 h-4 text-emerald-500 fill-emerald-500/10 shrink-0" />
                              </span>
                            )}
                          </div>
                          <span className="text-[9px] text-gray-400 font-semibold block mt-1">ID: #USR-{account.id.substring(0, 8).toUpperCase()}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-1.5 text-gray-700">
                        <Mail className="w-3.5 h-3.5 text-gray-300" />
                        <span>{account.email}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 rounded-lg text-[9px] font-extrabold uppercase border ${account.role === 'Landlord' 
                        ? 'bg-purple-50 text-purple-600 border-purple-100' 
                        : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                        {account.role}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-400 font-semibold">
                      <div className="flex items-center space-x-1.5">
                        <Calendar className="w-3.5 h-3.5 text-gray-300" />
                        <span>{account.joinedDate}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 rounded-lg text-[9px] font-extrabold uppercase border ${account.status === 'Active' 
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                        : 'bg-red-50 text-red-600 border-red-100'}`}>
                        {account.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-center space-x-2 text-xs select-none">
                        <button
                          onClick={() => toggleVerifyUser(account.id)}
                          className={`px-3 py-1.5 rounded-xl font-extrabold transition cursor-pointer border flex items-center space-x-1 ${account.verified 
                            ? 'bg-emerald-50 border-emerald-100 text-emerald-600 hover:bg-emerald-100' 
                            : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                          <span>{account.verified ? 'Verified' : 'Verify'}</span>
                        </button>
                        <button
                          onClick={() => toggleSuspendUser(account.id)}
                          className={`px-3 py-1.5 rounded-xl font-extrabold transition cursor-pointer border ${account.status === 'Suspended' 
                            ? 'bg-red-500 border-red-500 text-white hover:bg-red-600' 
                            : 'bg-white border-red-200 text-red-500 hover:bg-red-50'}`}
                        >
                          {account.status === 'Suspended' ? 'Unsuspend' : 'Suspend'}
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
