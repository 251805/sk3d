/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { HRRequest } from '../types';
import { CheckCircle, XCircle, Clock, FileText, Check, X, ShieldAlert, BadgeInfo } from 'lucide-react';

interface AdminRequestsProps {
  requests: HRRequest[];
  onReviewRequest: (id: string, action: 'Approved' | 'Rejected', adminNotes: string) => void;
}

export default function AdminRequests({ requests, onReviewRequest }: AdminRequestsProps) {
  const [selectedRequest, setSelectedRequest] = useState<HRRequest | null>(null);
  const [adminNotes, setAdminNotes] = useState('');

  const pendingCount = requests.filter((r) => r.status === 'Pending').length;

  const handleAction = (id: string, status: 'Approved' | 'Rejected') => {
    onReviewRequest(id, status, adminNotes || `${status} by Admin.`);
    setSelectedRequest(null);
    setAdminNotes('');
  };

  const getTypeBadgeColor = (type: HRRequest['requestType']) => {
    switch (type) {
      case 'Leave':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Day-off':
        return 'bg-sky-100 text-[#002fbe] border-blue-200';
      case 'Shift change':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Schedule change':
        return 'bg-purple-100 text-purple-800 border-purple-200';
    }
  };

  const getStatusBadge = (status: HRRequest['status']) => {
    switch (status) {
      case 'Approved':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle size={12} />
            <span>Approved</span>
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle size={12} />
            <span>Rejected</span>
          </span>
        );
      case 'Pending':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-50 text-orange-700 border border-orange-200 animate-pulse">
            <Clock size={12} />
            <span>Pending Review</span>
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs" id="admin-requests-panel">
      
      {/* Title Header */}
      <div className="bg-[#00175b] px-5 py-4 flex justify-between items-center text-white">
        <div className="flex items-center space-x-2.5">
          <ShieldAlert size={20} className="text-red-400 stroke-[2.5]" />
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider text-white">
              Employee Schedule Request
            </h3>
            <p className="text-[11px] text-blue-200 leading-none">
              Pending review backlog: <span className="font-bold text-white font-mono">{pendingCount} active</span>
            </p>
          </div>
        </div>
        
        {pendingCount > 0 && (
          <span className="bg-red-650 text-white font-extrabold text-[10px] uppercase font-sans tracking-widest px-2.5 py-0.5 rounded-full">
            Action Needed
          </span>
        )}
      </div>

      {/* Main Backlog Split layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-200 min-h-[340px]">
        
        {/* Left: Requests list view */}
        <div className="max-h-[460px] overflow-y-auto divide-y divide-slate-100">
          {requests.length === 0 ? (
            <div className="p-8 text-center text-slate-400 font-medium text-sm">
              No employee leave or shift requests in history.
            </div>
          ) : (
            requests.map((req) => (
              <div
                key={req.id}
                onClick={() => setSelectedRequest(req)}
                className={`p-4 text-xs hover:bg-slate-50 cursor-pointer transition flex flex-col justify-between ${
                  selectedRequest?.id === req.id ? 'bg-red-50/40 border-l-4 border-red-600' : 'bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-black text-slate-900 text-sm tracking-tight">
                    {req.employeeName}
                  </span>
                  {getStatusBadge(req.status)}
                </div>

                <div className="flex items-center space-x-2.5 mb-2.5">
                  <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wide border ${getTypeBadgeColor(req.requestType)}`}>
                    {req.requestType}
                  </span>
                  <span className="font-mono text-slate-500 font-bold text-[10px]">
                    {req.startDate} {req.endDate !== req.startDate ? `to ${req.endDate}` : ''}
                  </span>
                </div>

                <p className="text-slate-600 truncate leading-relaxed">
                  {req.details}
                </p>

                <div className="flex justify-between items-center mt-3 text-[10px] text-slate-400">
                  <span>Submitted: {new Date(req.submittedAt).toLocaleDateString()}</span>
                  <span className="text-red-600 font-bold hover:underline">Click to view details</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right: Detailed active reviewer card */}
        <div className="p-6 bg-slate-50 flex flex-col justify-center">
          {selectedRequest ? (
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-lg border border-slate-200">
                <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-100">
                  <div>
                    <h4 className="text-base font-black text-slate-900 tracking-tight">
                      {selectedRequest.employeeName}
                    </h4>
                    <p className="text-[10px] text-slate-400 font-medium font-mono">
                      Request ID: {selectedRequest.id}
                    </p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-md text-xs font-black uppercase tracking-widest border ${getTypeBadgeColor(selectedRequest.requestType)}`}>
                    {selectedRequest.requestType}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4 text-xs font-medium">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider mb-0.5">Start Date</span>
                    <span className="text-slate-800">{selectedRequest.startDate}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider mb-0.5">End Date</span>
                    <span className="text-slate-800">{selectedRequest.endDate}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider mb-1">Details & Reason</span>
                  <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100 italic leading-relaxed">
                    "{selectedRequest.details}"
                  </p>
                </div>

                {selectedRequest.adminNotes && (
                  <div className="mb-4 text-xs">
                    <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider mb-1">Admin Decision Comments</span>
                    <p className="p-2.5 bg-slate-100 border border-slate-200 rounded text-slate-600">
                      {selectedRequest.adminNotes}
                    </p>
                  </div>
                )}

                {/* Review Action forms */}
                {selectedRequest.status === 'Pending' ? (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
                        Resolution Comments (Required)
                      </label>
                      <textarea
                        value={adminNotes}
                        onChange={(e) => setAdminNotes(e.target.value)}
                        placeholder="Add review feedback for record history..."
                        rows={2}
                        className="w-full text-xs border border-slate-200 rounded-lg p-2.5 bg-white shadow-3xs focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                      />
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAction(selectedRequest.id, 'Approved')}
                        className="flex-1 bg-emerald-600 text-white font-bold py-2 px-3 rounded-lg text-xs hover:bg-emerald-700 transition flex items-center justify-center space-x-1.5 uppercase shadow-2xs"
                      >
                        <Check size={14} className="stroke-[2.5]" />
                        <span>Accept & Update Roster</span>
                      </button>
                      
                      <button
                        onClick={() => handleAction(selectedRequest.id, 'Rejected')}
                        className="flex-1 bg-rose-600 text-white font-bold py-2 px-3 rounded-lg text-xs hover:bg-rose-700 transition flex items-center justify-center space-x-1.5 uppercase shadow-2xs"
                      >
                        <X size={14} className="stroke-[2.5]" />
                        <span>Reject Request</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-center text-xs text-slate-400 font-semibold p-2 border border-slate-100 rounded-lg bg-slate-50/50">
                    Reviewed on {new Date().toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
          ) : (
              <div className="text-center p-6 bg-slate-100 border border-dashed border-slate-200 rounded-xl space-y-2">
                <BadgeInfo size={28} className="text-slate-400 mx-auto" />
                <h5 className="text-xs font-black text-slate-700 uppercase tracking-widest leading-none">
                  Request Roster Inspector
                </h5>
                <p className="text-[11px] text-slate-500 max-w-xs mx-auto leading-normal">
                  Select any active request from the left backlog timeline panel to view full description and record details.
                </p>
              </div>
            )}
          </div>
        </div>

      </div>

  );
}
