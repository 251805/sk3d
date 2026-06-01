/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Employee, ShiftAssignment, HRRequest, ShiftType, StatusTagType } from '../types';
import { User, Calendar, Plus, FileText, Send, Download, CheckCircle, Clock, XCircle, Search, Gift, ShieldAlert } from 'lucide-react';

interface EmployeePortalProps {
  employees: Employee[];
  schedules: ShiftAssignment[];
  requests: HRRequest[];
  onSubmitRequest: (newReq: Omit<HRRequest, 'id' | 'submittedAt' | 'status'>) => void;
  currentDate: Date;
}

export default function EmployeePortal({
  employees,
  schedules,
  requests,
  onSubmitRequest,
  currentDate,
}: EmployeePortalProps) {
  const [selectedEmpId, setSelectedEmpId] = useState<string>(employees[0]?.id || '');
  
  // Submit Request fields
  const [requestType, setRequestType] = useState<HRRequest['requestType']>('Day-off');
  const [startDate, setStartDate] = useState('2026-06-01');
  const [endDate, setEndDate] = useState('2026-06-01');
  const [details, setDetails] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);

  // Search input for employee name selection helper
  const [filterQuery, setFilterQuery] = useState('');

  const currentEmp = employees.find((e) => e.id === selectedEmpId);

  // Filter employee selector dropdown in case there are 100+
  const filteredSelector = employees.filter((e) =>
    e.name.toLowerCase().includes(filterQuery.toLowerCase())
  );

  // Filter employee requests
  const empRequests = requests.filter((r) => r.employeeId === selectedEmpId);

  // Today's formatted date
  const isoDateStr = currentDate.toISOString().split('T')[0];
  
  // Retrieve today's shift
  const empTodaySchedule = schedules.find(
    (s) => s.employeeId === selectedEmpId && s.date === isoDateStr
  );

  // Print current individual schedule view
  const handlePrintIndividual = () => {
    window.print();
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentEmp || !details.trim()) return;

    onSubmitRequest({
      employeeId: currentEmp.id,
      employeeName: currentEmp.name,
      requestType,
      startDate,
      endDate,
      details,
    });

    setDetails('');
    setFormSuccess(true);
    setTimeout(() => setFormSuccess(false), 4000);
  };

  const getShiftLabelClass = (type: ShiftType | null) => {
    if (!type) return 'text-slate-400 bg-slate-100 border-slate-200';
    switch (type) {
      case '6:00 AM – 2:00 PM':
        return 'text-emerald-800 bg-green-100 border-green-200 font-bold';
      case '8:00 AM – 5:00 PM':
        return 'text-blue-800 bg-blue-100 border-blue-200 font-bold';
      case '2:00 PM – 10:00 PM':
        return 'text-amber-800 bg-yellow-50 border-amber-200 font-bold';
      case '10:00 PM – 6:00 AM':
        return 'text-red-800 bg-red-100 border-red-200 font-bold';
    }
  };

  const statusBadge = (status: HRRequest['status']) => {
    switch (status) {
      case 'Approved':
        return (
          <span className="inline-flex items-center space-x-1 text-[10px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md uppercase tracking-wider">
            <CheckCircle size={10} />
            <span>Approved</span>
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center space-x-1 text-[10px] font-black text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-md uppercase tracking-wider">
            <XCircle size={10} />
            <span>Rejected</span>
          </span>
        );
      case 'Pending':
        return (
          <span className="inline-flex items-center space-x-1 text-[10px] font-black text-orange-700 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-md uppercase tracking-wider">
            <Clock size={10} />
            <span>Pending review</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6" id="employee-portal-root">
      
      {/* 1. Selector Panel containing search mechanisms */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-5 items-center">
        <div>
          <label className="block text-xs font-black text-red-600 uppercase tracking-widest font-mono mb-1.5">
            1. Select Employee Profile
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search size={15} />
            </div>
            <input
              type="text"
              placeholder="Find employee name..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="block w-full pl-8 pr-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-slate-50 focus:bg-white focus:outline-none transition-all placeholder-slate-400"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
            Matched Staff Database Record ({filteredSelector.length} found)
          </label>
          <select
            value={selectedEmpId}
            onChange={(e) => setSelectedEmpId(e.target.value)}
            className="w-full text-xs font-semibold border border-slate-200 rounded-lg p-2 bg-white focus:ring-1 focus:ring-red-500 focus:outline-none"
          >
            {filteredSelector.length === 0 ? (
              <option value="">No matched records</option>
            ) : (
              filteredSelector.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name}
                </option>
              ))
            )}
          </select>
        </div>

        {currentEmp && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center space-x-3">
            <div className="bg-red-100 text-red-600 p-2 rounded-lg shrink-0">
              <User size={18} className="stroke-[2.5]" />
            </div>
            <div className="overflow-hidden">
              <h4 className="text-xs font-black text-slate-900 truncate leading-snug">
                {currentEmp.name}
              </h4>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                Active Staff Member
              </p>
            </div>
          </div>
        )}
      </div>

      {currentEmp ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Today's Assignment & Quick tools */}
          <div className="space-y-6 lg:col-span-1">
            
            {/* Today's schedule status card */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-3xs p-5">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider font-sans">
                Active Assignment Today
              </span>
              <div className="mt-2 flex items-center justify-between pb-4 border-b border-slate-100">
                <span className="text-xs font-semibold text-slate-500 font-mono">
                  {currentDate.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
                </span>
                <span className="bg-emerald-100 text-emerald-800 text-[9px] font-black uppercase px-2 py-0.5 rounded">
                  Present
                </span>
              </div>

              <div className="mt-4 text-center">
                {empTodaySchedule?.statusTag ? (
                  <div className="bg-[#002fbe] text-white py-3 px-4 rounded-xl font-black text-base shadow-lg shadow-blue-800/10 uppercase tracking-wide">
                    {empTodaySchedule.statusTag}
                  </div>
                ) : empTodaySchedule?.shiftType ? (
                  <div className={`p-4 rounded-xl border text-center ${getShiftLabelClass(empTodaySchedule.shiftType)} shadow-3xs`}>
                    <p className="text-sm font-black italic tracking-tight">{empTodaySchedule.shiftType}</p>
                    <p className="text-[9px] text-slate-500 font-bold uppercase mt-1">Scheduled Duty hours</p>
                  </div>
                ) : (
                  <div className="bg-slate-50 border border-slate-200 text-slate-500 py-4 rounded-xl font-bold text-sm">
                    No active shift today / Rest day
                  </div>
                )}
              </div>

              {/* Direct Print Button */}
              <div className="mt-5 pt-1.5">
                <button
                  onClick={handlePrintIndividual}
                  className="w-full bg-slate-900 text-white hover:bg-slate-800 py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center space-x-1.5 uppercase shadow-3xs"
                >
                  <Download size={14} />
                  <span>Print Personal Schedule</span>
                </button>
              </div>
            </div>

            {/* Request Filing Form */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-3xs p-5">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                <Plus size={16} className="text-slate-400" />
                <span>Submit Schedule Request</span>
              </h3>

              <form onSubmit={handleFormSubmit} className="space-y-3.5">
                
                {/* Type selection */}
                <div>
                  <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
                    Request Type
                  </label>
                  <select
                    value={requestType}
                    onChange={(e) => setRequestType(e.target.value as HRRequest['requestType'])}
                    className="w-full text-xs font-semibold border border-slate-200 rounded-lg p-2 bg-slate-50"
                  >
                    <option value="Day-off">Day-off Request</option>
                    <option value="Leave">Annual/Sick Leave Request</option>
                    <option value="Shift change">Shift Swap Trade Request</option>
                    <option value="Schedule change">Schedule Adjustment Request</option>
                  </select>
                </div>

                {/* Dates pickers */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full text-xs border border-slate-200 rounded-lg p-2 bg-slate-50"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full text-xs border border-slate-200 rounded-lg p-2 bg-slate-50"
                    />
                  </div>
                </div>

                {/* Description details */}
                <div>
                  <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
                    Reason & Substitute coverage (Required)
                  </label>
                  <textarea
                    required
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    placeholder="Enter details about substitute or reason e.g., trade shift with Julie, medical dentist appointment..."
                    rows={3}
                    className="w-full text-xs border border-slate-200 rounded-lg p-2 bg-slate-50 focus:outline-none focus:ring-1 focus:ring-red-500 focus:bg-white"
                  />
                </div>

                {/* Feedbacks */}
                {formSuccess && (
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded text-emerald-800 text-xs font-semibold text-center animate-fade-in flex items-center justify-center gap-1">
                    <CheckCircle size={14} className="stroke-[2.5]" />
                    <span>Submission successful, sent for HR review.</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-red-600 text-white hover:bg-red-700 py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center space-x-1.5 uppercase shadow-2xs"
                >
                  <Send size={13} />
                  <span>File Request</span>
                </button>

              </form>
            </div>

          </div>

          {/* Right Column: Personal submission history list */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Request Filing History card list */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-3xs p-5">
              <h3 className="text-sm font-black text-slate-850 uppercase tracking-widest mb-4 flex items-center gap-1.5">
                <FileText size={18} className="text-slate-400" />
                <span>My Filing & Request History</span>
              </h3>

              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {empRequests.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 border border-dashed border-slate-150 rounded-xl bg-slate-50/50">
                    <Clock size={24} className="mx-auto mb-1.5 text-slate-300" />
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">No active requests filed</p>
                    <p className="text-[11px] text-slate-400 leading-normal mt-0.5 max-w-xs mx-auto">
                      Use the left request filing widget to submit leaves, shift changes, or day-off trades dynamically.
                    </p>
                  </div>
                ) : (
                  empRequests.map((req) => (
                    <div
                      key={req.id}
                      className="p-4 border border-slate-150 rounded-lg hover:bg-slate-50/40 transition text-xs"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="font-extrabold text-slate-800 text-sm capitalize">
                            {req.requestType} Request
                          </span>
                          <span className="block text-[10px] text-slate-400 font-semibold font-mono mt-0.5">
                            Filing ID: {req.id}
                          </span>
                        </div>
                        {statusBadge(req.status)}
                      </div>

                      <div className="bg-slate-50 border border-slate-200 p-2.5 rounded text-slate-650 mb-2 leading-relaxed italic">
                        "{req.details}"
                      </div>

                      <div className="text-[10px] text-slate-400 flex flex-wrap justify-between gap-1 items-center font-medium font-sans">
                        <span>Submitted date: {new Date(req.submittedAt).toLocaleDateString()}</span>
                        <span>Dates: <strong className="font-mono text-slate-600 font-bold">{req.startDate} to {req.endDate}</strong></span>
                      </div>

                      {req.adminNotes && (
                        <div className="mt-2 pt-2 border-t border-slate-150">
                          <span className="text-[9px] text-red-600 uppercase font-black font-sans leading-none">HR Notes feedback:</span>
                          <p className="text-slate-600 font-medium italic mt-0.5 bg-red-50/20 border border-red-100 p-2 rounded text-[11px]">
                            {req.adminNotes}
                          </p>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* General employee guidelines */}
            <div className="bg-blue-50/50 border border-blue-200 p-5 rounded-xl flex items-start space-x-3 text-xs leading-relaxed text-slate-600 hris-info-panel shadow-3xs">
              <ShieldAlert className="text-blue-700 shrink-0 stroke-[2.5]" size={18} />
              <div>
                <p className="font-black text-slate-800 uppercase tracking-widest text-[10px]">
                  Roster Guidelines & Help File
                </p>
                <p className="mt-1">
                  All roster and schedule status badges labeled under <strong>LEAVE, ABSENT, DAY OFF, TRAVEL ORDER</strong> require direct HR approval. To adjust schedule allocations, locate or select your profile record and complete the form filing properly. For trade approvals, designate the recipient’s employee ID in the description remarks.
                </p>
              </div>
            </div>

          </div>

        </div>
      ) : (
        <div className="p-8 text-center bg-slate-50 rounded-xl max-w-sm mx-auto border border-slate-200">
          Please select a profile.
        </div>
      )}

    </div>
  );
}
