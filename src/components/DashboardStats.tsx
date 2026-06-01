/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Calendar, Briefcase, UserCheck, Inbox, ArrowLeft, ArrowRight, RefreshCw } from 'lucide-react';
import { StatusTagType, ShiftType } from '../types';

interface DashboardStatsProps {
  currentDate: Date;
  onNavigateDay: (offset: number) => void;
  onNavigateMonth: (offset: number) => void;
  activeShiftsCount: Record<string, number>;
  totalEmployees: number;
  onLeaveCount: number;
  dayOffCount: number;
  pendingRequestsCount: number;
  isAdmin: boolean;
  onResetDatabase: () => void;
}

export default function DashboardStats({
  currentDate,
  onNavigateDay,
  onNavigateMonth,
  activeShiftsCount,
  totalEmployees,
  onLeaveCount,
  dayOffCount,
  pendingRequestsCount,
  isAdmin,
  onResetDatabase,
}: DashboardStatsProps) {
  const formattedDate = currentDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const monthLabel = currentDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div id="dashboard-stats-section">
      
      {/* Date Header and Quick Action Buttons */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-red-600 uppercase tracking-widest font-mono">
            Roster Timeline
          </span>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight mt-0.5">
            {formattedDate}
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Active view: <span className="font-semibold text-slate-700">{monthLabel} Calendar spreadsheet</span>
          </p>
        </div>

        {/* Quick Actions Navigation Controls */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Day Navigation */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200/50">
            <button
              onClick={() => onNavigateDay(-1)}
              className="p-1.5 hover:bg-white text-slate-700 rounded-md transition duration-150 cursor-pointer"
              title="Previous Day Schedule"
            >
              <ArrowLeft size={16} />
            </button>
            <span className="text-xs font-semibold px-2.5 text-slate-600">Daily</span>
            <button
              onClick={() => onNavigateDay(1)}
              className="p-1.5 hover:bg-white text-slate-700 rounded-md transition duration-150 cursor-pointer"
              title="Next Day Schedule"
            >
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Month Navigation */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200/50">
            <button
              onClick={() => onNavigateMonth(-1)}
              className="p-1.5 hover:bg-white text-slate-700 rounded-md transition duration-150 cursor-pointer"
              title="Previous Month"
            >
              <ArrowLeft size={16} />
            </button>
            <span className="text-xs font-semibold px-2.5 text-slate-600">Monthly</span>
            <button
              onClick={() => onNavigateMonth(1)}
              className="p-1.5 hover:bg-white text-slate-700 rounded-md transition duration-150 cursor-pointer"
              title="Next Month"
            >
              <ArrowRight size={16} />
            </button>
          </div>

          {/* System Reset Button */}
          {isAdmin && (
            <button
              onClick={onResetDatabase}
              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition cursor-pointer"
              title="Reset Database to Default Seed Data"
            >
              <RefreshCw size={15} />
            </button>
          )}

        </div>
      </div>
    </div>
  );
}
