/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShiftAssignment, Employee, ShiftType, StatusTagType } from '../types';
import { SHIFT_HOURS } from '../data';
import { Printer, Download, Eye, FileText, X, Save, Edit2, Sparkles, AlertCircle, Calendar, Grid, Layers, UserCheck } from 'lucide-react';

interface ScheduleGridProps {
  currentDate: Date;
  employees: Employee[];
  schedules: ShiftAssignment[];
  onUpdateCell: (employeeId: string, dateStr: string, shift: ShiftType | null, tag: StatusTagType | null) => void;
  isAdmin: boolean;
  searchQuery: string;
}

export default function ScheduleGrid({
  currentDate,
  employees,
  schedules,
  onUpdateCell,
  isAdmin,
  searchQuery,
}: ScheduleGridProps) {
  // Toggle selection for scheduler: 'daily' | 'weekly' | 'monthly'
  const [viewMode, setViewMode] = useState<'daily' | 'weekly' | 'monthly'>('monthly');

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // Get total days in currently configured month for Monthly Grid fallback
  const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Selected cell for Quick Edit modal
  const [editingCell, setEditingCell] = useState<{
    employeeId: string;
    employeeName: string;
    dateStr: string;
    dayNum: number;
    currentShift: ShiftType | null;
    currentTag: StatusTagType | null;
  } | null>(null);

  // Filter employees based on search query
  const filteredEmployees = employees.filter((emp) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return emp.name.toLowerCase().includes(q);
  });

  // Target Date String formatted in ISO split structure
  const isoTargetStr = currentDate.toISOString().split('T')[0];

  // Helper to retrieve cell data safely
  const getCellData = (empId: string, dateStr: string) => {
    return schedules.find((s) => s.employeeId === empId && s.date === dateStr);
  };

  // Trigger Cell edit selection
  const handleCellClick = (emp: Employee, dateStr: string, dayNum: number) => {
    if (!isAdmin) return;
    const data = getCellData(emp.id, dateStr);
    setEditingCell({
      employeeId: emp.id,
      employeeName: emp.name,
      dateStr: dateStr,
      dayNum: dayNum,
      currentShift: data ? data.shiftType : null,
      currentTag: data ? data.statusTag : null,
    });
  };

  // Apply quick update
  const handleApplyUpdate = (shift: ShiftType | null, tag: StatusTagType | null) => {
    if (editingCell) {
      onUpdateCell(editingCell.employeeId, editingCell.dateStr, shift, tag);
      setEditingCell(null);
    }
  };

  // Print function
  const handlePrint = () => {
    window.print();
  };

  // Monthly Days Generator Block
  const monthlyDays = Array.from({ length: totalDays }, (_, i) => {
    const dayNum = i + 1;
    const dateObj = new Date(currentYear, currentMonth, dayNum);
    const dayOfWeek = dateObj.getDay();
    const dayOfWeekName = dateObj.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const dateStr = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${dayNum.toString().padStart(2, '0')}`;

    return { dayNum, dayOfWeekName, isWeekend, dateStr };
  });

  // Weekly Days Generator Block: 7 days starting from selected currentDate
  const weeklyDays = Array.from({ length: 7 }, (_, i) => {
    const dateObj = new Date(currentDate);
    dateObj.setDate(currentDate.getDate() + i);
    const dayNum = dateObj.getDate();
    const dayOfWeek = dateObj.getDay();
    const dayOfWeekName = dateObj.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const dateStr = dateObj.toISOString().split('T')[0];

    return { dayNum, dayOfWeekName, isWeekend, dateStr };
  });

  // CSV Report Generator
  const handleDownloadCSV = () => {
    const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    let csvContent = `Pagbilao Command Center Schedule - ${monthName}\r\n`;
    
    // Headers list
    csvContent += 'Employee Name,' + monthlyDays.map(d => `${d.dayNum} (${d.dayOfWeekName})`).join(',') + '\r\n';

    // Rows values
    filteredEmployees.forEach(emp => {
      let row = `"${emp.name}"`;
      monthlyDays.forEach(d => {
        const data = getCellData(emp.id, d.dateStr);
        if (data) {
          if (data.statusTag) {
            row += `,"${data.statusTag}"`;
          } else if (data.shiftType) {
            row += `,"${data.shiftType}"`;
          } else {
            row += ',"-"';
          }
        } else {
          row += ',"-"';
        }
      });
      csvContent += row + '\r\n';
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Roster_${monthName.replace(' ', '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Get Styling Class for Shifting blocks
  const getCellStyles = (shift: ShiftType | null, tag: StatusTagType | null) => {
    if (tag === 'DAY OFF') {
      return 'bg-[#002fbe] text-white ring-1 ring-inset ring-white/10 flex items-center justify-center font-bold uppercase tracking-wider text-[10px] py-1 text-center font-sans h-[48px] shadow-2xs cursor-pointer';
    }
    if (tag === 'ABSENT') {
      return 'bg-rose-600 text-white flex items-center justify-center font-bold uppercase text-[9px] py-1 text-center h-[48px] ring-1 ring-rose-500/10 shadow-3xs cursor-pointer';
    }
    if (tag === 'TRAVEL ORDER') {
      return 'bg-indigo-600 text-white flex items-center justify-center font-semibold text-[9px] px-0.5 leading-tight py-1 text-center uppercase h-[48px] shadow-3xs cursor-pointer';
    }
    if (tag === 'OFFICE ORDER') {
      return 'bg-cyan-600 text-white flex items-center justify-center font-semibold text-[9px] px-0.5 leading-tight py-1 text-center uppercase h-[48px] shadow-3xs cursor-pointer';
    }
    if (tag === 'LEAVE') {
      return 'bg-amber-500 text-white flex items-center justify-center font-bold text-[9px] py-1 text-center uppercase tracking-wide h-[48px] shadow-3xs cursor-pointer';
    }
    if (tag === 'HOLIDAY') {
      return 'bg-purple-600 text-white flex items-center justify-center font-semibold text-[9px] py-1 text-center uppercase h-[48px] shadow-3xs cursor-pointer';
    }

    // Shift colors
    if (shift === '8:00 AM – 5:00 PM') {
      return 'bg-[#d0e1fd] text-[#1c3d75] hover:bg-[#b0ccfb] border-r border-b border-blue-205 cursor-pointer flex flex-col justify-center h-[48px] transition';
    }
    if (shift === '6:00 AM – 2:00 PM') {
      return 'bg-[#d1fcd1] text-[#1e5c1e] hover:bg-[#bbfcb7] border-r border-b border-green-205 cursor-pointer flex flex-col justify-center h-[48px] transition';
    }
    if (shift === '2:00 PM – 10:00 PM') {
      return 'bg-[#fefcd1] text-[#715c0a] hover:bg-[#fcf7ab] border-r border-b border-amber-205 cursor-pointer flex flex-col justify-center h-[48px] transition';
    }
    if (shift === '10:00 PM – 6:00 AM') {
      return 'bg-[#fdd2d2] text-[#7c2020] hover:bg-[#fcaea1] border-r border-b border-red-205 cursor-pointer flex flex-col justify-center h-[48px] transition';
    }

    return 'bg-slate-50 border-r border-b border-slate-200 flex flex-col justify-center text-slate-300 text-xs text-center h-[48px] hover:bg-slate-100 cursor-pointer transition';
  };

  // Grouping structures specifically for the Daily Splash screen!
  const dailyGroups: Record<ShiftType | 'DAY_OFF' | 'LEAVE_OTHER' | 'UNASSIGNED', Employee[]> = {
    '6:00 AM – 2:00 PM': [],
    '8:00 AM – 5:00 PM': [],
    '2:00 PM – 10:00 PM': [],
    '10:00 PM – 6:00 AM': [],
    'DAY_OFF': [],
    'LEAVE_OTHER': [],
    'UNASSIGNED': [],
  };

  filteredEmployees.forEach((emp) => {
    const data = getCellData(emp.id, isoTargetStr);
    if (!data) {
      dailyGroups['UNASSIGNED'].push(emp);
    } else if (data.statusTag === 'DAY OFF') {
      dailyGroups['DAY_OFF'].push(emp);
    } else if (data.statusTag) {
      dailyGroups['LEAVE_OTHER'].push(emp);
    } else if (data.shiftType) {
      dailyGroups[data.shiftType].push(emp);
    } else {
      dailyGroups['UNASSIGNED'].push(emp);
    }
  });

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden" id="roster-grid-module">
      
      {/* 1. Header Toolbar with Mode Switchers */}
      <div className="bg-slate-50 px-5 py-4 border-b border-slate-200 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 print:hidden">
        
        {/* Toggleable Buttons selection */}
        <div className="flex items-center bg-slate-200/60 p-1 rounded-lg border border-slate-300/40 shrink-0 self-start">
          <button
            onClick={() => setViewMode('daily')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-bold uppercase transition ${
              viewMode === 'daily'
                ? 'bg-red-650 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            <UserCheck size={14} />
            <span>Daily Schedule</span>
          </button>
          
          <button
            onClick={() => setViewMode('weekly')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-bold uppercase transition ${
              viewMode === 'weekly'
                ? 'bg-[#00175b] text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            <Calendar size={14} />
            <span>Weekly View</span>
          </button>
          
          <button
            onClick={() => setViewMode('monthly')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-bold uppercase transition ${
              viewMode === 'monthly'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            <Grid size={14} />
            <span>Monthly View</span>
          </button>
        </div>

        {/* Dynamic description helper */}
        <div className="hidden lg:flex items-center space-x-2 text-xs text-slate-500 font-medium">
          <Layers size={14} className="text-red-600" />
          <span>
            {viewMode === 'daily' && "Splash summary of all personnel currently assigned on duty."}
            {viewMode === 'weekly' && "7-day localized roster overview beginning from timeline target."}
            {viewMode === 'monthly' && "Standard full month spreadsheet layout grid."}
          </span>
        </div>

        {/* Action Button tools */}
        <div className="flex items-center space-x-2 xl:justify-end">
          <button
            onClick={handlePrint}
            className="flex items-center space-x-1.5 bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 shadow-3xs px-3 py-1.5 rounded-lg text-xs font-semibold transition"
          >
            <Printer size={13} />
            <span>Print Current Mode</span>
          </button>
          
          <button
            onClick={handleDownloadCSV}
            className="flex items-center space-x-1.5 bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 shadow-3xs px-3 py-1.5 rounded-lg text-xs font-semibold transition"
            title="Download full team roster as CSV file"
          >
            <Download size={13} />
            <span>Export Roster CSV</span>
          </button>
        </div>

      </div>

      {/* 2. Color Index Legend strip (Visible for grid modes) */}
      {viewMode !== 'daily' && (
        <div className="bg-slate-50 px-5 py-2.5 border-b border-slate-200 flex flex-wrap items-center gap-2.5 print:hidden">
          <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider mr-1">
            Roster Slots:
          </span>
          <div className="flex items-center space-x-1 bg-[#d1fcd1] px-2 py-0.5 rounded text-[10px] font-bold text-[#1e5c1e]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-700"></span>
            <span>6:00 AM – 2:00 PM</span>
          </div>
          <div className="flex items-center space-x-1 bg-[#d0e1fd] px-2 py-0.5 rounded text-[10px] font-bold text-[#1c3d75]">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-600"></span>
            <span>8:00 AM – 5:00 PM</span>
          </div>
          <div className="flex items-center space-x-1 bg-[#fefcd1] px-2 py-0.5 rounded text-[10px] font-bold text-[#715c0a]">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>
            <span>2:00 PM – 10:00 PM</span>
          </div>
          <div className="flex items-center space-x-1 bg-[#fdd2d2] px-2 py-0.5 rounded text-[10px] font-bold text-[#7c2020]">
            <span className="w-1.5 h-1.5 rounded-full bg-red-650"></span>
            <span>10:00 PM – 6:00 AM</span>
          </div>
          <div className="flex items-center space-x-1 bg-[#002fbe] px-2 py-0.5 rounded text-[10px] font-bold text-white uppercase">
            <span>DAY OFF</span>
          </div>
        </div>
      )}

      {/* 3. Flagship Title Bar */}
      <div className="flex items-center justify-between border-b border-red-700 bg-slate-900 overflow-hidden">
        
        {/* Left red slant block styling */}
        <div className="bg-red-650 text-white font-black font-sans uppercase text-sm tracking-widest px-6 py-4 flex flex-col justify-center w-80 shrink-0 border-r border-[#00175b] h-16 shadow-md shadow-black/10">
          <div className="text-[9px] font-black text-red-200 tracking-widest uppercase leading-none">
            {viewMode === 'daily' && "DAILY DUTY ROSTER"}
            {viewMode === 'weekly' && "WEEKLY WORKFORCE"}
            {viewMode === 'monthly' && "MONTHLY WORKFORCE"}
          </div>
          <div className="text-xs font-black tracking-wider text-white mt-0.5 leading-tight">
            DATE: {currentDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()}
          </div>
        </div>

        {/* Right extension */}
        <div className="bg-[#00175b] py-4 px-6 flex-1 text-right text-xs text-blue-200 font-mono font-black uppercase tracking-widest h-16 flex items-center justify-end">
          {isAdmin ? (
            <span className="flex items-center space-x-1.5 text-red-300 bg-red-950/40 border border-red-900/40 px-2.5 py-1 rounded-md">
              <Eye size={12} />
              <span>Interactive scheduling active</span>
            </span>
          ) : (
            <span className="text-sky-300">Read-Only View</span>
          )}
        </div>
      </div>

      {/* 4. DYNAMIC VIEW MODES DISPLAY LIST */}
      
      {/* ==================== A. DAILY SPLASH VIEW ==================== */}
      {viewMode === 'daily' && (
        <div className="p-6 bg-slate-50 min-h-[420px] animate-fade-in">
          
          {/* Header Banner */}
          <div className="mb-6 bg-white border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between shadow-3xs gap-3">
            <div>
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest">
                Daily Roster Dashboard Summary
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Lists active personnel allocated for each specific timing. Use calendar tools above to navigate dates.
              </p>
            </div>
            {isAdmin && (
              <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200/50 flex items-center gap-1">
                <AlertCircle size={12} />
                Click individual officer names below to quickly edit.
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Shift 1: 6:00 AM - 2:00 PM */}
            <div className="bg-[#eafaea]/70 rounded-xl border border-green-200 p-4 shadow-3xs flex flex-col">
              <div className="flex items-center justify-between border-b border-green-200/80 pb-2 mb-3">
                <span className="text-[11px] font-black text-green-800 uppercase tracking-wider font-mono">
                  Morning (6AM - 2PM)
                </span>
                <span className="bg-green-100 text-green-900 text-[10px] font-black px-2 py-0.5 rounded-full font-mono">
                  {dailyGroups['6:00 AM – 2:00 PM'].length} Officers
                </span>
              </div>
              
              <div className="flex-1 space-y-1.5 max-h-[300px] overflow-y-auto">
                {dailyGroups['6:00 AM – 2:00 PM'].length === 0 ? (
                  <p className="text-[11px] italic text-slate-400 py-3 text-center">No assignments listed</p>
                ) : (
                  dailyGroups['6:00 AM – 2:00 PM'].map((emp) => (
                    <button
                      key={emp.id}
                      disabled={!isAdmin}
                      onClick={() => handleCellClick(emp, isoTargetStr, currentDate.getDate())}
                      className="w-full text-left bg-white hover:bg-green-50 border border-green-100/50 rounded-lg p-2.5 text-xs font-black text-green-950 flex items-center justify-between transition group cursor-pointer disabled:cursor-default"
                    >
                      <span className="truncate uppercase">{emp.name}</span>
                      {isAdmin && <Edit2 size={10} className="text-slate-300 group-hover:text-green-600 shrink-0 ml-1" />}
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Shift 2: 8:00 AM - 5:00 PM */}
            <div className="bg-[#ebf5fe]/70 rounded-xl border border-blue-200 p-4 shadow-3xs flex flex-col">
              <div className="flex items-center justify-between border-b border-blue-200/80 pb-2 mb-3">
                <span className="text-[11px] font-black text-blue-800 uppercase tracking-wider font-mono">
                  Regular (8AM - 5PM)
                </span>
                <span className="bg-blue-100 text-blue-900 text-[10px] font-black px-2 py-0.5 rounded-full font-mono">
                  {dailyGroups['8:00 AM – 5:00 PM'].length} Officers
                </span>
              </div>
              
              <div className="flex-1 space-y-1.5 max-h-[300px] overflow-y-auto">
                {dailyGroups['8:00 AM – 5:00 PM'].length === 0 ? (
                  <p className="text-[11px] italic text-slate-400 py-3 text-center">No assignments listed</p>
                ) : (
                  dailyGroups['8:00 AM – 5:00 PM'].map((emp) => (
                    <button
                      key={emp.id}
                      disabled={!isAdmin}
                      onClick={() => handleCellClick(emp, isoTargetStr, currentDate.getDate())}
                      className="w-full text-left bg-white hover:bg-blue-50 border border-blue-100/50 rounded-lg p-2.5 text-xs font-black text-blue-950 flex items-center justify-between transition group cursor-pointer disabled:cursor-default"
                    >
                      <span className="truncate uppercase">{emp.name}</span>
                      {isAdmin && <Edit2 size={10} className="text-slate-300 group-hover:text-blue-600 shrink-0 ml-1" />}
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Shift 3: 2:00 PM - 10:00 PM */}
            <div className="bg-[#fffde6]/70 rounded-xl border border-amber-200/80 p-4 shadow-3xs flex flex-col">
              <div className="flex items-center justify-between border-b border-amber-200 pb-2 mb-3">
                <span className="text-[11px] font-black text-amber-800 uppercase tracking-wider font-mono">
                  Swing (2PM - 10PM)
                </span>
                <span className="bg-amber-100 text-amber-900 text-[10px] font-black px-2 py-0.5 rounded-full font-mono">
                  {dailyGroups['2:00 PM – 10:00 PM'].length} Officers
                </span>
              </div>
              
              <div className="flex-1 space-y-1.5 max-h-[300px] overflow-y-auto">
                {dailyGroups['2:00 PM – 10:00 PM'].length === 0 ? (
                  <p className="text-[11px] italic text-slate-400 py-3 text-center">No assignments listed</p>
                ) : (
                  dailyGroups['2:00 PM – 10:00 PM'].map((emp) => (
                    <button
                      key={emp.id}
                      disabled={!isAdmin}
                      onClick={() => handleCellClick(emp, isoTargetStr, currentDate.getDate())}
                      className="w-full text-left bg-white hover:bg-amber-50 border border-amber-100/50 rounded-lg p-2.5 text-xs font-black text-amber-950 flex items-center justify-between transition group cursor-pointer disabled:cursor-default"
                    >
                      <span className="truncate uppercase">{emp.name}</span>
                      {isAdmin && <Edit2 size={10} className="text-slate-300 group-hover:text-amber-600 shrink-0 ml-1" />}
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Shift 4: 10:00 PM - 6:00 AM */}
            <div className="bg-[#fff0f0]/70 rounded-xl border border-red-200 p-4 shadow-3xs flex flex-col">
              <div className="flex items-center justify-between border-b border-red-200 pb-2 mb-3">
                <span className="text-[11px] font-black text-red-800 uppercase tracking-wider font-mono">
                  Night (10PM - 6AM)
                </span>
                <span className="bg-red-100 text-red-900 text-[10px] font-black px-2 py-0.5 rounded-full font-mono">
                  {dailyGroups['10:00 PM – 6:00 AM'].length} Officers
                </span>
              </div>
              
              <div className="flex-1 space-y-1.5 max-h-[300px] overflow-y-auto">
                {dailyGroups['10:00 PM – 6:00 AM'].length === 0 ? (
                  <p className="text-[11px] italic text-slate-400 py-3 text-center">No assignments listed</p>
                ) : (
                  dailyGroups['10:00 PM – 6:00 AM'].map((emp) => (
                    <button
                      key={emp.id}
                      disabled={!isAdmin}
                      onClick={() => handleCellClick(emp, isoTargetStr, currentDate.getDate())}
                      className="w-full text-left bg-white hover:bg-red-50 border border-red-100/50 rounded-lg p-2.5 text-xs font-black text-red-950 flex items-center justify-between transition group cursor-pointer disabled:cursor-default"
                    >
                      <span className="truncate uppercase">{emp.name}</span>
                      {isAdmin && <Edit2 size={10} className="text-slate-300 group-hover:text-red-600 shrink-0 ml-1" />}
                    </button>
                  ))
                )}
              </div>
            </div>

          </div>

          {/* Off Duty, Leaves, Unassigned list panel */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
            
            {/* Rest Day / Off Card */}
            <div className="bg-[#ebf0fe] rounded-xl border border-blue-300 p-4 shadow-3xs flex flex-col">
              <div className="flex items-center justify-between border-b border-blue-300 pb-2 mb-3">
                <span className="text-[11px] font-black text-blue-900 uppercase tracking-wider">
                  DAY OFF Rest Duty Status ({dailyGroups['DAY_OFF'].length})
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 max-h-[160px] overflow-y-auto">
                {dailyGroups['DAY_OFF'].length === 0 ? (
                  <p className="text-[11px] italic text-slate-400 w-full py-2">No personnel listed</p>
                ) : (
                  dailyGroups['DAY_OFF'].map((emp) => (
                    <button
                      key={emp.id}
                      disabled={!isAdmin}
                      onClick={() => handleCellClick(emp, isoTargetStr, currentDate.getDate())}
                      className="bg-white hover:bg-slate-100 border border-slate-200 rounded px-2.5 py-1.5 text-xs font-extrabold text-slate-700 uppercase flex items-center gap-1 cursor-pointer disabled:cursor-default"
                    >
                      <span>{emp.name}</span>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Leave or Other Card */}
            <div className="bg-[#fff6ea] rounded-xl border border-amber-300 p-4 shadow-3xs flex flex-col">
              <div className="flex items-center justify-between border-b border-amber-300 pb-2 mb-3">
                <span className="text-[11px] font-black text-amber-900 uppercase tracking-wider">
                  Leave & Other Statuses ({dailyGroups['LEAVE_OTHER'].length})
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 max-h-[160px] overflow-y-auto">
                {dailyGroups['LEAVE_OTHER'].length === 0 ? (
                  <p className="text-[11px] italic text-slate-400 w-full py-2">No personnel listed</p>
                ) : (
                  dailyGroups['LEAVE_OTHER'].map((emp) => {
                    const cell = getCellData(emp.id, isoTargetStr);
                    return (
                      <button
                        key={emp.id}
                        disabled={!isAdmin}
                        onClick={() => handleCellClick(emp, isoTargetStr, currentDate.getDate())}
                        className="bg-white hover:bg-slate-100 border border-slate-200 rounded px-2.5 py-1.5 text-xs font-extrabold text-[#715c0a] uppercase flex items-center gap-1 cursor-pointer disabled:cursor-default"
                      >
                        <span>{emp.name}</span>
                        <span className="text-[9px] bg-amber-500 text-white font-sans px-1 py-0.2 rounded font-black">
                          {cell?.statusTag}
                        </span>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ==================== B. WEEKLY GRID VIEW ==================== */}
      {viewMode === 'weekly' && (
        <div className="overflow-x-auto overflow-y-hidden shadow-inner animate-fade-in text-slate-800">
          <div className="min-w-[1020px] divide-y divide-slate-200 font-sans select-none">
            
            {/* Header row containing 7 Days */}
            <div className="flex bg-[#001861] text-white">
              
              <div className="w-80 shrink-0 bg-red-650 border-r border-[#000f3f] p-4 font-black tracking-widest text-[#ffffff] uppercase leading-none text-xs flex items-center">
                ACTIVE PERSONNEL (WEEKLY SPREADSHEET)
              </div>

              <div className="flex flex-1">
                {weeklyDays.map((day) => (
                  <div
                    key={day.dateStr}
                    className="flex-1 border-r border-[#000f3f] flex flex-col justify-between overflow-hidden relative shadow-inner"
                    style={{ minHeight: '64px' }}
                  >
                    <div
                      className={`absolute inset-0 h-10 w-full transform -skew-x-[22deg] origin-top border-b border-[#000f3f] ${
                        day.isWeekend ? 'bg-red-600 border-red-700' : 'bg-yellow-400 border-yellow-500'
                      }`}
                    />
                    
                    <div className="relative text-center pt-1 font-black text-xs leading-none z-10">
                      <span className={day.isWeekend ? 'text-white text-[11px]' : 'text-slate-900 text-[11px]'}>
                        {day.dayNum}
                      </span>
                    </div>

                    <div className="relative text-center pb-1.5 font-bold text-[9px] font-sans tracking-wide leading-none text-sky-100 uppercase z-10">
                      {day.dayOfWeekName}
                    </div>
                  </div>
                ))}
              </div>

            </div>

            {/* List items of Weekly Days */}
            <div className="divide-y divide-slate-100 max-h-[580px] overflow-y-auto">
              {filteredEmployees.length === 0 ? (
                <div className="p-8 text-center text-slate-400 font-medium">
                  No active personnel found.
                </div>
              ) : (
                filteredEmployees.map((emp) => (
                  <div key={emp.id} className="flex items-stretch hover:bg-slate-50/55 transition duration-100">
                    
                    <div className="w-80 shrink-0 border-r border-slate-200 px-5 py-3 flex items-center justify-between bg-slate-50 font-bold text-slate-800 text-[11px]">
                      <span className="block font-black text-slate-900 tracking-tight uppercase">
                        {emp.name}
                      </span>
                      {isAdmin && <Edit2 size={10} className="text-slate-300" />}
                    </div>

                    <div className="flex flex-1">
                      {weeklyDays.map((day) => {
                        const cellData = getCellData(emp.id, day.dateStr);
                        const shiftVal = cellData ? cellData.shiftType : null;
                        const tagVal = cellData ? cellData.statusTag : null;

                        return (
                          <div
                            key={day.dateStr}
                            onClick={() => handleCellClick(emp, day.dateStr, day.dayNum)}
                            className={`flex-1 ${getCellStyles(shiftVal, tagVal)} select-none relative`}
                            style={{ h: '48px' }}
                          >
                            {tagVal ? (
                              <span className="text-center font-black truncate w-full px-0.5 font-sans leading-none text-[8.5px]">
                                {tagVal}
                              </span>
                            ) : shiftVal ? (
                              <div className="text-center w-full px-0.5 leading-[1.1] font-sans">
                                {shiftVal === '8:00 AM – 5:00 PM' && (
                                  <>
                                    <div className="italic font-bold text-[8.5px]">8:00AM</div>
                                    <div className="italic font-bold text-[8.5px]">5:00PM</div>
                                  </>
                                )}
                                {shiftVal === '6:00 AM – 2:00 PM' && (
                                  <>
                                    <div className="italic font-bold text-[8.5px]">6:00AM</div>
                                    <div className="italic font-bold text-[8.5px]">2:00PM</div>
                                  </>
                                )}
                                {shiftVal === '2:00 PM – 10:00 PM' && (
                                  <>
                                    <div className="italic font-bold text-[8.5px]">2:00PM</div>
                                    <div className="italic font-bold text-[8.5px]">10:00PM</div>
                                  </>
                                )}
                                {shiftVal === '10:00 PM – 6:00 AM' && (
                                  <>
                                    <div className="italic font-bold text-[8.5px]">10:00PM</div>
                                    <div className="italic font-bold text-[8.5px]">6:00AM</div>
                                  </>
                                )}
                              </div>
                            ) : (
                              <span className="text-slate-300 text-center font-bold text-xs">-</span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                  </div>
                ))
              )}
            </div>

          </div>
        </div>
      )}

      {/* ==================== C. MONTHLY GRID VIEW ==================== */}
      {viewMode === 'monthly' && (
        <div className="overflow-x-auto overflow-y-hidden print:overflow-x-visible shadow-inner animate-fade-in text-slate-800">
          <div className="w-max min-w-full divide-y divide-slate-200 font-sans select-none">
            
            <div className="flex bg-[#001861] text-white">
              
              <div className="w-72 shrink-0 bg-red-650 border-r border-[#000f3f] p-4 font-black tracking-widest text-[#ffffff] uppercase leading-none text-xs flex items-center">
                EMPLOYEE NAMES
              </div>

              <div className="flex flex-1 col-span-30">
                {monthlyDays.map((day) => (
                  <div
                    key={day.dayNum}
                    className="w-11 shrink-0 border-r border-[#000f3f] flex flex-col justify-between overflow-hidden relative shadow-inner"
                    style={{ minHeight: '64px' }}
                  >
                    <div
                      className={`absolute inset-0 h-10 w-full transform -skew-x-[22deg] origin-top border-b border-[#000f3f] ${
                        day.isWeekend ? 'bg-red-600 border-red-700' : 'bg-yellow-400 border-yellow-500'
                      }`}
                    />
                    
                    <div className="relative text-center pt-1 font-black text-xs leading-none z-10">
                      <span className={day.isWeekend ? 'text-white text-[11px]' : 'text-slate-900 text-[11px]'}>
                        {day.dayNum}
                      </span>
                    </div>

                    <div className="relative text-center pb-1.5 font-bold text-[9px] font-sans tracking-wide leading-none text-sky-100 uppercase z-10">
                      {day.dayOfWeekName}
                    </div>
                  </div>
                ))}
              </div>

            </div>

            <div className="divide-y divide-slate-100 max-h-[580px] overflow-y-auto">
              {filteredEmployees.length === 0 ? (
                <div className="p-8 text-center text-slate-400 font-medium">
                  No active personnel records found.
                </div>
              ) : (
                filteredEmployees.map((emp) => {
                  const highlighted = searchQuery && emp.name.toLowerCase().includes(searchQuery.toLowerCase());
                  return (
                    <div
                      key={emp.id}
                      className={`flex items-stretch hover:bg-slate-50/50 transition duration-150 ${
                        highlighted ? 'ring-2 ring-amber-400 bg-amber-50/20 shadow-md relative z-10' : ''
                      }`}
                    >
                      <div className="w-72 shrink-0 border-r border-slate-200 px-4 py-3 flex items-center justify-between bg-slate-50 font-bold text-slate-850 text-[11px] select-text">
                        <span className="truncate font-black text-slate-900 tracking-tight block select-all uppercase">
                          {emp.name}
                        </span>
                        {isAdmin && (
                          <span className="text-slate-300">
                            <Edit2 size={11} />
                          </span>
                        )}
                      </div>

                      <div className="flex flex-1">
                        {monthlyDays.map((day) => {
                          const cellData = getCellData(emp.id, day.dateStr);
                          const shiftVal = cellData ? cellData.shiftType : null;
                          const tagVal = cellData ? cellData.statusTag : null;

                          return (
                            <div
                              key={day.dayNum}
                              onClick={() => handleCellClick(emp, day.dateStr, day.dayNum)}
                              className={`w-11 shrink-0 ${getCellStyles(shiftVal, tagVal)} select-none relative`}
                              style={{ h: '48px' }}
                            >
                              {tagVal ? (
                                <span className="text-center font-black truncate w-full px-0.5 font-sans leading-none text-[8.5px]">
                                  {tagVal}
                                </span>
                              ) : shiftVal ? (
                                <div className="text-center w-full px-0.5 leading-[1.1] font-sans">
                                  {shiftVal === '8:00 AM – 5:00 PM' && (
                                    <>
                                      <div className="italic font-bold text-[8.5px]">8:00AM</div>
                                      <div className="italic font-bold text-[8.5px]">5:00PM</div>
                                    </>
                                  )}
                                  {shiftVal === '6:00 AM – 2:00 PM' && (
                                    <>
                                      <div className="italic font-bold text-[8.5px]">6:00AM</div>
                                      <div className="italic font-bold text-[8.5px]">2:00PM</div>
                                    </>
                                  )}
                                  {shiftVal === '2:00 PM – 10:00 PM' && (
                                    <>
                                      <div className="italic font-bold text-[8.5px]">2:00PM</div>
                                      <div className="italic font-bold text-[8.5px]">10:00PM</div>
                                    </>
                                  )}
                                  {shiftVal === '10:00 PM – 6:00 AM' && (
                                    <>
                                      <div className="italic font-bold text-[8.5px]">10:00PM</div>
                                      <div className="italic font-bold text-[8.5px]">6:00AM</div>
                                    </>
                                  )}
                                </div>
                              ) : (
                                <span className="text-slate-300 text-center font-bold text-xs">-</span>
                              )}
                            </div>
                          );
                        })}
                      </div>

                    </div>
                  );
                })
              )}
            </div>

          </div>
        </div>
      )}

      {/* ==================== 5. QUICK EDIT POPUP MODAL ==================== */}
      {editingCell && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs transition" id="cell-assignment-modal">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden transform scale-100 transition-all text-slate-800">
            
            <div className="bg-[#00175b] text-white px-5 py-4 flex justify-between items-center">
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-white">
                  Quick Shift Assignment Selector
                </h3>
                <p className="text-[11px] text-blue-200 font-mono mt-0.5 leading-none">
                  {editingCell.employeeName} • Date {editingCell.dateStr}
                </p>
              </div>
              <button
                onClick={() => setEditingCell(null)}
                className="text-blue-200 hover:text-white transition p-1.5 rounded-lg hover:bg-white/10 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Select Shift Hours (Vibrant background mapping)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleApplyUpdate('6:00 AM – 2:00 PM', null)}
                    className="flex flex-col items-center justify-center p-2.5 rounded-lg border border-green-200 bg-green-50 hover:bg-green-100 transition text-[#1e5c1e] text-center cursor-pointer font-bold"
                  >
                    <span className="text-xs font-black italic">6:00 AM</span>
                    <span className="text-[10px] font-bold italic mt-0.5">2:00 PM</span>
                    <span className="text-[9px] font-semibold text-green-600 mt-1 uppercase">Morning</span>
                  </button>
                  <button
                    onClick={() => handleApplyUpdate('8:00 AM – 5:00 PM', null)}
                    className="flex flex-col items-center justify-center p-2.5 rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-100 transition text-[#1c3d75] text-center cursor-pointer font-bold"
                  >
                    <span className="text-xs font-black italic">8:00 AM</span>
                    <span className="text-[10px] font-bold italic mt-0.5">5:00 PM</span>
                    <span className="text-[9px] font-semibold text-blue-500 mt-1 uppercase">Regular</span>
                  </button>
                  <button
                    onClick={() => handleApplyUpdate('2:00 PM – 10:00 PM', null)}
                    className="flex flex-col items-center justify-center p-2.5 rounded-lg border border-amber-200 bg-amber-50 hover:bg-amber-100 transition text-[#715c0a] text-center cursor-pointer font-bold"
                  >
                    <span className="text-xs font-black italic">2:00 PM</span>
                    <span className="text-[10px] font-bold italic mt-0.5">10:00 PM</span>
                    <span className="text-[9px] font-semibold text-amber-600 mt-1 uppercase">Swing</span>
                  </button>
                  <button
                    onClick={() => handleApplyUpdate('10:00 PM – 6:00 AM', null)}
                    className="flex flex-col items-center justify-center p-2.5 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 transition text-[#7c2020] text-center cursor-pointer font-bold"
                  >
                    <span className="text-xs font-black italic">10:00 PM</span>
                    <span className="text-[10px] font-bold italic mt-0.5">6:00 AM</span>
                    <span className="text-[9px] font-semibold text-red-500 mt-1 uppercase">Night</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Apply Roster Status Badge
                </label>
                <div className="grid grid-cols-3 gap-1.5 text-center font-bold">
                  <button
                    onClick={() => handleApplyUpdate(null, 'DAY OFF')}
                    className="px-2 py-2 bg-[#002fbe] hover:bg-blue-800 text-white font-bold text-[10px] rounded uppercase transition tracking-wider shadow-2xs cursor-pointer"
                  >
                    DAY OFF
                  </button>
                  <button
                    onClick={() => handleApplyUpdate(null, 'LEAVE')}
                    className="px-2 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-[10px] rounded uppercase transition tracking-wider cursor-pointer"
                  >
                    LEAVE
                  </button>
                  <button
                    onClick={() => handleApplyUpdate(null, 'ABSENT')}
                    className="px-2 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-[10px] rounded uppercase transition tracking-wider cursor-pointer"
                  >
                    ABSENT
                  </button>
                  <button
                    onClick={() => handleApplyUpdate(null, 'TRAVEL ORDER')}
                    className="px-2 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-[10px] rounded uppercase transition tracking-wider cursor-pointer font-bold"
                  >
                    TRAVEL
                  </button>
                  <button
                    onClick={() => handleApplyUpdate(null, 'OFFICE ORDER')}
                    className="px-2 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold text-[10px] rounded uppercase transition tracking-wider cursor-pointer font-bold"
                  >
                    OFFICE
                  </button>
                  <button
                    onClick={() => handleApplyUpdate(null, 'HOLIDAY')}
                    className="px-2 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-[10px] rounded uppercase transition tracking-wider cursor-pointer font-bold"
                  >
                    HOLIDAY
                  </button>
                </div>
              </div>

              <div className="border-t border-slate-150 pt-3 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-medium font-sans">
                  Status: <span className="font-bold text-slate-600">{editingCell.currentTag || editingCell.currentShift || 'Unassigned'}</span>
                </span>
                
                <button
                  onClick={() => handleApplyUpdate(null, null)}
                  className="px-3 py-1.5 hover:bg-slate-100 text-red-600 border border-slate-200 font-bold text-xs rounded transition uppercase tracking-wider cursor-pointer"
                >
                  Unassign Cell
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
