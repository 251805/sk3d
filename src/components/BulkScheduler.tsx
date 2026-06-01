/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Employee, ShiftType, StatusTagType } from '../types';
import { CalendarRange, Check, HelpCircle } from 'lucide-react';

interface BulkSchedulerProps {
  employees: Employee[];
  onApplyBulkShift: (
    targetMode: 'individual' | 'all',
    targetId: string,
    startDate: string,
    endDate: string,
    shift: ShiftType | null,
    tag: StatusTagType | null
  ) => void;
}

export default function BulkScheduler({ employees, onApplyBulkShift }: BulkSchedulerProps) {
  // Bulk Assign State
  const [targetMode, setTargetMode] = useState<'individual' | 'all'>('all');
  const [targetEmployeeId, setTargetEmployeeId] = useState(employees[0]?.id || '');
  const [customStartDate, setCustomStartDate] = useState('2026-06-01');
  const [customEndDate, setCustomEndDate] = useState('2026-06-07');
  const [selectedShift, setSelectedShift] = useState<ShiftType | 'NONE'>('8:00 AM – 5:00 PM');
  const [selectedTag, setSelectedTag] = useState<StatusTagType | 'NONE'>('NONE');
  const [successMsg, setSuccessMsg] = useState(false);

  // Apply general bulk override
  const handleBulkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const idParam = targetMode === 'individual' ? targetEmployeeId : 'all';
    const shiftPlain = selectedShift === 'NONE' ? null : selectedShift;
    const tagPlain = selectedTag === 'NONE' ? null : selectedTag;

    onApplyBulkShift(targetMode, idParam, customStartDate, customEndDate, shiftPlain, tagPlain);
    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 4000);
  };

  return (
    <div className="grid grid-cols-1 gap-6" id="bulk-scheduling-panel-root">
      
      {/* SECTION 2: INDIVIDUAL / GENERAL BULK OVERWRITE */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-3xs overflow-hidden" id="general-bulk-box">
        <div className="bg-[#00175b] px-5 py-4 flex items-center justify-between text-white border-b border-slate-200">
          <div className="flex items-center space-x-2.5">
            <CalendarRange size={16} className="text-red-400 stroke-[2.5]" />
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider text-white">
                Create Schedule Here
              </h3>
              <p className="text-[11px] text-blue-200 leading-none">
                Apply quick manual or customized dates.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleBulkSubmit} className="p-6 space-y-4 text-slate-800">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Assignment Target
              </label>
              <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200/50 font-black">
                <button
                  type="button"
                  onClick={() => setTargetMode('all')}
                  className={`flex-1 text-[11px] py-1.5 rounded uppercase tracking-wider text-center transition ${
                    targetMode === 'all'
                      ? 'bg-white text-blue-800 shadow-3xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  All Staff Registers
                </button>
                <button
                  type="button"
                  onClick={() => setTargetMode('individual')}
                  className={`flex-1 text-[11px] py-1.5 rounded uppercase tracking-wider text-center transition ${
                    targetMode === 'individual'
                      ? 'bg-white text-blue-800 shadow-3xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Single Employee
                </button>
              </div>
            </div>

            {targetMode === 'individual' ? (
              <div className="animate-fade-in">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Select Target Employee
                </label>
                <select
                  value={targetEmployeeId}
                  onChange={(e) => setTargetEmployeeId(e.target.value)}
                  className="w-full text-xs font-semibold border border-slate-200 rounded-lg p-2.5 bg-slate-50 focus:bg-white"
                >
                  {employees.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.name}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Current Target Frame
                </label>
                <div className="p-2.5 border border-blue-100 bg-blue-50/20 rounded-md text-[11px] text-blue-900">
                  Running this applies overrides globally for <strong className="font-bold">all active personnel rosters</strong>.
                </div>
              </div>
            )}

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Starting Range Date
              </label>
              <input
                type="date"
                required
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="w-full text-xs border border-slate-200 rounded-lg p-2.5 bg-slate-50 font-mono"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Ending Range Date
              </label>
              <input
                type="date"
                required
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="w-full text-xs border border-slate-200 rounded-lg p-2.5 bg-slate-50 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Set Shift Duration
              </label>
              <select
                value={selectedShift}
                onChange={(e) => {
                  setSelectedShift(e.target.value as ShiftType | 'NONE');
                  if (e.target.value !== 'NONE') {
                    setSelectedTag('NONE');
                  }
                }}
                className="w-full text-xs font-semibold border border-slate-200 rounded-lg p-2.5 bg-slate-50"
              >
                <option value="NONE">-- Clear Shift Assignment --</option>
                <option value="6:00 AM – 2:00 PM">6:00 AM – 2:00 PM (Morning)</option>
                <option value="8:00 AM – 5:00 PM">8:00 AM – 5:00 PM (Regular)</option>
                <option value="2:00 PM – 10:00 PM">2:00 PM – 10:00 PM (Swing)</option>
                <option value="10:00 PM – 6:00 AM">10:00 PM – 6:00 AM (Night)</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Or Assign Custom Status
              </label>
              <select
                value={selectedTag}
                onChange={(e) => {
                  setSelectedTag(e.target.value as StatusTagType | 'NONE');
                  if (e.target.value !== 'NONE') {
                    setSelectedShift('NONE');
                  }
                }}
                className="w-full text-xs font-semibold border border-slate-200 rounded-lg p-2.5 bg-slate-50"
              >
                <option value="NONE">-- No Status Tag --</option>
                <option value="DAY OFF">DAY OFF (Rest Period)</option>
                <option value="LEAVE">LEAVE (Sick/Annual)</option>
                <option value="ABSENT">ABSENT</option>
                <option value="TRAVEL ORDER">TRAVEL ORDER</option>
                <option value="OFFICE ORDER">OFFICE ORDER</option>
                <option value="HOLIDAY">HOLIDAY</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <div className="text-[10px] text-slate-400 font-medium max-w-sm flex items-center space-x-1">
              <HelpCircle size={12} className="shrink-0" />
              <span>Note: Running this immediately overwrites matching targets.</span>
            </div>

            <div className="flex items-center space-x-3">
              {successMsg && (
                <span className="text-xs font-bold text-emerald-600 animate-pulse flex items-center gap-1">
                  <Check size={14} className="stroke-[2.5]" />
                  Overrides applied!
                </span>
              )}

              <button
                type="submit"
                className="bg-red-600 text-white hover:bg-red-700 text-xs font-black py-2.5 px-5 rounded-lg flex items-center justify-center space-x-1.5 uppercase transition tracking-wider shadow-2xs cursor-pointer"
              >
                <span>Set Schedule</span>
              </button>
            </div>
          </div>

        </form>
      </div>

    </div>
  );
}
