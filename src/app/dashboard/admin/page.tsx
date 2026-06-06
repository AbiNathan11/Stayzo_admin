'use client';

import React from 'react';
import Link from 'next/link';
import {
  Users,
  Building2,
  Activity,
  MessageSquare,
  FileText,
  ArrowRight,
  TrendingUp,
  ShieldAlert
} from 'lucide-react';

export default function AdminOverviewDashboard() {
  // Global aggregate metrics reflecting your dashboard's feature set
  const stats = [
    { label: 'Total Platform Users', value: '1,248', change: '+12% this week', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Pending Approvals', value: '14', change: 'Requires evaluation', icon: Building2, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Active Escrow Leases', value: '84', change: 'Live agreements', icon: FileText, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'System Flagged Anomalies', value: '3', change: 'High priority risk', icon: ShieldAlert, color: 'text-red-600', bg: 'bg-red-50' },
  ];

  // Quick action gateways mapped exactly to your sidebar paths
  const modules = [
    {
      title: 'User Management',
      description: 'Audit registered property owners and tenant profiles, verify documentation permissions, and alter security states.',
      href: '/dashboard/admin/users',
      icon: Users,
      actionText: 'Review Accounts'
    },
    {
      title: 'Listing Interactions',
      description: 'Moderate pending rental submissions, verify property ownership credentials, and inspect automated AI fraud risk metrics.',
      href: '/dashboard/admin/listings',
      icon: Building2,
      actionText: 'Open Queue'
    },
    {
      title: 'Activity Monitoring',
      description: 'Track ongoing real-time operational transaction histories, visitor analytics logs, and framework performance status.',
      href: '/dashboard/admin/activities',
      icon: Activity,
      actionText: 'View Metrics'
    },
    {
      title: 'Ratings & Reviews',
      description: 'Moderate user reviews and platform feedback, filter out potential spam clusters, and uphold review community integrity.',
      href: '/dashboard/admin/reviews',
      icon: MessageSquare,
      actionText: 'Moderate Content'
    },
    {
      title: 'Agreements & Disputes',
      description: 'Inspect legally binding digital tenancy agreements, oversee safety deposit conditions, and resolve incoming platform conflicts.',
      href: '/dashboard/admin/agreements',
      icon: FileText,
      actionText: 'Mediate Cases'
    }
  ];

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto">

      {/* Platform Summary Analytics Ribbons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex justify-between items-start transition hover:shadow-md duration-200"
            >
              <div className="space-y-1">
                <span className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider block">
                  {stat.label}
                </span>
                <div className="text-3xl font-black text-gray-900 tracking-tight">
                  {stat.value}
                </div>
                <span className="text-[11px] font-bold text-gray-400 flex items-center gap-1 pt-1">
                  <TrendingUp className="w-3 h-3 text-gray-400 shrink-0" />
                  {stat.change}
                </span>
              </div>
              <div className={`p-3.5 rounded-2xl ${stat.bg} ${stat.color} shrink-0`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Revenue Graph Card */}
      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4 transition hover:shadow-md duration-200">
        <div className="flex justify-between items-center pb-2 border-b border-gray-50">
          <div>
            <h3 className="font-extrabold text-base text-gray-900">Revenue Analytics</h3>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Monthly platform revenue growth</p>
          </div>
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
            +18.4% YoY Growth
          </span>
        </div>
        
        {/* SVG Area Chart representing the revenue */}
        <div className="relative w-full h-[260px] pt-4">
          <svg viewBox="0 0 1000 260" className="w-full h-full">
            {/* Defs for gradients */}
            <defs>
              <linearGradient id="revenue-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10B981" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            <line x1="50" y1="30" x2="950" y2="30" stroke="#F8FAFC" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="50" y1="80" x2="950" y2="80" stroke="#F8FAFC" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="50" y1="130" x2="950" y2="130" stroke="#F8FAFC" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="50" y1="180" x2="950" y2="180" stroke="#F8FAFC" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="50" y1="220" x2="950" y2="220" stroke="#E2E8F0" strokeWidth="1" />

            {/* Y Axis Labels */}
            <text x="40" y="34" textAnchor="end" className="text-[10px] font-extrabold fill-gray-400">Rs 500K</text>
            <text x="40" y="84" textAnchor="end" className="text-[10px] font-extrabold fill-gray-400">Rs 375K</text>
            <text x="40" y="134" textAnchor="end" className="text-[10px] font-extrabold fill-gray-400">Rs 250K</text>
            <text x="40" y="184" textAnchor="end" className="text-[10px] font-extrabold fill-gray-400">Rs 125K</text>
            <text x="40" y="224" textAnchor="end" className="text-[10px] font-extrabold fill-gray-400">Rs 0</text>

            {/* Data Line (Revenue path) */}
            <path
              d="M 50 220 C 120 180, 200 190, 280 140 C 360 90, 440 120, 520 80 C 600 40, 680 70, 760 50 C 840 30, 920 40, 950 35 L 950 220 L 50 220 Z"
              fill="url(#revenue-grad)"
            />
            <path
              d="M 50 220 C 120 180, 200 190, 280 140 C 360 90, 440 120, 520 80 C 600 40, 680 70, 760 50 C 840 30, 920 40, 950 35"
              fill="none"
              stroke="#10B981"
              strokeWidth="3.5"
              strokeLinecap="round"
            />

            {/* Interactive Data Nodes */}
            <circle cx="280" cy="140" r="5" fill="#10B981" stroke="#FFFFFF" strokeWidth="2" />
            <circle cx="520" cy="80" r="5" fill="#10B981" stroke="#FFFFFF" strokeWidth="2" />
            <circle cx="760" cy="50" r="5" fill="#10B981" stroke="#FFFFFF" strokeWidth="2" />
            <circle cx="950" cy="35" r="5" fill="#10B981" stroke="#FFFFFF" strokeWidth="2" />

            {/* Label overlays for nodes */}
            <text x="280" y="125" textAnchor="middle" className="text-[9px] font-black fill-gray-900">Rs 280K</text>
            <text x="520" y="65" textAnchor="middle" className="text-[9px] font-black fill-gray-900">Rs 395K</text>
            <text x="760" y="35" textAnchor="middle" className="text-[9px] font-black fill-gray-900">Rs 440K</text>
            <text x="950" y="20" textAnchor="end" className="text-[9px] font-black fill-[#10B981]">Rs 495K</text>

            {/* X Axis Labels */}
            <text x="50" y="242" textAnchor="middle" className="text-[10px] font-extrabold fill-gray-400">Jan</text>
            <text x="131" y="242" textAnchor="middle" className="text-[10px] font-extrabold fill-gray-400">Feb</text>
            <text x="212" y="242" textAnchor="middle" className="text-[10px] font-extrabold fill-gray-400">Mar</text>
            <text x="293" y="242" textAnchor="middle" className="text-[10px] font-extrabold fill-gray-400">Apr</text>
            <text x="374" y="242" textAnchor="middle" className="text-[10px] font-extrabold fill-gray-400">May</text>
            <text x="455" y="242" textAnchor="middle" className="text-[10px] font-extrabold fill-gray-400">Jun</text>
            <text x="536" y="242" textAnchor="middle" className="text-[10px] font-extrabold fill-gray-400">Jul</text>
            <text x="617" y="242" textAnchor="middle" className="text-[10px] font-extrabold fill-gray-400">Aug</text>
            <text x="698" y="242" textAnchor="middle" className="text-[10px] font-extrabold fill-gray-400">Sep</text>
            <text x="779" y="242" textAnchor="middle" className="text-[10px] font-extrabold fill-gray-400">Oct</text>
            <text x="860" y="242" textAnchor="middle" className="text-[10px] font-extrabold fill-gray-400">Nov</text>
            <text x="950" y="242" textAnchor="end" className="text-[10px] font-extrabold fill-gray-400">Dec</text>
          </svg>
        </div>
      </div>

      {/* Main Terminal Activity Grid */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-black text-gray-900 tracking-tight">System Modules Control Gateways</h2>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-0.5">
            Quickly navigate and dispatch administrator operations across operational clusters
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {modules.map((mod, idx) => {
            const Icon = mod.icon;
            return (
              <div
                key={idx}
                className="bg-white border border-gray-100 rounded-3xl p-6 flex flex-col justify-between hover:shadow-md transition duration-200"
              >
                <div className="space-y-4">
                  <div className="w-10 h-10 bg-[#1A1A1A] text-white rounded-xl flex items-center justify-center font-extrabold shadow-sm">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-sm font-black text-gray-900 tracking-tight">
                      {mod.title}
                    </h3>
                    <p className="text-xs font-medium text-gray-400 leading-relaxed">
                      {mod.description}
                    </p>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-50 mt-6">
                  <Link
                    href={mod.href}
                    className="w-full flex items-center justify-between px-4 py-2.5 bg-[#F8FAFC] hover:bg-[#1A1A1A] text-gray-700 hover:text-white rounded-xl text-xs font-extrabold transition group"
                  >
                    <span>{mod.actionText}</span>
                    <ArrowRight className="w-3.5 h-3.5 transition group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}