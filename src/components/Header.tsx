/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShieldCheck, UserCircle, Bell, Search, Users, Sparkles, RefreshCw, Layers } from 'lucide-react';
import { HRNotification, AdminAccount } from '../types';

interface HeaderProps {
  isAdmin: boolean;
  setIsAdmin: (isAdmin: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  notifications: HRNotification[];
  markNotificationAsRead: (id: string) => void;
  onSeedMore: () => void;
  employeeCount: number;
  currentAdminSession: AdminAccount | null;
  onAdminLogout: () => void;
}

export default function Header({
  isAdmin,
  setIsAdmin,
  searchQuery,
  setSearchQuery,
  notifications,
  markNotificationAsRead,
  onSeedMore,
  employeeCount,
  currentAdminSession,
  onAdminLogout,
}: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-xs" id="hris-app-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Brand Logo & Name */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="p-1 sm:p-1.5 rounded-lg shadow-sm flex items-center justify-center bg-white border border-slate-150 shrink-0">
              <img 
                src="https://raw.githubusercontent.com/251805/etcfile/main/PCCLogo.png" 
                alt="PCC Logo" 
                className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h1 className="text-xs sm:text-base font-bold text-slate-900 tracking-tight flex flex-wrap sm:flex-nowrap items-center gap-1 sm:gap-1.5 leading-tight">
                Pagbilao Command Center
                <span className="text-[9px] sm:text-[10px] bg-red-100 text-red-700 font-bold px-1.5 py-0.5 sm:px-2 rounded-full uppercase tracking-wider">
                  Duty Roster
                </span>
              </h1>
              <p className="hidden sm:block text-[11px] font-mono text-slate-500 font-medium leading-none mt-0.5">
                Duty Scheduling & Workforce Portal
              </p>
            </div>
          </div>

          {/* Search Bar - Global Find */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Search size={18} />
              </div>
              <input
                id="global-employee-search"
                type="text"
                placeholder="Search employee name to highlight..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all font-sans placeholder-slate-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-slate-400 hover:text-slate-600"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Action Tools & Role Switcher */}
          <div className="flex items-center space-x-4">
            
            {/* Quick Stats Indicator */}
            <div className="hidden lg:flex items-center space-x-1.5 text-xs bg-slate-100 text-slate-600 font-medium px-2.5 py-1.5 rounded-md">
              <Users size={14} className="text-slate-500" />
              <span>{employeeCount} Staff active</span>
            </div>

            {/* Seed More Button for Administrators */}
            {isAdmin && employeeCount < 100 && (
              <button
                id="quick-seed-expand-btn"
                onClick={onSeedMore}
                className="hidden sm:flex items-center gap-1.5 text-xs bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 px-2.5 py-1.5 rounded-lg font-medium transition"
                title="Expand database with randomly generated roster up to 100 staff elements"
              >
                <Sparkles size={14} />
                <span>Seed 100 Staff</span>
              </button>
            )}

            {/* Notifications Dropdown Selector */}
            <div className="relative">
              <button
                id="hris-notifications-bell"
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg relative transition"
                aria-label="Notifications"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 block h-4 w-4 bg-red-600 text-white font-bold font-sans text-[9px] text-center rounded-full leading-4">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Overlay Panel */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden transform origin-top-right">
                  <div className="bg-slate-50 px-4 py-3 border-b border-slate-100 flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Recent Updates ({unreadCount} unread)
                    </span>
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="text-slate-400 hover:text-slate-600 text-xs font-semibold"
                    >
                      Close
                    </button>
                  </div>
                  <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-xs text-slate-400">
                        No active notifications.
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          className={`p-3 text-xs transition duration-150 ${
                            n.isRead ? 'bg-white' : 'bg-blue-50/50'
                          }`}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <span className="font-bold text-slate-800 leading-tight">
                              {n.title}
                            </span>
                            <span className="text-[9px] text-slate-400 whitespace-nowrap">
                              {new Date(n.timestamp).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                          <p className="text-slate-600 leading-relaxed mb-1.5">{n.message}</p>
                          {!n.isRead && (
                            <button
                              onClick={() => markNotificationAsRead(n.id)}
                              className="text-[10px] font-bold text-red-600 hover:text-red-700 transition"
                            >
                              Mark as read
                            </button>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Active Admin Session Badge */}
            {currentAdminSession && (
              <div className="flex items-center space-x-1.5 sm:space-x-2 bg-red-50 border border-red-100 px-2 py-1.5 rounded-lg text-xs leading-none">
                <span className="font-extrabold text-red-900 border-r border-red-200 pr-1.5 uppercase text-[9px] tracking-wider hidden sm:inline-block">
                  {currentAdminSession.username}
                </span>
                <button
                  type="button"
                  onClick={onAdminLogout}
                  className="text-[9px] font-black text-red-700 hover:text-red-950 hover:underline cursor-pointer uppercase tracking-wider transition-all"
                >
                  Log Out
                </button>
              </div>
            )}

            {/* Role Manager Controls */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-100">
              <button
                id="role-switch-employee"
                onClick={() => setIsAdmin(false)}
                className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  !isAdmin
                    ? 'bg-white text-blue-700 shadow-xs ring-1 ring-black/5 font-semibold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <UserCircle size={15} />
                <span className="hidden sm:inline">Employee View</span>
              </button>
              <button
                id="role-switch-admin"
                onClick={() => setIsAdmin(true)}
                className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isAdmin
                    ? 'bg-red-600 text-white shadow-xs font-semibold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <ShieldCheck size={15} />
                <span className="hidden sm:inline">Admin View</span>
              </button>
            </div>

          </div>
        </div>
      </div>
    </header>
  );
}
